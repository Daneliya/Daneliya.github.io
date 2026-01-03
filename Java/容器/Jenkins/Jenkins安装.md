---
url: /Java/容器/Jenkins/Jenkins安装.md
---

# Jenkins及其所必备环境安装

> 维基介绍：https://wiki.jenkins-ci.org/
>
> 官网安装文档：https://www.jenkins.io/doc/book/installing/

Jenkins运行需要jdk环境，实现自动打包部署需要maven，因此除了安装jenkins还需要安装jdk和maven。自动化构建需要我们从代码仓库获取代码，因此Git也是必须的。

## 安装JDK11

在安装Jenkins之前，服务器上需要安装有jdk和jre。

```bash
sudo apt install openjdk-11-jdk
java -version #检查是否安装成功
```

## 安装Jenkins（Ubuntu下）

其他Linux发行版下安装可参考官方文档

### war包安装

首先需要[下载Jenkins (opens new window)](https://www.jenkins.io/zh/download/)的war包，并上传到服务器中，我下载后上传到了服务器的`/home/xxl/tools/jenkins`目录下

```bash
nohup java -jar jenkins.war >jenkinslog.log 2>&1 &  #运行jenkins
cat nohup.out # 查看日志 
```

### 在线安装

```bash
sudo wget -O /usr/share/keyrings/jenkins-keyring.asc \
  https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key
echo deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] \
  https://pkg.jenkins.io/debian-stable binary/ | sudo tee \
  /etc/apt/sources.list.d/jenkins.list > /dev/null
# 更新
sudo apt-get update
sudo apt-get install jenkins
```

安装完成后用浏览器访问 `http://服务器IP:8080` 。

8080为Jenkins默认端口，初次访问可以配置管理员账号密码及端口信息，也可以通过配置修改。

安装完成后将进程拉起可以使用：`service jenkins start/stop/restart`。

### 配置修改

## 安装Maven

```bash
// 安装依赖管理工具maven
sudo apt install maven
// 查看maven版本是否安装成功
mvn -v
```

### 配置maven镜像

```bash
sudo find / -name settings.xml
sudo vi /etc/maven/settings.xml
```

修改`mirrors`标签包裹的下载源

```bash
<mirror>
    <!--This sends everything else to /public -->
    <id>nexus</id>
    <mirrorOf>*</mirrorOf> 
    <url>http://maven.aliyun.com/nexus/content/groups/public/</url>
</mirror>
<mirror>
    <!--This is used to direct the public snapshots repo in the 
          profile below over to a different nexus group -->
    <id>nexus-public-snapshots</id>
    <mirrorOf>public-snapshots</mirrorOf> 
    <url>http://maven.aliyun.com/nexus/content/repositories/snapshots/</url>
</mirror>
<mirror>
    <!--This is used to direct the public snapshots repo in the 
          profile below over to a different nexus group -->
    <id>nexus-public-snapshots1</id>
    <mirrorOf>public-snapshots1</mirrorOf> 
    <url>https://artifacts.alfresco.com/nexus/content/repositories/public/</url>
</mirror>
```

## 安装git

```bash
sudo apt install git
or
sudo yum install git
```

## 错误

1、无法获得锁 /var/lib/dpkg/lock-frontend。

```markdown
问题描述
    执行 sudo apt-get install jenkins 报错
    E: 无法获得锁 /var/lib/dpkg/lock-frontend。锁正由进程 48252（unattended-upgr）持有
    N: 请注意，直接移除锁文件不一定是合适的解决方案，且可能损坏您的系统。
    E: 无法获取 dpkg 前端锁 (/var/lib/dpkg/lock-frontend)，是否有其他进程正占用它？

原因分析
    在前一步sudo apt-get update时出现错误导致没有正确关闭连接，或没有执行完毕就手动关闭了terminal终端。

解决方法：
    在终端输入下面代码强制解锁：
    sudo rm /var/lib/dpkg/lock-frontend
    sudo rm /var/lib/dpkg/lock
```

2、Starting jenkins (via systemctl):  Job for jenkins.service failed.

```markdown
问题描述
    使用 service jenkins start/stop/restart出现如下提示：
    Starting jenkins (via systemctl):  Job for jenkins.service failed. 
    See 'systemctl status jenkins.service' and 'journalctl -xn' for details.[FAILED]

    官网提示是因为没有安装java所导致。
    官网地址：
    https://wiki.jenkins-ci.org/display/JENKINS/Installing+Jenkins+on+Red+Hat+distributions
    Note: if you get the following error message, ensure that Java has been installed:
    Starting jenkins (via systemctl):  Job for jenkins.service failed. 
    See 'systemctl status jenkins.service' and 'journalctl -xn' for details.
```
