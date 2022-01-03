

<p align="center">
  <a href="https://www.steedos.com/cn">
    <img alt="Steedos" src="https://steedos.github.io/assets/logo.png" width="80" />
  </a>
</p>
<h1 align="center">
  华炎魔方
</h1>

<p align="center">
<a href="./README_en.md">English</a>
<a href="https://www.steedos.com/docs/"> · 文档</a>
<a href="https://github.com/steedos/steedos-platform/issues/"> · 报告错误</a>
<a href="https://community.steedos.cn"> · 社区</a>
</p>

<p align="center" style="border-top: solid 1px #cccccc">
  华炎魔方是Salesforce低代码平台的开源替代方案，助力企业使用“低代码”技术，快速构建管理软件后端，包括数据建模、权限控制、流程审批、统计分析、应用集成，并可以编写“高代码”实现高级业务逻辑。
</p>

<h3 align="center">
 🤖 🎨 🚀
</h3>

![华炎魔方项目对象界面](https://steedos.github.io/assets/github/platform/cn/project_object.jpg)

## 点击鼠标，就能编程

使用传统的命令式编程语言开发企业应用程序极其复杂，需要使用精确的指令控制计算机执行的每一步操作。使用描述式编程工具，您只需告诉计算机想要的结果，计算机会按照您的需求自动完成编程，生成你想要的应用程序。

华炎魔方就是这样一套可视化建模，描述式编程的企业应用程序开发平台。华炎魔方把开发难度降低到Excel公式级别，只需简单的点击鼠标，几乎任何人都可以创建功能强大的企业应用程序，实现业务流程自动化。您为企业创建的应用程序可以部署在移动，平板电脑和Web上，您创建的应用程序可以很简单，也可以非常复杂，并且可以连接到几乎任何数据源。

## 基于元数据

元数据是华炎魔方技术架构的核心。华炎魔方使用元数据定义对象，字段，配置，代码，逻辑和页面布局，并基于这些元数据自动生成系统的数据结构以及Steedos应用程序的用户界面和自动化逻辑。

元数据可以在可视化界面中进行修改，也可以使用VS Code插件同步到代码，实现版本管理，并进一步编写代码、调试、测试、打包、部署。[点击了解华炎魔方元数据类型](https://www.steedos.cn/docs/developer/meta-types)

![Steedos Overview](http://www.steedos.org/assets/platform/platform-overview.png)

## 快速向导

### 启动远程开发环境

无论是使用华炎魔方作为开发工具来开发项目，还是调式运行华炎魔方平台源码，都需要安装开发环境，我们推荐使用 [Gitpod](https://gitpod.io/) 来启动远程开发环境，以免去本地安装开发环境的繁琐过程。

远程开发环境已经安装并初始化好必须的组件，包括 nodejs, mongodb, redis, vscode 等，详情请参考教程 [启动远程开发环境](https://beta.steedos.cn/docs/developer/gitpod)。

### 创建一个新项目

如需开发自己的软件包，建议输入以下命令，创建一个新项目。

```shell
npx create-steedos-app my-app 
```

## 华炎魔方功能

- **可视化建模**：华炎魔方基于元数据驱动，把传统通过代码实现的业务需求抽象为可配置的元数据 ，只需点击⿏标修改配置项，就能实现绝⼤多数业务需求，必要时仍可编写代码，请参阅教程 [如何创建自定义应用程序？](https://www.steedos.cn/docs/admin/create_object) 了解如果在界面上配置元数据。
- **定义用户界面**：使用华炎魔方，你可以快速构建列表视图、页面布局、报表、仪表盘，真正实现界面自定义，请参阅教程 [如何创建自定义应用程序？](https://www.steedos.cn/docs/admin/create_object) 了解如果在界面上定义用户界面。
- [配置验证规则](https://steedos.cn/docs/admin/auto_process#%E5%AF%B9%E8%B1%A1%E9%AA%8C%E8%AF%81%E8%A7%84%E5%88%99)：在华炎魔⽅中，⽤户可以为每⼀个对象创建验证规则。验证规则主要⽤于验证该对象的数据是否符合特定的规则。当⽤户对于对象的某个字段的更改不符合⽤户创建的验证规则时，华炎魔⽅会拒绝保存⽤户的输⼊。
- [公式引擎](https://steedos.cn/docs/admin/field_type#%E9%80%9A%E8%BF%87%E5%85%AC%E5%BC%8F%E8%AE%A1%E7%AE%97%E5%AD%97%E6%AE%B5%E5%80%BC)：华炎魔方内置了与Excel同级别的公式引擎，可通过配置公式实现自动化条件判断、数据计算、引用关联表的数据，或是汇总子表中的相关数据。
- [工作流规则](https://steedos.cn/docs/admin/auto_process#%E5%B7%A5%E4%BD%9C%E6%B5%81%E8%A7%84%E5%88%99)：通过设定工作流规则，记录在满⾜指定条件时，华炎魔方将会执⾏规则的⾃动化操作，让业务在无人值守的情况下自动运转，驱动效率提升。
- [自动化操作](https://steedos.cn/docs/admin/auto_process#%E5%B7%A5%E4%BD%9C%E6%B5%81%E6%93%8D%E4%BD%9C)：通过设定自动化操作，可以在特定条件下自动化创建和更新记录、发送邮件、短信或系统内通知，也可以自动调用第三方系统的接口。
- [批准过程](https://steedos.cn/docs/admin/auto_process#%E6%89%B9%E5%87%86%E8%BF%87%E7%A8%8B)：系统内置了流程设计、流程运行、管理维护、统计分析与流程优化等各类工具，帮助企业快速部署、有效监控并持续优化业务审批过程。  
- [权限引擎](https://www.steedos.cn/docs/admin/permission_set)：华炎魔方通过给每个用户配置“简档”和“权限集”的方式来标识用户所属权限范围；通过华炎魔方权限引擎，可以给每个用户分配不同的查看、创建、编辑、删除每个对象记录的对象级权限；可以给每个用户分配不同的字段级权限，让某些用户只能查看或编辑对象上的特定字段；可以给每个用户分配不同的记录级权限，限制某些特定范围内的记录只允许部分特定用户才能访问；还可以按分部来划分权限，限制某些用户只能查看或编辑其被授权的分部下的对象记录。详细请参阅文档 [管理数据访问权限](https://beta.steedos.cn/docs/admin/permission_set)。
- [报表引擎](https://steedos.cn/docs/admin/record_report)：使用华炎魔方的可视华报表工具，您可以快速配置统计图表，包括数据列表、分组报表、数据透视图、柱状图、饼图等，方便查看、分析和决策。华炎魔方全新推出 [仪表盘](https://www.steedos.cn/docs/developer/dashboard)、[Stimulsoft报表](https://www.steedos.cn/docs/developer/stimulsoft) 和 [JsReport报表](https://www.steedos.cn/docs/developer/jsreport)，可以满足各种报表需求场景。
- **高级业务逻辑开发**：华炎魔方提供了代码开发的入口，开发人员通过编写代码，实现特定条件下的自动运行、截停、回滚等高级业务逻辑。或是开发与第三方系统的接口。
- **开源、可定制**：华炎魔方是开源的。这会让您充满信心，华炎魔方将永远存在。您还可以将其源码Fork下来，并根据需要进行更改。

## 华炎魔方软件包

软件包是一个容器，可以只存放一个组件，也可以存放一组功能相关的应用程序。创建软件包后，您可以将其分发给其他使用华炎魔方的用户和组织，包括公司外部的用户和组织。
我们下一步将推出华炎魔方应用市场，您可以将您开发的软件包发布到应用市场中定价销售。

## 华炎魔方DX

华炎魔方DX是我们即将发布的一套敏捷开发工具，包含一组 Visual Studio Code 插件，你可以在熟悉的环境中开发、调试、打包、发布华炎魔方软件包。您在可视化界面上定义的元数据可以导出为配置文件，您可以进一步编写代码，实现高级业务逻辑功能。您可以定义数据导入文件，并轻松指定开发，测试和生产环境的版本，功能和配置参数。您可以充分利用Git提供的版本管理与协作功能管理您的的代码、元数据和配置参数。

华炎魔方DX工具按开发者收费，我们为开源项目和教育机构免费提供华炎魔方DX工具。

## 技术架构

华炎魔方服务端使用nodejs开发，您定义的元数据，和系统中录入的业务数据均保存在mongodb中。

- [MongoDB](https://www.mongodb.com/try/download/) version >= 4.2. MongoDB is a general purpose, document-based, distributed database built for modern application developers.
- [Node.js](https://nodejs.org/en/download/) version >= 10.15.1 or above (which can be checked by running `node -v`). You can use [nvm](https://github.com/nvm-sh/nvm) for managing multiple Node versions on a single machine installed.

## 学习华炎魔方

您还可以根据华炎魔方快速构建应用程序的视频教程进行操作。

- [视频演示](https://www.steedos.com/videos/)
- [使用入门](https://www.steedos.com/docs/user)
- [设置和维护华炎魔方](https://steedos.com/docs/admin)
- [开发人员](https://www.steedos.com/developer/)

停止项目服务后，platform平台中的项目对象会自动下线。

## 为华炎魔方做贡献

从上报BUG到提出改善建议，每一个贡献都值得赞赏和欢迎。如果您打算动手修改代码来修正BUG或实现某个新功能，请先创建一个 [ISSUE](https://github.com/steedos/steedos-platform/issues)，这样我们可以确保您的工作没有白费。

请可以参阅 [开发指南](/CONTRIBUTING.md) 来了解如何运行和编译我们的平台源代码。

## Licence

华炎魔方开源版基于MIT协议，内置华炎魔方十大引擎，完全免费。基于华炎魔方开发的软件包，可以单独定价销售。

## 保持联系

如果您有任何疑问或想与其他华炎魔方用户交谈，请[点击进入讨论](https://github.com/steedos/steedos-platform/discussions)或扫码添加以下联系方式与我们联系。

| ![开发者微信交流群](https://steedos.github.io/assets/github/platform/cn/QR_wechat_developers.jpg) | ![商务咨询](https://steedos.github.io/assets/github/platform/cn/business_consulting.jpg)        | ![微信公众号](https://steedos.github.io/assets/github/platform/cn/public_number.jpg)|
| :-----: | :-----: | :-----: |
| 开发人员微信群  | 商务咨询  | 微信公众号 |


