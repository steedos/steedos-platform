<p align="center">
  <a href="https://docs.steedos.com">
    <img alt="Steedos Logo" src="./docs/images/logo.svg" width="100" />
  </a>
</p>

<h1 align="center">Steedos Platform (华炎魔方)</h1>

<p align="center">
  <strong>下一代 AI 原生低代码开发平台 | The AI-Native Low-Code Platform</strong>
</p>

<p align="center">
  <em>Prompt to App. 提示词即应用。</em><br/>
  <em>以元数据为核心，融合生成式 AI 的速度与企业级平台的稳健。</em>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@steedos/server"><img src="https://img.shields.io/npm/v/@steedos/server.svg" alt="NPM Version"></a>
  <a href="https://hub.docker.com/r/steedos/steedos-community"><img src="https://img.shields.io/docker/pulls/steedos/steedos-community.svg" alt="Docker Pulls"></a>
  <a href="./LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License"></a>
</p>

<p align="center">
  <a href="./README.md">English</a> •
  <a href="https://www.steedos.com/" target="_blank">官网</a> •
  <a href="https://docs.steedos.com/" target="_blank">文档</a> •
  <a href="https://github.com/steedos/steedos-templates">示例</a> •
  <a href="https://github.com/steedos/steedos-platform/discussions">社区</a>
</p>

<br/>

## 📖 简介 | Introduction

**华炎魔方 (Steedos Platform)** 代表了软件开发的下一次进化。我们将 Salesforce 级别的**元数据驱动架构 (Metadata Driven)** 与**生成式 AI** 深度融合。

告别繁琐的拖拽和手动编码，现在，你可以使用自然语言（Prompt）来编排企业级应用。AI 引擎负责生成数据模型、界面配置和微服务逻辑，而华炎魔方的稳健内核确保这些应用具备企业级的权限控制、事务一致性和可扩展性。

无论是构建 CRM、ERP 还是复杂的行业业务系统，华炎魔方让你在保持 **100% 代码自主可控** 的前提下，实现 **10 倍的开发效率提升**。

<br/>
<p align="center">
  <img src="https://docs.steedos.com/diagrams/steedos-overview-zh-CN.svg" width="100%" alt="Steedos Platform Architecture">
</p>
<br/>

## ⚡ 为什么选择华炎魔方？

| 特性 | 华炎魔方 (AI Native) | Salesforce | 传统低代码平台 |
| :--- | :--- | :--- | :--- |
| **开发范式** | 🤖 **AI 优先 (Prompt-Driven)** | 🖱️ 点击配置 / 代码 | 🖱️ 拖拽式 |
| **核心架构** | 🧠 **元数据驱动** | 🧠 元数据驱动 | 📄 硬编码 / JSON Schema |
| **微服务逻辑** | 🚀 **AI 生成标准 Node.js 代码** | ⚠️ 专有语言 (Apex) | ❌ 黑盒，难以扩展 |
| **前端技术** | ⚛️ **React + 百度 Amis** | ⚠️ Aura / LWC | 🐢 厂商私有协议 |
| **部署方式** | ☁️ **私有部署 / 混合云** | 🔒 仅限公有云 | ☁️ 混合 |
| **使用成本** | 💰 **开源免费 / 商业授权** | 💰💰💰 昂贵的订阅费 | 💰💰 按点数/人头收费 |

## 🌟 核心功能 | Core Features

### 1. 🤖 AI 数据建模 (Copilot)
无需手动创建表结构。只需描述业务逻辑，AI 为您构建地基。
* **Text-to-Schema:** 告诉 AI *“我需要一个包含项目、任务和里程碑的项目管理系统”*，它会自动生成实体关系图（ERD）和元数据。
* **智能关系处理:** 自动处理查找（Lookup）、主从（Master-Detail）和汇总（Roll-up）关系。
* **API Ready:** 模型生成即生效，自动透出 GraphQL 和 RESTful API。

### 2. 🎨 AI 界面生成 (Generative UI)
通过对话构建复杂的企业级界面，深度集成 **百度 Amis**。
* **Text-to-UI:** 描述页面需求（例如：*“生成一个仪表盘，展示各地区销售额统计图，下方显示高优先级的待办事项列表”*），AI 自动生成 Amis JSON 配置。
* **可视化微调:** AI 生成后，仍可使用可视化设计器进行精细调整。
* **多端适配:** 自动生成适配 移动端/PC端 的响应式布局。

### 3. ⚡ AI 微服务编排
业务逻辑不再是黑盒，AI 帮您编写标准的后端逻辑。
* **Text-to-Code:** 描述业务规则（例如：*“当合同状态更为‘已签署’时，自动计算销售提成，并发送飞书通知给经理”*），平台自动生成标准的 **Node.js** 代码。
* **沙箱执行:** 生成的代码在安全沙箱中运行，确保系统稳定性。
* **流程引擎:** 内置符合 BPMN 标准的审批流引擎，支持会签、回退等中国式复杂审批。

### 4. 🛡️ 企业级内核 (The Foundation)
AI 带来速度，内核保障稳健。
* **权限引擎:** 支持对象级、字段级、记录级（共享规则）的精密权限控制。
* **组织架构:** 完善的部门、人员、角色、简档（Profile）管理体系。
* **Steedos DX:** 所有元数据均以 YAML/JSON 文件存储，完美支持 Git 版本控制和 CI/CD 流水线。

## 🏗️ 技术架构

华炎魔方采用前后端分离的微服务架构，基于现代开源技术栈构建。

* **AI 层:** 兼容 OpenAI / Claude / DeepSeek 及本地 LLM 模型。
* **后端核心:** Node.js, Moleculer (微服务框架), TypeScript。
* **数据存储:** MongoDB (元数据仓库), SQL 数据库 (业务数据，支持 MySQL/PostgreSQL/Oracle)。
* **前端:** React, Amis (百度开源低代码框架)。

## 🚀 快速开始 | Quick Start

### 方式一：Docker 一键启动 (推荐)

最快体验 AI 低代码开发：

```bash
docker run -d -p 80:80 steedos/steedos-community:3.0

```

### 方式二：创建新项目 (开发者)

使用脚手架创建标准的工程化项目：

```bash
# 创建项目
npx create-steedos-app my-project

# 进入目录并安装依赖
cd my-project
yarn install

# 启动服务
yarn start

```

访问 `http://localhost:5100` 即可开始使用 AI 构建应用。

## 📚 开发者文档 | Developer Docs

* 🤖 **AI 辅助开发指南**: [AI_DEVELOPMENT_GUIDE.md](./AI_DEVELOPMENT_GUIDE.md) - 代码质量工具、TypeScript 严格模式、测试基础设施
* 📘 **TypeScript 迁移指南**: [TYPESCRIPT_MIGRATION.md](./docs/TYPESCRIPT_MIGRATION.md) - 严格模式迁移步骤
* 📖 **开发者指南**: [DEVELOPER_GUIDE.md](./docs/DEVELOPER_GUIDE.md) - 快速入门和核心概念
* 🤝 **贡献指南**: [CONTRIBUTING.md](./CONTRIBUTING.md) - 如何为项目做贡献

## 🧩 生态与集成 | Ecosystem

华炎魔方拥有强大的连接能力：

* **身份认证:** 支持 OIDC, SAML, LDAP, AD 域集成。
* **IM 集成:** 预置企业微信、钉钉、飞书连接器。
* **数据集成:** 轻松连接 SAP, Oracle 等传统 ERP 系统。

## 🤝 贡献与社区 | Community

华炎魔方是完全开源的项目，我们正在积极探索 **AI x Low-Code** 的前沿。

* 🐛 **报告问题**: [GitHub Issues](https://github.com/steedos/steedos-platform/issues)
* 💬 **讨论交流**: [GitHub Discussions](https://github.com/steedos/steedos-platform/discussions)

## 联系我们

<img src="https://www.steedos.com/img/QR_contact1.png" width="500" alt="Contact Steedos" />
