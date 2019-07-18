---
title: 快速向导
---

使用Steedos“低代码”开发平台，开发人员使用少量代码就可以构建企业级应用程序。

> 点击这里查看视频演示[使用低代码平台开发合同管理系统](https://www-steedos-com.oss-cn-beijing.aliyuncs.com/videos/creator/contracts-demo.mp4)

Steedos项目使用nodejs语言开发，默认使用MongoDB数据库。您可以在 Windows、Mac 或 Linux 环境中创建、开发和运行Steedos项目。

### 安装运行环境
- 安装NodeJS [NodeJS v10.0.0 或以上版本.](https://nodejs.org/en/)
- 安装数据库服务器 [MongoDB Community Server v3.4 或以上版本](https://www.mongodb.com/download-center/community)
- 安装版本管理工具 [Github Desktop](https://desktop.github.com/)
- 安装源码编辑工具 [Visual Studio Code](https://code.visualstudio.com/)

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
```bash
steedos create my-app
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
  server.js
  steedos-config.yml
```

### 系统配置文件 
文件 steedos-config.yml ，配置系统参数：
- 数据库连接方式；
- 附件存储位置；
- 服务端口和访问地址。

### 定义一个业务对象
创建一个对象描述文件 src/accounts.object.yml 。

```yaml
name: accounts
label: 单位
description: 统一保存客户、合作伙伴、供应商数据
fields:
  name: 
    type: String
    label: 标题 
  priority:
    type: String
    label: 优先级
    options:
      - label: 高
        value: high
      - label: 中
        value: normal
      - label: 低
        value: low
  owner:
    label: 所有人
    type: lookup
    reference_to: users
list_views:
  recent:
    label: 最近查看
  all:
    label: 所有单位
    columns:
      - name
      - priority
      - owner
      - modified
    filter_fields:
      - priority
  high_priority:
    label: 重点关注
    filters: ["priority", "=", "high"]
permission_set:
  user:
    allowCreate: true
    allowDelete: true
    allowEdit: true
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

### 创建一个App
创建一个应用描述文件 src/my-app.app.yml 。
```yaml
_id: my-app
name: My App
description: 我的第一个Steedos App
icon_slds: metrics
is_creator: true
objects: 
  - accounts
```

### 运行项目
```bash
cd my-app
yarn
yarn start
```

> 系统默认使用本机安装的MongoDB数据库，需要先安装并启动 [MongoDB Community Server v3.4 或以上版本](https://www.mongodb.com/download-center/community)。

### 使用浏览器访问
使用浏览器访问地址 [http://127.0.0.1:5000/](http://127.0.0.1:5000/) ，即可访问用户界面。
第一次使用时，数据库为空。点击“企业注册”，可以在本地数据库中创建一家新的企业账户。
![界面展示](assets/mac_ipad_iphone_list.png)

### 案例参考
您可以克隆并运行以下案例项目。
- [合同管理](https://github.com/steedos/steedos-contracts-app)
- [档案管理](https://github.com/steedos/steedos-records-app)
- [会议管理](https://github.com/steedos/steedos-meeting-app)
