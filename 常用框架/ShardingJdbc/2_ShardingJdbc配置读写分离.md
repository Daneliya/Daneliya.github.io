---
url: /常用框架/ShardingJdbc/2_ShardingJdbc配置读写分离.md
---

# ShardingJdbc配置读写分离

## ShardingJdbc配置读写分离

### 1、 新建一个springboot工程

### 2、 引入相关mybatis、数据库驱动、sharding依赖

```xml
 <properties>
     <java.version>11</java.version>
     <sharding-sphere.version>4.0.0-RC1</sharding-sphere.version>
 </properties>
 <!-- 依赖web -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
<!-- 依赖mybatis和mysql驱动 -->
<dependency>
    <groupId>org.mybatis.spring.boot</groupId>
    <artifactId>mybatis-spring-boot-starter</artifactId>
    <version>2.1.4</version>
</dependency>
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <scope>runtime</scope>
</dependency>
<!--依赖lombok-->
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <optional>true</optional>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <scope>test</scope>
</dependency>
<!--依赖sharding-->
<dependency>
    <groupId>org.apache.shardingsphere</groupId>
    <artifactId>sharding-jdbc-spring-boot-starter</artifactId>
    <version>${sharding-sphere.version}</version>
</dependency>
<dependency>
    <groupId>org.apache.shardingsphere</groupId>
    <artifactId>sharding-core-common</artifactId>
    <version>${sharding-sphere.version}</version>
</dependency>
<!--依赖数据源druid-->
<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>druid-spring-boot-starter</artifactId>
    <version>1.1.21</version>
</dependency>

```

### 3、 定义配置application.yml

```yaml
server:
  port: 8085
spring:
  main:
    allow-bean-definition-overriding: true
  shardingsphere:
    # 参数配置，显示sql
    props:
      sql:
        show: true
    # 配置数据源
    datasource:
      # 给每个数据源取别名，下面的ds1,ds2,ds3任意取名字
      names: ds1,ds2,ds3
      # 给master-ds1每个数据源配置数据库连接信息
      ds1:
        # 配置druid数据源
        type: com.alibaba.druid.pool.DruidDataSource
        driver-class-name: com.mysql.cj.jdbc.Driver
        url: jdbc:mysql://192.168.233.128:3306/xxl_sharding_db?useUnicode=true&characterEncoding=utf8&tinyInt1isBit=false&useSSL=false&serverTimezone=GMT
        username: root
        password: xxl666
        maxPoolSize: 100
        minPoolSize: 5
      # 配置ds2-slave
      ds2:
        type: com.alibaba.druid.pool.DruidDataSource
        driver-class-name: com.mysql.cj.jdbc.Driver
        url: jdbc:mysql://192.168.233.129:3306/xxl_sharding_db?useUnicode=true&characterEncoding=utf8&tinyInt1isBit=false&useSSL=false&serverTimezone=GMT
        username: root
        password: xxl666
        maxPoolSize: 100
        minPoolSize: 5
      # 配置ds3-slave
      ds3:
        type: com.alibaba.druid.pool.DruidDataSource
        driver-class-name: com.mysql.cj.jdbc.Driver
        url: jdbc:mysql://192.168.233.130:3306/xxl_sharding_db?useUnicode=true&characterEncoding=utf8&tinyInt1isBit=false&useSSL=false&serverTimezone=GMT
        username: root
        password: xxl666
        maxPoolSize: 100
        minPoolSize: 5
    # 配置默认数据源ds1
    sharding:
     # 默认数据源，主要用于写，注意一定要配置读写分离 ,注意：如果不配置，那么就会把三个节点都当做从slave节点，新增，修改和删除会出错。
      default-data-source-name: ds1
    # 配置数据源的读写分离，但是数据库一定要做主从复制
    masterslave:
      # 配置主从名称，可以任意取名字
      name: ms
      # 配置主库master，负责数据的写入
      master-data-source-name: ds1
      # 配置从库slave节点
      slave-data-source-names: ds2,ds3
      # 配置slave节点的负载均衡均衡策略，采用轮询机制
      load-balance-algorithm-type: round_robin
# 整合mybatis的配置XXXXX
mybatis:
  mapper-locations: classpath:mapper/*.xml
  type-aliases-package: com.xxl.shardingjdbc.entity

```

### 4、 定义mapper、controller、entity

**entity**

```java
package com.xxl.shardingjdbc.entity;

import lombok.Data;

/**
 * @Description: 用户表
 * @Author: xxl
 * @Date: 2023/02/10 17:23
 * @Version: 1.0
 */
@Data
public class User {
    // 主键
    private Integer id;
    // 昵称
    private String nickname;
    // 密码
    private String password;
    // 性别
    private Integer sex;
    // 生日
    private String birthday;
    // 分库字段
    private Integer db;
}
```

mapper

```java
package com.xxl.shardingjdbc.mapper;

import com.xxl.shardingjdbc.entity.User;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

/**
 * @Description:
 * @Author: xxl
 * @Date: 2023/02/10 17:24
 * @Version: 1.0
 */
@Mapper
public interface UserMapper {

    /**
     * @author xxl
     * @description 保存用户
     * @params [user]
     * @date 2023/02/10 17:24
     */
    @Insert("insert into user(nickname,password,sex,birthday,db) values(#{nickname},#{password},#{sex},#{birthday},#{db})")
    void addUser(User user);

    /**
     * @author xxl
     * @description 保存用户
     * @params [user]
     * @date 2023/02/10 17:24
     */
    @Select("select * from user")
    List<User> findUsers();
}
```

controller

```java
package com.xxl.shardingjdbc.controller;

import com.xxl.shardingjdbc.entity.User;
import com.xxl.shardingjdbc.mapper.UserMapper;
import org.apache.tomcat.jni.Address;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Random;

/**
 * @Description:
 * @Author: xxl
 * @Date: 2023/02/10 17:25
 * @Version: 1.0
 */
@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserMapper userMapper;

    @GetMapping("/save")
    public String insert() {
        User user = new User();
        user.setNickname("zhangsan" + new Random().nextInt());
        user.setPassword("1234567");
        user.setSex(1);
        user.setBirthday("1988-12-03");
        userMapper.addUser(user);
        return "success";
    }

    @GetMapping("/listuser")
    public List<User> listuser() {
        return userMapper.findUsers();
    }

}
```

### 5、 访问测试查看效果

1：访问 `http://localhost:8085/user/save` 一直进入到ds1主节点

2：访问 `http://localhost:8085/user/listuser` 一直进入到ds2、ds3节点，并且轮询进入。

### 6、 日志查看
