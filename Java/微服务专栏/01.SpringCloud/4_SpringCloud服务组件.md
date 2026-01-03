---
url: /Java/微服务专栏/01.SpringCloud/4_SpringCloud服务组件.md
---

# SpringCloud服务组件

SpringCloud微架构开发中存在着众多的微服务，这些微服务之间也会存在互相的调用关联，为了防止某一个微服务不可用时关联微服务出现问题，需要引入Hystrix熔断处理机制。同时，微服务的调用形式在消费端应该以远程接口的形式出现，为此SpringCloud家族提供了Feign转换技术。为了保证微服务的安全访问，还提供了类似网关的Zuul组件支持。

## 一、Ribbon负载均衡组件

所有的微服务都需要注册到Eureka服务中，因此可以通过Eureka对所有微服务进行管理。消费端应该通过Eureka来进行微服务接口调用，这种调用可以利用Ribbon技术来实现。

### 1、Ribbon基本使用

Ribbon是一个与Eureka结合的组件，其主要作用是进行Eureka中的服务调用。要使用Ribbon，需要在项目中配置spring-cloud-starter-ribbon依赖库。同时对于所有注册到Eureka中的微服务也要求有微服务的名称，在消费端将通过微服务的名称进行微服务调用。

修改pom.xml配置文件，引入Ribbon依赖库。

```xml
<!--Spring Cloud Eureka 客户端依赖-->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
</dependency>
<!--Spring Cloud Ribbon 依赖-->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-ribbon</artifactId>
</dependency>
```

修改RestfulConfig配置类，追加Ribbon注解。

```java
@Configuration
public class RestfulConfig {

    @Bean
    public HttpHeaders getHeaders() {                // Http头信息配置
        HttpHeaders headers = new HttpHeaders();     // 定义HTTP的头信息
        String auth = "xxl:hello";                   // 认证的原始信息
        byte[] encodedAuth = Base64.getEncoder()
                .encode(auth.getBytes(Charset.forName("US-ASCII"))); // 进行加密的处理
        // 在进行授权的头信息内容配置的时候加密的信息一定要与“Basic”之间有一个空格
        String authHeader = "Basic " + new String(encodedAuth);
        headers.set("Authorization", authHeader);    // 保存头信息
        return headers;
    }

    @Bean
    @LoadBalanced                            // Ribbon提供的负载均衡注解
    public RestTemplate getRestTemplate() {
        return new RestTemplate();            // 实例化RestTemplate对象
    }
}
```

修改application.yml配置文件，追加Eureka访问地址。

```yaml
server:
  port: 80          # 服务端口
spring: 
  application:
    name: springcloud-ribbon-server
eureka:
  client:             # 客户端进行Eureka注册的配置
    service-url:
      defaultZone: http://127.0.0.1:7001/eureka
    register-with-eureka: false    # 当前的微服务不注册到eureka之中
```

在DeptController控制器类中通过微服务名称调用微服务，此时不再需要知道微服务的具体主机信息。

```java
@RestController                            // 为方便起见使用Restful风格展示
public class DeptController {
    public static final String DEPT_ADD_URL = "http://springcloud-dept-service/dept/add";
    public static final String DEPT_GET_URL = "http://springcloud-dept-service/dept/get";
    public static final String DEPT_LIST_URL = "http://springcloud-dept-service/dept/list";
    @Resource
    private RestTemplate restTemplate;        // 注入RestTemplate对象
    @Resource
    private HttpHeaders headers;            // 注入Http头信息对象

    @SuppressWarnings("unchecked")
    @GetMapping("/consumer/dept/list")
    public Object listDeptRest() {
        List<DeptDTO> allDepts = this.restTemplate
                .exchange(DEPT_LIST_URL, HttpMethod.GET,
                        new HttpEntity<Object>(this.headers), List.class)
                .getBody();                    // 访问服务设置头信息
        return allDepts;

    }

    @GetMapping("/consumer/dept/get")
    public Object getDeptRest(long deptno) {
        DeptDTO dept = this.restTemplate
                .exchange(DEPT_GET_URL + "/" + deptno, HttpMethod.GET,
                        new HttpEntity<Object>(this.headers), DeptDTO.class)
                .getBody();                    // 访问服务设置头信息
        return dept;
    }

    @GetMapping("/consumer/dept/add")
    public Object addDeptRest(DeptDTO dept) {    // 传输DeptDTO对象
        DeptDTO result = this.restTemplate.exchange(DEPT_ADD_URL, HttpMethod.POST,
                        new HttpEntity<Object>(dept, this.headers), DeptDTO.class)
                .getBody();                // 访问服务设置头信息
        return result;
    }

}
```

修改程序启动类，追加Eureka客户端注解。

```java
@SpringBootApplication
@EnableEurekaClient
public class StartRibbonApplication {
    public static void main(String[] args) {
        SpringApplication.run(StartRibbonApplication.class, args);
    }
}
```

此时，消费端就可以实现Eureka中注册微服务的调用，并且在消费端通过名称实现微服务调用。

![image-20250316210608327](/assets/image-20250316210608327.D6ROxBX1.png)

### 2、Ribbon负载均衡

微服务搭建的业务中心可以通过多台业务功能相同的微服务构建微服务集群，所有的微服务为了可以动态维护，都需要将其注册到Eureka之中，这样消费端就可以利用Ribbon与Eureka的服务主机列表实现微服务轮询调用，以实现负载均衡。需要注意的是，Ribbon提供的是一种客户端的负载均衡配置。

![Image00372](/assets/Image00372.edxBCpd6.jpg)

参考 springcloud-dept-8001，再创建两个微服务 Moudle ：springcloud-dept-8002 和 springcloud-dept-8003。

| NO   | 项目名称              | 运行端口 | 数据库名称          | host主机名称  |
| ---- | --------------------- | -------- | ------------------- | ------------- |
| 1    | springcloud-dept-8001 | 8001     | xxl\_springcloud\_db1 | dept-8001.com |
| 2    | springcloud-dept-8002 | 8002     | xxl\_springcloud\_db2 | dept-8002.com |
| 3    | springcloud-dept-8003 | 8003     | xxl\_springcloud\_db3 | dept-8003.com |

在MySQL数据库中执行以下 SQL 语句，准备测试数据

```sql
DROP DATABASE IF EXISTS xxl_springcloud_db1;

CREATE DATABASE xxl_springcloud_db1 CHARACTER SET UTF8;

USE xxl_springcloud_db1;

DROP TABLE IF EXISTS `dept`;
CREATE TABLE `dept` (
  `dept_no` int NOT NULL AUTO_INCREMENT,
  `dept_name` varchar(255) DEFAULT NULL,
  `db_source` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`dept_no`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `dept` VALUES ('1', '开发部', DATABASE());
INSERT INTO `dept` VALUES ('2', '人事部', DATABASE());
INSERT INTO `dept` VALUES ('3', '财务部', DATABASE());
INSERT INTO `dept` VALUES ('4', '市场部', DATABASE());
INSERT INTO `dept` VALUES ('5', '运维部', DATABASE());

#############################################################################################
DROP DATABASE IF EXISTS xxl_springcloud_db2;

CREATE DATABASE xxl_springcloud_db2 CHARACTER SET UTF8;

USE xxl_springcloud_db2;

DROP TABLE IF EXISTS `dept`;
CREATE TABLE `dept` (
  `dept_no` int NOT NULL AUTO_INCREMENT,
  `dept_name` varchar(255) DEFAULT NULL,
  `db_source` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`dept_no`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `dept` VALUES ('1', '开发部', DATABASE());
INSERT INTO `dept` VALUES ('2', '人事部', DATABASE());
INSERT INTO `dept` VALUES ('3', '财务部', DATABASE());
INSERT INTO `dept` VALUES ('4', '市场部', DATABASE());
INSERT INTO `dept` VALUES ('5', '运维部', DATABASE());

#############################################################################################
DROP DATABASE IF EXISTS xxl_springcloud_db3;

CREATE DATABASE xxl_springcloud_db3 CHARACTER SET UTF8;

USE xxl_springcloud_db3;

DROP TABLE IF EXISTS `dept`;
CREATE TABLE `dept` (
  `dept_no` int NOT NULL AUTO_INCREMENT,
  `dept_name` varchar(255) DEFAULT NULL,
  `db_source` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`dept_no`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `dept` VALUES ('1', '开发部', DATABASE());
INSERT INTO `dept` VALUES ('2', '人事部', DATABASE());
INSERT INTO `dept` VALUES ('3', '财务部', DATABASE());
INSERT INTO `dept` VALUES ('4', '市场部', DATABASE());
INSERT INTO `dept` VALUES ('5', '运维部', DATABASE());
```

要实现负载均衡，首先要保证注册到Eureka中的所有微服务的**名称相同**。

修改application.yml配置文件，实现服务名称定义。

```yaml
spring:
  application:
    name: springcloud-dept-service                  # 定义微服务名称
```

启动所有的微服务，并且同时向Eureka中进行注册。

![image-20250316215122737](/assets/image-20250316215122737.D1lk1d3A.png)

可以发现，针对这些相同名称的微服务，会有3台主机提供服务支持。

此时的程序就实现了部门业务的集群配置。由于在消费端已经配置了@LoadBalanced注解，因此会采用自动轮询的模式实现不同业务主机的服务调用。读者运行程序后会发现，每一次都会通过不同的微服务主机执行业务。

**提问：能否不使用Eureka而直接通过Ribbon调用微服务？**

所有的微服务都在Eureka中注册，如果不通过Eureka，能否直接使用Ribbon进行微服务调用？

**回答：可以禁用Eureka，而直接利用Ribbon调用微服务，但是不推荐。**

在Ribbon中有一个服务器信息列表，开发者可以利用它配置所要访问的微服务列表，以实现微服务的调用。

![Image00376](/assets/Image00376.CI8BeXSE.jpg)

然后需要在消费端的application.yml配置文件中进行如下配置。

**范例：** 直接使用Ribbon访问微服务。

```yaml
ribbon:
  eureka:
    enabled: false
springcloud-dept-service:
  ribbon:
    listOfService:
      http://127.0.0.1:8001,
      http://127.0.0.1:8002,
      http://127.0.0.1:8003
```

此时直接在消费端配置了所有的微服务信息列表，而调用的形式也必须通过Ribbon特定的LoadBalancerClient类才可以完成访问。这里面最麻烦的问题在于：使用过程中如果有某台微服务主机出现宕机现象，Ribbon会自动将其剔除，但是在其恢复之后，开发者需要手动将其添加到Ribbon服务器列表之中才可以继续使用。从这一点来讲，并不如Eureka智能。在进行微服务的开发中，强烈建议使用Eureka来负责所有微服务的注册，这样可以实现服务端列表的动态更新。

### 3、Ribbon负载均衡策略

默认情况下，Ribbon中采用服务列表的顺序模式实现负载均衡处理，开发者也可以根据自身的情况实现自定义的负载均衡配置。Ribbon中，有如下3种核心配置策略（接口和类都在com.netflix.loadbalancer包中）。

1. **IRule：** Ribbon的负载均衡策略（所有的负载均衡策略均继承自IRule接口，常用子类如下表所示），默认采用ZoneAvoidanceRule实现，该策略能够在多区域环境下选出最佳区域的实例进行访问。

   ![Image00378](/assets/Image00378-1742132070367.B1V3zloG.jpg)

2. **IPing：** Ribbon的实例检查策略，默认采用NoOpPing子类实现。该检查策略是一个特殊的实现，实际上它并不会检查实例是否可用，而是始终返回true，默认认为所有服务实例都是可用的。如果用户有需要，也可以更换为PingUrl子类。

3. **ILoadBalancer：** 负载均衡器，默认采用ZoneAwareLoadBalancer实现，具备区域感知的能力。

由于Ribbon是工作在消费端的程序，所以进行负载均衡策略配置时，只需要在消费端进行处理。注意，不要将配置类放在SpringBoot程序启动时可以扫描到的子包中。

【springcloud-ribbon】追加一个LoadBalance的配置类，此类要放在Spring启动时无法扫描到的包中。

```java
public class RibbonLoadBalanceConfig {
	@Bean
	public IRule ribbonRule() { 			// 其中IRule就是所有规则的标准
		return new com.netflix.loadbalancer.RandomRule(); // 随机的访问策略
	}
	@Bean
	public IPing ribbonPing() {				// 定义Ping策略
		return new com.netflix.loadbalancer.PingUrl() ;
	}
}
```

【springcloud-ribbon】在程序启动类中使用@RibbonClient注解引入配置。

```java
@SpringBootApplication 
@EnableEurekaClient
@RibbonClient(name="ribbonClient", configuration=RibbonLoadBalanceConfig.class)
public class StartRibbonApplication {
	public static void main(String[] args) {
		SpringApplication.run(StartWebConsumerApplication80.class, args);
	}
}
 
```

这里采用自定义的负载均衡策略与主机检测策略实现了微服务调用。

在通过Ribbon调用微服务过程中，还可以利用LoadBalancerClient获取要调用的微服务端信息。修改DeptController控制器程序类，追加资源注入。

```java
@Autowired
private LoadBalancerClient loadBalancerClient ;	// 客户端信息

@GetMapping("/consumer/client") 
public Object client() {
    // 获取指定名称的微服务实例对象
    ServiceInstance serviceInstance = this.loadBalancerClient.choose("MLDNCLOUD-DEPT-SERVICE") ;
    Map<String,Object> info = new HashMap<String,Object>() ;
    info.put("host", serviceInstance.getHost()) ;
    info.put("port", serviceInstance.getPort()) ;
    info.put("serviceId", serviceInstance.getServiceId()) ;
    return info ;
}
```

Restful信息（http://127.0.0.1/consumer/client）

```json
{
    "port": 8003,
    "host": "192.168.226.1",
    "serviceId": "springcloud-dept-service"
}
```

本程序使用了LoadBalancerClient类进行客户端信息的注入，并且利用此对象根据微服务的名称MICROCLOUD-DEPT-SERVICE来获取客户端要调用的微服务的基础信息。

## 二、Feign远程接口映射

SpringCloud是以Restful为基础实现的开发框架，在整体调用过程中，即使引入了Eureka，也需要消费端使用完整的路径才可以正常访问远程接口，同时还需要开发者手动利用RestTemplate进行调用与返回结果的转换。为了解决这种复杂的调用逻辑，在SpringCloud中提供Feign技术（依赖于Ribbon技术支持），利用此技术可以将远程的Restful服务映射为远程接口，消费端可通过远程接口实现远程方法调用。

![Image00383](/assets/Image00383.BWm4gtwt.jpg)

### 1、Feign接口转换

Feign接口转换技术是针对Restful访问地址的封装，即同一组Restful访问地址应该变为一个远程接口中的业务方法，提供给消费端使用。

【springcloud-api】修改pom.xml配置文件，引入Feign依赖库（会自动引入Ribbon依赖）。

```xml
<!--添加 OpenFeign 依赖-->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-openfeign</artifactId>
</dependency>
```

【springcloud-api】由于此时服务端需要通过认证访问，因此需要建立一个Feign的配置类，配置认证请求。

```java
@Configuration
public class FeignClientConfig {

    @Bean
    public BasicAuthRequestInterceptor getBasicAuthRequestInterceptor() {
        return new BasicAuthRequestInterceptor("xxl", "123456");
    }
    
}
```

【springcloud-api】修改IDeptService接口定义，追加Feign处理相关注解。

```java
@FeignClient(value = "springcloud-dept-service", configuration = FeignClientConfig.class)
public interface IDeptService {

    @PostMapping("/dept/add")
    public DeptDTO add(DeptDTO dto);                            // 增加新部门

    @GetMapping("/dept/get/{deptno}")
    public DeptDTO get(@PathVariable("deptno") long deptno);    // 根据部门编号获取部门信息

    @GetMapping("/dept/list")
    public List<DeptDTO> list();                                // 部门信息列表
}
```

【springcloud-feign】此时消费端不再需要通过RestTemplate来进行Restful服务访问。直接在控制器中注入IDeptService，即可实现微服务调用。

```java
@RestController
public class DeptController {

    @Autowired
    private IDeptService deptService;            // 注入远程业务接口对象


    @GetMapping("/consumer/dept/list")
    public Object listDeptRest() {
        return this.deptService.list();        // 调用Restful业务方法
    }

    @GetMapping("/consumer/dept/get")
    public Object getDeptRest(long deptno) {
        return this.deptService.get(deptno);    // 调用Restful业务方法
    }

    @GetMapping("/consumer/dept/add")
    public Object addDeptRest(DeptDTO dept) {    // 传输DeptDTO对象
        return this.deptService.add(dept);        // 调用Restful业务方法
    }

}
```

【springcloud-feign】修改启动类，配置Feign转换接口扫描包。

```java
@SpringBootApplication
@EnableEurekaClient
@EnableFeignClients(basePackages = {"com.xxl.api.service"})    // 定义Feign接口扫描包
public class StartFeignApplication {

    public static void main(String[] args) {
        SpringApplication.run(StartFeignApplication.class, args);
    }

}
```

在消费端进行远程业务调用时，所有的访问地址都与IDeptService接口中的方法对应，这样消费端调用远程操作中就感觉像在本地调用一样。

### 2、Feign相关配置

Feign的核心作用是将Restful服务的信息转换为接口，在整体的处理过程中依然需要进行JSON（或者XML、文本传输）数据的传递。为了避免长时间占用网络带宽，提升数据传输效率，往往需要对数据进行压缩。

【springcloud-feign】修改application.yml，进行数据压缩配置。

```yaml
feign:
  compression:
    request:
      mime-types:             # 可以被压缩的类型
      - text/xml
      - application/xml
      - application/json
      min-request-size: 2048  # 超过2048的字节进行压缩
```

【springcloud-feign】在SpringBoot项目启动过程中，对于Feign接口与远程Restful地址的映射也可以通过日志信息进行详细显示，修改application.yml进行日志级别变更。

```yaml
logging:
  level:
    com.xxl.api.service: DEBUG  # 定义显示转换信息的开发包与日志级别
```

修改FeignClientConfig配置类，追加日志配置。

```java
@Bean
public feign.Logger.Level getFeignLoggerLevel() {
    return feign.Logger.Level.FULL;
}
```

配置完成后重新启动消费端项目【springcloud-feign】，在第一次进行接口调用时，可以通过控制台看到如下的重要提示信息：

```sh
2025-03-17 00:41:04.437 DEBUG 1220 --- [p-nio-80-exec-1] com.xxl.api.service.IDeptService         : [IDeptService#list] <--- HTTP/1.1 200 (636ms)
2025-03-17 00:41:04.437 DEBUG 1220 --- [p-nio-80-exec-1] com.xxl.api.service.IDeptService         : [IDeptService#list] content-type: application/json;charset=UTF-8
2025-03-17 00:41:04.437 DEBUG 1220 --- [p-nio-80-exec-1] com.xxl.api.service.IDeptService         : [IDeptService#list] date: Sun, 16 Mar 2025 16:41:04 GMT
2025-03-17 00:41:04.437 DEBUG 1220 --- [p-nio-80-exec-1] com.xxl.api.service.IDeptService         : [IDeptService#list] transfer-encoding: chunked
2025-03-17 00:41:04.437 DEBUG 1220 --- [p-nio-80-exec-1] com.xxl.api.service.IDeptService         : [IDeptService#list] 
2025-03-17 00:41:04.444 DEBUG 1220 --- [p-nio-80-exec-1] com.xxl.api.service.IDeptService         : [IDeptService#list] [{"deptNo":1,"deptName":"开发部","loc":null},{"deptNo":2,"deptName":"人事部","loc":null},{"deptNo":3,"deptName":"财务部","loc":null},{"deptNo":4,"deptName":"市场部","loc":null},{"deptNo":5,"deptName":"运维部","loc":null}]
2025-03-17 00:41:04.444 DEBUG 1220 --- [p-nio-80-exec-1] com.xxl.api.service.IDeptService         : [IDeptService#list] <--- END HTTP (236-byte body)
2025-03-17 00:41:05.160  INFO 1220 --- [erListUpdater-0] c.netflix.config.ChainedDynamicProperty  : Flipping property: springcloud-dept-service.ribbon.ActiveConnectionsLimit to use NEXT property: niws.loadbalancer.availabilityFilteringRule.activeConnectionsLimit = 2147483647
```

通过上述提示信息可以发现，Feign在进行接口转换时集成了Ribbon负载均衡机制，微服务消费端和提供端之间的信息采用JSON结构进行传递，并且可以自动将相应的返回数据变为目标类型。

## 三、Hystrix熔断机制

在实际项目中，由于业务功能的不断扩充，会出现大量的微服务互相调用的情况。

![Image00394](/assets/Image00394.DYlm207i.jpg)

如图所示，微服务1要想完成功能，需要调用微服务2、微服务3、微服务4，一旦这个时候微服务4出现问题（其他微服务没有问题），则微服务1、2、3就有可能出现错误。这样的问题在微服务开发中称为雪崩效应。

为了防止这种雪崩效应的出现，在SpringCloud中引入了Hystrix熔断机制。在大部分开发状态下，开发者可以直接使用Hystrix的默认配置。如果有需要，开发者也可以使用如下几类常用配置项。

:one:微服务执行相关配置项。

* hystrix.command.default.execution.isolation.strategy（默认为thread）：隔离策略，可选用thread或semaphore。
* hystrix.command.default.execution.isolation.thread.timeoutInMilliseconds（默认为1000ms）：命令执行超时时间。
* hystrix.command.default.execution.timeout.enabled（默认为true）：执行是否启用超时配置。
* hystrix.command.default.execution.isolation.thread.interruptOnTimeout（默认为true）：发生超时时是否中断。
* hystrix.command.default.execution.isolation.semaphore.maxConcurrentRequests（默认为10）：最大并发请求数，该参数在使用ExecutionIsolationStrategy.SEMAPHORE策略时才有效。如果达到最大并发请求数，请求会被拒绝。理论上选择semaphore size和选择thread size一致，但选用semaphore时每次执行的单元要比较小且执行速度较快（ms量级），否则应该选用thread。semaphore一般占整个容器（Tomcat或Jetty）线程池的一小部分。

2️⃣失败回退（fallback）相关配置项。

* hystrix.command.default.fallback.isolation.semaphore.maxConcurrentRequests（默认为10）：如果并发数达到该设置值，请求会被拒绝，抛出异常，并且失败回退，不会被调用。
* hystrix.command.default.fallback.enabled（默认为true）：当执行失败或者请求被拒绝时，是否会调用fallback方法。

3️⃣熔断处理相关的配置项。

* hystrix.command.default.circuitBreaker.enabled（默认为true）：跟踪circuit的健康性，如果出现问题，则请求熔断。
* hystrix.command.default.circuitBreaker.sleepWindowInMilliseconds（默认为5000）：触发熔断时间。
* hystrix.command.default.circuitBreaker.errorThresholdPercentage（默认为50）：错误比率阀值，如果错误率≥该值，circuit会被打开，并短路所有请求触发失败回退。
* hystrix.command.default.circuitBreaker.forceOpen（默认为false）：强制打开熔断器。如果打开这个开关，将拒绝所有用户请求。
* hystrix.command.default.circuitBreaker.forceClosed（默认为false）：强制关闭熔断器。

4️⃣线程池（ThreadPool）相关配置项。

* hystrix.threadpool.default.coreSize（默认为10）：并发执行的最大线程数。
* hystrix.threadpool.default.maxQueueSize（默认为−1）：BlockingQueue的最大队列数。值为−1时，使用同步队列（SynchronousQueue）；值为正数时，使用LinkedBlcokingQueue。

### 1、Hystrix基本使用

Hystrix的主要功能是对出现问题的微服务调用采用熔断处理，可以直接在微服务提供方上进行配置。

修改pom.xml配置文件，追加Hystrix依赖配置。

修改程序启动主类，增加熔断注解配置。

此时的程序配置了熔断机制，这样即使有更多层级的微服务调用，也不会因为某一个微服务出现问题而导致所有的微服务均不可用。

### 2、失败回退

失败回退（fallback）也被称为服务降级，指的是当某个服务不可用时默认执行的处理操作。Hystrix中的失败回退是在客户端实现的一种处理机制。

如果要定义失败回退处理，建议通过FallbackFactory接口来进行实现。

修改IDeptService接口定义，追加fallbackFactory处理。

在进行Feign接口转换中，使用fallback设置当微服务不可用时的返回处理执行类。这样调用失败后，会返回DeptServiceFallback子类中所实现的方法内容。

> **提示：也可以单独定义为一个接口定义Fallback处理类。**
>
> 在进行Fallback类定义时，用户还可以直接创建IDeptService的失败回退子类（DeptServiceFallback），而后在通过@FeignClient注解中的fallback属性（fallback=DeptServiceFallback.class）进行配置。
>
> 这种子类配置有可能造成业务接口对象的注入混淆，所以不建议使用。

修改程序启动主类，追加扫描包配置，需要将配置的Fallback处理类进行配置。

这样当微服务关闭之后，由于服务提供方不再可用，所以此时会自动调用DeptServiceFallback类中的相应方法进行处理，返回的都是固定的“失败”信息，如图9-8所示。

### 3、HystrixDashboard

Hystrix提供了监控功能，这个功能就是Hystrix Dashboard，可以利用它来进行某一个微服务的监控操作。

修改pom.xml配置文件，追加依赖库。

微服务如果需要被监控，则要引入actuator依赖库。

在需要进行监控的控制器方法上追加@HystrixCommand注解。

本程序在控制器中的add()、get()、list()3个方法上使用了@HystrixCommand注解，这样只有这3个方法的状态可以被监控到。

> **提示：@HystrixCommand也可以配置失败回退处理。**
>
> 对于失败回退，也可以直接在控制层进行定义，此时只需要在控制层的相应方法上使用@HystrixCommand注解中的fallbackMethod属性定义。
>
> **范例：** 在控制层上定义失败回退。
>
> 此时，当list()方法执行有问题时，会自动调用listFallback()方法进行失败处理。

修改微服务启动类，追加Hystrix支持。

修改application.yml配置文件，修改运行端口。

定义程序启动主类。

修改hosts配置文件，追加主机信息。

程序配置完成后分别启用所需要的Eureka微服务（mldncloud-eureka-7001）、部门微服务（mldncloud-dept-service-8001）、HystrixDashboard微服务（mldncloud-hystrix-dashboard）、消费端微服务（mldncloud-consumer-feign）。服务启动后通过Dashboard访问地址http://dashboard.com:9001/hystrix，并且输入监控地址http://mldnjava:hello@dept-8001.com:8001/hystrix.stream，界面如图9-9所示。当通过消费端访问微服务之后，会针对微服务的状态进行跟踪，如图9-10所示。

### 4、Turbine聚合监控

HystrixDashboard只能够针对某一个微服务进行监控，如果项目中有许多个微服务，且需要对所有微服务统一监控的时候，就可以使用Turbine来实现聚合监控。

修改pom.xml配置文件，引入Turbine依赖库。

修改application.yml，进行Turbine聚合配置。

如果要对所有的微服务进行监控，则在定义微服务时需要配置认证信息。由于这种认证信息只能够在访问微服务的路径中进行配置，所以需要修改安全配置类，取消对监控路径的安全限制。

在本配置中，忽略了Web安全访问（WebSecurity）下/hystrix.stream、/turbine.stream两个路径的认证，所以对这两个路径不再进行安全认证处理。

定义程序启动类，使用Turbine注解。

本程序在启动主类上使用@EnableTurbine注解，这样就可以启动Turebine聚合监控了。

修改hosts主机配置，增加新的主机名称。

启动所有相关的微服务，随后通过HystrixDashboard启动监控程序，如图9-11所示，输入Turbine的监控路径（http://turbine.com:9101/turbine.stream）并且利用消费端访问相应的微服务信息，就可以得到如图9-12所示的监控结果。

## 四、Zuul路由网关

微服务创建是一个庞大的系统工程，在一个整体项目中往往会存在着若干类的微服务。例如，要开发一个企业管理程序，有可能会用到3类微服务集群：内部员工操作微服务集群、外部客户操作微服务集群和网站管理操作微服务集群。

![Image00416](/assets/Image00416.Bckh5oh1.jpg)

### 1、Zuul整合微服务

Zuul实现的是路由网关微服务，为了方便Zuul的统一管理，所有的Zuul微服务需要向Eureka注册，然后Zuul才可以利用Eureka获取所有的微服务信息，而后客户端再通过Zuul调用微服务，整体流程如图所示。

![Image00417](/assets/Image00417.BC_fqIWo.jpg)

新建【springcloud-zuul-gateway】微服务

修改pom.xml配置文件，追加Zuul相关依赖包。

```
```

Zuul需要向Eureka中注册，同时也需要通过Eureka获取微服务信息。修改application.yml配置文件如下：

```
```

修改程序启动主类，追加Zuul注解配置。

```
```

启动相应微服务。通过Eureka控制中心可以发现，Zuul微服务信息依然会保存到Eureka注册中心。

微服务可以通过Zuul代理访问。由于此时没有进行任何配置，所以可以直接通过Eureka注册的微服务代理http://gateway-9501.com:9501/mldncloud-dept-service/dept/list进行访问，提示信息如下：

```
```

可以发现，当进行Zuul代理访问时，默认情况下采用的就是Eureka的注册名称。

### 2、Zuul访问过滤

Zuul本质上就属于一个网关代理操作。在实际使用中，所有的微服务都要有自己的认证信息，因此，如果用户当前所代理的微服务具有认证信息，就必须在其访问前追加认证的头部操作。这样的功能需要通过Zuul的过滤操作完成。

**提示：关于Zuul网关代理认证设计。**

在本例讲解过程中将首先恢复部门微服务中的认证管理，同时将通过Zuul进行微服务认证的配置。程序进行认证信息定义与处理的过程中采用的基本流程为：Zuul通过过滤器配置微服务的认证信息，而后Zuul再通过SpringSecurity定义Zuul的认证信息，如图9-16所示。

这样的设计结构，密码管理会非常混乱。如果是小型开发，则可以使用。如果是大型开发，则整体项目一旦出现问题，维护成本是相当高的，所以这种认证机制将在后续通过OAuth代替。

建立认证请求过滤器，该过滤器必须继承ZuulFilter父类。

### 3、Zuul路由配置

### 4、Zuul服务降级

### 5、上传微服务

微服务除了可以进行业务处理之外，也可以针对上传功能进行创建，所有的上传微服务依然需要向Eureka中注册，这样就可以在Zuul中进行微服务代理操作。

> **注意：不建议构建上传微服务。**
>
> 在实际的开发过程中，利用微服务端实现上传业务并不是合理做法，从实际开发来讲，上传的功能一般都在Web消费端完成，最好的做法是直接利用Web消费端将上传文件保存到文件服务器中（如FastDFS）。即使现在使用了微服务做上传，那么一般情况下也会将其保存到文件服务器中。所以本节只针对Zuul的功能进行技术性的讨论。

修改application.yml配置文件，追加上传配置。

定义上传Rest微服务。

启动上传微服务，然后可以利用curl命令进行上传测试，测试成功会返回相应的上传信息。

如果需要Zuul进行上传微服务代理，还需要修改application.yml，追加微服务的代理配置项。

## 五、参考资料

\[1]. Java微服务架构实战：SpringBoot+SpringCloud+Docker+RabbitMQ／李兴华

\[2]. https://c.biancheng.net/springcloud/ribbon.html
