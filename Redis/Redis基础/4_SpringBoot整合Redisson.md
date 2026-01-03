---
url: /Redis/Redis基础/4_SpringBoot整合Redisson.md
---

# SpringBoot整合Redisson

## 分布式锁

[redisson使用全解——redisson官方文档+注释（上篇）\_redisson官网中文-CSDN博客](https://blog.csdn.net/A_art_xiang/article/details/125525864)

[redis分布式锁实现---基于redisson封装自己的分布式锁\_redsson实现了分布式令牌桶的封装-CSDN博客](https://blog.csdn.net/Hellowenpan/article/details/119320317)

https://blog.csdn.net/heihei\_linlin/article/details/126529597

## SpringBoot集成Redisson实现延迟队列

在单机环境中，JDK已经自带了很多能够实现延时队列功能的组件，比如DelayQueue, Timer, ScheduledExecutorService等组件，都可以较为简便地创建延时任务，但上述组件使用一般需要把任务存储在内存中，服务重启存在任务丢失风险，且任务规模体量受内存限制，同时也造成长时间内存占用，并不灵活，通常适用于单进程客服端程序中或对任务要求不高的项目中。

在分布式环境下，仅使用JDK自带组件并不能可靠高效地实现延时队列，通常需要引入第三方中间件或框架。

比如常见的经典任务调度框架Quartz或基于此框架的xxl-job等其它框架，这些框架的主要功能是实现定时任务或周期性任务，在Redis、RabbitMQ还未广泛应用时，譬如常见的超时未支付取消订单等功能都是由定时任务实现的，通过定时轮询来判断是否已到达触发执行的时间点。但由于定时任务需要一定的周期性，周期扫描的间隔时间不好控制，太短会造成很多无意义的扫描，且增大系统压力，太长又会造成执行时间误差太大，且可能造成单次扫描所处理的堆积记录数量过大。

此外，利用MQ做延时队列也是一种常见的方式，比如通过RabbitMQ的TTL和死信队列实现消息的延迟投递，但是投递出去的MQ消息无法方便地实现删除或修改,即无法实现任务的取消或任务执行时间点的更改，同时也不能方便地对消息进行去重。

### 方式一：redis的过期key监控

**1，开启过期key监听**

在redis的配置里把这个注释去掉

```
notify-keyspace-events Ex
```

然后重启redis

**2，使用redis过期监听实现延迟队列**

继承KeyExpirationEventMessageListener类，实现父类的方法，就可以监听key过期时间了。当有key过期，就会执行这里。这里就把需要的key过滤出来，然后发送给kafka队列。

```java
@Component
@Slf4j
public class RedisKeyExpirationListener extends KeyExpirationEventMessageListener  {
    
    @Autowired
    private KafkaProducerService kafkaProducerService;

    public RedisKeyExpirationListener(RedisMessageListenerContainer listenerContainer) {
        super(listenerContainer);
    }

    /**
     * 针对 redis 数据失效事件，进行数据处理
     * @param message
     * @param pattern
     */
    @Override
    public void onMessage(Message message, byte[] pattern){
        if(message == null || StringUtils.isEmpty(message.toString())){
            return;
        }
        String content = message.toString();
        //key的格式为   flag:时效类型:运单号  示例如下
        try {
            if(content.startsWith(AbnConstant.EMS)){
                kafkaProducerService.sendMessageSync(TopicConstant.EMS_WAYBILL_ABN_QUEUE,content);
            }else if(content.startsWith(AbnConstant.YUNDA)){
                kafkaProducerService.sendMessageSync(TopicConstant.YUNDA_WAYBILL_ABN_QUEUE,content);
            }
        } catch (Exception e) {
            log.error("监控过期key，发送kafka异常，",e);
        }
    }
}
```

可以看的出来，这种方式其实是很简单的，但是有几个问题需要注意，一是，这个尽量单机运行，因为多台机器都会执行，浪费cpu，增加数据库负担。二是，机器频繁部署的时候，如果有时间间隔，会出现数据的漏处理。三是，能不用就别用，有坑。

### 方式二：redis的zset实现延迟队列

Redis的数据结构zset，同样可以实现延迟队列的效果，且更加灵活，可以实现MQ无法做到的一些特性，采用Redis实现延时队列，对其进行优化与封装。

1，生产者实现

可以看到生产者很简单，其实就是利用zset的特性（利用`zset`的`score`属性，`redis`会将`zset`集合中的元素按照`score`进行从小到大排序），给一个zset添加元素而已，而时间就是它的score。

```java
public void produce(Integer taskId, long exeTime) {
    System.out.println("加入任务， taskId: " + taskId + ", exeTime: " + exeTime + ", 当前时间：" + LocalDateTime.now());
    RedisOps.getJedis().zadd(RedisOps.key, exeTime, String.valueOf(taskId));
}
```

2，消费者实现

消费者的代码也不难，就是把已经过期的zset中的元素给删除掉，然后处理数据。

```java
public void consumer() {
    Executors.newSingleThreadExecutor().submit(new Runnable() {
        @Override
        public void run() {
            while (true) {
                Set<String> taskIdSet = RedisOps.getJedis().zrangeByScore(RedisOps.key, 0, System.currentTimeMillis(), 0, 1);
                if (taskIdSet == null || taskIdSet.isEmpty()) {
                    System.out.println("没有任务");
} else {
                taskIdSet.forEach(id -> {
                    long result = RedisOps.getJedis().zrem(RedisOps.key, id);
                    if (result == 1L) {
                        System.out.println("从延时队列中获取到任务，taskId:" + id + " , 当前时间：" + LocalDateTime.now());
                    }
                });
            }
            try {
                TimeUnit.MILLISECONDS.sleep(100);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }
});

```

这种方式其实是比上个方式要好的。因为，他的两个缺点都被克服掉了。多台机器也没事儿，也不用再担心部署时间间隔长的问题。

### 方式三：封装 Redis 延迟队列工具类（RBlockingDeque+RDelayedQueue）

### 方式四：LUA脚本

参考资料：

\[1]. [基于Redis实现延时队列的优化方案](https://blog.csdn.net/u012791490/article/details/125243933)

\[2]. [redis实现延时队列的两种方式](https://blog.csdn.net/qq_36268452/article/details/113392170)

\[3]. [SpringBoot集成Redisson实现延迟队列\_redssion延时队列订阅](https://blog.csdn.net/qq_40087415/article/details/115940092)

https://blog.51cto.com/u\_16099257/7262841

https://cloud.tencent.com/developer/article/2379783

https://cloud.tencent.com/developer/article/2223087

https://blog.csdn.net/z1ztai/article/details/129669032

https://blog.csdn.net/BASK2311/article/details/129223472

https://blog.csdn.net/ZuiChuDeQiDian/article/details/104374110

https://blog.csdn.net/LBWNB\_Java/article/details/129055830

https://blog.51cto.com/u\_13270529/5960644

https://www.163.com/dy/article/HO0M5GA60518R7MO.html

https://www.zhangshengrong.com/p/Ap1ZrDlK10/
