---
url: /常用框架/重试框架/1_Spring-Retry.md
---

# Spring-Retry

`Spring Retry`是`Spring`框架提供的一个模块，它通过提供注解或编程方式的方式，帮助我们实现方法级别的重试机制。

## 一、Spring-Retry的普通使用方式

Spring Retry 为 Spring 应用程序提供了声明性重试支持。它用于Spring批处理、Spring集成、Apache Hadoop(等等)。它主要是针对可能抛出异常的一些调用操作，进行有策略的重试。

### 1、引入依赖

```java
 <dependency>
    <groupId>org.springframework.retry</groupId>
    <artifactId>spring-retry</artifactId>
    <version>1.2.2.RELEASE</version>
 </dependency>
```

### 2、重试方法

准备一个任务方法，采用一个随机整数，根据不同的条件返回不同的值，或者抛出异常

```java
/**
 * spring_retry 普通使用方式
 *
 * @author xxl
 * @date 2022/12/26 22:53
 */
@Slf4j
public class RetryDemoTask {

    public static void main(String[] args) {
        retryTask("参数");
    }

    /**
     * 重试方法：采用一个随机整数，根据不同的条件返回不同的值，或者抛出异常
     *
     * @return 返回结果
     */
    public static boolean retryTask(String param) {
        log.info("收到请求参数:{}", param);

        int i = RandomUtils.nextInt(0, 11);
        log.info("随机生成的数:{}", i);
        if (i == 0) {
            log.info("为0,抛出参数异常.");
            throw new IllegalArgumentException("参数异常");
        } else if (i == 1) {
            log.info("为1,返回true.");
            return true;
        } else if (i == 2) {
            log.info("为2,返回false.");
            return false;
        } else {
            //为其他
            log.info("大于2,抛出自定义异常.");
            throw new RemoteAccessException("大于2,抛出远程访问异常");
        }
    }

}
```

### 3、使用 SpringRetryTemplate

```java
/**
 * spring_retry 测试类
 *
 * @author xxl
 * @date 2022/12/26 22:58
 */
@Slf4j
public class SpringRetryTemplateTest {

    /**
     * 重试间隔时间ms,默认1000ms
     */
    private final static long fixedPeriodTime = 1000L;

    /**
     * 最大重试次数,默认为3
     */
    private final static int maxRetryTimes = 3;

    /**
     * 表示哪些异常需要重试,key表示异常的字节码,value为true表示需要重试
     */
    private final Map<Class<? extends Throwable>, Boolean> exceptionMap = new HashMap<>();


    @Test
    public void test() {
        exceptionMap.put(RemoteAccessException.class, true);

        // 构建重试模板实例
        RetryTemplate retryTemplate = new RetryTemplate();

        // 设置重试回退操作策略，主要设置重试间隔时间
        FixedBackOffPolicy backOffPolicy = new FixedBackOffPolicy();
        backOffPolicy.setBackOffPeriod(fixedPeriodTime);

        // 设置重试策略，主要设置重试次数
        SimpleRetryPolicy retryPolicy = new SimpleRetryPolicy(maxRetryTimes, exceptionMap);

        retryTemplate.setRetryPolicy(retryPolicy);
        retryTemplate.setBackOffPolicy(backOffPolicy);

        Boolean execute = retryTemplate.execute(
                //RetryCallback：重试回调逻辑实例，包装正常的功能操
                retryContext -> {
                    boolean b = RetryDemoTask.retryTask("abc");
                    log.info("调用的结果:{}", b);
                    return b;
                },
                retryContext -> {
                    //RecoveryCallback：整个执行操作结束的恢复操作实例
                    log.info("已达到最大重试次数或抛出了不重试的异常~~~");
                    return false;
                }
        );
        log.info("执行结果:{}", execute);
    }
}
```

代码解析：`RetryTemplate` 承担了重试执行者的角色，它可以设置`SimpleRetryPolicy`(重试策略，设置重试上限，重试的根源实体)，`FixedBackOffPolicy`（固定的回退策略，设置执行重试回退的时间间隔）。

`RetryTemplate`通过`execute`提交执行操作，需要准备`RetryCallback` 和`RecoveryCallback` 两个类实例，前者对应的就是重试回调逻辑实例，包装正常的功能操作，`RecoveryCallback`实现的是整个执行操作结束的恢复操作实例。

只有在调用的时候抛出了异常，并且异常是在`exceptionMap`中配置的异常，才会执行重试操作，否则就调用到`excute`方法的第二个执行方法`RecoveryCallback`中。

重试策略、回退策略还有很多种：

#### **重试策略**

* **NeverRetryPolicy：** 只允许调用`RetryCallback`一次，不允许重试
* **AlwaysRetryPolicy：** 允许无限重试，直到成功，此方式逻辑不当会导致死循环
* **SimpleRetryPolicy：** 固定次数重试策略，默认重试最大次数为3次，`RetryTemplate`默认使用的策略
* **TimeoutRetryPolicy：** 超时时间重试策略，默认超时时间为1秒，在指定的超时时间内允许重试
* **ExceptionClassifierRetryPolicy：** 设置不同异常的重试策略，类似组合重试策略，区别在于这里只区分不同异常的重试
* **CircuitBreakerRetryPolicy：** 有熔断功能的重试策略，需设置3个参数`openTimeout`、`resetTimeout`和`delegate`
* **CompositeRetryPolicy：** 组合重试策略，有两种组合方式，乐观组合重试策略是指只要有一个策略允许即可以重试，悲观组合重试策略是指只要有一个策略不允许即可以重试，但不管哪种组合方式，组合中的每一个策略都会执行

#### **重试回退策略**

重试回退策略，指的是每次重试是立即重试还是等待一段时间后重试。

默认情况下是立即重试，如果需要配置等待一段时间后重试则需要指定回退策略`BackoffRetryPolicy`。

* **NoBackOffPolicy：** 无退避算法策略，每次重试时立即重试
* **FixedBackOffPolicy：** 固定时间的退避策略，需设置参数`sleeper`和`backOffPeriod`，`sleeper`指定等待策略，默认是`Thread.sleep`，即线程休眠，`backOffPeriod`指定休眠时间，默认1秒
* **UniformRandomBackOffPolicy：** 随机时间退避策略，需设置`sleeper`、`minBackOffPeriod`和`maxBackOffPeriod`，该策略在`minBackOffPeriod`,`maxBackOffPeriod`之间取一个随机休眠时间，`minBackOffPeriod`默认500毫秒，`maxBackOffPeriod`默认1500毫秒
* **ExponentialBackOffPolicy：** 指数退避策略，需设置参数`sleeper`、`initialInterval`、`maxInterval`和`multiplie`r，`initialInterval`指定初始休眠时间，默认100毫秒，`maxInterval`指定最大休眠时间，默认30秒，`multiplier`指定乘数，即下一次休眠时间为`当前休眠时间*multiplier`
* **ExponentialRandomBackOffPolicy：** 随机指数退避策略，引入随机乘数可以实现随机乘数回退

### 4、运行结果

```sh
14:26:14.543 [main] DEBUG org.springframework.retry.support.RetryTemplate - Retry: count=0
14:26:14.548 [main] INFO com.xxl.retry.spring_retry.RetryDemoTask - 收到请求参数:abc
14:26:14.554 [main] INFO com.xxl.retry.spring_retry.RetryDemoTask - 随机生成的数:3
14:26:14.554 [main] INFO com.xxl.retry.spring_retry.RetryDemoTask - 大于2,抛出自定义异常.
14:26:15.568 [main] DEBUG org.springframework.retry.support.RetryTemplate - Checking for rethrow: count=1
14:26:15.568 [main] DEBUG org.springframework.retry.support.RetryTemplate - Retry: count=1
14:26:15.568 [main] INFO com.xxl.retry.spring_retry.RetryDemoTask - 收到请求参数:abc
14:26:15.568 [main] INFO com.xxl.retry.spring_retry.RetryDemoTask - 随机生成的数:1
14:26:15.568 [main] INFO com.xxl.retry.spring_retry.RetryDemoTask - 为1,返回true.
14:26:15.568 [main] INFO com.xxl.retry.spring_retry.SpringRetryTemplateTest - 调用的结果:true
14:26:15.569 [main] INFO com.xxl.retry.spring_retry.SpringRetryTemplateTest - 执行结果:true
```

## 二、Spring-Retry的注解使用方式

`Spring-Retry`也支持和`Spring-Boot`整合

### 1、注解介绍

只要在需要重试的方法上加`@Retryable`，在重试失败的回调方法上加`@Recover`，下面是这些注解的属性。

`@EnableRetry`，表示是否开启重试

| 序号 | 属性             | 类型    | 默认值 | 说明                                                         |
| ---- | ---------------- | ------- | ------ | ------------------------------------------------------------ |
| 1    | proxyTargetClass | boolean | false  | 指示是否要创建基于子类的(CGLIB)代理，而不是创建标准的基于Java接口的代理 |

`@Retryable`，标注此注解的方法在发生异常时会进行重试

| 序号 | 属性        | 类型     | 默认值     | 说明                                                         |
| ---- | ----------- | -------- | ---------- | ------------------------------------------------------------ |
| 1    | interceptor | String   | ""         | 将interceptor的bean名称应用到retryable()                     |
| 2    | value       | Class\[]  | {}         | 可重试的异常类型                                             |
| 3    | label       | String   | ""         | 统计报告的唯一标签。如果没有提供，调用这可以选择忽略它，或者提供默认值 |
| 4    | maxAttempts | int      | 3          | 尝试的最大次数(包括第一次失败)，默认为3次                    |
| 5    | backoff     | @Backoff | @Backoff() | 指定用于重试此操作的backoff属性。默认为空                    |
| 6    | exclude     | Class\[]  | {}         | 排除可重试的异常类型                                         |

`@Backoff`

| 序号 | 属性       | 类型    | 默认值 | 说明                                            |
| ---- | ---------- | ------- | ------ | ----------------------------------------------- |
| 1    | delay      | long    | 0      | 如果不设置则默认使用 1000 milliseconds 重试等待 |
| 2    | maxDelay   | long    | 0      | 最大重试等待时间                                |
| 3    | multiplier | long    | 0      | 用于计算下一个延迟的乘数（大于0生效）           |
| 4    | random     | boolean | false  | 随机重试等待时间                                |

### 2、引入依赖

```xml
 <dependency>
    <groupId>org.springframework.retry</groupId>
    <artifactId>spring-retry</artifactId>
    <version>1.2.2.RELEASE</version>
 </dependency>

 <dependency>
    <groupId>org.aspectj</groupId>
    <artifactId>aspectjweaver</artifactId>
    <version>1.9.1</version>
 </dependency>
```

### 3、启动类注解

在application启动类上加上`@EnableRetry`的注解

```java
/**
 * 启动类
 *
 * @author xxl
 * @date 2022/12/26 22:43
 */
@EnableRetry
@SpringBootApplication
public class ReplyApplication {
    
    public static void main(String[] args) {
        SpringApplication.run(ReplyApplication.class, args);
    }
    
}
```

### 4、重试方法

```java
/**
 * spring_retry 注解重试方法
 * 
 * @author xxl
 * @date 2022/12/26 23:12
 */
@Service
@Slf4j
public class SpringRetryDemo {

    /**
     * 重试所调用方法
     *
     * @param param
     * @return
     */
    @Retryable(value = {RemoteAccessException.class, NullPointerException.class}, maxAttempts = 3, backoff = @Backoff(delay = 2000L, multiplier = 2))
    public boolean call(String param) {
        return RetryDemoTask.retryTask(param);
    }

    /**
     * 达到最大重试次数,或抛出了一个没有指定进行重试的异常
     * recover 机制
     *
     * @param e 异常
     */
    @Recover
    public boolean recover(Exception e, String param) {
        log.error("达到最大重试次数,或抛出了一个没有指定进行重试的异常:", e);
        return false;
    }

}
```

`RemoteAccessException`的异常才重试，`@Backoff(delay = 2000L,multiplier = 2))`表示第一次间隔2秒，以后都是次数的2倍,也就是第二次4秒，第三次6秒。

### 5、使用 SpringRetryTemplate

```java
/**
 * spring_retry 注解测试类
 *
 * @author xxl
 * @date 2022/12/26 23:11
 */
@Component
@Slf4j
public class SpringRetryDemoTest extends MyBaseTest {

    @Autowired
    private SpringRetryDemo springRetryDemo;

    /**
     * 只要在需要重试的方法上加@Retryable，在重试失败的回调方法上加@Recover
     */
    @Test
    public void retry() {
        boolean abc = springRetryDemo.call("abc");
        log.info("--结果是:{}--", abc);
    }
}
```

```java
/**
 * 测试基类
 *
 * @author xxl
 * @date 2022/12/26 22:47
 */
@EnableRetry
@RunWith(SpringRunner.class)
@SpringBootTest(classes = ReplyApplication.class)
@Slf4j
public class MyBaseTest {


    @Before
    public void init() {
        log.info("----------------测试开始---------------");
    }

    @After
    public void after() {
        log.info("----------------测试结束---------------");
    }

}
```

### 6、运行结果

```
2025-08-20 14:56:20.911  INFO 23704 --- [           main] com.xxl.test.MyBaseTest                  : ----------------测试开始---------------
2025-08-20 14:56:20.941  INFO 23704 --- [           main] c.xxl.retry.spring_retry.RetryDemoTask   : 收到请求参数:abc
2025-08-20 14:56:20.947  INFO 23704 --- [           main] c.xxl.retry.spring_retry.RetryDemoTask   : 随机生成的数:7
2025-08-20 14:56:20.947  INFO 23704 --- [           main] c.xxl.retry.spring_retry.RetryDemoTask   : 大于2,抛出自定义异常.
2025-08-20 14:56:22.962  INFO 23704 --- [           main] c.xxl.retry.spring_retry.RetryDemoTask   : 收到请求参数:abc
2025-08-20 14:56:22.962  INFO 23704 --- [           main] c.xxl.retry.spring_retry.RetryDemoTask   : 随机生成的数:5
2025-08-20 14:56:22.962  INFO 23704 --- [           main] c.xxl.retry.spring_retry.RetryDemoTask   : 大于2,抛出自定义异常.
2025-08-20 14:56:26.964  INFO 23704 --- [           main] c.xxl.retry.spring_retry.RetryDemoTask   : 收到请求参数:abc
2025-08-20 14:56:26.964  INFO 23704 --- [           main] c.xxl.retry.spring_retry.RetryDemoTask   : 随机生成的数:7
2025-08-20 14:56:26.964  INFO 23704 --- [           main] c.xxl.retry.spring_retry.RetryDemoTask   : 大于2,抛出自定义异常.
2025-08-20 14:56:26.968 ERROR 23704 --- [           main] c.x.r.springboot_retry.SpringRetryDemo   : 达到最大重试次数,或抛出了一个没有指定进行重试的异常:

org.springframework.remoting.RemoteAccessException: 大于2,抛出远程访问异常
	at com.xxl.retry.spring_retry.RetryDemoTask.retryTask(RetryDemoTask.java:43) ~[classes/:na]
	at com.xxl.retry.springboot_retry.SpringRetryDemo.call(SpringRetryDemo.java:29) ~[classes/:na]
	at com.xxl.retry.springboot_retry.SpringRetryDemo$$FastClassBySpringCGLIB$$6b624fcd.invoke(<generated>) ~[classes/:na]
	......

2025-08-20 14:56:26.969  INFO 23704 --- [           main] c.x.t.r.s.SpringRetryDemoTest            : --结果是:false--
2025-08-20 14:56:26.970  INFO 23704 --- [           main] com.xxl.test.MyBaseTest                  : ----------------测试结束---------------
```

## 参考资料

各种重试方案

https://www.cnblogs.com/jingzh/p/17000807.html

https://cloud.tencent.com/developer/article/2101159

https://segmentfault.com/a/1190000022962709

https://www.51cto.com/article/813479.html
