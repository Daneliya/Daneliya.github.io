---
url: /AIGC/AI应用开发/03.OpenClaw/3_OpenClaw接入飞书.md
---

# OpenClaw 接入飞书

## 一、创建飞书机器人

进入飞书开放平台：

https://open.feishu.cn

操作流程：

1. 登录账号，进入开发者后台，https://open.feishu.cn/app
2. 创建企业自建应用
3. 添加机器人能力
4. 在权限管理中搜索 `im:` 并开通消息相关权限
5. 创建版本并发布，版本号1.0.0

机器人创建完成。

## 二、连接 OpenClaw 和飞书

回到 PowerShell，输入：

```sh
sudo openclaw config
```

配置流程：

1. Where will the Gateway run：选择 local
2. Select sections to configure：选择 Channels
3. Channels：选择 Configure/link
4. Select a channel：选择 Feishu
5. Install Feishu plugin：通过 npm 安装插件
6. How do you want to provide this App Secret：选择 Enter App Secret
7. 输入飞书 App Secret 及 App ID，在飞书应用【凭证与基础信息】中获取
8. Feishu connection mode：通讯方式选择 WebSocket 实时通讯
9. Which Feishu domain：域名选择国内版 feishu.cn
10. Group chat policy：群聊权限选择 Open，在所有群里都可以使用机器人，但必须@机器人
11. Select a channel：选择 Finished
12. Configure DM access policies now：私聊策略选择 Yes
13. Feishu DM policy：自己用选择 Open 不需要配对，正式环境选择 Pairing
14. Select sections to configure：选择 Continue

完成后运行：

如果 OpenClaw 已在运行先停止

```bash
openclaw gateway stop
```

启动

```sh
sudo openclaw gateway
```

## 三、飞书事件配置

在飞书开发者后台的机器人应用：

进入事件与回调

订阅方式选择：长连接

添加事件：接收消息

然后在权限管理中新增权限：获取通讯录基本信息

最后创建新版本并发布。

## 四、测试机器人

打开飞书 App。

在消息列表中找到刚创建的应用，发送一条消息。

如果 OpenClaw 能正常回复，说明配置成功。

现在你可以：

* 在私聊中与机器人对话
* 在群聊中 @机器人
* 让它执行自动化任务

撒花 🎉
