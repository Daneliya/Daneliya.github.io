---
url: /Java/容器/Docker/03.Docker使用/spring-boot-docker-compose.md
---
# spring-boot-docker-compose

新拿到一个 Spring Boot 项目的代码，想把代码跑起来试试，第一个烦恼是不是自己的电脑上没有安装或没有启动对应环境（MySQL、Redis、MQ消息队列等等）。

这些环境装完或者启动完，大半天就过去了。然后还要设置账号密码和配置里的一致等等。最崩溃的是换个项目又要重新忙活一次。

**Spring Boot 3** 引入了对 Docker Compose 的支持，使得在 Spring Boot 应用程序中管理容器变得更加方便。

> **Docker Compose** 是一个用于定义和运行多容器 Docker 应用程序的工具。通过一个简单的 YAML 文件，可以配置应用程序所需的所有服务，并使用单个命令启动和停止它们。

### 引入依赖

现在 Spring Boot 3 新加了一个包 `spring-boot-docker-compose`：

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-docker-compose</artifactId>
    <version>3.4.0</version>
</dependency>
```

这个包用处就是自动帮你在docker里拉取对应的镜像环境并且自动启动。

### 创建 Docker Compose 文件

创建一个 docker-compose.yml 文件来定义服务

```yaml
# Docker Compose配置文件
# 使用版本3.8的Compose文件格式
version: '3.8'

# 定义服务
services:
  # MongoDB服务
  db:
    # 使用最新版本的MongoDB镜像
    image: mongo:latest
    # 映射端口：主机端口:容器端口
    ports:
      # - '27017:27017' # 固定端口映射方式
      - '27017' # 左边不写固定端口，让Docker分配随机端口防止冲突
    # 挂载卷，用于持久化数据
    volumes:
      - db:/data/db

  # MySQL服务
  mysql:
    # 使用8.0版本的MySQL镜像
    image: mysql:8.0
    # 映射端口：只指定容器端口，让Docker分配随机主机端口防止冲突
    ports:
      # - '3306:3306'  # 固定端口映射方式
      - '3306' # 左边不写固定端口，让Docker分配随机端口防止冲突
    # 环境变量配置
    environment:
      MYSQL_ROOT_PASSWORD: root  # MySQL root用户密码
      MYSQL_DATABASE: test        # 默认创建的数据库名称
      MYSQL_USER: test            # 创建的普通用户名称
      MYSQL_PASSWORD: test        # 普通用户的密码
    # 挂载卷
    volumes:
      - mysql-data:/var/lib/mysql           # 持久化MySQL数据
      - mysql-init:/docker-entrypoint-initdb.d  # 初始化脚本目录
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"] # 检查MySQL是否健康
      interval: 10s # 检查间隔时间
      timeout: 5s # 超时时间
      retries: 5 # 重试次数

  # Redis服务
  redis:
    # 使用7.0版本的Redis镜像
    image: redis:7.0
    # 映射端口：主机端口:容器端口
    ports:
      # - '6379:6379'
      - '6379' # 左边不写固定端口，让Docker分配随机端口防止冲突
    # 挂载卷，用于持久化数据
    # volumes:
    #   - redis-data:/data
    # 启动命令，启用AOF持久化
    # command: redis-server --appendonly yes

# 定义卷
volumes:
  # MongoDB数据卷
  db:
    driver: local
  # MySQL数据卷
  mysql-data:
    driver: local
  # MySQL初始化脚本卷
  mysql-init:
    driver: local
  # Redis数据卷
  redis-data:
    driver: local
```

### 配置 Spring Boot 应用程序

需要告诉 Spring Boot 3 Docker Compose 文件的位置。可以在 application.yml 文件中添加以下配置：

```yaml
spring:
 docker:
   compose:
     enabled: true
     file: docker-compose.yml
```

启动之后会看到拉取镜像的日志了：

## IDEA连接远程

在 IDEA 中使用`spring-boot-docker-compose`插件，将 Spring Boot 项目部署到**远程服务器的 Docker**上并启动，核心是配置 IDEA 连接远程 Docker、编写`docker-compose.yml`，并通过插件或命令完成部署启动。下面分步骤讲解，从环境准备到项目启动，确保每一步都可落地。

### 一、前置条件（必做）

1. 远程服务器准备：
   * 已安装 Docker 和 Docker Compose（推荐 Docker 20.10+）；
   * 开启 Docker 远程访问（允许 IDEA 连接）；
   * 服务器开放 Docker 远程端口（默认 2375，需防火墙放行）。
2. 本地 IDEA 准备：
   * IDEA 2022.3+（内置`spring-boot-docker-compose`插件，低版本需手动安装）；
   * 项目引入 Spring Boot 3.1+（`spring-boot-docker-compose`从 3.1 开始内置支持）；
   * 本地安装`docker-compose`（可选，仅用于本地调试命令）。

### 二、步骤 1：配置远程 Docker（让 IDEA 连接远程服务器的 Docker）

这是核心前提，IDEA 需能访问远程服务器的 Docker 守护进程：

#### 1.1 远程服务器开启 Docker 远程访问

编辑 Docker 配置文件，开启 TCP 端口访问：

```bash
# 1. 编辑Docker配置（不同系统路径可能不同）
vim /etc/docker/daemon.json

# 2. 添加以下内容（允许远程访问，注意替换服务器内网IP）
{
  "hosts": ["tcp://0.0.0.0:2375", "unix:///var/run/docker.sock"]
}

# 3. 重启Docker服务
systemctl daemon-reload
systemctl restart docker

# 4. 验证端口是否开放（服务器执行）
netstat -tnlp | grep 2375
# 输出类似：tcp6       0      0 :::2375                 :::*                    LISTEN      1234/dockerd
```

> 安全提示：生产环境需限制 IP 访问（如仅允许你的本地 IP），或使用 TLS 加密（参考 Docker 官方文档）。

#### 1.2 IDEA 配置远程 Docker 连接

1. 打开 IDEA → 点击顶部`File` → `Settings` → `Build, Execution, Deployment` → `Docker`；
2. 点击`+`添加 Docker 连接，选择`TCP socket`；
3. 配置参数：
   * Name：自定义（如`Remote-Docker`）；
   * Engine API URL：`tcp://远程服务器IP:2375`（如`tcp://192.168.1.100:2375`）；
4. 点击`Test Connection`，提示`Connection successful`即配置成功；
5. 点击`Apply` → `OK`保存。

注意上述设置完还会报错

```
com.intellij.execution.ExecutionException: Cannot run program "docker"
```

![image-20260128154944173](/assets/image-20260128154944173.CobSjvd5.png)

需要取消自动检测，手动设置下Docker的执行路径

Docker执行脚本的下载地址：https://download.docker.com/win/static/stable/x86\_64/

![image-20260128155721668](/assets/image-20260128155721668.DCIzqQa7.png)

执行后还会报错

![image-20260128160103375](/assets/image-20260128160103375.B4AaQYNP.png)

在上述流程后，仍有可能出现buildx工具无法找到的情况，此时进行如下操作

* 在你的用户文件夹下（或在文件管理地址栏输入 `%USERPROFILE%` 定位）
* 新建 `.docker` 文件夹（注意有个“.”）
* 在 `.docker` 下面再新建一个 `cli-plugins`文件夹
* 下载文件：

https://github.com/docker/buildx/releases/download/v0.13.1/buildx-v0.13.1.windows-amd64.exe

* 下载下来，然后重命名为 `docker-buildx.exe`，然后放入`cli-plugins`文件夹中

![image-20260128170016263](/assets/image-20260128170016263.BWhG7Bxf.png)

## TLS认证连接

直接暴露`tcp://0.0.0.0:2375` 存在安全风险（无认证），且该配置在部分 Docker 版本中会与系统默认配置冲突；更推荐使用 TLS 认证的方式，而非直接暴露 2375 端口（无认证的 2375 端口是高危操作）。

https://www.cnblogs.com/guangdelw/p/17565051.html

https://www.cnblogs.com/walterlong/articles/11444770.html

https://blog.csdn.net/wssdds/article/details/124916924

https://blog.csdn.net/refuse\_wwj/article/details/119242525

[在 Docker 容器中运行数据库 | IntelliJ IDEA 文档](https://www.jetbrains.com/zh-cn/help/idea/running-a-dbms-image.html)

[Spring Boot 3 中对 Docker Compose 的支持 - spring 中文网](https://springdoc.cn/docker-compose-support-spring-boot/)

https://blog.csdn.net/2301\_76154806/article/details/141404952

https://ximeneschen.blog.csdn.net/article/details/125651027

[docker-compose部署springboot项目\_docker-compose springboot-CSDN博客](https://blog.csdn.net/xujingyiss/article/details/119179987)

https://blog.csdn.net/qq\_46028493/article/details/148593977

[【IDEA】解决idea2024无法使用远程构建dockerfile的问题\_idea2024 docker-CSDN博客](https://blog.csdn.net/Equent/article/details/137779505)
