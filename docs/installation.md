---
title: 安装 Steedos 对象服务器
---

安装和运行 Steedos Object Server 非常简单。您可以在 Windows、Mac 或 Linux 环境中运行以下安装指令。

### 安装运行环境
- 安装NodeJS [NodeJS v10.0.0 或以上版本.](https://nodejs.org/en/)
- 安装数据库服务器 [MongoDB Community Server v3.4 或以上版本](https://www.mongodb.com/download-center/community)
- 安装版本管理工具 [Github Desktop](https://desktop.github.com/)
- 安装源码编辑工具 [Visual Studio Code](https://code.visualstudio.com/)

### 配置NPM国内镜像（如果需要）
```shell
npm config set registry http://registry.npm.taobao.org/
```

### 安装 Steedos Server
```shell
npm i steedos-server -g
```

### 克隆我们的示例项目
- [合同管理](https://github.com/steedos/steedos-contracts-app)
- [客户管理](https://github.com/steedos/steedos-crm-app)
- [会议管理](https://github.com/steedos/steedos-meeting-app)

### 进入项目文件夹
```shell
npm i
node server
```
