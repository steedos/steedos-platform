
<p align="center">
  <a href="https://www.steedos.com/cn">
    <img alt="华炎项目管理系统" src="https://steedos.github.io/assets/logo.png" width="120" />
  </a>
</p>
<h1 align="center">
  华炎项目管理系统
</h1>

<p align="center">
<a href="https://github.com/steedos/project-management-app/blob/master/README.md">English</a>
<a href="https://github.com/steedos/project-management-app/issues/"> · 报告错误</a>
<a href="https://github.com/steedos/project-management-app/discussions"> · 讨论</a>
</p>

<p align="center" style="border-top: solid 1px #cccccc">
  帮助您跟踪和管理项目，里程碑，任务，已阻止的任务，逾期任务，时间，费用预算，并具有详细的报表功能。系统使用华炎魔方平台可视化配置实现，基于元数据驱动，可以快速自定义。

</p>

<h3 align="center">
 🤖 🎨 🚀
</h3>

# 项目管理系统案例

![项目详细界面](https://steedos.github.io/assets/github/project_management_app/cn/project_detail.jpg)


## ✨系统功能

- **项目集**：集中管理所有项目，一个项目可能属于某个项目集，也可能不属于任何一个项目集，但任何一个项目集中都一定包含项目。在项目集里，能够直接看到所有项目运行的状态。

- **项目**：项目集里面所有的具体项目，能直观地预览每一个项目的运行状态，如果项目比较多，可以使用筛选功能快速查找。

- **里程碑**：里程碑通常在项目的计划阶段设置，并随着项目的进展而不断更新。它们是可视的参考点，可以将项目分解成可管理的、可控的阶段，以此创建有序的结点，来帮助项目经理和团队锚定项目。

- **项目任务**：项目任务管理需要同时管理多个项目任务派发、实时响应和进度更新；记录每个任务所需资源、预估工时和实际工时、关联文档及相关问题等；同时还能跟踪任务实时进度、状态，反映任务的变更历史。

- **用时**：一个项目从发生到结束的总时长，可以直接关联到具体的项目，对比实际用时与计划用时，分析原因。

- **费用**：几乎每一个项目都会产生相应的费用，可以直接关联到具体的任务，方便后期查询每一个项目的费用明细。

- **会议**：每一个项目都会有相应的会议，确定会议主题后，可以直接选择关联到某一个项目。

- **问题**：在新建问题时，由于在同一时段内可能会出现多个问题，所以新建问题时可以设置问题的优先级。

- **日志**：每一个项目在进行中或者结束后，都可以快速创建日志，以便有效地的把控每一个项目。

## 关于华炎魔方

华炎魔方是一套可视化建模、描述式编程的开发工具。设计目标是降低应用构建门槛，让每个人都能参与开发。系统内置了数据建模以及一系列自动化工具，包括验证规则、公式计算、工作流规则、自动化操作、批准过程、报表引擎等等。

- [华炎魔方概述](https://www-steedos-com.oss-accelerate.aliyuncs.com/videos/steedos/steedos-open-source.mp4)
- [华炎魔方文档](https://www.steedos.com/help/)

## 依赖包

- [MongoDB](https://www.mongodb.com/try/download/) version >= 3.4. MongoDB is a general purpose, document-based, distributed database built for modern application developers and for the cloud era.
- [Node.js](https://nodejs.org/en/download/) version >= 10.15.1 or above (which can be checked by running `node -v`). You can use [nvm](https://github.com/nvm-sh/nvm) for managing multiple Node versions on a single machine installed
- [Yarn](https://yarnpkg.com/en/) version >= 1.5 (which can be checked by running `yarn version`). Yarn is a performant package manager for JavaScript and replaces the `npm` client. It is not strictly necessary but highly encouraged.


## 项目目录

```sh
project-management-app
├── steedos-app/main/default
│   ├── applications
│   │   └── project.app.yml
│   └── objects
│       └── project__c
│           ├── buttons
│           │   └── print.button.yml
│           │   └── print.button.js
│           ├── fields
│           │   └── name.field.yml
│           │   └── description.field.yml
│           │   └── isDone.field.yml
│           │   └── status__c.field
│           │   └── ...
│           ├── listviews
│           │   └── all.listview.yml
│           │   └── recent.listview.yml
│           │   └── my.listview.yml
│           ├── permissions
│           │   └── user.permission.yml
│           │   └── admin.permission.yml
│           │   └── project_manager.permission.yml
│           └── project.object.yml
│           └──...
├── .env
├── .gitignore
├── package.json
├── README.md
├── server.js
├── steedos-config.yml
└── yarn.lock
```

##  基于元数据配置

元数据是华炎魔方的核心组件。华炎魔方支持几十种元数据类型，每种元数据用来定义一种业务功能，基于这些元数据，只需简单配置，就能开发功能完善的定制化应用。
例如本项目中的项目对象，该对象包含字段，列表视图，权限，验证规则等元数据。下面以项目对象，字段，列表视图，权限为例，了解如何基于元数据来配置。

以下为路径`/steedos-app/main/default/objects/project__c/project__c.object.yml`中的内容，它定义了一个名称为“项目”的自定义对象。

```yml
name: project__c
label: 项目
custom: true
enable_api: true
enable_audit: true
enable_chatter: false
enable_events: false
enable_files: true
enable_inline_edit: true
enable_instances: false
enable_notes: false
enable_search: true
enable_share: false
enable_tasks: false
enable_workflow: false
icon: performance
is_enable: true
```

以下为路径`/steedos-app/main/default/objects/project__c/fields`中的内容，表示在项目对象中创建了一个允许被搜索的客户字段。

```yml
fields
name: account__c 
label: 客户
type: text
searchable: true
sort_no: 115
```

以下为路径`/steedos-app/main/default/objects/project__c/listviews`中的内容，表示列表视图中属于项目管理员自己的项目。

```yml
name: my
label: 我的项目
type: grid
columns:
- field: project_manager__c     
  width: '150'
- field: status__c     
  width: '150'
  ...
filter_scope: mine 
scrolling_mode: standard 
shared: true
```

以下为路径`/steedos-app/main/default/objects/project__c/permissions`中的内容，表示项目管理员拥有的权限：不允许创建，允许删除编辑和查看，允许修改和查看全员的记录。您也可以根据根据自身需求进行配置。

```yml
allowCreate: false
allowDelete: true
allowEdit: true
allowRead: true
modifyAllRecords: true
viewAllRecords: true
```
其他元数据例如按钮，验证规则等，也是通过同样的的方式进行配置。除了通过以上的低代码方式，华炎魔方也支持可视化即零代码的方式进行配置元数据。

业务人员通过可视化配置的元数据与开发人员通过代码配置的元数据，可以通过华炎魔方DX工具进行双向同步，极大地提升了业务效率。



## 项目运行

项目源码依赖 nodejs 环境，使用 mongodb 数据库，需先部署相应的运行环境。

1、 启动数据库

2、安装依赖软件包

```
yarn
```

3、运行项目

```
yarn start
```

4、使用浏览器访问 http://127.0.0.1:5000/

第一次使用时，数据库为空，需注册一个账户，并选择创建一个企业。

## 保持联系

如果您有任何疑问或想与其他华炎魔方用户交谈，请[点击进入讨论](https://github.com/steedos/steedos-platform/discussions)或扫码添加以下联系方式与我们联系！
##### 开发人员微信群

 ![开发者微信交流群](https://steedos.github.io/assets/github/platform/cn/QR_wechat_developers.jpg)

#### 商务咨询

![商务咨询](https://steedos.github.io/assets/github/platform/cn/business_consulting.jpg)

#### 微信公众号

![微信公众号](https://www.steedos.com/assets/github/platform/cn/public_number.jpg)
 