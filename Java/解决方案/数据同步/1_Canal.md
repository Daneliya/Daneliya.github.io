---
url: /Java/解决方案/数据同步/1_Canal.md
---

# Canal

https://github.com/alibaba/canal/wiki

## Canal

> 官方文档：<https://github.com/alibaba/canal/wiki/QuickStart>
>
> 下载版本：[canal.deployer-1.1.8.tar.gz](https://github.com/alibaba/canal/releases/download/canal-1.1.8/canal.deployer-1.1.8.tar.gz)

### MySQL 开启 Binlog

MySQL 的 Binlog（二进制日志）记录了所有对数据库进行更改的操作，是实现主从复制和数据恢复的重要工具。以下是开启 Binlog 的步骤：

**1、修改配置文件**

打开 MySQL 配置文件（通常位于 `/etc/my.cnf` 或 `/etc/mysql/my.cnf`）。

在 *\[mysqld]* 部分添加以下内容

```
[mysqld]
log-bin=mysql-bin # 开启 binlog
binlog-format=ROW # 选择 ROW 模式
server_id=1 # 配置 MySQL replaction 需要定义，不要和 canal 的 slaveId 重复
```

**2、重启 MySQL 服务**

保存配置后，重启 MySQL 服务以使更改生效：

```
sudo service mysql restart
```

**3、验证 Binlog 是否开启**

登录 MySQL，执行以下命令检查 Binlog 状态：

```
SHOW VARIABLES LIKE 'log_bin';
```

如果返回值为 *ON*，表示 Binlog 已成功开启。

```
mysql> SHOW VARIABLES LIKE 'log_bin';
+---------------+-------+
| Variable_name | Value |
+---------------+-------+
| log_bin       | ON    |
+---------------+-------+
1 row in set (0.02 sec)
```

**常用命令**

查看所有 Binlog 文件：

```
SHOW MASTER LOGS;
```

查看当前 Binlog 状态：

```
SHOW MASTER STATUS;
```

手动刷新生成新日志文件：

```
FLUSH LOGS;
```

**注意事项**

1. **Binlog 格式选择**： STATEMENT：基于 SQL 语句，性能较高，但可能导致主从数据不一致。 ROW：基于行的复制，日志更大，但更可靠。 MIXED：结合两者优点，推荐使用。
2. **权限问题**：确保配置的日志路径有 MySQL 用户的写入权限。

## Canal Admin管理页面

> 官方文档：<https://github.com/alibaba/canal/wiki/Canal-Admin-QuickStart>
>
> 下载版本：[canal.admin-1.1.8.tar.gz](https://github.com/alibaba/canal/releases/download/canal-1.1.8/canal.admin-1.1.8.tar.gz)

报错

```
2025-07-29 15:53:06.904 [main] WARN  o.s.b.w.s.c.AnnotationConfigServletWebServerApplicationContext - Exception encountered during context initialization - cancelling refresh attempt: org.springframework.beans.factory.BeanCreationException: Error creating bean with name 'requestMappingHandlerMapping' defined in class path resource [org/springframework/boot/autoconfigure/web/servlet/WebMvcAutoConfiguration$EnableWebMvcConfiguration.class]: Bean instantiation via factory method failed; nested exception is org.springframework.beans.BeanInstantiationException: Failed to instantiate [org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping]: Factory method 'requestMappingHandlerMapping' threw exception; nested exception is java.lang.IllegalArgumentException: canal.adminPasswd is empty , pls check https://github.com/alibaba/canal/issues/4941
```

解答

https://github.com/alibaba/canal/issues/4941

v1.1.8版本移除自带的password默认值，并在password未传入或非法时阻止节点启动来提醒用户设置自定义password

解决

登录mysql，执行如下密文生成sql即可(记得去掉第一个首字母的星号)

```
select password('admin')

+-------------------------------------------+
| password('admin')                         |
+-------------------------------------------+
| *4ACFE3202A5FF5CF467898FC58AAB1D615029441 |
+-------------------------------------------+

# 如果遇到mysql8.0，可以使用select upper(sha1(unhex(sha1('admin'))))
```

修改`conf/application.yml`中的`canal.adminPasswd`

https://blog.csdn.net/langfeiyes/article/details/130711899

https://blog.csdn.net/qq\_34497272/article/details/117658964
