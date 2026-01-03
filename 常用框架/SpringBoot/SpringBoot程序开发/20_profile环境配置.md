---
url: /常用框架/SpringBoot/SpringBoot程序开发/20_profile环境配置.md
---

# profile环境配置

在项目开发过程中需要考虑不同的运行环境：开发环境（dev）、测试环境（beta）和生产环境（product）。在以往的开发过程中通常使用Maven构建工具进行控制，但却需要进行大量的配置。SpringBoot考虑到此类问题，专门设计了profile支持。

## yml配置

修改application.yml配置文件，让其支持多profile配置

```yaml
spring:
  profiles:
    active: dev # 定义默认生效的环境
---
spring:
  profiles: dev
server:
  port: 7070 # 定义开发服务访问端口配置
---
spring:
  profiles: bate
server:
  port: 8080 # 定义测试服务访问端口配置
---
spring:
  profiles: product
server:
  port: 80 # 定义生产服务访问端口配置
```

在配置文件中一共定义了3个环境（不同的profile之间使用“---”分割）。

* 开发环境（profiles=dev、默认）：端口定义为7070。
* 测试环境（profiles=beta）：端口定义为8080。
* 生产环境（profiles=product）：端口定义为80。

如果要正常进行打包，还需要修改pom.xml文件，追加resource配置，主要的功能是进行源文件夹中内容的打包输出，配置完成后可以将配置文件打包到\*.jar文件中。

```xml
<resources>
    <resource>
        <directory>src/main/plexus</directory>
        <includes>
            <include>**/*.properties</include>
            <include>**/*.yml</include>
            <include>**/*.xml</include>
            <include>**/*.tld</include>
        </includes>
        <filtering>false</filtering>
    </resource>
    <resource>
        <directory>src/main/java</directory>
        <includes>
            <include>**/*.properties</include>
            <include>**/*.xml</include>
            <include>**/*.tld</include>
        </includes>
        <filtering>false</filtering>
    </resource>
</resources>
```

打包完成后一定要运行程序，如果不做出任何的指派，那么默认配置的活跃profile（dev）就将直接起作用

如果要切换到不同的profile环境，可以在启动时动态配置

```sh
java -jar xxx.jar --spring.profiles.active=product
```

## properties

\***.properties与\*.yml配置不同。**

使用application.yml进行多profile配置的时候，只需要在一个配置文件中使用“---”分割不同的profile配置。但是此类模式不适合于application.properties配置，此时应该采用不同的\*.properties保存不同的配置，才可以实现多profile。

定义3个针对不同运行环境的`application.properties`配置文件

【开发】application-dev.properties

```properties
server.port=7070
```

【测试】application-beta.properties

```properties
server.port=8080
```

【生产】application-product.properties

```properties
server.port=80
```

随后还是需要有一个公共的`application.properties`配置文件，用于指派可以使用的profile配置

定义公共的`application.properties`配置文件

```properties
spring.profiles.active=beta
```

随后的使用形式与application.yml配置相同。
