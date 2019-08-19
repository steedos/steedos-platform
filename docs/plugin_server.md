---
title: 服务端插件
---

通过定义服务端插件，开发人员可以创建/继承业务对象，或是开发服务端API。

以下教程创建一个Hello World服务端插件。

## 创建插件

创建并跳转到插件文件夹。

```bash
cd {project_root}
mkdir .plugins
cd .plugins
mkdir hello-world-plugin
cd hello-world-plugin
```

## 初始化插件

创建一个 package.json 文件

```json
{
  "name": "hello-world-plugin",
  "version": "0.0.1",
  "description": "Hello World",
  "main": "server/main.js"
}
```

### 插件名称 name

package.json 中定义的 npm 包名称，就是插件名称。

## 插件配置

每个插件必须定义一个插件配置文件 [plugin.config.yml](plugin_config.md) 文件。

```yml
server:
  main: server/main.js
```

配置文件描述的 server/main，必须与 package.json 中保持一致。

### 定义服务端API

可以在插件中定义 Express Routes，并在插件初始化函数中注册相关路由。

创建一个 router.js 文件，并添加以下代码：

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
```

### 插件初始化

在main文件中，必须定义并导出 init 函数，供 Steedos 在插件初始化时调用。

```js
const router = require("router");

export function init(context) {
    // 执行插件初始化。
    context.app.use('/.plugins/hello-world/api', router);
}
```

context中包含以下参数：

- app: express 服务端，用于引入路由。
- settings: 项目 steedos-config.yml 中配置的所有参数。
