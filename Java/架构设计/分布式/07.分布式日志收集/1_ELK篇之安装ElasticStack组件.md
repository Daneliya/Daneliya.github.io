---
url: /Java/架构设计/分布式/07.分布式日志收集/1_ELK篇之安装ElasticStack组件.md
---

# ELK篇之安装ElasticStack组件

## 一、安装包安装

### 1.1.安装ElasticSearch

下载安装包

```
wget https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-7.1.0-linux-x86_64.tar.gz
```

> 其他版本地址：https://www.elastic.co/downloads/past-releases?product=elasticsearch

解压安装包

```
tar -xzvf elasticsearch-7.1.0-linux-x86_64.tar.gz
```

新建用户和组

es不建议用root用户启用,需要新建用户

```shell
#新建组
groupadd elsearch
#新增用户,并且授予密码
useradd elsearch -g elsearch -p elasticsearch
#切换用户
su elsearch
#授予解压es包的权限
chmod -R 777 elasticsearch-7.1.0

vi /etc/sysctl.conf
vm.max_map_count=262144
sysctl -p
```

更改配置

```yaml
vim ./config/elasticsearch.yml

# ======================== Elasticsearch Configuration =========================
#
# NOTE: Elasticsearch comes with reasonable defaults for most settings.
#       Before you set out to tweak and tune the configuration, make sure you
#       understand what are you trying to accomplish and the consequences.
#
# The primary way of configuring a node is via this file. This template lists
# the most important settings you may want to configure for a production cluster.
#
# Please consult the documentation for further information on configuration options:
# https://www.elastic.co/guide/en/elasticsearch/reference/index.html
#
# ---------------------------------- Cluster -----------------------------------
#
# Use a descriptive name for your cluster:
#
#cluster.name: my-application
#
# ------------------------------------ Node ------------------------------------
#
# Use a descriptive name for the node:
#
#node.name: node-1
#
# Add custom attributes to the node:
#
#node.attr.rack: r1
#
# ----------------------------------- Paths ------------------------------------
#
# Path to directory where to store the data (separate multiple locations by comma):
#
#path.data: /path/to/data
#
# Path to log files:
#
#path.logs: /path/to/logs
#
# ----------------------------------- Memory -----------------------------------
#
# Lock the memory on startup:
#
#bootstrap.memory_lock: true
#
# Make sure that the heap size is set to about half the memory available
# on the system and that the owner of the process is allowed to use this
# limit.
#
# Elasticsearch performs poorly when the system is swapping the memory.
#
# ---------------------------------- Network -----------------------------------
#
# Set the bind address to a specific IP (IPv4 or IPv6):
#
network.host: 0.0.0.0
#
# Set a custom port for HTTP:
#
#http.port: 9200
#
# For more information, consult the network module documentation.
#
# --------------------------------- Discovery ----------------------------------
#
# Pass an initial list of hosts to perform discovery when this node is started:
# The default list of hosts is ["127.0.0.1", "[::1]"]
#
#discovery.seed_hosts: ["host1", "host2"]
#
# Bootstrap the cluster using an initial set of master-eligible nodes:
#
#cluster.initial_master_nodes: ["node-1", "node-2"]

discovery.seed_hosts: ["127.0.0.1", "[::1]"]
cluster.initial_master_nodes: ["node-1"]


# For more information, consult the discovery and cluster formation module documentation.
#
# ---------------------------------- Gateway -----------------------------------
#
# Block initial recovery after a full cluster restart until N nodes are started:
#
#gateway.recover_after_nodes: 3
#
# For more information, consult the gateway module documentation.
#
# ---------------------------------- Various -----------------------------------
#
# Require explicit names when deleting indices:
#
#action.destructive_requires_name: true

```

启动ElasticSearch

```shell
#进入到安装包的bin目录下
./elasticsearch
```

### 1.2.安装Logstash

下载logstash的包

```
wget https://artifacts.elastic.co/downloads/logstash/logstash-7.1.0.tar.gz
```

解压安装包

```
tar -xzvf logstash-7.1.0.tar.gz
```

新增数据存储到es的配置

```shell
#进入logstash-7.1.0目录下的config中
cd logstash-7.1.0/config
#新增文件
vim logstash.conf
input {                                                                                                          
    tcp {
       port => 4560                                                                                             
       codec => "json"                                                                                          
    }                                                                                                            
}                                                                                                                
output {                                                                                                         
elasticsearch { 
   hosts => ["127.0.0.1:9200"]
   index => "logstash-%{+YYYY.MM.dd}"  #索引名
}                                                               
stdout { codec => rubydebug }                                                                              
}
```

启动logstash

```
../bin/logstash -f logstash.conf
```

### 1.3.安装kibana

下载kibana的包

```
wget https://artifacts.elastic.co/downloads/kibana/kibana-7.1.0-linux-x86_64.tar.gz
```

解压kibana的包

```
tar -xzvf kibana-7.1.0-linux-x86_64.tar.gz
```

修改kibana的配置文件

```shell
#进入kibana的配置文件的目录
cd kibana-7.1.0-linux-x86_64/config
#修改kibana.yml的配置文件
vim kibana.yml

# Kibana is served by a back end server. This setting specifies the port to use.
server.port: 5601

# Specifies the address to which the Kibana server will bind. IP addresses and host names are both valid values.
# The default is 'localhost', which usually means remote machines will not be able to connect.
# To allow connections from remote users, set this parameter to a non-loopback address.
server.host: "0.0.0.0"

# Enables you to specify a path to mount Kibana at if you are running behind a proxy.
# Use the `server.rewriteBasePath` setting to tell Kibana if it should remove the basePath
# from requests it receives, and to prevent a deprecation warning at startup.
# This setting cannot end in a slash.
#server.basePath: ""

# Specifies whether Kibana should rewrite requests that are prefixed with
# `server.basePath` or require that they are rewritten by your reverse proxy.
# This setting was effectively always `false` before Kibana 6.3 and will
# default to `true` starting in Kibana 7.0.
#server.rewriteBasePath: false

# The maximum payload size in bytes for incoming server requests.
#server.maxPayloadBytes: 1048576

# The Kibana server's name.  This is used for display purposes.
#server.name: "your-hostname"

# The URLs of the Elasticsearch instances to use for all your queries.
elasticsearch.hosts: ["http://127.0.0.1:9200"]

# When this setting's value is true Kibana uses the hostname specified in the server.host
# setting. When the value of this setting is false, Kibana uses the hostname of the host
# that connects to this Kibana instance.
#elasticsearch.preserveHost: true

# Kibana uses an index in Elasticsearch to store saved searches, visualizations and
# dashboards. Kibana creates a new index if the index doesn't already exist.
#kibana.index: ".kibana"

# The default application to load.
#kibana.defaultAppId: "home"

# If your Elasticsearch is protected with basic authentication, these settings provide
# the username and password that the Kibana server uses to perform maintenance on the Kibana
# index at startup. Your Kibana users still need to authenticate with Elasticsearch, which
# is proxied through the Kibana server.
#elasticsearch.username: "user"
#elasticsearch.password: "pass"

# Enables SSL and paths to the PEM-format SSL certificate and SSL key files, respectively.
# These settings enable SSL for outgoing requests from the Kibana server to the browser.
#server.ssl.enabled: false
#server.ssl.certificate: /path/to/your/server.crt
#server.ssl.key: /path/to/your/server.key

# Optional settings that provide the paths to the PEM-format SSL certificate and key files.
# These files validate that your Elasticsearch backend uses the same key files.
#elasticsearch.ssl.certificate: /path/to/your/client.crt
#elasticsearch.ssl.key: /path/to/your/client.key

# Optional setting that enables you to specify a path to the PEM file for the certificate
# authority for your Elasticsearch instance.
#elasticsearch.ssl.certificateAuthorities: [ "/path/to/your/CA.pem" ]

# To disregard the validity of SSL certificates, change this setting's value to 'none'.
#elasticsearch.ssl.verificationMode: full

# Time in milliseconds to wait for Elasticsearch to respond to pings. Defaults to the value of
# the elasticsearch.requestTimeout setting.
#elasticsearch.pingTimeout: 1500

# Time in milliseconds to wait for responses from the back end or Elasticsearch. This value
# must be a positive integer.
#elasticsearch.requestTimeout: 30000

# List of Kibana client-side headers to send to Elasticsearch. To send *no* client-side
# headers, set this value to [] (an empty list).
#elasticsearch.requestHeadersWhitelist: [ authorization ]

# Header names and values that are sent to Elasticsearch. Any custom headers cannot be overwritten
# by client-side headers, regardless of the elasticsearch.requestHeadersWhitelist configuration.
#elasticsearch.customHeaders: {}

# Time in milliseconds for Elasticsearch to wait for responses from shards. Set to 0 to disable.
#elasticsearch.shardTimeout: 30000

# Time in milliseconds to wait for Elasticsearch at Kibana startup before retrying.
#elasticsearch.startupTimeout: 5000

# Logs queries sent to Elasticsearch. Requires logging.verbose set to true.
#elasticsearch.logQueries: false

# Specifies the path where Kibana creates the process ID file.
#pid.file: /var/run/kibana.pid

# Enables you specify a file where Kibana stores log output.
#logging.dest: stdout

# Set the value of this setting to true to suppress all logging output.
#logging.silent: false

# Set the value of this setting to true to suppress all logging output other than error messages.
#logging.quiet: false

# Set the value of this setting to true to log all events, including system usage information
# and all requests.
#logging.verbose: false

# Set the interval in milliseconds to sample system and process performance
# metrics. Minimum is 100ms. Defaults to 5000.
#ops.interval: 5000

# Specifies locale to be used for all localizable strings, dates and number formats.
i18n.locale: "zh-CN"
```

启动kibana

```sh
#进入到kibana的bin目录下
cd ../bin

#启动服务
./kibana
```

## 二、Docker部署

传统方式安装ES是一件比较费劲的事情，使用Docker能够非常轻松的安装ElasticSearch。而Kibana是一个针对Elasticsearch的开源分析及可视化平台，使用Kibana可以查询、查看并与存储在ES索引的数据进行交互操作，使用Kibana能执行高级的数据分析，并能以图表、表格和地图的形式查看数据。

> 🐉注意：**只要是一套技术，所有版本必须一致！！！**

### 2.1. 使用Docker部署单点ES

#### 创建网络

需要部署kibana容器，因此需要让es和kibana容器互联。这里先创建一个网络

```sh
docker network create es-net
```

#### 加载镜像

> Elasticsearch官网教程：https://www.elastic.co/guide/en/elasticsearch/reference/7.17/setup.html

```sh
# 方式一：从官网下载后，本地上传到虚拟机中，然后运行命令加载即可
docker load -i es.tar
# 方式二：获取docker镜像
docker pull elasticsearch:7.17.0
```

#### 运行

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

### 2.2. 使用Docker部署Kibana

#### 部署

> Kibana官网教程：https://www.elastic.co/guide/en/elasticsearch/reference/7.17/setup.html

```sh
# 方式一：从官网下载后，本地上传到虚拟机中，然后运行命令加载即可
docker load -i kibana.tar
# 方式二：获取docker镜像
docker pull kibana:7.17.0
```

#### 运行

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

#### 扩展：基于数据卷加载配置文件方式运行

* a.从容器复制kibana配置文件出来
* b.修改配置文件为对应ES服务器地址
* c.通过数据卷加载配置文件方式启动

```shell
docker run -d -v /home/tools/kibana/kibana.yml:/usr/share/kibana/config/kibana.yml  --name kibana -p 5601:5601 kibana:7.17.0
```

#### DevTools

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

#### 设置中文

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

### 2.3. 使用Docker安装IK分词器

#### 在线安装ik插件（较慢）

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

#### 离线安装ik插件（推荐）

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

#### 扩展词词典

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

#### 停用词词典

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

### 2.4. 使用docker-compose部署ES集群

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

### 2.5. 使用Docker安装Logstach

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
