---
url: /常用框架/SpringBoot/SpringBoot程序开发/10_整合Spring配置.md
---

# 整合Spring配置

在进行Spring项目配置的时候，可以通过\*.xml文件配置，也可以通过Bean（@Configuration注解）配置。SpringBoot延续了Spring这一特点，在SpringBoot项目中依然可以使用配置文件定义。

## 一、xml文件配置方式

建立一个`MessageUtil`的工具类，在`MessageUtil`类中定义一个`getInfo()`方法，该方法的主要功能是返回一个提示信息。

```java
public class MessageUtil {

    public String getInfo() {
        return "www.xxl.cn";
    }

}
```

在`src/main/resources`目录中创建spring的子目录，并且建立`spring-util.xml`配置文件。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
       http://www.springframework.org/schema/beans/spring-beans.xsd">
    <!-- 定义bean配置 -->
    <bean id="messageUtil" class="com.xxl.springboot.init.util.MessageUtil"/>
</beans>

```

在Controller程序类中注入`MessageUtil`类对象，并且调用方法返回信息。

```java
@Autowired
private MessageUtil messageUtil; // XML配置注入

@GetMapping("/info")
public Object info() {
    // 调用方法
    return this.messageUtil.getInfo();
}
```

修改程序启动主类，定义要导入的Spring配置文件。

```java
/**
 * 启动类
 */
@SpringBootApplication
@ImportResource(locations = {"classpath:spring/spring-util.xml"})
public class SpringbootInitApplication {

    public static void main(String[] args) {
        SpringApplication.run(SpringbootInitApplication.class, args);
    }

}
```

本程序在定义启动主类时，利用`@ImportResource`注解导入了所需要的Spring配置文件，而后会自动将配置文件中定义bean对象注入到Controller类的属性中。

访问：http://127.0.0.1/xxl/info，返回：www.xxl.cn

## 二、Bean配置方式

SpringBoot强调的就是“零配置”，虽然其本身支持配置文件定义，但很明显xml的配置形式不是最好的。如果确定要引入其他配置，强烈建议使用Bean的配置形式来完成。

```java
/**
 * 配置bean
 *
 * @author xxl
 * @date 2024/12/31 22:28
 */
@Configuration
public class DefaultConfig {

    /**
     * 定义bean
     *
     * @return
     */
    @Bean(name = "messageUtil")
    public MessageUtil getMessageUtil() {
        // 配置bean对象
        return new MessageUtil();
    }
}
```

DefaultConfig定义在程序主类所在的子包之中，这样就可以在SpringBoot程序启动时自动扫描配置并进行加载。对于程序的主类，也就没有必要使用@ImportResource注解读取配置文件了。

> **提问：实际开发中使用配置文件还是使用Bean类配置？**
>
> 在编写SpringBoot项目的过程之中，是采用\*.xml配置更好，还是利用Bean类配置会更好？
>
> **回答：崇尚“零配置”的SpringBoot项目建议使用Bean配置。**
>
> 在SpringBoot项目中进行配置的时候，实际上有3种支持，按照优先选择顺序为：application.yml、Bean配置和\*.xml配置文件。大部分的配置都可以在application.yml（相当于传统项目中的profile配置作用）里面完成，但很多情况下会利用Bean类来进行扩展配置（本书主要使用此形式来作为扩展配置）。之所以提供\*.xml配置文件的支持，主要目的是帮助开发者用已有代码快速整合SpringBoot开发框架。

扩展—依赖注入：https://blog.csdn.net/qq\_37391214/article/details/106863892
