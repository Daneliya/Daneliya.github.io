---
url: /Redis/Redis基础/1_RedisStack介绍.md
---

# Redis Stack介绍

#### Redis Stack介绍

> [Redis Stack - Redis 中文文档 (tkcnn.com)](https://www.tkcnn.com/redis/Redis-Stack.html)

官方关于Redis Stack的说明：用现代数据模型和处理引擎扩展Redis，提供完整的开发者体验，简单来说Redis Stack是针对redis的扩展

##### Redis Stack都扩展了哪些功能？

###### 可搜索Redis

对Redis数据结构和数据模型进行索引和查询；对Redis数据运行复杂的聚合和全文搜索。

> 感觉像ElasticSearch，支持全文搜索

###### 文档数据库

利用JSON及其灵活的数据模型将Redis用作文档数据库。高效地建模、搜索和查询数据，而不需要额外的缓存。

> 感觉像MongoDB

###### 遥测

从现场设备中获取连续数据，将其存储为时间序列数据，或使用概率数据结构进行分析和重复数据消除。

###### 身份和资源管理

将数字资源和ACL定义为图形，并使用单个Cypher查询实时计算权限。

###### 矢量搜索

通过查询矢量嵌入来开发人工智能驱动的应用程序。您可以使用Redis作为矢量数据库来实现推荐系统、检索增强生成（RAG）、LLM语义缓存等。有关更多信息，请参阅快速入门指南。

> 向量数据库吗？适用于每个组织的矢量数据库解决方案

###### 欺诈检测

实时检测欺诈的所有工具，概率查询，矢量搜索，甚至使用流进行处理。

> 提供的有：HyperLogLog、Cuckoo filter、Bloom filter，最后一个看着很眼熟啊，这不布隆过滤器吗？

##### Redis Stack套件

* Redis Stack Server
* RedisInsight
* Redis Stack 客户端 SDK

###### Redis Stack Server

由 Redis，RedisSearch，RedisJSON，RedisGraph，RedisTimeSeries 和 RedisBloom 组成。

###### RedisInsight

亲儿子，官方的客户端可视化工具。

原来QML的RESP已经下架。

> 下载地址：https://redis.com/redis-enterprise/redis-insight

###### Redis Stack 客户端 SDK

针对常用Python、.Net、Java、JS等等都提供了客户端SDK。

###### redis-om-spring

redis-om-spring组件，使用方式和访问MySQL基本相同，开发门槛降低了很多。

> 官网：https://github.com/redis/redis-om-spring
>
> RedisOM是Redis官方推出的ORM框架，是对Spring Data Redis的扩展。由于Redis目前已经支持原生JSON对象的存储，之前使用RedisTemplate直接用字符串来存储JOSN对象的方式明显不够优雅。通过RedisOM我们不仅能够以对象的形式来操作Redis中的数据，而且可以实现搜索功能！
