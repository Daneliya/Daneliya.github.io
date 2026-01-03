---
url: /常用框架/SpringBoot/SpringBoot服务整合/2_SpringBoot整合ORM开发框架.md
---

# SpringBoot整合ORM开发框架

## SpringBoot整合Mybatis开发框架

MyBatis是一款常用并且配置极为简单的ORM开发框架。其与Spring结合后，可以利用Spring的特征实现DAO接口的自动配置。在SpringBoot中，又对MyBatis框架的整合进行了进一步简化。想实现这种配置，需要在项目中引入mybatis-spring-boot- starter依赖支持库。

提示：需要数据库连接池支持。（开发中一般使用Druid作为数据库连接池）

```sql
DROP
DATABASE IF EXISTS xxl_springboot_action ;
CREATE
DATABASE xxl_springboot_action CHARACTER SET UTF8 ;
USE
xxl_springboot_action ;
CREATE TABLE dept
(
    deptno BIGINT AUTO_INCREMENT,
    dname  VARCHAR(50),
    CONSTRAINT pk_deptno PRIMARY KEY (deptno)
);
INSERT INTO dept(dname)
VALUES ('开发部');
INSERT INTO dept(dname)
VALUES ('财务部');
INSERT INTO dept(dname)
VALUES ('市场部');
INSERT INTO dept(dname)
VALUES ('后勤部');
INSERT INTO dept(dname)
VALUES ('公关部');
```

### 1、引入mybatis依赖包

修改pom.xml配置文件，引入相关依赖包。

```xml
<dependency>
    <groupId>org.mybatis.spring.boot</groupId>
    <artifactId>mybatis-spring-boot-starter</artifactId>
    <version>1.3.1</version>
</dependency>
```

### 2、创建VO实体类

```java
@SuppressWarnings("serial")
public class Dept implements Serializable {
    private Long deptno;
    private String dname;

    // setter、getter略
    public Long getDeptno() {
        return deptno;
    }

    public void setDeptno(Long deptno) {
        this.deptno = deptno;
    }

    public String getDname() {
        return dname;
    }

    public void setDname(String dname) {
        this.dname = dname;
    }

    @Override
    public String toString() {
        return "Dept [deptno=" + deptno + ", dname=" + dname + "]";
    }
}
```

### 3、添加mybatis配置文件

在`src/main/resources`目录中创建`mybatis/mybatis.cfg.xml`配置文件

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration
        PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>        <!-- 进行Mybatis的相应的环境的属性定义 -->
    <settings>        <!-- 在本项目之中开启二级缓存 -->
        <setting name="cacheEnabled" value="true"/>
    </settings>
</configuration>
```

### 4、修改application.yml配置文件

修改`application.yml`配置文件，追加MyBatis配置

```yaml
mybatis:
  config-location: classpath:mybatis/mybatis.cfg.xml    # mybatis配置文件所在路径
  type-aliases-package: com.xxl.springboot.vo             # 定义所有操作类的别名所在包
```

### 5、创建数据层接口

建立IDeptDAO接口，该接口将由Spring自动实现。

```java
@Mapper
public interface IDeptDAO {

    /**
     * 查询全部部门信息
     *
     * @return
     */
    @Select("SELECT deptno,dname FROM dept")
    public List<Dept> findAll();

}
```

### 6、定义业务层接口及实现类

定义IDeptService业务层接口。

```javascript
public interface IDeptService {
    public List<Dept> list() ;
}
```

定义DeptServiceImpl业务层实现子类。

```java
@Service
public class DeptServiceImpl implements IDeptService {

    @Autowired
    private IDeptDAO deptDAO;

    @Override
    public List<Dept> list() {
        return this.deptDAO.findAll();
    }

}
```

### 7、测试

编写测试类，测试IDeptService业务方法。

```java
@SpringBootTest(classes = SpringBootIntegrationMybatisApplication.class)        // 定义要测试的SpringBoot类
@RunWith(SpringJUnit4ClassRunner.class)                            // 使用Junit进行测试
@WebAppConfiguration                                            // 进行Web应用配置
public class TestDeptService {

    @Autowired
    private IDeptService deptService;                            // 注入业务接口对象

    @Test
    public void testList() {
        List<Dept> allDepts = this.deptService.list();
        for (Dept dept : allDepts) {
            System.out.println("部门编号：" + dept.getDeptno() + "、部门名称：" + dept.getDname());
        }
    }
}
```

打印结果

```
部门编号：1、部门名称：开发部
部门编号：2、部门名称：财务部
部门编号：3、部门名称：市场部
部门编号：4、部门名称：后勤部
部门编号：5、部门名称：公关部
```

> 完整代码参考：[springboot-action/springboot-integration/springboot-integration-mybatis-parent at main · Daneliya/springboot-action (github.com)](https://github.com/Daneliya/springboot-action/tree/main/springboot-integration/springboot-integration-mybatis-parent)

## SpringBoot整合JPA开发框架

JPA是官方推出的Java持久层操作标准（现主要使用Hibernate实现），使用SpringData技术和JpaRepository接口技术，也可以达到简化数据层的目的。要在SpringBoot中使用SpringDataJPA，需要spring-boot-starter-data-jpa依赖库的支持。

### 1、引入jpa依赖包

修改pom.xml配置文件，引入相关依赖包。

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-cache</artifactId>
</dependency>
<dependency>
    <groupId>org.hibernate</groupId>
    <artifactId>hibernate-ehcache</artifactId>
</dependency>
```

jdk11中不再支持javaxb，因此需要添加以下依赖项

```xml
<dependency>
    <groupId>javax.xml.bind</groupId>
    <artifactId>jaxb-api</artifactId>
    <version>2.2.11</version>
</dependency>
<dependency>
    <groupId>com.sun.xml.bind</groupId>
    <artifactId>jaxb-core</artifactId>
    <version>2.2.11</version>
</dependency>
<dependency>
    <groupId>com.sun.xml.bind</groupId>
    <artifactId>jaxb-impl</artifactId>
    <version>2.2.11</version>
</dependency>
<dependency>
    <groupId>javax.activation</groupId>
    <artifactId>activation</artifactId>
    <version>1.1.1</version>
</dependency>
```

否则报错

```
org.springframework.beans.factory.BeanCreationException: Error creating bean with name 'entityManagerFactory' defined in class path resource [org/springframework/boot/autoconfigure/orm/jpa/HibernateJpaConfiguration.class]: Invocation of init method failed; nested exception is javax.persistence.PersistenceException: [PersistenceUnit: default] Unable to build Hibernate SessionFactory; nested exception is org.hibernate.MappingException: Could not get constructor for org.hibernate.persister.entity.SingleTableEntityPersister
```

还需要增加

```xml
<!-- https://mvnrepository.com/artifact/org.javassist/javassist -->
<dependency>
    <groupId>org.javassist</groupId>
    <artifactId>javassist</artifactId>
    <version>3.15.0-GA</version>
</dependency>
```

否则报错

```
Unable to instantiate default tuplizer [org.hibernate.tuple.entity.PojoEntityTuplizer]
```

### 2、修改application.yml配置文件

```yaml
spring:
  datasource:
    type: com.alibaba.druid.pool.DruidDataSource    # 配置当前要使用的数据源的操作类型
    driver-class-name: com.mysql.cj.jdbc.Driver     # 配置MySQL的驱动程序类
    url: jdbc:mysql://localhost:3306/xxl_springboot_action?serverTimezone=UTC&useSSL=false           # 数据库连接地址
    username: xxx                                  # 数据库用户名
    password: xxx                                  # 数据库连接密码
  jpa:
    show-sql: true # 控制台显示SQL
    hibernate:
      ddl-auto: update # 新或者创建数据表结构
```

> closing inbound before receiving peer's close\_notify
> 在url添加：useSSL=false

### 3、创建PO实体类

建立持久化类Dept。

```java
import java.io.Serializable;

import javax.persistence.Cacheable;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Table(name = "dept")
@SuppressWarnings("serial")
@Cacheable(true) 
@Entity
public class Dept implements Serializable {
    
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY) // 根据名称引用配置的主键生成器
	private Long deptno; // 字段的映射（属性名称=字段名称）
    
    @Column()
	private String dname;

	// setter、getter略
	public Dept() {
	}

	public Long getDeptno() {
		return this.deptno;
	}

	public void setDeptno(Long deptno) {
		this.deptno = deptno;
	}


	public String getDname() {
		return this.dname;
	}

	public void setDname(String dname) {
		this.dname = dname;
	}
	
}
```

### 4、创建数据层接口

定义IDeptDAO接口，此接口继承JpaRepository父接口。

```java
public interface IDeptDAO extends JpaRepository<Dept, Long> { // 包含有全部的基础Crud支持
}
```

### 5、定义业务层接口及实现类

定义IDeptService业务层接口。

```java
public interface IDeptService {
	public List<Dept> list() ; 	
}
```

定义DeptServiceImpl业务层实现子类。

```java
@Service
public class DeptServiceImpl implements IDeptService {
	@Autowired
	private IDeptDAO deptDAO ;
	@Override
	public List<Dept> list() {
		return this.deptDAO.findAll() ; 
	}

}
```

### 6、启动类增加扫描

修改程序启动主类，追加Repository扫描配置。

```java
@SpringBootApplication	// 启动SpringBoot程序，而后自带子包扫描
@EnableJpaRepositories(basePackages="com.xxl.mldnboot.dao")
public class SpringBootStartApplication { // 必须继承指定的父类
	public static void main(String[] args) throws Exception {
		SpringApplication.run(SpringBootStartApplication.class, args);	// 启动SpringBoot程序
	}
}
```

### 7、测试

编写测试类，测试IDeptService业务方法。

```java
@SpringBootTest(classes = SpringBootStartApplication.class)		// 定义要测试的SpringBoot类
@RunWith(SpringJUnit4ClassRunner.class)							// 使用Junit进行测试
@WebAppConfiguration											// 进行Web应用配置
public class TestDeptService {
	@Autowired
	private IDeptService deptService ; 							// 注入业务接口对象
	@Test
	public void testList() {
		List<Dept> allDepts = this.deptService.list() ;
		for (Dept dept : allDepts) {
			System.out.println("部门编号：" + dept.getDeptno() + "、部门名称：" + dept.getDname());
		}
	}
}
```

打印结果

```sh
Hibernate: select dept0_.deptno as deptno1_0_, dept0_.dname as dname2_0_ from dept dept0_
部门编号：1、部门名称：开发部
部门编号：2、部门名称：财务部
部门编号：3、部门名称：市场部
部门编号：4、部门名称：后勤部
部门编号：5、部门名称：公关部
```

> 注意的是，如果想启用Repository配置，则需要在程序启动主类时使用@EnableJpaRepositories注解配置扫描包，而后才可以正常使用。

## 事务处理

SpringBoot中可以使用PlatformTransactionManager接口来实现事务的统一控制，而进行控制的时候也可以采用注解或者AOP切面配置形式来完成。

### 1、方法上启用事务注解

在业务层的方法上启用事务控制。

```java
public interface IDeptService {

    @Transactional(propagation = Propagation.REQUIRED, readOnly = true)
    public List<Dept> list();

    @Transactional(rollbackFor = Exception.class)
    public boolean addDept(String deptName);
}
```

方法实现类

```java
@Service
public class DeptServiceImpl implements IDeptService {

    @Autowired
    private IDeptDAO deptDAO;

    @Override
    public List<Dept> list() {
        return this.deptDAO.findAll();
    }

    @Override
    public boolean addDept(String deptName) {
        int result = this.deptDAO.addDept(deptName);
        if (result > 0) {
            // 自定义异常测试
            int i = 1 / 0;
            return true;
        }
        return false;
    }

}

```

数据层代码

```java
@Mapper
public interface IDeptDAO {

    /**
     * 查询全部部门信息
     *
     * @return
     */
    @Select("SELECT deptno,dname FROM dept")
    public List<Dept> findAll();

    /**
     * 添加
     *
     * @param deptName
     * @return
     */
    @Insert("INSERT INTO dept(dname) VALUES (#{deptName})")
    int addDept(String deptName);
}
```

### 2、启动类开启事务配置

在程序主类中还需要配置事务管理注解。

```java
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@SpringBootApplication
@EnableTransactionManagement
public class SpringBootIntegrationTransactionalApplication {

    public static void main(String[] args) {
        SpringApplication.run(SpringBootIntegrationTransactionalApplication.class, args);
    }

}
```

项目中利用业务层中定义的@Transactional注解就可以实现事务的控制，但是这样的事务控制过于复杂。在一个大型项目中可能存在成百上千的业务接口，全部使用注解控制必然会造成代码的大量重复。在实际工作中，SpringBoot与事务结合最好的控制方法就是定义一个事务的配置类。

### 3、配置类方式

引入切面依赖

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-aop</artifactId>
</dependency>
```

取消事务注解配置，并定义TransactionConfig配置类。

```java
@Configuration                        // 定义配置Bean
@Aspect                                // 采用AOP切面处理
public class TransactionConfig {

    private static final int TRANSACTION_METHOD_TIMEOUT = 5;    // 事务超时时间为5秒

    private static final String AOP_POINTCUT_EXPRESSION = "execution (* om.xxl.springboot.integration.transactional.service.*.*(..))";    // 定义切面表达式

    @Autowired
    private PlatformTransactionManager transactionManager;        // 注入事务管理对象

    @Bean("txAdvice")                                            // Bean名称必须为txAdvice
    public TransactionInterceptor transactionConfig() {            // 定义事务控制切面
        // 定义只读事务控制，该事务不需要启动事务支持
        RuleBasedTransactionAttribute readOnly = new RuleBasedTransactionAttribute();
        readOnly.setReadOnly(true);
        readOnly.setPropagationBehavior(TransactionDefinition.PROPAGATION_NOT_SUPPORTED);
        // 定义更新事务，同时设置事务操作的超时时间
        RuleBasedTransactionAttribute required = new RuleBasedTransactionAttribute();
        required.setPropagationBehavior(TransactionDefinition.PROPAGATION_REQUIRED);
        required.setTimeout(TRANSACTION_METHOD_TIMEOUT);
        Map<String, TransactionAttribute> transactionMap = new HashMap<>();            // 定义业务切面
        transactionMap.put("add*", required);
        transactionMap.put("edit*", required);
        transactionMap.put("delete*", required);
        transactionMap.put("get*", readOnly);
        transactionMap.put("list*", readOnly);
        NameMatchTransactionAttributeSource source = new NameMatchTransactionAttributeSource();
        source.setNameMap(transactionMap);
        TransactionInterceptor transactionInterceptor = new TransactionInterceptor(transactionManager, source);
        return transactionInterceptor;
    }

    @Bean
    public Advisor transactionAdviceAdvisor() {
        AspectJExpressionPointcut pointcut = new AspectJExpressionPointcut();
        pointcut.setExpression(AOP_POINTCUT_EXPRESSION);                                    // 定义切面
        return new DefaultPointcutAdvisor(pointcut, transactionConfig());
    }
}
```

此时程序中的事务控制可以利用TransactionConfig类结合AspectJ切面与业务层中的方法匹配，而后就不再需要业务方法使用@Transactional注解重复定义了。

### 4、测试

```java
@SpringBootTest(classes = SpringBootIntegrationTransactionalApplication.class)        // 定义要测试的SpringBoot类
@RunWith(SpringJUnit4ClassRunner.class)                            // 使用Junit进行测试
@WebAppConfiguration                                            // 进行Web应用配置
public class TestDeptService {

    @Autowired
    private IDeptService deptService;                            // 注入业务接口对象

    @Test
    public void testAdd() {
        this.deptService.addDept("科室1");
    }
}
```
