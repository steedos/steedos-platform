---
title: 快速向导
---

通过定义插件，可以扩展Steedos现有的功能。

## Steedos 插件

### 引入插件

配置 steedos-config.yml 文件，可以启用插件。例如以下配置用于启用 jsreport 插件：

```yaml
plugins:
  - "@steedos/plugin-jsreport"
```

### 安装插件

插件可以以node_modules的形式安装在项目文件夹中，例如。

```shell
yarn add @steedos/plugin-jsreport
```

### 调试插件源码

插件也可以以源码的形式安装在项目的 /plugins 文件夹中。Steedos会优先使用此文件夹下的插件版本。例如要调试@steedos/plugin-jsreport插件，可以把源码复制到：

```shell
{project_root}/plugins/@steedos/plugin-jsreport
```

## 示例

### jsreport 插件

使用 jsreport 开发 steedos 报表。[源码](https://github.com/steedos/steedos-plugin-jsreport)。
