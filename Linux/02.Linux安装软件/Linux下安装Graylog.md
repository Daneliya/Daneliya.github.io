---
url: /Linux/02.Linux安装软件/Linux下安装Graylog.md
---

# Linux下安装Graylog

https://www.cnblogs.com/luckyleaf/p/11157905.html

https://blog.csdn.net/qq\_37837722/article/details/90482512

https://blog.csdn.net/liukuan73/article/details/52525431

https://www.yingtwo.com/article/7990658.html

https://www.cnblogs.com/majiang/p/14380803.html

https://www.jianshu.com/p/0af261b76d0c

graylog\_deflector索引作用

```
要配置Graylog以使用graylog_deflector索引并根据策略将数据转发到其他索引中，您需要进行以下步骤：

1. 登录到Graylog的Web界面。
2. 导航到"System"（系统）菜单，然后选择"Indices"（索引）选项。
3. 在索引列表中，找到名为graylog_deflector的索引。如果不存在，请点击"Create index set"（创建索引集）按钮创建一个新的索引集，并将其命名为graylog_deflector。
4. 在graylog_deflector索引的配置页面上，您可以设置以下参数：
- Rotation Strategy（轮询策略）：选择用于切换索引的策略，例如按时间、按大小或其他规则。
- Index Prefix（索引前缀）：指定其他索引的名称前缀。例如，如果您希望创建名为graylog_2022-01-01、graylog_2022-01-02等的索引，可以将前缀设置为graylog_。
- Index Template（索引模板）：选择要应用于新创建的索引的模板。模板定义了索引的设置和映射规则。
- Index Set Configuration（索引集配置）：根据需要配置其他高级设置，例如分片数、副本数等。
5. 完成配置后，点击"Save"（保存）按钮以保存graylog_deflector索引的配置。

一旦graylog_deflector索引配置完成，Graylog将根据您设置的策略自动将数据转发到其他索引中。根据策略的不同，Graylog可能会创建新的索引并将数据写入其中，或者将数据写入已存在的索引中。

请注意，配置graylog_deflector索引和数据转发策略可能需要根据您的具体需求进行调整。建议参考Graylog的官方文档或寻求更详细的配置指南以获得更准确的配置信息。
```

Elasticsearch 健康状态为 yellow 问题的解决

[单节点 Elasticsearch 健康状态为 yellow 问题的解决\_elasticsearch yellow-CSDN博客](https://blog.csdn.net/ale2012/article/details/106992995)

[Elasticsearch(ES)生产集群健康状况为黄色(yellow)的官方详细解释、原因分析和解决方案(实测可用)\_es容器 健康状态yellow-CSDN博客](https://blog.csdn.net/myhes/article/details/106076544)

单机安装

https://blog.csdn.net/qixiaolinlin/article/details/129966703

https://blog.csdn.net/liukuan73/article/details/52525431

https://huaweicloud.csdn.net/637f7accdacf622b8df85933.html

https://www.cnblogs.com/runliuv/p/15475747.html

[在生产环境中使用Graylog日志系统所踩过的坑-阿里云开发者社区 (aliyun.com)](https://developer.aliyun.com/article/738051)

-bash: pwgen: command not found

https://blog.csdn.net/weixin\_37391237/article/details/121389868

查看graylog报错日志：如果提示报错，请查看 **/var/log/graylog-server**/ 下的日志文件，或 journalctl -xe -u graylog

修改用户名密码

https://www.codeleading.com/article/43856151066

graylog查询语法

https://blog.csdn.net/weixin\_43066697/article/details/126303133

## 问题

### 未启动成功

```bash
# 运行如下启动命令未成功
sudo systemctl start graylog-server.service
# 使用journalctl命令来查看Graylog Server服务的日志。这个命令会显示系统日志中与指定服务相关的条目
sudo journalctl -u graylog-server.service
# 如果只想查看最近的日志，可以使用-n选项指定条目数量，例如：
sudo journalctl -u graylog-server.service -n 100
# 如果您想实时查看日志更新（类似于tail -f），可以使用-f选项，这将持续显示新的日志条目，直到停止命令
sudo journalctl -u graylog-server.service -f
# journalctl命令依赖于systemd的日志系统，这是许多现代Linux发行版（如Ubuntu、CentOS 7及更高版本等）的默认日志管理系统。如果您的系统不使用systemd，那么可能需要使用其他工具（如tail命令查看/var/log目录下的日志文件）来查看服务日志
```

### mongo连接问题

```
2024-02-22T14:48:19.007+08:00 INFO  [MongoDBPreflightCheck] MongoDB is not available. Retry #121
2024-02-22T14:48:21.008+08:00 INFO  [MongoDBPreflightCheck] MongoDB is not available. Retry #122
2024-02-22T14:48:23.008+08:00 INFO  [MongoDBPreflightCheck] MongoDB is not available. Retry #123
2024-02-22T14:48:25.009+08:00 INFO  [MongoDBPreflightCheck] MongoDB is not available. Retry #124
2024-02-22T14:48:27.009+08:00 INFO  [MongoDBPreflightCheck] MongoDB is not available. Retry #125
2024-02-22T14:48:29.010+08:00 INFO  [MongoDBPreflightCheck] MongoDB is not available. Retry #126
2024-02-22T14:48:31.011+08:00 INFO  [MongoDBPreflightCheck] MongoDB is not available. Retry #127
2024-02-22T14:48:33.011+08:00 INFO  [MongoDBPreflightCheck] MongoDB is not available. Retry #128
2024-02-22T14:48:35.012+08:00 INFO  [MongoDBPreflightCheck] MongoDB is not available. Retry #129
2024-02-22T14:48:37.012+08:00 INFO  [MongoDBPreflightCheck] MongoDB is not available. Retry #130
2024-02-22T14:48:39.013+08:00 INFO  [MongoDBPreflightCheck] MongoDB is not available. Retry #131
2024-02-22T14:48:41.013+08:00 INFO  [MongoDBPreflightCheck] MongoDB is not available. Retry #132

```

修改配置

```bash
# 配置文件路径：/etc/graylog/server/server.conf
# 105行左右
http_bind_address = 0.0.0.0:9000
# 555行左右
mongodb_uri = mongodb://ekroot:ek070901@localhost:27017/graylog?authSource=admin
```

### 磁盘空间不足

```
2024-02-22T15:01:46.195+08:00 ERROR [PreflightCheckService] Preflight check failed with error: Journal directory </var/lib/graylog-server/journal> has not enough free space (1943 MB) available. You need to provide additional 2518 MB to contain 'message_journal_max_size = 5120 MB'
2024-02-22T15:01:46.195+08:00 ERROR [CmdLineTool] Startup error:
org.graylog2.bootstrap.preflight.PreflightCheckException: Journal directory </var/lib/graylog-server/journal> has not enough free space (1943 MB) available. You need to provide additional 2518 MB to contain 'message_journal_max_size = 5120 MB'
```

1、调低 message\_journal\_max\_size 参数大小

2、清理 dev/vdal

https://wenku.baidu.com/view/52b723d7f405cc1755270722192e453610665bdf.html?fr=sogou&*wkts*=1708585584306

```
[root@iZm5e1egdpr5bckrj8gty5Z ~]# df -h
Filesystem      Size  Used Avail Use% Mounted on
devtmpfs         31G     0   31G   0% /dev
tmpfs            31G     0   31G   0% /dev/shm
tmpfs            31G  608K   31G   1% /run
tmpfs            31G     0   31G   0% /sys/fs/cgroup
/dev/vda1        40G   36G  1.9G  95% /
tmpfs            31G  2.0M   31G   1% /tmp
tmpfs           6.2G     0  6.2G   0% /run/user/0
[root@iZm5e1egdpr5bckrj8gty5Z ~]# cd /
[root@iZm5e1egdpr5bckrj8gty5Z /]# du -sh *
156M    back
0       bin
272M    boot
180M    data
0       dev
12G     ekdir
28M     etc
4.0K    home
0       lib
0       lib64
16K     lost+found
4.0K    media
4.0K    mnt
16K     opt
du: cannot access 'proc/212747/task/212747/fd/3': No such file or directory
du: cannot access 'proc/212747/task/212747/fdinfo/3': No such file or directory
du: cannot access 'proc/212747/fd/3': No such file or directory
du: cannot access 'proc/212747/fdinfo/3': No such file or directory
du: cannot access 'proc/212753': No such file or directory
0       proc
17M     root
608K    run
0       sbin
4.0K    srv
0       sys
896K    tmp
8.2G    usr
16G     var
[root@iZm5e1egdpr5bckrj8gty5Z /]#

```
