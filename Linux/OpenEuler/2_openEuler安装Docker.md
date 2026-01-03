---
url: /Linux/OpenEuler/2_openEuler安装Docker.md
---

# openEuler安装Docker

在欧拉系统上安装Docker时，可能会遇到一些问题。

```sh
yum install docker
```

**错误信息**:

```sh
Error: Package: docker-ce-18.09.0-3.el7.x86_64 (docker-ce-stable)

Requires: container-selinux >= 2.9
```

这是由于 OpenEuler 没有官方支持的 docker-ce 仓库

### 1、添加Docker官方仓库

首先，添加Docker官方仓库以确保获取最新版本。

```sh
yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
```

### 2、修改配置文件

进入配置文件目录并编辑*docker-ce.repo*文件，将\*$releasever*替换为*7\*。

```sh
cd /etc/yum.repos.d/

vi docker-ce.repo
```

将以下内容：

```sh
baseurl=https://download.docker.com/linux/centos/$releasever/$basearch/stable
```

替换为：

```sh
baseurl=https://download.docker.com/linux/centos/7/$basearch/stable
```

### 3、安装指定版本的Docker

查询可用的Docker版本并安装最新版本。

```sh
yum list docker-ce --showduplicates | sort -r

yum -y install docker-ce-24.0.2
```

### 4、启动并设置Docker开机自启

安装完成后，启动Docker服务并设置为开机自启。

```sh
systemctl start docker

systemctl enable docker
```

通过以上步骤，可以成功在欧拉系统上安装并运行最新版本的Docker。
