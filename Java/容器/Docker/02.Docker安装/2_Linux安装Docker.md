---
url: /Java/容器/Docker/02.Docker安装/2_Linux安装Docker.md
---

# Linux安装Docker

Docker 分为 CE 和 EE 两大版本。CE 即社区版（免费，支持周期 7 个月），EE 即企业版，强调安全，付费使用，支持周期 24 个月。

Docker CE 分为 `stable` `test` 和 `nightly` 三个更新频道。

官方网站上有各种环境下的 [安装指南](https://docs.docker.com/install/)，这里主要介绍 Docker CE 在 CentOS上的安装。

## 一、CentOS安装Docker

Docker CE 支持 64 位版本 CentOS 7，并且要求内核版本不低于 3.10， CentOS 7 满足最低内核的要求，所以我们在CentOS 7安装Docker。

### 1.1.卸载（可选）

如果之前安装过旧版本的Docker，可以使用下面命令卸载：

```
yum remove docker \
                  docker-client \
                  docker-client-latest \
                  docker-common \
                  docker-latest \
                  docker-latest-logrotate \
                  docker-logrotate \
                  docker-selinux \
                  docker-engine-selinux \
                  docker-engine \
                  docker-ce
```

完全卸载参考：https://blog.csdn.net/zqmgx13291/article/details/149933601

### 1.2.安装docker

首先需要虚拟机联网，**安装必要的系统工具**

```sh
yum install -y yum-utils \
           device-mapper-persistent-data \
           lvm2 --skip-broken
```

* `yum-utils`：提供 `yum-config-manager` 等管理 YUM 源的实用工具。
* `device-mapper-persistent-data` 和 `lvm2`：Docker 依赖的存储驱动组件（尤其是使用 `devicemapper` 存储驱动时需要）。
* `--skip-broken`：跳过因依赖冲突而无法安装的包，避免整个命令失败（在某些旧系统中可能有用）。

然后更新本地镜像源：

```shell
# 添加官方 Docker CE（Community Edition）的阿里云镜像源
yum-config-manager \
    --add-repo \
    https://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
```

从 **阿里云镜像站** 下载 Docker 的 YUM 仓库配置文件（`docker-ce.repo`），存放在 `/etc/yum.repos.d/` 目录下

```shell
# 将仓库中的原始地址替换为阿里云镜像地址（双重保险）
sed -i 's/download.docker.com/mirrors.aliyun.com\/docker-ce/g' /etc/yum.repos.d/docker-ce.repo
```

虽然阿里云提供的 repo 文件通常已指向其镜像，但有些版本可能仍包含 `download.docker.com`，此 `sed` 命令确保所有 URL 都走阿里云。

```shell
# 生成 YUM 缓存，加速后续安装
yum makecache fast
```

* `yum makecache`：下载仓库元数据并缓存到本地。
* `fast`：只更新变化的部分（较新版本 yum 支持），加快速度。

最后输入命令，**安装 Docker 社区版（Docker CE）**：

```shell
yum install -y docker-ce
```

* `docker-ce` 是 **Docker Community Edition（社区免费版）**，功能完整，适合开发和中小规模生产环境。
* `-y` 表示自动确认“yes”，无需手动输入。
* 此命令会自动安装 `docker-ce` 及其依赖（如 `containerd`, `runc` 等）。

### 1.3.启动docker

Docker应用需要用到各种端口，逐一去修改防火墙设置。非常麻烦，因此建议直接关闭防火墙（非生产）！

启动docker前，一定要关闭防火墙后！！

启动docker前，一定要关闭防火墙后！！

启动docker前，一定要关闭防火墙后！！

```sh
# 关闭
systemctl stop firewalld
# 禁止开机启动防火墙
systemctl disable firewalld
```

通过命令启动docker：

```sh
systemctl start docker  # 启动docker服务

systemctl stop docker  # 停止docker服务

systemctl restart docker  # 重启docker服务

systemctl enable docker  # 设置开机自启
```

然后输入命令，可以查看docker版本：

```sh
docker -v
```

### 1.4.配置镜像加速

docker官方镜像仓库网速较差，我们需要设置国内镜像服务：

参考阿里云的镜像加速文档：https://cr.console.aliyun.com/cn-hangzhou/instances/mirrors

```shell
# Centos/Ubuntu 通过修改daemon配置文件/etc/docker/daemon.json来使用加速器

sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": ["https://2ktfn1p8.mirror.aliyuncs.com"]
}
EOF
sudo systemctl daemon-reload
sudo systemctl restart docker
```

## 二、CentOS7安装DockerCompose

### V1.x

#### 步骤一：下载插件

Linux下需要通过命令下载：

```sh
# 安装
curl -L https://github.com/docker/compose/releases/download/1.23.1/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose
```

* `-L` 表示如果 URL 有重定向（比如 GitHub 的下载链接会跳转到 CDN），自动跟随跳转。
* `uname -s` 返回系统类型，如 `Linux`。
* `uname -m` 返回架构，如 `x86_64`、`aarch64`。

如果服务器无法访问 GitHub（如内网环境），可以在本地下载，上传到`/usr/local/bin/`目录也可以。

❗ 如果提示 `command not found: curl`，说明系统没有安装 `curl` 工具，需先安装：

```sh
# Ubuntu/Debian
apt-get install curl -y
# CentOS/RHEL
yum install curl -y
```

#### 步骤二：修改文件权限

修改文件权限：

```sh
# 修改权限
chmod +x /usr/local/bin/docker-compose
```

#### 步骤三：Base自动补全命令

```sh
# 补全命令
curl -L https://raw.githubusercontent.com/docker/compose/1.29.1/contrib/completion/bash/docker-compose > /etc/bash_completion.d/docker-compose
```

* 这个脚本提供了 Bash shell 的命令自动补全功能。
  * 比如输入 `docker-compose bui` 然后按 `Tab`，会自动补全为 `build`。
  * 支持子命令、服务名、选项等智能提示。
* 文件被保存到 `/etc/bash_completion.d/` 目录：
  * 这是系统级 Bash 补全脚本的标准位置。
  * 只要安装了 `bash-completion` 包，该目录下的脚本会自动加载。

如果`curl` 报错（如连接超时、SSL 错误），这是因为 `raw.githubusercontent.com` 在国内经常被 DNS 污染或屏蔽，导致无法解析或连接，需要修改自己的hosts文件：

```sh
echo "199.232.68.133 raw.githubusercontent.com" >> /etc/hosts
```

* `199.232.68.133` 是 GitHub 的 CDN IP（Fastly），可临时解析 `raw.githubusercontent.com`。
* `>> /etc/hosts` 表示将这行追加到 hosts 文件末尾。
* 修改后，再次运行 `curl` 命令即可成功下载。

#### ✅ 验证补全是否生效

1. 重新加载 Bash 配置：

   ```sh
   source ～/.bashrc
   # 或新开一个终端
   ```

2. 输入 `docker-compose` + 空格 + `Tab`，看是否弹出命令列表。

> 💡 如果系统未安装 `bash-completion`，需先安装：
>
> * CentOS: `yum install -y bash-completion`
> * Ubuntu: `apt-get install -y bash-completion`

### V2.x

#### Docker Compose v2 的核心变化

| 特性         | v1.x（旧版）                       | v2.x（新版）                             |
| :----------- | :--------------------------------- | :--------------------------------------- |
| **命令形式** | `docker-compose`（独立二进制）     | `docker compose`（作为 Docker CLI 插件） |
| **安装方式** | 手动下载二进制到 `/usr/local/bin/` | 安装为 Docker 插件（推荐）或独立二进制   |
| **性能**     | Python 编写，较慢                  | Go 编写，更快、更稳定                    |
| **兼容性**   | 仅支持 `docker-compose.yml`        | 完全兼容 v1 配置文件                     |

`v2.24.0`为**最新稳定版**

#### 步骤 1：确保已安装 Docker Engine（≥ 20.10）

```sh
docker --version
# 要求输出类似：Docker version 20.10.0 或更高
```

#### 步骤 2：下载 Compose v2.24.0 插件

```csharp
# 创建插件目录（如果不存在）
mkdir -p ～/.docker/cli-plugins

# 下载 Compose v2.24.0（Linux x86_64 示例）
curl -SL https://github.com/docker/compose/releases/download/v2.24.0/docker-compose-linux-x86_64 -o /usr/local/bin/docker-compose

# 如果是 ARM 架构（如树莓派、Mac M1/M2），用：
# curl -SL https://github.com/docker/compose/releases/download/v2.24.0/docker-compose-linux-aarch64 -o /usr/local/bin/docker-compose
```

#### 步骤 3：添加执行权限

```sh
chmod +x /usr/local/bin/docker-compose
```

#### 步骤 4：验证安装

```sh
# 查看版本
docker compose version

# 输出示例：
# Docker Compose version v2.24.0
```

#### 配置 Bash 自动补全

**V2.x不再提供独立的 Bash 补全脚本**，而是通过 **Docker CLI 插件机制自动支持补全**

所以不需要手动下载补全脚本 —— **只要正确安装了 `docker compose` 插件，补全功能就自带了！**

**确保已安装** `bash-completion`

```sh
# CentOS / RHEL
yum install -y bash-completion

# Ubuntu / Debian
apt-get install -y bash-completion
```

**第二步：重新加载 shell 或登录新终端**

```sh
exec bash
# 或
source ～/.bashrc
```

**第三步：验证补全是否生效**

```sh
docker compose [按 Tab 键]
```

能看到类似：

```sh
[root@localhost ~]# docker compose
attach   config   create   events   images   logs     pause    ps       push     rm       scale    stats    top      up       wait
build    cp       down     exec     kill     ls       port     pull     restart  run      start    stop     unpause  version  watch
```

## 三、Docker镜像仓库

搭建镜像仓库可以基于Docker官方提供的DockerRegistry来实现。

官网地址：https://hub.docker.com/\_/registry

### 3.1.简化版镜像仓库

Docker官方的Docker Registry是一个基础版本的Docker镜像仓库，具备仓库管理的完整功能，但是没有图形化界面。

搭建方式比较简单，命令如下：

```sh
docker run -d \
    --restart=always \
    --name registry	\
    -p 5000:5000 \
    -v registry-data:/var/lib/registry \
    registry
```

命令中挂载了一个数据卷registry-data到容器内的/var/lib/registry 目录，这是私有镜像库存放数据的目录。

访问http://YourIp:5000/v2/\_catalog 可以查看当前私有镜像服务中包含的镜像

### 3.2.带有图形化界面版本

使用DockerCompose部署带有图象界面的DockerRegistry，命令如下：

```yaml
version: '3.0'
services:
  registry:
    image: registry
    volumes:
      - ./registry-data:/var/lib/registry
  ui:
    image: joxit/docker-registry-ui:static
    ports:
      - 8080:80
    environment:
      - REGISTRY_TITLE=传智教育私有仓库
      - REGISTRY_URL=http://registry:5000
    depends_on:
      - registry
```

### 3.3.配置Docker信任地址

我们的私服采用的是http协议，默认不被Docker信任，所以需要做一个配置：

```sh
# 打开要修改的文件
vi /etc/docker/daemon.json
# 添加内容：
"insecure-registries":["http://192.168.150.101:8080"]
# 重加载
systemctl daemon-reload
# 重启docker
systemctl restart docker
```

## 参考资料

https://www.bilibili.com/video/BV11L411g7U1

[👨‍👦‍👦 多容器通信 - Docker 快速入门 - 易文档 (easydoc.net)](https://docker.easydoc.net/doc/81170005/cCewZWoN/U7u8rjzF)

https://blog.csdn.net/pushiqiang/article/details/78682323

[Ubuntu Docker 安装 | 菜鸟教程 (runoob.com)](https://www.runoob.com/docker/ubuntu-docker-install.html)

修改运行中的docker容器的端口映射：https://blog.csdn.net/lcc2001/article/details/133888294
