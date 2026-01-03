---
url: /常用框架/Spring/4_SpringAOP实战之日志拦截.md
---

# SpringAOP实战之日志拦截

创建maven项目

### 1. pom.xml文件中加入依赖

```xml
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>2.0.5.RELEASE</version>
    <relativePath/>
</parent>
```

### 2. pom.xml文件中加入springboot-starter依赖

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>

    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
    </dependency>

    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-aop</artifactId>
    </dependency>

    <dependency>
        <groupId>com.alibaba</groupId>
        <artifactId>fastjson</artifactId>
        <version>1.2.72</version>
    </dependency>
</dependencies>
```

### 3. pom.xml文件中加入maven-springboot打包插件

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

### 4. 开发启动类

```java
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * 启动类
 *
 * @author xxl
 * @date 2022/5/8 18:54
 */
@SpringBootApplication
public class Application {

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

}
```

### 5. 开发用户实体类

```java
import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * 用户实体
 *
 * @author xxl
 * @date 2022/5/8 18:55
 */
@Data
@AllArgsConstructor
public class User {

    private Integer id;
    private String name;
    private Integer age;

}
```

### 6. 开发获取参数工具类

```java
import com.alibaba.fastjson.JSONObject;

import javax.servlet.http.HttpServletRequest;
import java.util.Enumeration;

/**
 * 获取参数工具类
 *
 * @author xxl
 * @date 2022/5/8 18:56
 */
public class ParametersUtils {

    public static String getParameters(HttpServletRequest req) {
        Enumeration<String> enums = req.getParameterNames();
        JSONObject parameter = new JSONObject();
        while (enums.hasMoreElements()) {
            String name = enums.nextElement();
            parameter.put(name, req.getParameter(name));
        }
        return parameter.toJSONString();
    }

}
```

### 7. 开发参数记录aop类

```java
import com.xxl.util.ParametersUtils;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;

/**
 * 参数记录AOP类
 *
 * @author xxl
 * @date 2022/5/8 19:55
 */
@Slf4j
@Aspect
@Component
public class WebLogAspect {

    @Pointcut("execution(public * com.xxl.controller..*.*(..))")
    public void webLog() {
    }

    @Before("webLog()")
    public void doBefore() {
        // 获取请求
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attributes == null) {
            return;
        }
        HttpServletRequest request = attributes.getRequest();
        // 记录请求内容
        log.info("请求地址：" + request.getRequestURL().toString());
        log.info("请求方法：" + request.getMethod());
        log.info("请求者IP：" + request.getRemoteAddr());
        log.info("请求参数：" + ParametersUtils.getParameters(request));
    }

    @AfterReturning(returning = "ret", pointcut = "webLog()")
    public void doAfterReturning(Object ret) {
        log.info("返回结果：" + ret.toString());
    }

}
```

### 8. 开发测试控制器类

```java
import com.xxl.vo.User;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 测试控制器
 *
 * @author xxl
 * @date 2022/5/8 18:57
 */
@RestController
public class DemoController {

    @RequestMapping("/test")
    public User test(User user) {
        user.setAge(18);
        return user;
    }

}
```

最后编译打包运行。

> 获取作者源码访问
>
> [Daneliya/springboot\_chowder: springboot大乱炖 (github.com)](https://github.com/Daneliya/springboot_chowder/tree/main/springboot_access_log)
