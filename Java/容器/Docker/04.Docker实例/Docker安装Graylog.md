---
url: /Java/容器/Docker/04.Docker实例/Docker安装Graylog.md
---

# Docker 安装 Graylog

前期准备

安装docker

安装docker-compose

## 简单安装

二、mongo安装

```shell
docker pull mongo:4.4.6                      #拉取镜像
docker run --name mongo -d mongo:4.4.6       #启动
#
--name   容器名称
-d       后台运行
```

三、elasticsearch安装

```shell
docker pull elasticsearch:7.1.1              
docker run --name elasticsearch -d -e ES_JAVA_OPTS="-Xms512m -Xmx512m"  -e xpack.security.enabled=false -e transport.host=localhost 
#
-e network.host=0.0.0.0 -e http.port:9200 -e "discovery.type=single-node" -p 9200:9200 -p 9300:9300 elasticsearch:7.1.1    
-e 指定环境变量，容器中可以使用该环境变量
-p 指定容器暴露的端口
```

四、graylog安装

```shell
docker pull graylog/graylog:4.3              
docker run --name graylog --link mongo --link elasticsearch -p 9000:9000 -p 12201:12201/udp -p 1514:1514/udp -p 5555:5555
-e GRAYLOG_PASSWORD_SECRET=somepasswordpepper -e GRAYLOG_ROOT_TIMEZONE=Asia/Shanghai -e GRAYLOG_ELASTICSEARCH_HOSTS=http://192.168.1.10:9200 -e GRAYLOG_ROOT_PASSWORD_SHA2=8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918 -e GRAYLOG_HTTP_EXTERNAL_URI="http://192.168.1.10:9000/" -d graylog/graylog:4.3         
#     
-e GRAYLOG_ROOT_PASSWORD_SHA2    为SHA256加密的密文，使用的是admin
```

五、测试

服务器IP地址:9000访问，账号密码均为admin

点击System➡点击Inputs➡选择gelf-http➡点击Launch new input

填写名称和端口，往下拉保存

## docker compose安装

[docker安装graylog\_docker graylog\_黑色鲸鱼的博客-CSDN博客](https://blog.csdn.net/heisejingyu/article/details/128102560)

https://blog.csdn.net/u012954706/article/details/79592060

https://blog.csdn.net/qq\_36120342/article/details/123729329

https://gitee.com/zhengqingya/docker-compose/blob/master/Linux/graylog/docker-compose-graylog.yml#

graylog查询语法

https://blog.csdn.net/weixin\_43066697/article/details/126303133

https://archivedocs.graylog.org/en/latest/pages/searching/query\_language.html
