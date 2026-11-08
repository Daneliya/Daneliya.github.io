---
url: /Java/架构设计/分布式/03.分布式消息队列/02.RabbitMQ/4_RabbitMQ延时队列.md
---

# RabbitMQ延时队列

一、什么是延时队列

三、RabbitMQ中的TTL

## 基本使用

### 依赖

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <!-- mq -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-amqp</artifactId>
    </dependency>
    <!-- fastjson -->
    <dependency>
        <groupId>com.alibaba</groupId>
        <artifactId>fastjson</artifactId>
        <version>1.2.49</version>
    </dependency>
    <!-- lombok -->
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <version>1.18.30</version>
    </dependency>
</dependencies>
```

### 配置文件

```yaml
server:
  port: 8056
spring:
  rabbitmq:
    host: 192.168.100.105 # 主机名
    port: 5672 # 端口
    virtual-host: / # 虚拟主机
    username: admin # 用户名
    password: admin # 密码
    listener:
      simple:
        concurrency: 1
        max-concurrency: 1
        acknowledge-mode: manual
        prefetch: 1 # 每次只能获取一条消息，处理完成才能获取下一个消息
```

### 延迟队列配置类

```java
@Configuration
public class DelayedRabbitMQConfig {

    public static final String DELAYED_QUEUE_NAME = "delay.queue.demo.delay.queue";
    public static final String DELAYED_EXCHANGE_NAME = "delay.queue.demo.delay.exchange";
    public static final String DELAYED_ROUTING_KEY = "delay.queue.demo.delay.routingkey";

    @Bean


    public Queue immediateQueue() {
        return new Queue(DELAYED_QUEUE_NAME);
    }

    @Bean
    public CustomExchange customExchange() {
        Map<String, Object> args = new HashMap<>();
        args.put("x-delayed-type", "direct");
        return new CustomExchange(DELAYED_EXCHANGE_NAME, "x-delayed-message", true, false, args);
    }

    @Bean
    public Binding bindingNotify(@Qualifier("immediateQueue") Queue queue,
                                 @Qualifier("customExchange") CustomExchange customExchange) {
        return BindingBuilder.bind(queue).to(customExchange).with(DELAYED_ROUTING_KEY).noargs();
    }
}
```

### 监听器

```java
@Slf4j
@Component
public class Listener {

    @RabbitListener(queues = DELAYED_QUEUE_NAME)
    public void receiveD(Message message, Channel channel) throws IOException {
        String msg = new String(message.getBody());
        log.info("当前时间：{},延时队列收到消息：{}", new Date().toString(), msg);
        channel.basicAck(message.getMessageProperties().getDeliveryTag(), false);

        Object object = JSON.parseObject(message.getBody(), Map.class);
        System.out.println("延时队列收到消息: " + object);
    }
}
```

### 发送消息

```java
@Slf4j
@RestController
public class TestController {

    @Autowired
    private RabbitTemplate rabbitTemplate;

    @RequestMapping("delayMsg")
    public Object delayMsg(String msg, Integer delayTime) {
        log.info("当前时间：{},收到请求，msg:{},delayTime:{}", new Date(), msg, delayTime);

        // 准备消息
        for (int i = 1; i <= 10; i++) {
            Map<String, Object> msgMap = new HashMap<>();
            msgMap.put("name", "Jack" + i);
            msgMap.put("age", i);
            sendDelayMsg(msgMap, delayTime);
        }

        return "发送成功";
    }

    public void sendDelayMsg(Object msg, Integer delayTime) {
        rabbitTemplate.convertAndSend(DELAYED_EXCHANGE_NAME, DELAYED_ROUTING_KEY, msg, a -> {
            a.getMessageProperties().setDelay(delayTime);
            return a;
        });
    }
}
```

### 测试消息

http://127.0.0.1:8056/delayMsg?msg=content\&delayTime=2000

## 报错

Caused by: com.rabbitmq.client.ShutdownSignalException: connection error; protocol method: #method\<connection.close>(reply-code=530, reply-text=NOT\_ALLOWED - vhost my-rabbit not found, class-id=10, method-id=40)

https://blog.csdn.net/m0\_46114643/article/details/122543014

确认消息报错：Channel shutdown: channel error; protocol method

```
@RabbitListener(queues = DELAYED_QUEUE_NAME)
public void receiveD(Message message, Channel channel) throws IOException {
    String msg = new String(message.getBody());
    log.info("当前时间：{},延时队列收到消息：{}", new Date().toString(), msg);
    channel.basicAck(message.getMessageProperties().getDeliveryTag(), false);
}
```

https://blog.csdn.net/hantanxin/article/details/103871321

修改配置为手动签收

```
    listener:
      simple:
        concurrency: 1
        max-concurrency: 1
        acknowledge-mode: manual
        prefetch: 1 
```

## 参考资料

https://cloud.tencent.com/developer/article/1659393

https://blog.csdn.net/Mou\_O/article/details/106093749

https://cloud.tencent.com/developer/article/1475254

https://www.cnblogs.com/chengxy-nds/p/13217828.html

深入浅出RabbitMQ：顺序消费、死信队列和延时队列：https://cloud.tencent.com/developer/article/2355643：
