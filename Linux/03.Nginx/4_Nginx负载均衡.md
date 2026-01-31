---
url: /Linux/03.Nginx/4_Nginx负载均衡.md
---

# Nginx负载均衡

## Nginx负载均衡

负载均衡用于从“upstream”模块定义的后端服务器列表中选取一台服务器接受用户的请求，一个最基本的upstream模块是这样的，模块内的server是服务器列表：

```nginx
upstream dynamicserver {
  server 172.16.44.47:9001; #tomcat 1
  server 172.16.44.47:9002; #tomcat 2
  server 172.16.44.47:9003; #tomcat 3
  server 172.16.44.47:9004; #tomcat 4
}
```

在upstream模块配置完成后，要让指定的访问反向代理到服务器列表：

```nginx
#其他页面反向代理到tomcat容器
location ~.*$ {
  index index.jsp index.html;
  proxy_pass http://dynamicserver;
}
```

这就是最基本的负载均衡实例，但这不足以满足实际需求；目前Nginx服务器的upstream模块支持6种方式的分配；

```nginx
upstream dynamicserver {
  server 192.168.64.1:9001; #tomcat 1
  server 192.168.64.1:9002; #tomcat 2
  server 192.168.64.1:9003; #tomcat 3
  server 192.168.64.1:9004; #tomcat 4
}
server {
        server_name www.luckilyxxl.com;
        default_type text/html;
        charset   utf-8;

        location ~ .*$ {
            index index.jsp index.html;
            proxy_pass http://dynamicserver;
       }
}
```

## 常用参数

| 参数         | 描述                                                         |
| :----------- | :----------------------------------------------------------- |
| server       | 反向服务地址 加端口                                          |
| weight       | 权重                                                         |
| fail\_timeout | 与max\_fails结合使用。                                        |
| max\_fails    | 设置在fail\_timeout参数设置的时间内最大失败次数，如果在这个时间内，所有针对该服务器的请求都失败了，那么认为该服务器会被认为是停机了 |
| max\_conns    | 允许最大连接数                                               |
| fail\_time    | 服务器会被认为停机的时间长度,默认为10s                       |
| backup       | 标记该服务器为备用服务器，当主服务器停止时，请求会被发送到它这里。 |
| down         | 标记服务器永久停机了                                         |
| slow\_start   | 当节点恢复，不立即加入                                       |

## 负载均衡策略

> 在这里，只详细说明Nginx自带的负载均衡策略，第三方不多描述。

| 负载策略           | 描述            |
| :----------------- | :-------------- |
| 轮询               | 默认方式        |
| weight             | 权重方式        |
| ip\_hash            | 依据ip分配方式  |
| least\_conn         | 最少连接方式    |
| fair（第三方）     | 响应时间方式    |
| url\_hash（第三方） | 依据URL分配方式 |

## 实战示例

1、轮训：最基本的方法，上文示例的就是轮训

```nginx
upstream 随便起名 {
  server 192.168.64.1:9001; #tomcat 1
  server 192.168.64.1:9002; #tomcat 2
  server 192.168.64.1:9003; #tomcat 3
  server 192.168.64.1:9004; #tomcat 4
}
```

2、权重：在轮询策略的基础上指定轮询的几率

```nginx
upstream 随便起名 {
    server 192.168.64.1:9001  weight=2;                   #tomcat 1
    server 192.168.64.1:9002;                             #tomcat 2
    server 192.168.64.1:9003;                         	  #tomcat 3
    server 192.168.64.1:9004; 							  #tomcat 4
}
```

3、ip\_hash：基于客户端IP的分配方式，能确保了相同客户端的请求发送到相同的服务器

```nginx
upstream 随便起名 {
    ip_hash;  #保证每个访客固定访问一个后端服务器
    server 192.168.64.1:9001  weight=2;                   #tomcat 1
    server 192.168.64.1:9002;                             #tomcat 2
    server 192.168.64.1:9003;                		      #tomcat 3
    server 192.168.64.1:9004; 							  #tomcat 4
}
```

4、least\_conn：把请求转发给连接数较少的后端服务器，可以达到更好的负载均衡效果

```nginx
upstream 随便起名 {
    ip_hash;  #保证每个访客固定访问一个后端服务器
    server 192.168.64.1:9001  weight=2;                   #tomcat 1
    server 192.168.64.1:9002;                             #tomcat 2
    server 192.168.64.1:9003;                		      #tomcat 3
    server 192.168.64.1:9004; 							  #tomcat 4
}
```

## 重试策略

`max_fails=3 fail_timeout=60s`代表在`60`秒内请求某一应用失败`3`次，认为该应用宕机，后等待`60`秒，这期间内不会再把新请求发送到宕机应用，而是直接发到正常的那一台，时间到后再有请求进来继续尝试连接宕机应用且仅尝试`1`次，如果还是失败，则继续等待`60`秒...以此循环，直到恢复。

nginx

```
upstream dynamicserver {
      server 192.168.64.1:9001 fail_timeout=60s max_fails=3; #Server A
      server 192.168.64.1:9002 fail_timeout=60s max_fails=3; #Server B
}
```

### 重试配置

有时候我们系统出现`500`等异常的情况下，希望nginx能够到其他的服务器进行重试，我们可以配置哪些错误码才进行重试，`proxy_next_upstream`项定义了什么情况下进行重试

```nginx
Syntax: proxy_next_upstream error | timeout | invalid_header | http_500 | http_502 | http_503 | http_504 | http_403 | http_404 | off ...;
Default:    proxy_next_upstream error timeout;
Context:    http, server, location
```

> 默认情况下，当请求服务器发生错误或超时时，会尝试到下一台服务器，还有一些其他的配置项如下：

| 错误状态       | 描述                                                         |
| :------------- | :----------------------------------------------------------- |
| error          | 与服务器建立连接，向其传递请求或读取响应头时发生错误;        |
| timeout        | 在与服务器建立连接，向其传递请求或读取响应头时发生超时;      |
| invalid\_header | 服务器返回空的或无效的响应;                                  |
| http\_500       | 服务器返回代码为500的响应;                                   |
| http\_502       | 服务器返回代码为502的响应;                                   |
| http\_503       | 服务器返回代码为503的响应;                                   |
| http\_504       | 服务器返回代码504的响应;                                     |
| http\_403       | 服务器返回代码为403的响应;                                   |
| http\_404       | 服务器返回代码为404的响应;                                   |
| http\_429       | 服务器返回代码为429的响应（1.11.13）;                        |
| non\_idempotent | 通常，请求与 非幂等 方法（POST，LOCK，PATCH）不传递到请求是否已被发送到上游服务器（1.9.13）的下一个服务器; 启用此选项显式允许重试此类请求; |
| off            | 禁用将请求传递给下一个服务器。                               |

示例：配置了`500`等错误的时候会进行重试

```nginx
upstream dynamicserver {
  server 192.168.64.1:9001 fail_timeout=60s max_fails=3; #tomcat 1
  server 192.168.64.1:9002 fail_timeout=60s max_fails=3; #tomcat 2
}


server {
        server_name www.luckilyxxl.com;
        default_type text/html;
        charset   utf-8;


        location ~ .*$ {
            index index.jsp index.html;
            proxy_pass http://dynamicserver;
            #下一节点重试的错误状态
            proxy_next_upstream error timeout http_500 http_502 http_503 http_504;
       }
}
```

## 备用节点

备用节点在主服务器正常工作时处于待命状态，不处理请求。只有当主服务器故障或不可用时，备用节点才会接管请求。

在 Nginx 的负载均衡配置中，可以通过 `backup` 参数将某个服务器标记为备用节点。

nginx

```nginx
http {
    upstream backend {
        server 192.168.1.101;  # 主服务器
        server 192.168.1.102;  # 主服务器
        server 192.168.1.103 backup;  # 备用节点
    }

    server {
        listen 80;

        location / {
            proxy_pass http://backend;
        }
    }
}
```
