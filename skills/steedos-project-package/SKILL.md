---
name: steedos-project-package
description: |
  Steedos project/package init & creation (初始化项目, 创建软件包), pnpm install/start (NEVER npm).
---

# Steedos Project & Package Format | Steedos 项目与软件包格式

## Overview | 概述

A **project** is a Node.js/TypeScript workspace that runs the Steedos platform. A **package** is a self-contained, reusable module within the project containing objects, business logic, and UI components.

**项目**是运行 Steedos 平台的 Node.js 工作区。**软件包**是项目内独立的可复用模块。

## Technology Stack | 技术栈

- **Platform**: Steedos (华炎魔方) - Enterprise Low-Code Platform
- **Backend**: Node.js + TypeScript + Moleculer microservices
- **Frontend**: React + Amis (Baidu low-code UI framework)
- **Metadata**: YAML files (.object.yml, .trigger.yml, .function.yml, etc.)
- **Databases**: MongoDB (metadata), PostgreSQL/MySQL (business data)
- **Package Manager**: pnpm (⚠️ 禁止使用 npm)

## ⚠️ CRITICAL: Package Manager

**ALWAYS use `pnpm`. NEVER use `npm`.**

| Action | ✅ Correct | ❌ Wrong |
|--------|-----------|----------|
| Init | `pnpm init` | `npm init -y` |
| Install | `pnpm install` / `pnpm add <pkg>` | `npm install` / `npm i` |
| Start | `pnpm start` | `npm start` / `npm run start` |
| Run script | `pnpm <script>` | `npm run <script>` |
| Add dep | `pnpm add @steedos/server` | `npm install @steedos/server` |

---

# Part 1: Project Structure | 项目结构

## Minimal Project Structure | 最小项目结构

```
my-steedos-project/
├── package.json              # NPM package configuration (REQUIRED)
├── .env                      # Environment variables (RECOMMENDED)
├── .gitignore               # Git ignore rules
└── steedos-packages/        # Custom packages (OPTIONAL)
    └── my-package/
        └── ...
```

## Required Files | 必需文件

### 1. package.json (REQUIRED)

```json
{
  "name": "my-steedos-project",
  "version": "0.0.1",
  "private": true,
  "workspaces": [
    "steedos-packages/*"
  ],
  "scripts": {
    "start": "steedos start",
    "build": "lerna run build"
  },
  "dependencies": {
    "@steedos/server": "latest"
  }
}
```

**Key Points:**
- `@steedos/server` dependency is REQUIRED
- `workspaces` for custom packages
- `start` script to run Steedos (use `pnpm start`)

### 2. .env (RECOMMENDED)

```env
PORT=5100
ROOT_URL=http://localhost:5100
MONGO_URL=mongodb://127.0.0.1:27017/steedos
TRANSPORTER=redis://127.0.0.1:6379
CACHER=redis://127.0.0.1:6379/1
STEEDOS_STORAGE_DIR=./steedos-storage
B6_LOG_LEVEL=warn
```

## Complete Project Structure | 完整项目结构

```
my-steedos-project/
├── package.json
├── .env
├── .gitignore
├── pnpm-lock.yaml
├── node_modules/
├── steedos-storage/
└── steedos-packages/
    ├── package-1/
    │   ├── package.json
    │   ├── package.service.js
    │   └── main/default/
    │       ├── objects/
    │       ├── applications/
    │       ├── triggers/
    │       └── pages/
    └── package-2/
        └── ...
```

## Installation & Setup | 安装和设置

```bash
# Step 1: Create project
mkdir my-steedos-project && cd my-steedos-project

# Step 2: Initialize
pnpm init

# Step 3: Install dependencies
pnpm add @steedos/server

# Step 4: Start server
pnpm start
```

Or use the CLI:

```bash
pnpm add --global @steedos/cli
steedos create my-project
cd my-project && pnpm start
```

## Git Configuration | Git 配置

Recommended .gitignore:

```
node_modules/
.pnpm-store/
.env
.env.local
steedos-storage/
.steedos/
logs/
*.log
dist/
build/
.cache/
```

---

# Part 2: Package Structure | 软件包结构

## Package Directory Layout | 软件包目录结构

```
steedos-packages/
└── my-package/
    ├── package.json              # NPM package configuration
    ├── package.service.js        # Moleculer service entry point
    └── main/
        └── default/
            ├── objects/          # Object definitions
            │   └── orders/
            │       ├── orders.object.yml
            │       ├── fields/
            │       │   ├── order_number.field.yml
            │       │   └── customer.field.yml
            │       ├── listviews/
            │       │   ├── all.listview.yml
            │       │   └── my_orders.listview.yml
            │       ├── permissions/
            │       │   ├── user.permission.yml
            │       │   └── admin.permission.yml
            │       └── buttons/
            │           └── submit_order.button.yml
            ├── triggers/         # Server-side triggers (.trigger.yml)
            │   └── orders_validate.trigger.yml
            ├── functions/        # Server-side functions (.function.yml)
            │   └── approve_order.function.yml
            ├── applications/     # Application definitions (.app.yml)
            │   └── order_management.app.yml
            ├── tabs/             # Navigation tabs (.tab.yml)
            │   └── orders.tab.yml
            ├── pages/            # Custom pages (.page.yml + .page.amis.json)
            │   ├── order_detail.page.yml
            │   └── order_detail.page.amis.json
            ├── permissionsets/   # Permission set definitions (.permissionset.yml)
            ├── profiles/         # User profiles (.profile.yml)
            ├── roles/            # Role definitions (.role.yml)
            ├── workflows/        # Workflow field updates (.workflow.yml)
            ├── approvalProcesses/ # Approval workflows (.approvalProcess.yml)
            ├── restrictionRules/ # Record access restrictions (.restrictionRule.yml)
            ├── dashboards/       # Dashboard configurations (.dashboard.yml)
            ├── questions/        # Report queries (.question.yml)
            ├── translations/     # Translation files
            ├── data/             # Seed data (.data.json/.data.yml/.data.csv)
            └── imports/          # Data import templates (.import.yml)
```

## Required Package Files | 必需的软件包文件

### 1. package.json

```json
{
  "name": "@steedos-packages/my-package",
  "version": "1.0.0",
  "description": "My Steedos Package",
  "main": "package.service.js"
}
```

### 2. package.service.js

```javascript
"use strict";
const project = require('./package.json');
const packageName = project.name;
const packageLoader = require('@steedos/service-package-loader');

module.exports = {
    name: packageName,
    namespace: "steedos",
    mixins: [packageLoader],
    settings: {
        packageInfo: {
            path: __dirname,
            name: packageName,
            isPackage: true
        }
    }
};
```

## Package Registration | 软件包注册

Register packages as NPM dependencies or in the project workspace configuration.

## Metadata File Types | 元数据文件类型

| Type | Extension | Location | Description |
|------|-----------|----------|-------------|
| Object | `.object.yml` | `objects/{name}/` | Object schema |
| Field | `.field.yml` | `objects/{name}/fields/` | Field definitions |
| ListView | `.listview.yml` | `objects/{name}/listviews/` | List view configs |
| Permission | `.permission.yml` | `objects/{name}/permissions/` | Object permissions |
| Button | `.button.yml` | `objects/{name}/buttons/` | Custom buttons |
| Trigger | `.trigger.yml` | `triggers/` | Server-side event handlers |
| Function | `.function.yml` | `functions/` | Server-side functions |
| Page | `.page.yml` + `.page.amis.json` | `pages/` | Custom UI pages |
| Application | `.app.yml` | `applications/` | App definitions |
| Tab | `.tab.yml` | `tabs/` | Navigation tabs |
| PermissionSet | `.permissionset.yml` | `permissionsets/` | Permission groupings |
| Profile | `.profile.yml` | `profiles/` | User profile templates |
| Role | `.role.yml` | `roles/` | Role definitions |
| Workflow | `.workflow.yml` | `workflows/` | Field update workflows |
| ApprovalProcess | `.approvalProcess.yml` | `approvalProcesses/` | Multi-step approvals |
| RestrictionRule | `.restrictionRule.yml` | `restrictionRules/` | Record access rules |
| Dashboard | `.dashboard.yml` | `dashboards/` | Dashboard layouts |
| Question | `.question.yml` | `questions/` | Report queries |

## Naming Conventions | 命名规范

| Type | Convention | Example |
|------|-----------|---------|
| Package name | `@steedos-packages/[name]` (lowercase, hyphens) | `@steedos-packages/contract-management` |
| API names (YAML) | `snake_case` | `orders`, `order_items`, `customer_name` |
| Object file | `{object_name}.object.yml` | `orders.object.yml` |
| Field file | `{field_name}.field.yml` | `order_number.field.yml` |
| Trigger file | `{trigger_name}.trigger.yml` | `orders_validate.trigger.yml` |
| Function file | `{function_name}.function.yml` | `approve_order.function.yml` |
| Page files | `{page_name}.page.yml` + `.page.amis.json` | `order_detail.page.yml` |
| Application file | `{app_code}.app.yml` | `order_management.app.yml` |

## Best Practices | 最佳实践

1. **One package per business domain**: Group related objects and logic together
2. **Triggers in `triggers/` folder**: NOT inside object folders
3. **Functions in `functions/` folder**: NOT inside object folders
4. **Pages as file pairs**: Always create both `.page.yml` and `.page.amis.json`
5. **Use `snake_case` for API names**: Objects, fields, functions, triggers
6. **Bilingual labels**: Provide both English and Chinese labels
7. **Validate after creation**: Run `npx @steedos/validate <packagePath>` to catch issues early

## Troubleshooting | 故障排除

### Server won't start
- Verify MongoDB and Redis are running
- Check `.env` configuration

### Packages not loading
- Verify package structure (package.json + package.service.js)
- Restart server after changes

### Port already in use
- Change `PORT` in `.env`
- Kill existing process: `lsof -ti:5100 | xargs kill`
