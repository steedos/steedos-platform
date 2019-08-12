---
title: Web 插件
---

此教程将引导您创建一个基本的Steedos Web插件。

## 创建插件

创建并跳转到插件文件夹。

```bash
cd {project_root}
mkdir plugins
cd plugins
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
}
```

## 安装依赖包

```bash
yarn add --dev  @babel/core @babel/preset-env @babel/preset-react babel-loader webpack webpack-cli
yarn add react
```

## 配置 webpack
创建一个 `/webpack.config.js`文件，配置webpack

```js
var path = require('path');

module.exports = {
    entry: [
        './webapp/index.jsx',
    ],
    resolve: {
        modules: [
            'webapp',
            'node_modules',
        ],
        extensions: ['*', '.js', '.jsx'],
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-react',
                            [
                                "@babel/preset-env",
                                {
                                    "modules": "commonjs",
                                    "targets": {
                                        "node": "current"
                                    }
                                }
                            ]
                        ],
                    },
                },
            },
        ],
    },
    externals: {
        react: 'React',
    },
    output: {
        path: path.join(__dirname, '/dist/webapp'),
        publicPath: '/',
        filename: 'main.js',
    },
};
```

> 注意 `react` 被指定为外部包. 这样你可以在本地测试代码 (e.g. with [jest](https://jestjs.io/) and snapshots) ，但是必不会影响到 Steedos 打包的react版本。

## 创建入口文件

```bash
mkdir webapp
touch webapp/index.jsx
```

编辑 `src/index.jsx`，写入以下内容:

```js
import React from 'react';

// Courtesy of https://feathericons.com/
const Icon = () => <i className='icon fa fa-plug'/>;

class HelloWorldPlugin {
    initialize(registry, store) {
        registry.registerChannelHeaderButtonAction(
            // icon - JSX element to use as the button's icon
            <Icon />,
            // action - a function called when the button is clicked, passed the channel and channel member as arguments
            // null,
            () => {
                alert("Hello World!");
            },
            // dropdown_text - string or JSX element shown for the dropdown button description
            "Hello World",
        );
    }
}

window.registerPlugin('com.steedos.plugin-hello-world', new HelloWorldPlugin());
```

## 打包 Webapp

生成打包文件，以便安装到项目中。

```bash
yarn webpack --mode=production
```

## 编写配置文件

创建插件配置文件 plugin.config.yml

```yml
webapp:
  main: webapp/dist/main.js
```

## 插件测试

重新启动 Steedos服务，测试插件效果。
