---
url: /Java/架构设计/分布式/07.分布式日志收集/4_EFK篇之Filebeat使用.md
---

# EFK篇之Filebeat使用

## 一、EFK 概述

### ELK 和 EFK 概述

主流的 ELK（Elasticsearch, Logstash, Kibana）目前已经转变为 EFK（Elasticsearch, Filebeat or Fluentd, Kibana）。对于容器云的日志方案业内也普遍推荐采用 Fluentd。

一个典型的 EFK 方案下的日志收集处理流程：

* Filebeat 从各个服务器或容器中采集日志
* Filebeat 将日志转发到 Logstash 进行处理（或直接发送到 Elasticsearch）
* Elasticsearch 进行索引和存储
* Kibana 负责分析和可视化日志信息

由于 Logstash 在数据收集上相对较重，作为 Agent 性能表现一般。基于此，Elastic 发布了 beats 系列轻量级采集组件。

这里我们要实践的 Beat 组件是 Filebeat，它是构建于 beats 之上的，应用于日志收集场景的实现，用来替代 Logstash Forwarder 的下一代日志收集器。Filebeat 更加快速、稳定、轻量、低耗，可以方便地与 Logstash 或直接与 Elasticsearch 进行对接。

Filebeat 作为 Agent，会监控日志文件的变动，逐行读取新增内容并发送到后端进行处理。

### Filebeat、Logstash、Fluentd 三者的区别和联系

Filebeat 是一个轻量级的日志收集工具，官方说明如下：

> Filebeat is a log data shipper for local files. Installed as an agent on your servers, Filebeat monitors the log directories or specific log files, tails the files, and forwards them either to Elasticsearch or Logstash for indexing.

可以看出 Filebeat 功能相对单一，主要用于收集本地的日志文件，通常需要将日志发送到 Logstash 做进一步处理。相比直接使用 Logstash，Filebeat 部署更简单，不需要考虑代码侵入问题。

**三者的定位对比：**

| 组件 | 类型 | 特点 |
|------|------|------|
| Filebeat | 日志收集器 | 轻量级、低资源占用、仅收集日志 |
| Logstash | 日志处理管道 | 功能强大、支持过滤解析、消耗资源较多 |
| Fluentd | 日志收集器 | 跨平台、抽象程度高、社区活跃 |

Logstash 和 Fluentd 都具有收集并处理日志的能力，功能上二者旗鼓相当。Logstash 消耗的内存较多，因此通常采用 Filebeat 从各个节点收集日志，再转发给 Logstash 处理（Fluentd 也有对应的轻量级组件 Fluent Bit）。

另外，Fluentd 的抽象性做得更好，采用声明式配置。引用原作者的评价：

> Fluentd's approach is more declarative whereas Logstash's method is procedural. For programmers trained in procedural programming, Logstash's configuration can be easier to get started. On the other hand, Fluentd's tag-based routing allows complex routing to be expressed cleanly.

**官方文档：**

* Elastic 全家桶（Filebeat, Logstash, Elasticsearch, Kibana）：https://www.elastic.co/guide/index.html
* Fluentd：https://docs.fluentd.org

## 二、Filebeat 安装配置

> 下载地址：https://www.elastic.co/cn/downloads/beats/filebeat

### 3.1 Filebeat 工作原理

Filebeat 由两个主要组件组成：`prospectors`（勘探器）和 `harvesters`（收割机）。

* **Harvester**：负责读取单个文件的内容，逐行读取并发送到输出端
* **Prospector**：负责管理 Harvester，查找需要读取的文件

Filebeat 会记录每个文件的状态和位置信息，存储在 `registry` 文件中，确保在重启后可以从上次停止的位置继续读取，实现断点续传。

### 3.2 下载安装

使用 Docker 方式部署 Filebeat：

```sh
docker pull docker.elastic.co/beats/filebeat:7.17.15
```

### 3.3 配置文件详解

新建配置文件 `filebeat.docker.yml`，路径 `/home/tools/filebeat`

> 官方默认配置文件：https://raw.githubusercontent.com/elastic/beats/7.17/deploy/docker/filebeat.docker.yml

#### 基础配置

```yml
# 日志输入配置
filebeat.inputs:
- type: log
  enabled: true
  paths:
  # 需要收集的日志所在的位置，可使用通配符进行配置
  #- /data/elk/*.log
  - /home/springboot/*/*.log

#日志输出配置(采用 logstash 收集日志，5044为logstash端口)
output.logstash:
  hosts: ['192.168.64.128:5044']
```

#### 完整配置示例

```yml
filebeat.inputs:
- type: log
  enabled: true
  paths:
    - /home/springboot/*/*.log
  # 排除匹配规则
  exclude_files: ['\.gz$']
  # 包含匹配规则
  include_lines: ['^ERROR', '^WARN', '^INFO']
  # 自定义字段
  fields:
    service: springboot
    environment: prod
  fields_under_root: true

# 日志解析处理（需要启用 ingest node pipeline）
# processors:
#   - add_host_metadata:
#   - add_docker_metadata:

# 输出到 Logstash
output.logstash:
  hosts: ['192.168.64.128:5044']
  # 负载均衡
  loadbalance: true
  # 压缩
  compression_level: 3

# 日志级别
logging.level: info
logging.to_files: true
logging.files:
  path: /var/log/filebeat
  name: filebeat
  keepfiles: 7
  permissions: 0644
```

### 3.4 启动与验证

启动容器：

```sh
docker run --restart=always \
--log-driver json-file \
--log-opt max-size=100m \
--log-opt max-file=2 \
--name filebeat \
--user=root -d \
-v /logs/:/logs/ \
-v /home/tools/filebeat/filebeat.docker.yml:/usr/share/filebeat/filebeat.yml \
docker.elastic.co/beats/filebeat:7.17.15
```

重启服务：

```sh
systemctl restart filebeat
```

> 注意：Docker 方式部署时，宿主机日志目录需要挂载到容器内对应路径

进入 Kibana 中查看日志信息，便可以看到刚刚添加的容器的日志信息了。

## 参考资料

\[1] 公众号【奇妙的Linux世界】一文读懂开源日志管理方案 ELK 和 EFK 的区别：https://mp.weixin.qq.com/s/yLOFnkKqL--V8mVhs2RdZw

\[2] https://zhuanlan.zhihu.com/p/141439013

\[3] https://blog.csdn.net/zyxwvuuvwxyz/article/details/108831962

\[4] https://www.bilibili.com/video/BV18u4y1e7rs

Filebeat介绍：https://zhuanlan.zhihu.com/p/141439013

fluentd 安装、配置、使用介绍：https://www.cnblogs.com/lvzhenjiang/p/14196982.html
