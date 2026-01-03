---
url: /Linux/Shell命令/1_Linux新建用户并授予root权限.md
---

# Linux新建用户并授予root权限

## 一、新建用户

```
adduser xxl
```

## 二、授予root权限

通过修改sudoers文件来赋予新账户root权限

1、查找sudoers文件路径并赋予权限

```
whereis sudoers
```

查看sudoers文件权限

```
ls -l /etc/sudoers
```

只有读权限，所以为其赋予写权限

```
chmod -v u+w /etc/sudoers
```

2、修改sudoers文件

使用vim打开修改sudoers文件：

```
vim /etc/sudoers
```

添加新用户信息：

```
lisong ALL=(ALL) ALL
```

然后输入wq保存
3、收回sudoers文件写权限，防止他人篡改

```
chmod -v u-w /etc/sudoers
```

## 三、新用户登录

1、新建一个连接，使用新用户登录主机

2、切换root权限
（1）sudo su
是当前用户暂时申请root权限，所以输入的不是root用户密码，而是当前用户的密码

（2）su
切换到某某用户模式，提示输入密码时该密码为切换后账户的密码，用法为“su 账户名称”。
如果后面不加账户时系统默认为root账户，密码也为超级账户的密码。没有时间限制。
有些Linux发行版，例如ubuntu，默认没有设置root用户的密码
所以需要我们先使用 sudo passwd root 设置root用户密码。
