---
url: /Java/微服务专栏/03.注册中心/4_Nacos配置管理.md
---

# Nacos配置管理

Nacos除了可以做注册中心，同样可以做配置管理来使用。

## 一、统一配置管理

当微服务部署的实例越来越多，达到数十、数百时，逐个修改微服务配置就会让人抓狂，而且很容易出错。我们需要一种统一配置管理方案，可以集中管理所有实例的配置。

![image-20210714164426792](/assets/image-20210714164426792-1694452160185.CEjo8FcL.png)

Nacos一方面可以将配置集中管理，另一方可以在配置变更时，及时通知微服务，实现配置的热更新。

### 1.1.在nacos中添加配置文件

如何在nacos中管理配置呢？

![image-20210714164742924](/assets/image-20210714164742924-1694452160186.DxFcF70H.png)

然后在弹出的表单中，填写配置信息：

![image-20210714164856664](/assets/image-20210714164856664-1694452160186.DqtGQFpD.png)

> 注意：项目的核心配置，需要热更新的配置才有放到nacos管理的必要。基本不会变更的一些配置还是保存在微服务本地比较好。

### 1.2.从微服务拉取配置

微服务要拉取nacos中管理的配置，并且与本地的application.yml配置合并，才能完成项目启动。

但如果尚未读取application.yml，又如何得知nacos地址呢？

因此spring引入了一种新的配置文件：bootstrap.yaml文件，会在application.yml之前被读取，流程如下：

![img](/assets/L0iFYNF-1694452160186.C9_6LeNO.png)

#### 1）引入nacos-config依赖

首先，在user-service服务中，引入nacos-config的客户端依赖：

```xml
<!--nacos配置管理依赖-->
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-nacos-config</artifactId>
</dependency>
```

#### 2）添加bootstrap.yaml

然后，在user-service中添加一个bootstrap.yaml文件，内容如下：

```yaml
spring:
  application:
    name: userservice # 服务名称
  profiles:
    active: dev #开发环境，这里是dev 
  cloud:
    nacos:
      server-addr: localhost:8848 # Nacos地址
      config:
        file-extension: yaml # 文件后缀名
```

这里会根据spring.cloud.nacos.server-addr获取nacos地址，再根据

`${spring.application.name}-${spring.profiles.active}.${spring.cloud.nacos.config.file-extension}`作为文件id，来读取配置。

本例中，就是去读取`userservice-dev.yaml`：

![image-20210714170845901](/assets/image-20210714170845901-1694452160186.iiCwtZHR.png)

#### 3）读取nacos配置

在user-service中的UserController中添加业务逻辑，读取pattern.dateformat配置：

![image-20210714170337448](/assets/image-20210714170337448-1694452160186.coSC81LC.png)

完整代码：

```java
package com.xxl.user.web;

import com.xxl.user.pojo.User;
import com.xxl.user.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Slf4j
@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;

    @Value("${pattern.dateformat}")
    private String dateformat;
    
    @GetMapping("now")
    public String now(){
        return LocalDateTime.now().format(DateTimeFormatter.ofPattern(dateformat));
    }
    // ...略
}
```

在页面访问，可以看到效果：

![image-20210714170449612](/assets/image-20210714170449612-1694452160186.CgaRrUv8.png)

## 二、配置热更新

我们最终的目的，是修改nacos中的配置后，微服务中无需重启即可让配置生效，也就是**配置热更新**。

要实现配置热更新，可以使用两种方式：

### 2.1.方式一：@RefreshScope

在`@Value`注入的变量所在类上添加注解`@RefreshScope`：

![image-20210714171036335](/assets/image-20210714171036335-1694452160186.BL86lGTX.png)

### 2.2.方式二：@ConfigurationProperties

使用`@ConfigurationProperties`注解代替`@Value`注解。

在user-service服务中，添加一个类，读取`patterrn.dateformat`属性：

```java
package cn.itcast.user.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@Data
@ConfigurationProperties(prefix = "pattern")
public class PatternProperties {
    private String dateformat;
}
```

在UserController中使用这个类代替@Value：

![image-20210714171316124](/assets/image-20210714171316124-1694452160186.Ef6me41J.png)

完整代码：

```java
package com.xxl.user.web;

import com.xxl.user.config.PatternProperties;
import com.xxl.user.pojo.User;
import com.xxl.user.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Slf4j
@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private PatternProperties patternProperties;

    @GetMapping("now")
    public String now(){
        return LocalDateTime.now().format(DateTimeFormatter.ofPattern(patternProperties.getDateformat()));
    }

    // 略
}
```

## 三、配置共享

其实微服务启动时，会去nacos读取多个配置文件，例如：

* `[spring.application.name]-[spring.profiles.active].yaml`，例如：userservice-dev.yaml

* `[spring.application.name].yaml`，例如：userservice.yaml

而`[spring.application.name].yaml`不包含环境，因此可以被多个环境共享。

下面我们通过案例来测试配置共享

### 3.1.添加一个环境共享配置

我们在nacos中添加一个userservice.yaml文件：

![image-20210714173233650](/assets/image-20210714173233650-1694452160186.CAH8QDoC.png)

### 3.2.在user-service中读取共享配置

在user-service服务中，修改PatternProperties类，读取新添加的属性：

![image-20210714173324231](/assets/image-20210714173324231-1694452160186.BctAh_bU.png)

在user-service服务中，修改UserController，添加一个方法：

![image-20210714173721309](/assets/image-20210714173721309-1694452160186.C4Az1x9T.png)

### 3.3.运行两个UserApplication，使用不同的profile

修改UserApplication2这个启动项，改变其profile值：

![image-20210714173538538](/assets/image-20210714173538538-1694452160186.prLUTPFr.png)

![image-20210714173519963](/assets/image-20210714173519963-1694452160186.DlPzkNPf.png)

这样，UserApplication(8081)使用的profile是dev，UserApplication2(8082)使用的profile是test。

启动UserApplication和UserApplication2

访问http://localhost:8081/user/prop，结果：

![image-20210714174313344](/assets/image-20210714174313344-1694452160187.m41qp4U7.png)

访问http://localhost:8082/user/prop，结果：

![image-20210714174424818](/assets/image-20210714174424818-1694452160187.Cxo-CR1L.png)

可以看出来，不管是dev，还是test环境，都读取到了envSharedValue这个属性的值。

### 3.4.配置共享的优先级

当nacos、服务本地同时出现相同属性时，优先级有高低之分：

![image-20210714174623557](/assets/image-20210714174623557-1694452160187.ChOYnlFH.png)

## 参考资料

https://blog.csdn.net/u011066470/article/details/129271345
