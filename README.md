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
<a href="https://low-code-protocol.com"> · 低代码协议</a>
<a href="https://www.steedos.cn/docs/"> · Steedos 文档</a>
<a href="https://www.steedos.cn/docs/deploy/devops"> · 快速开始</a>
<a href="https://community.steedos.cn"> · 社区</a>
</p>

<p align="center" style="border-top: solid 1px #cccccc">
  华炎魔方是 <a href="https://developer.salesforce.com/developer-centers/developer-experience" target="_blank">Salesforce Developer Experience (DX)</a> 的开源替代方案，遵循<a href="https://low-code-protocol.com">低代码协议</a>，将低代码技术与 <a href="https://www.steedos.cn/docs/deploy/devops"> DevOps 工具</a> 结合，实现敏捷开发的新高度。
</p>

<h3 align="center">
 🤖 🎨 🚀
</h3>


![华炎魔方项目对象界面](https://steedos.github.io/assets/github/platform/cn/project_object.jpg)

## 基于元数据

元数据是华炎魔方技术架构的核心。华炎魔方使用元数据定义对象，字段，配置，代码，逻辑和页面布局，并基于这些元数据自动生成系统的数据结构以及Steedos应用程序的用户界面和自动化逻辑。

![Steedos Packages Overview](./docs/diagrams/Steedos%20Metadata.drawio.svg)

[点击了解华炎魔方元数据类型](https://www.steedos.cn/docs/developer/meta-types)

## 企业级权限控制

华炎魔方定义了基于角色（简档/权限集）的权限控制体系，通过多种配置和编程入口，满足企业级软件对权限控制的各种需求。

![Steedos Permissions Overview](./docs/diagrams/Steedos%20Permissions.drawio.svg)

## 软件包

元数据可以在可视化界面中进行修改，也可以使用Steeods VS Code插件同步为软件包，实现版本管理，并进一步编写代码、调试、测试、打包、部署。

![Steedos Packages Overview](./docs/diagrams/Steedos%20Packages.drawio.svg)

## 云原生部署

基于华炎魔方开发的软件包，可以集中部署在一个Nodejs服务中，也可以基于容器技术，分布式部署在Kubernetes集群中。两种部署方式均基于事件驱动架构，可实现基于微服务的事件的发布与订阅。

![Kubernetes Deploy](./docs/diagrams/Kubernetes%20Deploy.drawio.svg)

## 快速向导

### 部署华炎魔方平台

部署华炎魔方平台后，可以下载、安装和运行华炎魔方软件包，可以使用低代码可视化设计工具创建自定义应用程序。如需同步和编写代码，请参考后续步骤部署开发环境。

- [开通华炎魔方云服务](https://www.steedos.cn/docs/deploy/deploy-cloud)
- [Docker 私有部署](https://www.steedos.cn/docs/deploy/deploy-docker)
- [版本升级](https://www.steedos.cn/docs/deploy/upgrade)

### Gitpod 部署远程开发环境

无论是使用华炎魔方作为开发工具来开发项目，还是调试运行华炎魔方平台源码，都需要安装开发环境，我们推荐使用 [Gitpod](https://gitpod.io/) 来启动远程开发环境，以免去本地安装开发环境的繁琐过程。

远程开发环境已经安装并初始化好必须的组件，包括 nodejs, mongodb, redis, vscode 等，详情请参考教程 [启动远程开发环境](https://www.steedos.cn/docs/developer/gitpod)。

我们为企业客户提供 Gitpod 中国区域云服务，了解更多请[联系我们](https://www.steedos.cn/company/contact-us)。

### 运行模板项目

访问网址 <https://gitpod.io/#https://github.com/steedos/steedos-project-template> 即可在线开发调试 [华炎魔方模板项目](https://github.com/steedos/steedos-project-template)，可以把#号后面的Git仓库地址换成您希望运行的任何华炎魔方项目的Git仓库地址。

### 创建新项目

您可以 Fork [华炎魔方模板项目](https://github.com/steedos/steedos-project-template) 作为自己创建的新项目，也可以在本地命令行窗口执行以下命令来创建一个华炎魔方模板项目。

```shell
npx create-steedos-app my-app 
```

只要把新项目的Git仓库地址追加到网址 `https://gitpod.io/#` 后面，用浏览器访问该地址就可以启动远程开发环境来开发项目了。

### 修改平台源码

访问网址 <https://gitpod.io/#https://github.com/steedos/steedos-platform> 即可在线开发调试 [华炎魔方平台源码](https://github.com/steedos/steedos-platform)。

如果需要提交代码到Git仓库，请先Fork [华炎魔方平台源码](https://github.com/steedos/steedos-platform)，然后用 Fork 后的Git仓库地址替换掉上面网址`#`号后的Git仓库地址即可。


## 华炎魔方（开源社区版）功能

华炎魔方开源社区版基于MIT协议，包含开发工具的所有必备功能，不限制用户数。基于华炎魔方开发的软件包可以任意销售而无需支付授权费用。

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

## 华炎魔方（企业版）功能

华炎魔方（企业版）实现可更多企业级安全控制功能，并与相关第三方开源项目集成，满足企业客户的高级需求。了解更多请[联系我们](https://www.steedos.cn/company/contact-us)。
![image](https://user-images.githubusercontent.com/50353452/152734598-fde6f7a3-191c-41d0-851d-698cfb39a22e.png)

- 高级权限控制: 配置共享规则和限制规则实现权限在特定条件下的共享和的收缩；分部级权限；通过编写 beforeFind 触发器控制权限。
- 审计日志：为对象启用审计日志，每一条记录的增删改均会自动记录日志；系统登录日志；系统操作日志。
- [Node Red](https://www.steedos.cn/docs/developer/node-red): 基于 Node Red，可视化开发华炎魔方与第三方业务系统的集成接口。
- [App Smith](https://www.appsmith.com/): 使用 App Smith，开发华炎魔方前端自定义页面。
- [Stimulsoft Reports](https://www.steedos.cn/docs/admin/stimulsoft): 调用华炎魔方中的查询，可视化开发像素级打印报表与仪表盘。
- [Gitpod](https://gitpod.io/): 点击鼠标就能远程创建华炎魔方开发环境，支持中国区域私有部署。
- [Gitlab](https://about.gitlab.com/): 为华炎魔方软件包实现 Devops 开发生命周期管理，支持中国区域私有部署。

## 技术框架

### 服务端

华炎魔方服务端使用nodejs开发，您定义的元数据，和系统中录入的业务数据均保存在mongodb中。

- [MongoDB](https://www.mongodb.com/try/download/) 版本 >= 4.2， 华炎魔方使用 MongoDB 作为元数据仓库和默认数据源.
- [Node.js](https://nodejs.org/en/download/) 版本 >= 12。华炎魔方平台源码运行于 nodejs 环境。
- [Meteor](https://www.meteor.com): 基于 Meteor 开发环境魔方元数据解释引擎(steedos-server)。
- [Moleculer](https://moleculer.services/zh/): 基于 Node.js 的响应式微服务框架。
- [GraphQL](https://graphql.org/): 华炎魔方自动为业务对象生成 GraphQL API。
- [Lerna](https://github.com/lerna/lerna): 多包管理工具，用于管理和批量发布 npm 软件包。

### 前端

华炎魔方前端使用 React 开发表单、列表视图控件，并基于 Meteor 实现完整界面。

- [Ant Design ProForm](https://procomponents.ant.design/components/form): 基于 ProForm 开发表单控件，根据自定义对象动态创建表单、操作业务数据。
- [Salesforce Lightning Design System](https://www.lightningdesignsystem.com/): Salesforce 开源的企业软件设计标准和样式库。[React 控件库](https://react.lightningdesignsystem.com/)
- [Tailwind CSS](https://tailwindcss.com/): 直接用class表述样式，而无需编写和维护css文件。
- [AG Grid](https://www.ag-grid.com/): 因为ProTable功能太弱，我们选择 AG Grid 构建列表视图控件。
- [Redash](https://github.com/getredash/redash): 引入Redash部分前端源码，开发查询设计器、图表设计器、仪表盘设计器。
- [Mobx React Lite](https://github.com/mobxjs/mobx-react-lite)：基于Mobx React Lite实现华炎魔方的React Store。

## 源码目录索引

- [Docs/Diagrams](./docs/diagrams): 华炎魔方设计文档。
- [Steedos Server](./creator): 华炎魔方最终打包运行的是一个Meteor项目，其源码都在该文件夹内。
  - [Meteor功能包](./creator/packages): 这里每个文件夹都是华炎魔方Meteor项目依赖的各种功能包。
- [Steedos Server Build](./server): Creator项目源码最终打包编译生成的文件都在该文件夹内，最终会发布为 NPM 包在华炎魔方项目中引用即可。
- [NPM Packages](./packages): 华炎魔方各种内核功能包，其内每个子文件夹都是一个标准的NPM包。
  - [Standard Objects](./packages/standard-objects): 内核标准对象的定义文件。
- [Moleculer Services](./services): 华炎魔方采用的是Moleculer微服务架构，这里存放的是各种微服务功能包，其内每个子文件夹都是一个标准的NPM包。
- [社区版项目模板](./steedos-projects/project-community): 用于在源码中运行社区版项目调试华炎魔方源码，通过`steedos cli`命令行创建魔方项目时自动生成的并不是这个模板项目，而是一个单独的 [华炎魔方模板项目](https://github.com/steedos/steedos-project-template)。
- [企业版项目模板](./steedos-projects/project-enterprise): 用于在源码中运行企业版项目调试华炎魔方源码。

## NPM Scripts说明

本项目主要提供以下可执行的脚本命令：

- start: 执行 `start:community` 启动位于目录 [steedos-projects/project-community](./steedos-projects/project-community) 的社区版华炎魔方模板项目。
- start:community: 启动位于目录 [steedos-projects/project-community](./steedos-projects/project-community) 的社区版华炎魔方模板项目，调试位于目录 [packages](./packages) 和 [services](./services) 的华炎魔方源码。
- start:enterprise: 启动位于 [steedos-projects/project-enterprise](./steedos-projects/project-enterprise) 的企业版华炎魔方模板项目，调试位于目录 [packages](./packages) 和 [services](./services) 的华炎魔方源码。
- bootstrap: 执行 [lerna bootstrap](https://github.com/lerna/lerna/tree/main/commands/bootstrap#readme) 根据源码中各个NPM包中配置的依赖包建立它们之前的引用关系。
- build: 执行 `lerna run prepare` 根据源码中各个NPM包之前的依赖关系依次执行各个NPM包内  `prepare` 指令打包所有需要打包的NPM包。
- ver: 执行 [lerna version](https://github.com/lerna/lerna/tree/main/commands/version) 在发版本前把源码中所有需要发包的NPM包的版本号统一升级到下一个指定版本。
- pub: 执行 [lerna publish](https://github.com/lerna/lerna/tree/main/commands/publish) 把源码中所有需要发包的NPM包发布正式版到 [NPM仓库](https://www.npmjs.com/) 中。
- pub_next: 执行 [lerna publish](https://github.com/lerna/lerna/tree/main/commands/publish) 把源码中所有需要发包的NPM包发布测试版到 [NPM仓库](https://www.npmjs.com/) 中。

脚本具体内容请查阅 [package.json](./package.json) 文件中的 scripts 属性。

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

## 平台源码修改

本项目源码在 https://gitlab.steedos.cn/steedos/steedos-platform 中开发，定期同步到Github。

## 保持联系

如果您有任何疑问或想与其他华炎魔方用户交谈，请[点击进入讨论](https://github.com/steedos/steedos-platform/discussions)或扫码添加以下联系方式与我们联系。

| ![开发者微信交流群](https://steedos.github.io/assets/github/platform/cn/QR_wechat_developers.jpg) | ![商务咨询](https://steedos.github.io/assets/github/platform/cn/business_consulting.jpg)        | ![微信公众号](https://steedos.github.io/assets/github/platform/cn/public_number.jpg)|
| :-----: | :-----: | :-----: |
| 开发人员微信群  | 商务咨询  | 微信公众号 |


