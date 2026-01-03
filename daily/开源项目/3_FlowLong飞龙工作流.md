---
url: /daily/开源项目/3_FlowLong飞龙工作流.md
---

# FlowLong飞龙工作流

> 项目地址：<https://gitee.com/aizuda/flowlong/tree/dev/>

功能模块介绍

1. flowlong-core：FlowLong的核心模块，提供了工作流引擎的核心功能，包括流程定义、流程实例、任务节点、任务列表等核心概念的抽象和实现。同时，它还提供了流程实例的生命周期管理、任务节点的执行、任务列表的展示等功能。

   ```
   assist：断言、日期、对象判断、流数据工具类
   cache：包含ConcurrentHashMap类型的localCache成员变量，用于存储缓存数据
   core：存放枚举信息，流程对象
   entity：实体类
   exception：异常类
   handler：处理器接口
   listener：流程引擎、流程实例、流程任务监听接口
   model：条件节点等数据模型
   scheduling：定时相关
   ```

2. flowlong-mybatis-plus：FlowLong与MyBatis Plus的集成模块，提供了基于MyBatis Plus的数据库操作功能，包括流程定义、流程实例、任务节点等数据的存储和查询。通过该模块，用户可以方便地将FlowLong工作流项目与现有的数据库系统进行集成。

3. flowlong-spring-boot-starter：FlowLong与Spring Boot的集成模块，提供了基于Spring Boot的启动和配置功能，方便用户快速搭建FlowLong工作流项目。通过该模块，用户可以轻松地将FlowLong工作流项目集成到现有的Spring Boot应用中。

4. flowlong-solon-plugin：FlowLong与Solon的集成模块，提供了基于Solon的插件功能，方便用户将FlowLong工作流项目与Solon平台进行集成。通过该模块，用户可以在Solon平台上方便地使用FlowLong工作流项目提供的功能。
