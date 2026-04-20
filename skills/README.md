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
├── project-format/
│   └── SKILL.md
├── package-format/
│   └── SKILL.md
├── environment-variables/
│   └── SKILL.md
└── ...
```

## Skills Index | 技能索引

### 🏗️ Foundation | 基础 (3 skills)

#### [project-format](./project-format/SKILL.md)
Learn how to create and structure Steedos projects, including minimal requirements, package.json configuration, steedos-config.yml setup, directory structure, and installation.

了解如何创建和组织 Steedos 项目,包括最小项目要求、package.json 配置、steedos-config.yml 设置、目录结构和安装。

#### [package-format](./package-format/SKILL.md)
Master Steedos package creation and structure, including directory organization, package.json and package.service.js configuration, metadata management, and publishing.

掌握 Steedos 软件包创建和结构,包括目录组织、package.json 和 package.service.js 配置、元数据管理和发布。

#### [environment-variables](./environment-variables/SKILL.md)
Configure Steedos with environment variables for server, database, cache, security, email, storage, and deployment settings.

使用环境变量配置 Steedos 的服务器、数据库、缓存、安全、邮件、存储和部署设置。

### 🎨 User Interface | 用户界面 (3 skills)

#### [applications](./applications/SKILL.md)
Create applications with showSidebar, tabs/tab_items/tab_groups navigation, color/icon configuration, admin menus, and mobile settings.

创建应用程序，配置 showSidebar、tabs/tab_items/tab_groups 导航、颜色/图标、管理菜单和移动端设置。

#### [tabs](./tabs/SKILL.md)
Define navigation tabs (.tab.yml) for application sidebars. Three types: object (list view), page (micro page), and url (internal/external URL). Covers permissions, icons, iframe/new-window, and license restrictions.

定义应用程序侧边栏的导航标签页 (.tab.yml)。三种类型：对象（列表视图）、页面（微页面）和 URL（内部/外部 URL）。涵盖权限、图标、iframe/新窗口和许可证限制。

#### [micro-pages](./micro-pages/SKILL.md)
Build standalone custom pages using Amis framework, including dashboards, reports, custom forms, charts, and visualizations.

使用 Amis 框架构建独立的自定义页面,包括仪表板、报表、自定义表单、图表和可视化。

### 📊 Data Modeling | 数据建模 (3 skills)

#### [objects](./objects/SKILL.md)
Define data models with ObjectQL, including object structure (.object.yml), standard fields, object properties, relationships, and complete examples.

使用 ObjectQL 定义数据模型,包括对象结构 (.object.yml)、标准字段、对象属性、关系和完整示例。

#### [object-fields](./object-fields/SKILL.md)
Master all field types and configurations, including text, number, date/time, selection, boolean, relationship (lookup, master-detail), and special fields (formula, summary, file).

掌握所有字段类型和配置,包括文本、数字、日期时间、选择、布尔、关系(查找、主从)和特殊字段(公式、汇总、文件)。

#### [object-list-views](./object-list-views/SKILL.md)
Configure list views for data display, including structure, columns, filters, sorting, grouping, filter scopes, and dynamic filters.

配置列表视图以显示数据,包括结构、列、筛选器、排序、分组、筛选范围和动态筛选器。

### 🔒 Security | 安全 (1 skill)

#### [object-permissions](./object-permissions/SKILL.md)
Control access with permission sets, including object-level, record-level, and field-level permissions, permission profiles, and dynamic permissions.

使用权限集控制访问,包括对象级、记录级和字段级权限、权限配置文件和动态权限。

### 🌐 Internationalization | 国际化 (1 skill)

#### [translations](./translations/SKILL.md)
Metadata internationalization (i18n) with two file types: translation files (.translation.yml) for app names, tab labels, and custom labels; objectTranslation files (.objectTranslation.yml) for object/field/listview/action labels and picklist options.

元数据国际化 (i18n)，两种文件类型：翻译文件 (.translation.yml) 用于应用名称、标签页标签和自定义标签；对象翻译文件 (.objectTranslation.yml) 用于对象/字段/列表视图/操作标签和下拉选项。

### ⚙️ Business Logic | 业务逻辑 (4 skills)

#### [object-buttons](./object-buttons/SKILL.md)
Create custom buttons using Amis UI framework, including button YAML definition (.button.yml), amis_button type with amis_schema, standard buttons, visible_on conditions, and dialog/drawer actions.

创建自定义按钮，使用 Amis UI 框架，包括按钮 YAML 定义 (.button.yml)、amis_button 类型与 amis_schema、标准按钮、visible_on 条件和弹窗操作。

#### [object-triggers](./object-triggers/SKILL.md)
Implement business logic with triggers, including YAML definition (.trigger.yml) with inline handler code, ctx.params, before/after insert/update/delete hooks, data validation, and objects API.

使用触发器实现业务逻辑，包括 YAML 定义 (.trigger.yml) 内联 handler 代码、ctx.params、插入/更新/删除前后钩子、数据验证和 objects API。

#### [object-functions](./object-functions/SKILL.md)
Create server-side functions as YAML definitions (.function.yml) with inline script, REST API exposure (is_rest), ctx.input parameters, and objects API for data access.

创建服务端函数，使用 YAML 定义 (.function.yml) 内联 script、REST API 暴露 (is_rest)、ctx.input 参数和 objects API 数据访问。

#### [object-micro-pages](./object-micro-pages/SKILL.md)
Customize object detail and form pages, including object-specific pages, detail page layouts, custom form pages, dashboard pages, and page configurations using Amis.

自定义对象详情和表单页面,包括对象特定页面、详情页布局、自定义表单页面、仪表板页面和使用 Amis 的页面配置。

### 🖥️ Server (Builder6) | 服务端 (5 skills)

#### [server-architecture](./server-architecture/SKILL.md)
NestJS + Moleculer hybrid server architecture, module organization, bootstrap sequence, middleware stack, guards (AuthGuard, AdminGuard), and ObjectQL data access pattern.

NestJS + Moleculer 混合服务端架构、模块组织、启动流程、中间件栈、守卫和 ObjectQL 数据访问模式。

#### [server-api](./server-api/SKILL.md)
REST API reference for /api/v6/ endpoints: data CRUD, object metadata, function execution, filter operators, query parameters, and Swagger/OpenAPI documentation.

/api/v6/ REST API 参考：数据 CRUD、对象元数据、函数执行、筛选运算符、查询参数和 Swagger/OpenAPI 文档。

#### [server-config](./server-config/SKILL.md)
Server configuration via environment variables and YAML settings files, including datasources, tenant settings, file storage, SSO/OIDC, email, and frontend asset URLs.

通过环境变量和 YAML 配置文件进行服务端配置，包括数据源、租户设置、文件存储、SSO/OIDC、邮件和前端资源 URL。

#### [server-websocket](./server-websocket/SKILL.md)
Real-time WebSocket system using Socket.IO, connection authentication, room-based event routing, metadata/record/notification change events, and Moleculer integration.

基于 Socket.IO 的实时 WebSocket 系统、连接认证、房间事件路由、元数据/记录/通知变更事件和 Moleculer 集成。

#### [server-moleculer](./server-moleculer/SKILL.md)
Moleculer microservice integration, broker configuration, event handlers, ObjectQL schema initialization, service lifecycle, and inter-service communication patterns.

Moleculer 微服务集成、代理配置、事件处理、ObjectQL 模式初始化、服务生命周期和跨服务通信模式。

## Quick Reference | 快速参考

### By Task | 按任务查找

| Task | Skill |
|------|-------|
| Create a new Steedos project | [project-format](./project-format/SKILL.md) |
| Create a package | [package-format](./package-format/SKILL.md) |
| Configure environment | [environment-variables](./environment-variables/SKILL.md) |
| Define data models | [objects](./objects/SKILL.md), [object-fields](./object-fields/SKILL.md) |
| Create list views | [object-list-views](./object-list-views/SKILL.md) |
| Add validation logic | [object-triggers](./object-triggers/SKILL.md) |
| Create custom buttons | [object-buttons](./object-buttons/SKILL.md) |
| Build dashboards | [micro-pages](./micro-pages/SKILL.md) |
| Define navigation tabs | [tabs](./tabs/SKILL.md) |
| Configure permissions | [object-permissions](./object-permissions/SKILL.md) |
| Translate metadata (i18n) | [translations](./translations/SKILL.md) |
| Create custom pages | [object-micro-pages](./object-micro-pages/SKILL.md), [micro-pages](./micro-pages/SKILL.md) |
| Understand server architecture | [server-architecture](./server-architecture/SKILL.md) |
| Use REST API | [server-api](./server-api/SKILL.md) |
| Configure server | [server-config](./server-config/SKILL.md) |
| Real-time WebSocket | [server-websocket](./server-websocket/SKILL.md) |
| Moleculer microservices | [server-moleculer](./server-moleculer/SKILL.md) |

### By File Type | 按文件类型查找

| File Type | Skill Reference |
|-----------|----------------|
| `package.json` | [project-format](./project-format/SKILL.md), [package-format](./package-format/SKILL.md) |
| `steedos-config.yml` | [project-format](./project-format/SKILL.md) |
| `.env` | [environment-variables](./environment-variables/SKILL.md) |
| `*.app.yml` | [applications](./applications/SKILL.md) |
| `*.object.yml` | [objects](./objects/SKILL.md), [object-fields](./object-fields/SKILL.md) |
| `*.button.yml` | [object-buttons](./object-buttons/SKILL.md) |
| `*.trigger.yml` | [object-triggers](./object-triggers/SKILL.md) |
| `*.function.yml` | [object-functions](./object-functions/SKILL.md) |
| `*.tab.yml` | [tabs](./tabs/SKILL.md) |
| `*.translation.yml` | [translations](./translations/SKILL.md) |
| `*.objectTranslation.yml` | [translations](./translations/SKILL.md) |
| `*.page.yml` + `*.page.amis.json` | [object-micro-pages](./object-micro-pages/SKILL.md), [micro-pages](./micro-pages/SKILL.md) |

## Technology Stack | 技术栈

**Platform**: Steedos (华炎魔方) - Enterprise Low-Code Platform

**Backend:**
- Node.js + TypeScript
- Moleculer microservices
- MongoDB / PostgreSQL / MySQL

**Frontend:**
- React
- Amis (Baidu low-code UI framework)

**Metadata:**
- YAML files (.yml)
- JavaScript files (.js)

**NOT Python!** This is a JavaScript/Node.js platform.

**不是 Python!** 这是一个 JavaScript/Node.js 平台。

## How to Use | 如何使用

### For AI Coding Assistants | 用于 AI 编程助手

These skills follow the [Anthropic Agent Skills specification](https://github.com/anthropics/skills) and work with:
- Claude (via Agent Skills API)
- GitHub Copilot
- Cursor
- Other AI coding assistants

**Usage:**
AI assistants can automatically discover and load skills based on context, or you can reference them explicitly.

**使用方法:**
AI 助手可以根据上下文自动发现和加载技能,或者您可以明确引用它们。

### For Developers | 用于开发者

Use as reference documentation:
- Quick syntax lookup
- Copy-paste examples
- Best practices guide
- Troubleshooting help

用作参考文档:
- 快速语法查找
- 复制粘贴示例
- 最佳实践指南
- 故障排除帮助

### For Learning | 用于学习

Recommended learning path:

1. **Foundation** (start here)
   - [project-format](./project-format/SKILL.md)
   - [package-format](./package-format/SKILL.md)
   - [environment-variables](./environment-variables/SKILL.md)

2. **Data Modeling**
   - [objects](./objects/SKILL.md)
   - [object-fields](./object-fields/SKILL.md)
   - [object-list-views](./object-list-views/SKILL.md)

3. **Business Logic**
   - [object-triggers](./object-triggers/SKILL.md)
   - [object-buttons](./object-buttons/SKILL.md)
   - [object-functions](./object-functions/SKILL.md)

4. **User Interface**
   - [applications](./applications/SKILL.md)
   - [tabs](./tabs/SKILL.md)
   - [object-micro-pages](./object-micro-pages/SKILL.md)
   - [micro-pages](./micro-pages/SKILL.md)

5. **Security**
   - [object-permissions](./object-permissions/SKILL.md)

6. **Internationalization**
   - [translations](./translations/SKILL.md)

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

## Contributing | 贡献

To improve these skills:

1. **Report Issues**: If you find errors or outdated information
2. **Suggest Improvements**: Share better examples or explanations
3. **Add Examples**: Contribute real-world use cases
4. **Translate**: Help with translations and localization
5. **Follow Spec**: Maintain [Anthropic SKILL.md format](https://github.com/anthropics/skills)

改进这些技能:

1. **报告问题**: 如果发现错误或过时信息
2. **建议改进**: 分享更好的示例或说明
3. **添加示例**: 贡献实际用例
4. **翻译**: 帮助翻译和本地化
5. **遵循规范**: 保持 [Anthropic SKILL.md 格式](https://github.com/anthropics/skills)

## Related Resources | 相关资源

### In This Repository

- [`.github/copilot-instructions.md`](../.github/copilot-instructions.md) - GitHub Copilot auto-loaded instructions
- [`.github/prompts/`](../.github/prompts/) - Detailed prompt files
- [`.cursorrules`](../.cursorrules) - Cursor IDE rules
- [`docs/`](../docs/) - Technical documentation

### External Resources

- 📘 [Steedos Documentation](https://docs.steedos.com/)
- 🏠 [Steedos Website](https://www.steedos.com/)
- 💬 [Community Discussions](https://github.com/steedos/steedos-platform/discussions)
- 📦 [Steedos Templates](https://github.com/steedos/steedos-templates)
- 🤖 [Anthropic Agent Skills](https://github.com/anthropics/skills)

## Statistics | 统计

- **Total Skills**: 20
- **Total Documentation**: ~250KB
- **Format**: Anthropic SKILL.md specification
- **Languages**: English + Chinese (bilingual)

## Version | 版本

**Version**: 2.0.0
**Format**: Anthropic Agent Skills
**Last Updated**: 2026-04-13
**Steedos Platform Version**: 3.0.x

## License | 许可

These skills are part of the Steedos Platform project and follow the same MIT license.

这些技能是 Steedos 平台项目的一部分,遵循相同的 MIT 许可证。

---

<p align="center">
  <strong>🚀 Anthropic-Compatible Skills for Steedos! 🚀</strong><br>
  <em>符合 Anthropic 规范的 Steedos 技能库! 🚀</em>
</p>
