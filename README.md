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

## 可视化设计微页面

基于[百度Amis](https://aisuda.bce.baidu.com/amis/zh-CN/components)，扩展开发面向业务模型的动态组件，并提供可视化设计工具，实现[华炎魔方微页面](https://www.steedos.cn/docs/amis/start)。参考：[Saleforce Lightning](https://developer.salesforce.com/docs/component-library/documentation/en/lwc)。

![微页面](https://console.steedos.cn/api/files/images/642166bd671028003e75f910)

## 可视化创建业务对象

实现[可视化建模](https://www.steedos.cn/docs/admin/object)，并开发配套的权限引擎、规则引擎、流程引擎、报表引擎，以及以上相关的可视化设计工具。参考：[Salesforce Object](https://developer.salesforce.com/docs/atlas.en-us.object_reference.meta/object_reference/sforce_api_objects_concepts.htm)。

![对象管理](https://console.steedos.cn/api/files/images/64216644671028003e75f90e)

## VS Code 插件

实现 [Steedos VSCode 插件](https://www.steedos.cn/docs/developer/sync-metadata)，可视化工具设计的元数据可以和代码双向同步。参考：[Salesforce DX](https://developer.salesforce.com/developer-centers/developer-experience)。

![Steedos VSCode 插件](https://console.steedos.cn/api/files/images/6421667e671028003e75f90f)

## 软件包管理

元数据以及自定义的代码组合成为 [Steedos 软件包](https://www.steedos.cn/docs/developer/package)。支持软件包的版本管理、发布、安装、个性化定制、版本升级、多包开发，并与现有 DevOps 方案融合。参考：[Salesforce Package](https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/sfdx_dev_unlocked_pkg_whats_a_package.htm)。

![Steedos Packages Overview](./docs/diagrams/Steedos%20Metadata.drawio.svg)

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

## 访问华炎魔方

打开浏览器，访问 http://127.0.0.1:5000，进入华炎魔方。

进入设置应用，可以：
- 创建自定义对象
- 创建应用
- 创建微页面

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
- [试用解决方案(SaaS版）](https://demo.steedos.cn/)

## 为华炎魔方做贡献

从上报BUG到提出改善建议，每一个贡献都非常欢迎。如果您打算动手修改代码来修正BUG或实现某个新功能，请先创建一个 [ISSUE](https://github.com/steedos/steedos-platform/issues)。


如果您有任何疑问或想与其他华炎魔方用户交谈，请扫码添加以下联系方式与我们联系。

| ![开发者微信交流群](https://steedos.github.io/assets/github/platform/cn/QR_wechat_developers.jpg) | ![商务咨询](https://steedos.github.io/assets/github/platform/cn/business_consulting.jpg)        | ![微信公众号](https://steedos.github.io/assets/github/platform/cn/public_number.jpg)|
| :-----: | :-----: | :-----: |
| 开发人员微信群  | 商务咨询  | 微信公众号 |



