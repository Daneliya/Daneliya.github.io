---
url: /daily/博客文档/Vuepress/1_VuepressReco博客搭建.md
---

# VuepressReco博客搭建

> [vuepress-reco](https://theme-reco.vuejs.press/)

### 二、搭建流程

#### 1、环境准备

```
node version >= 20
# 安装脚手架工具
npm install @vuepress-reco/theme-cli -g
```

#### 2、使用脚手架创建项目

```
npx @vuepress-reco/theme-cli init
```

执行之后会出现以下内容，依次输入

```sh
D:\Program Files\JetBrains\java_project\my_project\ibooks>npx @vuepress-reco/theme-cli init
? Whether to create a new directory? Yes # 是否创建目录 输入 Y
? What's the name of new directory? xu_vuepress_reco2_blog # 项目目录名称
? What's the title of your project? xu_vuepress_reco2_blog # 标题（如果准备创建2.x版本，此项无效，可不填写）
? What's the description of your project? xu_vuepress_reco2_blog by vuepress-reco 2.x# 描述（如果准备创建2.x版本，此项无效，可不填写）
? What's the author's name? xxl # 作者（如果准备创建2.x版本，此项无效，可不填写）
? What style do you want your home page to be?(The 2.x version is the alpha version) 2.x # 选择2.x
√ [1/1] Load file from git

Load successful, enjoy it!

# Inter your blog
$ cd xu_vuepress_reco2_blog
# Install package
$ yarn & npm install
```

选择之后稍作等待项目就创建成功了，使用`WebStorm`或`vscode`打开该项目，执行`npm install`安装依赖，安装完成之后运行`npm run dev`，打开控制台输出的访问链接即可看到页面效果。

[vuepress-reco搭建与部署指南 - 夏慕槿苏 - 博客园](https://www.cnblogs.com/jinsulive/p/18771812)

[使用VuePress-Reco快速搭建博客(保姆级)-CSDN博客](https://blog.csdn.net/m0_58724783/article/details/140558578)
