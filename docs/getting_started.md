---
title: 安装
---

使用Steedos“低代码”开发平台，开发人员使用少量代码就可以构建功能强大的企业应用程序。

> [视频演示：华炎“低代码”开发平台应用案例之 合同管理系统](https://www-steedos-com.oss-cn-beijing.aliyuncs.com/videos/creator/contracts-demo.mp4)

## 安装开发环境

Steedos项目基于NodeJS开发，默认使用MongoDB数据库。您可以在 Windows、Mac 或 Linux 环境中创建、开发和运行Steedos项目。

### 安装NodeJS 
请安装与操作系统对应的 [NodeJS v10.0 或以上版本](https://nodejs.org/en/) 。

### 安装数据库服务器 
请安装 [MongoDB Community Server v3.4 或以上版本](https://www.mongodb.com/download-center/community)，安装完成之后，请启动mongodb服务。

### 安装版本管理工具 
请安装 [Github Desktop](https://desktop.github.com/)，用于管理项目源码。如果您还没有Github账户，建议您先注册一个。

### 安装源码编辑工具 
请安装 [Visual Studio Code](https://code.visualstudio.com/)。并安装 Steedos 集成插件[redhat.vscode-yaml](https://marketplace.visualstudio.com/items?itemName=redhat.vscode-yaml)，您在编写配置文件时如果有语法错误，Visual Studio Code 会自动提示。

### 安装 yarn 包管理工具
yarn 是 Facebook 开发的 Nodejs 包管理工具（替代npm），可以更快速更稳定的为项目安装依赖包。
```bash
npm i yarn -g
```

### 安装 steedos 客户端工具
steedos客户端工具用于创建和运行项目，还可以从现有数据库自动导入初始业务对象。
```bash
yarn global add steedos-cli
```

## 创建项目 

### 创建空项目
```bash
steedos create my-app
```

### 安装依赖包
```bash
cd my-app
yarn
```

### 文件夹结构
项目创建后，您的项目文件夹内容如下：
```bash
my-app/
  README.md
  node_modules/
  package.json
  src/
    accounts.object.yml
    contacts.object.yml
    crm.app.yml
  server.js
  steedos-config.yml
```

### 系统配置文件 
文件 steedos-config.yml 用于配置Steedos系统参数，包括：
- 数据库连接方式；
- 附件存储位置；
- 服务端口和访问地址。

> 配置文件默认使用本机安装的MongoDB数据库，需要先安装并启动 [MongoDB Community Server v3.4 或以上版本](https://www.mongodb.com/download-center/community)。


### 配置业务对象
系统内置了两个 [业务对象](object.md) 描述文件，例如 src/accounts.object.yml ，您可以尝试修改 。

```yaml
name: accounts
label: 单位
icon: account
enable_files: true
enable_search: true
enable_tasks: true
enable_notes: false
enable_api: true
enable_share: true
enable_chatter: true
fields:
  name:
    label: 名称
    type: text
    defaultValue: ''
    description: ''
    inlineHelpText: ''
    searchable: true
    required: true
    sortable: true
  credit_code:
    type: text
    label: 统一社会信用代码
    inlineHelpText: '系统按照此字段校验重复，避免重复录入单位信息。'
    required: true
  owner:
    label: 责任人
    omit: false
    readonly: false
    hidden: false
    type: lookup
    reference_to: users
  priority:
    label: 优先级
    type: select
    sortable: true
    options:
      - label: 高
        value: high
      - label: 中
        value: normal
      - label: 低
        value: low
    filterable: true
  registered_capital:
    type: currency
    label: 注册资金
    scale: 2
  website:
    type: url
    label: 网址
  phone:
    type: text
    label: 电话
    defaultValue: ''
  email:
    type: text
    label: 邮箱
  description:
    label: 备注
    type: textarea
    is_wide: true
    name: description
list_views:
  all:
    label: 所有单位
    columns:
      - name
      - priority
      - owner
      - modified
    filter_scope: space
  recent:
    label: 最近查看
    columns:
      - name
      - priority
      - owner
      - modified
    filter_scope: space
  mine:
    label: 我的单位
    columns:
      - name
      - priority
      - owner
      - modified
    filter_scope: mine
permission_set:
  user:
    allowCreate: false
    allowDelete: false
    allowEdit: false
    allowRead: true
    modifyAllRecords: false
    viewAllRecords: false
  admin:
    allowCreate: true
    allowDelete: true
    allowEdit: true
    allowRead: true
    modifyAllRecords: true
    viewAllRecords: true
```

### 配置应用
系统内置了一个 [应用](app.md) 描述文件 src/crm.app.yml ，您可以尝试修改此文件。
```yaml
_id: crm
name: 客户
description: 管理客户，以及相关的联系人、任务和日程。
icon_slds: folder
is_creator: true
objects:
  - accounts
  - contacts
  - tasks
  - events  
  - reports
```

## 调试与运行

### 调试项目
执行以下命令，进入调试模式。调试模式下，修改任何配置文件会自动重新启动服务，开发人员只需要刷新浏览器就能看到修改后的结果。
```bash
yarn debug
```

### 运行项目
```bash
yarn start
```

### 使用浏览器访问
使用浏览器访问地址 [http://127.0.0.1:5000/](http://127.0.0.1:5000/) ，即可访问用户界面。
第一次使用时，数据库为空。点击“企业注册”，可以在本地数据库中创建一家新的企业账户。
![界面展示](assets/mac_ipad_iphone_list.png)


## 示例项目
你也可以下载并运行我们的示例项目。这些示例项目预定义了许多业务对象，可以作为学习参考。
- [合同管理](https://github.com/steedos/steedos-contracts-app)
- [档案管理](https://github.com/steedos/steedos-records-app)
- [会议管理](https://github.com/steedos/steedos-meeting-app)
