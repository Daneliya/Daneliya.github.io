---
url: /Java/架构设计/分布式/07.分布式日志收集/1_Elasticsearch安装.md
---

# ELK篇之安装ElasticSearch和Kibana

传统方式安装ES是一件比较费劲的事情，使用Docker能够非常轻松的安装ElasticSearch。而Kibana是一个针对Elasticsearch的开源分析及可视化平台，使用Kibana可以查询、查看并与存储在ES索引的数据进行交互操作，使用Kibana能执行高级的数据分析，并能以图表、表格和地图的形式查看数据。

> 🐉注意：**只要是一套技术，所有版本必须一致！！！**

## 使用Docker部署单点ES

### 创建网络

需要部署kibana容器，因此需要让es和kibana容器互联。这里先创建一个网络

```sh
docker network create es-net
```

### 加载镜像

> Elasticsearch官网教程：https://www.elastic.co/guide/en/elasticsearch/reference/7.17/setup.html

```sh
# 方式一：从官网下载后，本地上传到虚拟机中，然后运行命令加载即可
docker load -i es.tar
# 方式二：获取docker镜像
docker pull elasticsearch:7.17.0
```

### 运行

运行docker命令，部署单点es：

```sh
docker run -d \
	--name es \
    -e "ES_JAVA_OPTS=-Xms512m -Xmx512m" \
    -e "discovery.type=single-node" \
    -v es-data:/usr/share/elasticsearch/data \
    -v es-plugins:/usr/share/elasticsearch/plugins \
    --privileged \
    --network es-net \
    -p 9200:9200 \
    -p 9300:9300 \
elasticsearch:7.17.0
```

命令解释：

* `-e "cluster.name=es-docker-cluster"`：设置集群名称
* `-e "http.host=0.0.0.0"`：监听的地址，可以外网访问
* `-e "ES_JAVA_OPTS=-Xms512m -Xmx512m"`：内存大小
* `-e "discovery.type=single-node"`：非集群模式
* `-v es-data:/usr/share/elasticsearch/data`：挂载逻辑卷，绑定es的数据目录
* `-v es-logs:/usr/share/elasticsearch/logs`：挂载逻辑卷，绑定es的日志目录
* `-v es-plugins:/usr/share/elasticsearch/plugins`：挂载逻辑卷，绑定es的插件目录
* `--privileged`：授予逻辑卷访问权
* `--network es-net` ：加入一个名为es-net的网络中
* `-p 9200:9200`：端口映射配置

在浏览器中输入：`http://服务器IP地址:9200` ，即可看到elasticsearch的响应结果：

```json
{
  "name" : "e2a76165fe3f",
  "cluster_name" : "docker-cluster",
  "cluster_uuid" : "V2ivzrgSTWCP4E_gjWrBww",
  "version" : {
    "number" : "7.17.0",
    "build_flavor" : "default",
    "build_type" : "docker",
    "build_hash" : "bee86328705acaa9a6daede7140defd4d9ec56bd",
    "build_date" : "2022-01-28T08:36:04.875279988Z",
    "build_snapshot" : false,
    "lucene_version" : "8.11.1",
    "minimum_wire_compatibility_version" : "6.8.0",
    "minimum_index_compatibility_version" : "6.0.0-beta1"
  },
  "tagline" : "You Know, for Search"
}
```

## 使用Docker部署Kibana

### 部署

> Kibana官网教程：https://www.elastic.co/guide/en/elasticsearch/reference/7.17/setup.html

```sh
# 方式一：从官网下载后，本地上传到虚拟机中，然后运行命令加载即可
docker load -i kibana.tar
# 方式二：获取docker镜像
docker pull kibana:7.17.0
```

### 运行

运行docker命令，部署kibana

```sh
docker run -d \
--name kibana \
-e ELASTICSEARCH_HOSTS=http://es:9200 \
--network=es-net \
-p 5601:5601  \
kibana:7.17.0
```

* `--network es-net` ：加入一个名为es-net的网络中，与elasticsearch在同一个网络中

* `-e ELASTICSEARCH_HOSTS=http://es:9200"`：设置elasticsearch的地址，因为kibana已经与elasticsearch在一个网络，因此可以用容器名直接访问elasticsearch

  ```sh
  # 注意：如果忘记设置该项，需要进入容器修改yml中的es地址
  # 1.进入容器
  docker exec -it kibana bash
  # 2.修改ElasticSearch地址
  vi /usr/share/kibana/config/kibana.yml
  # 3.测试：重启kibana容器,访问 http://ip地址:5601
  docker restart kibana
  ```

* `-p 5601:5601`：端口映射配置

kibana启动一般比较慢，需要多等待一会，可以通过命令：

```sh
docker logs -f kibana
```

查看运行日志，当查看到下面的日志，说明成功：

```sh
{"type":"log","@timestamp":"2023-11-14T14:29:23+00:00","tags":["info","plugins-service"],"pid":7,"message":"Plugin \"metricsEntities\" is disabled."}
{"type":"log","@timestamp":"2023-11-14T14:29:23+00:00","tags":["info","http","server","Preboot"],"pid":7,"message":"http server running at http://0.0.0.0:5601"}
```

此时，在浏览器输入地址访问：`http://服务器IP地址:5601`，即可看到结果。

### 扩展：基于数据卷加载配置文件方式运行

* a.从容器复制kibana配置文件出来
* b.修改配置文件为对应ES服务器地址
* c.通过数据卷加载配置文件方式启动

```shell
docker run -d -v /home/tools/kibana/kibana.yml:/usr/share/kibana/config/kibana.yml  --name kibana -p 5601:5601 kibana:7.17.0
```

### DevTools

kibana中提供了一个DevTools界面编写DSL来操作elasticsearch。并且对DSL语句有自动补全功能。

Home——Management——Dev Tools下

```json
GET _search
{
  "query": {
    "match_all": {}
  }
}
```

### 设置中文

```sh
# 查看Kibana容器id
docker ps 
# 进入容器
docker exec -it Kibana容器id bash
# 进入config 目录下
cd config/
# 编辑 kibana.yml 文件
vi kibana.yml 
# 添加一行配置即可
i18n.locale: "zh-CN"
# 退出容器
exit
# 重启Kibana
docker restart Kibana容器id/name
```

问题1：执行`vi kibana.yml`报错 bash: vi: command not found

```sh
# 在容器内更新
apt-get update
# 然后安装vim
apt-get install vim
```

问题2：使用`apt`命令报错 E: List directory /var/lib/apt/lists/partial is missing. - Acquire (13: Permission）

```sh
# 权限不够，使用root权限进入容器
docker exec -u 0 -it Kibana容器id /bin/bash # 0 表示root
# 然后就可以使用apt-get命令了
```

## 使用Docker安装IK分词器

### 在线安装ik插件（较慢）

```sh
# 进入容器内部
docker exec -it es /bin/bash

# 在线下载并安装
./bin/elasticsearch-plugin  install https://github.com/medcl/elasticsearch-analysis-ik/releases/download/v7.17.0/elasticsearch-analysis-ik-7.17.0.zip

#退出
exit
#重启容器
docker restart es
```

### 离线安装ik插件（推荐）

> 官方下载：https://github.com/medcl/elasticsearch-analysis-ik/releases/tag/v7.17.7

1、查看数据卷目录

安装插件需要知道elasticsearch的plugins目录位置，如果用了数据卷挂载方式，需要查看elasticsearch的数据卷目录，通过下面命令查看:

```sh
docker volume inspect es-plugins
```

显示结果：

```sh
[
    {
        "CreatedAt": "2023-11-14T22:04:34+08:00",
        "Driver": "local",
        "Labels": null,
        "Mountpoint": "/var/lib/docker/volumes/es-plugins/_data",
        "Name": "es-plugins",
        "Options": null,
        "Scope": "local"
    }
]
```

说明plugins目录被挂载到了：`/var/lib/docker/volumes/es-plugins/_data `这个目录中。

2、解压缩分词器安装包

从官网下载ik分词器压缩包，解压缩，重命名为ik

3、上传到es容器的插件数据卷中

上传到es容器的插件数据卷中，也就是`/var/lib/docker/volumes/es-plugins/_data `

重启容器

```sh
# 4、重启容器
docker restart es
# 查看es日志
docker logs -f es
```

4、测试

IK分词器包含两种模式：

* `ik_smart`：最少切分
* `ik_max_word`：最细切分

```json
GET /_analyze
{
  "analyzer": "ik_max_word",
  "text": "徐晓龙和小狐狸学elasticsearch"
}
```

结果：

```json
{
  "tokens" : [
    {
      "token" : "徐",
      "start_offset" : 0,
      "end_offset" : 1,
      "type" : "CN_CHAR",
      "position" : 0
    },
    {
      "token" : "晓",
      "start_offset" : 1,
      "end_offset" : 2,
      "type" : "CN_CHAR",
      "position" : 1
    },
    {
      "token" : "龙",
      "start_offset" : 2,
      "end_offset" : 3,
      "type" : "CN_CHAR",
      "position" : 2
    },
    {
      "token" : "和",
      "start_offset" : 3,
      "end_offset" : 4,
      "type" : "CN_CHAR",
      "position" : 3
    },
    {
      "token" : "小",
      "start_offset" : 4,
      "end_offset" : 5,
      "type" : "CN_CHAR",
      "position" : 4
    },
    {
      "token" : "狐狸",
      "start_offset" : 5,
      "end_offset" : 7,
      "type" : "CN_WORD",
      "position" : 5
    },
    {
      "token" : "学",
      "start_offset" : 7,
      "end_offset" : 8,
      "type" : "CN_CHAR",
      "position" : 6
    },
    {
      "token" : "elasticsearch",
      "start_offset" : 8,
      "end_offset" : 21,
      "type" : "ENGLISH",
      "position" : 7
    }
  ]
}
```

### 扩展词词典

随着互联网的发展，“造词运动”也越发的频繁。出现了很多新的词语，在原有的词汇列表中并不存在。比如：“奥力给”，“小黑子” 等。

所以词汇也需要不断的更新，IK分词器提供了扩展词汇的功能。

1）打开IK分词器config目录：

`/var/lib/docker/volumes/es-plugins/_data/ik/config `

在IKAnalyzer.cfg.xml配置文件内容添加：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE properties SYSTEM "http://java.sun.com/dtd/properties.dtd">
<properties>
        <comment>IK Analyzer 扩展配置</comment>
        <!--用户可以在这里配置自己的扩展字典 *** 添加扩展词典-->
        <entry key="ext_dict">ext.dic</entry>
</properties>
```

新建一个 ext.dic，可以参考config目录下复制一个配置文件进行修改

```properties
奥力给
小黑子
```

重启elasticsearch

```sh
docker restart es

# 查看 日志
docker logs -f es
```

日志中已经成功加载ext.dic配置文件

5）测试效果：

```json
GET /_analyze
{
  "analyzer": "ik_max_word",
  "text": "小黑子得到了乐趣，哥哥得到了热度，只有真爱粉破防了。"
}
```

> 注意当前文件的编码必须是 UTF-8 格式，严禁使用Windows记事本编辑

### 停用词词典

在互联网项目中，在网络间传输的速度很快，所以很多语言是不允许在网络上传递的，如：关于宗教、政治等敏感词语，那么在搜索时也应该忽略当前词汇。

IK分词器也提供了强大的停用词功能，让我们在索引时就直接忽略当前的停用词汇表中的内容。

1）IKAnalyzer.cfg.xml配置文件内容添加：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE properties SYSTEM "http://java.sun.com/dtd/properties.dtd">
<properties>
        <comment>IK Analyzer 扩展配置</comment>
        <!--用户可以在这里配置自己的扩展字典-->
        <entry key="ext_dict">ext.dic</entry>
         <!--用户可以在这里配置自己的扩展停止词字典  *** 添加停用词词典-->
        <entry key="ext_stopwords">stopword.dic</entry>
</properties>
```

3）在 stopword.dic 添加停用词

```properties
习大大
```

4）重启elasticsearch

```sh
# 重启服务
docker restart es
docker restart kibana

# 查看 日志
docker logs -f es
```

日志中已经成功加载stopword.dic配置文件

5）测试效果：

```json
GET /_analyze
{
  "analyzer": "ik_max_word",
  "text": "习大大都点赞,奥力给！"
}
```

> 注意当前文件的编码必须是 UTF-8 格式，严禁使用Windows记事本编辑

## 使用docker-compose部署ES集群

部署es集群可以直接使用docker-compose来完成，不过要求Linux虚拟机至少有**4G**的内存空间。

编写一个docker-compose文件：

```yml
version: '2.2'
services:
  es01:
    image: docker.elastic.co/elasticsearch/elasticsearch:7.17.0
    container_name: es01
    environment:
      - node.name=es01
      - cluster.name=es-docker-cluster
      - discovery.seed_hosts=es02,es03
      - cluster.initial_master_nodes=es01,es02,es03
      - bootstrap.memory_lock=true
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
    ulimits:
      memlock:
        soft: -1
        hard: -1
    volumes:
      - data01:/usr/share/elasticsearch/data
    ports:
      - 9200:9200
    networks:
      - elastic
  es02:
    image: docker.elastic.co/elasticsearch/elasticsearch:7.17.0
    container_name: es02
    environment:
      - node.name=es02
      - cluster.name=es-docker-cluster
      - discovery.seed_hosts=es01,es03
      - cluster.initial_master_nodes=es01,es02,es03
      - bootstrap.memory_lock=true
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
    ulimits:
      memlock:
        soft: -1
        hard: -1
    volumes:
      - data02:/usr/share/elasticsearch/data
    networks:
      - elastic
  es03:
    image: docker.elastic.co/elasticsearch/elasticsearch:7.17.0
    container_name: es03
    environment:
      - node.name=es03
      - cluster.name=es-docker-cluster
      - discovery.seed_hosts=es01,es02
      - cluster.initial_master_nodes=es01,es02,es03
      - bootstrap.memory_lock=true
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
    ulimits:
      memlock:
        soft: -1
        hard: -1
    volumes:
      - data03:/usr/share/elasticsearch/data
    networks:
      - elastic

volumes:
  data01:
    driver: local
  data02:
    driver: local
  data03:
    driver: local

networks:
  elastic:
    driver: bridge
```

Run `docker-compose` to bring up the cluster:

```sh
docker-compose up
```

## 使用Docker安装Logstach

> 下载地址：https://www.elastic.co/cn/downloads/logstash

1、下载镜像

```sh
docker pull docker.elastic.co/logstash/logstash:7.17.15
```

2、新建挂载文件

```
mkdir -p /home/tools/logstash/config
mkdir -p /home/tools/logstash/conf.d
mkdir -p /home/tools/logstash/logs
```

3、赋权

```sh
chmod -777 /home/tools/logstash
```

4、挂载配置文件

4.1、新建配置文件`logstash.yml`，放入`/home/tools/logstash/config/`中，在容器启动后，使用的就是该文件配置。

`logstash.yml`文件内容

```yml
http.host: "0.0.0.0"  # 不需要指定ip，填写"0.0.0.0"即可
path.config: /usr/share/logstash/config/conf.d/*.conf
path.logs: /usr/share/logstash/logs

xpack.monitoring.enabled: true
xpack.monitoring.elasticsearch.username: logstash_system  #es xpack账号密码
xpack.monitoring.elasticsearch.password: {密码}            #es xpack账号密码
xpack.monitoring.elasticsearch.hosts: ["http://{ip1}:9200", "http://{ip2}:9200"]  #es地址
```

4.2、挂载日志收集文件

新建自定义日志收集文件，将文件放入`/home/tools/logstash/conf.d/`，在收集日志时，使用的就是该配置。

以如下配置为例，文件名log\_to\_es.conf

```conf
input {
  tcp {
    mode => "server"
    port => 5044
    codec => "json"
  }
}
filter {}
output {
  elasticsearch {
    action => "index"
    hosts  => ["192.168.64.128:9200"]
    index  => "springboot-%{+YYYY.MM.dd}"
  }
}
```

5、部署容器，启动

```sh
docker run -dit --name=logstash \
  --restart=always --privileged=true\
  -e ES_JAVA_OPTS="-Xms512m -Xmx512m" \
  -v /home/tools/logstash/config/logstash.yml:/usr/share/logstash/config/logstash.yml \
  -v /home/tools/logstash/conf.d/:/usr/share/logstash/config/conf.d/ \
  -v /home/tools/logstash/logs/:/usr/share/logstash/logs/ \
  -p 5044:5044 \
  logstash:7.17.15
```

参数详解：

* -p 5044:5044：映射的端口号，与上文conf.d下配置中的input一定要相同！多个地址往后拼接即可`-p 5045:5045-p 5046:5046`
* \--name=logstash：容器名称
* \--restart=always --privileged=true：启动配置
* -e ES\_JAVA\_OPTS="-Xms512m -Xmx512m"：指定内存
* -v /home/tools/logstash/config/logstash.yml:/usr/share/logstash/config/logstash.yml：配置文件挂载
* -v /home/tools/logstash/conf.d/:/usr/share/logstash/config/conf.d/：日志收集配置挂载位置
* -v /home/tools/logstash/logs/:/usr/share/logstash/logs/：日志挂载位置
* -d logstash:7.17.15：指定镜像
