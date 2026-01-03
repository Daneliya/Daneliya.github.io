---
url: /daily/博客文档/其他博客文档/Hexo博客搭建.md
---

# Hexo博客搭建

官网（本文档来自官网整理） https://hexo.io/zh-cn/docs/

npm安装教程：https://www.cnblogs.com/goldlong/p/8027997.html

https://www.hojun.cn/2018/06/08/%E6%89%8B%E6%8A%8A%E6%89%8B%E6%95%99%E4%BD%A0%E6%90%AD%E5%BB%BAHEXO%E5%8D%9A%E5%AE%A2-%E4%B8%89/

next 主题：http://theme-next.iissnan.com/getting-started.html

码云+Hexo搭建个人博客+评论功能接入(本文参考)：http://zwd596257180.gitee.io/blog/2019/04/15/hexo\_manong\_bog/

根据自己安装环境有所修改

基于Gitee+Hexo搭建个人博客：https://segmentfault.com/a/1190000018662692

https://xu\_xiaolong.gitee.io

# 1、准备环境

Gitee账号（或Github）

Git：https://git-scm.com/download/

NodeJS：http://nodejs.cn/

SublimeText（推荐使用）：http://www.sublimetext.cn/

# 2、开始搭建

## 安装Hexo

```yml
npm install hexo-cli -g  //安装 或(npm install -g hexo )
# -g 指定全局安装，可以使用hexo命令
```

新建个文件夹，例入 Hexo\_Blog ,在该目录下运行cmd，开始执行命令安装

或直接使用命令创建安装

```
hexo init Hexo_Blog      //博客名
cd Hexo_Blog             //进入目录
npm install              //安装依赖
hexo server -p 5555      //本地运行测试（localhost:5555）或使用(hexo s -p 5555)命令或（hexo s）默认4000端口
```

## 部署发布博客到Gitee上

1、创建Gitee账号 https://gitee.com/

2、创建仓库

3、在Hexo\_Blog—themes—\_config.yml下配置

```yml
# Deployment
## Docs: https://hexo.io/docs/deployment.html
deploy:
  type: git
  #repo: https://github.com/Daneliya/Daneliya.github.io.git
  repo: https://gitee.com/xu_xiaolong/Hexo_Blog.git
  branch: master
```

注意：冒号后面一定要有空格，否则不能正确识别。

4、安装hexo插件

```
npm install hexo-deployer-git --save
```

5、部署

```
hexo g  //编译项目
hexo d  //发布项目
```

6、Gitee Pages设置

在项目的服务中选择Pages选项，选择 master 分支，点击 部署/更新（第一次是 启动）。

# 3、主题功能美化改造

其他主题：https://hexo.io/themes/

| 主题名称   | 预览                                                         | 代码                                                         |
| ---------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| skapp      | [预览](http://blog.minfive.com/archives/)                    | [代码](https://github.com/Mrminfive/hexo-theme-skapp)        |
| Amazing    | [预览](https://removeif.github.io/removeif-demo/)            | [代码](https://github.com/removeif/hexo-theme-amazing)       |
| volantis   | [文档及预览](https://volantis.js.org/v2/getting-started/)https://www.heson10.com/posts/53612.htmlhttps://hasaik.com/ | [代码](https://github.com/xaoxuu/hexo-theme-volantis)      [问题1](https://blog.csdn.net/Mint6/article/details/79830063)   [问题2](https://segmentfault.com/q/1010000003734223) |
| gal        | [预览](https://myau.moe/)                                    | [代码](https://github.com/ZEROKISEKI/hexo-theme-gal)         |
| Asnippet   | [预览](https://www.91h5.cc/)                                 | [代码](https://github.com/shenliyang/hexo-theme-snippet)     |
| Tree       | [预览](https://wujun234.github.io/)                          | [代码](https://github.com/wujun234/hexo-theme-tree)          |
| Yilia-plus | https://github.com/JoeyBling/hexo-theme-yilia-plus           | https://joeybling.github.io/                                 |
| Mustom     | https://ma-jinyao.cn/                                        | https://github.com/jinyaoMa/hexo-theme-mustom                |

代理：https://www.91h5.cc/archives/61443.html

## 3.1、Next主题设置

在项目根目录下的 **themes** 文件中，打开 **Git Bash** ，用命令行克隆下新的主题。

这里用的 Next 主题。

```
git clone https://github.com/theme-next/next.git
```

启用（\_config.yml大约77行）

```
# Extensions
## Plugins: https://hexo.io/plugins/
## Themes: https://hexo.io/themes/
theme: next
```

## 3.2、发布文章

\*\*方法一：\*\*在项目根目录下，打开 **Git Bash** ，执行新建命令，然后 hexo 会自动在指定目录下生成对应文件，如下图所示。然后找到新建好的文件，打开即可进行编辑。

```
hexo new "此处输入文章名字"
```

\*\*方法二：\*\*可以直接把已经准备的 md 格式的文章复制到 项目名称 /source/\_posts 目录下，然后打开文件，在文件头加入 front-matter 部分，**title** 表示文章标题，**date** 表示发布时间。

front-matte 书写的时候要注意，冒号后面要跟一个空格号。

## 3.3、主题风格设置

打开主题文件夹下的 \_config.yml 配置文件（注意：这里要区别，不是項目根目录，主题文件夹的路径为：新建空白文件夹名称/themes/主题文件夹名称）。通过查找功能找到 **Schemes** 模块，修改为 **Pisces** 风格。如果喜欢其他风格可以自己修改。

```
# --------------------------------------------------------
# Scheme Settings
# --------------------------------------------------------

# Schemes
#scheme: Muse
#scheme: Mist
scheme: Pisces
#scheme: Gemini
```

刷新页面可以看到新风格的界面

## 3.4、博客左侧栏语言设置

在上面的网站界面，可以发现网站的文字是英文，只要修改一下语言模式即可。打开根目录文件夹下的 \_config.yml 配置文件。找到 **language**，设置为 **zh-CN**。标题等其他参数的设置如下。可以对照效果图的具体位置，根据自己的实际需求进行修改。（注意：修改了项目根目录下的 \_config.yml配置文件，需要重启部署项目后才能生效）

## 3.5、分类设置

### 3.5.1、添加分类

* 在项目根目录下，执行下面的命令行，新建分类页面，然后会在项目根目录下的 **source** 文件夹中新建一个 **categories** 文件夹。

  ```
  hexo new page categories
  ```

* 打开 **categories** 文件夹中的 **index.md** 文件，添加 **type** 字段，设置为 **“categories”**。

* 接着到主题文件夹下的 \_config.yml 配置文件下，找到 **menu** 模块，把 **categories** 的注释给去掉。

* 刷新页面（如果刷新没效果，可以重启服务），可以在页面左侧栏上看到多了一个“分类”列表。

### 3.5.2、将文章添加到对应分类

* 文章发布前，在 front-matter 部分，多写一个 **categories** 字段，然后参数写上类别的名称，保存后重启服务，在网页上点击“分类”，可以看到分类下已经生成了刚刚设置的类别，并把刚刚发布的文章归类在此类别下。

## 3.6、标签设置

* 方法跟分类设置一样，所以不再赘述介绍。

* 但是需要补充一点， front-matter 中字段有多个参数的时候，可以使用如下图的写法。

  ```
  tags:
  	-Java
  	-Jsp
  ```

## 3.7、Hexo 博客添加站内搜索

* NexT主题支持集成 **Swiftype**、 微搜索、**Local Search** 和 **Algolia**。下面介绍 **Local Search** 的安装吧。注意：安装的时候要是项目根目录下安装。
* 安装 hexo-generator-search

```
npm install hexo-generator-search --save
```

* 安装 hexo-generator-searchdb

```
npm install hexo-generator-searchdb --save
```

* 在项目根目录下的 \_config.yml 配置文件的文末添加下面这段代码。

```
search:
  path: search.xml
  field: post
  format: html
  limit: 10000
```

* 编辑主题文件夹的 \_config.yml 配置文件，设置 Local searchenable 为 **ture**。

## 3.8、博客头像设置

themes 下的  next 中的 \_config.yml 中，大约154行

```yml
# Sidebar Avatar
# in theme directory(source/images): /images/avatar.gif
# in site  directory(source/uploads): /uploads/avatar.gif
avatar: /images/avatar.gif
```

## 3.9、右上角 fork me 设置

* 在 [GitHub Corners](http://tholman.com/github-corners/) 上选择你喜欢的挂饰，复制方框内的代码。
* 打开主题文件夹下的 **layout** 文件夹，用记事本的方式打&#x5F00;**\_layout.swig**，把刚刚复制的代码放到下面，并把 **href** 的参数，修改为自己的 github 链接（放自己要跳转的网址即可）。
* 重启服务器，查看效果图。

## 3.10、网页背景设置

### 3.10.1、动态背景设置

## 3.11、点击出现桃心效果设置

## 3.18、设置网站图片 Favicon

## 3.19、网页顶部进度加载条设置

* 在主题文件夹的 \_config.yml 配置文件中，搜索到 **pace** 后，把其值改为 **true** 即可，然后选择一款你喜欢的样式。

## 动态背景

themes 下的  next 中的 \_config.yml 中，大约695行

```yml
pace_theme: pace-theme-minimal

# Canvas-nest
canvas_nest: true

# three_waves
three_waves: false

# canvas_lines
canvas_lines: false

# canvas_sphere
canvas_sphere: false
```

## 文章新建

```
hexo n 文件名（英文）    //新建文章
```

```
---
title: Java_Design_Pattern   //文章名
date: 2019-07-29 20:20:08
tags:              //标签
    -Java
categories: Java   //分类
---
# 六大设计原则     //标题
## **1.单一职责原则**
```

```
hexo s   //启动本地
进入localhost:4000
hexo g
hexo d
联网可看
```

##

## 开通微信打赏功能

themes 下的  next 中的 \_config.yml 中，大约238行

```yml
# Wechat Subscriber
wechat_subscriber:
  enabled: true
  qcode: /path/to/your/wechatqcode ex. /uploads/wechat-qcode.jpg
  description: ex. subscribe to my blog by scanning my public wechat account

```

## 3.27、网站底部加上访问量

* 在项目根目录下安装 hexo 插件。

```
npm install hexo-wordcount --save
```

* 打开主题文件夹下的 layout/\_partials/footer.swig 文件，在文末添加上下面这段代码。

```
<div class="theme-info">
  <div class="powered-by"></div>
  <span class="post-count">博客全站共{{ totalcount(site) }}字</span>
</div>
```

* 刷新页面查看效果图

## 3.28、外链网易云音乐设置

## 3.31、文章显示阅读数量设置

在主题文件下的 \_config.yml 配置文件中，定位到 **busuanzi\_count**，把 **enable** 的值修改为 **true**。

```yml
# Show PV/UV of the website/page with busuanzi.
# Get more information on http://ibruce.info/2015/04/04/busuanzi/
busuanzi_count:
  # count values only if the other configs are false
  enable: true
  # custom uv span for the whole site
  site_uv: true
  site_uv_header: <i class="fa fa-user"></i>
  site_uv_footer:
  # custom pv span for the whole site
  site_pv: true
  site_pv_header: <i class="fa fa-eye"></i>
  site_pv_footer:
  # custom pv span for one page only
  page_pv: true
  page_pv_header: <i class="fa fa-file-o"></i>
  page_pv_footer:
```

qcode 使用云图床的地址

description 简介

# 遇到问题

## 问题1：

Hexo本地使用时出现 FATAL can not read a block mapping entry（无法读取块映射条目）

```
D:\Program Files (x86)\Hexo_Blog>hexo s -p 5555
FATAL can not read a block mapping entry; a multiline key may not be an implicit key at line 9, column 9:
    keywords:
            ^
YAMLException: can not read a block mapping entry; a multiline key may not be an implicit key at line 9, column 9:
    keywords:
            ^
    at generateError (D:\Program Files (x86)\Hexo_Blog\node_modules\js-yaml\lib\js-yaml\loader.js:167:10)
    at throwError (D:\Program Files (x86)\Hexo_Blog\node_modules\js-yaml\lib\js-yaml\loader.js:173:9)
    at readBlockMapping (D:\Program Files (x86)\Hexo_Blog\node_modules\js-yaml\lib\js-yaml\loader.js:1073:9)
    at composeNode (D:\Program Files (x86)\Hexo_Blog\node_modules\js-yaml\lib\js-yaml\loader.js:1359:12)
    at readDocument (D:\Program Files (x86)\Hexo_Blog\node_modules\js-yaml\lib\js-yaml\loader.js:1519:3)
    at loadDocuments (D:\Program Files (x86)\Hexo_Blog\node_modules\js-yaml\lib\js-yaml\loader.js:1575:5)
    at Object.load (D:\Program Files (x86)\Hexo_Blog\node_modules\js-yaml\lib\js-yaml\loader.js:1596:19)
    at Hexo.yamlHelper (D:\Program Files (x86)\Hexo_Blog\node_modules\hexo\lib\plugins\renderer\yaml.js:7:15)
    at Hexo.tryCatcher (D:\Program Files (x86)\Hexo_Blog\node_modules\bluebird\js\release\util.js:16:23)
    at Hexo.<anonymous> (D:\Program Files (x86)\Hexo_Blog\node_modules\bluebird\js\release\method.js:15:34)
    at Promise.then.text (D:\Program Files (x86)\Hexo_Blog\node_modules\hexo\lib\hexo\render.js:60:20)
    at tryCatcher (D:\Program Files (x86)\Hexo_Blog\node_modules\bluebird\js\release\util.js:16:23)
    at Promise._settlePromiseFromHandler (D:\Program Files (x86)\Hexo_Blog\node_modules\bluebird\js\release\promise.js:517:31)
    at Promise._settlePromise (D:\Program Files (x86)\Hexo_Blog\node_modules\bluebird\js\release\promise.js:574:18)
    at Promise._settlePromise0 (D:\Program Files (x86)\Hexo_Blog\node_modules\bluebird\js\release\promise.js:619:10)
    at Promise._settlePromises (D:\Program Files (x86)\Hexo_Blog\node_modules\bluebird\js\release\promise.js:699:18)
    at _drainQueueStep (D:\Program Files (x86)\Hexo_Blog\node_modules\bluebird\js\release\async.js:138:12)
    at _drainQueue (D:\Program Files (x86)\Hexo_Blog\node_modules\bluebird\js\release\async.js:131:9)
    at Async._drainQueues (D:\Program Files (x86)\Hexo_Blog\node_modules\bluebird\js\release\async.js:147:5)
    at Immediate.Async.drainQueues [as _onImmediate] (D:\Program Files (x86)\Hexo_Blog\node_modules\bluebird\js\release\async.js:17:14)
    at runCallback (timers.js:705:18)
    at tryOnImmediate (timers.js:676:5)
```

可能原因：

1、安装server模块 hexo g后先安装 在你的blog根目录下npm install 然后你就发现hexo s可以正常使用了

2、配置中要有空格（参照：https://www.jianshu.com/p/dec7cfe1fe30）

我的原因：

\_config.yml 中有个配置后没加空格

## 问题2：

项目名是用户名

https://blog.csdn.net/qq32933432/article/details/87955133

## 问题3：

next 主题配置更改后不会立即生效，有个缓冲时间。

https://github.com/hexojs/hexo/issues/67

问题4：npm问题

npm install

```shell
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: fsevents@2.1.3 (node_modules\fsevents):
npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for fsevents@2.1.3: wanted {"os":"darwin","arch":"any"} (current: {"os":"win32","arch":"x64"})

audited 254 packages in 2.178s

5 packages are looking for funding
  run `npm fund` for details

found 1 low severity vulnerability
  run `npm audit fix` to fix them, or `npm audit` for details
```

npm audit fix

```powershell
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: fsevents@2.1.3 (node_modules\fsevents):
npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for fsevents@2.1.3: wanted {"os":"darwin","arch":"any"} (current: {"os":"win32","arch":"x64"})

up to date in 0.91s

5 packages are looking for funding
  run `npm fund` for details

fixed 0 of 1 vulnerability in 254 scanned packages
  1 vulnerability required manual review and could not be updated
```

npm audit --json

```powershell
"overview": "Affected versions of `minimist` are vulnerable to prototype pollution. Arguments are not properly sanitized, allowing an attacker to modify the prototype of `Object`, causing the addition or modification of an existing property that will exist on all objects.  \nParsing the argument `--__proto__.y=Polluted` adds a `y` property with value `Polluted` to all objects. The argument `--__proto__=Polluted` raises and uncaught error and crashes the application.  \nThis is exploitable if attackers have control over the arguments
being passed to `minimist`.\n",
      "recommendation": "Upgrade to versions 0.2.1, 1.2.3 or later.",
      "references": "- [GitHub commit 1](https://github.com/substack/minimist/commit/4cf1354839cb972e38496d35e12f806eea92c11f#diff-a1e0ee62c91705696ddb71aa30ad4f95)\n- [GitHub commit 2](https://github.com/substack/minimist/commit/63e7ed05aa4b1889ec2f3b196426db4500cbda94)",
```

npm audit

npm show minimist version

https://blog.csdn.net/weixin\_34067980/article/details/94043735

https://github.com/substack/minimist/commit/4cf1354839cb972e38496d35e12f806eea92c11f#diff-a1e0ee62c91705696ddb71aa30ad4f95)
