---
url: /daily/博客文档/VitPress/5_Vue组件.md
---

# Vue组件

## 简介

常说的 SFC 组件，即 `Single file component` ，也就是我们的vue组件

组件是将HTML、CSS以及JavaScript封装成了一个 `*.vue` 文件

分别是：`<script>`、`<template>`、`<style>`

::: tip 说明

* JavaScript 对应：`<script>`
* HTML 对应：`<template>`
* CSS 对应：`<style>`

:::

## 安装

::: tip 说明

已安装过的无视，按 `CTRL+C` 退出开发预览模式后安装

:::

```sh
npm i vue
```

## 使用

在 `theme` 目录中 创建 `components`文件夹，然后创建 `Mycomponent.vue`

```markdown{5,6}
docs
├─ .vitepress
│  └─ config.mts
│  └─ theme
│  │   ├─ components
│  │   │   └─ Mycomponent.vue
│  │   └─ index.ts
└─ index.md
```

然后将下面代码粘贴在 `Mycomponent.vue` 中

```vue
<script setup>
// 这里是JavaScript
</script>

<template>
<!-- 这里是HTML -->
</template>

<style>
/* 这里是CSS */
</style>
```

然后，在 `theme\index.ts` 中注册全局组件

```markdown{7}
docs
├─ .vitepress
│  └─ config.mts
│  └─ theme
│  │   ├─ components
│  │   │   └─ Mycomponent.vue
│  │   └─ index.ts
└─ index.md
```

```css
/* .vitepress/theme/index.ts */
import Mycomponent from "./components/Mycomponent.vue"  // [!code focus:1]

export default {
  extends: DefaultTheme,
  enhanceApp({app}) {  // [!code focus:4]
    // 注册全局组件
    app.component('Mycomponent' , Mycomponent)
  }
}
```

## 演示

### 不蒜子

使用前请安装 [浏览量的插件：不蒜子](https://vitepress.yiov.top/plugin.html#浏览量) ，想好看自己研究一下吧

现在仅做一个简单的封装示例，在 `theme/components` 文件夹中创建 `DataPanel.vue` 组件

```markdown{6}
docs
├─ .vitepress
│  └─ config.mts
│  └─ theme
│  │   ├─ components
│  │   │   └─ DataPanel.vue
│  │   └─ index.ts
└─ index.md
```

在 `DataPanel.vue` 填入如下代码，保存

::: tip 说明

代码参考自 [ChoDocs](https://chodocs.cn/) 的早期页面，现已下架

作者使用了 [unocss](https://unocss.dev/) ，我就直接生扒下来了，凑合用吧

代码中使用了 [动态的emoji表情](https://www.emojiall.com/zh-hans/image-emoji-platform/telegram/animation)，可自行替换

:::

```vue
<script setup lang="ts">
</script>

<template>
  <div class="panel">
    <div class="container">
      <section class="grid">
        <span class="text">
          本站总访问量 <span id="busuanzi_value_site_pv" class="font-bold">--</span> 次
        </span>
        <img src="/heart.gif" alt="heart" width="50" height="50" />
        <span class="text">
          本站访客数 <span id="busuanzi_value_site_uv" class="font-bold">--</span> 人次
        </span>
      </section>
    </div>
  </div>
</template>

<style scoped>
.panel {
  margin-top: 12px;
  margin-bottom: 8px;
}

.container {
  background-color: var(--vp-c-bg-soft);
  border-radius: 8px;
  width: 100%;
  min-height: 32px;
  max-width: 1152px;
  margin-left: auto;
  margin-right: auto;
}

.grid {
  font-weight: 500;
  padding-top: 12px;
  padding-bottom: 12px;
  padding-left: 12px;
  padding-right: 12px;
  justify-items: center;
  align-items: center;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  display: grid;
}

.text {
  font-size: .875rem;
  line-height: 1.25rem;
}
</style>
```

然后，在 `index.ts` 中注册全局组件

```js
/* .vitepress/theme/index.ts */
import DefaultTheme from 'vitepress/theme'
import DataPanel from "./components/DataPanel.vue"

export default {
  extends: DefaultTheme,
  enhanceApp({app}) { 
    // 注册全局组件
    app.component('DataPanel' , DataPanel)
  }
}
```

最后回到首页，插入组件看效果

```markdown
<!-- index.md -->
<DataPanel />
```
