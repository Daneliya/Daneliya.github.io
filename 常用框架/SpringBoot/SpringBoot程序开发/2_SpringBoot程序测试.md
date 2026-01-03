---
url: /常用框架/SpringBoot/SpringBoot程序开发/2_SpringBoot程序测试.md
---

# SpringBoot程序测试

SpringBoot程序开发完成之后，需要对程序的功能进行测试，这时需要启动Spring容器。开发者可以直接利用SpringBoot提供的依赖包来实现控制层方法测试。

## 一、引入依赖

修改pom.xml配置文件，引入测试相关依赖包。

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <scope>test</scope>
</dependency>
<dependency>
    <groupId>junit</groupId>
    <artifactId>junit</artifactId>
    <scope>test</scope>
</dependency>
```

## 二、编写一个测试程序类

```java
package com.xxl.springboot.init.controller;

import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * @author xxl
 * @date 2024/12/29 0:21
 */
@Controller
@EnableAutoConfiguration
public class SampleController {

    @RequestMapping("/")
    @ResponseBody
    public String home() {
        return "www.xxl.cn";
    }

}

```

```java
package com.xxl.springboot.init.controller;

import junit.framework.TestCase;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;

/**
 * @author xxl
 * @date 2024/12/29 0:22
 */
@SpringBootTest(classes = SampleController.class)
@RunWith(SpringJUnit4ClassRunner.class)
@WebAppConfiguration
public class TestSampleController {

    @Autowired
    private SampleController sampleController;

    @Test
    public void testHome() {
        TestCase.assertEquals(this.sampleController.home(), "www.xxl.cnn");
    }
}

```

## 三、启动测试

测试程序编写完成之后，就可以启动测试了。

失败示例

```cmd
junit.framework.ComparisonFailure: 
预期:www.xxl.cn
实际:www.xxl.cnn
<点击以查看差异>


	at junit.framework.Assert.assertEquals(Assert.java:100)
	at junit.framework.Assert.assertEquals(Assert.java:107)
	at junit.framework.TestCase.assertEquals(TestCase.java:260)
	at com.xxl.springboot.init.controller.TestSampleController.testHome(TestSampleController.java:25)
...
...
```

> 补充
>
> 利用MockMvc编写测试用例：https://developer.aliyun.com/article/1641912
