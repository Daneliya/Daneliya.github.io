---
url: /常用框架/SpringBoot/SpringBoot服务整合/1_SpringBoot整合数据源.md
---

# SpringBoot整合数据源

在实际项目开发中任何项目都很难脱离数据库而单独存在，所以为了提高数据库的操作性能，开发者往往会借助于数据库连接池来进行处理，同时在项目中利用DataSource进行数据源的连接。常用的有C3P0和Druid两类数据库连接池。

## SpringBoot整合C3P0数据库连接池

C3P0是一个开源的JDBC连接池，它实现了数据源和JNDI绑定，支持JDBC3规范和JDBC2的标准扩展，同时在Hibernate、Spring项目开发中被广泛应用。

### 1、引入依赖

修改父pom.xml配置文件，追加C3P0依赖支持管理。

```xml
<c3p0.version>0.9.1.2</c3p0.version>
<mysql-connector-java.version>5.1.21</mysql-connector-java.version>
...
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <version>${mysql-connector-java.version}</version>
</dependency>
<dependency>
    <groupId>c3p0</groupId>
    <artifactId>c3p0</artifactId>
    <version>${c3p0.version}</version>
</dependency>
```

修改pom.xml配置文件，引入C3P0的相关依赖支持库。

```xml
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
</dependency>

<dependency>
    <groupId>com.mchange</groupId>
    <artifactId>c3p0</artifactId>
</dependency>
```

### 2、修改配置文件

修改application.yml配置文件，追加C3P0数据库连接池配置信息。

```yaml
c3p0: # 定义C3P0配置
  jdbcUrl: jdbc:mysql://localhost:3306/xxl_springboot_action?serverTimezone=UTC # 数据库连接地址
  user: root                                # 数据库用户名
  password: 123456                           # 数据库密码
#  driverClass: org.gjt.mm.mysql.Driver      # 数据库驱动程序
  driverClass: com.mysql.cj.jdbc.Driver      # 数据库驱动程序
  minPoolSize: 1                            # 最小连接数
  maxPoolSize: 1                            # 最大连接数
  maxIdleTime: 3000                         # 最大等待时间
  initialPoolSize: 1                        # 初始化连接数
```

### 3、创建数据源连接池配置类

建立C3P0数据源连接池配置类，此时设置的Bean名称为dataSource。

```java
@Configuration
public class C3P0DatasourceConfig {
    @Bean(name = "dataSource")
    @ConfigurationProperties(prefix = "c3p0")    // 定义资源导入前导标记
    public DataSource dataSource() {
        return DataSourceBuilder.create().type(
                com.mchange.v2.c3p0.ComboPooledDataSource.class).build();
    }
}
```

### 4、测试

编写测试类，测试当前DataSource配置是否正确。

```java
@SpringBootTest(classes = SpringbootIntegrationC3p0Application.class)        // 定义要测试的SpringBoot类
@RunWith(SpringJUnit4ClassRunner.class)                            // 使用Junit进行测试
@WebAppConfiguration                                            // 进行Web应用配置
public class TestDataSource {
    @Autowired
    private DataSource dataSource;                                // 注入DataSource对象

    @Test
    public void testConnection() throws Exception {
        System.out.println(this.dataSource.getConnection());    // 获取连接
    }
}
```

如果有以下报错：

```sh
java.sql.SQLException: SSL connection required for plugin 'sha256_password'. Check if "useSSL" is set to "true".
```

在数据库连接后面追加`?useSSL=false`

```sh
java.sql.SQLException: The server time zone value 'ÖÐ¹ú±ê×¼Ê±¼ä' is unrecognized or represents more than one time zone. You must configure either the server or JDBC driver (via the serverTimezone configuration property) to use a more specifc time zone value if you want to utilize time zone support.
```

在数据库连接后面追加`?serverTimezone=UTC`

## SpringBoot整合Druid数据库连接池

Druid是阿里巴巴推出的一款数据库连接池组件（可以理解为C3P0的下一代产品），也是一个用于大数据实时查询和分析的高容错、高性能开源分布式系统，可高效处理大规模的数据并实现快速查询和分析。

### 1、引入依赖

修改父pom.xml文件，引入Druid的相关依赖库。

```xml
<druid.version>1.1.1</druid.version>
...
<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>druid</artifactId>
    <version>${druid.version}</version>
</dependency>
```

修改pom.xml配置文件，追加Druid依赖配置。

```xml
<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>druid</artifactId>
</dependency>
```

### 2、修改配置文件

修改application.yml配置文件，追加Druid的连接配置。

```yaml
spring:
  datasource:
    type: com.alibaba.druid.pool.DruidDataSource    # 配置当前要使用的数据源的操作类型
    driver-class-name: com.mysql.cj.jdbc.Driver     # 配置MySQL的驱动程序类
    url: jdbc:mysql://localhost:3306/xxl_springboot_action?serverTimezone=UTC           # 数据库连接地址
    username: root                                  # 数据库用户名
    password: 123456                                # 数据库连接密码
    dbcp2: # 进行数据库连接池的配置
      min-idle: 1                                   # 数据库连接池的最小维持连接数
      initial-size: 1                               # 初始化提供的连接数
      max-total: 1                                  # 最大的连接数
      max-wait-millis: 3000                         # 等待连接获取的最大超时时间
```

此时，项目中就可以采用Druid数据库连接池来进行数据库操作了。

> **提示：进行连接测试前需要导入相应ORM框架的依赖支持包。**
>
> 在本程序中，如果要进行DataSource连接测试，则需要导入ORM依赖关联包。例如，可以在本程序中导入MyBatis的ORM开发包。
>
> ```xml
> <dependency>
>     <groupId>org.mybatis.spring.boot</groupId>
>     <artifactId>mybatis-spring-boot-starter</artifactId>
>     <version>1.3.1</version>
> </dependency>
> ```
>
> 导入以上开发包之后，可以正常测试。如果未导入，则程序测试时会出现Unsatisfied DependencyException异常信息。
