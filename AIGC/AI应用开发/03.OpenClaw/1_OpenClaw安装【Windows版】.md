---
url: /AIGC/AI应用开发/03.OpenClaw/1_OpenClaw安装【Windows版】.md
---

# OpenClaw 安装教程【Windows版】

## 一、安装 Node.js

> Node.js是一个开源的、跨平台的JavaScript运行环境，它允许开发者使用JavaScript来编写服务器端的代码。

进入官网：

https://nodejs.org/zh-cn/download

下载 Windows 版安装程序。

安装步骤：

1. 打开安装包
2. 勾选同意协议
3. 一路点击 Next
4. 点击 Install
5. 完成后点击 Finish

安装完成后，查看安装的版本：

```sh
node -v
```

Node.js 安装完成。

## 二、安装 Git

> Git 是一种**分布式版本控制系统**，核心作用是帮助个人或团队高效管理文件版本、协作开发，并保障代码安全。

进入官网：

https://git-scm.com/install/windows ，下载对应版本，例如“Git for Windows/x64 Setup”。

安装步骤：

1. 打开安装包
2. 一路点击 Next
3. 点击 Install
4. 安装完成后，可以取消勾选 View Release Note
5. 点击 Finish

回车执行，等待安装完成，查看版本：

```sh
git -v
```

Git 安装完成。

## 三、安装 OpenClaw

在系统中搜索 PowerShell，选择以管理员身份运行。

先输入命令：

```sh
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

如果出现询问输入 Y 确认。

然后执行安装命令：

```sh
iwr -useb https://openclaw.ai/install.ps1 | iex
```

等待安装完成。

如果看到 OpenClaw 的欢迎信息，说明安装成功。

通过下面的命令，可以查看安装的版本：

```sh
openclaw -v
```

## 四、初始化配置 OpenClaw

启动初始化配置向导：

```sh
openclaw onboard
```

Openclaw 会提示风险 `I understand this is personal-by-default and shared/multi-user use requires lock-down. Continue?`

* 风险提示：按键盘上的左右方向键选择，Yes

* Onboarding mode（模式）：QuickStart

* Model/auth provider（模型服务商）：任选（如 OpenAI / Anthropic / Moonshot AI (Kimi K2.5)）

* Select channel（通讯渠道）：Skip for now

* Configure skills now（技能）：按空格选择 Skip for now

* API Key（密钥）：没有可以先选 No

* Enable hooks（自动执行）：Skip for now

* How do you want to hatch your bot（以什么方式启动🦞）：选择 Open the Web UI 启动

会自动在浏览器打开 http://127.0.0.1:18789/chat?session=main

如果出现聊天界面，说明配置成功。
