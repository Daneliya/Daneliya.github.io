---
url: /Java/架构设计/分布式/05.分布式任务调度/1_XXL-JOB介绍.md
---

# XXL-JOB介绍

> 文档：<https://www.xuxueli.com/xxl-job/>
>
> 源码地址：<https://gitee.com/xuxueli0323/xxl-job>

XXL-JOB有调度端（Admin）和执行器组成，Admin端是单独部署的主要负责调度，执行器就是各个SpringBoot工程用来执行业务功能。

## 数据库配置

首先创建数据库`xxl_job`，然后导入[SQL文件](https://gitee.com/xuxueli0323/xxl-job/blob/master/doc/db/tables_xxl_job.sql)。

## JAR包部署

下载源码后，打包部署`xxl-job-admin`及`xxl-job-executor-samples`。

部署后通过 `http://ip:8080/xxl-job-admin/`访问。

## Docker部署

```shell
docker pull xuxueli/xxl-job-admin:2.3.1

docker run -d -e PARAMS="--spring.datasource.url=jdbc:mysql://数据库ip地址:3306/xxl_job?Unicode=true&characterEncoding=UTF-8&autoReconnect=true&serverTimezone=Asia/Shanghai --spring.datasource.username=数据库账号 --spring.datasource.password=数据库密码 --xxl.job.accessToken=自己设置accesToken"  -p 8080:8080 -v  /mydata/docker/xxl-job-data:/data/applogs --name xxl-job-admin  --restart=always xuxueli/xxl-job-admin:2.3.1
```

部署后通过 `http://ip:8080/xxl-job-admin/`访问。
