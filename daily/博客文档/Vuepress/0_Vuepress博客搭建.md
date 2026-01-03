---
url: /daily/博客文档/Vuepress/0_Vuepress博客搭建.md
---

# Vuepress博客搭建

> 官方文档：<https://vuepress.vuejs.org/zh/>

# Vuepress搭建

`Vuepress` 是由 `Vue` 支持的静态网站生成工具，因为 `Vue` 上手起来很简单，所以 `Vuepress` 使用起来也不难。如果想快速搭建一个静态的博客网站来简单记录记录笔记或者文章，用 `Vuepress` 是个不错的选择，因为它对新手很友好。

其他一些类似的博客工具

* docsify
* docusaurus
* NotionNext

## 准备开发环境

1. git（版本管理）
2. nodejs（核心，推荐14.x，新版本启动时需要增加一些配置选项）
3. yarn（npm包管理的替代）
4. vscode/WebStorm（编译器）

## 徽章

## 自定义样式

> <http://www.taodudu.cc/news/show-3334923.html?action=onClick>
>
> <https://bbs.csdn.net/topics/607761494>
>
> <https://blog.csdn.net/qq_41327483/article/details/119103300>
>
> <https://juejin.cn/post/7242181894116573245#heading-6>
>
> <https://blog.csdn.net/weixin_42029738/article/details/125833297>
>
> <https://blog.csdn.net/howareyou2104/article/details/107412555>

新建 `.vuepress/styles/palette.styl` 文件增加样式

```css
// 侧边栏样式
// 左侧侧边栏标题
.sidebar > .sidebar-links > li > a.sidebar-link {
  font-size: 1.5em !important;
  margin-left: -1em;
}

// 右侧文章标题导航栏
a.sidebar-link {
  font-size: 10px !important;
  line-height: 0.5 !important;
}

// 左侧边栏标题字体大小样式
.sidebar-heading span {
  font-size: 1.2em;
  font-weight: bold;
}

.sidebar-heading.open span {
  font-weight: bold;
}

// 左侧边栏展开文章的字体大小
a.sidebar-link.active {
  color: #070808 !important;
  font-size: 14px !important;
  background: #c3d4b742 !important;
}

.sidebar-sub-headers a.sidebar-link {
  margin: 0 1rem 0 1rem !important;
}

// 分组的透明度修改，未生效
.sidebar-group.is-sub-group > .sidebar-heading:not(.clickable) {
  opacity: 0.5;
}

// 去除左上角标题，作者，标签等
.page .page-title {
  display: none;
}
```

## 让Google搜索到GitHub上的个人博客

<https://blog.csdn.net/weixin_44058333/article/details/100165245>

## 添加 iconfont 图标

iconfont官网下载图标：[https://www.iconfont.cn](https://www.iconfont.cn/)

方法1：

1. 首先，在iconfont网站上创建或下载需要的图标。
2. 下载完成后，会得到一份包含iconfont.css、iconfont.eot、iconfont.svg、iconfont.ttf、iconfont.woff等文件的压缩包。
3. 将这些文件放入的VuePress项目的.vuepress/public目录下。
4. 在.vuepress/config.js文件中的head属性中引入iconfont.css文件。例如：

```javascript
module.exports = {
  head: [
    ['link', { rel: 'stylesheet', href: '/iconfont.css' }]
  ],
  // 其他配置...
}
```

1. 然后，就可以在你的Markdown文件或Vue组件中使用这些图标了。例如：

```javascript
<i class="iconfont icon-example"></i>
```

注意，icon-example应该替换为图标的类名。可以在iconfont.css文件中找到这些类名。

方法2：（未成功）

参考：https://juejin.cn/post/7242181894116573245#heading-6

打包报错window is not defined：https://blog.csdn.net/Miss\_Liang/article/details/99843061

根据参考链接中的方法，直接在 `.vuepress` 下新建 `enhanceApp.js`，style目录下存放在 iconfont 官网下载的图标。一直无法成功，代码如下：

```javascript
//enhanceApp.js
//import './styles/font_20csbaofexh/iconfont.css'
//import './styles/font_cs5v8kb16mu/iconfont.css'
//const pluginsConf1 = require("./styles/font_20csbaofexh/iconfont.js");
//const pluginsConf2 = require("./styles/font_cs5v8kb16mu/iconfont.js");

module.export = {
    mounted() {
        import('./styles/font_20csbaofexh/iconfont.js').then(icon => {
        })
        import('./styles/font_cs5v8kb16mu/iconfont.js').then(icon => {
        })
    }
}
```

## 添加评论

参考：https://valine.js.org/

1. 注册 LeanCloud ，获取APP ID 和 APP Key
2. config.js 中增加插件配置

## 添加复制显示版权信息

参考：https://www.jianshu.com/p/0082676af581

## 插件

### markdown-it-disable-url-encode（中文识别）

1. 安装

```shell
npm i markdown-it-disable-url-encode
```

2. 引入

```shell
module.exports = {
  // .....
  markdown: {
    // ......
    extendMarkdown: md => {
      md.use(require("markdown-it-disable-url-encode"));
    }
  }
};
```

### vuepress-plugin-auto-sidebar（自动生成侧边栏 vuepress⭐）

> 项目地址：<https://github.com/shanyuhai123/vuepress-plugin-auto-sidebar>
>
> 项目文档：<https://shanyuhai123.github.io/vuepress-plugin-auto-sidebar/zh/>

缺点：左侧侧边栏只能识别到同一级目录下的文件，无法识别到子集

1. 安装

```shell
// VuePress v1
npm i vuepress-plugin-auto-sidebar -D

// VuePress v2
# vuepress v2 alpha(vuepress v2 仍处于测试阶段)
npm i vuepress-plugin-auto-sidebar@alpha -D
```

2. 使用

```shell
// VuePress v1
// 在 .vuepress/config.js 中配置插件
// edit .vuepress/config.js file
module.exports = {
  plugins: [
    ["vuepress-plugin-auto-sidebar", {}]
  ]
}


// VuePress v2：
// VuePress v2 不再支持插件修改 sidebar，所以你需要自行引入生成的 sidebar.js 文件。
// VuePress v2 no longer supports plugins to modify sidebar, so you need to import the generated sidebar.js file yourself.

const sidebarConf = require('./sidebar')

module.exports = {
  plugins: [
    ["vuepress-plugin-auto-sidebar", {}]
  ],
  themeConfig: {
    sidebar: sidebarConf
  }
}
```

3. 生成

```shell
# 插件扩展了 vuepress cli 来帮助快速生成简单的导航栏，package.json 中增加启动项
# vuepress v2 不支持
vuepress nav docs
```

### 代码实现自动生成侧边栏

> 1. 参考（vuepress-theme-reco）：<https://blog.csdn.net/weixin_44113868/article/details/118343085>
> 2. 参考：<https://blog.csdn.net/weixin_42068913/article/details/116207129>
> 3. 参考⭐：https://blog.csdn.net/qq\_44402184/article/details/133671540

使用参考3中的，并对其进行改造，使其支持子集目录

```javascript
// 侧边栏识别工具js
const fs = require('fs');
const path = require('path');

/**
 * 读取指定目录下的所有.md文件，按照文件名从大到小排列
 * @param relativePath 相对路径
 * @returns {string[]|*[]} 文件名数组
 */
function findMdFiles(relativePath) {
  const directoryPath = path.join(process.cwd(), relativePath);

  let mdFiles = [];
  console.log("日志1：" + directoryPath);
  try {
    const files = fs.readdirSync(directoryPath);

    files.forEach((file) => {
      const filePath = path.join(directoryPath, file);
      const stats = fs.statSync(filePath);

      if (stats.isDirectory()) {
        // mdFiles = mdFiles.concat(findMdFiles(filePath));
        const relativeFilePath = path.relative(process.cwd(), filePath);
        mdFiles = mdFiles.concat(findMdFiles(relativeFilePath));
      } else if (file.endsWith('.md') && file !== 'README.md') {
        //mdFiles.push(path.parse(file).name);
        //mdFiles.push(filePath);
        //path.relative(process.cwd(), filePath) 来获取从 relativePath 开始的路径加上 .md 文件名。
        // 修改了排序函数，使其使用 path.basename(a) 和 path.basename(b) 来获取文件名，然后再进行比较
        const relativeFilePath = path.relative(process.cwd(), filePath).replace(/\\/g, '/');
        const htmlFilePath1 = relativeFilePath.replace('.md', '');
        mdFiles.push("/" + htmlFilePath1);
      }
    });

    // 按照从大到小排序
    mdFiles.sort((a, b) => {
      const aNum = parseInt(path.basename(a).slice(1));
      const bNum = parseInt(path.basename(b).slice(1));
      return bNum - aNum;
    });
    console.log("日志2：" + mdFiles);
    return mdFiles;
  } catch (error) {
    console.error(`Error reading directory ${directoryPath}: ${error}`);
        return [];
    }
}

module.exports = {
    findMdFiles
};
```

使用时引用即可

```javascript
const path = require('./path.mts');
...
...
'/Java/java开发技巧/': [
        {
            title: '函数式编程',   // 必要的
            collapsable: false, // 可选的, 默认值是 true,
            sidebarDepth: 3,    // 可选的, 默认值是 1
            children: path.findMdFiles('/Java/java开发技巧/函数式编程/')
        },
  ]
```

### vuepress-theme-sidebar（自动生成导航栏 vuepress2.x默认主题可用）

项目地址：https://github.com/dingshaohua-cn/vuepress-theme-sidebar

### plugin-register-components（.vue文件识别）

参考：https://www.cnblogs.com/wangdashi/p/16308107.html

### vuepress-plugin-bgm-player（音乐播放器 vuepress-reco）

参考：https://github.com/vuepress-reco/vuepress-plugin-bgm-player

### 多页面生成（同一个md生成多个html页面）

参考：https://www.cnblogs.com/dingshaohua/p/15386262.html

### 添加侧边栏访问地图（vdoing主题可用）

参考：[https://wiki.eryajf.net/pages/76f813/#\_1-%E6%95%88%E6%9E%9C](https://wiki.eryajf.net/pages/76f813/#_1-效果)

### 集成element-ui

参考：https://cloud.tencent.com/developer/article/1700029

### 基于Algolia实现网站全文搜索

参考：https://zhuanlan.zhihu.com/p/549263050?utm\_id=0

### 数学公式支持

**markdown-it-texmath**

**markdown-it-katex**

**markdown-it-mathjax3**（当前使用）

**@mdit/plugin-katex**

> <https://blog.csdn.net/Flyingheart1991/article/details/126067149>
>
> <https://blog.csdn.net/m0_63748493/article/details/132354410>

## 问题

1、项目打包报错：Note: The code generator has deoptimised the styling of D:.. as it exceeds the max of 500KB

> 参考：<https://blog.csdn.net/zora_55/article/details/128797544>

在项目的根目录下创建.banelrc文件，内容为

```bash
{
   "compact": false,
   "presets": ["env", "stage-0"],
   "plugins": ["transform-runtime"]
}
```

2、Error: error:0308010C:digital envelope routines::unsupported

> 参考：<https://blog.csdn.net/zjjxxh/article/details/127173968>

命令增加：set NODE\_OPTIONS=--openssl-legacy-provider
或
降低nodejs版本

3、vite打包报错：块的大小超过限制，Some chunks are larger than 500kb after minification

# Vuepress-reco 1.0 主题

> 官方文档：<http://v1.vuepress-reco.recoluan.com/views/1.x/>

<http://zpj80231.gitee.io/znote/other/project.html>

<https://www.bookbook.cc/>

# Vuepress-reco 2.0 主题

> 官方文档：<https://vuepress-theme-reco.recoluan.com/>

# vdoing 主题

> 主题地址：<https://github.com/xugaoyi/vuepress-theme-vdoing>
>
> 示例博客：<https://m.sofineday.com>

# 示例博客

<https://zpj80231.gitee.io/znote/>

<https://www.bookbook.cc/>

<https://www.xk857.com/>

<https://www.pdai.tech/>

# 参考资料

\[1]. <https://www.bilibili.com/video/BV1vb411m7NY>

\[2]. <https://blog.csdn.net/qq_19978927/article/details/108039032>

\[3]. <https://blog.csdn.net/weixin_45732455/article/details/129940312>

\[4]. <https://segmentfault.com/a/1190000041285750>
