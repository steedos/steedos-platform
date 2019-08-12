---
title: Web插件
---

通过定义Web插件，开发人员可以扩展Steedos现有网页客户端的功能。

## 创建插件
任何 Steedos 项目都可以转换为一个插件。每个插件就是一个npm包，必须先发布到npm，才能在其他项目中引用。

### 插件名称
package.json 中定义的 npm 包名称，就是插件名称。

## 插件API
每个插件必须定义一个plugin.config.js文件，用于申明Steedos相关API。


### 引入客户端 Javascript 文件
如果需要扩展前端功能，可以在 plugin.config.js 中定义插件需加载的 Javascript 文件。
```js
export scripts = [
    'https://buttons.github.io/buttons.js'
]
```

### 引入客户端 CSS 文件
如果需要扩展前端功能，可以在 plugin.config.js 中定义插件需加载的 CSS 文件。
```js
export stylesheets = [
    'https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.7.2/animate.min.css'
]
```