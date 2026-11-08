---
url: /常用框架/Mybatis/Mybatis增强框架Mybatis-Flex.md
---

# Mybatis增强框架Mybatis-Flex

> 官方文档：<https://mybatis-flex.com/>

## 一、Mybatis-Flex 是什么

Mybatis-Flex 是一个优雅的 Mybatis 增强框架，它非常轻量、同时拥有极高的性能与灵活性。我们可以轻松的使用 Mybaits-Flex 链接任何数据库，其内置的 QueryWrapper^亮点 帮助我们极大的减少了 SQL 编写的工作的同时，减少出错的可能性。

总而言之，Mybatis-Flex 能够极大地提高我们的开发效率和开发体验，让我们有更多的时间专注于自己的事情。

## 二、Mybatis-Flex的有什么特点

**1、轻量**：除了 MyBatis，没有任何第三方依赖轻依赖、没有任何拦截器，其原理是通过 SqlProvider 的方式实现的轻实现。同时，在执行的过程中，没有任何的 Sql 解析（Parse）轻运行。 这带来了几个好处：1、极高的性能；2、极易对代码进行跟踪和调试； 3、把控性更高。

**2、灵活**：支持 Entity 的增删改查、以及分页查询的同时，Mybatis-Flex 提供了 Db + Row^灵活 工具，可以无需实体类对数据库进行增删改查以及分页查询。 与此同时，Mybatis-Flex 内置的 QueryWrapper^灵活 可以轻易的帮助我们实现 **多表查询**、**链接查询**、**子查询** 等等常见的 SQL 场景。

**3、强大**：支持任意关系型数据库，还可以通过方言持续扩展，同时支持 **多（复合）主键**、**逻辑删除**、**乐观锁配置**、**数据脱敏**、**数据审计**、 **数据填充** 等等功能。

## 三、Mybatis-Flex和同类框架对比

### 1）功能对比：

| 功能或特点                                                   | MyBatis-Flex | MyBatis-Plus       | Fluent-MyBatis |
| :----------------------------------------------------------- | :----------- | :----------------- | :------------- |
| 对 entity 的基本增删改查                                     | ✅            | ✅                  | ✅              |
| 分页查询                                                     | ✅            | ✅                  | ✅              |
| 分页查询之总量缓存                                           | ✅            | ✅                  | ❌              |
| 分页查询无 SQL 解析设计（更轻量，及更高性能）                | ✅            | ❌                  | ✅              |
| 多表查询：from 多张表                                        | ✅            | ❌                  | ❌              |
| 多表查询：left join、inner join 等等                         | ✅            | ❌                  | ✅              |
| 多表查询：union，union all                                   | ✅            | ❌                  | ✅              |
| 单主键配置                                                   | ✅            | ✅                  | ✅              |
| 多种 id 生成策略                                             | ✅            | ✅                  | ✅              |
| 支持多主键、复合主键                                         | ✅            | ❌                  | ❌              |
| 字段的 typeHandler 配置                                      | ✅            | ✅                  | ✅              |
| 除了 MyBatis，无其他第三方依赖（更轻量）                     | ✅            | ❌                  | ❌              |
| QueryWrapper 是否支持在微服务项目下进行 RPC 传输             | ✅            | ❌                  | 未知           |
| 逻辑删除                                                     | ✅            | ✅                  | ✅              |
| 乐观锁                                                       | ✅            | ✅                  | ✅              |
| SQL 审计                                                     | ✅            | ❌                  | ❌              |
| 数据填充                                                     | ✅            | ✔️ **（收费）**     | ✅              |
| 数据脱敏                                                     | ✅            | ✔️ **（收费）**     | ❌              |
| 字段权限                                                     | ✅            | ✔️ **（收费）**     | ❌              |
| 字段加密                                                     | ✅            | ✔️ **（收费）**     | ❌              |
| 字典回写                                                     | ✅            | ✔️ **（收费）**     | ❌              |
| Db + Row                                                     | ✅            | ❌                  | ❌              |
| Entity 监听                                                  | ✅            | ❌                  | ❌              |
| 多数据源支持                                                 | ✅            | 借助其他框架或收费 | ❌              |
| 多数据源是否支持 Spring 的事务管理，比如 @Transactional 和 TransactionTemplate 等 | ✅            | ❌                  | ❌              |
| 多数据源是否支持 "非Spring" 项目                             | ✅            | ❌                  | ❌              |
| 多租户                                                       | ✅            | ✅                  | ❌              |
| 动态表名                                                     | ✅            | ✅                  | ❌              |
| 动态 Schema                                                  | ✅            | ❌                  | ❌              |

### 2）性能对比：

**这里直接贴测试结果：**

* MyBatis-Flex 的查询单条数据的速度，大概是 MyBatis-Plus 的 5 ~ 10+ 倍。
* MyBatis-Flex 的查询 10 条数据的速度，大概是 MyBatis-Plus 的 5~10 倍左右。
* Mybatis-Flex 的分页查询速度，大概是 Mybatis-Plus 的 5~10 倍左右。
* Mybatis-Flex 的数据更新速度，大概是 Mybatis-Plus 的 5~10+ 倍。

**具体性能对比测试，移步：**

> * <https://mybatis-flex.com/zh/intro/benchmark.html>

## 四、Mybatis-Flex支持的数据库类型

MyBatis-Flex 支持的数据库类型，如下表格所示，我们还可以通过自定义方言的方式，持续添加更多的数据库支持。

| 数据库        | 描述                    |
| :------------ | :---------------------- |
| mysql         | MySQL 数据库            |
| mariadb       | MariaDB 数据库          |
| oracle        | Oracle11g 及以下数据库  |
| oracle12c     | Oracle12c 及以上数据库  |
| db2           | DB2 数据库              |
| hsql          | HSQL 数据库             |
| sqlite        | SQLite 数据库           |
| postgresql    | PostgreSQL 数据库       |
| sqlserver2005 | SQLServer2005 数据库    |
| sqlserver     | SQLServer 数据库        |
| dm            | 达梦数据库              |
| xugu          | 虚谷数据库              |
| kingbasees    | 人大金仓数据库          |
| phoenix       | Phoenix HBase 数据库    |
| gauss         | Gauss 数据库            |
| clickhouse    | ClickHouse 数据库       |
| gbase         | 南大通用(华库)数据库    |
| gbase-8s      | 南大通用数据库 GBase 8s |
| oscar         | 神通数据库              |
| sybase        | Sybase ASE 数据库       |
| OceanBase     | OceanBase 数据库        |
| Firebird      | Firebird 数据库         |
| derby         | Derby 数据库            |
| highgo        | 瀚高数据库              |
| cubrid        | CUBRID 数据库           |
| goldilocks    | GOLDILOCKS 数据库       |
| csiidb        | CSIIDB 数据库           |
| hana          | SAP\_HANA 数据库         |
| impala        | Impala 数据库           |
| vertica       | Vertica 数据库          |
| xcloud        | 行云数据库              |
| redshift      | 亚马逊 redshift 数据库  |
| openGauss     | 华为 openGauss 数据库   |
| TDengine      | TDengine 数据库         |
| informix      | Informix 数据库         |
| greenplum     | Greenplum 数据库        |
| uxdb          | 优炫数据库              |

## 五、快速开始

**第 1 步：创建数据库表**

```sql
CREATE TABLE IF NOT EXISTS `tb_account`
(
    `id`        INTEGER PRIMARY KEY auto_increment,
    `user_name` VARCHAR(100),
    `age`       INTEGER,
    `birthday`  DATETIME
);

INSERT INTO tb_account(id, user_name, age, birthday)
VALUES (1, '张三', 18, '2020-01-11'),
       (2, '李四', 19, '2021-03-21');
```

**第 2 步：创建 Spring Boot 项目，并添加 Maven 依赖**

> TIP：可以使用 Spring Initializer 快速初始化一个 Spring Boot 工程。

需要添加的 Maven 主要依赖示例：

```xml
<dependencies>
    <dependency>
        <groupId>com.mybatis-flex</groupId>
        <artifactId>mybatis-flex-spring-boot-starter</artifactId>
        <version>1.5.3</version>
    </dependency>
    <dependency>
        <groupId>com.mysql</groupId>
        <artifactId>mysql-connector-j</artifactId>
        <scope>runtime</scope>
    </dependency>
    <dependency>
        <groupId>com.zaxxer</groupId>
        <artifactId>HikariCP</artifactId>
    </dependency>
    <!-- for test only -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
    </dependency>
</dependencies>
```

**第 3 步：对 Spring Boot 项目进行配置**

在 application.yml 中配置数据源：

```yaml
# DataSource Config
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/flex_test
    username: root
    password: 12345678
```

在 Spring Boot 启动类中添加 `@MapperScan` 注解，扫描 Mapper 文件夹：

```java
@SpringBootApplication
@MapperScan("com.mybatisflex.test.mapper")
public class MybatisFlexTestApplication {

    public static void main(String[] args) {
        SpringApplication.run(MybatisFlexTestApplication.class, args);
    }

}
```

**第 4 步：编写实体类和 Mapper 接口**

这里使用了 Lombok 来简化代码。

```java
@Data
@Table("tb_account")
public class Account {

    @Id(keyType = KeyType.Auto)
    private Long id;
    private String userName;
    private Integer age;
    private Date birthday;

}
```

* 使用 `@Table("tb_account")` 设置实体类与表名的映射关系
* 使用 `@Id(keyType = KeyType.Auto)` 标识主键为
* 自增

Mapper 接口继承 BaseMapper 接口：

```java
public interface AccountMapper extends BaseMapper<Account> {

}
```

这部分也可以使用 MyBatis-Flex 的代码生成器来生，功能非常强大的。详情进入：

> * <https://mybatis-flex.com/zh/others/codegen.html>

**第 5 步：开始使用**

添加测试类，进行功能测试：

```java
import static com.mybatisflex.test.entity.table.AccountTableDef.ACCOUNT;

@SpringBootTest
class MybatisFlexTestApplicationTests {

    @Autowired
    private AccountMapper accountMapper;

    @Test
    void contextLoads() {
        QueryWrapper queryWrapper = QueryWrapper.create()
                .select()
                .where(ACCOUNT.AGE.eq(18));
        Account account = accountMapper.selectOneByQuery(queryWrapper);
        System.out.println(account);
    }

}
```

控制台输出：

```
Account(id=1, userName=张三, age=18, birthday=Sat Jan 11 00:00:00 CST 2020)
```

以上的 示例 中， `ACCOUNT` 为 MyBatis-Flex 通过 APT 自动生成，只需通过静态导入即可，无需手动编码。

整体来讲，这个框架是Mybatis的增强版，几乎集成了mybatis plus、jooq、fluent mybatis的所有优点。

> 获取本文源码可访问
>
> <https://github.com/Daneliya/springboot_chowder/tree/main/springboot_myBaits_flex>

## 六、参考资料

\[1]. <https://blog.csdn.net/zhipengfang/article/details/132353553>
