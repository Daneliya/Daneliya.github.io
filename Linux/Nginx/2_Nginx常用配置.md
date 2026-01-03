---
url: /Linux/Nginx/2_Nginx常用配置.md
---

# Nginx常用配置

## Nginx常用配置

安装Nginx后，`nginx.conf`包含了一些默认配置，下面的示例就是将注释删除后，稍微改造后的配置。

```nginx
worker_processes  1; # 设置工作线程的核心数，工作线程就是用于处理客户请求的
error_log  /opt/homebrew/etc/nginx/log/nginx_error.log  crit; # 错误日志输出路径
events {
    # 每个工作进程允许的最大连接数，举例说明作用：
    # worker_processes设置成1，就是最多能处理1024个并发请求
    # worker_processes设置成2，就是最多能处理2048个并发请求
    worker_connections  1024;
}
http {
    include       mime.types;                # 引入mime.types配置文件，包含了Nginx的一些默认配置
    default_type  application/octet-stream;  # 请求进来后以流形式处理
    sendfile        on;                      # 零拷贝
    keepalive_timeout  65;                   # 请求最大存活时间，65s

    server {
        listen       80;              # 监听服务的端口，http默认80，https默认443
        server_name  localhost;       # 服务名称，一般配置域名，
        client_max_body_size 1024M;

        # 资源的根路径
        root /usr/local/software/code/vueCode/dist;

        location / {
            root    html;
            index  index.html index.htm;
        }
        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }
    }
}
```

## 经典https配置

```nginx
worker_processes  1;
error_log  /opt/homebrew/etc/nginx/log/nginx_error.log  crit;
events {
    worker_connections  1024;
}
http {
    include       mime.types;              
    default_type  application/octet-stream;
    sendfile        on;                    
    keepalive_timeout  65;                 

    # 监听80端口，并重定向到443端口；实现http自懂跳转https
	server {
        listen 80;
        server_name docs.oinone.luckilyxxl.com;
        return 301 https://$host$request_uri;
    }

	# 监听443请求，处理https请求，配置SSL政策
    server {
        listen 443 ssl;
        server_name docs.oinone.luckilyxxl.com;
        ssl_certificate ssl/docs.oinone.luckilyxxl.com.pem;      # 当前目录的ssl目录下的证书文件路径
        ssl_certificate_key ssl/docs.oinone.luckilyxxl.com.key;  # 当前目录的ssl目录下的证书key路径
        ssl_session_timeout 5m;
        ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
        ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:HIGH:!aNULL:!MD5:!RC4:!DHE;
        ssl_prefer_server_ciphers on;
        
        # 比如vue下的打包路径就可以通过这种访问方式
        location / {
            root /Users/wuwei/code/book/luckilyxxl/.vitepress/dist;
            index  index.html index.htm;
            try_files $uri $uri/ /index.html;
        }

        # 拦截/api/请求，转发到127.0.0.1:7002，一般配置后端服务
        location /api/ {
            proxy_send_timeout 300;
            proxy_read_timeout 300;
            proxy_connect_timeout 300;
            proxy_pass http://127.0.0.1:7002/;
        }
    }
}
```

## 引入子配置文件

使用`include`引入子配置文件，一般都是读取`conf.d`下面所有.conf结尾的文件，文件的内容就是反向代理的配置信息。

```nginx
http {
    # 引入文件类型映射文件
    include       mime.types;
    # 如果没有找到指定的文件类型映射 使用默认配置
    default_type  application/octet-stream;
    # 日志打印格式
    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';
    # 启动零拷贝提高性能
    sendfile        on;
    # 设置keepalive长连接超时时间
    keepalive_timeout  65;
    # 引入子配置文件
    include /usr/local/openresty/nginx/conf/conf.d/*.conf;
}
```

例如这部分数据就可以放到`conf.d`目录下的`api.conf`文件中；

```nginx
server {
    listen 443 ssl;
    server_name docs.oinone.luckilyxxl.com;
    ssl_certificate ssl/docs.oinone.luckilyxxl.com.pem;
    ssl_certificate_key ssl/docs.oinone.luckilyxxl.com.key;
    ssl_session_timeout 5m;
    ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:HIGH:!aNULL:!MD5:!RC4:!DHE;
    ssl_prefer_server_ciphers on;
    
    location / {
        root /Users/wuwei/code/book/luckilyxxl/.vitepress/dist;
        index  index.html index.htm;
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_send_timeout 300;
        proxy_read_timeout 300;
        proxy_connect_timeout 300;
        proxy_pass http://127.0.0.1:7002/;
    }
}
```
