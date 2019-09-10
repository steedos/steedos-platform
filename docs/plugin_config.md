---
title: 插件配置
---

## 插件基本信息

插件名称、版本等信息在 package.json 中定义。

```json
{
  "name": "steedos-plugin-test",
  "description": "Test plugin",
  "version": "0.0.1",
}
```

## 插件参数

插件配置文件保存在插件根目录的 plugin.config.yml

```yml
datasources:
  mattermost:
    objectFiles: 
     - ./src/**
server:
  main: index.js
webapp:
  main: webapp/dist/main.js
  css: webapp/dist/main.css
settings_schema:
  header: Some header text
  footer: Some footer text
  settings:
    - key: somekey
      display_name: Enable Extra Feature
      type: boolean
      help_text: When true, an extra feature will be enabled!
      default: false
props:
  somekey:
```

### 数据源 datasources

描述本插件引用到的第三方数据源。项目中引用此插件时，必须配置相关的数据源。

### 服务端入口 server

服务端的入口文件，其中必须导出 init 函数。

### 客户端入口 webapp

客户端的入口文件，可以为Steedos客户端加载额外的Javascript和CSS文件。

### 配置 settings_schema

定义插件参数的格式，便于管理员在界面上配置插件参数。

### 属性 props

在此描述插件的默认属性。引用插件时，steedos-config.yml 文件中配置的属性会覆盖这里的默认属性，而管理员在界面上配置的属性则优先级最高。
