---
url: /常用框架/SpringBoot/SpringBoot源码分析/资源填充类ResourceDatabasePopulator.md
---

# 资源填充类ResourceDatabasePopulator

## 1、类ResourceDatabasePopulator介绍

使用外部资源中定义的 SQL 脚本填充、初始化或清理数据库。

* 调用[addScript(org.springframework.core.io.Resource)](https://docs.spring.io/spring-framework/docs/5.3.13/javadoc-api/org/springframework/jdbc/datasource/init/ResourceDatabasePopulator.html#addScript-org.springframework.core.io.Resource-)以添加单个 SQL 脚本位置。
* 调用[addScripts(org.springframework.core.io.Resource...)](https://docs.spring.io/spring-framework/docs/5.3.13/javadoc-api/org/springframework/jdbc/datasource/init/ResourceDatabasePopulator.html#addScripts-org.springframework.core.io.Resource...-)以添加多个 SQL 脚本位置。
* 请参阅此类中的 setter 方法以获取更多配置选项。
* 调用[populate(java.sql.Connection)](https://docs.spring.io/spring-framework/docs/5.3.13/javadoc-api/org/springframework/jdbc/datasource/init/ResourceDatabasePopulator.html#populate-java.sql.Connection-)或[execute(javax.sql.DataSource)](https://docs.spring.io/spring-framework/docs/5.3.13/javadoc-api/org/springframework/jdbc/datasource/init/ResourceDatabasePopulator.html#execute-javax.sql.DataSource-)使用配置的脚本初始化或清理数据库。

## 2、方法总结

| 修饰符和类型 | 方法及说明                                                   |
| :----------- | :----------------------------------------------------------- |
| `void`       | `**`\**[addScript](https://docs.spring.io/spring-framework/docs/5.3.13/javadoc-api/org/springframework/jdbc/datasource/init/ResourceDatabasePopulator.html#addScript-org.springframework.core.io.Resource-)\**`**(Resource script)`添加要执行的脚本以初始化或清理数据库。 |
| `void`       | `**`\**[addScripts](https://docs.spring.io/spring-framework/docs/5.3.13/javadoc-api/org/springframework/jdbc/datasource/init/ResourceDatabasePopulator.html#addScripts-org.springframework.core.io.Resource...-)\**`**(Resource... scripts)`添加多个脚本来执行以初始化或清理数据库。 |
| `void`       | `**`\**[execute](https://docs.spring.io/spring-framework/docs/5.3.13/javadoc-api/org/springframework/jdbc/datasource/init/ResourceDatabasePopulator.html#execute-javax.sql.DataSource-)\**`**(DataSource dataSource)`针对`ResourceDatabasePopulator`给定的 [DataSource](https://docs.oracle.com/javase/8/docs/api/javax/sql/DataSource.html?is-external=true). |
| `void`       | `**`\**[populate](https://docs.spring.io/spring-framework/docs/5.3.13/javadoc-api/org/springframework/jdbc/datasource/init/ResourceDatabasePopulator.html#populate-java.sql.Connection-)\**`**(Connection connection)`使用提供的 JDBC 连接填充、初始化或清理数据库。 |
| `void`       | `**`\**[setBlockCommentEndDelimiter](https://docs.spring.io/spring-framework/docs/5.3.13/javadoc-api/org/springframework/jdbc/datasource/init/ResourceDatabasePopulator.html#setBlockCommentEndDelimiter-java.lang.String-)\**`**(String blockCommentEndDelimiter)`设置标识 SQL 脚本中的块注释的结束分隔符。 |
| `void`       | `**`\**[setBlockCommentStartDelimiter](https://docs.spring.io/spring-framework/docs/5.3.13/javadoc-api/org/springframework/jdbc/datasource/init/ResourceDatabasePopulator.html#setBlockCommentStartDelimiter-java.lang.String-)\**`**(String blockCommentStartDelimiter)`设置标识 SQL 脚本中的块注释的起始分隔符。 |
| `void`       | `**`\**[setCommentPrefix](https://docs.spring.io/spring-framework/docs/5.3.13/javadoc-api/org/springframework/jdbc/datasource/init/ResourceDatabasePopulator.html#setCommentPrefix-java.lang.String-)\**`**(String commentPrefix)`设置标识 SQL 脚本中单行注释的前缀。 |
| `void`       | `**`\**[setCommentPrefixes](https://docs.spring.io/spring-framework/docs/5.3.13/javadoc-api/org/springframework/jdbc/datasource/init/ResourceDatabasePopulator.html#setCommentPrefixes-java.lang.String...-)\**`**(String... commentPrefixes)`设置标识 SQL 脚本中单行注释的前缀。 |
| `void`       | `**`\**[setContinueOnError](https://docs.spring.io/spring-framework/docs/5.3.13/javadoc-api/org/springframework/jdbc/datasource/init/ResourceDatabasePopulator.html#setContinueOnError-boolean-)\**`**(boolean continueOnError)`指示应记录 SQL 中的所有失败但不会导致失败的标志。 |
| `void`       | `**`\**[setIgnoreFailedDrops](https://docs.spring.io/spring-framework/docs/5.3.13/javadoc-api/org/springframework/jdbc/datasource/init/ResourceDatabasePopulator.html#setIgnoreFailedDrops-boolean-)\**`**(boolean ignoreFailedDrops)`指示`DROP`可以忽略失败的 SQL 语句的标志。 |
| `void`       | `**`\**[setScripts](https://docs.spring.io/spring-framework/docs/5.3.13/javadoc-api/org/springframework/jdbc/datasource/init/ResourceDatabasePopulator.html#setScripts-org.springframework.core.io.Resource...-)\**`**(Resource... scripts)`设置要执行的脚本以初始化或清理数据库，替换之前添加的任何脚本。 |
| `void`       | `**`\**[setSeparator](https://docs.spring.io/spring-framework/docs/5.3.13/javadoc-api/org/springframework/jdbc/datasource/init/ResourceDatabasePopulator.html#setSeparator-java.lang.String-)\**`**(String separator)`指定语句分隔符（如果是自定义分隔符）。 |
| `void`       | `**`\**[setSqlScriptEncoding](https://docs.spring.io/spring-framework/docs/5.3.13/javadoc-api/org/springframework/jdbc/datasource/init/ResourceDatabasePopulator.html#setSqlScriptEncoding-java.lang.String-)\**`**(String sqlScriptEncoding)`如果与平台编码不同，请为配置的 SQL 脚本指定编码。 |

## 3、通过注解@PostConstruct实现SpringBoot项目启动初始化数据（执行sql文件）

```java
import cn.hutool.core.date.DateUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.datasource.init.ResourceDatabasePopulator;

import javax.annotation.PostConstruct;
import javax.sql.DataSource;
import java.util.Date;

/**
 * 项目启动初始化数据
 *
 * @Author: xxl
 * @Date: 2024/5/3 下午6:02
 */
@Configuration
@Slf4j
public class DataInitializationConfig {

    @Autowired
    DataSource dataSource;

    @PostConstruct
    public void init() {
        // 项目启动初始化基本数据
        log.info("数据初始化开始: " + DateUtil.format(new Date(), "yyyy-MM-dd HH:mm:ss"));
        // 通过直接读取sql文件执行
        ClassPathResource resources = new ClassPathResource("sql/client_api_init.sql");
        ResourceDatabasePopulator resourceDatabasePopulator = new ResourceDatabasePopulator();
        resourceDatabasePopulator.addScripts(resources);
        resourceDatabasePopulator.execute(dataSource);
        log.info("数据初始化结束: " + DateUtil.format(new Date(), "yyyy-MM-dd HH:mm:ss"));
    }
}
```

参考资料

https://www.cnblogs.com/tanqingfu1/p/16551756.html
