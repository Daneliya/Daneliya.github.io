---
url: /常用框架/SpringBoot/SpringBoot程序开发/7_使用Jetty容器.md
---

# 使用Jetty容器

## 一、前言

在我们使用 SpringBoot 开发Web应用时，会引入spring-boot-starter-web这个starter组件，其内嵌 Jetty , Tomcat , Undertow三种servlet 容器供大家选择，默认是Tomcat容器，所以我们平时新建项目启动起来，会看见Tomcat相关的一些信息。

```sh
Tomcat initialized with port(s): 8080 (http)
```

可以看出 Spring Boot 默认使用的是 Tomcat 容器启动的。

## 二、Tomcat 和Jetty对比

​		在日常工作中，Spring Boot 默认推荐的配置并一定适用于所有情况，根据项目配置以及环境，选择合适的容器，才能更好的搭建项目。

​		Tomcat 和Jetty都是一种Servlet引擎，可以将它们比作为中国与美国的关系，虽然 Jetty 正常成长为一个优秀的 Servlet 引擎，但是目前的 Tomcat 的地位仍然难以撼动。相比较来看，它们都有各自的优点与缺点。Tomcat 经过长时间的发展，它已经广泛的被市场接受和认可，相对 Jetty 来说 Tomcat 还是比较稳定和成熟，尤其在企业级应用方面，Tomcat 仍然是第一选择。但是随着 Jetty 的发展，Jetty 的市场份额也在不断提高。

  Jetty的架构比Tomcat的更为简单，Jetty的架构是基于Handler来实现的，主要的扩展功能都可以用Handler来实现，扩展简单。而Tomcat的架构是基于容器设计的，进行扩展是需要了解Tomcat的整体设计结构，不易扩展。

  Jetty和Tomcat性能方面差异不大。 Jetty可以同时处理大量连接而且可以长时间保持连接，适合于web聊天应用等等。Jetty的架构简单，因此作为服务器，Jetty可以按需加载组件，减少不需要的组件，减少了服务器内存开销，从而提高服务器性能。Jetty默认采用NIO（非阻塞IO）结束在处理I/O请求上更占优势，在处理静态资源时，性能较高。Tomcat适合处理少数非常繁忙的链接，也就是说链接生命周期短的话，Tomcat的总体性能更高。 另外，Tomcat默认采用BIO（阻塞IO）处理I/O请求，在处理静态资源时，性能较差。

  作为一个标准的 Servlet 引擎，它们都支持标准的 Servlet 和Java EE 规范。Jetty的应用更加快速，修改简单，对新的Servlet规范的支持较好。 Tomcat目前应用比较广泛，对JavaEE和Servlet的支持更加全面，很多特性会直接集成进来。

## 三、修改依赖，使用Jetty容器

默认情况下，因为 spring-boot-starter-web 自带了 Tomcat，所以我们要使用其它的容器的话，需要将其依赖包排除掉并重新引入新容器。在pom.xml文件，添加spring-boot-starter-jetty 依赖，同时我们需要排除 spring-boot-starter-web 默认的 spring-boot-starter-tomcat 依赖。

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
    <exclusions>
        <exclusion>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-tomcat</artifactId>
        </exclusion>
    </exclusions>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-jetty</artifactId>
</dependency>
```

## 四、Jetty 属性配置

| **属性**                                    | **默认值** | **说明**          |
| ------------------------------------------- | ---------- | ----------------- |
| **server.jetty.accesslog.enabled**          | false      | 是否打开Jetty日志 |
| **server.jetty.accesslog.dir**              |            | 访问日志所在目录  |
| **server.jetty.threads.max**                |            | 最大线程数        |
| **server.jetty.threads.min**                |            | 最小线程数        |
| **server.jetty.threads.max-queue-capacity** |            | 最大队列容量      |
| **server.jetty.threads.idle-timeout**       |            | 线程最大空闲时间  |

## 五、测试

修改完pom.xml文件后，需要重新启动SpringBoot项目，此时就可以在日志中看到如下信息。

```sh
Jetty started on port(s) 8080 (http/1.1) with context path '/'
```

程序可以使用小巧的Jetty容器来运行SpringBoot项目，但是这种做法也仅仅是在开发过程中使用，在实际的生产环境下依然推荐使用Tomcat作为Web容器。
