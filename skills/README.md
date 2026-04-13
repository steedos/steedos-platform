# Steedos Platform Skills | Steedos 平台技能库

## Overview | 概述

This directory contains distilled knowledge about the Steedos platform, organized as standalone "skills" that can be used by AI coding assistants, developers, and as reference documentation.

此目录包含关于 Steedos 平台的精炼知识,以独立的"技能"形式组织,可供 AI 编程助手、开发者使用,也可作为参考文档。

## What are Skills? | 什么是技能?

Skills are comprehensive, self-contained guides that document specific aspects of Steedos platform development. Each skill file provides:

技能是全面的、独立的指南,记录 Steedos 平台开发的特定方面。每个技能文件提供:

- Complete syntax and structure reference
- Practical code examples
- Best practices and patterns
- Troubleshooting guidance
- Bilingual content (English and Chinese)

## Skills Index | 技能索引

### 🏗️ Foundation | 基础

#### [01-project-format.md](./01-project-format.md)
**Steedos Project Structure | Steedos 项目结构**

Learn how to create and structure a Steedos project, including:
- Minimal project requirements
- package.json configuration
- steedos-config.yml setup
- Directory structure
- Installation and setup

了解如何创建和组织 Steedos 项目,包括:
- 最小项目要求
- package.json 配置
- steedos-config.yml 设置
- 目录结构
- 安装和设置

#### [02-package-format.md](./02-package-format.md)
**Steedos Package Development | Steedos 软件包开发**

Master Steedos package creation and structure:
- Package directory structure
- package.json and package.service.js
- Metadata organization
- Package registration
- Publishing and versioning

掌握 Steedos 软件包创建和结构:
- 软件包目录结构
- package.json 和 package.service.js
- 元数据组织
- 软件包注册
- 发布和版本管理

#### [03-environment-variables.md](./03-environment-variables.md)
**Environment Configuration | 环境配置**

Configure Steedos with environment variables:
- Core variables (server, database, cache)
- Security and authentication
- Email and storage configuration
- Development vs. production settings
- Docker configuration

使用环境变量配置 Steedos:
- 核心变量(服务器、数据库、缓存)
- 安全和认证
- 邮件和存储配置
- 开发与生产环境设置
- Docker 配置

### 🎨 User Interface | 用户界面

#### [04-applications.md](./04-applications.md)
**Application Definitions | 应用程序定义**

Create applications to organize functionality:
- Application structure (.app.yml)
- Object grouping
- Icons and visibility
- Admin menus
- Mobile configuration

创建应用程序来组织功能:
- 应用程序结构 (.app.yml)
- 对象分组
- 图标和可见性
- 管理菜单
- 移动端配置

#### [13-micro-pages.md](./13-micro-pages.md)
**Micro Pages | 微页面**

Build custom pages using Amis framework:
- Page structure (.page.yml)
- Dashboard pages
- Report pages
- Custom forms
- Charts and visualizations

使用 Amis 框架构建自定义页面:
- 页面结构 (.page.yml)
- 仪表板页面
- 报表页面
- 自定义表单
- 图表和可视化

### 📊 Data Modeling | 数据建模

#### [05-objects.md](./05-objects.md)
**Object Definitions | 对象定义**

Define data models with ObjectQL:
- Object structure (.object.yml)
- Standard fields
- Object properties
- Relationships
- Complete examples

使用 ObjectQL 定义数据模型:
- 对象结构 (.object.yml)
- 标准字段
- 对象属性
- 关系
- 完整示例

#### [06-object-fields.md](./06-object-fields.md)
**Field Types Reference | 字段类型参考**

Master all field types and configurations:
- Text, number, date/time fields
- Selection and boolean fields
- Relationship fields (lookup, master-detail)
- Special fields (formula, summary, file)
- Field properties and validations

掌握所有字段类型和配置:
- 文本、数字、日期时间字段
- 选择和布尔字段
- 关系字段(查找、主从)
- 特殊字段(公式、汇总、文件)
- 字段属性和验证

#### [08-object-list-views.md](./08-object-list-views.md)
**List Views | 列表视图**

Configure list views for data display:
- List view structure
- Columns and filters
- Sorting and grouping
- Filter scopes
- Dynamic filters

配置列表视图以显示数据:
- 列表视图结构
- 列和筛选器
- 排序和分组
- 筛选范围
- 动态筛选器

### 🔒 Security | 安全

#### [09-object-permissions.md](./09-object-permissions.md)
**Permissions and Security | 权限和安全**

Control access with permission sets:
- Object-level permissions
- Record-level permissions
- Field-level permissions
- Permission profiles
- Dynamic permissions

使用权限集控制访问:
- 对象级权限
- 记录级权限
- 字段级权限
- 权限配置文件
- 动态权限

### ⚙️ Business Logic | 业务逻辑

#### [07-object-buttons.md](./07-object-buttons.md)
**Actions and Buttons | 操作和按钮**

Create custom actions and buttons:
- Action structure (.action.js)
- Record and list actions
- User interactions
- API integration
- Workflow automation

创建自定义操作和按钮:
- 操作结构 (.action.js)
- 记录和列表操作
- 用户交互
- API 集成
- 工作流自动化

#### [10-object-triggers.md](./10-object-triggers.md)
**Server-Side Triggers | 服务端触发器**

Implement business logic with triggers:
- Trigger lifecycle (.trigger.js)
- Before/after insert/update/delete
- Data validation
- Auto-fill fields
- External API calls
- Best practices

使用触发器实现业务逻辑:
- 触发器生命周期 (.trigger.js)
- 插入/更新/删除前后
- 数据验证
- 自动填充字段
- 外部 API 调用
- 最佳实践

#### [11-object-functions.md](./11-object-functions.md)
**Custom Functions | 自定义函数**

Create reusable functions:
- Function definition
- Usage in formulas and triggers
- Helper functions
- Complex calculations
- Data transformations

创建可复用函数:
- 函数定义
- 在公式和触发器中使用
- 辅助函数
- 复杂计算
- 数据转换

#### [12-object-micro-pages.md](./12-object-micro-pages.md)
**Object Micro Pages | 对象微页面**

Customize object detail and form pages:
- Object-specific pages
- Detail page layouts
- Custom form pages
- Dashboard pages
- Page configurations

自定义对象详情和表单页面:
- 对象特定页面
- 详情页布局
- 自定义表单页面
- 仪表板页面
- 页面配置

## How to Use | 如何使用

### For AI Coding Assistants | 用于 AI 编程助手

These skills are designed to work with AI coding assistants like:
- GitHub Copilot
- Cursor
- Claude
- ChatGPT

**Usage:**
1. Reference specific skill files in your prompts
2. AI assistants can read these files as context
3. Get accurate Steedos-specific code generation

**使用方法:**
1. 在提示词中引用特定的技能文件
2. AI 助手可以将这些文件作为上下文读取
3. 获得准确的 Steedos 特定代码生成

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

Follow the skills in order:
1. Start with Foundation (01-03)
2. Learn Data Modeling (05-06, 08)
3. Add Business Logic (07, 10-11)
4. Build UI (04, 12-13)
5. Secure Your App (09)

按顺序学习技能:
1. 从基础开始 (01-03)
2. 学习数据建模 (05-06, 08)
3. 添加业务逻辑 (07, 10-11)
4. 构建 UI (04, 12-13)
5. 保护应用 (09)

## Quick Reference | 快速参考

### By Task | 按任务

| What You Want to Do | Read This Skill |
|---------------------|----------------|
| Create a new Steedos project | 01-project-format.md |
| Create a package | 02-package-format.md |
| Configure environment | 03-environment-variables.md |
| Define data models | 05-objects.md, 06-object-fields.md |
| Create list views | 08-object-list-views.md |
| Add validation logic | 10-object-triggers.md |
| Create custom buttons | 07-object-buttons.md |
| Build dashboards | 13-micro-pages.md |
| Configure permissions | 09-object-permissions.md |
| Create custom pages | 12-object-micro-pages.md, 13-micro-pages.md |

### By File Type | 按文件类型

| File Type | Skill Reference |
|-----------|----------------|
| `package.json` | 01, 02 |
| `steedos-config.yml` | 01 |
| `.env` | 03 |
| `*.app.yml` | 04 |
| `*.object.yml` | 05, 06, 08, 09 |
| `*.action.js` | 07 |
| `*.trigger.js` | 10 |
| `*.page.yml` | 12, 13 |
| Functions | 11 |

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

## File Size Summary | 文件大小概览

```
01-project-format.md          ~7 KB   | Project structure
02-package-format.md         ~11 KB   | Package development
03-environment-variables.md   ~9 KB   | Environment config
04-applications.md           ~11 KB   | Application definitions
05-objects.md                ~16 KB   | Object definitions
06-object-fields.md          ~23 KB   | Field types reference
07-object-buttons.md         ~20 KB   | Actions and buttons
08-object-list-views.md      ~18 KB   | List views
09-object-permissions.md     ~19 KB   | Security and permissions
10-object-triggers.md        ~28 KB   | Server-side triggers
11-object-functions.md       ~17 KB   | Custom functions
12-object-micro-pages.md     ~23 KB   | Object pages
13-micro-pages.md            ~25 KB   | Standalone pages
───────────────────────────────────────
Total                       ~227 KB   | Complete documentation
```

## Contributing | 贡献

To improve these skills:

1. **Report Issues**: If you find errors or outdated information
2. **Suggest Improvements**: Share better examples or explanations
3. **Add Examples**: Contribute real-world use cases
4. **Translate**: Help with translations and localization

改进这些技能:

1. **报告问题**: 如果发现错误或过时信息
2. **建议改进**: 分享更好的示例或说明
3. **添加示例**: 贡献实际用例
4. **翻译**: 帮助翻译和本地化

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

## Version | 版本

**Version**: 1.0.0
**Last Updated**: 2026-04-13
**Steedos Platform Version**: 3.0.x

## License | 许可

These skills are part of the Steedos Platform project and follow the same MIT license.

这些技能是 Steedos 平台项目的一部分,遵循相同的 MIT 许可证。

---

<p align="center">
  <strong>🚀 Happy Coding with Steedos! 🚀</strong><br>
  <em>用 Steedos 加速你的开发! 🚀</em>
</p>
