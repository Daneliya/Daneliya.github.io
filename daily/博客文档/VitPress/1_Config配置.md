---
url: /daily/博客文档/VitPress/1_Config配置.md
---

# Config配置

## 站点配置

### 元数据

包含了 `lang`、 `title` 、`description` 信息

```js
import {defineConfig} from 'vitepress'

export default defineConfig({
    lang: 'zh-CN', //语言，可选 en-US
    title: "VitePress", //站点名
    description: "我的vitpress文档教程",  //站点描述
})
```

### 网页标题

使用 `titleTemplate` 自定义整个网页标题，一般不使用，自定义会直接写死

> \[!IMPORTANT]
> 说明
>
> 网页标题随着每个页面的 \`\` 标题而变动，
>
> 如 标题是 `# 页面` ，那么显示的就是 `页面 | VitePress`

```js
export default defineConfig({
    lang: 'zh-CN',
    title: "VitePress",
    description: "我的vitpress文档教程", // 我的文字有下划线，请后期再查看 `组件 - 首页文字下划线`
    titleTemplate: '另起标题会覆盖title', // [!code focus]
    // titleTemplate: ':title - 快速上手', // 完全自定义标题，:title 不要动，改后面的
    // titleTemplate: false, // 关闭标题
})
```

### Fav浏览器标签图标

路径默认`public`目录，在 `docs`目录下新建 `public`目录即可

```js
export default defineConfig({

    //fav图标
    head: [
        ['link', {rel: 'icon', href: '/logo.png'}],
    ],

})
```

### 深色主题

默认是浅色模式，可自行开启或更换

```js
export default defineConfig({

    // appearance: true, // 默认浅色且开启切换
    // 启用深色模式
    appearance: 'dark',
    // appearance: false, // 关闭
    // appearance: "force-dark", // 强制深色主题

})
```

## config配置

### 首页布局

首页进入博客会加载docs/index.md，VitePress默认主题提供了一个主页布局。

```markdown
---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "My Awesome Project"
  text: "A VitePress Site"
  tagline: My great project tagline
  actions:
    - theme: brand
      text: Markdown Examples
      link: /markdown-examples
    - theme: alt
      text: API Examples
      link: /api-examples

features:
  - title: Feature A
    details: Lorem ipsum dolor sit amet, consectetur adipiscing elit
  - title: Feature B
    details: Lorem ipsum dolor sit amet, consectetur adipiscing elit
  - title: Feature C
    details: Lorem ipsum dolor sit amet, consectetur adipiscing elit
---
```

`link`说明：

1、如果要跳转项目内的文章，则直接在`link`中写入文件路径，根目录为`docs`文件夹

2、如果要跳转外部链接，则直接在`link`中写入外部链接

### 顶部按钮的跳转栏

顶部按钮在`.viewpress/config.mts`文件中配置，在`config.mts`文件中`nav`则是顶部按钮的配置，例如点击`Examples`跳转，点击配置跳配置文档，此时就可以直接修改顶部按钮的`link`配置，通过路径直接指向对应的文件即可。

```js
themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
        {text: 'Home', link: '/'},
        {text: 'Examples', link: '/markdown-examples'},
    ],
    sidebar: [
        {
            text: 'Examples',
            items: [
                {text: 'Markdown Examples', link: '/markdown-examples'},
                {text: 'Runtime API Examples', link: '/api-examples'}
            ]
        }
    ],
    socialLinks: [
        {icon: 'github', link: 'https://github.com/vuejs/vitepress'}
    ]
}
```

通常一个大型的文档，顶部的按钮会非常多，如果全部写在`config.mts`文件中，随着积累该文件会变得非常臃肿，可以把该文件`nav`配置抽离出一个单独的文件，然后引入到`config.mts`中。

在`.viewpress`中新建`nav.mts`文件，将`nav`的配置写在`nav.mts`文件中，然后导出。

```
```

### 侧边文章的跳转

在`vitepress`中，侧边文章对应的是`.viewpress/config.mts`文件中的`sidebar`字段

`sidebar`中，每一个对象，对应一个`side`，`sidebar`中可以有多个对象，你可以将`sidebar`中的对象想想成一本书，每个对象对应一本书，text对应书名，items是一个数组，对应书内的章节，章节的link就对应的文章路径。

```
```
