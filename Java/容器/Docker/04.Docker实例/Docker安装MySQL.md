---
url: /Java/容器/Docker/04.Docker实例/Docker安装MySQL.md
---

# Docker安装MySQL

### 1、查看可用的 MySQL 版本

1. 访问 MySQL 镜像库地址：https://hub.docker.com/\_/mysql?tab=tags 。可以通过 Sort by 查看其他版本的 MySQL，默认是最新版本 **mysql:latest** 。在下拉列表中找到其他你想要的版本。
2. 使用用 **docker search mysql** 命令来查看可用版本。

### 2、拉取 MySQL 镜像

这里我们拉取官方的最新版本的镜像：

```sh
docker pull mysql:latest
```

### 3、查看本地镜像

使用以下命令来查看是否已安装了 mysql：

```sh
docker images
```

### 4、运行容器

安装完成后，我们可以使用以下命令来运行 mysql 容器：

```sh
docker run -itd \
  -p 3306:3306 \
  --name mysql-test \
  -e MYSQL_ROOT_PASSWORD=123456 \
  mysql
```

参数说明：

* **-p 3306:3306** ：映射容器服务的 3306 端口到宿主机的 3306 端口，外部主机可以直接通过 **宿主机ip:3306** 访问到 MySQL 的服务。
* **MYSQL\_ROOT\_PASSWORD=123456**：设置 MySQL 服务 root 用户的密码。

### 5、安装成功

通过 **docker ps** 命令查看是否安装成功。

本机可以通过 root 和密码 123456 访问 MySQL 服务。

```sh
# 进入 MySQL 容器
docker exec -it mysql-test bash
# 登录 MySQL
mysql -h localhost -u root -p、
# 修改用户密码
ALTER USER 'root'@'localhost' IDENTIFIED BY 'xxl666';
# 添加远程登录用户
CREATE USER 'xxl'@'%' IDENTIFIED WITH mysql_native_password BY 'xxl666';
GRANT ALL PRIVILEGES ON *.* TO 'xxl'@'%';
```
