---
url: /daily/开源项目/RestCloud.md
---

# DataEase可视化分析

restcloud.zip

```
ROOT
apache-tomcat-9.0.68.tar.gz
jdk-8u333-linux-x64.tar.gz
mongo_init.js
mongodb-linux-x86_64-rhel70-4.2.24.tgz
restcloud_install.sh
```

mongo\_init.js

```js
try{

    if(db.system.users.find({'user':'admin'}).count() == 0){
        print('准备添加admin用户');
        db.createUser(
            {
            user: "admin",
            pwd: "pass@2022",
            roles:['readWriteAnyDatabase','dbAdminAnyDatabase']
            }
        ) ;
    }else{
        print('已经存在admin用户')
    }
	
	if(db.system.users.find({'user':'root'}).count() == 0){
        print('准备添加root用户');
        db.createUser(
            {
            user: "root",
            pwd: "root@2022",
            roles:['root']
            }
        ) ;
    }else{
        print('已经存在root用户')
    }
}catch(err){
    print('创建用户错误：'+err);
}
```

restcloud\_install.sh

```sh
#! /bin/bash
set -e
#将jdk、tomcat、ROOT.war和mongo的安装包和此脚本文件放在同一个目录下
jdk_name=jdk-8u333-linux-x64.tar.gz
tomcat_name=apache-tomcat-9.0.68.tar.gz
mongo_name=mongodb-linux-x86_64-rhel70-4.2.24.tgz
jdk_dir=jdk1.8.0_333
tomcat_dir=apache-tomcat-9.0.68
mongo_dir=mongodb-linux-x86_64-rhel70-4.2.24
jdk_path=/usr/jdk
tomcat_path=/usr/tomcat
mongo_path=/data/mongodb


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



#安装jdk
echo -e "准备安装jdk-------------"
if [ -e $jdk_name ];then

    if [ -d $jdk_path ];then
        echo "已存在jdk目录${jdk_path}，选择后续执行操作：1、删除后继续安装（注意删除后不可恢复！！！） 2、跳过安装包解压 3、退出安装"
        read jdk_option
        if [ $jdk_option -eq 1 ];then
            echo "删除文件重新安装-----"
            rm -rf $jdk_path
            echo "解压安装包-----"
            tar -zxvf $jdk_name $1> /dev/null
            mv $jdk_dir $jdk_path
        elif [ $jdk_option -eq 2 ];then
            echo "跳过jdk的解压安装"
        elif [ $jdk_option -eq 3];then
            exit
        else
            echo "所选操作未能识别，退出安装。"
            exit
        fi
    else
        echo "解压安装包-----"
        tar -zxvf $jdk_name $1> /dev/null
        mv $jdk_dir $jdk_path
    fi
    
#关闭错误退出，不然无法获取命令执行结果
set +e
echo "正在配置jdk环境变量-----"
jdk_env=$(grep "JAVA_HOME=${jdk_path}" /etc/profile)
if [ "$jdk_env" = "JAVA_HOME=${jdk_path}" ];then
    echo "在/etc/profile已存在jdk环境变量，跳过配置"
else
cat >> /etc/profile << EOF
JAVA_HOME=$jdk_path
PATH=\$JAVA_HOME/bin:\$PATH
CLASSPATH=:.:\$JAVA_HOME/lib/dt.jar:\$JAVA_HOME/lib/tools.jar
export JAVA_HOME
export PATH
export CLASSPATH
EOF

set -e
source /etc/profile
fi
    java -version
    if [ $? -eq 0 ];then
        echo -e "jdk安装完成。"
    else
        echo -e "jdk安装失败，请检查原因并把$jdk_path的文件进行删除后重试"
    fi
else
    echo "未检测到JDK安装包，请把安装包放到安装脚本目录下！！"
fi

#安装tomcat
echo "准备安装tomcat----------"
if [ -e $tomcat_name ];then
    if [ -d $tomcat_path ];then
        echo "已存在tomcat目录${tomcat_path}，选择后续执行操作：1、删除后继续安装（注意删除后不可恢复！！！） 2、跳过安装包解压 3、退出安装"
        read tomcat_option
        if [ $tomcat_option -eq 1 ];then
            echo "删除文件重新安装-----"
            rm -rf $tomcat_path
            echo "解压安装包-----"
            tar -zxvf $tomcat_name $1> /dev/null
            mv $tomcat_dir $tomcat_path
            rm -rf $tomcat_path/webapps/*
        elif [ $tomcat_option -eq 2 ];then
            echo "跳过tomcat的解压安装"
        elif [ $tomcat_option -eq 3];then
            exit
        else
            echo "所选操作未能识别，退出安装。"
            exit
        fi
    else
        tar -zxvf $tomcat_name $1> /dev/null
        mv $tomcat_dir $tomcat_path
        rm -rf $tomcat_path/webapps/*
    fi

sed -i '2a #set java environment\
export JAVA_HOME='${jdk_path}'\
export JRE_HOME=${JAVA_HOME}/jre\
export CLASSPATH=.:%{JAVA_HOME}/lib:%{JRE_HOME}/lib\
export PATH=${JAVA_HOME}/bin:$PATH\
#tomcat\
export TOMCAT_HOME=/usr/tomcat\
' $tomcat_path/bin/startup.sh
#设置tomcat内存和时间
sed -i '2a JAVA_OPTS="${JAVA_OPTS} -server -Xms2048M -Xmx2048M -XX:PermSize=256M -XX:MaxPermSize=256M"\nJAVA_OPTS="${JAVA_OPTS} -Duser.timezone=GMT+08"' $tomcat_path/bin/catalina.sh

echo "tomcat安装完成"
else
    echo "未检测到tomcat安装包，请把安装包放到安装脚本目录下！！"
fi

echo "准备安装RestCloud iPaaS集成平台-------"
if [ -d ROOT ];then
    mv ROOT $tomcat_path/webapps/
    set +e
    $tomcat_path/bin/startup.sh && tail -f $tomcat_path/logs/catalina.out
    #判断tomcat进程是否启动
    PID=$(ps -ef | grep "tomcat" | grep -v grep | awk '{print $2}')
    if [ -n "$PID" ]; then
        echo "RestCloud iPaaS集成平台安装完成"
    else
        echo "RestCloud iPaaS集成平台安装失败，请查看日志并检查各项属性配置是否正确。"
    fi
else
    echo "未检测到ROOT文件，请把平台安装文件解压为ROOT文件夹放到脚本目录下"
fi

```
