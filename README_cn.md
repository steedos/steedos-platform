<p align="center">
  <a href="https://docs.steedos.com">
    <img alt="Steedos Logo" src="https://docs.steedos.com/img/logo.png" width="100" />
  </a>
</p>

<h1 align="center">Steedos Platform (华炎魔方)</h1>

<p align="center">
  <strong>企业级开源低代码开发平台 | The Open Source Low-Code Platform for Enterprise</strong>
</p>

<p align="center">
  <em>以元数据为核心，融合低代码的高效与 Pro-Code 的灵活，连接企业数据，重塑业务创新。</em>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@steedos/server"><img src="https://img.shields.io/npm/v/@steedos/server.svg" alt="NPM Version"></a>
  <a href="https://hub.docker.com/r/steedos/steedos-platform"><img src="https://img.shields.io/docker/pulls/steedos/steedos-platform.svg" alt="Docker Pulls"></a>
  <a href="./LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License"></a>
</p>

<p align="center">
  <a href="./README.md">English</a> •
  <a href="https://www.steedos.com/" target="_blank">官网</a> •
  <a href="https://docs.steedos.com/" target="_blank">文档</a> •
  <a href="https://github.com/steedos/steedos-examples">示例</a> •
  <a href="https://github.com/steedos/steedos-platform/discussions">社区</a>
</p>

<br/>

## 📖 简介 | Introduction

**华炎魔方 (Steedos)** 是一款基于 **元数据驱动 (Metadata Driven)** 架构的开源低代码平台。

我们致力于打造低代码领域的“Linux”——既拥有 **Salesforce** 般强大的企业级内核（对象模型、权限引擎、自动化流程），又具备开源软件的灵活性与现代技术栈（**Node.js**, **MongoDB**, **React**, **Amis**）。

无论是构建 CRM、ERP、OA，还是复杂的行业业务系统，Steedos 都能助您实现 **10倍** 的开发效率提升，同时确保代码与数据的完全自主可控。

![Steedos Overview](./docs/cn/diagrams/steedos-overview.svg)

## ⚡ 为什么选择华炎魔方？

| 特性 | 华炎魔方 (Steedos) | Salesforce | 传统代码开发 |
| :--- | :--- | :--- | :--- |
| **核心架构** | 🧠 **元数据驱动 (Metadata)** | 🧠 元数据驱动 | 📄 硬编码 |
| **开发模式** | 🚀 **可视化 + 代码 (双模)** | ⚠️ 仅限专有语言 (Apex) | 🐢 纯代码 |
| **部署方式** | ☁️ **私有部署 / 混合云** | 🔒 仅限公有云 | ☁️ 任意 |
| **前端技术** | ⚛️ **React + 百度 Amis** | ⚠️ Aura / LWC | ⚛️ 任意 |
| **数据主权** | 🛡️ **100% 自主可控** | ❌ 厂商锁定 | 🛡️ 100% |
| **使用成本** | 💰 **开源免费 / 商业授权** | 💰💰💰 昂贵的订阅费 | 💰💰 人力成本高 |

## 🌟 核心能力 | Core Capabilities

### 1. 🎨 可视化建模与页面设计 (Visual Builder)
告别繁琐的数据库脚本，点击鼠标即可定义企业级数据模型。
* **对象建模**: 支持 20+ 种字段类型，轻松处理 Lookup、Master-Detail 复杂关系。
* **页面引擎**: 深度集成百度 **Amis** 框架，拖拽式设计表单、列表、看板及微页面。
* **对标功能**: 完美替代 Salesforce Object Manager 与 Lightning App Builder。

### 2. 🤖 智能流程引擎 (Automation Engine)
内置符合 BPMN 2.0 标准的流程引擎，满足中国特色的复杂审批需求。
* **工作流 (Workflow)**: 自动化字段更新、邮件通知、Webhook 触发。
* **审批流 (Approval)**: 支持会签、加签、回退、子流程等复杂业务场景。
* **逻辑编排**: 可视化配置业务规则，无需编写代码。

### 3. 🛡️ 银行级权限体系 (Security)
提供颗粒度极细的权限管理体系，确保数据安全。
* **多维控制**: 支持对象级、字段级、记录级 (Sharing Rules) 权限控制。
* **组织架构**: 完善的部门、用户、角色 (Role)、简档 (Profile) 与权限集 (Permission Set) 管理。

### 4. 💻 开发者优先 (Steedos DX)
低代码不代表“黑盒”。我们为开发者提供了专业的工程化工具链。
* **代码即配置**: 所有元数据均以 YAML/JSON 格式存储。
* **GitOps**: 完美支持 Git 版本控制，融入 CI/CD 流水线。
* **VS Code 插件**: 提供语法高亮、自动补全、元数据双向同步。
* **API First**: 自动生成 GraphQL 与 RESTful API。


## 🏗️ 技术架构 | Architecture

华炎魔方采用前后端分离的响应式微服务架构，基于 Moleculer 框架构建。


* **后端核心**: Node.js, Moleculer (Microservices), TypeScript
* **数据存储**: MongoDB (Metadata Repository), SQL Databases (Business Data)
* **前端框架**: React, Amis (Baidu Open Source)


## 🧩 生态集成 | Ecosystem

拒绝数据孤岛，华炎魔方通过插件架构与顶级开源项目无缝融合：

* 🔐 **身份认证**: 集成 [KeyCloak](https://github.com/keycloak/keycloak)，实现企业级 SSO 单点登录。
* 📊 **数据分析**: 集成 [Metabase](https://github.com/metabase/metabase)，提供强大的 BI 报表能力。
* 🔌 **物联网/ETL**: 集成 [Node-RED](https://github.com/node-red/node-red)，实现设备连接与数据编排。
* 📱 **微应用**: 集成 [ToolJet](https://github.com/ToolJet/ToolJet/)，快速构建轻量级业务应用。


## 🚀 快速开始 | Quick Start

### 方式一：Docker 一键启动 (推荐)

最快体验华炎魔方的方式：

```bash
docker run -d -p 80:80 steedos/steedos-community:latest
````

### 方式二：创建新项目 (开发者)

使用脚手架创建标准的工程化项目：

```bash
# 创建项目
npx create-steedos-app my-project

# 进入目录并安装依赖
cd my-project
npm install

# 启动服务
npm start
```

访问 `http://localhost:5100` 即可开始使用。

-----

## 🤝 贡献与社区 | Community

华炎魔方是完全开源的项目，我们欢迎任何形式的贡献！

  * 🐛 **报告问题**: [GitHub Issues](https://github.com/steedos/steedos-platform/issues)
  * 💬 **讨论交流**: [GitHub Discussions](https://github.com/steedos/steedos-platform/discussions)
  * 🛠️ **贡献代码**: 请阅读 [CONTRIBUTING.md](https://www.google.com/search?q=./CONTRIBUTING.md)

### 联系我们

| 开发者微信群 | 商务咨询 | 微信公众号 |
| :---: | :---: | :---: |
| \<img src="https://steedos.github.io/assets/github/platform/cn/QR\_wechat\_developers.jpg" width="120" /\> | \<img src="https://steedos.github.io/assets/github/platform/cn/business\_consulting.jpg" width="120" /\> | \<img src="https://steedos.github.io/assets/github/platform/cn/public\_number.jpg" width="120" /\> |

-----

\<p align="center"\>
Copyright © 2001-2025 Steedos Inc.
\</p\>

```
