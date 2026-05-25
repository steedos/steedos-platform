# Steedos Platform Skills | Steedos 平台技能库

## Overview | 概述

This directory contains distilled knowledge about the Steedos platform, organized as Anthropic-compatible skills that can be used by AI coding assistants like Claude, developers, and as reference documentation.

此目录包含关于 Steedos 平台的精炼知识,以 Anthropic 兼容的技能形式组织,可供 Claude 等 AI 编程助手、开发者使用,也可作为参考文档。

## What are Skills? | 什么是技能?

Skills are comprehensive, self-contained guides following the [Anthropic Agent Skills specification](https://github.com/anthropics/skills). Each skill provides:

技能是全面的、独立的指南,遵循 [Anthropic Agent Skills 规范](https://github.com/anthropics/skills)。每个技能提供:

- Complete syntax and structure reference
- Practical code examples
- Best practices and patterns
- Troubleshooting guidance
- Bilingual content (English and Chinese)

## Directory Structure | 目录结构

Each skill is in its own directory with a `SKILL.md` file following the Anthropic specification:

```
skills/
├── steedos-getting-started/
│   └── SKILL.md
├── steedos-project-package/
│   └── SKILL.md
├── steedos-objects/
│   └── SKILL.md
└── ... (22 skills total)
```

## Skills Index | 技能索引

### 🗺️ Start Here | 从这里开始

#### [steedos-getting-started](./steedos-getting-started/SKILL.md)
Steedos Platform overview, skill routing guide, CLI commands reference, and package validation tool. Load this skill first to understand what Steedos is and which skills to use.

Steedos 平台概览、技能路由指南、CLI 命令参考和软件包校验工具。首先加载此技能以了解 Steedos 是什么以及使用哪些技能。

### 🏗️ Foundation | 基础 (2 skills)

#### [steedos-project-package](./steedos-project-package/SKILL.md)
Learn how to create and structure Steedos projects and packages, including minimal requirements, package.json, package.service.js, directory structure, metadata file types, and naming conventions.

了解如何创建和组织 Steedos 项目和软件包，包括项目要求、package.json、package.service.js、目录结构、元数据文件类型和命名规范。

#### [steedos-configuration](./steedos-configuration/SKILL.md)
Configure Steedos Server via environment variables and YAML settings files. Covers required env vars, YAML settings with env interpolation, datasources, tenant settings, CFS file storage, SSO/OIDC, email, Docker setup, and security best practices.

通过环境变量和 YAML 配置文件配置 Steedos 服务端。涵盖必需变量、YAML 环境变量插值、数据源、租户设置、文件存储、SSO/OIDC、邮件、Docker 部署和安全最佳实践。

### 📊 Data Modeling | 数据建模 (3 skills)

#### [steedos-builtin-objects](./steedos-builtin-objects/SKILL.md)
Built-in objects reference: ~20 core objects (users, spaces, organizations, space_users, permission_set, apps, etc.) with field definitions and relationships. Full index of all ~93 built-in objects.

内置对象参考：约 20 个核心对象的字段定义和关系。包含全部约 93 个内置对象的完整索引。

#### [steedos-objects](./steedos-objects/SKILL.md)
Define data models (.object.yml) and list views (.listview.yml). Covers object properties, feature flags, inheritance, naming conventions, multi-file layout, list view columns, filters, sort, and sharing settings.

定义数据模型 (.object.yml) 和列表视图 (.listview.yml)。涵盖对象属性、功能开关、继承、命名规范、多文件布局、列表视图列、筛选、排序和共享设置。

#### [steedos-object-fields](./steedos-object-fields/SKILL.md)
Master all field types and configurations, including text, number, date/time, selection, boolean, relationship (lookup, master-detail), and special fields (formula, summary, file).

掌握所有字段类型和配置,包括文本、数字、日期时间、选择、布尔、关系(查找、主从)和特殊字段(公式、汇总、文件)。

### 🔒 Security | 安全 (1 skill)

#### [steedos-object-permissions](./steedos-object-permissions/SKILL.md)
Control access with permission sets, including object-level, record-level, and field-level permissions, permission profiles, and dynamic permissions.

使用权限集控制访问,包括对象级、记录级和字段级权限、权限配置文件和动态权限。

### 🌐 Internationalization | 国际化 (1 skill)

#### [steedos-translations](./steedos-translations/SKILL.md)
Metadata internationalization (i18n) with translation files (.translation.yml) and objectTranslation files (.objectTranslation.yml).

元数据国际化 (i18n)，翻译文件和对象翻译文件。

### ⚙️ Business Logic | 业务逻辑 (2 skills)

#### [steedos-object-buttons](./steedos-object-buttons/SKILL.md)
Create custom buttons using Amis UI framework (.button.yml in objects/{name}/buttons/), including amis_button type with amis_schema, standard buttons, visible_on conditions, and dialog/drawer actions.

创建自定义按钮，使用 Amis UI 框架，包括按钮 YAML 定义、amis_schema、标准按钮、visible_on 条件和弹窗操作。

#### [steedos-server-logic](./steedos-server-logic/SKILL.md)
Server-side JavaScript triggers (.trigger.yml) and functions (.function.yml). Triggers fire automatically on data change events. Functions are REST-exposed business logic callable from buttons, triggers, or external systems.

服务端 JavaScript 触发器和函数。触发器在数据变更时自动执行，函数可作为 REST 端点暴露，从按钮、触发器或外部系统调用。

### 🎨 User Interface | 用户界面 (4 skills)

#### [steedos-applications](./steedos-applications/SKILL.md)
Create applications with showSidebar, tabs/tab_items/tab_groups navigation, color/icon configuration, admin menus, and mobile settings.

创建应用程序，配置侧边栏、导航、颜色/图标、管理菜单和移动端设置。

#### [steedos-tabs](./steedos-tabs/SKILL.md)
Define navigation tabs (.tab.yml) for application sidebars. Types: object (list view), page (micro page), analytics_dashboard, and url (internal/external URL).

定义应用程序侧边栏的导航标签页。类型：对象、页面、仪表盘和 URL。

#### [steedos-pages](./steedos-pages/SKILL.md)
Build custom pages using Amis framework. Standalone pages (type: app) for dashboards and reports, plus object-bound pages (type: record/list) for custom detail and list layouts.

使用 Amis 框架构建自定义页面。独立页面（仪表板、报表）和对象绑定页面（自定义详情和列表布局）。

#### [steedos-webapps](./steedos-webapps/SKILL.md)
Develop custom React + Vite webapps in Steedos packages. Build custom amis Renderer components via IIFE compilation with JSX runtime shimming and CSS scope isolation.

在 Steedos 软件包中开发自定义 React + Vite 应用，构建自定义 amis Renderer 组件。

### 📊 Analytics | 数据分析 (1 skill)

#### [steedos-analytics](./steedos-analytics/SKILL.md)
Create analytics questions (reports/charts) and dashboards. Covers MBQL/SQL queries, visualization types, grid layouts, parameter filtering, embedding, and public sharing. Requires enterprise license.

创建分析问题（报表/图表）和仪表盘。涵盖 MBQL/SQL 查询、可视化类型、网格布局、参数筛选、嵌入和公开分享。需要企业版许可证。

### 📦 Data | 数据 (1 skill)

#### [steedos-seed-data](./steedos-seed-data/SKILL.md)
Define initial seed data (.data.json/.yml/.csv). Records are auto-imported at startup (insert-only) or space init (upsert).

定义初始化数据。记录在启动时自动导入。

### 🖥️ Server | 服务端 (6 skills)

#### [steedos-server-api](./steedos-server-api/SKILL.md)
REST API reference for /api/v6/ endpoints: data CRUD, object metadata, function execution, filter operators, and Swagger/OpenAPI documentation.

/api/v6/ REST API 参考：数据 CRUD、对象元数据、函数执行、筛选运算符和 Swagger 文档。

#### [steedos-graphql-api](./steedos-graphql-api/SKILL.md)
GraphQL API auto-generated from object metadata at /graphql. Covers CRUD queries/mutations, lookup expansion, display formatting, record permissions, related records, filters, pagination, and DataLoader batching.

从对象元数据自动生成的 GraphQL API。涵盖 CRUD 查询/变更、查找字段展开、分页、排序和 DataLoader 批量优化。

#### [steedos-server-internals](./steedos-server-internals/SKILL.md)
Steedos Server internal architecture: NestJS 11 + Moleculer 0.14 hybrid, module layout, bootstrap, middleware, guards, Socket.IO WebSocket, Moleculer events, and inter-service communication.

Steedos 服务端内部架构：NestJS + Moleculer 混合架构、模块组织、启动流程、中间件栈、守卫、WebSocket 和 Moleculer 事件。

#### [steedos-builder6-internals](./steedos-builder6-internals/SKILL.md)
Builder6 Server architecture and configuration. NestJS 11 + Moleculer 0.14 hybrid monorepo with 20+ @builder6/* packages, B6_* environment variables, and ConfigService access.

Builder6 服务端架构和配置。Monorepo 结构、B6_* 环境变量和 ConfigService 访问。

#### [steedos-builder6-api](./steedos-builder6-api/SKILL.md)
Builder6 REST API: Tables CRUD (/api/v6/tables/:baseId/:tableId), Direct MongoDB CRUD, Files, Auth, Users, batch operations, lookup field resolution via DataLoader, and DevExtreme query adapter.

Builder6 REST API：数据表 CRUD、直接 MongoDB CRUD、文件上传下载、认证、DataLoader 和 DevExtreme 查询适配器。

#### [steedos-builder6-modules](./steedos-builder6-modules/SKILL.md)
Builder6 authentication (guards, token formats, AuthService), file upload/download (local + S3 storage), and dynamic plugin system (NestJS/Moleculer plugins, lifecycle).

Builder6 认证（守卫、Token、AuthService）、文件上传下载（本地 + S3）和动态插件系统。

### 🧪 Dev & Testing | 开发测试 (1 skill)

#### [steedos-dev-testing](./steedos-dev-testing/SKILL.md)
Automated dev-test workflow using Playwright MCP Server. Iterative loop: modify → build → restart → browser test → record → repeat. Includes project configuration template and setup guidance.

使用 Playwright MCP Server 的自动化开发测试工作流。迭代循环：修改 → 构建 → 重启 → 浏览器测试 → 记录 → 重复。包含项目配置模板和环境配置引导。

## Quick Reference | 快速参考

### By Task | 按任务查找

| Task | Skill |
|------|-------|
| Create a new project/package | [steedos-project-package](./steedos-project-package/SKILL.md) |
| Configure environment | [steedos-configuration](./steedos-configuration/SKILL.md) |
| Start/restart server | [steedos-getting-started](./steedos-getting-started/SKILL.md) |
| CLI commands | [steedos-getting-started](./steedos-getting-started/SKILL.md) |
| Validate a package | [steedos-getting-started](./steedos-getting-started/SKILL.md) |
| Understand built-in objects | [steedos-builtin-objects](./steedos-builtin-objects/SKILL.md) |
| Define data models | [steedos-objects](./steedos-objects/SKILL.md), [steedos-object-fields](./steedos-object-fields/SKILL.md) |
| Create list views | [steedos-objects](./steedos-objects/SKILL.md) |
| Add triggers/functions | [steedos-server-logic](./steedos-server-logic/SKILL.md) |
| Create custom buttons | [steedos-object-buttons](./steedos-object-buttons/SKILL.md) |
| Build UI pages | [steedos-pages](./steedos-pages/SKILL.md) |
| Build dashboards/reports | [steedos-analytics](./steedos-analytics/SKILL.md) |
| Define navigation tabs | [steedos-tabs](./steedos-tabs/SKILL.md) |
| Configure permissions | [steedos-object-permissions](./steedos-object-permissions/SKILL.md) |
| Translate metadata (i18n) | [steedos-translations](./steedos-translations/SKILL.md) |
| Custom React components | [steedos-webapps](./steedos-webapps/SKILL.md) |
| Use REST API | [steedos-server-api](./steedos-server-api/SKILL.md) |
| Use GraphQL API | [steedos-graphql-api](./steedos-graphql-api/SKILL.md) |
| Server architecture | [steedos-server-internals](./steedos-server-internals/SKILL.md) |
| Builder6 REST API | [steedos-builder6-api](./steedos-builder6-api/SKILL.md) |
| Auth/Files/Plugins | [steedos-builder6-modules](./steedos-builder6-modules/SKILL.md) |
| Automated dev & testing | [steedos-dev-testing](./steedos-dev-testing/SKILL.md) |

### By File Type | 按文件类型查找

| File Type | Skill Reference |
|-----------|----------------|
| `package.json` | [steedos-project-package](./steedos-project-package/SKILL.md) |
| `.env` | [steedos-configuration](./steedos-configuration/SKILL.md) |
| `*.object.yml` | [steedos-objects](./steedos-objects/SKILL.md) |
| `*.field.yml` | [steedos-object-fields](./steedos-object-fields/SKILL.md) |
| `*.listview.yml` | [steedos-objects](./steedos-objects/SKILL.md) |
| `*.trigger.yml` | [steedos-server-logic](./steedos-server-logic/SKILL.md) |
| `*.function.yml` | [steedos-server-logic](./steedos-server-logic/SKILL.md) |
| `*.button.yml` | [steedos-object-buttons](./steedos-object-buttons/SKILL.md) |
| `*.app.yml` | [steedos-applications](./steedos-applications/SKILL.md) |
| `*.tab.yml` | [steedos-tabs](./steedos-tabs/SKILL.md) |
| `*.page.yml` + `*.page.amis.json` | [steedos-pages](./steedos-pages/SKILL.md) |
| `*.permission.yml` | [steedos-object-permissions](./steedos-object-permissions/SKILL.md) |
| `*.translation.yml` | [steedos-translations](./steedos-translations/SKILL.md) |
| `*.data.yml` / `*.data.json` | [steedos-seed-data](./steedos-seed-data/SKILL.md) |

## Technology Stack | 技术栈

**Platform**: Steedos (华炎魔方) - Enterprise Low-Code Platform

**Backend:**
- Node.js + TypeScript
- NestJS 11 + Moleculer 0.14 microservices
- MongoDB / PostgreSQL / MySQL

**Frontend:**
- React
- Amis (Baidu low-code UI framework)

**Metadata:**
- YAML files (.yml)
- JavaScript files (.js)

**NOT Python!** This is a JavaScript/Node.js platform.

## How to Use | 如何使用

### Install via npx skills | 通过 npx skills 安装

```bash
# Install all skills | 安装所有技能
npx skills add steedos/steedos-platform --all

# Install specific skill | 安装特定技能
npx skills add steedos/steedos-platform --skill steedos-objects

# List available skills | 列出可用技能
npx skills add steedos/steedos-platform --list
```

### For AI Coding Assistants | 用于 AI 编程助手

These skills follow the [Anthropic Agent Skills specification](https://github.com/anthropics/skills) and work with:
- Claude (via Agent Skills API)
- GitHub Copilot
- Cursor
- Other AI coding assistants

### For Learning | 用于学习

Recommended learning path:

1. **Foundation** — [steedos-project-package](./steedos-project-package/SKILL.md), [steedos-configuration](./steedos-configuration/SKILL.md)
2. **Data Modeling** — [steedos-builtin-objects](./steedos-builtin-objects/SKILL.md), [steedos-objects](./steedos-objects/SKILL.md), [steedos-object-fields](./steedos-object-fields/SKILL.md)
3. **Business Logic** — [steedos-server-logic](./steedos-server-logic/SKILL.md), [steedos-object-buttons](./steedos-object-buttons/SKILL.md)
4. **User Interface** — [steedos-applications](./steedos-applications/SKILL.md), [steedos-tabs](./steedos-tabs/SKILL.md), [steedos-pages](./steedos-pages/SKILL.md), [steedos-webapps](./steedos-webapps/SKILL.md)
5. **Security** — [steedos-object-permissions](./steedos-object-permissions/SKILL.md)
6. **Internationalization** — [steedos-translations](./steedos-translations/SKILL.md)
7. **Server & Builder6** — [steedos-server-internals](./steedos-server-internals/SKILL.md), [steedos-builder6-internals](./steedos-builder6-internals/SKILL.md), [steedos-builder6-api](./steedos-builder6-api/SKILL.md), [steedos-builder6-modules](./steedos-builder6-modules/SKILL.md)

## Skill Format | 技能格式

Each skill follows the Anthropic SKILL.md specification:

### YAML Frontmatter

```yaml
---
name: skill-name
description: |
  What the skill covers and when to use it (max 1024 chars)
---
```

### Markdown Body

Complete documentation with:
- Bilingual content (English and Chinese)
- Syntax references and examples
- Best practices
- Troubleshooting guides

## Statistics | 统计

- **Total Skills**: 22
- **Format**: Anthropic SKILL.md specification
- **Languages**: English + Chinese (bilingual)

## Version | 版本

**Version**: 3.0.0
**Format**: Anthropic Agent Skills
**Last Updated**: 2026-04-29
**Steedos Platform Version**: 3.0.x

## License | 许可

These skills are part of the Steedos Platform project and follow the same MIT license.
