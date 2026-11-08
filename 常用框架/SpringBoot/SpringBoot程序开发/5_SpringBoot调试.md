---
url: /常用框架/SpringBoot/SpringBoot程序开发/5_SpringBoot调试.md
---

# SpringBoot调试

在项目开发的过程中经常需要对代码进行反复修改，这样就会导致SpringBoot运行容器反复启动。为了解决这种频繁重启问题，SpringBoot提供了自动加载配置的依赖库，以实现代码的动态加载。

修改pom.xml配置文件，追加自动加载依赖库配置。

```xml
<!-- SpringBoot调试 -->
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>springloaded</artifactId>
    <version>1.2.8.RELEASE</version>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-devtools</artifactId>
</dependency>
```

每当用户修改项目中程序类的时候都会由SpringBoot自动加载更新后的程序代码

但是需要注意的是

如果报错：SpringbootInitApplication: delete method not implemented SpringbootInitApplication: 虚拟机不支持的操作

**是因为HotSwap只支持对方法body的修改，不支持对类和方法签名的修改（比如修改类名，方法名，方法参数，添加或者删除一个方法，增加、删除类文件等，是不能够热部署到服务上的。这时候需要停止服务器重新部署后再启动，就不会出现上面的提示了等**

https://blog.csdn.net/Maxiao1204/article/details/103203515

[Idea环境实现SpringBoot实现两种热部署方式（亲测有效）-腾讯云开发者社区-腾讯云 (tencent.com)](https://cloud.tencent.com/developer/article/1542394)
