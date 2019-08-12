---
title: 服务端插件
---

通过定义服务端插件，开发人员可以创建/继承业务对象，或是开发服务端API。

## 创建插件
任何 Steedos 项目都可以转换为一个插件。每个插件就是一个npm包，必须先发布到npm，才能在其他项目中引用。

### 插件名称
package.json 中定义的 npm 包名称，就是插件名称。

## 插件API
每个插件必须定义一个plugin.config.js文件，用于申明Steedos相关API。

### 插件初始化
定义并导出 init 函数，供 Steedos 在插件初始化时调用。
```js
export function init(context) {
    // 执行插件初始化。
}
```
context中包含以下参数：
- app: express 服务端，用于引入路由。
- settings: 项目 steedos-config.yml 中配置的所有参数。

### 定义服务端API
可以在插件中定义 Express Routes，并在插件初始化函数中注册相关路由。

在 plugin.config.js 中添加如下代码定义了一个 '/plugins/test/api/hello' 路由：
```js
const express = require('express')
const router = express.Router();

router.get('/hello', async (req, res) => {
    if (req.user){
        res.status(200).send('Hello ' + req.user.name);
        res.end();
    } else {
        res.status(403).send('Sorry, access denied.');
        res.end();
    }
    return;
}

export function init(context) {
    context.app.use('/plugins/test/api', router);
}
```

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