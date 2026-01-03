---
url: /Java/架构设计/分布式/07.分布式日志收集/0_ElasticStack概述.md
---

# ElasticStack概述

> 官网：https://www.elastic.co/cn

## 分布式日志的出现

随着现在各种软件系统的复杂度越来越高，特别是部署到云上之后，再想登录各个节点上查看各个模块的 log，基本是不可行了。因为不仅效率低下，而且有时由于安全性，不可能让工程师直接访问各个物理节点。而且现在大规模的软件系统基本都采用集群的部署方式，意味着对每个 service，会启动多个完全一样的 POD 对外提供服务，每个 container 都会产生自己的 log，仅从产生的 log 来看，你根本不知道是哪个 POD 产生的，这样对查看分布式的日志更加困难。

所以在云时代，需要一个收集并分析 log 的解决方案。首先需要将分布在各个角落的 log 收集到一个集中的地方，方便查看。收集了之后，还可以进行各种统计分析，甚至用流行的大数据或 maching learning 的方法进行分析。当然，对于传统的软件部署方式，也需要这样的 log 的解决方案。

## **Elastic Stack 技术栈**

包含了数据的整合 => 提取 => 存储 => 使用，一整套！

各组件介绍：

* beats 套件：从各种不同类型的文件 / 应用中采集数据。比如：a,b,c,d,e,aa,bb,cc
* Logstash：从多个采集器或数据源来抽取 / 转换数据，向 es 输送。比如：a,bb,cc
* elasticsearch：存储、查询数据
* kibana：可视化 es 的数据

## ELK概念

ELK 作为日志收集的一种方案，基本就是事实上的标准。ELK 是三个开源项目的首字母缩写，如下：

> E: Elasticsearch
>
> L: Logstash
>
> K: Kibana

Logstash 的主要作用是收集分布在各处的 log 并进行处理；

Elasticsearch 则是一个集中存储 log 的地方，更重要的是它是一个全文检索以及分析的引擎，它能让用户以近乎实时的方式来查看、分析海量的数据；

Kibana 则是为 Elasticsearch 开发的前端 GUI，让用户可以很方便的以图形化的接口查询 Elasticsearch 中存储的数据，同时也提供了各种分析的模块，比如构建 dashboard 的功能。

将 ELK 中的 L 理解成 Logging Agent 更合适。Elasticsearch 和 Kibana 基本就是存储、检索和分析 log 的标准方案，而 Logstash 则并不是唯一的收集 log 的方案，Fluentd 和 Filebeats 也能用于收集 log。所以现在网上有 ELK，EFK 之类的缩写。

通常一个小型的 cluster 有三个节点，在这三个节点上可能会运行几十个甚至上百个容器。而我们只需要在每个节点上启动一个 logging agent 的实例（在 kubernetes 中就是 DaemonSet 的概念）即可。

## **Elasticsearch 概念**

> Elasticsearch详细文档可参考分布式搜索中Elasticsearch学习笔记

把它当成 MySQL 一样的数据库去学习和理解。

入门学习：

* Index 索引 => MySQL 里的表（table）
* 建表、增删改查（查询需要花费的学习时间最多）
* 用客户端去调用 ElasticSearch（3 种）
* 语法：SQL、代码的方法（4 种语法）

ES 相比于 MySQL，能够自动帮我们做分词，能够非常高效、灵活地查询内容。
