---
url: /常用框架/SpringBoot/SpringBoot程序开发/20_SpringBoot项目打包发布.md
---

# Spring Boot项目打包发布

Spring Boot 为我们使用、构建和运行 Spring 项目带来了极大的方便，Spring Boot 可以通过 Gradle 或者 Maven 插件将项目构建成可执行的 Jar 包，使得我们写的 Web 项目也可以直接通过 java -jar xxx.jar 方式直接启动，下面我们根据源码来看看，Spring Boot 是如何将代码及依赖的 Jar 包通过插件构建到一个完整的 Jar 包里。

根据 Spring 官方文档和 pom.xml 文件可以发现，Spring Boot 在 Maven 是通过引入 spring-boot-maven-plugin 插件来构建可执行 Jar 包的。

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>
        </plugin>
    </plugins>
</build>
```

我们可以找到 spring-boot-maven-plugin 官方文档[打包可执行档案 ：： Spring Boot](https://docs.spring.io/spring-boot/maven-plugin/packaging.html)，其实 spring-boot-maven-plugin 的真实配置是下面这样的，配置了一个名为 repackage 的 goal，如果项目使用了 spring-boot-starter-parent，它就默认帮我们省去了这个配置。

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>
            <executions>
                <execution>
                    <goals>
                        <goal>repackage</goal>
                    </goals>
                </execution>
            </executions>
        </plugin>
    </plugins>
</build>
```

将当前项目模块进行打包处理（clean package），打包完成后，会在项目的target目录下生成xxx.jar程序文件。

将xxx.jar文件复制到部署目录下，随后通过命令行方式执行此文件。

```sh
java -jar xxx.jar
```

此时，SpringBoot项目将以一个独立的\*.jar文件的方式执行。将此jar文件上传到任何配置有JDK的系统内，可以轻松实现项目的发布。

参考资料：https://blog.csdn.net/ttzommed/article/details/114984341
