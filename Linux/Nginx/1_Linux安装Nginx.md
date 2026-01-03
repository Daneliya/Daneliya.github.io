---
url: /Linux/Nginx/1_Linux安装Nginx.md
---

# Linux安装Nginx

## 一、Nginx安装

### 1、基于APT源安装

```csharp
sudo apt-get install nginx
```

安装好的文件位置：

* /usr/sbin/nginx：主程序
* /etc/nginx：存放配置文件
* /usr/share/nginx：存放静态文件
* /var/log/nginx：存放日志

基于APT安装会自动创建服务，会自动在/etc/init.d/nginx新建服务脚本

```sh
sudo nginx -s {start|stop|restart|reload|force-reload|status|configtest|rotate|upgrade}
```

### 2、通过源码包编译安装

这种方式可以自定安装指定的模块以及最新的版本，方式更灵活。

> 官方下载页面：http://nginx.org/en/download.html
>
> configure配置文件详解：http://nginx.org/en/docs/configure.html

安装gcc g++的依赖库

```sh
sudo apt-get install build-essential
sudo apt-get install libtool
```

安装pcre依赖库（http://www.pcre.org/）

```sh
sudo apt-get update
sudo apt-get install libpcre3 libpcre3-dev
```

安装zlib依赖库（http://www.zlib.net）

```sh
sudo apt-get install zlib1g-dev
```

安装SSL依赖库

```sh
sudo apt-get install openssl
```

安装Nginx

```sh
#下载最新版本：
wget http://nginx.org/download/nginx-1.13.6.tar.gz
#解压：
tar -zxvf nginx-1.13.6.tar.gz
#进入解压目录：
cd nginx-1.13.6
#配置：
./configure --prefix=/usr/local/nginx 
#编译：
make
#安装：
sudo make install
#启动：
sudo /usr/local/nginx/sbin/nginx -c /usr/local/nginx/conf/nginx.conf
注意：-c 指定配置文件的路径，不加的话，nginx会自动加载默认路径的配置文件，可以通过-h查看帮助命令。
#查看进程：
ps -ef | grep nginx
```

配置软链接

```sh
sudo ln -s /usr/local/nginx/sbin/nginx /usr/bin/nginx
```

现在就可以不用路径直接输入nginx启动。

### 3、Docker安装

https://gitee.com/xu\_xiaolong/docker-compose/blob/master/compose/nginx/run.md

```nginx
version: '3'
services:
  nginx:
    image: registry.cn-hangzhou.aliyuncs.com/zhengqing/nginx:1.21.1                 # 镜像`nginx:1.21.1`
    container_name: nginx               # 容器名为'nginx'
    restart: unless-stopped                                       # 指定容器退出后的重启策略为始终重启，但是不考虑在Docker守护进程启动时就已经停止了的容器
    volumes:                            # 数据卷挂载路径设置,将本机目录映射到容器目录
      - "./nginx/conf/nginx.conf:/etc/nginx/nginx.conf"
      - "./nginx/conf/conf.d/default.conf:/etc/nginx/conf.d/default.conf"
      - "./nginx/html:/usr/share/nginx/html"
      - "./nginx/log:/var/log/nginx"
    environment:                        # 设置环境变量,相当于docker run命令中的-e
      TZ: Asia/Shanghai
      LANG: en_US.UTF-8
    ports:                              # 映射端口
      - "80:80"
```

## 二、配置开机启动服务

### 1、方法一：

在/etc/init.d/下创建nginx文件，sudo vim /etc/init.d/nginx，内容如下：

```nginx
#!/bin/sh
 
### BEGIN INIT INFO
# Provides:      nginx
# Required-Start:    $local_fs $remote_fs $network $syslog $named
# Required-Stop:     $local_fs $remote_fs $network $syslog $named
# Default-Start:     2 3 4 5
# Default-Stop:      0 1 6
# Short-Description: starts the nginx web server
# Description:       starts nginx using start-stop-daemon
### END INIT INFO
 
PATH=/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin
DAEMON=/usr/local/nginx/sbin/nginx
NAME=nginx
DESC=nginx
 
# Include nginx defaults if available
if [ -r /etc/default/nginx ]; then
    . /etc/default/nginx
fi
 
STOP_SCHEDULE="${STOP_SCHEDULE:-QUIT/5/TERM/5/KILL/5}"
 
test -x $DAEMON || exit 0
 
. /lib/init/vars.sh
. /lib/lsb/init-functions
 
# Try to extract nginx pidfile
PID=$(cat /usr/local/nginx/conf/nginx.conf | grep -Ev '^\s*#' | awk 'BEGIN { RS="[;{}]" } { if ($1 == "pid") print $2 }' | head -n1)
if [ -z "$PID" ]; then
    PID=/run/nginx.pid
fi
 
if [ -n "$ULIMIT" ]; then
    # Set ulimit if it is set in /etc/default/nginx
    ulimit $ULIMIT
fi
 
start_nginx() {
    # Start the daemon/service
    #
    # Returns:
    #   0 if daemon has been started
    #   1 if daemon was already running
    #   2 if daemon could not be started
    start-stop-daemon --start --quiet --pidfile $PID --exec $DAEMON --test > /dev/null \
        || return 1
    start-stop-daemon --start --quiet --pidfile $PID --exec $DAEMON -- \
        $DAEMON_OPTS 2>/dev/null \
        || return 2
}
 
test_config() {
    # Test the nginx configuration
    $DAEMON -t $DAEMON_OPTS >/dev/null 2>&1
}
 
stop_nginx() {
    # Stops the daemon/service
    #
    # Return
    #   0 if daemon has been stopped
    #   1 if daemon was already stopped
    #   2 if daemon could not be stopped
    #   other if a failure occurred
    start-stop-daemon --stop --quiet --retry=$STOP_SCHEDULE --pidfile $PID --name $NAME
    RETVAL="$?"
    sleep 1
    return "$RETVAL"
}
 
reload_nginx() {
    # Function that sends a SIGHUP to the daemon/service
    start-stop-daemon --stop --signal HUP --quiet --pidfile $PID --name $NAME
    return 0
}
 
rotate_logs() {
    # Rotate log files
    start-stop-daemon --stop --signal USR1 --quiet --pidfile $PID --name $NAME
    return 0
}
 
upgrade_nginx() {
    # Online upgrade nginx executable
    # http://nginx.org/en/docs/control.html
    #
    # Return
    #   0 if nginx has been successfully upgraded
    #   1 if nginx is not running
    #   2 if the pid files were not created on time
    #   3 if the old master could not be killed
    if start-stop-daemon --stop --signal USR2 --quiet --pidfile $PID --name $NAME; then
        # Wait for both old and new master to write their pid file
        while [ ! -s "${PID}.oldbin" ] || [ ! -s "${PID}" ]; do
            cnt=`expr $cnt + 1`
            if [ $cnt -gt 10 ]; then
                return 2
            fi
            sleep 1
        done
        # Everything is ready, gracefully stop the old master
        if start-stop-daemon --stop --signal QUIT --quiet --pidfile "${PID}.oldbin" --name $NAME; then
            return 0
        else
            return 3
        fi
    else
        return 1
    fi
}
 
case "$1" in
    start)
        log_daemon_msg "Starting $DESC" "$NAME"
        start_nginx
        case "$?" in
            0|1) log_end_msg 0 ;;
            2)   log_end_msg 1 ;;
        esac
        ;;
    stop)
        log_daemon_msg "Stopping $DESC" "$NAME"
        stop_nginx
        case "$?" in
            0|1) log_end_msg 0 ;;
            2)   log_end_msg 1 ;;
        esac
        ;;
    restart)
        log_daemon_msg "Restarting $DESC" "$NAME"
 
        # Check configuration before stopping nginx
        if ! test_config; then
            log_end_msg 1 # Configuration error
            exit $?
        fi
 
        stop_nginx
        case "$?" in
            0|1)
                start_nginx
                case "$?" in
                    0) log_end_msg 0 ;;
                    1) log_end_msg 1 ;; # Old process is still running
                    *) log_end_msg 1 ;; # Failed to start
                esac
                ;;
            *)
                # Failed to stop
                log_end_msg 1
                ;;
        esac
        ;;
    reload|force-reload)
        log_daemon_msg "Reloading $DESC configuration" "$NAME"
 
        # Check configuration before stopping nginx
        #
        # This is not entirely correct since the on-disk nginx binary
        # may differ from the in-memory one, but that's not common.
        # We prefer to check the configuration and return an error
        # to the administrator.
        if ! test_config; then
            log_end_msg 1 # Configuration error
            exit $?
        fi
 
        reload_nginx
        log_end_msg $?
        ;;
    configtest|testconfig)
        log_daemon_msg "Testing $DESC configuration"
        test_config
        log_end_msg $?
        ;;
    status)
        status_of_proc -p $PID "$DAEMON" "$NAME" && exit 0 || exit $?
        ;;
    upgrade)
        log_daemon_msg "Upgrading binary" "$NAME"
        upgrade_nginx
        log_end_msg $?
        ;;
    rotate)
        log_daemon_msg "Re-opening $DESC log files" "$NAME"
        rotate_logs
        log_end_msg $?
        ;;
    *)
        echo "Usage: $NAME {start|stop|restart|reload|force-reload|status|configtest|rotate|upgrade}" >&2
        exit 3
        ;;
esac
```

设置执行权限

```sh
#设置服务脚本有执行权限
sudo chmod +x /etc/init.d/nginx
#注册服务
cd /etc/init.d/
sudo update-rc.d nginx defaults
```

### 2、方法二：

在/usr/lib/systemd/system目录下新建nginx.service文件，内容如下

```nginx
[Unit]
Description=nginx - high performance web server
After=network.target remote-fs.target nss-lookup.target
 
[Service]
Type=forking
ExecStart=/usr/local/nginx/sbin/nginx -c /usr/local/nginx/conf/nginx.conf
ExecReload=/usr/local/nginx/sbin/nginx -s reload
ExecStop=/usr/local/nginx/sbin/nginx -s stop
 
[Install]
WantedBy=multi-user.target
```

脚本解释：

* Unit：服务的启动顺序和依赖关系；
* Description：对该服务的描述；
* After：在b.target服务组启动后，再启动本服务；
* Service:服务具体执行的方式；
* ExecStart,ExecStop,ExecReload等：启动命令组，分别是服务启动时，停止时，重启时，启动前，启动后，停止后执行的命令；
* Type：服务启动类型。默认simple表示ExecStart为主进程，notify类似于simple，启动结束后会发出通知信号。另外还有forking,oneshot,dbus,idle等类型；
* Install：把服务放在哪个服务组；
* WantedBy：服务所在的服务组。

> Ubuntu：systemd的.service服务文件配置参考：https://blog.csdn.net/qq\_41035283/article/details/122793745

**设置开机自启动并启动nginx**

设置开机自启动：

```sh
systemctl enable nginx.service
```

查看是否正确启动：

```sh
systemctl list-unit-files |grep nginx
```

看下如下图就成功启动了

启动Nginx：

```sh
systemctl start nginx.service
```

其他常用命令：

* 开启开机自启动：systemctl enable nginx.service
* 停止开机自启动：systemctl disable nginx.service
* 启动 nginx 服务：systemctl start nginx.service
* 停止 nginx 服务：systemctl stop nginx.service
* 重启 nginx 服务：systemctl restart nginx.service
* 查看服务当前状态： systemctl status nginx.service
* 查看所有已启动的服务：systemctl list-units --type=service

## 问题

nginx: \[error] open() "/usr/local/nginx/logs/nginx.pid" failed (2: No such file or directory)

https://blog.csdn.net/xinxian1768/article/details/131165831

## 参考资料

\[1]. 安装教程：https://blog.csdn.net/xun527/article/details/131305955

\[2]. nginx启动命令详解：https://www.python100.com/html/89170.html

\[3]. nginx详细参数配置：https://www.cnblogs.com/hanease/p/15890509.html
