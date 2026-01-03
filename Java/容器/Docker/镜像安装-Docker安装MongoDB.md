---
url: /Java/容器/Docker/镜像安装-Docker安装MongoDB.md
---

# Docker安装MongoDB

### 1、查看可用的 MongoDB 版本

1. 访问 MongoDB 镜像库地址： https://hub.docker.com/\_/mongo?tab=tags\&page=1。可以通过 Sort by 查看其他版本的 MongoDB，默认是最新版本 **mongo:latest**。也可以在下拉列表中找到想要的版本。
2. 使用 **docker search mongo** 命令来查看可用版本。

### 2、拉取最新版的 MongoDB 镜像

拉取官方的最新版本的镜像：

```sh
docker pull mongo:latest
```

### 3、查看本地镜像

使用以下命令来查看是否已安装了 mongo：

```sh
docker images
```

TAG显示（latest）证明已安装最新版本 mongo 镜像。

### 4、运行容器

安装完成后，使用以下命令来运行 mongo 容器：

```sh
docker run -d \
 -p 27017:27017 \
 --name \
 my-mongo-container mongo
```

参数说明：

* `-d`: 后台运行容器。
* `-p 27017:27017`: 将主机的27017端口映射到容器的27017端口。
* `--name my-mongo-container`: 为容器指定一个名字，这里是`my-mongo-container`，你可以根据需要更改。

### 5、安装成功

最后我们可以通过 **docker ps** 命令查看容器的运行信息：

```sh
$ docker ps
CONTAINER ID   IMAGE                                      COMMAND                   CREATED          STATUS                          PORTS                                                                                            NAMES
1e29386a1343   mongo                                      "docker-entrypoint.s…"   10 seconds ago   Up 9 seconds                    0.0.0.0:27017->27017/tcp, :::27017->27017/tcp                                                    my-mongo-container
```

能够看到名为 **my-mongo-container** 的 MongoDB 容器正在运行。

接下来可以使用 MongoDB 客户端（例如 mongo shell）连接到运行中的 MongoDB 容器。

你可以使用以下命令连接到 MongoDB：

```sh
$ docker exec -it my-mongo-container bash
root@1e29386a1343:/# mongosh --host 127.0.0.1 --port 27017
Current Mongosh Log ID: 659056f433cd505b37dee3ed
Connecting to:          mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000
Using MongoDB:          5.0.5
Using Mongosh:          1.1.6

For mongosh info see: https://docs.mongodb.com/mongodb-shell/


To help improve our products, anonymous usage data is collected and sent to MongoDB periodically (https://www.mongodb.com/legal/privacy-policy).
You can opt-out by running the disableTelemetry() command.

------
   The server generated these startup warnings when booting:
   2023-12-30T17:42:24.704+00:00: Access control is not enabled for the database. Read and write access to data and configuration is unrestricted
   2023-12-30T17:42:24.704+00:00: /sys/kernel/mm/transparent_hugepage/enabled is 'always'. We suggest setting it to 'never'
   2023-12-30T17:42:24.705+00:00: /sys/kernel/mm/transparent_hugepage/defrag is 'always'. We suggest setting it to 'never'
------

test> exit
root@1e29386a1343:/# exit
exit
```

这将连接到本地主机的 27017 端口，你可以根据之前映射的端口进行调整。

进入 MongoDB 容器的 bash shell 命令如下：

```sh
docker exec -it my-mongo-container bash
```

记得在不再需要时停止和删除容器，可以使用以下命令：

```sh
docker stop my-mongo-container
docker rm my-mongo-container
```
