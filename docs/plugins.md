---
title: 使用插件
---

通过定义插件，可以扩展Steedos现有的功能。

## 配置插件

### 安装插件
启用插件前，需先在项目中安装插件。
```shell
yarn add @steedos/plugin-jsreport
```

### 启用插件
配置 steedos-config.yml 文件，可以启用插件。例如以下配置用于启用 jsreport 插件：
```yaml
plugins: 
  - "@steedos/plugin-jsreport"
```
Steedos 启动时，会自动检测插件对应的npm包是否已在本地安装，如果未安装提示报错。

## 示例
### jsreport 插件
使用 jsreport 开发 steedos 报表。[源码](https://github.com/steedos/steedos-plugin-jsreport)