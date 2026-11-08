---
url: /Linux/02.Linux安装软件/Linux安装MongoDB.md
---

# Linux安装MongoDB

## 介绍

MongoDB 是一个由 C++ 语言编写的基于分布式文件存储的数据库，MongoDB 是一个介于关系数据库和非关系数据库之间的产品，是非关系数据库当中功能最丰富，最像关系数据库的。常用用于物流场景-地理位置信息存储、社交场景-储存储用户信息、物联网场景-监控数据、日志记录等，MongoDB在这些场景的应用比其他数据库有这巨大优势。

## 下载MongoDB

1、检查CentOS是否已安装过Mongodb：

```
rpm -qa | grep mongodb
service mongodb status
```

2、查看CentOS版本

```text
cat /etc/redhat-release
```

3、去到Mongodb官网，选择对应版本下载

①：去到官网下载地址：https://www.mongodb.com/try/download/community

②：选择对应版本直接下载或者选择“Copy Link”获取下载地址

## 安装MongoDB

1、去到MongoDB安装目录，下载MongoDB安装包：

```text
wget https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-rhel80-4.4.13.tgz
```

2、解压MongoDB安装包：

```text
tar -zxvf mongodb-linux-x86_64-rhel80-4.4.13.tgz
```

3、重命名解压后的MongoDB文件名：

```text
mv mongodb-linux-x86_64-rhel80-4.4.13 mongodb
```

4、在MongoDB文件夹再里创建二个文件夹：

```text
mkdir  data   //用来存放数据库数据
```

5、进入MongoDB文件下面的bin目录创建配置文件：

```text
vi  mongod.conf
dbpath=/usr/local/mongodb/data

logpath=/usr/local/mongodb/logs/mongodb.log
```

6、配置MongoDB环境变量

```
vim /etc/profile
source /etc/profile
```

添加内容

```text
export MONGODB_HOME=/usr/local/mongodb
export PATH=$PATH:$MONGODB_HOME/bin
```

7、启动MongoDB，在bin目录下执行启动命令：

```text
mongod -f /usr/local/MongoDB/mongod.conf
```

出现successfully即证明服务成功启动！或者用`ps aux | grep mongod`查看服务是否运行

8、创建一个对数据库test具有读写权限的用户

```text
db.createUser({
user:"root",
pwd:"123456",
roles:[{role:"readWrite",db:"test"}]
})
```

## 脚本安装

准备mongo安装包后执行脚本

```shell
! /bin/bash
set -e
mongo_dir=mongodb-linux-x86_64-rhel70-4.2.24.tgz
mongo_path=/home/disk2/tools/mongo

#安装Mongo
echo -e "安装mongo-------------"
if [ -e $mongo_name ];then
    if [ -d $mongo_path ];then
        echo "已存在mongo目录${mongo_path},选择执行后续操作： 1、跳过安装包解压 2、退出安装"
        read mongo_option
        if [ $mongo_option -eq 1 ];then
            echo "跳过mongo的解压安装"
        elif [ $mongo_option -eq 2 ];then
            exit            
        else
            echo "所选操作未能识别，退出安装。"
            exit
        fi
    else
        echo "解压安装包-----"
        tar -zxvf $mongo_name $1> /dev/null
        echo "开始安装-----"
        mkdir -p $mongo_path
        mv $mongo_dir/* $mongo_path
        mkdir -p $mongo_path/db
        mkdir -p $mongo_path/logs
        touch $mongo_path/logs/mongodb.log
        touch $mongo_path/bin/mongodb.conf
        echo "开始导入配置----"
cat > $mongo_path/bin/mongodb.conf << EOF
bind_ip=0.0.0.0
port=27017
logappend=true
logpath=$mongo_path/logs/mongodb.log
dbpath=$mongo_path/db
fork=true
#auth=true
EOF
    fi

if [ -e /usr/lib/systemd/system/mongodb.service ];then
    rm -f /usr/lib/systemd/system/mongodb.service
else
cat > /usr/lib/systemd/system/mongodb.service << EOF
[Unit]
Description=mongodb
After=network.target remote-fs.target nss-lookup.target

[Service]
Type=forking
ExecStart=$mongo_path/bin/mongod --config $mongo_path/bin/mongodb.conf
ExecReload=/bin/kill -s HUP \$MAINPID
ExecStop=$mongo_path/bin/mongod --shutdown --config $mongo_path/bin/mongodb.conf
PrivateTmp=true

[Install]
WantedBy=multi-user.target
EOF

chmod 754 /usr/lib/systemd/system/mongodb.service

echo "mongo加入开机自启"
systemctl daemon-reload
systemctl enable mongodb
echo "启动mongodb-------"
systemctl start mongodb
fi

echo "添加mongo用户"
$mongo_path/bin/mongo 127.0.0.1:27017/admin mongo_init.js

authline=$(grep -n "auth" ${mongo_path}/bin/mongodb.conf |cut -f1 -d":")
sed -i "${authline}c auth=true" ${mongo_path}/bin/mongodb.conf

echo "重启mongo"
systemctl restart mongodb
echo "mongo安装完成------"
else
    echo "未检测到mongo安装包，请把安装到放到安装脚本目录下"
fi
```
