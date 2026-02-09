---
url: /Java/微服务专栏/03.注册中心/3_Nacos安装.md
---

# Nacos安装指南

## 一、Windows安装

开发阶段采用单机安装即可。

### 1.1.下载安装包

在Nacos的GitHub页面，提供有下载链接，可以下载编译好的Nacos服务端或者源代码：

GitHub主页：https://github.com/alibaba/nacos

GitHub的Release下载页：https://github.com/alibaba/nacos/releases

如图：

![image-20210402161102887](/assets/image-20210402161102887.BVrTH8Li.png)

最新版本为1.4.1，下载`nacos-server-1.4.1.zip`包使用。

### 1.2.解压

将这个包解压到任意非中文目录下，如图：

![image-20210402161843337](/assets/image-20210402161843337.Co-ia5ny.png)

目录说明：

* bin：启动脚本
* conf：配置文件

### 1.3.端口配置

Nacos的默认端口是8848，如果你电脑上的其它进程占用了8848端口，请先尝试关闭该进程。

**如果无法关闭占用8848端口的进程**，也可以进入nacos的conf目录，修改配置文件中的端口：

![image-20210402162008280](/assets/image-20210402162008280.C3fdkmZQ.png)

修改其中的内容：

![image-20210402162251093](/assets/image-20210402162251093.B8nquITT.png)

### 1.4.启动

启动非常简单，进入bin目录，结构如下：

![image-20210402162350977](/assets/image-20210402162350977.DYFDHidv.png)

然后执行命令即可，windows命令：

```sh
startup.cmd -m standalone
```

执行后的效果如图：

![image-20210402162526774](/assets/image-20210402162526774.D_xu6845.png)

### 1.5.访问

在浏览器输入地址：http://127.0.0.1:8848/nacos即可：

![image-20210402162630427](/assets/image-20210402162630427.LpxqM671.png)

默认的账号和密码都是nacos，进入后：

![image-20210402162709515](/assets/image-20210402162709515.CsW7VTST.png)

## 二、Linux安装

Linux或者Mac安装方式与Windows类似。

### 2.1.安装JDK

Nacos依赖于JDK运行，索引Linux上也需要安装JDK才行。

上传jdk安装包：

::: navCard

```yaml
- name: JDK8
  desc: Java 集成开发环境
  link: https://www.oracle.com/cn/java/technologies/javase/javase8-archive-downloads.html
  img: /svg/website/java.svg
  badge: 开发环境
```

:::

上传到某个目录，例如：`/usr/local/`

然后解压缩：

```sh
tar -xvf jdk-8u144-linux-x64.tar.gz
```

然后重命名为java

配置环境变量：

```sh
export JAVA_HOME=/usr/local/java
export PATH=$PATH:$JAVA_HOME/bin
```

设置环境变量：

```sh
source /etc/profile
```

### 2.2.上传Nacos安装包

如图：

![image-20210402161102887](/assets/image-20210402161102887.BVrTH8Li.png)

上传到Linux服务器的某个目录，例如`/usr/local/src`目录下：

![image-20210402163715580](/assets/image-20210402163715580.DH19jCg5.png)

### 2.3.解压

命令解压缩安装包：

```sh
tar -xvf nacos-server-1.4.1.tar.gz
```

然后删除安装包：

```sh
rm -rf nacos-server-1.4.1.tar.gz
```

目录中最终样式：

![image-20210402163858429](/assets/image-20210402163858429.LdfHt_RN.png)

目录内部：

![image-20210402164414827](/assets/image-20210402164414827.C-CRAGtd.png)

### 2.4.端口配置

与windows中类似，修改`/conf/application.properties`

```properties
#*************** Spring Boot Related Configurations ***************#
### Default web context path:
server.servlet.contextPath=/nacos
### Include message field
server.error.include-message=ALWAYS
### Default web server port:
server.port=8848
```

### 2.5.单机配置（非必须）

修改`bin`目录下的`startup.sh`

```sh
[root@localhost bin]# cd nacos/bin/
[root@localhost bin]# ls
shutdown.cmd  shutdown.sh  startup.cmd  startup.sh
[root@localhost bin]# vim startup.sh
```

找到下面这段配置

![image-20260113000252881](/assets/image-20260113000252881.CGXKZkiw.png)

将MODE的值改为

```sh
MODE="standalone" # cluster代表集群启动，standalone为单机启动，默认为集群启动
```

### 2.6.启动

在nacos/bin目录中，输入命令启动Nacos：

```sh
sh startup.sh -m standalone
```

### 补充：配置数据库存储

MySQL中创建数据库nacos，导入`nacos/conf/nacos-mysql.sql`的sql文件

修改配置文件`nacos/conf/application.properties`

![image-20260113001027190](/assets/image-20260113001027190.DxErUTJL.png)

```properties
#*************** Config Module Related Configurations ***************#
### If use MySQL as datasource:
# spring.datasource.platform=mysql

### Count of DB:
db.num=1 #取消注释

### Connect URL of DB:
### 取消注释并修改数据库连接地址，连接用户及用户密码
db.url.0=jdbc:mysql://127.0.0.1:3306/nacos?characterEncoding=utf8&connectTimeout=1000&socketTimeout=3000&autoReconnect=true&useUnicode=true&useSSL=false&serverTimezone=UTC
db.user.0=nacos
db.password.0=nacos
```

操作完成，打开浏览器访问localhost:8848，默认用户密码为nacos，nacos。

进入配置环境中配置的信息都会保存到MySQL中。

### 补充：配置开机自启

添加nacos.service文件,Exec开头的三个配置路径改为自己的nacos路径即可。

```sh
vim /lib/systemd/system/nacos.service
```

```sh
[Unit]
Description=nacos
After=network.target
 
[Service]
Type=forking
ExecStart=/tools/nacos/bin/startup.sh -m standalone
ExecReload=/tools/nacos/bin/shutdown.sh
ExecStop=/tools/nacos/bin/shutdown.sh
PrivateTmp=true
 
[Install]
WantedBy=multi-user.target
```

重新加载使nacos服务配置生效。

```sh
systemctl daemon-reload
```

设置nacos服务自启

```sh
systemctl enable nacos.service
```

修改javac软连接

```sh
# 查看javac位置
which javac

# 建立软连接 /usr/local/jdk8u322-b06/bin/javac路径改为自己的，如果提示/usr/bin/javac文件已存在，先删掉，重新建立
ln -s /usr/local/jdk8u322-b06/bin/javac /usr/bin/javac
```

启动/停止

```sh
systemctl start nacos.service

systemctl stop nacos.service
```

查看启动状态

```sh
systemctl status nacos.service
```

## 参考资料

https://www.cnblogs.com/ComfortableM/p/17384518.html
