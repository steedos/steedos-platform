<p align="center">
  <a href="https://www.steedos.cn/">
    <img alt="Steedos" src="https://steedos.github.io/assets/logo.png" width="80" />
  </a>
</p>
<h1 align="center">
  Steedos低代码PaaS平台
</h1>

<p align="center">
<a href="./README_en.md">English</a>
<a href="https://docs.steedos.com/"> · 文档</a>
</p>


<p align="center" style="border-top: solid 1px #cccccc">
  Steedos低代码PaaS平台是一款全新的企业级应用开发平台，它可以帮助企业快速构建和部署自定义的企业级应用程序，无需编写繁琐的代码。
</p>

<h3 align="center">
 🤖 🎨 🚀
</h3>

# Salesforce 开源替代方案

Steedos 低代码PaaS平台是一款功能强大、易于使用、可扩展、安全可靠的企业级应用开发平台，可以帮助企业快速构建和部署自定义的企业级应用程序，提高企业的生产效率和竞争力。

- 可视化开发：使用简单易懂的拖放式界面，用户可以快速创建自定义的企业级应用程序。
- 自定义数据模型：用户可以根据自己的业务需求创建自定义的数据模型，以便更好地管理和分析数据。
- 工作流引擎：内置强大的工作流引擎，可以帮助用户快速实现业务流程自动化。
- 安全和权限控制：平台提供了完善的安全和权限控制机制，可以确保企业数据的安全性和隐私性。

## 可视化设计微页面

基于[百度Amis](https://aisuda.bce.baidu.com/amis/zh-CN/components)，扩展开发面向业务模型的动态组件，并提供可视化设计工具，实现[华炎魔方微页面](https://www.steedos.cn/docs/amis/start)。参考：[Saleforce Lightning](https://developer.salesforce.com/docs/component-library/documentation/en/lwc)。

![微页面](https://console.steedos.cn/api/files/images/642166bd671028003e75f910)

## 可视化创建业务对象

实现[可视化建模](https://www.steedos.cn/docs/admin/object)，并开发配套的权限引擎、规则引擎、流程引擎、报表引擎，以及以上相关的可视化设计工具。参考：[Salesforce Object](https://developer.salesforce.com/docs/atlas.en-us.object_reference.meta/object_reference/sforce_api_objects_concepts.htm)。

![对象管理](https://console.steedos.cn/api/files/images/64216644671028003e75f90e)

## 安全和权限控制

平台提供了完善的安全和权限控制机制，可以确保企业数据的安全性和隐私性。

![Steedos Permissions Overview](./docs/diagrams/Steedos%20Permissions.drawio.svg)

## VS Code 插件

实现 [Steedos VSCode 插件](https://www.steedos.cn/docs/developer/sync-metadata)，可视化工具设计的元数据可以和代码双向同步。参考：[Salesforce DX](https://developer.salesforce.com/developer-centers/developer-experience)。

![Steedos VSCode 插件](https://console.steedos.cn/api/files/images/6421667e671028003e75f90f)


# 快速向导

本项目仓库为平台源码，我们会定期发布版本，在项目中直接引用即可。

## 开发软件包

使用华炎魔方开发企业应用，建议克隆华炎魔方模版项目。

- [克隆项目模版@github.com](github.com/steedos/steedos-project-template)
- [克隆项目模版@gitlab.steedos.cn](gitlab.steedos.cn/steedos/steedos-project-template)
- [create-steedos-app]( ./create-steedos-app)
- [Gitpod 远程开发环境](./devops.mdx)

## 调试平台源码

调试平台源码需要安装nodejs，mongodb，redis，建议使用 docker 启动远程开发环境。

### 使用 docker 启动数据库

华炎魔方运行依赖 mongodb 和 redis，需先在本地安装运行相关服务。

```bash
docker-compose -f docker-compose-db.yml up
```

### 使用本地 nodejs 调试平台源码

运行华炎魔方需要在本地安装 nodejs 14 和 python 等编译环境，如果本地有环境，可以本地启动华炎魔方。

```bash
yarn
yarn build
yarn start
```

## 使用 VSCode Server 远程调试平台源码

可以在服务器上部署远程开发环境，实现远程开发。

```bash
docker-compose -f docker-compose-vscode.yml up
```

打开浏览器，访问 http://127.0.0.1:5555/?folder=/home/workspace/steedos-project-template ，进入VS Code远程开发环境。

此时可以在浏览器中操作 VS Code，运行华炎魔方。


## 技术框架

华炎魔方服务端使用nodejs开发，您定义的元数据，和系统中录入的业务数据均保存在mongodb中。

![Steedos Packages Overview](./docs/diagrams/Steedos%20Packages.drawio.svg)

- [MongoDB](https://www.mongodb.com/try/download/) 版本 = 4.4， 华炎魔方使用 MongoDB 作为元数据仓库和默认数据源.
- [Node.js](https://nodejs.org/en/download/) 版本 = 14。华炎魔方平台源码运行于 nodejs 环境。
- [Meteor](https://www.meteor.com): 基于 Meteor 开发环境魔方元数据解释引擎(steedos-server)。
- [Moleculer](https://moleculer.services/zh/): 基于 Node.js 的响应式微服务框架。
- [Amis](https://aisuda.bce.baidu.com/amis/zh-CN/components): 百度 Amis 前端低代码框架。

## 为华炎魔方做贡献

从上报BUG到提出改善建议，每一个贡献都非常欢迎。如果您打算动手修改代码来修正BUG或实现某个新功能，请先创建一个 [ISSUE](https://github.com/steedos/steedos-platform/issues)。


如果您有任何疑问或想与其他华炎魔方用户交谈，请扫码添加以下联系方式与我们联系。

| ![开发者微信交流群](https://steedos.github.io/assets/github/platform/cn/QR_wechat_developers.jpg) | ![商务咨询](https://steedos.github.io/assets/github/platform/cn/business_consulting.jpg)        | ![微信公众号](https://steedos.github.io/assets/github/platform/cn/public_number.jpg)|
| :-----: | :-----: | :-----: |
| 开发人员微信群  | 商务咨询  | 微信公众号 |



