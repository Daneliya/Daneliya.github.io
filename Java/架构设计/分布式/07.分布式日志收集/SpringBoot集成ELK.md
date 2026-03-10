---
url: /Java/架构设计/分布式/07.分布式日志收集/SpringBoot集成ELK.md
---
# SpringBoot集成ELK

## SpringBoot集成ELK

### 一.ElasticSearch的安装

> 1. 下载安装包
>
> ```
> wget https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-7.1.0-linux-x86_64.tar.gz
> ```
>
> 2. 解压安装包
>
> ```
> tar -xzvf elasticsearch-7.1.0-linux-x86_64.tar.gz
> ```
>
> 3. 新建用户和组(es不建议用root用户启用,需要新建用户)
>
> ```shell
> #新建组
> groupadd elsearch
> #新增用户,并且授予密码
> useradd elsearch -g elsearch -p elasticsearch
> #切换用户
> su elsearch
> #授予解压es包的权限
> chmod -R 777 elasticsearch-7.1.0
>
> vi /etc/sysctl.conf
> vm.max_map_count=262144
> sysctl -p
> ```
>
> 4. 更改配置
>
> ```yaml
> vim ./config/elasticsearch.yml
>
> # ======================== Elasticsearch Configuration =========================
> #
> # NOTE: Elasticsearch comes with reasonable defaults for most settings.
> #       Before you set out to tweak and tune the configuration, make sure you
> #       understand what are you trying to accomplish and the consequences.
> #
> # The primary way of configuring a node is via this file. This template lists
> # the most important settings you may want to configure for a production cluster.
> #
> # Please consult the documentation for further information on configuration options:
> # https://www.elastic.co/guide/en/elasticsearch/reference/index.html
> #
> # ---------------------------------- Cluster -----------------------------------
> #
> # Use a descriptive name for your cluster:
> #
> #cluster.name: my-application
> #
> # ------------------------------------ Node ------------------------------------
> #
> # Use a descriptive name for the node:
> #
> #node.name: node-1
> #
> # Add custom attributes to the node:
> #
> #node.attr.rack: r1
> #
> # ----------------------------------- Paths ------------------------------------
> #
> # Path to directory where to store the data (separate multiple locations by comma):
> #
> #path.data: /path/to/data
> #
> # Path to log files:
> #
> #path.logs: /path/to/logs
> #
> # ----------------------------------- Memory -----------------------------------
> #
> # Lock the memory on startup:
> #
> #bootstrap.memory_lock: true
> #
> # Make sure that the heap size is set to about half the memory available
> # on the system and that the owner of the process is allowed to use this
> # limit.
> #
> # Elasticsearch performs poorly when the system is swapping the memory.
> #
> # ---------------------------------- Network -----------------------------------
> #
> # Set the bind address to a specific IP (IPv4 or IPv6):
> #
> network.host: 0.0.0.0
> #
> # Set a custom port for HTTP:
> #
> #http.port: 9200
> #
> # For more information, consult the network module documentation.
> #
> # --------------------------------- Discovery ----------------------------------
> #
> # Pass an initial list of hosts to perform discovery when this node is started:
> # The default list of hosts is ["127.0.0.1", "[::1]"]
> #
> #discovery.seed_hosts: ["host1", "host2"]
> #
> # Bootstrap the cluster using an initial set of master-eligible nodes:
> #
> #cluster.initial_master_nodes: ["node-1", "node-2"]
>
> discovery.seed_hosts: ["127.0.0.1", "[::1]"]
> cluster.initial_master_nodes: ["node-1"]
>
>
> # For more information, consult the discovery and cluster formation module documentation.
> #
> # ---------------------------------- Gateway -----------------------------------
> #
> # Block initial recovery after a full cluster restart until N nodes are started:
> #
> #gateway.recover_after_nodes: 3
> #
> # For more information, consult the gateway module documentation.
> #
> # ---------------------------------- Various -----------------------------------
> #
> # Require explicit names when deleting indices:
> #
> #action.destructive_requires_name: true
>
> ```
>
> 5. 启动ElasticSearch
>
> ```shell
> #进入到安装包的bin目录下
> ./elasticsearch
> ```
>
> 6.

### 二.logstash的安装

> 1.下载logstash的包
>
> ```
> wget https://artifacts.elastic.co/downloads/logstash/logstash-7.1.0.tar.gz
> ```
>
> 2.解压安装包
>
> ```
> tar -xzvf logstash-7.1.0.tar.gz
> ```
>
> 3.新增数据存储到es的配置
>
> ```shell
> #进入logstash-7.1.0目录下的config中
> cd logstash-7.1.0/config
> #新增文件
> vim logstash.conf
> input {                                                                                                          
>    tcp {
>        port => 4560                                                                                             
>        codec => "json"                                                                                          
>    }                                                                                                            
> }                                                                                                                
> output {                                                                                                         
>    elasticsearch { 
>        hosts => ["127.0.0.1:9200"]
>        index => "logstash-%{+YYYY.MM.dd}"  #索引名
>    }                                                               
>    stdout { codec => rubydebug }                                                                              
> }
> ```
>
> 4.启动logstash
>
> ```
> ../bin/logstash -f logstash.conf
> ```

### 三.kibana的安装

> 1.下载kibana的包
>
> ```
> wget https://artifacts.elastic.co/downloads/kibana/kibana-7.1.0-linux-x86_64.tar.gz
> ```
>
> 2.解压kibana的包
>
> ```
> tar -xzvf kibana-7.1.0-linux-x86_64.tar.gz
> ```
>
> 3.修改kibana的配置文件
>
> ```shell
> #进入kibana的配置文件的目录
> cd kibana-7.1.0-linux-x86_64/config
> #修改kibana.yml的配置文件
> vim kibana.yml
>
> # Kibana is served by a back end server. This setting specifies the port to use.
> server.port: 5601
>
> # Specifies the address to which the Kibana server will bind. IP addresses and host names are both valid values.
> # The default is 'localhost', which usually means remote machines will not be able to connect.
> # To allow connections from remote users, set this parameter to a non-loopback address.
> server.host: "0.0.0.0"
>
> # Enables you to specify a path to mount Kibana at if you are running behind a proxy.
> # Use the `server.rewriteBasePath` setting to tell Kibana if it should remove the basePath
> # from requests it receives, and to prevent a deprecation warning at startup.
> # This setting cannot end in a slash.
> #server.basePath: ""
>
> # Specifies whether Kibana should rewrite requests that are prefixed with
> # `server.basePath` or require that they are rewritten by your reverse proxy.
> # This setting was effectively always `false` before Kibana 6.3 and will
> # default to `true` starting in Kibana 7.0.
> #server.rewriteBasePath: false
>
> # The maximum payload size in bytes for incoming server requests.
> #server.maxPayloadBytes: 1048576
>
> # The Kibana server's name.  This is used for display purposes.
> #server.name: "your-hostname"
>
> # The URLs of the Elasticsearch instances to use for all your queries.
> elasticsearch.hosts: ["http://127.0.0.1:9200"]
>
> # When this setting's value is true Kibana uses the hostname specified in the server.host
> # setting. When the value of this setting is false, Kibana uses the hostname of the host
> # that connects to this Kibana instance.
> #elasticsearch.preserveHost: true
>
> # Kibana uses an index in Elasticsearch to store saved searches, visualizations and
> # dashboards. Kibana creates a new index if the index doesn't already exist.
> #kibana.index: ".kibana"
>
> # The default application to load.
> #kibana.defaultAppId: "home"
>
> # If your Elasticsearch is protected with basic authentication, these settings provide
> # the username and password that the Kibana server uses to perform maintenance on the Kibana
> # index at startup. Your Kibana users still need to authenticate with Elasticsearch, which
> # is proxied through the Kibana server.
> #elasticsearch.username: "user"
> #elasticsearch.password: "pass"
>
> # Enables SSL and paths to the PEM-format SSL certificate and SSL key files, respectively.
> # These settings enable SSL for outgoing requests from the Kibana server to the browser.
> #server.ssl.enabled: false
> #server.ssl.certificate: /path/to/your/server.crt
> #server.ssl.key: /path/to/your/server.key
>
> # Optional settings that provide the paths to the PEM-format SSL certificate and key files.
> # These files validate that your Elasticsearch backend uses the same key files.
> #elasticsearch.ssl.certificate: /path/to/your/client.crt
> #elasticsearch.ssl.key: /path/to/your/client.key
>
> # Optional setting that enables you to specify a path to the PEM file for the certificate
> # authority for your Elasticsearch instance.
> #elasticsearch.ssl.certificateAuthorities: [ "/path/to/your/CA.pem" ]
>
> # To disregard the validity of SSL certificates, change this setting's value to 'none'.
> #elasticsearch.ssl.verificationMode: full
>
> # Time in milliseconds to wait for Elasticsearch to respond to pings. Defaults to the value of
> # the elasticsearch.requestTimeout setting.
> #elasticsearch.pingTimeout: 1500
>
> # Time in milliseconds to wait for responses from the back end or Elasticsearch. This value
> # must be a positive integer.
> #elasticsearch.requestTimeout: 30000
>
> # List of Kibana client-side headers to send to Elasticsearch. To send *no* client-side
> # headers, set this value to [] (an empty list).
> #elasticsearch.requestHeadersWhitelist: [ authorization ]
>
> # Header names and values that are sent to Elasticsearch. Any custom headers cannot be overwritten
> # by client-side headers, regardless of the elasticsearch.requestHeadersWhitelist configuration.
> #elasticsearch.customHeaders: {}
>
> # Time in milliseconds for Elasticsearch to wait for responses from shards. Set to 0 to disable.
> #elasticsearch.shardTimeout: 30000
>
> # Time in milliseconds to wait for Elasticsearch at Kibana startup before retrying.
> #elasticsearch.startupTimeout: 5000
>
> # Logs queries sent to Elasticsearch. Requires logging.verbose set to true.
> #elasticsearch.logQueries: false
>
> # Specifies the path where Kibana creates the process ID file.
> #pid.file: /var/run/kibana.pid
>
> # Enables you specify a file where Kibana stores log output.
> #logging.dest: stdout
>
> # Set the value of this setting to true to suppress all logging output.
> #logging.silent: false
>
> # Set the value of this setting to true to suppress all logging output other than error messages.
> #logging.quiet: false
>
> # Set the value of this setting to true to log all events, including system usage information
> # and all requests.
> #logging.verbose: false
>
> # Set the interval in milliseconds to sample system and process performance
> # metrics. Minimum is 100ms. Defaults to 5000.
> #ops.interval: 5000
>
> # Specifies locale to be used for all localizable strings, dates and number formats.
> i18n.locale: "zh-CN"
>
> ```
>
> 4. 启动kibana
>
> ```
> #进入到kibana的bin目录下
> cd ../bin
> #启动服务
> ./kibana
> ```
>
> 5.

### 四.SpringBoot集成elk(logback)

> 1. 导入依赖
>
> ```xml
>  <dependency>
>             <groupId>net.logstash.logback</groupId>
>             <artifactId>logstash-logback-encoder</artifactId>
>             <version>5.3</version>
> </dependency>
> ```
>
> 2. 新增logback-spring.xml的配置文件
>
> ```xml
> ---配置方式一 
> <?xml version="1.0" encoding="UTF-8"?>
> <configuration debug="false">
>    <!--提取配置文件中的服务名-->
>     <springProperty scope="context" name="springApplicationName" source="spring.application.name" />
>     <property name="LOG_HOME" value="logs/demo.log" />
>     <appender name="STDOUT" class="ch.qos.logback.core.ConsoleAppender">
>         <encoder class="ch.qos.logback.classic.encoder.PatternLayoutEncoder">
>             <pattern>%d{yyyy-MM-dd HH:mm:ss.SSS} [%thread] %-5level %logger{50} - %msg%n</pattern>
>         </encoder>
>     </appender>
>
>     <appender name="logstash" class="net.logstash.logback.appender.LogstashTcpSocketAppender">
>         <destination>124.223.119.48:4560</destination>
>         <encoder class="net.logstash.logback.encoder.LogstashEncoder" >
>             <!--定义appname的名字是服务名,多服务时,根据这个进行区分日志-->
>             <customFields>{"appname": "${springApplicationName}"}</customFields>
>         </encoder>
>     </appender>
>
>     <root level="INFO">
>         <appender-ref ref="STDOUT" />
>         <appender-ref ref="logstash" />
>     </root>
> </configuration>
>
>
> ---配置方式二
> <?xml version="1.0" encoding="UTF-8"?>
> <configuration debug="false">
>   <springProperty scope="context" name="springApplicationName" source="spring.application.name" />
>   <property name="LOG_HOME" value="logs/demo.log" />
>   <appender name="STDOUT" class="ch.qos.logback.core.ConsoleAppender">
>       <encoder class="ch.qos.logback.classic.encoder.PatternLayoutEncoder">
>           <pattern>%d{yyyy-MM-dd HH:mm:ss.SSS} [%thread] %-5level %logger{50} - %msg%n</pattern>
>       </encoder>
>   </appender>
>
>   <!--DEBUG日志输出到LogStash-->
>   <appender name="LOG_STASH_DEBUG" class="net.logstash.logback.appender.LogstashTcpSocketAppender">
>       <filter class="ch.qos.logback.classic.filter.ThresholdFilter">
>           <level>DEBUG</level>
>       </filter>
>       <destination>124.223.119.48:4560</destination>
>       <encoder charset="UTF-8" class="net.logstash.logback.encoder.LoggingEventCompositeJsonEncoder">
>           <providers>
>               <timestamp>
>                   <timeZone>Asia/Shanghai</timeZone>
>               </timestamp>
>               <!--自定义日志输出格式-->
>               <pattern>
>                   <pattern>
>                       {
>                       "project": "elk",
>                       "level": "%level",
>                       "service": "${springApplicationName:-}",
>                       "pid": "${PID:-}",
>                       "thread": "%thread",
>                       "class": "%logger",
>                       "message": "%message",
>                       "stack_trace": "%exception"
>                       }
>                   </pattern>
>               </pattern>
>           </providers>
>       </encoder>
>   </appender>
>
>   <root >
>       <appender-ref ref="STDOUT" />
>       <appender-ref ref="LOG_STASH_DEBUG" />
>   </root>
> </configuration>
>
> ```
>
> 3. 登录kibana,端口默认时5601  http://ip:5601
>
> 4. 索引配置,进行页面展示的数据
>
> 5. 查看日志
