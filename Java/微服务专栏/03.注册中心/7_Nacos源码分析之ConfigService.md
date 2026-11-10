---
url: /Java/微服务专栏/03.注册中心/7_Nacos源码分析之ConfigService.md
---

# Nacos 源码分析之 ConfigService

`ConfigService` 是 Nacos 配置中心在客户端侧的统一切口。业务代码通过它拉取配置、发布配置、注册监听，而它背后隐藏了本地缓存、容灾、过滤器、gRPC 通信、批量订阅、变更通知等一整套机制。

本文基于 **Nacos 2.4.x 客户端源码** 分析，Nacos 3.x 的客户端主体结构基本一致，差异会在对应位置单独说明。1.x 使用 HTTP 长轮询，与 2.x/3.x 的 gRPC 方案区别较大，文末会做对比。

## 一、ConfigService 的定位

`ConfigService` 接口定义在 `nacos-api` 模块，实现在 `nacos-client` 模块的 `NacosConfigService`：

```java
public interface ConfigService {

    String getConfig(String dataId, String group, long timeoutMs) throws NacosException;

    String getConfigAndSignListener(String dataId, String group, long timeoutMs,
            Listener listener) throws NacosException;

    void addListener(String dataId, String group, Listener listener) throws NacosException;

    boolean publishConfig(String dataId, String group, String content) throws NacosException;

    boolean publishConfig(String dataId, String group, String content, String type)
            throws NacosException;

    boolean publishConfigCas(String dataId, String group, String content, String casMd5)
            throws NacosException;

    boolean removeConfig(String dataId, String group) throws NacosException;

    void removeListener(String dataId, String group, Listener listener);

    String getServerStatus();

    void addConfigFilter(IConfigFilter configFilter);

    void shutDown() throws NacosException;
}
```

它主要提供五类能力：

| 能力 | 方法 | 说明 |
| --- | --- | --- |
| 读取配置 | `getConfig` | 拉取配置内容，支持超时 |
| 发布配置 | `publishConfig` / `publishConfigCas` | 新增或修改，CAS 版本支持乐观锁 |
| 删除配置 | `removeConfig` | 删除服务端配置 |
| 监听变更 | `addListener` / `removeListener` | 配置变化时回调业务 |
| 状态与扩展 | `getServerStatus` / `addConfigFilter` | 健康状态、自定义过滤器 |

一个典型的使用示例：

```java
Properties properties = new Properties();
properties.put("serverAddr", "127.0.0.1:8848");
properties.put("namespace", "public");

ConfigService configService = NacosFactory.createConfigService(properties);

// 1. 拉取配置
String content = configService.getConfig("order-service.yaml", "DEFAULT_GROUP", 3000);

// 2. 监听变更
configService.addListener("order-service.yaml", "DEFAULT_GROUP", new Listener() {
    @Override
    public Executor getExecutor() {
        // 返回 null 表示在 Nacos 的通知线程中执行
        return null;
    }

    @Override
    public void receiveConfigInfo(String configInfo) {
        System.out.println("配置变更: " + configInfo);
    }
});
```

`Listener` 接口只有两个方法：

```java
public interface Listener {

    Executor getExecutor();

    void receiveConfigInfo(String configInfo);
}
```

`getExecutor()` 决定了回调在哪个线程执行。业务方可以传入自己的线程池，避免耗时逻辑阻塞 Nacos 的监听线程。

***

## 二、整体结构

先看一张简化的调用关系图：

```text
业务代码
   │
   ▼
NacosConfigService（门面）
   │  参数校验、Filter、failover/snapshot 兜底
   ▼
ClientWorker（缓存与监听管理）
   │  cacheMap: Map<groupKey, CacheData>
   │
   ▼
ConfigRpcTransportClient（gRPC 通信）
   │  查询、发布、批量订阅、变更处理
   ▼
RpcClient（gRPC 长连接）
   │
   ▼
Nacos Server
```

核心类职责：

| 类 | 职责 |
| --- | --- |
| `NacosConfigService` | 对外门面，负责参数校验、命名空间、过滤器、本地容灾降级 |
| `ClientWorker` | 管理 `cacheMap`，注册/移除监听，把请求交给传输层 |
| `CacheData` | 单个配置的本地缓存，保存内容、md5 和监听器列表 |
| `ConfigRpcTransportClient` | gRPC 查询、发布、批量监听、变更通知处理 |
| `LocalConfigInfoProcessor` | 读写本地 failover 与 snapshot 文件 |
| `ConfigFilterChainManager` | 配置发布、读取、通知时的过滤器链 |
| `ServerListManager` | 维护服务端地址列表，生成 agentName |

理解这套结构，关键抓住两点：

1. **每个配置在客户端都有一个 `CacheData`**，它既是本地缓存，也是监听器的注册中心；
2. **监听不是每条配置单独发请求**，而是按 `taskId` 分组批量订阅，变更时服务端推送通知，客户端再拉取最新内容。

***

## 三、初始化过程

`NacosConfigService` 的构造器（Nacos 2.4.x）：

```java
public NacosConfigService(Properties properties) throws NacosException {
    PreInitUtils.asyncPreLoadCostComponent();

    final NacosClientProperties clientProperties =
            NacosClientProperties.PROTOTYPE.derive(properties);

    ValidatorUtils.checkInitParam(clientProperties);
    initNamespace(clientProperties);

    this.configFilterChainManager =
            new ConfigFilterChainManager(clientProperties.asProperties());

    ServerListManager serverListManager = new ServerListManager(clientProperties);
    serverListManager.start();

    this.worker = new ClientWorker(configFilterChainManager, serverListManager, clientProperties);
    this.agent = new ServerHttpAgent(serverListManager);
}
```

逐行说明：

1. `PreInitUtils.asyncPreLoadCostComponent()`：异步预热一些耗时的 SPI 组件，减少首次请求的延迟。
2. `derive(properties)`：复制一份客户端属性，避免外部后续修改影响内部状态。
3. `checkInitParam`：校验 `serverAddr` 等必填参数。
4. `initNamespace`：读取并规范化 `namespace`，默认是空字符串（public 命名空间）。
5. `ConfigFilterChainManager`：加载 `IConfigFilter` 的 SPI 实现，后续在读取、发布、通知时执行过滤链。
6. `ServerListManager`：解析 `serverAddr`，维护地址列表，并生成 agentName（形如 `fixed-127.0.0.1-8848`）。agentName 会参与本地 failover/snapshot 路径的拼接。
7. `ClientWorker`：创建 gRPC 传输客户端、初始化 `cacheMap`、启动监听调度线程。
8. `ServerHttpAgent`：2.x 仍保留该对象，主要用于获取 agentName、本地路径等；实际配置请求已经走 gRPC。

`ClientWorker` 的构造过程：

```java
public ClientWorker(final ConfigFilterChainManager configFilterChainManager,
        ServerListManager serverListManager, final NacosClientProperties properties)
        throws NacosException {
    this.configFilterChainManager = configFilterChainManager;
    init(properties);

    agent = new ConfigRpcTransportClient(properties, serverListManager);

    ScheduledExecutorService executorService = Executors.newScheduledThreadPool(
            initWorkerThreadCount(properties),
            new NameThreadFactory("com.alibaba.nacos.client.Worker"));
    agent.setExecutor(executorService);
    agent.start();
}
```

这里创建了一个名为 `com.alibaba.nacos.client.Worker` 的调度线程池，负责执行监听轮询、配置刷新等后台任务。

> **Nacos 3.x 差异**：3.x 的构造器中使用 `ConfigServerListManager`，并且 `NacosConfigService` 不再持有 `ServerHttpAgent`，本地路径统一通过 `worker.getAgentName()` 获取。`ClientWorker`、`CacheData`、`ConfigRpcTransportClient` 的核心设计没有变化。

***

## 四、getConfig 源码流程

### 4.1 三级读取顺序

`getConfig` 最终调用 `getConfigInner`，它的读取顺序非常关键：

```text
getConfig
  └── getConfigInner
        ├── 1. 读本地 failover 文件（优先级最高）
        ├── 2. 请求 Nacos Server
        ├── 3. 读本地 snapshot 快照（服务端不可用时兜底）
        └── 每一步都经过 ConfigFilterChain
```

源码（已省略部分日志和加密 key 处理）：

```java
private String getConfigInner(String tenant, String dataId, String group, long timeoutMs)
        throws NacosException {

    group = blank2defaultGroup(group);
    ParamUtils.checkKeyParam(dataId, group);

    ConfigResponse cr = new ConfigResponse();
    cr.setDataId(dataId);
    cr.setTenant(tenant);
    cr.setGroup(group);

    // 1. 本地 failover：由用户手动维护，优先级最高
    String content = LocalConfigInfoProcessor.getFailover(
            worker.getAgentName(), dataId, group, tenant);

    if (content != null) {
        cr.setContent(content);
        configFilterChainManager.doFilter(null, cr);
        return cr.getContent();
    }

    // 2. 请求服务端
    try {
        ConfigResponse response = worker.getServerConfig(dataId, group, tenant, timeoutMs, false);
        cr.setContent(response.getContent());
        configFilterChainManager.doFilter(null, cr);
        return cr.getContent();
    } catch (NacosException ioe) {
        // 权限问题直接抛出，不降级
        if (NacosException.NO_RIGHT == ioe.getErrCode()) {
            throw ioe;
        }
        LOGGER.warn("[get-config] get from server error, dataId={}, group={}", dataId, group, ioe);
    }

    // 3. 服务端不可用，读取本地快照
    content = LocalConfigInfoProcessor.getSnapshot(
            worker.getAgentName(), dataId, group, tenant);

    cr.setContent(content);
    configFilterChainManager.doFilter(null, cr);
    return cr.getContent();
}
```

几个容易忽略的细节：

* **failover 优先级高于服务端**。failover 文件不由客户端自动创建，而是运维/开发在紧急情况下手动放入的，用于"服务端挂了，但还要临时改配置"的场景。
* **`NO_RIGHT` 不降级**。403 属于权限错误，继续返回旧快照会掩盖问题，所以直接抛出。
* **过滤器在读路径上执行了三次**，分别对应 failover、服务端、snapshot 三条路径。过滤器可以实现配置解密、内容校验等逻辑。
* **snapshot 是最后一次成功拉取的本地副本**，服务端恢复后会被新内容覆盖。

### 4.2 服务端查询

`worker.getServerConfig` 只是转发：

```java
public ConfigResponse getServerConfig(String dataId, String group, String tenant,
        long readTimeout, boolean notify) throws NacosException {
    if (StringUtils.isBlank(group)) {
        group = Constants.DEFAULT_GROUP;
    }
    return this.agent.queryConfig(dataId, group, tenant, readTimeout, notify);
}
```

`ConfigRpcTransportClient.queryConfig` 会选择一个可用的 RPC 客户端，然后调用 `queryConfigInner`：

```text
ClientWorker.getServerConfig
  └── ConfigRpcTransportClient.queryConfig
        ├── getOneRunningClient()        选择可用的 RpcClient
        └── queryConfigInner
              ├── 构造 ConfigQueryRequest
              ├── 通过 gRPC 发送请求
              ├── 解析 ConfigQueryResponse
              └── 写入本地 snapshot
```

`queryConfigInner` 的关键逻辑（简化示意）：

```java
ConfigResponse queryConfigInner(RpcClient rpcClient, String dataId, String group,
        String tenant, long readTimeout, boolean notify) throws NacosException {

    ConfigQueryRequest request = buildConfigQueryRequest(dataId, group, tenant, notify);
    ConfigQueryResponse response =
            (ConfigQueryResponse) requestProxy(rpcClient, request, readTimeout);

    // 配置不存在：清空本地快照，避免读到过期内容
    if (response.getErrorCode() == ConfigQueryResponse.CONFIG_NOT_FOUND) {
        LocalConfigInfoProcessor.saveSnapshot(agent.getName(), dataId, group, tenant, null);
        return new ConfigResponse();
    }

    // 服务端正在变更，返回冲突，由上层决定是否重试
    if (response.getErrorCode() == ConfigQueryResponse.CONFIG_QUERY_CONFLICT) {
        // 处理冲突
    }

    // 查询成功，更新本地快照
    LocalConfigInfoProcessor.saveSnapshot(
            agent.getName(), dataId, group, tenant, response.getContent());

    return response;
}
```

响应码常量：

* `CONFIG_NOT_FOUND = 300`：配置不存在；
* `CONFIG_QUERY_CONFLICT = 400`：查询冲突，通常发生在服务端配置正在变更时。

查询成功后立即写入 snapshot，这是客户端在服务端故障时还能读到"最后一次已知配置"的基础。

***

## 五、publishConfig 源码流程

发布配置的调用链：

```text
NacosConfigService.publishConfig
  ├── 参数校验 ParamUtils.checkParam
  ├── 构造 ConfigRequest
  ├── 执行 ConfigFilterChain
  └── ClientWorker.publishConfig
        └── ConfigRpcTransportClient.publishConfig
              ├── 构造 ConfigPublishRequest
              └── 通过 gRPC 发送到 Server
```

核心代码（简化示意）：

```java
private boolean publishConfig(String dataId, String group, String content,
        String type, String casMd5, String encryptedDataKey) throws NacosException {

    group = blank2defaultGroup(group);
    ParamUtils.checkParam(dataId, group, content);

    ConfigRequest cr = new ConfigRequest();
    cr.setDataId(dataId);
    cr.setGroup(group);
    cr.setContent(content);
    cr.setType(type);
    cr.setEncryptedDataKey(encryptedDataKey);

    // 发布前执行过滤器，例如加密、脱敏、内容校验
    configFilterChainManager.doFilter(cr, null);
    content = cr.getContent();

    return worker.publishConfig(dataId, group, namespace, null, null, null,
            content, cr.getEncryptedDataKey(), casMd5, type);
}
```

`ConfigPublishRequest` 主要携带：

* `dataId`、`group`、`tenant`；
* `content`：配置内容；
* `type`：配置类型（yaml、properties、json 等）；
* `casMd5`：CAS 发布时的期望 md5；
* `encryptedDataKey`：加密配置的数据密钥。

关于 **CAS 发布**（`publishConfigCas`）：

1. 客户端先拿到当前配置的 md5；
2. 发布时把 `casMd5` 一起带给服务端；
3. 服务端比较当前配置的 md5 与 `casMd5`，一致才允许更新。

这相当于数据库的乐观锁，可以避免并发发布互相覆盖。

发布结果由 `ConfigPublishResponse` 返回。注意：`publishConfig` 返回 `false` 只代表业务层面的失败，网络异常、鉴权失败等会以 `NacosException` 抛出。

***

## 六、监听机制（核心）

监听是 Nacos 客户端最复杂的部分，涉及 `CacheData`、批量订阅、gRPC 推送、md5 比对和线程调度。

### 6.1 注册监听

`NacosConfigService.addListener` 直接委托给 `ClientWorker`：

```java
@Override
public void addListener(String dataId, String group, Listener listener)
        throws NacosException {
    worker.addTenantListeners(dataId, group, Collections.singletonList(listener));
}
```

`ClientWorker.addTenantListeners`：

```java
public void addTenantListeners(String dataId, String group,
        List<? extends Listener> listeners) throws NacosException {

    group = blank2defaultGroup(group);
    String tenant = agent.getTenant();

    // 每个配置对应一个 CacheData，不存在则创建
    CacheData cache = addCacheDataIfAbsent(dataId, group, tenant);

    synchronized (cache) {
        for (Listener listener : listeners) {
            cache.addListener(listener);
        }

        cache.setDiscard(false);
        cache.setConsistentWithServer(false);

        if (getCache(dataId, group, tenant) != cache) {
            putCache(GroupKey.getKeyTenant(dataId, group, tenant), cache);
        }

        // 唤醒后台线程，立即发起一次批量订阅
        agent.notifyListenConfig();
    }
}
```

关键对象 `CacheData` 的字段：

| 字段 | 作用 |
| --- | --- |
| `dataId` / `group` / `tenant` | 配置定位信息 |
| `content` | 当前配置内容 |
| `md5` | 当前内容的 md5 |
| `listeners` | `CopyOnWriteArrayList<ManagerListenerWrap>` |
| `consistentWithServer` | 是否已与服务端同步 |
| `discard` | 是否已无监听器、等待移除 |
| `taskId` | 批量订阅的分组 ID |
| `isUseLocalConfigInfo` | 是否正在使用本地 failover |

`ManagerListenerWrap` 包装了业务 `Listener` 和 `lastCallMd5`，`lastCallMd5` 用来判断该监听器上次收到的是哪个版本，避免重复回调。

`CacheData` 以 `dataId + group + tenant` 组成的 groupKey 为键存放在 `cacheMap` 中：

```java
Map<String, CacheData> cacheMap;
```

所以同一个配置在客户端只有一份缓存，多个业务监听器共享。

### 6.2 批量订阅的触发

注册监听后，`notifyListenConfig()` 并不会直接发网络请求，而是往一个容量为 1 的"铃铛"队列里放一个元素：

```java
private final BlockingQueue<Object> listenExecutebell =
        new ArrayBlockingQueue<>(1);
private final Object bellItem = new Object();

public void notifyListenConfig() {
    listenExecutebell.offer(bellItem);
}
```

后台线程循环消费：

```java
executor.schedule(() -> {
    while (!executor.isShutdown() && !executor.isTerminated()) {
        try {
            // 最多等 5 秒，起到兜底轮询的作用
            listenExecutebell.poll(5L, TimeUnit.SECONDS);
            executeConfigListen();
        } catch (Throwable e) {
            LOGGER.error("[rpc listen execute] exception", e);
        }
    }
}, 0L, TimeUnit.MILLISECONDS);
```

这样设计有两个好处：

* 容量为 1，短时间内大量 `addListener` 会被合并成一次批量订阅；
* `poll` 带 5 秒超时，即使没有新事件，也会定期全量检查一次，作为推送丢失的兜底。

`executeConfigListen` 的核心逻辑（简化示意）：

```java
public void executeConfigListen() throws NacosException {
    Map<String, List<CacheData>> listenCachesMap = new HashMap<>();

    for (CacheData cache : cacheMap.get().values()) {
        synchronized (cache) {
            // 检查本地 failover 是否有变化
            checkLocalConfig(cache);

            if (!cache.isConsistentWithServer()) {
                listenCachesMap
                        .computeIfAbsent(cache.getTaskId(), k -> new ArrayList<>())
                        .add(cache);
            }
        }
    }

    for (Map.Entry<String, List<CacheData>> entry : listenCachesMap.entrySet()) {
        String taskId = entry.getKey();
        RpcClient rpcClient = ensureRpcClient(taskId);

        // 把同一 taskId 下的多条配置打包成一个批量订阅请求
        ConfigBatchListenRequest request = buildConfigRequest(entry.getValue());
        request.setListen(true);

        ConfigBatchListenResponse response =
                (ConfigBatchListenResponse) requestProxy(rpcClient, request);

        if (response.getChangedConfigs() != null) {
            for (ConfigContext changed : response.getChangedConfigs()) {
                String groupKey = GroupKey.getKeyTenant(
                        changed.getDataId(), changed.getGroup(), changed.getTenant());
                // 发现变更，拉取最新内容并通知监听器
                refreshContentAndCheck(rpcClient, groupKey, true);
            }
        }
    }
}
```

`ConfigBatchListenRequest` 中的每条 `ConfigListenContext` 包含：

```text
dataId + group + tenant + md5
```

服务端拿客户端上报的 md5 与当前配置比较，只返回发生变化的配置列表。这样一次请求就能同步大量配置，避免"一条配置一个长连接"。

### 6.3 服务端推送

除了客户端主动批量订阅，服务端在配置变更时还会通过 gRPC 主动推送 `ConfigChangeNotifyRequest`。

客户端在 `ConfigRpcTransportClient` 中处理该请求：

```text
Server 配置变更
  └── 推送 ConfigChangeNotifyRequest
        └── Client: handleConfigChangeNotifyRequest
              └── refreshContentAndCheck(groupKey)
                    ├── 发起 ConfigQueryRequest 拉取最新内容
                    └── CacheData.checkListenerMd5()
```

注意：**推送的只是"变更通知"，不直接推送配置内容**。客户端收到通知后，还会再发一次查询请求拉取最新内容。

这样做有几个原因：

* 配置内容可能很大，直接推送会增加服务端和网络压力；
* 查询请求可以保证客户端拿到的是最新版本，避免推送乱序导致内容回退；
* 变更通知只携带 `dataId/group/tenant`，协议更轻量。

这是一种"**推拉结合**"模型：推送负责低延迟感知，拉取负责内容一致性。

### 6.4 通知业务 Listener

拉取到最新内容后，`CacheData` 会更新 `content` 和 `md5`，然后调用 `checkListenerMd5`：

```java
void checkListenerMd5() {
    for (ManagerListenerWrap wrap : listeners) {
        if (!md5.equals(wrap.lastCallMd5)) {
            safeNotifyListener(dataId, group, content, md5, wrap);
        }
    }
}
```

`md5` 是当前配置的摘要，`lastCallMd5` 是该监听器上次收到的摘要。两者不一致，说明这个监听器还没收到新版本，需要回调。

`safeNotifyListener` 的关键逻辑（简化示意）：

```java
private void safeNotifyListener(String dataId, String group, String content,
        String md5, ManagerListenerWrap wrap) {

    // 防止同一个监听器被重入通知
    if (wrap.inNotifying) {
        return;
    }
    wrap.inNotifying = true;

    Runnable job = () -> {
        ClassLoader oldClassLoader = Thread.currentThread().getContextClassLoader();
        try {
            // 使用业务方的类加载器执行回调
            Thread.currentThread().setContextClassLoader(
                    wrap.listener.getClass().getClassLoader());

            // 通知前同样执行过滤器链（例如解密）
            ConfigResponse cr = new ConfigResponse();
            cr.setDataId(dataId);
            cr.setGroup(group);
            cr.setContent(content);
            configFilterChainManager.doFilter(null, cr);

            wrap.listener.receiveConfigInfo(cr.getContent());

            // 回调成功后才更新，失败下次还会重试
            wrap.lastCallMd5 = md5;
        } catch (Throwable t) {
            LOGGER.error("[notify-error] dataId={}, group={}, md5={}", dataId, group, md5, t);
        } finally {
            Thread.currentThread().setContextClassLoader(oldClassLoader);
            wrap.inNotifying = false;
        }
    };

    if (wrap.listener.getExecutor() != null) {
        wrap.listener.getExecutor().execute(job);
    } else {
        job.run();
    }
}
```

这段代码解决了几个问题：

* **去重**：`lastCallMd5` 在回调成功后才更新，保证同一版本不重复通知，失败时下次还能重试；
* **并发保护**：`inNotifying` 防止同一个监听器被重入通知；
* **隔离**：回调异常被捕获，不会影响其他监听器；
* **线程控制**：业务可以通过 `Listener.getExecutor()` 把回调放到自己的线程池，避免阻塞 Nacos 的通知线程；
* **类加载器隔离**：回调前切换为业务类的 ClassLoader，避免在容器/插件环境里出现类加载问题。

### 6.5 getConfigAndSignListener

单独调用 `getConfig` 再调用 `addListener` 存在一个时间窗口：

```text
getConfig 拿到 v1
        ← 这期间服务端变成 v2 →
addListener 注册成功
```

如果 v2 的变更通知在注册之前已经发生，客户端可能错过这次变更。`getConfigAndSignListener` 就是为解决这个问题设计的：

```java
@Override
public String getConfigAndSignListener(String dataId, String group,
        long timeoutMs, Listener listener) throws NacosException {

    String content = getConfig(dataId, group, timeoutMs);
    worker.addTenantListenersWithContent(
            dataId, group, content, null, Collections.singletonList(listener));
    return content;
}
```

`addTenantListenersWithContent` 会先把刚拉到的内容写入 `CacheData`，再注册监听器。这样即使注册期间配置发生了变化，`md5` 对比也会发现差异并触发回调，不会漏掉变更。

***

## 七、本地容灾：failover 与 snapshot

客户端本地有两类文件，作用完全不同：

| 机制 | 来源 | 创建方式 | 优先级 | 用途 |
| --- | --- | --- | --- | --- |
| failover | 人工维护 | 手动创建 | 最高 | 服务端故障时强制使用本地配置 |
| snapshot | 客户端自动保存 | 每次拉取成功后写入 | 最低 | 服务端不可用时读取最后一次成功配置 |

### 7.1 failover

failover 文件位于用户目录下，路径大致为：

```text
${user.home}/nacos/config/fixed-${serverAddr}-${namespace}/data/config-data/${group}/${dataId}
```

有租户时路径中会带有 tenant 目录。agentName 形如 `fixed-127.0.0.1-8848`，由 `ServerListManager` 根据服务端地址生成。

failover 的特点：

* 客户端**不会自动创建**，需要人工放入；
* 读取优先级最高，会覆盖服务端配置；
* 删除 failover 文件后，客户端会恢复使用服务端配置；
* 适合"服务端故障 + 需要紧急改配置"的场景。

### 7.2 snapshot

snapshot 是客户端在每次成功拉取配置后自动保存的本地副本：

```text
${user.home}/nacos/config/snapshot/.../${group}/${dataId}
```

当服务端不可用、网络异常或超时时，`getConfigInner` 会读取 snapshot，保证应用还能拿到"最后一次已知可用"的配置。

注意：snapshot 是**降级数据**，可能已经过期。如果业务不能接受旧配置，需要在业务层判断或监控服务端状态。

### 7.3 加密配置

如果使用了配置加密，`LocalEncryptedDataKeyProcessor` 会同步保存加密数据密钥：

* failover 时读取对应的 failover key；
* snapshot 时读取对应的 snapshot key。

这样即使服务端不可用，客户端仍能解密本地缓存的配置。

***

## 八、1.x 与 2.x/3.x 的差异

| 维度 | 1.x | 2.x / 3.x |
| --- | --- | --- |
| 通信协议 | HTTP | gRPC 长连接 |
| 监听方式 | 客户端长轮询 | 批量订阅 + 服务端推送 |
| 核心类 | `ServerHttpAgent`、`LongPollingService` | `ConfigRpcTransportClient`、`RpcClient` |
| 变更感知 | 轮询响应返回变更 | `ConfigChangeNotifyRequest` 推送 |
| 内容获取 | 轮询响应直接携带 | 收到通知后单独查询 |
| 连接开销 | 配置多时连接数多 | 连接复用，按 taskId 批量 |

### 1.x 的长轮询

1.x 的思路是：

1. 客户端把需要监听的配置和对应 md5 放在 HTTP Header `Listening-Configs` 中；
2. 服务端 `LongPollingService` 不立即返回，而是把请求挂起；
3. 如果 29.5 秒内没有配置变化，服务端返回 304，客户端立即发起下一次长轮询；
4. 如果有配置变化，服务端返回变更的 `dataId/group`，客户端再拉取最新内容并回调监听器。

客户端超时通常设置为 30 秒，服务端略小于客户端，保证连接由服务端先释放，避免客户端一直等待。

这种方案已经能实现"准实时"，但每条配置的监听都依赖 HTTP 连接，配置数量多时连接数和请求数都很可观。

### 2.x/3.x 的改进

2.x 使用 gRPC 之后：

* 一个客户端与服务端之间复用少量长连接；
* 监听请求按 `taskId` 批量合并；
* 服务端可以主动推送变更通知；
* 客户端收到通知后按需拉取内容，避免推送大对象；
* 保留了 5 秒兜底检查和全量同步，防止通知丢失。

Nacos 2.x 服务端仍然为 1.x 客户端保留了 HTTP 长轮询兼容通道，方便老客户端平滑升级。

***

## 九、设计要点与常见面试题

### 1. 为什么 getConfig 要先读 failover，再读服务端，最后读 snapshot？

* failover 是人工干预手段，必须在服务端配置之上，否则无法应急覆盖；
* 服务端是正常情况下的权威数据源；
* snapshot 是服务端不可用时的最后兜底，保证可用性。

顺序体现了"**人工覆盖 > 实时权威 > 本地降级**"的优先级。

### 2. 为什么监听要用 md5？

md5 在这里不是为了安全，而是为了**低成本判断内容是否变化**：

* 服务端只需比较 md5，不用传输完整内容；
* 客户端用 `lastCallMd5` 去重，避免同一版本重复回调；
* 批量订阅时，每条配置只需上报一个 md5。

### 3. 为什么推送通知不直接推送配置内容？

* 配置内容可能很大，推送会放大网络压力；
* 推送可能乱序，直接使用推送内容可能导致版本回退；
* 客户端收到通知后再查询，能拿到服务端当前的最新值，保证最终一致。

### 4. 监听回调在哪个线程执行？

* 如果 `Listener.getExecutor()` 返回线程池，就在业务线程池执行；
* 否则在 Nacos 的监听通知线程执行。

所以监听回调里不要做耗时操作，否则会阻塞其他配置的通知。

### 5. CacheData 什么时候被删除？

当某个配置的最后一个监听器被移除时：

```java
if (cache.getListeners().isEmpty()) {
    cache.setConsistentWithServer(false);
    cache.setDiscard(true);
    agent.removeCache(dataId, group);
}
```

客户端会向服务端发送取消订阅请求，并从 `cacheMap` 中移除该配置。否则监听器越积越多，会造成内存泄漏和无意义的网络请求。

### 6. 服务端配置变更后，客户端多久能感知？

2.x/3.x 正常情况下接近实时：服务端变更后立即推送通知。除此之外还有两层兜底：

* `listenExecutebell.poll(5L, TimeUnit.SECONDS)`：最多 5 秒触发一次检查；
* 定期全量同步：防止推送丢失导致长期不一致。

1.x 则取决于长轮询周期，通常在 30 秒内感知。

### 7. 为什么 403 不降级读 snapshot？

403 表示没有权限，属于配置错误或权限配置问题。如果继续返回旧快照，应用看起来"正常"，但实际已经无法获取最新配置，会掩盖故障。因此 `NO_RIGHT` 直接抛出。

### 8. 为什么需要 getConfigAndSignListener？

`getConfig` 和 `addListener` 是两次独立操作，中间存在时间窗口。如果配置在窗口期发生变化，监听器可能错过通知。`getConfigAndSignListener` 把"读取内容"和"注册监听"合并，并通过预置内容 + md5 对比消除这个竞态。

***

## 十、总结

`ConfigService` 看起来只是几个简单的读写方法，但内部通过分层设计解决了配置中心的几个核心问题：

* **可用性**：failover + snapshot 本地兜底，服务端故障时仍能启动和运行；
* **实时性**：gRPC 推送 + 批量订阅 + 5 秒兜底，兼顾低延迟与可靠性；
* **一致性**：md5 比对、推送通知后拉取内容、CAS 发布；
* **扩展性**：过滤器链支持加密、脱敏、校验等自定义逻辑；
* **资源控制**：每个配置一份 `CacheData`，监听器移除后及时清理。

理解 `NacosConfigService → ClientWorker → CacheData → ConfigRpcTransportClient` 这条主链路，再结合 failover/snapshot 与推送/拉取机制，基本就掌握了 Nacos 配置中心客户端的全貌。

***

## 参考资料

* [Nacos 源码分析之 ConfigService（CSDN）](https://blog.csdn.net/god_86/article/details/106394522)
* [NacosConfigService 2.4.3 源码](https://github.com/alibaba/nacos/blob/2.4.3/client/src/main/java/com/alibaba/nacos/client/config/NacosConfigService.java)
* [ClientWorker 2.4.3 源码](https://github.com/alibaba/nacos/blob/2.4.3/client/src/main/java/com/alibaba/nacos/client/config/impl/ClientWorker.java)
* [CacheData 2.4.3 源码](https://github.com/alibaba/nacos/blob/2.4.3/client/src/main/java/com/alibaba/nacos/client/config/impl/CacheData.java)
* [Nacos 配置中心官方文档](https://nacos.io/docs/latest/guide/user/quick-start/)
