---
url: /常用框架/重试框架/2_Guava-Retry.md
---

# Guava-Retry

Guava retryer工具与spring-retry类似，都是通过定义重试者角色来包装正常逻辑重试，但是Guava retryer有更优的策略定义，在支持重试次数和重试频度控制基础上，能够兼容支持多个异常或者自定义实体对象的重试源定义，让重试功能有更多的灵活性。

Guava Retryer也是线程安全的，入口调用逻辑采用的是Java.util.concurrent.Callable的call方法。

### 1、引入依赖

```xml
<!-- https://mvnrepository.com/artifact/com.github.rholder/guava-retrying -->
<dependency>
    <groupId>com.github.rholder</groupId>
    <artifactId>guava-retrying</artifactId>
    <version>2.0.0</version>
</dependency>
```

### 2、重试方法

```java
/**
 * Guava-Retry 重试方法
 *
 * @author xxl
 * @date 2022/12/26 23:20
 */
@Slf4j
public class RetryDemoTask {

    /**
     * 重试方法
     *
     * @return
     */
    public static boolean retryTask(String param) {
        log.info("收到请求参数:{}", param);

        int i = RandomUtils.nextInt(0, 11);
        log.info("随机生成的数:{}", i);
        if (i < 2) {
            log.info("为0,抛出参数异常.");
            throw new IllegalArgumentException("参数异常");
        } else if (i < 5) {
            log.info("为1,返回true.");
            return true;
        } else if (i < 7) {
            log.info("为2,返回false.");
            return false;
        } else {
            //为其他
            log.info("大于2,抛出自定义异常.");
            throw new RemoteAccessException("大于2,抛出自定义异常");
        }
    }

}
```

### 3、重试测试类

```java
/**
 * Guava-Retry 重试测试类
 *
 * @author xxl
 * @date 2022/12/26 23:23
 */
public class GuavaRetryTest {

    @Test
    public void fun01() {
        // RetryerBuilder 构建重试实例 retryer,可以设置重试源且可以支持多个重试源，可以配置重试次数或重试超时时间，以及可以配置等待时间间隔
        Retryer<Boolean> retryer = RetryerBuilder.<Boolean>newBuilder()
                .retryIfExceptionOfType(RemoteAccessException.class)//设置异常重试源
                .retryIfResult(res -> res == false)  //设置根据结果重试
                .withWaitStrategy(WaitStrategies.fixedWait(3, TimeUnit.SECONDS)) //设置等待间隔时间
                .withStopStrategy(StopStrategies.stopAfterAttempt(3)) //设置最大重试次数
                .build();

        try {
            retryer.call(() -> RetryDemoTask.retryTask("abc"));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}
```

### 4、运行测试

```
17:24:19.994 [main] INFO com.xxl.retry.guava_retry.RetryDemoTask - 收到请求参数:abc
17:24:20.006 [main] INFO com.xxl.retry.guava_retry.RetryDemoTask - 随机生成的数:6
17:24:20.006 [main] INFO com.xxl.retry.guava_retry.RetryDemoTask - 为2,返回false.
17:24:23.010 [main] INFO com.xxl.retry.guava_retry.RetryDemoTask - 收到请求参数:abc
17:24:23.010 [main] INFO com.xxl.retry.guava_retry.RetryDemoTask - 随机生成的数:10
17:24:23.011 [main] INFO com.xxl.retry.guava_retry.RetryDemoTask - 大于2,抛出自定义异常.
17:24:26.016 [main] INFO com.xxl.retry.guava_retry.RetryDemoTask - 收到请求参数:abc
17:24:26.016 [main] INFO com.xxl.retry.guava_retry.RetryDemoTask - 随机生成的数:1
17:24:26.016 [main] INFO com.xxl.retry.guava_retry.RetryDemoTask - 为0,抛出参数异常.
java.util.concurrent.ExecutionException: java.lang.IllegalArgumentException: 参数异常
	at com.github.rholder.retry.Retryer$ExceptionAttempt.<init>(Retryer.java:254)
	at com.github.rholder.retry.Retryer.call(Retryer.java:163)
	at com.xxl.retry.guava_retry.GuavaRetryTest.fun01(GuavaRetryTest.java:31)
	at java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
	...
Caused by: java.lang.IllegalArgumentException: 参数异常
	at com.xxl.retry.guava_retry.RetryDemoTask.retryTask(RetryDemoTask.java:28)
	at com.xxl.retry.guava_retry.GuavaRetryTest.lambda$fun01$1(GuavaRetryTest.java:31)
```

### 参考资料

guava-retrying参数详解：https://cloud.tencent.com/developer/article/1752086

https://www.cnblogs.com/leeego-123/p/12741108.html

https://blog.csdn.net/ch98000/article/details/126554577
