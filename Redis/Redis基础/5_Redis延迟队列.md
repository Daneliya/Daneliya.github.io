---
url: /Redis/Redis基础/5_Redis延迟队列.md
---

# Redis延迟队列

> 本文代码：[springboot\_chowder/springboot\_redisson at main · Daneliya/springboot\_chowder (github.com)](https://github.com/Daneliya/springboot_chowder/tree/main/springboot_redisson)

具体示例

[redis作延迟队列简单实现\_redisdelayqueuehandle-CSDN博客](https://blog.csdn.net/qq_43163943/article/details/120493022)

redis安装
https://blog.csdn.net/Biteht/article/details/128548659

redis延迟队列的几种方式 `KeyExpirationEventMessageListener`是Spring Data Redis中的监听器，用于监听Redis中Key的过期事件。 Redis使用一种称为“过期事件（expiry event）”的机制来处理键的过期。当一个键的过期时间到达时，Redis会生成一个事件，通知订阅了该事件的客户端 使用`ZSET`（有序集合，Sorted Set）来实现延迟任务调度（如订单超时取消）是一种有效的方法 使用 Redisson 创建延迟队列。Redisson 提供了 `RDelayedQueue` 接口和 `RQueue` 接口来实现延迟队列。

单节点及集群配置

https://www.cnblogs.com/ming-blogs/p/16268515.html

redis实现延时队列的两种方式

https://blog.csdn.net/qq\_36268452/article/details/113392170

详解！基于Redis解决业务场景中延迟队列的应用实践,你不得不服啊

https://zhuanlan.zhihu.com/p/187137027

基于Redisson实现延迟队列

https://www.jianshu.com/p/a1b3aa87f78b

分布式锁

https://www.cnblogs.com/cjsblog/p/11273205.html

https://zhuanlan.zhihu.com/p/343811173

https://www.jianshu.com/p/8853b34f7c8b

https://zhuanlan.zhihu.com/p/548827425

java.lang.AbstractMethodError: org.redisson.spring.data.connection.RedissonReactiveRedisConnection.close()V

报错原因：spring boot版本和[redission](https://so.csdn.net/so/search?q=redission\&spm=1001.2101.3001.7020)版本不兼容
报错版本：spring boot 2.0.5   <-->  redission 3.12.5
