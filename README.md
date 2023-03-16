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
- [Salesforce Object](https://developer.salesforce.com/docs/atlas.en-us.object_reference.meta/object_reference/sforce_api_objects_concepts.htm)： 实现[可视化建模](https://www.steedos.cn/docs/admin/object)，并开发配套的权限引擎、规则引擎、流程引擎、报表引擎，以及以上相关的可视化设计工具。
- [Salesforce Metadata](https://developer.salesforce.com/docs/atlas.en-us.api_meta.meta/api_meta/meta_intro.htm)： [元数据](https://www.steedos.cn/docs/protocol/metadata-object)是华炎魔方技术架构的核心。华炎魔方使用元数据定义对象，字段，配置，代码，逻辑和页面布局，并基于这些元数据自动生成系统的数据结构以及Steedos应用程序的用户界面和自动化逻辑。
- [Salesforce DX](https://developer.salesforce.com/developer-centers/developer-experience), 实现 [Steedos VSCode 插件](https://www.steedos.cn/docs/developer/sync-metadata)，可视化工具设计的元数据可以和代码双向同步。
- [Salesforce Functions](https://developer.salesforce.com/docs/platform/functions/guide/dev-guide-intro.html)：支持 [服务端开发](https://www.steedos.cn/docs/developer/getting-started)，通过编写触发器、自定义API，实现任何需要的业务逻辑。
- [Salesforce Package](https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/sfdx_dev_unlocked_pkg_whats_a_package.htm)： 元数据以及自定义的代码组合成为 [Steedos 软件包](https://www.steedos.cn/docs/developer/package)。支持软件包的版本管理、发布、安装、个性化定制、版本升级、多包开发，并与现有 DevOps 方案融合。


## 快速向导

运行华炎魔方需要安装nodejs，mongodb，redis，建议使用 docker 启动远程开发环境。

### 启动远程开发环境

```shell
docker-compose up
```

### 访问远程开发环境
打开浏览器，访问 http://127.0.0.1:5555/?folder=/home/workspace/steedos-platform ，进入VS Code远程开发环境。

### 启动模版项目

在 VS Code 中进入控制台，输入启动命令。 

```
yarn
yarn build
yarn start
```

## 系统架构

![Steedos Packages Overview](./docs/diagrams/Steedos%20Metadata.drawio.svg)

## 平台功能

## 技术框架

华炎魔方服务端使用nodejs开发，您定义的元数据，和系统中录入的业务数据均保存在mongodb中。

- [MongoDB](https://www.mongodb.com/try/download/) 版本 = 4.4， 华炎魔方使用 MongoDB 作为元数据仓库和默认数据源.
- [Node.js](https://nodejs.org/en/download/) 版本 = 14。华炎魔方平台源码运行于 nodejs 环境。
- [Meteor](https://www.meteor.com): 基于 Meteor 开发环境魔方元数据解释引擎(steedos-server)。
- [Moleculer](https://moleculer.services/zh/): 基于 Node.js 的响应式微服务框架。
- [Amis](https://aisuda.bce.baidu.com/amis/zh-CN/components): 百度 Amis 前端低代码框架。

## 了解更多

您还可以根据华炎魔方快速构建应用程序的视频教程进行操作。

- [视频教程](https://www.steedos.cn/videos/)
- [安装部署](https://www.steedos.cn/docs/deploy/getting-started)
- [开发文档](https://www.steedos.cn/docs/developer/)
- [客户案例](https://www.steedos.cn/customer-success-stories/)
- [解决方案](https://www.steedos.cn/collections/steedos-packages)
- [试用解决方案(SaaS版）)](https://demo.steedos.cn/)

## 为华炎魔方做贡献

从上报BUG到提出改善建议，每一个贡献都非常欢迎。如果您打算动手修改代码来修正BUG或实现某个新功能，请先创建一个 [ISSUE](https://github.com/steedos/steedos-platform/issues)。


如果您有任何疑问或想与其他华炎魔方用户交谈，请扫码添加以下联系方式与我们联系。

| ![开发者微信交流群](https://steedos.github.io/assets/github/platform/cn/QR_wechat_developers.jpg) | ![商务咨询](https://steedos.github.io/assets/github/platform/cn/business_consulting.jpg)        | ![微信公众号](https://steedos.github.io/assets/github/platform/cn/public_number.jpg)|
| :-----: | :-----: | :-----: |
| 开发人员微信群  | 商务咨询  | 微信公众号 |



