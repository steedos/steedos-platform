<p align="center">
  <a href="https://www.steedos.cn/">
    <img alt="Steedos" src="https://steedos.github.io/assets/logo.png" width="80" />
  </a>
</p>
<h1 align="center">
  Steedos Low Code DevOps Platform
</h1>

<p align="center">
<a href="./README_en.md">English</a>
<a href="https://www.steedos.cn/docs/"> · 文档</a>
<a href="https://www.steedos.cn/videos/"> · 视频</a>
<a href="https://demo.steedos.cn"> · 试用</a>
</p>


<p align="center" style="border-top: solid 1px #cccccc">
  华炎魔方是 <a href="https://developer.salesforce.com/developer-centers/developer-experience" target="_blank">Salesforce Developer Experience (DX)</a> 的开源替代方案，将低代码技术与 <a href="https://www.steedos.cn/docs/deploy/devops"> DevOps 工具</a> 结合，实现敏捷开发的新高度。 
</p>

<h3 align="center">
 🤖 🎨 🚀
</h3>

## Salesforce 开源替代方案

- [Saleforce Lightning](https://developer.salesforce.com/docs/component-library/documentation/en/lwc)： 实现[华炎魔方微页面](https://www.steedos.cn/docs/amis/start)，基于[百度Amis](https://aisuda.bce.baidu.com/amis/zh-CN/components)，扩展开发面向业务模型的动态组件，并提供可视化设计工具。
- [Salesforce Object](https://developer.salesforce.com/docs/atlas.en-us.object_reference.meta/object_reference/sforce_api_objects_concepts.htm)： 实现[对象元数据](https://www.steedos.cn/docs/protocol/metadata-object)，并开发配套的权限引擎、规则引擎、流程引擎、报表引擎，以及以上相关的可视化设计工具。
- [Salesforce Metadata](https://developer.salesforce.com/docs/atlas.en-us.api_meta.meta/api_meta/meta_intro.htm)： 基于 [Steedos VSCode 插件](https://www.steedos.cn/docs/developer/sync-metadata)，实现可视化工具设计的元数据和代码双向同步。
- [Salesforce Functions](https://developer.salesforce.com/docs/platform/functions/guide/dev-guide-intro.html)：支持 [服务端开发](https://www.steedos.cn/docs/developer/getting-started)，通过编写触发器、自定义API，实现任何需要的业务逻辑。
- [Salesforce Package](https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/sfdx_dev_unlocked_pkg_whats_a_package.htm)： 元数据以及自定义的代码组合成为 [Steedos软件包](https://www.steedos.cn/docs/developer/package)。实现软件包的版本管理、发布、安装、个性化定制、版本升级、多包开发，并与现有 DevOps 方案融合。


## 基于元数据

[元数据](https://www.steedos.cn/docs/protocol/metadata-object)是华炎魔方技术架构的核心。华炎魔方使用元数据定义对象，字段，配置，代码，逻辑和页面布局，并基于这些元数据自动生成系统的数据结构以及Steedos应用程序的用户界面和自动化逻辑。

![Steedos Packages Overview](./docs/diagrams/Steedos%20Metadata.drawio.svg)

## 快速向导

### 部署华炎魔方

部署华炎魔方平台后，可以下载、安装和运行华炎魔方软件包，可以使用低代码可视化设计工具创建自定义应用程序。如需同步和编写代码，请参考后续步骤部署开发环境。

- [快速向导](https://www.steedos.cn/docs/deploy/getting-started)
- [创建新项目](https://www.steedos.cn/docs/deploy/create-steedos-app)
- [Docker 部署](https://www.steedos.cn/docs/deploy/deploy-docker)

### 调试平台源码

在本地调试平台源码，需使用 Mac 或linux环境。且需先安装 mongodb 和 redis。

您也可以使用 Gitpod 运行平台源码。(https://gitpod.io/#https://github.com/steedos/steedos-platform/)

```shell
yarn
yarn bootstrap
yarn build
yarn start
```

## 平台功能

华炎魔方社区版基于MIT协议，包含开发工具的所有必备功能，不限制用户数。基于华炎魔方开发的软件包可以任意销售而无需支付授权费用。

- [创建自定义应用程序](https://www.steedos.cn/docs/admin/create_object)：华炎魔方基于元数据驱动，把传统通过代码实现的业务需求抽象为可配置的元数据 ，只需点击⿏标修改配置项，就能实现绝⼤多数业务需求，必要时仍可编写代码。
- [自定义字段](https://www.steedos.cn/docs/admin/field_type): 基本字段类型、相关表、主表/子表、公式字段、累计汇总字段、自动编号字段。
- [权限引擎](https://www.steedos.cn/docs/admin/permission_set)：华炎魔方基于权限集为每一个对象设置权限，支持公司级、记录级、字段级的权限控制。
- [API引擎](https://www.steedos.cn/docs/developer/graphql-api): 华炎魔方自动为业务对象生成 GraphQL API， API自带身份验证并于华炎魔方权限引擎集成，实现数据权限控制。
- [审批王](https://www.steedos.cn/docs/admin/workflow-admin)：审批王是华炎自主研发的流程引擎，功能可媲美泛微且完全免费。系统内置了流程设计、流程运行、管理维护、统计分析与流程优化等各类工具，帮助企业快速部署、有效监控并持续优化业务审批过程。  
- [报表](https://steedos.cn/docs/admin/record_report)：使用华炎魔方的可视化报表工具，您可以快速配置统计图表，包括数据列表、分组报表、数据透视图、柱状图、饼图等，方便查看、分析和决策。
- [Dashboard](https://www.steedos.cn/docs/developer/dashboard): 连接第三方数据源，编写SQL语句，可视化设计各种统计图并汇总显示在仪表盘中。
- [JsReport报表](https://www.steedos.cn/docs/developer/jsreport): 可视化编写代码，开发自定义报表。
- [自动化工具](https://steedos.cn/docs/admin/auto_process)：系统内置了批准过程、工作流规则、验证规则等自动化工具，通过设定自动化工具，可以在特定条件下自动化创建和更新记录、发送邮件、短信或系统内通知，也可以自动调用第三方系统的接口。
- [数据导入](https://www.steedos.cn/docs/admin/import): 根据对象字段，配置Excel导入模版，通过Excel将数据批量导入到华炎魔方中。
- [华炎魔方DX](https://marketplace.visualstudio.com/items?itemName=Steedos.steedosdx-vscode): 华炎魔方DX包含一组 Visual Studio Code 插件，帮助您将可视化界面定义的元数据导出为源码，您可以进一步编写代码，实现高级业务逻辑功能。你可以在熟悉的环境中开发、调试、打包、发布华炎魔方软件包，并管理您的项目版本。
- [软件包打包、发布](https://www.steedos.cn/docs/developer/package)

## 技术框架

华炎魔方服务端使用nodejs开发，您定义的元数据，和系统中录入的业务数据均保存在mongodb中。

- [MongoDB](https://www.mongodb.com/try/download/) 版本 >= 4.2， 华炎魔方使用 MongoDB 作为元数据仓库和默认数据源.
- [Node.js](https://nodejs.org/en/download/) 版本 >= 12。华炎魔方平台源码运行于 nodejs 环境。
- [Meteor](https://www.meteor.com): 基于 Meteor 开发环境魔方元数据解释引擎(steedos-server)。
- [Moleculer](https://moleculer.services/zh/): 基于 Node.js 的响应式微服务框架。
- [Amis](https://aisuda.bce.baidu.com/amis/zh-CN/components): 百度 Amis 前端低代码框架。

## 学习华炎魔方

您还可以根据华炎魔方快速构建应用程序的视频教程进行操作。

- [视频教程](https://www.steedos.cn/videos/)
- [安装部署](https://www.steedos.cn/docs/deploy)
- [使用入门](https://www.steedos.cn/docs/user)
- [设置和维护华炎魔方](https://steedos.cn/docs/admin)
- [开发人员](https://www.steedos.cn/docs/developer/)
- [低代码学院](https://www.steedos.cn/docs/low-code-academy)

## 为华炎魔方做贡献

从上报BUG到提出改善建议，每一个贡献都非常欢迎。如果您打算动手修改代码来修正BUG或实现某个新功能，请先创建一个 [ISSUE](https://github.com/steedos/steedos-platform/issues)。


如果您有任何疑问或想与其他华炎魔方用户交谈，请扫码添加以下联系方式与我们联系。

| ![开发者微信交流群](https://steedos.github.io/assets/github/platform/cn/QR_wechat_developers.jpg) | ![商务咨询](https://steedos.github.io/assets/github/platform/cn/business_consulting.jpg)        | ![微信公众号](https://steedos.github.io/assets/github/platform/cn/public_number.jpg)|
| :-----: | :-----: | :-----: |
| 开发人员微信群  | 商务咨询  | 微信公众号 |



