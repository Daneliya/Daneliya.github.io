---
url: /Java/微服务专栏/03.注册中心/8_Nacos3.md
---

# Nacos 3 安装与避坑指南

Nacos 3.x 与 2.x 相比有几个明显变化，第一次部署很容易踩坑：

* **控制台端口独立**：Web 控制台默认跑在 `8080`，不再是 `8848/nacos`；
* **默认开启鉴权**：`NACOS_AUTH_TOKEN`、`NACOS_AUTH_IDENTITY_KEY`、`NACOS_AUTH_IDENTITY_VALUE` 三个变量必须配齐，否则容器直接退出；
* **全新 Next 控制台 UI**：访问根路径 `/`，自动跳转到 `/next/`；
* **客户端仍然使用 8848 API 端口**：Spring Boot 应用连的是 API 端口，不是控制台端口。

本文以 **Nacos 3.2.4** 为例，记录 Docker 单机部署、MySQL 外接、控制台访问以及常见报错的排查过程。

## 一、端口与访问路径

先记住这张表，后面 90% 的"打不开控制台"问题都源于端口混淆：

| 用途 | 容器内端口 | 宿主机映射示例 | 访问路径 | 使用者 |
| --- | --- | --- | --- | --- |
| Server API / OpenAPI | 8848 | 18848 | `/nacos` | Spring Boot 客户端 |
| gRPC 长连接 | 9848 | 19848 | - | 客户端内部通信 |
| Web 控制台 | 8080 | 18080 | `/` | 浏览器 |
| gRPC 集群通信 | 9849 | 19849 | - | 服务端节点之间 |

> 9848 = 8848 + 1000，9849 = 8848 + 1001，这是 Nacos 2.x/3.x 的固定规则。

***

## 二、准备 MySQL

Nacos 单机模式默认使用内置 Derby 文件数据库。Derby 在容器异常退出、重复启停、磁盘 IO 慢的场景下很容易出现锁超时，**生产环境建议直接外接 MySQL**。

### 2.1 创建数据库和用户

```sql
CREATE DATABASE nacos_config CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE USER 'nacos'@'%' IDENTIFIED BY '请替换为强密码';
GRANT ALL ON nacos_config.* TO 'nacos'@'%';
FLUSH PRIVILEGES;
```

字符集必须是 `utf8mb4`，否则中文配置内容可能写入失败。

### 2.2 导入建表 SQL

从 [Nacos Releases](https://github.com/alibaba/nacos/releases) 下载与镜像版本一致的发行包，例如 `nacos-server-3.2.4.zip`，解压后找到：

```text
nacos/conf/mysql-schema.sql
```

在 `nacos_config` 库中执行该脚本。脚本包含的表以实际版本为准，常见的有：

```text
config_info
config_info_aggr
config_info_beta
config_info_tag
config_tags_relation
group_capacity
his_config_info
tenant_info
users
roles
permissions
```

简单说明：

* `config_info`：配置主表，存放所有配置内容；
* `his_config_info`：配置变更历史，用于版本回滚；
* `tenant_info`：命名空间（tenant）；
* `users` / `roles` / `permissions`：账号与权限。

### 2.3 必须注意的几点

1. **先导入建表 SQL，再启动 Nacos**。否则启动时会报表不存在，直接失败。
2. **容器内不能用 `127.0.0.1` 访问宿主机 MySQL**。MySQL 部署在宿主机时，要写宿主机内网 IP，并确保 3306 端口对容器网段开放。
3. **不要复用旧的 Derby 数据目录**。如果之前用 Derby 跑过，损坏的锁文件会导致新容器启动超时。
4. **MySQL 8 的认证方式**。Nacos 支持 `caching_sha2_password`；如果连接报公钥相关错误，可以在 JDBC 参数中加 `allowPublicKeyRetrieval=true&useSSL=false`。
5. **数据库账号最小权限**。只授予 `nacos_config` 库的权限，不要使用 root。

***

## 三、Docker 单机启动

### 3.1 生成鉴权 Token

Nacos 3.x 要求 `NACOS_AUTH_TOKEN` 是 Base64 字符串，且解码后的原始密钥不少于 32 个字符。生成方式：

```bash
openssl rand -base64 32
```

把输出结果作为 `NACOS_AUTH_TOKEN` 的值。

### 3.2 使用环境变量文件启动（推荐）

命令行参数太多时容易写错，建议把配置放进 `nacos.env`：

```properties
MODE=standalone
JVM_XMS=1g
JVM_XMX=1g
JVM_XMN=512m

NACOS_AUTH_ENABLE=true
NACOS_AUTH_TOKEN=请替换为openssl生成的Base64字符串
NACOS_AUTH_IDENTITY_KEY=serverIdentity
NACOS_AUTH_IDENTITY_VALUE=请替换为自定义值

SPRING_DATASOURCE_PLATFORM=mysql
MYSQL_SERVICE_HOST=192.168.1.100
MYSQL_SERVICE_PORT=3306
MYSQL_SERVICE_DB_NAME=nacos_config
MYSQL_SERVICE_USER=nacos
MYSQL_SERVICE_PASSWORD=请替换为数据库密码
MYSQL_SERVICE_DB_PARAM=characterEncoding=utf8&connectTimeout=1000&socketTimeout=3000&autoReconnect=true&useUnicode=true&useSSL=false&serverTimezone=Asia/Shanghai&allowPublicKeyRetrieval=true
```

启动容器：

```bash
docker run -d --name nacos-demo \
  --env-file nacos.env \
  -p 18848:8848 \
  -p 18080:8080 \
  -p 19848:9848 \
  nacos/nacos-server:v3.2.4
```

> `nacos.env` 中包含数据库密码和鉴权密钥，**不要提交到 Git 仓库**，建议加入 `.gitignore` 或使用密钥管理服务。

### 3.3 使用内置 Derby 启动（仅本地测试）

不接 MySQL 时，可以省略数据库相关变量：

```bash
docker run -d --name nacos-demo \
  -p 18848:8848 \
  -p 18080:8080 \
  -p 19848:9848 \
  -e MODE=standalone \
  -e JVM_XMS=1g \
  -e JVM_XMX=1g \
  -e JVM_XMN=512m \
  -e NACOS_AUTH_ENABLE=true \
  -e NACOS_AUTH_TOKEN="$(openssl rand -base64 32)" \
  -e NACOS_AUTH_IDENTITY_KEY=serverIdentity \
  -e NACOS_AUTH_IDENTITY_VALUE=security \
  nacos/nacos-server:v3.2.4
```

Derby 数据默认写在容器内，容器删除后配置就没了。仅适合本地验证，不要用于生产。

### 3.4 docker-compose 版本

```yaml
services:
  nacos:
    image: nacos/nacos-server:v3.2.4
    container_name: nacos-demo
    restart: unless-stopped
    env_file:
      - nacos.env
    ports:
      - "18848:8848"   # Server API，业务程序使用
      - "18080:8080"   # Web 控制台，浏览器使用
      - "19848:9848"   # gRPC
    volumes:
      - ./nacos-logs:/home/nacos/logs
```

启动：

```bash
docker compose up -d
```

> 使用 MySQL 时不要把 `/home/nacos/data` 挂载到旧目录；日志目录可以单独挂载，方便排查问题。

***

## 四、访问与客户端配置

### 4.1 访问控制台

浏览器打开：

```text
http://服务器IP:18080/
```

Nacos 3.x 会自动跳转到 `/next/` 新版控制台。默认账号密码：

```text
nacos / nacos
```

首次登录后请立即修改默认密码。

注意：**不要用 18848 打开控制台**，18848 是 API 端口，访问后会提示：

```text
Nacos Console default port is 8080, and the path is /.
```

### 4.2 Spring Boot 客户端配置

客户端连接的是 **Server API 端口 18848**，不是控制台端口 18080：

```properties
spring.cloud.nacos.discovery.server-addr=192.168.100.105:18848
spring.cloud.nacos.config.server-addr=192.168.100.105:18848

# 开启鉴权后需要提供账号密码
spring.cloud.nacos.discovery.username=nacos
spring.cloud.nacos.discovery.password=nacos
spring.cloud.nacos.config.username=nacos
spring.cloud.nacos.config.password=nacos
```

### 4.3 防火墙与安全组

需要放行：

* `18080`：控制台；
* `18848`：客户端 API；
* `19848`：gRPC 长连接。

如果 gRPC 端口没有放行，客户端会表现为注册成功但配置监听不生效、或者频繁重连。

***

## 五、常见问题排查

### 5.1 env NACOS\_AUTH\_TOKEN must be set with Base64 String

**现象**：容器启动后立即退出，日志中出现：

```text
env NACOS_AUTH_TOKEN must be set with Base64 String.
```

**原因**：Nacos 3.x 强制要求鉴权三件套，缺少任意一个都会 `exit 255`。2.x 中可以直接启动的命令不能直接复用。

必须配置：

1. `NACOS_AUTH_TOKEN`：Base64 字符串，原始密钥至少 32 位；
2. `NACOS_AUTH_IDENTITY_KEY`；
3. `NACOS_AUTH_IDENTITY_VALUE`。

**解决**：补全环境变量后重新启动：

```bash
docker stop nacos-demo
docker rm nacos-demo

docker run -d --name nacos-demo \
  -p 18848:8848 \
  -p 18080:8080 \
  -p 19848:9848 \
  -e MODE=standalone \
  -e NACOS_AUTH_ENABLE=true \
  -e NACOS_AUTH_TOKEN="$(openssl rand -base64 32)" \
  -e NACOS_AUTH_IDENTITY_KEY=serverIdentity \
  -e NACOS_AUTH_IDENTITY_VALUE=security \
  nacos/nacos-server:v3.2.4
```

**注意事项**：

* `NACOS_AUTH_TOKEN` 必须是 Base64 字符串，不能直接写 32 位明文；
* `NACOS_AUTH_IDENTITY_KEY` / `VALUE` 是服务端节点之间识别身份的凭证，不是控制台账号；
* 测试环境可以用示例值，生产环境务必自行生成并妥善保管。

查看日志确认启动结果：

```bash
docker logs -f nacos-demo
```

### 5.2 load derby-schema.sql error + Login timeout exceeded

**现象**：容器日志中出现：

```text
Caused by: java.sql.SQLTimeoutException: Login timeout exceeded.
Caused by: com.alibaba.nacos.api.exception.runtime.NacosRuntimeException:
  errCode: 500, errMsg: load derby-schema.sql error.
```

完整堆栈中还能看到 `StandaloneDatabaseOperateImpl.init`、`LocalDataSourceServiceImpl.reload`、`EmbeddedDriver.connect` 等调用。

**原因**：单机内置 Derby 数据库初始化超时。常见诱因：

1. 旧容器挂载了损坏或残留的 Derby 数据目录（最常见）；
2. 服务器内存不足，JVM 参数过小，Derby 初始化拿不到资源；
3. 磁盘满、文件权限异常、磁盘 IO 过慢；
4. 快速反复启停容器，Derby 锁文件没有释放。

Derby 是文件型数据库，异常关闭后可能残留锁文件，下次启动会一直等待锁直至超时。

**排查步骤**：

```bash
# 1. 删除旧容器
docker stop nacos-demo
docker rm nacos-demo

# 2. 如果之前挂载过数据卷，确认并清理旧数据
docker volume ls
# docker volume rm <旧数据卷>

# 3. 检查磁盘和内存
df -h
free -h
```

先不要挂载旧数据目录，用最小配置启动验证：

```bash
docker run -d --name nacos-demo \
  -p 18848:8848 \
  -p 18080:8080 \
  -p 19848:9848 \
  -e MODE=standalone \
  -e JVM_XMS=1g \
  -e JVM_XMX=1g \
  -e JVM_XMN=512m \
  -e NACOS_AUTH_ENABLE=true \
  -e NACOS_AUTH_TOKEN="$(openssl rand -base64 32)" \
  -e NACOS_AUTH_IDENTITY_KEY=serverIdentity \
  -e NACOS_AUTH_IDENTITY_VALUE=security \
  nacos/nacos-server:v3.2.4
```

如果服务器内存小于 2G，可以把 JVM 调小：

```bash
-e JVM_XMS=512m -e JVM_XMX=512m -e JVM_XMN=256m
```

**最终建议**：与其反复和 Derby 锁文件纠缠，不如直接外接 MySQL。配置方式见本文第二节和 3.2 节，日志中出现 `use mysql as datasource` 即表示数据库切换成功。

**检查清单**：

* `df -h` 磁盘使用率不能 100%；
* `free -h` 至少保留 600M 以上可用内存；
* 不要复用之前损坏的 Nacos 数据目录；
* 不要短时间反复 `docker stop` / `docker start`；
* 生产环境直接使用 MySQL。

### 5.3 Nacos Console default port is 8080, and the path is /

**现象**：浏览器访问 `http://服务器IP:18848/nacos/`，页面提示：

```text
Nacos Console default port is 8080, and the path is /.
```

**原因**：Nacos 3.x 将 **Server API 端口**和 **Web 控制台端口**拆分了。

* `8848` 是 Server API 端口，路径前缀 `/nacos`，供客户端注册、拉取配置；
* `8080` 是新版 Next 控制台端口，路径是 `/`，供浏览器登录。

只映射了 `18848:8848`，没有映射容器内的 `8080`，所以浏览器访问不到控制台。

**解决**：补上控制台端口映射：

```bash
docker stop nacos-demo
docker rm nacos-demo

docker run -d --name nacos-demo \
  -p 18848:8848 \
  -p 18080:8080 \
  -p 19848:9848 \
  --env-file nacos.env \
  nacos/nacos-server:v3.2.4
```

然后访问：

```text
http://服务器IP:18080/
```

不需要加 `/nacos` 前缀。

**地址对照**：

| 场景 | 错误地址 | 正确地址 |
| --- | --- | --- |
| 浏览器登录控制台 | `http://IP:18848/nacos/` | `http://IP:18080/` |
| Spring Boot 连接 | `http://IP:18080/` | `IP:18848` |

### 5.4 客户端 403 / no right

**现象**：客户端拉取配置或注册服务时报 `403`、`no right`、`user not found`。

**原因**：

* 服务端开启了鉴权，但客户端没有配置用户名密码；
* 密码错误，或使用了 `NACOS_AUTH_IDENTITY_KEY/VALUE` 当作控制台账号；
* 命名空间权限没有授予。

**解决**：

1. 确认控制台能正常登录；
2. 在客户端配置 `username` / `password`；
3. 到控制台的"权限控制"中确认该账号对目标命名空间有读写权限。

### 5.5 MySQL 连接失败

常见错误：

```text
Access denied for user 'nacos'@'...'
Communications link failure
Public Key Retrieval is not allowed
```

排查顺序：

1. 容器内能否访问 MySQL：在容器里执行 `ping` 或 `nc -zv <mysql-host> <port>`；
2. 账号是否允许从容器网段登录（`'nacos'@'%'`）；
3. 密码是否正确，是否包含特殊字符需要转义；
4. MySQL 8 是否需要在 JDBC 参数中加 `allowPublicKeyRetrieval=true&useSSL=false`；
5. 数据库是否已导入 `mysql-schema.sql`。

***

## 六、生产环境建议

1. **使用外部 MySQL**，不要在生产使用 Derby；
2. **至少 3 节点集群**，并配置统一的数据库和鉴权参数；
3. **修改默认密码**，妥善保管 `NACOS_AUTH_TOKEN`，不要把密钥写入代码仓库；
4. **不要将 8848/8080 直接暴露到公网**，通过网关、VPN 或安全组限制访问；
5. **固定镜像版本**，不要使用 `latest`，升级前先看 Release Notes；
6. **挂载日志目录**，方便排查；数据目录交给 MySQL 管理；
7. **配置 JVM 参数**，根据服务器规格调整 `JVM_XMS` / `JVM_XMX` / `JVM_XMN`；
8. **定期备份数据库**，尤其是 `config_info` 和 `his_config_info`。

***

## 七、云上体验：阿里云 MSE

如果只是想快速体验 Nacos 3.x 的 Next 控制台，不想自己维护服务，可以使用阿里云 MSE 注册配置中心。MSE 的内核就是 Nacos，提供免费试用实例：

地址：<https://www.aliyun.com/product/mse>

需要阿里云账号，开通开发版免费额度即可，不需要自己安装服务。

***

## 八、参考资料

* [Nacos 官方文档](https://nacos.io/docs/latest/)
* [Nacos GitHub Releases](https://github.com/alibaba/nacos/releases)
* [Nacos Docker 镜像说明](https://github.com/nacos-group/nacos-docker)
