---
url: /AIGC/AI应用开发/01.AI开发指南/SpringBoot开发MCP.md
---
# SpringBoot 业务接口改造为 CLI / MCP / Skill 供 Agent 调用完整方案

## 先理清三者定位

| 类型 | 定位 | 通信方式 |
|------|------|----------|
| **CLI** | 命令行工具，Agent 通过子进程调用二进制/脚本执行业务能力 | 子进程 stdio |
| **MCP** | Model Context Protocol，标准化 AI 工具协议，SpringBoot 实现 MCP Server | Stdio / HTTP-SSE |
| **Skill** | 通用统称，基于 HTTP/MCP/CLI 封装一层工具描述，给 LLM 识别入参/出参/用途 | 封装层（底层 HTTP/MCP/CLI） |

**整体流程**：SpringBoot 原有接口 → 分别封装成 CLI 工具、MCP Server、Agent Skill 三层 → Agent（LLM 客户端）调用。

***

## 一、前置基础：统一标准化 SpringBoot 接口

所有对外能力先统一为**标准 JSON REST 接口**，统一返回格式，方便后续三种模式复用。

### 1.1 标准返回体

```java
@Data
public class ToolResp<T> {
    private Integer code; // 0成功，非0失败
    private String msg;
    private T data;
}
```

### 1.2 示例业务接口

```java
@RestController
@RequestMapping("/api/tool/user")
public class UserToolController {

    // 查询用户信息
    @GetMapping("/get")
    public ToolResp<UserDTO> getUser(@RequestParam Long userId) {
        UserDTO user = userService.getById(userId);
        return new ToolResp<>(0, "success", user);
    }

    // 创建用户
    @PostMapping("/create")
    public ToolResp<Long> createUser(@RequestBody UserCreateReq req) {
        Long id = userService.create(req);
        return new ToolResp<>(0, "ok", id);
    }
}
```

***

## 二、方案1：封装成 CLI 工具（Agent 子进程调用）

### 2.1 两种实现方式

#### 方式A：Picocli 框架（推荐，一套代码复用业务逻辑）

Picocli 让 SpringBoot 同时支持 Web 服务 + 命令行模式，无需重写业务代码。

**依赖：**

```xml
<dependency>
    <groupId>info.picocli</groupId>
    <artifactId>picocli-spring-boot-starter</artifactId>
    <version>4.7.5</version>
</dependency>
```

**命令行指令（复用 Service 业务）：**

```java
/**
 * Picocli CLI 命令：将 SpringBoot 业务能力暴露为命令行工具
 *
 * @Command    - 声明该类是一个 CLI 子命令
 *   name        : 子命令名称，在命令行中通过 "java -jar xxx.jar user-tool ..." 调用
 *   description : 命令用途说明，Agent 可通过 --help 查看
 *
 * @Component  - 注册为 Spring Bean，可使用依赖注入
 * @Option     - 声明命令行参数
 *   names       : 参数名（--action / --userId / --username）
 *   required    : 是否必传
 *   description : 参数说明
 *
 * implements Runnable : Picocli 会在命令触发时自动调用 run()
 */
@Command(name = "user-tool", description = "用户操作工具，供Agent命令行调用")
@Component
public class UserCliCommand implements Runnable {

    @Autowired
    private UserService userService;  // 复用原有业务层，无需重复编码

    // --action 参数：指定执行的操作类型，必填
    @Option(names = "--action", required = true, description = "操作：get/create")
    private String action;

    // --userId 参数：查询用户时传入目标用户ID
    @Option(names = "--userId", description = "用户ID，查询时传入")
    private Long userId;

    // --username 参数：创建用户时传入新用户名
    @Option(names = "--username", description = "创建用户用户名")
    private String username;

    /**
     * 命令执行入口，Picocli 框架自动调用
     * 核心流程：解析参数 → 调用业务 Service → 输出标准 JSON → Agent 解析 stdout
     */
    @Override
    public void run() {
        ToolResp<?> resp;
        switch (action) {
            case "get":
                // 查询用户：调用业务层根据 userId 查询
                UserDTO user = userService.getById(userId);
                resp = new ToolResp<>(0, "success", user);
                break;
            case "create":
                // 创建用户：将 --username 封装为请求对象后调用业务层
                UserCreateReq req = new UserCreateReq();
                req.setUsername(username);
                Long uid = userService.create(req);
                resp = new ToolResp<>(0, "created", uid);
                break;
            default:
                // 不支持的 action，返回错误码
                resp = new ToolResp<>(-1, "不支持的action", null);
        }
        // ☆ 关键：直接输出 JSON 到 stdout
        // Agent 通过子进程捕获 stdout 即可拿到结构化结果，无需额外通信协议
        System.out.println(JSON.toJSONString(resp));
    }
}
```

**命令执行示例：**

```shell
# 1. 查询用户（Agent 会这样拼接命令）
java -jar demo.jar user-tool --action get --userId 1001
# stdout 输出 → {"code":0,"msg":"success","data":{"id":1001,"username":"张三"}}

# 2. 创建用户
java -jar demo.jar user-tool --action create --userId 2001 --username 李四
# stdout 输出 → {"code":0,"msg":"created","data":2001}

# 3. 查看帮助（Picocli 自动生成）
java -jar demo.jar user-tool --help
# 输出所有 @Option 参数说明
```

**Agent 调用伪代码：**

```java
// Agent 内部：启动子进程执行命令，捕获 stdout 后反序列化 JSON
ProcessBuilder pb = new ProcessBuilder(
    "java", "-jar", "demo.jar",
    "user-tool", "--action", "get", "--userId", "1001"
);
Process process = pb.start();
String json = new String(process.getInputStream().readAllBytes());
ToolResp<UserDTO> result = JSON.parseObject(json, ToolResp.class);
```

**打包与运行：**

```shell
mvn clean package -DskipTests

# 运行CLI模式（不启动web服务）
java -jar demo.jar user-tool --action get --userId 1001
# 输出纯JSON给Agent读取
```

#### 方式B：独立 Shell 壳子（轻量）

写 `tool-user.sh`，内部 curl 调用 SpringBoot HTTP 接口：

```bash
#!/bin/bash
# tool-user.sh
ACTION=$1
if [ "$ACTION" = "get" ]; then
    USER_ID=$2
    curl -s http://127.0.0.1:8080/api/tool/user/get?userId=$USER_ID
fi
```

Agent 直接执行：`./tool-user.sh get 1001`

### 2.2 Agent 如何调用 CLI

Agent 内置进程执行能力（LangChain、Spring AI、OpenManus、MCP Client）：

1. Agent 解析工具定义：工具名、入参、执行命令模板
2. 拼接参数生成 shell 命令
3. 创建子进程执行，捕获 stdout
4. 解析 JSON 结果丢回 LLM 继续推理

```java
ProcessBuilder pb = new ProcessBuilder("java", "-jar", "demo.jar",
        "user-tool", "--action", "get", "--userId", "1001");
Process process = pb.start();
String json = new String(process.getInputStream().readAllBytes());
ToolResp<UserDTO> resp = JSON.parseObject(json, ToolResp.class);
```

### 2.3 CLI 优缺点

* **优点**：无网络依赖、本地隔离、简单
* **缺点**：多进程开销、无法长连接、复杂入参传递麻烦、分布式场景不适用

***

## 三、方案2：封装为 MCP Server（主推方案）

### 3.1 MCP 是什么

Model Context Protocol，Anthropic 推出的 **AI 工具统一标准**，替代自定义 HTTP 调用。Agent 统一一套客户端对接所有 MCP Server，支持：

* 工具自动发现、入参校验
* 流式返回、双向通信
* Stdio 传输（内嵌）+ SSE/HTTP 网络传输两种模式

### 3.2 Spring AI MCP 实现

#### 方案A：Spring AI Alibaba MCP（Java 生态原生，推荐）

Spring AI 内置完整 MCP Server/Client，复用现有 Controller/Service，无需重写业务。

**依赖：**

```xml
<dependency>
    <groupId>org.springframework.ai</groupId>
    <artifactId>spring-ai-starter-mcp-server-webmvc</artifactId>
    <version>1.0.0</version>
</dependency>
```

**把原有接口声明为 MCP Tool：**

```java
/**
 * MCP 工具服务：将 SpringBoot 业务接口暴露为 AI Agent 可调用的"工具"
 *
 * @Tool（Spring AI 注解）—— 作用在方法上，核心功能：
 *   1. 将方法注册为 MCP Tool，Agent 通过 list_tools 请求自动发现
 *   2. description 字段会生成工具的 JSON Schema 描述，LLM 据此判断"何时调用该工具"
 *   3. 方法的返回类型自动成为工具的 outputSchema（结构化输出）
 *   4. 启动时 Spring AI 自动扫描所有 @Tool 方法，注册到 MCP Server
 *
 * @ToolParam（Spring AI 注解）—— 作用在方法参数上，核心功能：
 *   1. 为参数生成 inputSchema 中的字段描述，给 LLM 理解"该传什么值"
 *   2. description 必须清晰描述参数含义和格式要求
 *   3. 支持基本类型（String/Long/Integer）和复杂对象（POJO），复杂对象字段自动展开
 *   4. 参数名（如 userId）会自动作为 schema 中的属性名
 */
@Service
public class MyApiToolService {

    @Autowired
    private YourOriginalService yourService;  // 复用原有业务层，零改造

    /**
     * 工具1：查询用户信息
     * - @Tool 的 description 告诉 LLM："当用户问'帮我查某个用户'时，调用这个工具"
     * - @ToolParam 的 description 告诉 LLM："userId 是必传参数，用于指定查询哪个用户"
     */
    @Tool(description = "根据用户ID查询用户详细信息")
    public UserInfo getUserInfo(@ToolParam(description = "用户的唯一ID") String userId) {
        return yourService.findUserById(userId);
    }

    /**
     * 工具2：创建订单
     * - 参数是复杂对象 OrderDetail，Spring AI 自动将其字段展开为嵌套 JSON Schema
     * - LLM 会根据 @ToolParam 的 description 从对话上下文中提取订单信息
     */
    @Tool(description = "创建新的订单")
    public String createOrder(@ToolParam(description = "订单详情，包含商品列表、收货地址等") OrderDetail detail) {
        return yourService.createNewOrder(detail);
    }
}
```

**`@Tool` 和 `@ToolParam` 核心机制图解：**

```
@Tool(description = "...")  ──→  MCP list_tools 响应中的工具描述
                                   LLM 据此判断"用户意图是否匹配该工具"
                                   
@ToolParam(description = "...") ──→  工具的 inputSchema 参数说明
                                     LLM 据此从对话中提取参数值

方法返回值类型  ──→  工具的 outputSchema
                    告诉 LLM "返回数据的结构是什么"
```

**Agent 看到的工具 Schema 示例（自动生成）：**

```json
{
  "name": "getUserInfo",
  "description": "根据用户ID查询用户详细信息",
  "inputSchema": {
    "type": "object",
    "properties": {
      "userId": {
        "type": "string",
        "description": "用户的唯一ID"
      }
    },
    "required": ["userId"]
  }
}
```

**启动 MCP Server 两种模式：**

1. **Stdio 模式**（本地 Agent 子进程调用，和 CLI 类似）

```yaml
spring:
  ai:
    mcp:
      server:
        enabled: true
        transport: stdio
```

Agent 启动子进程运行 jar，通过 IO 交互 MCP 协议。

2. **HTTP SSE 模式**（远程 Agent 网络调用，分布式）

```yaml
spring:
  ai:
    mcp:
      server:
        enabled: true
        transport: sse
        endpoint: /mcp
```

Agent 通过 `http://ip:port/mcp` 连接服务，远程调用所有工具。

#### 方案B：独立 MCP Java SDK（原生 MCP 实现）

引入官方 mcp-sdk，手动构建 MCP Server，注册 SpringBoot Service 作为工具。

### 3.3 Agent 调用 MCP 流程

1. Agent（MCP Client）建立连接（stdio/SSE/http）
2. Client 发送 `list_tools` 请求，自动拉取所有工具名称、描述、参数 JSON Schema
3. LLM 判断需要调用工具，生成结构化参数
4. Client 发送 `call_tool` 请求携带参数
5. MCP Server 转发到 SpringBoot Service 执行业务，返回结构化结果
6. 结果回传给 LLM 整合回答

### 3.4 Agent 客户端调用示例

```java
// 连接远程SpringBoot MCP服务
McpClient client = McpClient.builder()
        .sse("http://127.0.0.1:8080/mcp")
        .build();

// 将MCP所有工具注册给LLM
List<ToolCallback> tools = client.listTools().stream()
        .map(McpToolCallback::new)
        .collect(Collectors.toList());

// LLM自动选择调用MCP里的工具
ChatResponse resp = chatClient.prompt()
        .tools(tools)
        .user("帮我查询ID为1001的用户信息")
        .call();

System.out.println(resp.getContent());
```

### 3.5 MCP 优势

* 行业标准，Claude、Spring AI、LangChain、各类自研 Agent 全部兼容
* 自动工具描述、参数校验、结构化输出
* 支持本地进程、远程网络两种部署
* 可流式返回大结果，支持文件读写、长任务

***

## 四、方案3：封装成 Agent Skill（技能层）

Skill 不是独立协议，是**工具元数据封装层**，CLI/MCP/HTTP 底层能力统一包装成 LLM 能看懂的技能定义。

### 4.1 HTTP Skill（最通用）

基于原有 SpringBoot HTTP 接口，编写 Skill 元数据 JSON：

```json
{
  "skillName": "user_query",
  "description": "根据用户ID查询用户信息",
  "requestMethod": "GET",
  "url": "http://127.0.0.1:8080/api/tool/user/get",
  "params": [
    {
      "name": "userId",
      "type": "long",
      "required": true,
      "desc": "用户唯一标识ID"
    }
  ],
  "responseSchema": "ToolResp<UserDTO>"
}
```

Agent 加载这份 Skill 配置，自动拼接 HTTP 请求调用 SpringBoot 接口。

### 4.2 MCP Skill

MCP 天然自带 Skill 元数据（`list_tools` 返回的 schema），无需手动写配置，开箱即用。

### 4.3 CLI Skill

配置命令模板作为 Skill：

```json
{
  "skillName": "user_query_cli",
  "type": "cli",
  "commandTemplate": "java -jar demo.jar user-tool --action get --userId {{userId}}",
  "params": [{"name": "userId", "type": "long"}]
}
```

### 4.4 Skill 在 Agent 中的作用

1. 给 LLM 提供工具语义描述，让大模型知道什么时候该调用
2. 统一适配层，底层切换 HTTP/CLI/MCP 上层 Agent 代码不用改
3. 支持技能开关、权限控制、调用限流、日志埋点

***

## 五、三方案选型对比

| 类型 | 通信方式 | 适用场景 | 部署方式 | Agent 接入成本 |
|------|----------|----------|----------|----------------|
| **CLI** | 子进程 stdio | 本地单机、简单工具、无网络 | 可执行 jar/sh 脚本 | 中，需要管理进程 |
| **MCP** | Stdio / HTTP-SSE | 通用 AI Agent、远程分布式、标准化 | SpringBoot 内嵌服务 | 极低，标准协议自动发现工具 |
| **Skill** | 封装层（底层 HTTP/MCP/CLI） | 自研 Agent、多工具统一管理 | 配置文件 + SpringBoot 接口 | 低，仅需配置元数据 |

### 生产推荐架构

```
SpringBoot 业务服务（原始接口+Service）
 ├─ MCP SSE Server（远程Agent调用，主方案）
 ├─ MCP Stdio CLI 打包（本地单机Agent备用）
 └─ Skill 配置中心（统一管理所有工具描述，供Agent加载）
```

***

## 六、实战案例：多租户 AI 客服实现个人工作数据统计

### 6.1 业务场景

用户通过 AI 客服说"帮我统计工作数据（上过课程数量，参加的活动数量等）"，系统 AI 返回不同类别的统计数量，需要区分租户和用户。

### 6.2 整体架构

```
前端用户对话 → AI客服聊天接口（携带tenantId、userId）
  ↓ 1. 存入租户上下文 + 注入工具列表给大模型
  ↓ 2. LLM识别意图：需要统计课程/活动数据 → 自动调用后端统计工具
  ↓ 3. 统计工具自动从上下文读取租户+用户，执行分租户隔离查询
  ↓ 4. 结构化统计结果回传给大模型
  ↓ 5. LLM润色成自然语言回复用户
```

**核心关键点：**

1. 租户、用户身份全程透传，**不允许前端传参指定租户/用户**，防止越权
2. 所有统计 SQL 强制带租户过滤，底层拦截器兜底隔离
3. 统计能力封装为 AI 工具（Tool），无需硬编码问答规则，自然语言即可触发
4. 区分普通用户（仅查自己）、租户管理员（查本租户全员）两套工具

### 6.3 核心一：多租户底层隔离

* **上下文管理**：创建一个 `TenantContext` 类，使用 `ThreadLocal` 存储当前请求的租户ID和用户ID，保证线程安全。
* **请求拦截**：通过 Spring 的 `Filter` 或 `Interceptor`，在请求到达时解析出租户和用户信息，并设置到 `TenantContext` 中。
* **数据查询**：在所有查询数据库的方法中，必须强制带上 `tenant_id` 和 `user_id` 作为过滤条件。
* **AI服务调用**：在调用大模型时，同样将租户和用户信息作为上下文（System Prompt）的一部分传递给AI，让它知道在为谁服务。

#### 统一租户上下文（ThreadLocal）

所有接口、AI 工具、Mapper 共用一套上下文，自动携带身份：

```java
public class TenantUserContext {
    private static final ThreadLocal<Long> TENANT_ID = new ThreadLocal<>();
    private static final ThreadLocal<Long> LOGIN_USER_ID = new ThreadLocal<>();
    private static final ThreadLocal<String> USER_ROLE = new ThreadLocal<>(); // user/admin

    public static void set(Long tenantId, Long userId, String role) {
        TENANT_ID.set(tenantId);
        LOGIN_USER_ID.set(userId);
        USER_ROLE.set(role);
    }

    public static Long getTenantId() { return TENANT_ID.get(); }
    public static Long getLoginUserId() { return LOGIN_USER_ID.get(); }
    public static String getRole() { return USER_ROLE.get(); }

    // finally 必须调用，防止线程池复用串数据
    public static void clear() {
        TENANT_ID.remove();
        LOGIN_USER_ID.remove();
        USER_ROLE.remove();
    }
}
```

#### 数据库层租户自动过滤（Mybatis-Plus 拦截器兜底）

课程记录表、活动参与表均存在 `tenant_id` 字段，查询自动拼接条件：

```java
@Component
public class TenantSqlInterceptor implements InnerInterceptor {
    @Override
    public void beforeQuery(Executor executor, MappedStatement ms,
            Object parameter, RowBounds rowBounds, ResultHandler resultHandler, BoundSql boundSql) {
        Long tenantId = TenantUserContext.getTenantId();
        if (tenantId == null) return;
        String originSql = boundSql.getSql().trim();
        List<String> tableList = Arrays.asList("course_record", "activity_join");
        boolean needFilter = tableList.stream().anyMatch(originSql::contains);
        if (needFilter) {
            String newSql = originSql + " AND tenant_id = #{tenantId}";
            Map<String, Object> params = (Map) parameter;
            params.put("tenantId", tenantId);
            MetaObject meta = SystemMetaObject.forObject(boundSql);
            meta.setValue("sql", newSql);
        }
    }
}
```

#### 统计返回统一 DTO

```java
@Data
public class PersonalWorkStatDTO {
    // 课程统计
    private Long totalSignCourse;   // 报名总课程数
    private Long finishedCourse;    // 已完成课程
    private Long unFinishCourse;    // 未完成课程

    // 活动统计
    private Long joinActivityTotal; // 参与活动总数
    private Long awardActivity;     // 获奖活动数量

    private Long tenantId;
    private Long userId;
}
```

### 6.4 核心二：业务统计 Service（纯业务逻辑，无 AI 耦合）

```java
@Service
public class WorkStatService {
    @Autowired
    private CourseRecordMapper courseRecordMapper;
    @Autowired
    private ActivityJoinMapper activityJoinMapper;

    /** 查询当前登录用户个人工作统计数据 */
    public PersonalWorkStatDTO getPersonalStat() {
        Long tenantId = TenantUserContext.getTenantId();
        Long userId = TenantUserContext.getLoginUserId();
        if (tenantId == null || userId == null) {
            throw new RuntimeException("身份信息缺失，无法统计数据");
        }
        PersonalWorkStatDTO stat = new PersonalWorkStatDTO();
        stat.setTenantId(tenantId);
        stat.setUserId(userId);

        stat.setTotalSignCourse(courseRecordMapper.countUserSign(userId));
        stat.setFinishedCourse(courseRecordMapper.countUserFinish(userId));
        stat.setUnFinishCourse(stat.getTotalSignCourse() - stat.getFinishedCourse());

        stat.setJoinActivityTotal(activityJoinMapper.countUserJoin(userId));
        stat.setAwardActivity(activityJoinMapper.countUserAward(userId));
        return stat;
    }

    /** 管理员专用：查询本租户全部用户汇总统计 */
    public Object getTenantAllStat() {
        if (!"admin".equals(TenantUserContext.getRole())) {
            throw new RuntimeException("无权限查看租户整体数据");
        }
        Long tenantId = TenantUserContext.getTenantId();
        // ... 实现租户维度统计逻辑
    }
}
```

### 6.5 核心三：封装为 AI 工具（Spring AI @Tool）

把统计方法注册给大模型，用户说「统计我的数据」时，LLM 自动触发该工具，**无需前端传任何参数，自动读取上下文中的租户和用户信息**。

```java
@Component
public class StatAiTool {
    @Autowired
    private WorkStatService workStatService;

    /** AI工具：查询当前用户个人课程、活动工作统计 */
    @Tool(description = "用户需要统计自己学习、工作数据时调用，" +
        "可查询该用户所属租户内报名课程总数、已完成课程、未完成课程、参与活动总数、获奖活动数量。" +
        "无需传入任何参数，自动获取当前登录用户身份")
    public PersonalWorkStatDTO queryMyWorkData() {
        return workStatService.getPersonalStat();
    }

    /** 管理员专属工具，仅租户管理员角色可触发 */
    @Tool(description = "租户管理员使用，查询整个租户所有用户课程、活动汇总数据，普通用户禁止调用")
    public Object queryTenantTotalData() {
        return workStatService.getTenantAllStat();
    }
}
```

### 6.6 核心四：AI 客服聊天接口（串联全流程）

```java
@Data
public class ChatReq {
    private Long tenantId;   // 前端登录后固定携带
    private Long userId;     // 当前登录用户ID
    private String userRole; // user / admin
    private String message;  // 用户提问文本
}

@RestController
@RequestMapping("/ai/customer/chat")
public class AiCustomerController {
    @Autowired
    private ChatClient chatClient;
    @Autowired
    private List<ToolCallback> allToolCallbacks; // 自动注入所有@Tool工具

    @PostMapping("/send")
    public String chat(@RequestBody ChatReq req) {
        // 1. 存入全局租户用户上下文
        TenantUserContext.set(req.getTenantId(), req.getUserId(), req.getUserRole());
        try {
            // 2. 大模型对话，绑定所有统计工具
            ChatResponse response = chatClient.prompt()
                    .tools(allToolCallbacks)
                    .user(req.getMessage())
                    .call();
            // 3. 返回大模型整理后的自然语言
            return response.getContent();
        } finally {
            // 清空ThreadLocal，避免线程池数据串号
            TenantUserContext.clear();
        }
    }
}
```

### 6.7 完整对话运行示例

**用户请求：**

```json
{
  "tenantId": 1002,
  "userId": 50012,
  "userRole": "user",
  "message": "帮我统计一下我的工作数据，上过多少课，参加了多少活动"
}
```

**内部执行流程：**

1. 接口存入上下文：tenantId=1002，userId=50012
2. LLM 解析用户需求，匹配工具 `queryMyWorkData`，自动执行
3. Service 读取上下文，执行带租户隔离 SQL，返回结构化数据：

```json
{
  "totalSignCourse": 20,
  "finishedCourse": 14,
  "unFinishCourse": 6,
  "joinActivityTotal": 9,
  "awardActivity": 2,
  "tenantId": 1002,
  "userId": 50012
}
```

4. 大模型自动格式化自然语言回复：

> 已为你统计当前租户下个人学习与活动数据：
>
> 1. 课程统计：共报名 20 门课程，已完成 14 门，剩余 6 门未完成；
> 2. 活动统计：累计参与 9 场活动，其中 2 场获获奖项。

***

## 七、进阶方案：Text-to-SQL（AI 问数）

如果未来的统计需求非常灵活多变，可以让 AI 直接根据问题生成 SQL 并查询。

* **核心思想**：将数据库表结构（Schema）、字段注释、示例 SQL 等作为"上下文"提前注入给 AI。用户提问时，AI 基于这些信息生成 SQL，系统对 SQL 进行安全校验后执行。
* **安全考量**：此方案风险较高，必须对生成的 SQL 进行严格的**安全熔断**和**权限验证**，防止数据泄露或系统被破坏。

***

## 八、生产环境安全 & 优化

### 8.1 权限安全

1. **越权防护**：禁止前端传入 userId/tenantId 作为统计参数，统一从登录态上下文读取；普通用户工具内部强制校验 `userId` 和登录人一致
2. **权限隔离**：`queryTenantTotalData` 管理员工具，大模型会根据 role 自动判断是否允许调用
3. **敏感信息脱敏**：AI 返回最终结果前，对手机号、身份证等敏感字段进行脱敏处理
4. **工具权限校验**：所有工具调用增加 token/签名校验，MCP 支持 header 鉴权，CLI 增加密钥参数

### 8.2 性能优化

1. **缓存**：统计结果存入 Redis，key：`stat:personal:{tenantId}:{userId}`，缓存 5 分钟
2. **限流熔断**：SpringBoot 接口增加 Sentinel/Gateway 限流，防止 Agent 高频调用打垮服务

### 8.3 运维保障

1. **日志追踪**：每次工具调用生成 traceId，串联 Agent 请求、MCP/CLI 执行、业务接口日志，方便数据泄露排查
2. **异常兜底**：统计查询异常时，大模型统一回复「数据统计暂时失败，请稍后重试」，不抛出数据库原始错误给用户

### 8.4 部署建议

* 远程 Agent 优先 **MCP-SSE**
* 单机本地 Agent 用 **MCP-stdio** 或 CLI Jar
* 复杂 POST 结构体优先 MCP/HTTP Skill，CLI 不适合多层嵌套 JSON
* 长任务使用 MCP SSE 流式返回，CLI 不适合耗时任务

***

## 九、整体优势总结

1. **低耦合**：统计业务、AI 对话、租户隔离三层完全拆分
2. **高灵活**：后续新增统计项（考试、签到、积分），仅新增 Tool 工具即可，不用修改对话逻辑
3. **租户安全**：双层隔离（代码层上下文 + SQL 拦截器），杜绝跨租户数据泄露
4. **自然交互**：无需配置问答关键词，用户任意口语化描述统计需求均可识别
