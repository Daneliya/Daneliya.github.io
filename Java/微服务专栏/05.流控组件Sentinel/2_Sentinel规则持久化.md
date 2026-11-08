---
url: /Java/微服务专栏/05.流控组件Sentinel/2_Sentinel规则持久化.md
---
# 2\_Sentinel规则持久化

在微服务架构中，**Sentinel** 常用于流量控制、熔断降级等场景。默认规则存储在内存中，服务重启会丢失，因此需要将规则或监控数据**持久化到数据库**（如 MySQL）以保证可恢复性和可管理性。

方法一：基于Spring Data JPA持久化规则

**步骤：**

**创建数据库表**

```
CREATE TABLE sentinel_rules (
   id INT AUTO_INCREMENT PRIMARY KEY,
   resource VARCHAR(255) NOT NULL,
   strategy INT NOT NULL,
   limit_qps DOUBLE NOT NULL,
   count INT NOT NULL,
   duration INT NOT NULL
);
```

**引入依赖**

```
<dependency>
   <groupId>org.springframework.cloud</groupId>
   <artifactId>spring-cloud-starter-alibaba-sentinel</artifactId>
</dependency>
<dependency>
   <groupId>mysql</groupId>
   <artifactId>mysql-connector-java</artifactId>
</dependency>
```

**配置数据库连接**

```
spring.datasource.url=jdbc:mysql://localhost:3306/your_db?useUnicode=true&characterEncoding=utf8
spring.datasource.username=root
spring.datasource.password=your_password
```

**实现持久化代码**

```
@Entity
@Table(name="sentinel_rules")
public class SentinelRule {
   @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
   private Long id;
   private String resource;
   private int strategy;
   private double limitQps;
   private int count;
   private int duration;
}
public interface SentinelRuleRepository extends JpaRepository<SentinelRule, Long> {}
@Service
public class SentinelRuleService {
   @Autowired private SentinelRuleRepository repo;
   public void addRule(SentinelRule rule){ repo.save(rule); }
}
```

方法二：通过SPI扩展持久化监控数据

**步骤：**

**实现 \*MetricFetcher\* 接口**，在 *fetch()* 方法中获取指标并写入数据库。**注册SPI文件**：在 *META-INF/services/com.alibaba.csp.sentinel.spi.MetricFetcher* 中写入实现类全名。**异步写入**：建议结合线程池或消息队列，避免阻塞Sentinel核心线程。

验证与优化

启动应用后，通过调用 *SentinelRuleService* 添加规则，并在数据库中确认数据是否写入。对于高频监控数据，建议批量插入或使用时序数据库（如InfluxDB）提升性能。

这样即可实现**Sentinel规则与监控数据的持久化**，保证系统在重启或故障后快速恢复配置。

https://www.cnblogs.com/bigcoder84/p/18250563

https://cloud.tencent.com/developer/article/1655863

https://blog.51cto.com/u\_16175446/12954218

https://ask.csdn.net/questions/8641779
