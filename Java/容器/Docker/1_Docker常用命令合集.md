---
url: /Java/容器/Docker/1_Docker常用命令合集.md
---

# Docker常用命令合集

* 搜索镜像：docker search name

  镜像官网：https://hub.docker.com

* 构建容器：docker run -itd --name=mycentos centos:7
  * **-i** ：表示以交互模式运行容器（让容器的标准输入保持打开）
  * **-d**：表示后台运行容器，并返回容器ID
  * **-t**：为容器重新分配一个伪输入终端 { "registry-mirrors": \["https://5xok66d4.mirror.aliyuncs.com"] }
  * **--name**：为容器指定名称 查看本地所有的容器：docker ps -a

* 查看本地所有的容器：**docker ps -a**

* 查看本地正在运行的容器：**docker ps**

* 停止容器：**docker stop id或name**

* 一次性停止所有容器：**docker stop $(docker ps -a -q)**

* 启动容器：**docker start id或name**\*\*

* 重启容器：**docker restart id或name**

* 删除容器：**docker rm id或name**

* 强制删除容器：**docker rmi -f id或name**

* 查看容器详细信息：**docker inspect id或name**

* 进入容器：**docker exec -it id /bin/bash**

* 获取所有容器的id：**docker ps -a -q** 或 **docker ps -aq**

* 查看容器日志：**docker ps logs id/name**

* 动态查看日志：**docker ps logs -f id/name**

* 查看容器创建的网络：**docker network ls**

* 删除网络：**docker network rm container\_name\_net**

容器启动之attached和detached模式

两种模式最简单的对比理解就是：attached模式在前台运行，detached模式在后台运行。

detached模式的开启方法，就是加一个参数`-d`或者`--detach`，一般我们采用的都是这种方式，命令如下：

```shell
docker run -d -p 80:80 nginx
```

attached模式可能调试起来更为方便，因此Docker也提供了detached模式转换attached模式：`docker attach id/name`

镜像的导入与导出

* 镜像的导出：**docker image save 镜像名称:版本 -o 导出的文件名**
* 镜像的导入：**docker image load -i 镜像地址+名称**
