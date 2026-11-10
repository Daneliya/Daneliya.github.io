---
url: /数据库/01.MySQL/PawSQL.md
---

# PawSQL 实战指南：企业级 SQL 优化工具与 Spring Boot 集成

> 数据库慢查询是每个后端工程师的噩梦。今天介绍的 PawSQL，能以"零侵入"的方式接入你的 Spring Boot 项目，自动完成 SQL 审核、重写优化和智能索引推荐。**永久免费 + 私有化部署**，让我们一探究竟。

***

## 一、PawSQL 是什么？

PawSQL 是一款专注于**数据库性能优化**的企业级工具，覆盖 SQL 开发、测试、运维全流程。支持 **MySQL、PostgreSQL、Oracle、SQL Server** 以及**达梦、金仓、TDSQL、OceanBase** 等国产数据库。

2025 年 5 月，PawSQL 发布了**社区版（Community Edition）**，核心亮点是：

| 特性 | PawSQL 社区版 | EverSQL 免费版 |
|------|:---:|:---:|
| 每月优化配额 | **600 次** | 1 次 |
| 私有化部署 | ✅ | ❌ |
| 查询重写 | ✅ | ✅ |
| 索引推荐（含冗余检测） | ✅ | 仅推荐 |
| 性能验证 | ✅ | ❌ |
| 价格 | **永久免费** | 付费版 $129/月 |

> 一句话总结：PawSQL 社区版用免费的价格，提供了企业级的 SQL 优化能力，而且数据不出公网，安全可控。

***

## 二、核心功能一览

### 2.1 智能 SQL 优化引擎

PawSQL 自研 SQL 解析器，能在**语法树级别**对 SQL 进行深度优化：

```
原始 SQL（子查询）
  SELECT * FROM users WHERE id IN (SELECT user_id FROM orders WHERE amount > 100)

    ↓ PawSQL 重写优化 ↓

优化后 SQL（JOIN + 索引建议）
  SELECT u.* FROM users u
  INNER JOIN orders o ON u.id = o.user_id
  WHERE o.amount > 100
  -- 建议: CREATE INDEX idx_orders_amount_user ON orders(amount, user_id);
```

关键优化策略包括：

* **谓词下推**：将过滤条件尽量下推到数据源
* **投影下推**：减少不必要的列扫描
* **子查询解关联**：将相关子查询转为 JOIN
* **查询折叠**：合并冗余的嵌套查询

### 2.2 智能索引推荐

独有的多维度索引推荐算法，综合考虑：

* 查询模式与 WHERE 条件
* 表数据分布与统计信息
* 现有索引与冗余检测

能自动合并冗余索引，避免创建过多无用索引浪费存储。

### 2.3 自动化性能验证

每次优化完成后，自动对比优化前后的**执行计划**，并给出可视化的性能基线测试结果，确保优化确实生效。

### 2.4 三种产品形态

| 产品 | 形式 | 适用场景 |
|------|------|----------|
| **PawSQL Cloud** | SaaS 在线平台 | 快速上手，无需部署 |
| **PawSQL Advisor** | IntelliJ/VS Code 插件 | 开发阶段即时优化 |
| **PawSQL Engine** | Docker 独立部署 | 集成到 CI/CD 或自建平台 |

***

## 三、快速部署 PawSQL Engine

### 3.1 环境要求

* Docker 环境
* 最低 4GB 内存、2 核 CPU
* Linux 或 Windows（推荐 Linux 服务器）

### 3.2 部署步骤

```bash
# 1. 拉取社区版镜像
docker pull pawsql/pawsql-ce:latest

# 2. 访问 http://pawsql.com/ce-activate 获取激活码（免费）

# 3. 运行容器
docker run -d --name pawsql-ce \
  -e activation_code=<你的激活码> \
  -e activation_email=<你的邮箱> \
  -e service_url=http://localhost:8080 \
  -p 8080:80 \
  pawsql/pawsql-ce:latest

# 4. 浏览器访问 http://localhost:8080 确认部署成功
```

若需对外网提供服务（如团队共享），将 `service_url` 改为实际 IP 或域名即可。

***

## 四、在 Spring Boot 项目中使用 PawSQL

这是本文的重点。我们将通过 **三种方式** 将 PawSQL 融入到 Spring Boot 开发流程中。

### 4.1 方式一：IDE 插件（开发阶段的"贴身保镖"）

最推荐的方式——直接在 IntelliJ IDEA 中安装 **PawSQL Advisor** 插件。

**安装步骤：**

1. IDEA → `File` → `Settings` → `Plugins`
2. 搜索 **"PawSQL Advisor"**
3. 点击 Install，重启 IDE

**使用流程：**

```
项目目录
├── src/main/resources/
│   └── sql/
│       ├── init-schema.sql      ← 建表语句
│       └── query-user.sql       ← 待优化的查询
```

1. 在项目的 SQL 文件中写好 SQL 语句
2. 右键点击 `sql/` 目录 → **PawSQL Advisor → 优化**
3. 自动生成 `pawTunningSummary.md` 汇总报告
4. 点击报告中的超链接，逐条查看优化建议与执行计划对比

**配置数据库连接：**

插件需要连接你的开发数据库，以便获取表结构和统计信息来做精确的索引推荐。在项目设置中配置：

```
Settings → Tools → PawSQL Advisor → 数据源配置
  - 数据库类型: MySQL 8.0
  - Host: localhost:3306
  - 数据库名: mydb
  - 用户名/密码: root/***
```

**在 Spring Boot 项目中的典型工作流：**

```
编写 MyBatis XML / JPA Repository
        ↓
将 SQL 提取到 .sql 文件（或直接在 IDE 中选中 SQL 文本）
        ↓
右键 → PawSQL Advisor 优化
        ↓
查看优化建议，修改代码中的 SQL
        ↓
重新运行测试，确认性能提升
```

### 4.2 方式二：REST API 集成（代码级自动优化）

PawSQL Engine 提供 **HTTP/JSON REST API**，你可以在 Spring Boot 代码中通过编程方式调用。

#### 4.2.1 添加依赖

```xml
<!-- pom.xml -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
<!-- HTTP 客户端 -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-webflux</artifactId>
</dependency>
```

#### 4.2.2 配置 PawSQL 服务地址

```yaml
# application.yml
pawsql:
  engine:
    base-url: http://localhost:8080
    api-key: ${PAWSQL_API_KEY:}
    connect-timeout: 10s
    read-timeout: 30s
```

```java
// PawSQLProperties.java
@ConfigurationProperties(prefix = "pawsql.engine")
@Validated
public record PawSQLProperties(
    @NotBlank String baseUrl,
    String apiKey,
    Duration connectTimeout,
    Duration readTimeout
) {}
```

#### 4.2.3 封装 PawSQL 客户端

```java
// PawSQLClient.java
@Service
public class PawSQLClient {

    private final WebClient webClient;
    private final PawSQLProperties properties;

    public PawSQLClient(PawSQLProperties properties) {
        this.properties = properties;
        this.webClient = WebClient.builder()
            .baseUrl(properties.baseUrl())
            .defaultHeader("Authorization", "Bearer " + properties.apiKey())
            .defaultHeader("Content-Type", "application/json")
            .build();
    }

    /**
     * 创建 SQL 优化任务
     * @param dbType 数据库类型，如 mysql, postgresql
     * @param schema DDL 建表语句
     * @param sql    待优化的 SQL
     * @return 任务 ID
     */
    public String createOptimizeTask(String dbType, String schema, String sql) {
        Map<String, Object> body = Map.of(
            "dbType", dbType,
            "schema", schema,
            "sql", sql
        );

        return webClient.post()
            .uri("/api/optimize/task")
            .bodyValue(body)
            .retrieve()
            .bodyToMono(Map.class)
            .map(response -> (String) response.get("taskId"))
            .block(properties.readTimeout());
    }

    /**
     * 获取优化结果摘要
     * @param taskId 任务 ID
     * @return 优化建议列表
     */
    public OptimizationSummary getOptimizeSummary(String taskId) {
        return webClient.get()
            .uri("/api/optimize/task/{taskId}/summary", taskId)
            .retrieve()
            .bodyToMono(OptimizationSummary.class)
            .block(properties.readTimeout());
    }
}
```

#### 4.2.4 创建优化服务

```java
// SqlOptimizeService.java
@Service
public class SqlOptimizeService {

    private final PawSQLClient pawsqlClient;
    private final DataSource dataSource;

    public SqlOptimizeService(PawSQLClient pawsqlClient, DataSource dataSource) {
        this.pawsqlClient = pawsqlClient;
        this.dataSource = dataSource;
    }

    /**
     * 优化单条 SQL
     */
    public OptimizationResult optimize(String sql) {
        // 1. 获取当前数据库的 schema 信息
        String schema = extractSchema();

        // 2. 提交优化任务
        String taskId = pawsqlClient.createOptimizeTask("mysql", schema, sql);

        // 3. 轮询获取结果
        OptimizationSummary summary = pollUntilComplete(taskId);

        // 4. 返回优化后的 SQL 和索引建议
        return OptimizationResult.builder()
            .originalSql(sql)
            .optimizedSql(summary.getRewrittenSql())
            .indexSuggestions(summary.getIndexSuggestions())
            .performanceImprovement(summary.getEstimatedImprovement())
            .build();
    }

    private String extractSchema() {
        // 通过 JDBC 获取所有表的 DDL
        StringBuilder schema = new StringBuilder();
        try (Connection conn = dataSource.getConnection()) {
            DatabaseMetaData meta = conn.getMetaData();
            ResultSet tables = meta.getTables(null, null, "%", new String[]{"TABLE"});
            while (tables.next()) {
                String tableName = tables.getString("TABLE_NAME");
                // 拼接 DDL（简化示例，实际可使用 SHOW CREATE TABLE）
                schema.append("-- Table: ").append(tableName).append("\n");
            }
        } catch (SQLException e) {
            throw new RuntimeException("Failed to extract schema", e);
        }
        return schema.toString();
    }

    private OptimizationSummary pollUntilComplete(String taskId) {
        int maxRetries = 30;
        for (int i = 0; i < maxRetries; i++) {
            OptimizationSummary summary = pawsqlClient.getOptimizeSummary(taskId);
            if ("COMPLETED".equals(summary.getStatus())) {
                return summary;
            }
            try {
                Thread.sleep(2000); // 每 2 秒轮询一次
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                break;
            }
        }
        throw new RuntimeException("Optimization task timeout: " + taskId);
    }
}
```

#### 4.2.5 暴露 REST 端点（可选）

```java
// SqlOptimizeController.java
@RestController
@RequestMapping("/api/pawsql")
public class SqlOptimizeController {

    private final SqlOptimizeService optimizeService;

    public SqlOptimizeController(SqlOptimizeService optimizeService) {
        this.optimizeService = optimizeService;
    }

    @PostMapping("/optimize")
    public ResponseEntity<OptimizationResult> optimize(@RequestBody OptimizeRequest request) {
        OptimizationResult result = optimizeService.optimize(request.getSql());
        return ResponseEntity.ok(result);
    }
}
```

### 4.3 方式三：CI/CD 管道集成（自动化质量门禁）

将 PawSQL 集成到 CI/CD 流程中，每次提交代码时**自动审核 SQL 质量**。

#### 4.3.1 Maven 插件配置（概念示例）

```xml
<!-- 在项目根 pom.xml 中 -->
<plugin>
    <groupId>com.pawsql</groupId>
    <artifactId>pawsql-maven-plugin</artifactId>
    <version>1.0.0</version>
    <configuration>
        <engineUrl>${pawsql.engine.url}</engineUrl>
        <apiKey>${pawsql.api.key}</apiKey>
        <sqlDirectories>
            <directory>src/main/resources/mapper</directory>
        </sqlDirectories>
        <failOnViolation>true</failOnViolation>
        <severity>WARNING</severity>
    </configuration>
    <executions>
        <execution>
            <goals><goal>audit</goal></goals>
            <phase>verify</phase>
        </execution>
    </executions>
</plugin>
```

#### 4.3.2 GitHub Actions 集成

```yaml
# .github/workflows/sql-audit.yml
name: SQL Audit with PawSQL

on:
  pull_request:
    paths:
      - '**/*.xml'        # MyBatis XML
      - '**/*.sql'        # SQL 脚本
      - '**/repository/**' # Spring Data JPA

jobs:
  sql-audit:
    runs-on: ubuntu-latest
    services:
      pawsql-engine:
        image: pawsql/pawsql-ce:latest
        env:
          activation_code: ${{ secrets.PAWSQL_ACTIVATION_CODE }}
          activation_email: ${{ secrets.PAWSQL_ACTIVATION_EMAIL }}
        ports:
          - 8080:80

    steps:
      - uses: actions/checkout@v4

      - name: Extract SQL statements
        run: |
          # 从 MyBatis XML 和 JPA 注解中提取 SQL
          ./scripts/extract-sql.sh > all-sql.txt

      - name: Run PawSQL Audit
        run: |
          curl -X POST http://localhost:8080/api/optimize/batch \
            -H "Content-Type: application/json" \
            -d @all-sql.txt \
            -o audit-report.json

      - name: Check audit result
        run: |
          # 如果有严重问题，阻止 PR 合并
          python scripts/check-audit-result.py audit-report.json
```

#### 4.3.3 Spring Boot 测试集成

```java
// SqlQualityTest.java
@SpringBootTest
@TestPropertySource(properties = {
    "pawsql.engine.base-url=http://localhost:8080"
})
class SqlQualityTest {

    @Autowired
    private SqlOptimizeService optimizeService;

    /**
     * 测试所有关键 SQL 的性能质量
     * 如果优化建议评分低于阈值，测试失败
     */
    @Test
    void allCriticalSqlShouldPassQualityGate() {
        List<String> criticalSqls = loadCriticalSqls();

        List<OptimizationResult> results = criticalSqls.stream()
            .map(optimizeService::optimize)
            .toList();

        for (OptimizationResult result : results) {
            assertThat(result.getQualityScore())
                .as("SQL quality check: %s", result.getOriginalSql())
                .isGreaterThanOrEqualTo(80); // 质量分数 ≥ 80
        }
    }

    private List<String> loadCriticalSqls() {
        // 从 MyBatis XML 或 @Query 注解中收集关键 SQL
        return List.of(
            "SELECT * FROM orders WHERE user_id = ? AND status = ?",
            "SELECT u.*, COUNT(o.id) FROM users u LEFT JOIN orders o ON u.id = o.user_id GROUP BY u.id"
        );
    }
}
```

***

## 五、实战案例：优化一个典型的慢查询

以电商系统中常见的"用户订单汇总查询"为例，展示 PawSQL 的实际效果。

### 5.1 原始 SQL

```sql
-- 查询每个用户的订单总额和最近下单时间
SELECT u.id, u.username,
    (SELECT SUM(o.amount) FROM orders o WHERE o.user_id = u.id) AS total_amount,
    (SELECT MAX(o.created_at) FROM orders o WHERE o.user_id = u.id) AS last_order_time
FROM users u
WHERE u.status = 'ACTIVE'
AND (SELECT COUNT(*) FROM orders o WHERE o.user_id = u.id) > 0;
```

### 5.2 PawSQL 优化报告

```
┌─────────────────────────────────────────────────────────┐
│  PawSQL 优化分析报告                                     │
├─────────────────────────────────────────────────────────┤
│  问题 1: 相关子查询 - 每行 users 执行 3 次子查询         │
│  风险等级: 🔴 HIGH                                       │
│  影响: users 表 1万行 → 总共 3万次子查询                 │
│                                                         │
│  建议: 使用 LEFT JOIN + GROUP BY 替代子查询              │
│                                                         │
│  问题 2: 缺失索引                                        │
│  风险等级: 🟡 MEDIUM                                     │
│  建议索引:                                               │
│    CREATE INDEX idx_orders_user_amount                   │
│      ON orders(user_id, amount, created_at);             │
│                                                         │
│  问题 3: SELECT * 扫描全部列                             │
│  风险等级: 🟢 LOW                                        │
│  建议: 只查询需要的列                                     │
└─────────────────────────────────────────────────────────┘
```

### 5.3 优化后的 SQL

```sql
-- PawSQL 重写优化后
SELECT u.id, u.username,
       COALESCE(SUM(o.amount), 0) AS total_amount,
       MAX(o.created_at) AS last_order_time
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.status = 'ACTIVE'
GROUP BY u.id, u.username
HAVING COUNT(o.id) > 0;

-- 建议同时执行:
-- CREATE INDEX idx_orders_user_amount ON orders(user_id, amount, created_at);
```

**性能对比：**

| 指标 | 优化前 | 优化后 | 提升 |
|------|--------|--------|------|
| 扫描行数 | ~150,000 | ~10,000 | **93%↓** |
| 执行时间 | 2.3s | 0.15s | **15x** |
| 临时表使用 | 是 | 否 | - |

***

## 六、Spring Boot 项目中 PawSQL 最佳实践

### 6.1 分层使用策略

```
┌──────────────────────────────────────────────┐
│              开发阶段                          │
│  IntelliJ IDEA + PawSQL Advisor 插件          │
│  → 写 SQL 时即时检查，预防问题产生              │
├──────────────────────────────────────────────┤
│              测试阶段                          │
│  JUnit + PawSQL REST API                     │
│  → 集成测试中自动审核 SQL 质量                  │
├──────────────────────────────────────────────┤
│              CI/CD 阶段                        │
│  GitHub Actions / Jenkins + PawSQL Engine     │
│  → PR 时自动阻挡低质量 SQL 合入主干             │
├──────────────────────────────────────────────┤
│              运维阶段                          │
│  PawSQL Cloud / Engine Web UI                │
│  → 定期巡检生产环境慢查询，持续优化              │
└──────────────────────────────────────────────┘
```

### 6.2 与 MyBatis / JPA 的配合

| 框架 | 推荐做法 |
|------|----------|
| **MyBatis** | 将 XML 中的 SQL 复制到 `.sql` 文件，通过插件批量优化 |
| **Spring Data JPA** | 开启 `spring.jpa.show-sql=true`，收集生成的 SQL 进行优化 |
| **jOOQ** | 开启 SQL 日志输出，将生成的 SQL 送入 PawSQL 审核 |
| **JDBC Template** | 将 SQL 抽取为常量，统一管理和优化 |

### 6.3 注意事项

1. **生产 SQL 不要直接发给公网服务**——PawSQL 社区版支持私有部署，数据不出内网
2. **敏感数据脱敏**——如果 SQL 中包含真实数据值，提交优化前先做参数化处理
3. **配额管理**——社区版每月 600 次优化，合理规划优化频率，建议 CI 中只对变更的 SQL 做检查
4. **索引建议需评估**——PawSQL 的索引建议是基于当前查询模式的，实际创建前需评估对写入性能的影响

***

## 七、总结

PawSQL 社区版以**永久免费 + 私有化部署**的方式，把企业级 SQL 优化能力交到了每个开发者手中。

**核心价值：**

* 🚀 **零门槛**：Docker 一行命令部署，IntelliJ 插件即装即用
* 🔒 **数据安全**：私有化部署，SQL 不传出公网
* 🎯 **精准优化**：语法树级别的查询重写 + 多维度索引推荐
* 🔄 **全流程覆盖**：开发 → 测试 → CI/CD → 运维，一站式 SQL 质量保障
* 💰 **永久免费**：每月 600 次配额，个人和小团队完全够用

**Spring Boot 开发者推荐的接入路径：**

1. **第一步**：安装 PawSQL Advisor IDEA 插件，开发阶段即时优化
2. **第二步**：Docker 部署 PawSQL Engine，团队共享使用
3. **第三步**：封装 REST API 客户端，集成到测试和 CI/CD 流程中

> 官网：https://www.pawsql.com\
> 社区版详情：https://www.pawsql.com/community\
> API 文档：https://www.pawsql.com/docs/zh/api/\
> 参考资料：https://cloud.tencent.com/developer/article/2521820

***

*本文基于 PawSQL 社区版 v1.0 编写，部分 API 接口以官方最新文档为准。*
