---
url: /AIGC/AI应用开发/03.OpenClaw/2_OpenClaw安装【Mac版】.md
---

# OpenClaw 安装教程【Mac版】

## 一、安装 Homebrew

> **Homebrew** 是 macOS 和 Linux 上的一个包管理器，类似于 Windows 的 **choco** 或 **scoop**。可以帮助用户轻松安装、更新、卸载和管理各种软件包，包括命令行工具、GUI 应用和系统服务。
>
> 官网地址：https://brew.sh/zh-cn/

应用程序APP中搜索终端（Terminal）并打开。

在终端输入安装命令：

```sh
/bin/zsh -c "$(curl -fsSL https://gitee.com/cunkai/HomebrewCN/raw/master/Homebrew.sh)"
```

执行后按提示操作：

1. 选择下载源，输入 1（清华大学镜像）
2. 输入电脑开机密码
3. 如果询问是否删除旧版本 Homebrew，输入 Y
4. 按回车开始安装
5. 选择镜像源时输入 5（阿里镜像）

安装完成后，关闭终端，再重新打开终端，查看 Brew 的版本信息：

```sh
brew --version
```

Homebrew 安装完成。

## 二、安装 Git

> Git 是一种**分布式版本控制系统**，核心作用是帮助个人或团队高效管理文件版本、协作开发，并保障代码安全。

在终端输入命令：

```sh
brew install git
```

回车执行，等待安装完成，查看版本：

```sh
git -v
```

Git 安装完成。

## 三、安装 Node.js

> Node.js是一个开源的、跨平台的JavaScript运行环境，它允许开发者使用JavaScript来编写服务器端的代码。

进入官网：

https://nodejs.org/zh-cn/download

下载 macOS 版安装程序。

安装步骤：

1. 打开下载好的安装包
2. 点击继续
3. 同意用户协议
4. 点击安装
5. 输入电脑密码
6. 点击安装软件

安装完成后，查看安装的版本：

```sh
node -v
```

Node.js 安装完成。

## 四、安装 OpenClaw

打开终端。

首先输入下方命令，将 npm 下载源切换为国内镜像，提高下载速度：

```sh
npm config set registry https://registry.npmmirror.com
```

然后输入下方命令，避免 GitHub 的 SSH 配置问题：

```sh
git config --global url."https://github.com/".insteadOf ssh://git@github.com/
```

最后执行安装命令：

```sh
sudo npm install -g openclaw@latest
```

输入电脑密码并回车，等待安装完成。

如果终端出现类似 `added xxx packages` 的提示，说明安装成功。

OpenClaw 安装完成。

通过下面的命令，可以查看安装的版本：

```sh
openclaw -v
```

## 五、初始化配置 OpenClaw

在终端输入：

```sh
sudo rm -rf ~/.openclaw/extensions/feishu
```

作用：删除旧的飞书插件目录，避免插件冲突。

然后启动初始化配置向导：

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
