---
url: /Java/容器/Docker/镜像安装-Docker安装Nginx.md
---

# Docker安装Nginx

### 1、查看可用的 Nginx 版本

1. 访问 Nginx 镜像库地址： https://hub.docker.com/\_/nginx?tab=tags。可以通过 Sort by 查看其他版本的 Nginx，默认是最新版本 **nginx:latest**。在下拉列表中找到其他你想要的版本。
2. 使用用 **docker search nginx** 命令来查看可用版本。

### 2、取最新版的 Nginx 镜像

这里我们拉取官方的最新版本的镜像：

```sh
docker pull nginx:latest
```

### 3、查看本地镜像

使用以下命令来查看是否已安装了 nginx：

```sh
docker images
```

TAG显示（latest）证明已安装最新版本 nginx 镜像。

```sh
[root@192 ~]# docker images
REPOSITORY                            TAG       IMAGE ID       CREATED         SIZE
nginx                                 latest    605c77e624dd   2 years ago     141MB
```

### 4、运行容器

安装完成后，我们可以使用以下命令来运行 nginx 容器：

```sh
docker run --rm \
-p 8080:80 \
--name nginx-test \
-v /dir/dist/:/usr/share/nginx/html \
-d nginx
```

参数说明：

* `--rm`: 这是一个标志，意味着当容器停止运行时，自动删除该容器。这对于临时任务或一次性任务很有用，因为不需要手动清理。
* **-p 8080:80**： 端口进行映射，将本地 8080 端口映射到容器内部的 80 端口。
* **--name nginx-test**：容器名称。
* `-v /dir/dist/:/usr/share/nginx/html`: 这是一个卷映射。它将宿主机上的`/dir/dist/`目录映射到容器内的`/usr/share/nginx/html`目录。这意味着，如果在宿主机上的`/dir/dist/`目录中有所有的文件和文件夹，它们将出现在容器内的相应位置。这对于配置静态网站或应用程序的部署非常有用。
* **-d nginx**： 设置容器在在后台一直运行。

### 5、安装成功

最后我们可以通过浏览器可以直接访问 8080 端口的 nginx 服务。
