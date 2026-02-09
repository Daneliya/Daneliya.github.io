---
url: /daily/面试专栏/SpringBoot/SpringBoot.md
---
# SpringBoot

### **1.** Spring Boot 自动配置原理是什么？条件注解如何工作？

**核心原理：**

* Spring Boot 通过 `@EnableAutoConfiguration` 触发自动配置。
* 它会扫描 `META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports`（Spring Boot 2.7+）或旧版的 `spring.factories` 文件，加载所有 `AutoConfiguration` 类。
* 每个 `AutoConfiguration` 类都使用 **条件注解（Conditional Annotations）** 控制是否生效。

![image-20260113135207201](/assets/image-20260113135207201.CIGwuT0m.png)

条件注解工作机制：

* 如 `@ConditionalOnClass`：检查 classpath 是否存在某类；
* `@ConditionalOnMissingBean`：只有当容器中没有该 Bean 时才创建；
* `@ConditionalOnProperty`：根据配置属性决定是否加载；
* 底层通过 `ConditionEvaluator` 在 BeanDefinition 注册阶段判断条件是否满足。

> ✅ **关键点**：自动配置是“约定优于配置”的体现，但可通过 `exclude` 或自定义 `@Conditional` 覆盖。

```mermaid
sequenceDiagram
    participant User
    participant OrderService
    participant MessageTable
    participant MQ
    participant StockService

    User->>OrderService: 下单请求
    OrderService->>MessageTable: 开启事务<br/>1. 插入订单<br/>2. 插入消息表（status=PENDING）
    MessageTable-->>OrderService: 提交事务
    OrderService->>MQ: 发送消息（异步 or 同步）
    MQ->>StockService: 消费消息 → 扣库存
    StockService-->>MQ: 成功 → 返回 ACK
    MQ->>OrderService: （可选）回调更新消息状态
    alt 失败重试
        loop 定时任务扫描
            OrderService->>MessageTable: 扫描 status=PENDING 的消息
            OrderService->>MQ: 重新投递
        end
    end
```
