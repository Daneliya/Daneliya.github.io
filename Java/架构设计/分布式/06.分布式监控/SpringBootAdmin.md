---
url: /Java/架构设计/分布式/06.分布式监控/SpringBootAdmin.md
---

# SpringBootAdmin系统监控

## 概述

SpringBoot提供了actuator服务，用于系统监控，但是只提供json数据，而SpringBootAdmin 能够将Actuator中的信息进行界面化的展示，也可以监控所有SpringBoot应用的健康状况，提供实时警报功能。

SpringBootAdmin的主要功能有：

* 显示应用程序的监控状态
* 应用程序上下线监控
* 查看 JVM，线程信息
* 可视化的查看日志以及下载日志文件
* 动态切换日志级别
* Http 请求信息跟踪

## SpringBoot集成

admin分为server端和client端

> 排坑：如果Sprigboot依赖是2.1.x 引入的admin也是2.1.x，如果是2.3.x引入的就是2.3.x

### Server端服务搭建

新建一个工程，名为springboot-admin-server。

依赖引入

```xml
<dependencies>
    <!--项目中添加 spring-boot-starter-->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <!-- SpringBootAdmin -->
    <dependency>
        <groupId>de.codecentric</groupId>
        <artifactId>spring-boot-admin-starter-server</artifactId>
        <version>2.3.1</version>
    </dependency>
    <!--Spring boot 安全监控-->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-actuator</artifactId>
    </dependency>
</dependencies>
```

启动类加注解

```java
@EnableAdminServer
@SpringBootApplication
public class SpringbootAdminServerApplication {

	public static void main(String[] args) {
		SpringApplication.run(SpringbootAdminServerApplication.class, args);
	}

}
```

服务端配置

```yaml
server:
  port: 13006
#  servlet:
#    context-path: /xxl-springboot-admin

spring:
  application:
    name: xxl-admin # 应用名

# 暴露端点
management:
  endpoints:
    web:
      exposure:
        include: '*'  # 需要开放的端点。默认值只打开 health 和 info 两个端点。通过设置 *, 可以开放所有端点
  endpoint:
    health:
      show-details: always
```

### client端依赖引入

新建一个工程，名为springboot-admin-client，工程中引入如下依赖。或直接在common中引入，多个client中引入common模块，则代表所有client端都引入了。

```xml
<!-- SpringBoot Admin 客户端依赖 -->
<dependency>
    <groupId>de.codecentric</groupId>
    <artifactId>spring-boot-admin-starter-client</artifactId>
    <version>2.3.1</version>
</dependency>
<!--Spring boot 安全监控-->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

所有微服务（客户端）配置：

```yaml
management:
  endpoints:
    web:
      exposure:
        include: '*'
```

配置成功后访问：http://localhost:13006

> 获取本文档所有代码可访问
>
> [springboot\_chowder/springboot\_admin\_client at main · Daneliya/springboot\_chowder (github.com)](https://github.com/Daneliya/springboot_chowder/tree/main/springboot_admin_client)
>
> [springboot\_chowder/springboot\_admin\_server at main · Daneliya/springboot\_chowder (github.com)](https://github.com/Daneliya/springboot_chowder/tree/main/springboot_admin_server)

参考资料：

\[1]. [若依中关于SpringBootAdmin的使用](http://doc.ruoyi.vip/ruoyi-cloud/cloud/monitor.html#%E7%99%BB%E5%BD%95%E8%AE%A4%E8%AF%81)

\[2]. [Spring Boot Admin 介绍及使用\_bootadmin-CSDN博客](https://blog.csdn.net/zouliping123456/article/details/121977792)

\[3]. [Spring Boot Admin 监控指标接入Grafana可视化的实例详解(IT技术) (qb5200.com)](https://www.qb5200.com/article/589139.html)

\[4]. [springboot基础(54):Spring Boot Admin的metrics端点指标控制\_springboot admin metrics-CSDN博客](https://blog.csdn.net/u011628753/article/details/125922904)
