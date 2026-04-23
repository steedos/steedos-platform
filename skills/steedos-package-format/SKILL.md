---
name: steedos-package-format
description: |
  Understand Steedos package structure and organization. Packages are
  self-contained modules with objects, business logic, and UI components using
  Moleculer microservices. Covers package.json setup, package.service.js entry
  point, complete metadata directory structure (objects, triggers, functions,
  buttons, pages, applications, tabs, workflows, approvalProcesses,
  permissionsets, profiles, roles, restrictionRules, imports), naming
  conventions, and metadata file types.
---

# Steedos Package Format | Steedos 软件包格式

## Overview | 概述

A Steedos package is a self-contained, reusable module containing objects, business logic, UI components, and configurations. Packages are the building blocks of Steedos applications.

Steedos 软件包是独立的、可复用的模块，包含对象、业务逻辑、UI 组件和配置。

## Technology Stack | 技术栈

- **Language**: JavaScript/TypeScript
- **Service Framework**: Moleculer microservices
- **Metadata Format**: YAML + JavaScript + JSON
- **Package Manager**: NPM/Yarn

## Package Structure | 软件包结构

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
            │           ├── submit_order.button.yml
            │           └── standard_delete.button.yml
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
            │   └── sales.permissionset.yml
            ├── profiles/         # User profiles (.profile.yml)
            │   └── user.profile.yml
            ├── roles/            # Role definitions (.role.yml)
            │   └── sales_manager.role.yml
            ├── workflows/        # Workflow field updates (.workflow.yml)
            │   └── orders.workflow.yml
            ├── approvalProcesses/ # Approval workflows (.approvalProcess.yml)
            │   └── order_approval.approvalProcess.yml
            ├── restrictionRules/ # Record access restrictions (.restrictionRule.yml)
            │   └── user_filter.restrictionRule.yml
            ├── dashboards/       # Dashboard configurations (.dashboard.yml)
            ├── questions/        # Report query definitions (.question.yml)
            ├── imports/          # Data import templates (.import.yml)
            └── client/           # Client-side JavaScript (.client.js)
```

## Required Files | 必需文件

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

## Metadata File Types | 元数据文件类型

| Type | Extension | Location | Description |
|------|-----------|----------|-------------|
| Object | `.object.yml` | `objects/{name}/` | Object schema |
| Field | `.field.yml` | `objects/{name}/fields/` | Field definitions |
| ListView | `.listview.yml` | `objects/{name}/listviews/` | List view configs |
| Permission | `.permission.yml` | `objects/{name}/permissions/` | Object permissions |
| Button | `.button.yml` | `objects/{name}/buttons/` | Custom buttons (amis_button) |
| Trigger | `.trigger.yml` | `triggers/` | Server-side event handlers |
| Function | `.function.yml` | `functions/` | Server-side functions (REST API) |
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
| Import | `.import.yml` | `imports/` | Data import templates |
| Client | `.client.js` | `client/` | Browser-side scripts |

## Naming Conventions | 命名规范

### Package Names
- Format: `@steedos-packages/[name]`
- Lowercase with hyphens: `@steedos-packages/contract-management`

### API Names (in YAML)
- Use `snake_case`: `orders`, `order_items`, `customer_name`

### File Names
- Objects: `{object_name}.object.yml`
- Fields: `{field_name}.field.yml`
- List Views: `{view_name}.listview.yml`
- Permissions: `{permission_set}.permission.yml`
- Buttons: `{button_name}.button.yml`
- Triggers: `{trigger_name}.trigger.yml`
- Functions: `{function_name}.function.yml`
- Pages: `{page_name}.page.yml` + `{page_name}.page.amis.json`
- Applications: `{app_code}.app.yml`

## Package Registration | 软件包注册

In project `steedos-config.yml`:

```yaml
metadata:
  - ./steedos-packages/my-package
```

Or as NPM dependency:

```yaml
metadata_packages:
  - '@steedos-packages/my-package'
```

## Best Practices | 最佳实践

1. **One package per business domain**: Group related objects and logic together
2. **Triggers in `triggers/` folder**: NOT inside object folders
3. **Functions in `functions/` folder**: NOT inside object folders
4. **Pages as file pairs**: Always create both `.page.yml` and `.page.amis.json`
5. **Separate metadata files**: Use individual `.field.yml`, `.listview.yml`, `.permission.yml`, `.button.yml` files instead of inline definitions
6. **Use `snake_case` for API names**: Objects, fields, functions, triggers
7. **Bilingual labels**: Provide both English and Chinese labels
