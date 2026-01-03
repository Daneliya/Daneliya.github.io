---
url: /Linux/Nginx/3_Nginx路由匹配.md
---

# Nginx路由匹配

## Nginx路由匹配

我们在conf.d下创建了一个配置文件，配置的内容如下：

```nginx
server {
        server_name www.luckilyxxl.com;
        default_type text/html;
        charset   utf-8;
        location = / {
          echo "规则A";
        }
        location = /login {
            echo "规则B";
        }
        location ^~ /static/ {
            echo "规则C";
        }
        location ^~ /static/files {
            echo "规则X";
        }
        location ~ \.(gif|jpg|png|js|css)$ {
            echo "规则D";
        }
        location ~* \.js$ {
            echo "规则E";
        }
        location /img {
            echo "规则Y";
        }
        location / {
           echo "规则F";
        }
}
```

location语法`location [修饰符] pattern {…}`，修饰符列表如下：

| 修饰符 | 功能                                                         |
| :----- | :----------------------------------------------------------- |
| 空     | 前缀匹配 能够匹配以需要匹配的路径为前缀的uri                 |
| =      | 精确匹配                                                     |
| ~      | 正则表达式模式匹配，区分大小写                               |
| ~\*     | 正则表达式模式匹配，不区分大小写                             |
| ^~     | 精确前缀匹配，类似于无修饰符的行为，也是以指定模块开始，不同的是，如果模式匹配，那么就停止搜索其他模式了，不支持正则表达式 |
| /      | 通用匹配，任何请求都会匹配到。                               |

## 实际使用建议

```nginx
#直接匹配网站根，通过域名访问网站首页比较频繁，使用这个会加速处理，官网如是说。
#这里是直接转发给后端应用服务器了，也可以是一个静态首页
# 第一个必选规则
location = / {
    proxy_pass http://tomcat:8080/index
}
# 第二个必选规则是处理静态文件请求，这是nginx作为http服务器的强项
# 有两种配置模式，目录匹配或后缀匹配,任选其一或搭配使用
location ^~ /static/ {
    alias /webroot/static/;
}
location ~* \.(gif|jpg|jpeg|png|css|js|ico)$ {
    root /webroot/res/;
}
# 第三个规则就是通用规则，用来转发动态请求到后端应用服务器
# 非静态文件请求就默认是动态请求，自己根据实际把握，比如我们后端接口规定统一加上/api前缀，
location /api {
    proxy_pass http://tomcat:8080/
}
```
