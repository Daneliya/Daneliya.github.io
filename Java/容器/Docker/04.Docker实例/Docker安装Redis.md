---
url: /Java/容器/Docker/04.Docker实例/Docker安装Redis.md
---

# Docker安装Redis

### 1、查看可用的 Redis 版本

1. 访问 Redis 镜像库地址： https://hub.docker.com/\_/redis?tab=tags。可以通过 Sort by 查看其他版本的 Redis，默认是最新版本 **redis:latest**。也可以在下拉列表中找到想要的版本。
2. 使用用 **docker search redis** 命令来查看可用版本：

### 2、取最新版的 Redis 镜像

这里我们拉取官方的最新版本的镜像：

```sh
docker pull redis:latest
```

### 3、查看本地镜像

使用以下命令来查看是否已安装了 redis：

```sh
docker images
```

### 4、运行容器

安装完成后，我们可以使用以下命令来运行 redis 容器：

```sh
docker run -itd \
  -p 6379:6379 \
  --name redis-test \
  --requirepass "redispwd" \
  redis
```

参数说明：

* **-p 6379:6379**：映射容器服务的 6379 端口到宿主机的 6379 端口。外部可以直接通过宿主机ip:6379 访问到 Redis 的服务。
* \--requirepass：指定密码

### 5、安装成功

最后我们可以通过 **docker ps** 命令查看容器的运行信息：

接着我们通过 redis-cli 连接测试使用 redis 服务。

```sh
docker exec -it redis-test /bin/bash
```
