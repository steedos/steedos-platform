---
title: 安装开发环境
---

Steedos项目基于NodeJS开发，默认使用MongoDB数据库。您可以在 Windows、Mac 或 Linux 环境中创建、开发和运行Steedos项目。

## 安装NodeJS 
请安装与操作系统对应的 [NodeJS v10.x 版本](https://nodejs.org/en/) 。

## 安装数据库服务器 
请安装 [MongoDB Community Server v3.4 或以上版本](https://www.mongodb.com/download-center/community)，安装完成之后，请启动mongodb服务。

## 安装版本管理工具 
请安装 [Github Desktop](https://desktop.github.com/)，用于管理项目源码。如果您还没有Github账户，建议您先注册一个。

## 安装源码编辑工具 
请安装 [Visual Studio Code](https://code.visualstudio.com/)。并安装 Steedos 集成插件[redhat.vscode-yaml](https://marketplace.visualstudio.com/items?itemName=redhat.vscode-yaml)，您在编写配置文件时如果有语法错误，Visual Studio Code 会自动提示。

## 安装 yarn 包管理工具
yarn 是 Facebook 开发的 Nodejs 包管理工具（替代npm），可以更快速更稳定的为项目安装依赖包。
```bash
npm i yarn -g
```

## 安装 steedos 客户端工具
steedos客户端工具用于创建和运行项目，还可以从现有数据库自动导入初始业务对象。
```bash
yarn global add steedos-cli
```
