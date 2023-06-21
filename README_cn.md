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

# 核心功能

华炎魔方可以支持多种企业应用场景，包括但不限于CRM、ERP、OA、BI、IoT、大数据等。无论是传统企业还是新兴企业，都可以使用华炎魔方快速构建自己的应用程序和流程。

- **可视化构建应用**：使用简单易懂的拖放式界面，用户可以快速创建自定义的企业级应用程序。
  - [x] 应用 [文档](https://docs.steedos.cn/zh-CN/no-code/application/app)
  - [x] 选项卡 [文档](https://docs.steedos.cn/zh-CN/no-code/application/tab)
  - [x] 微页面 [文档](https://docs.steedos.cn/zh-CN/no-code/amis/) 可视化页面设计引擎，替代 [Salesforce Lightning App Builder](https://help.salesforce.com/s/articleView?id=sf.lightning_app_builder_overview.htm&type=5)
  - [x] 列表视图 [文档](https://docs.steedos.cn/zh-CN/no-code/customize/listview/)
  - [x] 页面布局 [文档](https://docs.steedos.cn/zh-CN/no-code/customize/page-layout)
- **数据管理**：华炎魔方提供了强大的数据管理功能，包括数据建模、数据存储、数据分析等，可以帮助企业轻松管理和分析大量的数据。
  - [x] 对象 [文档](https://docs.steedos.cn/zh-CN/no-code/customize/object) 
  - [x] 字段 [文档](https://docs.steedos.cn/zh-CN/no-code/customize/fields/) 
  - [x] 验证规则 [文档](https://docs.steedos.cn/zh-CN/no-code/customize/validation-rules) 
  - [ ] [Metabase 数据分析引擎](https://github.com/metabase/metabase) ，替代 [Salesforce Reports and Dashboards](https://help.salesforce.com/s/articleView?id=sf.analytics_overview.htm&type=5)
- **安全和权限控制**：平台提供了完善的安全和权限控制机制，可以确保企业数据的安全性和隐私性。
  - [x] 对象权限 [文档](https://docs.steedos.cn/zh-CN/admin/permissions/object-permissions)
  - [x] 字段权限 [文档](https://docs.steedos.cn/zh-CN/admin/permissions/field-permissions)
  - [x] 应用权限 [文档](https://docs.steedos.cn/zh-CN/admin/permissions/app-permissions)
  - [x] 分部级权限 [文档](https://docs.steedos.cn/zh-CN/admin/permissions/division)
  - [x] 共享规则 [文档](https://docs.steedos.cn/zh-CN/admin/permissions/sharing-rules)
  - [x] 限制规则 [文档](https://docs.steedos.cn/zh-CN/admin/permissions/restriction-rules)
  - [x] 简档 [文档](https://docs.steedos.cn/zh-CN/admin/permissions/profile)
  - [x] 权限集 [文档](https://docs.steedos.cn/zh-CN/admin/permissions/permission-set)
- **流程自动化**：内置可视化的流程开发引擎，可以帮助用户快速实现业务流程自动化。
  - [x] 自动化操作 [文档](https://docs.steedos.cn/zh-CN/automation/automated-actions)
  - [x] 工作流规则 [文档](https://docs.steedos.cn/zh-CN/automation/workflow-rules)
  - [x] 批准过程 [文档](https://docs.steedos.cn/zh-CN/automation/approval-process)
  - [x] 审批王 [文档](https://docs.steedos.cn/zh-CN/automation/approval-king/)
  - [ ] [n8n](https://github.com/n8n-io/n8n) 业务流程编排，替代 [Salesforce Flow Builder](https://help.salesforce.com/s/articleView?id=sf.flow.htm&language=en_US&type=5)
- **可视化应用集成**：华炎魔方提供可视化应用程序集成开发工具，可以帮助企业快速实现内外部系统间的无缝衔接。
  - [x] [Node-RED](https://github.com/node-red/node-red) 集成 [文档](https://docs.steedos.cn/zh-CN/plugins/node-red)
  - [ ] [ToolJet](https://github.com/ToolJet/ToolJet/) 微应用
- **高代码开发**：元数据可以同步为代码，进行版本管理并实现自动化；对于复杂的业务逻辑，可以编写前后端代码实现。
  - [x] create-steedos-app [文档](https://docs.steedos.com/zh-CN/developer/create-steedos-app)
  - [x] 软件包 [文档](https://docs.steedos.com/zh-CN/developer/package)
  - [x] VS Code 插件，支持元数据与代码双向同步 [文档](https://docs.steedos.com/zh-CN/developer/sync-metadata)， 替代 [Salesforce DX](https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/sfdx_dev_intro.htm)
  - [x] API [文档](https://docs.steedos.com/zh-CN/api/rest-api/)
  - [x] 触发器 [文档](https://docs.steedos.com/zh-CN/developer/action-trigger)
  - [x] 自定义API [文档](https://docs.steedos.com/zh-CN/developer/action-api)

## 可视化设计微页面

基于[百度Amis](https://aisuda.bce.baidu.com/amis/zh-CN/components)，扩展开发面向业务模型的动态组件，并提供可视化设计工具，实现[华炎魔方微页面](https://www.steedos.cn/docs/amis/start)。参考：[Saleforce Lightning](https://developer.salesforce.com/docs/component-library/documentation/en/lwc)。

![微页面](https://console.steedos.cn/api/files/images/642166bd671028003e75f910)

## 可视化创建业务对象

实现[可视化建模](https://www.steedos.cn/docs/admin/object)，并开发配套的权限引擎、规则引擎、流程引擎、报表引擎，以及以上相关的可视化设计工具。参考：[Salesforce Object](https://developer.salesforce.com/docs/atlas.en-us.object_reference.meta/object_reference/sforce_api_objects_concepts.htm)。

![对象管理](https://console.steedos.cn/api/files/images/64216644671028003e75f90e)

## 安全和权限控制

平台提供了完善的安全和权限控制机制，可以确保企业数据的安全性和隐私性。[Steedos](https://docs.steedos.com/admin/permissions/)🚀[Salesforce](https://developer.salesforce.com/docs/atlas.en-us.securityImplGuide.meta/securityImplGuide/security_data_access.htm)

![Steedos Permissions Overview](./docs/diagrams/Steedos%20Permissions.drawio.svg)

## VS Code 插件

实现 [Steedos VSCode 插件](https://www.steedos.cn/docs/developer/sync-metadata)，可视化工具设计的元数据可以和代码双向同步。参考：[Salesforce DX](https://developer.salesforce.com/developer-centers/developer-experience)。

![Steedos VSCode 插件](https://console.steedos.cn/api/files/images/6421667e671028003e75f90f)


# 快速向导

## 创建一个空项目

```
npx create-steedos-app my-project
```

## 项目实例

- [项目模版](https://github.com/steedos/steedos-project-template)
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



