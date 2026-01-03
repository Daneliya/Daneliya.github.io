---
url: /Java/架构设计/分布式/07.分布式日志收集/2_Logstash使用.md
---

# ELK篇之Logstash使用

传输 和 处理 数据的管道
https://www.elastic.co/guide/en/logstash/7.17/getting-started-with-logstash.html
https://artifacts.elastic.co/downloads/logstash/logstash-7.17.9-windows-x86\_64.zip

好处：用起来方便，插件多
缺点：成本更大、一般要配合其他组件使用（比如 kafka）

事件 Demo：

```bash
cd logstash-7.17.9
.\bin\logstash.bat -e "input { stdin { } } output { stdout {} }"
```

快速开始文档：https://www.elastic.co/guide/en/logstash/7.17/running-logstash-windows.html
监听 udp 并输出：

```nginx
# Sample Logstash configuration for receiving
# UDP syslog messages over port 514

input {
  udp {
    port => 514
    type => "syslog"
  }
}

output {
  stdout { codec => rubydebug }
}
```

要把 MySQL 同步给 Elasticsearch。

问题 1：找不到 mysql 的包
Error: unable to load mysql-connector-java-5.1.36-bin.jar from :jdbc\_driver\_library, file not readable (please check user and group permissions for the path)
Exception: LogStash::PluginLoadingError

解决：修改 Logstash 任务配置中的 jdbc\_driver\_library 为驱动包的绝对路径（驱动包可以从 maven 仓库中拷贝）

增量配置：是不是可以只查最新更新的？可以记录上次更新的数据时间，只查出来 > 该更新时间的数据

小知识：预编译 SQL 的优点？

1. 灵活
2. 模板好懂
3. 快（有缓存）
4. 部分防注入

sql\_last\_value 是取上次查到的数据的最后一行的指定的字段，如果要全量更新，只要删除掉 E:\software\ElasticStack\logstash-7.17.9\data\plugins\inputs\jdbc\logstash\_jdbc\_last\_run 文件即可（这个文件存储了上次同步到的数据）

```nginx
input {
  jdbc {
    jdbc_driver_library => "E:\software\ElasticStack\logstash-7.17.9\config\mysql-connector-java-8.0.29.jar"
    jdbc_driver_class => "com.mysql.jdbc.Driver"
    jdbc_connection_string => "jdbc:mysql://localhost:3306/my_db"
    jdbc_user => "root"
    jdbc_password => "123456"
    statement => "SELECT * from post where updateTime > :sql_last_value"
    tracking_column => "updatetime"
    tracking_column_type => "timestamp"
    use_column_value => true
    parameters => { "favorite_artist" => "Beethoven" }
    schedule => "*/5 * * * * *"
    jdbc_default_timezone => "Asia/Shanghai"
  }
}

output {
  stdout { codec => rubydebug }
}
```

注意查询语句中要按 updateTime 排序，保证最后一条是最大的：

```nginx
input {
  jdbc {
    jdbc_driver_library => "E:\software\ElasticStack\logstash-7.17.9\config\mysql-connector-java-8.0.29.jar"
    jdbc_driver_class => "com.mysql.jdbc.Driver"
    jdbc_connection_string => "jdbc:mysql://localhost:3306/my_db"
    jdbc_user => "root"
    jdbc_password => "123456"
    statement => "SELECT * from post where updateTime > :sql_last_value and updateTime < now() order by updateTime desc"
    tracking_column => "updatetime"
    tracking_column_type => "timestamp"
    use_column_value => true
    parameters => { "favorite_artist" => "Beethoven" }
    schedule => "*/5 * * * * *"
    jdbc_default_timezone => "Asia/Shanghai"
  }
}

output {
  stdout { codec => rubydebug }

  elasticsearch {
    hosts => "http://localhost:9200"
    index => "post_v1"
    document_id => "%{id}"
  }
}
```

两个问题：
1字段全变成小写了
2多了一些我们不想同步的字段

可以编写过滤：

```nginx
input {
  jdbc {
    jdbc_driver_library => "E:\software\ElasticStack\logstash-7.17.9\config\mysql-connector-java-8.0.29.jar"
    jdbc_driver_class => "com.mysql.jdbc.Driver"
    jdbc_connection_string => "jdbc:mysql://localhost:3306/my_db"
    jdbc_user => "root"
    jdbc_password => "123456"
    statement => "SELECT * from post where updateTime > :sql_last_value and updateTime < now() order by updateTime desc"
    tracking_column => "updatetime"
    tracking_column_type => "timestamp"
    use_column_value => true
    parameters => { "favorite_artist" => "Beethoven" }
    schedule => "*/5 * * * * *"
    jdbc_default_timezone => "Asia/Shanghai"
  }
}

filter {
    mutate {
        rename => {
          "updatetime" => "updateTime"
          "userid" => "userId"
          "createtime" => "createTime"
          "isdelete" => "isDelete"
        }
        remove_field => ["thumbnum", "favournum"]
    }
}

output {
  stdout { codec => rubydebug }

  elasticsearch {
    hosts => "127.0.0.1:9200"
    index => "post_v1"
    document_id => "%{id}"
  }
}
```

参考资料：

https://www.bilibili.com/video/BV1Nt4y1m7qL

https://developer.aliyun.com/article/826944

https://www.cnblogs.com/hahaha111122222/p/14949786.html

https://www.cnblogs.com/likecoke/p/13646653.html
