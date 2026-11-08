---
url: /Java/架构设计/分布式/06.分布式监控/2_Prometheus.md
---

# Prometheus

## 一、前言

ARMS 可以实现系统级的监控，这种方式简单高效，适合快速获得全面的监控能力。但 ARMS 主要关注通用的系统指标，如果我们想监控业务特有的指标，比如大模型的 Token 使用量、用户的活跃度等，就需要自定义的监控方案。

回到最初的几个核心问题，都需要我们自己来考虑了：

1. 统计什么？监控 AI 模型调用相关的业务指标
2. 如何收集？通过在代码中埋点的方式主动收集数据。
3. 如何存储？使用 Prometheus 时序数据库存储指标数据。
4. 如何展示？通过 Grafana 构建可视化监控仪表板。

下面我们进入方案设计阶段，依次对这几个问题进行展开。

### 监控指标设计

首先我们需要明确要监控哪些维度和业务指标。根据 [LangChain4j 可观测性文档](https://docs.langchain4j.dev/tutorials/observability)，我们可以获取到以下数据：

#### 维度

* 用户 ID
* 应用 ID
* 模型名称
* 最大输出 Token 数（maxOutputTokens）
* AI 回复消息内容
* 模型生成停止的原因（Finish Reason）
* 调用状态（成功或失败）
* 请求时间
* 调用失败时的错误信息

#### 指标

* 输入 Token 数量
* 输出 Token 数量
* 总消耗 Token 数量
* 响应时长

#### 分析能力

有了上面这些数据，我们能够进行很多分析：

* 模型调用分析：统计不同时间窗口（分钟/小时/天）内各模型、用户、应用的调用次数趋势
* 模型性能分析：分析各模型的平均响应时间，以及响应时间分布的 P50/P90/P95/P99 百分位数
* Token 消耗分析：监控不同时间窗口（分钟/小时/天）内输入 Token、输出 Token、总 Token 的消耗
* 热门应用排行：按调用次数对应用进行排序，识别调用 AI 最频繁的应用
* 用户活跃排行：按调用次数对用户进行排序，识别调用 AI 最频繁的用户
* 应用 Token 消耗排行：按 Token 消耗量对应用进行排序，识别消耗最高的应用
* 用户 Token 消耗排行：按 Token 消耗量用户进行排序，识别消耗最高的用户
* 错误分析：统计各模型的失败次数，以及不同错误类型的分布占比

### 数据收集方式

在业务监控中，数据收集需要开发者手动埋点，因为只有业务开发者才知道要收集什么信息、从哪里收集、什么时候收集。

跟业界主流的可观测性实现方案一样，我们的策略是在业务层收集 **最原始、最细粒度** 的数据，这样在查询层就能进行灵活的聚合分析。

## 二、数据存储方案 - Prometheus

> 官网：[Prometheus - Monitoring system & time series database](https://prometheus.io/)
>
> 源码：https://github.com/prometheus/prometheus

即使没有学过 Prometheus，也应该知道可以通过数据库存储的方式实现监控统计。

比如将监控数据存储到 MySQL 等关系型数据库中（或者 Elasticsearch），之后从数据库中读取。适合需要持久化保存详细数据的场景，而且比较灵活，可以自己写 SQL 实现复杂的查询和关联分析。

但缺点是收集监控数据可能会比较频繁，需要频繁写入数据库，容易对应用性能产生影响。

因此，专业的事情交给专业的中间件来做吧！

### 什么是 Prometheus？

[Prometheus](https://prometheus.io/docs/introduction/overview/) 是一个开源的服务监控系统和时间序列数据库，专门为时序数据的收集、存储和查询而设计。

Prometheus 的核心理念是将所有监控数据以 **时间序列** 的形式存储。根据它的 [数据模型](https://prometheus.io/docs/concepts/data_model/)，每个时间序列都由指标名称和一组标签唯一标识。比如 `http_requests_total{method="POST", handler="/api/xxl/ai"}` 就表示一个记录 POST 请求接口总数的时间序列。

这样一来，Prometheus 能够高效地处理监控场景中的时间范围查询，比如过去一小时内各个接口的平均响应时间、CPU 使用率超过 80% 的服务器列表等。

特性：

* 高维度数据模型
* 自定义查询语言
* 可视化数据展示
* 高效的存储策略
* 易于运维
* 提供各种客户端开发库
* 警告和报警
* 数据导出

### 核心组件架构

Prometheus 包含几个关键组件，职责明确：

1）**Prometheus Server（核心引擎）**：整个系统的核心，负责数据收集、存储和查询。它定期从配置的目标 **拉取** 指标数据，将数据存储在本地的时序数据库中，并提供 PromQL 查询语言来支持复杂的数据分析。

* **数据抓取**：定期从配置的 Targets 或 Exporters 拉取 */metrics* 数据。
* **存储**：将时序数据写入内置 TSDB（按 2 小时 block 存储，支持 WAL）。
* **查询**：内置 PromQL 引擎，支持复杂聚合与分析。
* **告警**：基于 PromQL 规则触发告警并推送至 Alertmanager。

2）**Exporter（指标采集器）**：翻译器，将第三方系统（如数据库、操作系统、消息队列等）的指标转换为 Prometheus 格式。比如 Node Exporter 可以收集 Linux 系统的 CPU、内存、磁盘等指标，MySQL Exporter 可以收集数据库的性能指标。

* **节点级**：Node Exporter（CPU、内存、磁盘等）。
* **数据库**：MySQL Exporter、Redis Exporter。
* **中间件**：Nginx Exporter、Kafka Exporter。
* **黑盒探测**：Blackbox Exporter（HTTP、TCP、ICMP探测）。

3）**Alertmanager（告警管理器）** ：理告警规则和通知分发。当指标触发预设的告警条件时，它负责将告警信息发送给相应的人员或系统，支持邮件等多种通知方式。接收 Prometheus Server 推送的告警，执行**去重、分组、静默、抑制**，并路由到邮件、Slack、Webhook 等通知渠道。

4）**Client Libraries（客户端库）** ：提供各种编程语言的 SDK，用于在自研应用中埋点并暴露自定义指标，支持 Go、Java、Python、Ruby 等语言。

5）**Pushgateway（推送网关）** 适用于**短生命周期任务**（如 CronJob），允许任务结束前将指标 Push 到 Pushgateway，由 Server 再 Pull 获取。

6）**Grafana（可选可视化）** 虽然 Prometheus 自带 Web UI，但 Grafana 提供更强大的仪表盘功能，是可视化的标准选择。

![img](2_Prometheus.assets/v2-deada13263aaf9b4e16dc560fd0ccebb_1440w.jpg)

### 数据收集原理

Prometheus 采用 **拉取模式** 来收集指标数据，而不是由项目主动推送数据，这是它的核心特征。

它会定期向配置的目标发起 HTTP 请求，从 `/metrics` 端点获取指标数据。

拉模式的好处是：

* 简单可靠：基于标准 HTTP 协议，无需复杂的消息队列或特殊的网络配置
* 监控目标的发现和管理更加灵活：Prometheus 可以通过服务发现机制自动发现新的监控目标。而且将监控的控制权交给 Prometheus，可以避免目标服务的监控数据推送失败影响业务逻辑。

我们可以通过 [Jobs 和 Instances](https://prometheus.io/docs/concepts/jobs_instances/) 配置需要拉取的数据任务和服务实例，当 Prometheus 抓取目标时，会自动为每个时间序列添加 `job` 和 `instance` 标签来标识数据来源。同时还会生成一些元指标，比如 `up` 指标表示目标是否可达，`scrape_duration_seconds` 记录抓取耗时，这些信息对于监控系统自身的健康检查非常有用。

### 指标类型

如果想在项目中自定义指标收集，需要先了解 Prometheus 的 4 种核心 [指标类型](https://prometheus.io/docs/concepts/metric_types/)，每种类型都针对不同的监控场景进行了优化。

1）Counter：累积计数器，只能增加或重置为零，适合统计请求总数、错误次数等单调递增的指标。在我们的 AI 监控场景中，`ai_model_requests_total` 大模型请求总数就是一个典型的 Counter 指标。

2）Gauge：仪表盘类型，数值可以任意上下波动，适合记录当前状态值，比如内存使用量、当前在线用户数、队列长度等。

3）Histogram：直方图类型，用于观察数据分布情况，比如请求响应时间的分布。它会自动生成多个时间序列，包括各个桶的计数、总和以及总数，可以用来计算百分位数等统计指标。

4）Summary：和 Histogram 类似，但它在客户端预先计算百分位数，适合需要精确百分位数计算但对网络传输有要求的场景。

通过合理选择指标类型，我们可以用最小的存储开销获得最大的监控价值。

### 存储机制

提到拉模式，可能会有朋友误以为 Prometheus 不存储数据，实际上它拥有自己的高性能时间序列数据库 [TSDB](https://prometheus.io/docs/prometheus/latest/storage/)，单节点就能处理数百万个时间序列，满足大部分企业的监控需求。

新写入的数据首先存储在内存中，达到时间阈值（每 2 小时一个数据块）后批量写入磁盘，这种设计在保证查询性能的同时也提供了良好的写入吞吐量。预写日志 WAL 机制确保了数据的可靠性，即使系统崩溃也不会丢失数据。

![img](2_Prometheus.assets/NuWNujC70caqIZJ3.webp)

### 和传统方案的对比

回到我们的业务监控需求，可以利用 Prometheus 提供的 Counter 等指标类型，轻松统计 AI 模型的调用次数、响应时间、Token 消耗等关键指标。因为只是在内存中进行简单的数字递增统计，所以性能比数据库高很多。

具体的对比表格：

| 对比维度 | 数据库方案                        | Prometheus 方案                      |
| -------- | --------------------------------- | ------------------------------------ |
| 核心用途 | 审计、深度分析、事后追溯          | 实时监控、性能分析、告警             |
| 数据粒度 | 极高：记录每个请求的全部细节      | 聚合：只记录统计值，丢失个体请求细节 |
| 性能影响 | 较高：每次请求都需要数据库写入    | 极低：只是内存中的原子操作           |
| 实时性   | 差：从海量数据中实时聚合计算很慢  | 极好：预聚合数据，查询极快           |
| 存储成本 | 非常高：与请求量成正比            | 非常低：与指标基数成正比             |

因此，我们肯定是选择 Prometheus 方案，不仅是因为它更适合实时监控分析的需求，而且它和 Grafana 也能轻松整合，开发成本也很低。

## 三、数据可视化 - Grafana

### 什么是 Grafana？

[Grafana](https://grafana.com/) 是一个开源的数据可视化平台，专门用于创建监控看板。它可以连接多种数据源（包括 Prometheus、MySQL、PostgreSQL、Elasticsearch 等），并提供丰富的图表类型和可视化选项。

![img](2_Prometheus.assets/44cqjd2s4a.png)

虽然 Grafana 是一个功能非常丰富的企业级产品，拥有告警管理、用户权限控制、插件生态、云服务集成等高级特性，但对于我们目前的需求来说，将它当作一个看板工具来使用，知道怎么创建看板和接入数据进行展示就足够了。

## 四、环境准备

### Prometheus 安装

1）访问 [Prometheus 下载页面](https://prometheus.io/download/)，选择对应的操作系统和架构：

![image-20260112000054521](2_Prometheus.assets/image-20260112000054521.png)

2）下载并解压到不包含中文路径的目录。

3）查看默认配置文件 `prometheus.yml`：

```yaml
# 全局配置
global:
  scrape_interval: 15s # 全局抓取间隔，默认每15秒抓取一次
  evaluation_interval: 15s # 规则评估间隔

# 告警管理器配置（可选）
alerting:
  alertmanagers:
    - static_configs:
        - targets:
          # - alertmanager:9093

# 规则文件配置
rule_files:
  # - "first_rules.yml"
  # - "second_rules.yml"

# 抓取配置
scrape_configs:
  # Prometheus 自身监控
  - job_name: "prometheus"
    static_configs:
      - targets: ["localhost:9090"]
        labels:
          app: "prometheus"
```

默认配置会监控 Prometheus 自己，这样我们可以先测试环境是否正常。

💡 [Prometheus Rules](https://prometheus.io/docs/prometheus/latest/getting_started/#configure-rules-for-aggregating-scraped-data-into-new-time-series) 是用于定义监控指标的逻辑规则，包括：

* 记录规则：预计算复杂查询并存储为新时间序列以提升性能，而不需要每次都实时计算复杂的查询表达式。
* 告警规则：定义告警条件并触发通知

4）启动 Prometheus：

```sh
./prometheus --config.file=prometheus.yml
```

启动成功后会在 9090 端口提供服务。

5）访问 [http://localhost:9090](http://localhost:9090/) 进入管理界面，建议开启本地时间（不然时间可能少 8 个小时）：

![img](2_Prometheus.assets/5eEKvykqyE3xgYIf.webp)

访问 http://localhost:9090/metrics 可以看到 Prometheus 自身暴露的指标数据：

![img](2_Prometheus.assets/0zPxGctwUDWS9dfZ.webp)

这就是 Prometheus 期望的指标数据格式，每个应用都需要在 `/metrics` 端点暴露类似的数据。

6）在 Prometheus 查询界面可以输入 [PromQL 表达式](https://prometheus.io/docs/prometheus/latest/querying/basics/) 查看指标：

```sh
prometheus_target_interval_length_seconds
```

这个指标记录了 Prometheus 抓取目标之间的实际时间间隔，比如你配置每 15 秒抓取一次，但实际可能是 14.8 秒或 15.2 秒，这个指标就记录这些实际值。

![img](2_Prometheus.assets/j8uhh1E1QxHUmcGp.webp)

结果中的每一行都是一个时间序列，大括号内的是标签（维度）。其中：

* `quantile="0.01"` 表示第 1 百分位数（最快的 1%）
* `quantile="0.5"` 表示第 50 百分位数（中位数）
* `quantile="0.99"` 表示第 99 百分位数（最慢的 1%）

这表示 99% 的抓取都在 15.0012 秒以内完成。

还可以更精确地查询特定百分位数：

```sh
prometheus_target_interval_length_seconds{quantile="0.99"}
```

7）在 Graph 页签可以查看可视化图表，比如计算过去 1 分钟内 Prometheus 每秒平均创建的内存数据块数：

```sh
rate(prometheus_tsdb_head_chunks_created_total[1m])
```

如图：

![img](2_Prometheus.assets/SdIqvYk3d221mbHL.webp)

### Docker 安装 Prometheus（可选）

除了直接下载二进制包，也可以用 Docker 部署 Prometheus，把配置文件和 TSDB 数据目录挂载到宿主机即可：

```sh
docker run -d --name prometheus \
  -p 9090:9090 \
  -v $(pwd)/prometheus.yml:/etc/prometheus/prometheus.yml \
  -v $(pwd)/data:/prometheus \
  prom/prometheus
```

启动后同样访问 `http://localhost:9090`。更完整的 Prometheus + Grafana 容器化部署步骤可以参考：

* [docker 部署监控 Prometheus + Grafana](https://www.cnblogs.com/misakivv/p/18059352)
* [Docker 安装 Prometheus](https://developer.aliyun.com/article/935461)

### Grafana 安装

1）访问 [Grafana 下载页面](https://grafana.com/grafana/download)，根据操作系统选择对应的安装包：

![image-20260112001005602](2_Prometheus.assets/image-20260112001005602.png)

2）按照对应系统的 [安装文档](https://grafana.com/docs/grafana/latest/setup-grafana/installation/) 进行安装。比如 Windows 系统直接执行 `grafana-server.exe`，Mac 系统执行下列命令：

```sh
./bin/grafana server
```

启动成功的日志信息：

![image-20260112001611898](2_Prometheus.assets/image-20260112001611898.png)

3）访问 [http://localhost:3000](http://localhost:3000/) 查看看板，默认登录账号密码都是 `admin`：

![image-20260112001546161](2_Prometheus.assets/image-20260112001546161.png)

💡 可以参考 [起始文档](https://grafana.com/docs/grafana/latest/getting-started/build-first-dashboard/) 来学习如何使用 Grafana 构造看板。

### Grafana 整合 Prometheus

Grafana 与 Prometheus 打配合的 [工作原理](https://grafana.com/docs/grafana/latest/datasources/prometheus/) 很简单：Grafana 通过 HTTP API 从 Prometheus 查询数据，然后以图表形式展示。用户可以编写 PromQL 表达式来实现灵活的数据分析。

下面来跑通一下整合流程。

1）参考 [官方文档](https://grafana.com/docs/grafana/latest/getting-started/get-started-grafana-prometheus/)，登录 Grafana 后，需要先添加 Prometheus 作为数据源：

配置 Prometheus 服务器地址，然后测试连接：

💡 除了手动配置外，Grafana 还支持通过 Provisioning 配置文件自动导入数据源和仪表板，这在自动化部署（或者多环境）中很有用。

2）快速导入现成的仪表板模板：  

3）进入看板页面，查看导入的看板：

4）查看看板详情，一个仪表板可以包含多个 Panel（图表面板）：

每个 Panel 都可以查看具体的数据、状态和查询语句：

5）右上角可以将整个仪表板导出为 JSON 格式，便于分享和备份：

同样也可以通过导入 JSON 快速创建仪表板：

## 五、SpringBoot集成使用

### 前置概念：Micrometer 与 Prometheus

**Prometheus**：Prometheus 是一个维度时间序列数据库，具有内置的用户界面、自定义查询语言和数学运算功能。Prometheus 设计为基于拉取模型运行，定期从应用实例中抓取指标，基于服务发现机制。

**Micrometer**：Micrometer 在底层使用了 Prometheus 的 Java 客户端；该客户端有两个版本，Micrometer 都支持。如果想使用“新”客户端（1.x），使用 `micrometer-registry-prometheus`；如果想使用“旧”客户端（0.x），使用 `micrometer-registry-prometheus-simpleclient`。

| 依赖 | 底层 Prometheus 客户端 | 说明 |
| --- | --- | --- |
| `micrometer-registry-prometheus` | 1.x（新） | 推荐使用，Spring Boot 2.x/3.x 项目通常选它 |
| `micrometer-registry-prometheus-simpleclient` | 0.x（旧） | 兼容仍依赖旧客户端的项目 |

可以把 Micrometer 理解为应用侧的**指标门面**：业务代码只依赖 Micrometer 的 `Counter`、`Timer`、`Gauge` 等 API，由具体的 registry 实现负责把指标转换成 Prometheus 能识别的格式，并通过 `/actuator/prometheus` 暴露出去。

> `spring-boot-starter-actuator` 只提供 Micrometer 核心能力和 Actuator 端点，要暴露 Prometheus 指标，仍需显式引入 `micrometer-registry-prometheus`（或旧客户端对应的 simpleclient 依赖）。

### 1.Spring Boot 工程集成 Micrometer

##### 1.1引入依赖

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
<dependency>
  <groupId>io.micrometer</groupId>
  <artifactId>micrometer-registry-prometheus</artifactId>
</dependency>
```

##### 1.2配置

```properties
management.server.port=9003
management.endpoints.web.exposure.include=*
management.endpoint.metrics.enabled=true
management.endpoint.health.show-details=always
management.endpoint.health.probes.enabled=true
management.endpoint.prometheus.enabled=true
management.metrics.export.prometheus.enabled=true
management.metrics.tags.application=voice-qc-backend
```

这里 `management.endpoints.web.exposure.include=*` 配置为开启 Actuator 服务，因为Spring Boot Actuator 会自动配置一个 URL 为 `/actuator/Prometheus` 的 HTTP 服务来供 Prometheus 抓取数据，不过默认该服务是关闭的，该配置将打开所有的 Actuator 服务。

`management.metrics.tags.application` 配置会将该工程应用名称添加到计量器注册表的 tag 中去，方便后边 Prometheus 根据应用名称来区分不同的服务。

##### 1.3监控jvm信息

然后在工程启动主类中添加 Bean 如下来监控 JVM 性能指标信息：

```java
@SpringBootApplication
public class GatewayDatumApplication {

    public static void main(String[] args) {
        SpringApplication.run(GatewayDatumApplication.class, args);
    }

    @Bean
    MeterRegistryCustomizer<MeterRegistry> configurer(
            @Value("${spring.application.name}") String applicationName) {
        return (registry) -> registry.config().commonTags("application", applicationName);
    }

}
```

##### 1.4创建自定义监控

监控请求次数与响应时间

```
package com.lianxin.gobot.api.monitor;

import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Timer;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;

/**
 * @Author: GZ
 * @CreateTime: 2022-08-30  10:50
 * @Description: 自定义监控服务
 * @Version: 1.0
 */
@Component
public class PrometheusCustomMonitor {
    /**
     * 上报拨打请求次数
     */
    @Getter
    private Counter reportDialRequestCount;
    /**
     * 上报拨打URL
     */
    @Value("${lx.call-result-report.url}")
    private String callReportUrl;

    /**
     * 上报拨打响应时间
     */
    @Getter
    private Timer reportDialResponseTime;
    @Getter
    private final MeterRegistry registry;


    @Autowired
    public PrometheusCustomMonitor(MeterRegistry registry) {
        this.registry = registry;
    }

    @PostConstruct
    private void init() {
        reportDialRequestCount = registry.counter("go_api_report_dial_request_count", "url",callReportUrl);
        reportDialResponseTime=  registry.timer("go_api_report_dial_response_time", "url",callReportUrl);
    }
}
```

##### 1.5添加具体业务代码监控

```
//统计请求次数
prometheusCustomMonitor.getReportDialRequestCount().increment();
long startTime = System.currentTimeMillis();
String company = HttpUtils.post(companyUrl,"");
//统计响应时间
long endTime = System.currentTimeMillis();
prometheusCustomMonitor.getReportDialResponseTime().record(endTime-startTime, TimeUnit.MILLISECONDS);
```

在浏览器访问 `http://127.0.0.1:9001/actuator/prometheus` ，就可以看到服务的一系列不同类型 metrics 信息，例如`jvm_memory_used_bytes gauge`、`jvm_gc_memory_promoted_bytes_total counter` ，`go_api_report_dial_request_count`等

![img\_1.png](2_Prometheus.assets/5f03f6f8-8410-4273-8278-6e27ded6e552.png)

到此，Spring Boot 工程集成 Micrometer 就已经完成，接下里就要与 Prometheus 进行集成了。

### 2.集成 Prometheus

##### 2.1安装

```
docker pull prom/prometheus
mdkir /usr/local/prometheus
vi prometheus.yml
# my global config
global:
  scrape_interval: 15s # Set the scrape interval to every 15 seconds. Default is every 1 minute.
  evaluation_interval: 15s # Evaluate rules every 15 seconds. The default is every 1 minute.
  # scrape_timeout is set to the global default (10s).

# Alertmanager configuration
alerting:
  alertmanagers:
  - static_configs:
    - targets:
      # - alertmanager:9093

# Load rules once and periodically evaluate them according to the global 'evaluation_interval'.
rule_files:
  # - "first_rules.yml"
  # - "second_rules.yml"

# A scrape configuration containing exactly one endpoint to scrape:
# Here it's Prometheus itself.
scrape_configs:
  # The job name is added as a label `job=<job_name>` to any timeseries scraped from this config.
  - job_name: 'prometheus'

    # metrics_path defaults to '/metrics'
    # scheme defaults to 'http'.

    static_configs:
    - targets: ['192.168.136.129:9090']
docker run -d --name prometheus -p 9090:9090 -v/usr/local/prometheus/prometheus.yml:/etc/prometheus/prometheus.yml prom/prometheus
```

![图片](2_Prometheus.assets/81c79740-d319-4a3c-84c7-583de07b5e31.png)

##### 2.2集成配置

```
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: "prometheus"
    static_configs:
    - targets: ["localhost:9090"]
  - job_name: "metricsLocalTest"
    metrics_path: "/actuator/prometheus"
    static_configs:
    - targets: ["localhost:9003"]
```

这里 `localhost:9001` 就是上边本地启动的服务地址，也就是 Prometheus 要监控的服务地址。同时可以添加一些与应用相关的标签，方便后期执行 PromSQL 查询语句区分。最后重启 Prometheus 服务

![8736aa45-7c35-4161-90a6-a2fb39f0bad9.png](2_Prometheus.assets/8736aa45-7c35-4161-90a6-a2fb39f0bad9.png)

![c49b1dad-6f63-41da-9c2e-0e13a2fdf22c.png](2_Prometheus.assets/c49b1dad-6f63-41da-9c2e-0e13a2fdf22c.png)

### 3.使用 Grafana Dashboard 展示监控项

##### 3.1安装grafana

```
docker pull grafana/grafana
docker run -d --name grafana -p 3000:3000 -v /usr/local/grafana:/var/lib/grafana grafana/grafana
```

默认用户名/密码 admin/admin

![图片](2_Prometheus.assets/640-1694531771945.png)

##### 3.2配置prometheus数据源

![87ce18d9-fdfc-4851-9cb3-4dc8574a69f4.png](2_Prometheus.assets/87ce18d9-fdfc-4851-9cb3-4dc8574a69f4.png)

##### 3.3增加jvm面板

模板编号为4701

![7014ea9b-1699-4439-ab65-2bf2fd6997c8.png](2_Prometheus.assets/7014ea9b-1699-4439-ab65-2bf2fd6997c8.png)

![de148a71-3d82-4926-bba5-d35669718628.png](2_Prometheus.assets/de148a71-3d82-4926-bba5-d35669718628.png)

##### 3.4配置业务接口监控面板

![2bf4532e-a166-4466-94f3-cb448f737847.png](2_Prometheus.assets/2bf4532e-a166-4466-94f3-cb448f737847.png)

## 参考资料

### 文章

1. [SpringBoot 实现 QPS 监控：别等系统宕机了才知道加监控](https://mp.weixin.qq.com/s/IfeTwUnZCgY6zOw1q5SMxg)
2. [使用 Micrometer 与 Prometheus 集成监控 JVM](https://www.cnblogs.com/lizexiong/p/18772595)
3. [Spring 中关于 Micrometer 的介绍](https://cloud.springdoc.tech/micrometer/implementations/prometheus)
4. [阿里云 Prometheus 接入 Micrometer](https://help.aliyun.com/zh/prometheus/user-guide/monitor-micrometer-java-applications)
5. [springboot + Prometheus + grafana 实现自定义监控（请求数、响应时间、JVM 性能）](https://blog.csdn.net/GZ946/article/details/126619218)
6. [Prometheus + Grafana 监控实践](https://blog.51cto.com/u_16099246/7607251)

### 视频

* [B 站：Prometheus 监控入门](https://www.bilibili.com/video/BV1QPYDztEtW)
* [B 站：Prometheus + Grafana 实战](https://www.bilibili.com/video/BV18yKLzFEZa)

### Docker 安装 Prometheus

* [docker 部署监控 Prometheus + Grafana](https://www.cnblogs.com/misakivv/p/18059352)
* [Docker 安装 Prometheus](https://developer.aliyun.com/article/935461)
