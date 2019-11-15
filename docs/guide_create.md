---
title: 创建项目
---

使用 steedos create 命令，可以创建一个空的模板项目。

## 创建空项目

```bash
steedos create my-app
```

## 安装依赖包

```bash
cd my-app
yarn
```

## 文件夹结构

项目创建后，您的项目文件夹内容如下：

```bash
my-app/
  README.md
  node_modules/
  package.json
  src/
    accounts.object.yml
    contacts.object.yml
    crm.app.yml
  server.js
  steedos-config.yml
```

其中

- src: 项目源码
- [steedos-config.yml](steedos_config.md): 项目配置文件，可以配置数据源、插件等参数。
- package.json: 主要用于配置本项目以来的npm包。