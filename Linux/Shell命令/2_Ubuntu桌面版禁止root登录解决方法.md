---
url: /Linux/Shell命令/2_Ubuntu桌面版禁止root登录解决方法.md
---

# Ubuntu桌面版禁止root登录解决方法

## 描述

虚拟机安装了ubuntu系统，通过下列命令设置好了root密码：

sudo passwd root

然后注销用户，用root登录，结果一直显示认证失败。

密码我确定没问题，因为普通用户终端切换root可以登录，所以密码无误

Su root  可以正常切换登录

网上搜索了一下，才知道是因为系统禁止了root账户登录图形界面。

## 解决方法

### 1.修改gdm配置

输入命令，修改gdm-autologin

```bash
sudo gedit /etc/pam.d/gdm-autologin
```

命令成功后打开窗口界面：

注释第三行（加#号）：

```bash
#auth required pam_succeed_if.so user != root quiet_success
```

修改好后保存关闭即可。

### 2.输入命令，修改gdm-password

```bash
sudo gedit /etc/pam.d/gdm-password
```

同样注释第三行：

```bash
#auth required pam_succeed_if.so user != root quiet_success
```

修改好后保存关闭即可。

### 3.修改profile

输入命令，修改root的profile

```bash
sudo gedit /root/.profile
```

注释屏蔽掉最后一行，并添加一行：

```bash
tty -s && mesg n || true
```

文件修改后保存退出。

### 4.重启

注销系统，然后就可以用root用户名密码登录了。
