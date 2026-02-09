---
url: /Java/架构设计/分布式/07.分布式日志收集/4_EFK篇之Filebeat使用.md
---

# EFK篇之Filebeat使用

## **EFK**概述

主流的 ELK (Elasticsearch, Logstash, Kibana) 目前已经转变为 EFK (Elasticsearch, Filebeat or Fluentd, Kibana) 比较重，对于容器云的日志方案业内也普遍推荐采用 Fluentd。

一个典型的 ELK 方案下的日志收集处理流程：

* Logstash 从各个 Docker 容器中提取日志信息
* Logstash 将日志转发到 Elasticsearch 进行索引和保存
* Kibana 负责分析和可视化日志信息

由于 Logstash 在数据收集上并不出色，而且作为 Agent，其性能并不达标。基于此，Elastic 发布了 beats 系列轻量级采集组件。

这里我们要实践的 Beat 组件是 Filebeat，Filebeat 是构建于 beats 之上的，应用于日志收集场景的实现，用来替代 Logstash Forwarder 的下一代 Logstash 收集器，是为了更快速稳定轻量低耗地进行收集工作，它可以很方便地与 Logstash 还有直接与 Elasticsearch 进行对接。

Filebeat 作为 Agent，它会收集的 log 文件中的记录变动，并直接将日志发给 Elasticsearch 进行索引和保存。

## **Filebeat、Logstash、Fluentd 三者的区别和联系**

Filebeat 是一个轻量级的收集本地 log 数据的方案，官方对 Filebeats 的说明如下。

```
Filebeat is a log data shipper for local files. Installed as an agent on your servers, Filebeat monitors the log directories or specific log files, tails the files, and forwards them either to Elasticsearch or Logstash for indexing
```

可以看出 Filebeat 功能比较单一，它仅仅只能收集本地的 log，但并不能对收集到的 Log 做什么处理，所以通常 Filebeat 通常需要将收集到的 log 发送到 Logstash 做进一步的处理。相比Logstash用Filebeats只需要一步搞定，而且不需要考虑代码侵入。

Logstash 和 Fluentd 都具有收集并处理 log 的能力，功能上二者旗鼓相当，但 Logstash 消耗更多的 memory，对此 Logstash 的解决方案是使用 Filebeats 从各个叶子节点上收集 log，当然 Fluentd 也有对应的 Fluent Bit。

另外一个重要的区别是 Fluentd 抽象性做得更好，对用户屏蔽了底层细节的繁琐。作者的原话如下：

```
Fluentd’s approach is more declarative whereas Logstash’s method is procedural. For programmers trained in procedural programming, Logstash’s configuration can be easier to get started. On the other hand, Fluentd’s tag-based routing allows complex routing to be expressed cleanly.
```

虽然作者说是要中立的对二者（Logstash 和 Fluentd）进行对比，但实际上偏向性很明显了：）。

Filebeat、Logstash、Elasticsearch 和 Kibana 是属于同一家公司的开源项目，官方文档如下：

> https://www.elastic.co/guide/index.html

Fluentd 则是另一家公司的开源项目，官方文档如下：

> https://docs.fluentd.org

## **Filebeat 配置**

> 下载地址：https://www.elastic.co/cn/downloads/beats/filebeat

下载

```sh
docker pull docker.elastic.co/beats/filebeat:7.17.15
```

新建配置文件`filebeat.docker.yml`，路径`/home/tools/filebeat`

> 官方默认配置文件：https://raw.githubusercontent.com/elastic/beats/7.17/deploy/docker/filebeat.docker.yml

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

启动

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

重启容器

```
systemctl restart filebeat
```

进入 Kibana 中查看日志信息，便可以看到刚刚添加的容器的日志信息了。

## 参考资料

\[1]. 公众号【奇妙的Linux世界】一文读懂开源日志管理方案 ELK 和 EFK 的区别

\[2]. https://zhuanlan.zhihu.com/p/141439013

\[3]. https://blog.csdn.net/zyxwvuuvwxyz/article/details/108831962

\[4]. https://www.bilibili.com/video/BV18u4y1e7rs
