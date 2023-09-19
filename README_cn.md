<p align="center">
  <a href="https://www.steedos.cn/">
    <img alt="Steedos" src="https://steedos.github.io/assets/logo.png" width="80" />
  </a>
</p>
<h1 align="center">
  Steedos低代码PaaS平台
</h1>

<p align="center">
<a href="./README.md">English</a>
<a href="https://docs.steedos.com/" target="_blank"> · 文档</a>
<a href="https://github.com/steedos-labs/" target="_blank"> · Steedos Labs</a>
</p>


<p align="center" style="border-top: solid 1px #cccccc">
  华炎魔方低代码PaaS平台是一款基于 Salesforce Platform 的开源替代方案，旨在为企业提供高效、灵活、易于使用的低代码开发平台。
</p>

<h3 align="center">
 🤖 🎨 🚀
</h3>

## 点击鼠标，就能编程

华炎魔方可以支持多种企业应用场景，包括但不限于CRM、ERP、OA、BI、IoT、大数据等。无论是传统企业还是新兴企业，都可以使用华炎魔方快速构建自己的应用程序和流程。

![微页面](https://console.steedos.cn/api/files/images/642166bd671028003e75f910)

- **可视化构建应用**：使用简单易懂的拖放式界面，用户可以快速创建自定义的企业级应用程序。
  - [x] 应用 [文档](https://docs.steedos.cn/zh-CN/no-code/application/app)
  - [x] 选项卡 [文档](https://docs.steedos.cn/zh-CN/no-code/application/tab)
  - [x] 微页面 [文档](https://docs.steedos.cn/zh-CN/no-code/amis/) 可视化页面设计引擎，替代 [Salesforce Lightning App Builder](https://help.salesforce.com/s/articleView?id=sf.lightning_app_builder_overview.htm&type=5)
  - [x] 列表视图 [文档](https://docs.steedos.cn/zh-CN/no-code/customize/listview/)
  - [x] 页面布局 [文档](https://docs.steedos.cn/zh-CN/no-code/customize/page-layout)
- **可视化数据建模**：华炎魔方提供了强大的数据管理功能，包括数据建模、数据存储、数据分析等，可以帮助企业轻松管理和分析大量的数据。
  - [x] 对象 [文档](https://docs.steedos.cn/zh-CN/no-code/customize/object) 
  - [x] 字段 [文档](https://docs.steedos.cn/zh-CN/no-code/customize/fields/) 
  - [x] 验证规则 [文档](https://docs.steedos.cn/zh-CN/no-code/customize/validation-rules) 
- **自动化业务流程**：内置可视化的流程开发引擎，可以帮助用户快速实现业务流程自动化。
  - [x] 自动化操作 [文档](https://docs.steedos.cn/zh-CN/automation/automated-actions)
  - [x] 工作流规则 [文档](https://docs.steedos.cn/zh-CN/automation/workflow-rules)
  - [x] 批准过程 [文档](https://docs.steedos.cn/zh-CN/automation/approval-process)
  - [x] 审批王 [文档](https://docs.steedos.cn/zh-CN/automation/approval-king/)

## 管理数据访问权限

平台提供了完善的安全和权限控制机制，可以确保企业数据的安全性和隐私性。[Steedos](https://docs.steedos.com/admin/permissions/)🚀[Salesforce](https://developer.salesforce.com/docs/atlas.en-us.securityImplGuide.meta/securityImplGuide/security_data_access.htm)

![Steedos Permissions Overview](./docs/diagrams/Steedos%20Permissions.drawio.svg)

  - [x] 对象权限 [文档](https://docs.steedos.cn/zh-CN/admin/permissions/object-permissions)
  - [x] 字段权限 [文档](https://docs.steedos.cn/zh-CN/admin/permissions/field-permissions)
  - [x] 应用权限 [文档](https://docs.steedos.cn/zh-CN/admin/permissions/app-permissions)
  - [x] 分部级权限 [文档](https://docs.steedos.cn/zh-CN/admin/permissions/division)
  - [x] 共享规则 [文档](https://docs.steedos.cn/zh-CN/admin/permissions/sharing-rules)
  - [x] 限制规则 [文档](https://docs.steedos.cn/zh-CN/admin/permissions/restriction-rules)
  - [x] 简档 [文档](https://docs.steedos.cn/zh-CN/admin/permissions/profile)
  - [x] 权限集 [文档](https://docs.steedos.cn/zh-CN/admin/permissions/permission-set)

## 使用代码扩展Steedos

使用 Steedos DX，您可以将元数据导入到 Steedos 中，在可视化界面中进行修改，并将其同步回项目源代码。Steedos DX 引入了一种新的方式来组织您的元数据和分发您的应用程序。
  
![Steedos Overview](http://www.steedos.org/assets/platform/platform-overview.png)

您可以用Git工具管理您的所有内容 - 您的代码、配置和元数据，并从人工智能技术（如 Github Copilot）中受益。

  - [x] create-steedos-app [文档](https://docs.steedos.com/zh-CN/developer/create-steedos-app)
  - [x] 软件包 [文档](https://docs.steedos.com/zh-CN/developer/package)
  - [x] VS Code 插件 ([文档](https://docs.steedos.com/zh-CN/developer/sync-metadata))，支持元数据与代码双向同步， 替代 [Salesforce DX](https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/sfdx_dev_intro.htm)
  - [x] API [文档](https://docs.steedos.com/zh-CN/api/rest-api/)
  - [x] 触发器 [文档](https://docs.steedos.com/zh-CN/developer/action-trigger)
  - [x] 自定义API [文档](https://docs.steedos.com/zh-CN/developer/action-api)
  
## 企业级插件

华炎魔方支持以插件的方式与第三方开源项目无缝融合，包括统一身份认证、数据分析、微应用、流程自动化，为客户构建一体化的企业PaaS平台。

  - [x] [KeyCloak](https://github.com/keycloak/keycloak) 企业级统一身份认证平台, **vs** [Salesfore Identity](https://help.salesforce.com/s/articleView?id=sf.identity_overview.htm&type=5)
  - [x] [Node-RED](https://github.com/node-red/node-red) 可视化编程、物联网开发。 [文档](https://docs.steedos.cn/zh-CN/plugins/node-red)
  - [x] [ToolJet](https://github.com/ToolJet/ToolJet/) 连接任意数据源，使用amis构建微应用。
  - [x] [Metabase](https://github.com/metabase/metabase) 数据分析引擎, **vs** [Salesforce Reports and Dashboards](https://help.salesforce.com/s/articleView?id=sf.analytics_overview.htm&type=5)
  - [ ] [n8n](https://github.com/n8n-io/n8n) 业务流程编排, **vs** [Salesforce Flow Builder](https://help.salesforce.com/s/articleView?id=sf.flow.htm&language=en_US&type=5)
  
# 快速向导

## 运行平台源码

```
docker-compose build
docker-compose up
```

## 运行项目模版

- 项目模版: https://github.com/steedos/steedos-project-template

## 创建一个空项目

```
npx create-steedos-app my-project
```

## 示例

- [Examples](https://github.com/steedos/steedos-examples)
- [Steedos Labs 开源项目](https://github.com/steedos-labs/)

## 技术框架

华炎魔方服务端使用nodejs开发，您定义的元数据，和系统中录入的业务数据均保存在mongodb中。

- [MongoDB](https://www.mongodb.com/) : 华炎魔方使用 MongoDB 作为元数据仓库和默认数据源.
- [Node.js](https://nodejs.org/): 华炎魔方平台源码运行于 nodejs 环境。
- [Moleculer](https://moleculer.services/zh/): 基于 Node.js 的响应式微服务框架。
- [Amis](https://aisuda.bce.baidu.com/amis/zh-CN/components): 百度 Amis 前端低代码框架。

## 为华炎魔方做贡献

从上报BUG到提出改善建议，每一个贡献都非常欢迎。如果您打算动手修改代码来修正BUG或实现某个新功能，请先创建一个 [ISSUE](https://github.com/steedos/steedos-platform/issues)。


如果您有任何疑问或想与其他华炎魔方用户交谈，请扫码添加以下联系方式与我们联系。

| ![开发者微信交流群](https://steedos.github.io/assets/github/platform/cn/QR_wechat_developers.jpg) | ![商务咨询](https://steedos.github.io/assets/github/platform/cn/business_consulting.jpg)        | ![微信公众号](https://steedos.github.io/assets/github/platform/cn/public_number.jpg)|
| :-----: | :-----: | :-----: |
| 开发人员微信群  | 商务咨询  | 微信公众号 |



