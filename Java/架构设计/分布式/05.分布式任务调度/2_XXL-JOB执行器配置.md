---
url: /Java/架构设计/分布式/05.分布式任务调度/2_XXL-JOB执行器配置.md
---

# XXL-JOB执行器配置

执行器配置简单来说就是在SpringBoot项目中配置XXL-JOB。

## 1、引入依赖

```xml
<dependency>
    <groupId>com.xuxueli</groupId>
    <artifactId>xxl-job-core</artifactId>
    <version>2.3.1</version>
</dependency>
```

## 2、application.yml配置文件

```yaml
xxl:
  job:
    admin:
      addresses: http://localhost:8080/xxl-job-admin
      accessToken: xxl666
    executor:
      appname: xxl-job-executor-sample # 给你的执行器起个名字
```

### 3、创建配置文件

```java
@Slf4j
@Component
public class XxlJobConfig {

    @Value("${xxl.job.admin.addresses}")
    private String adminAddresses;
    @Value("${xxl.job.admin.accessToken}")
    private String accessToken;
    @Value("${xxl.job.executor.appname}")
    private String appname;

    @Bean
    public XxlJobSpringExecutor xxlJobExecutor() {
        log.info(">>>>>>>>>>> xxl-job config init.");
        XxlJobSpringExecutor xxlJobSpringExecutor = new XxlJobSpringExecutor();
        xxlJobSpringExecutor.setAdminAddresses(adminAddresses);
        xxlJobSpringExecutor.setAppname(appname);
        xxlJobSpringExecutor.setAccessToken(accessToken);
        return xxlJobSpringExecutor;
    }

}
```
