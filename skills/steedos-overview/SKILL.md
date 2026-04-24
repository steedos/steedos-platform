---
name: steedos-overview
description: |
  Steedos Platform overview and skill routing guide. Introduces the platform's
  core capabilities (metadata-driven objects, Amis UI, Moleculer microservices,
  REST API) and maps tasks to the correct skills. Load this skill first to
  understand what Steedos is and which skills to use for a given task.
---

# Steedos Platform Overview | Steedos 平台概览

## What is Steedos? | 什么是 Steedos?

Steedos (华炎魔方) is an enterprise low-code platform for building business applications. Developers define data models, UI, permissions, and business logic through YAML metadata files, and the platform generates a full-stack application with REST API, real-time WebSocket, and a React + Amis frontend.

Steedos（华炎魔方）是一个企业级低代码平台。开发者通过 YAML 元数据文件定义数据模型、UI、权限和业务逻辑，平台自动生成包含 REST API、实时 WebSocket 和 React + Amis 前端的全栈应用。

## Technology Stack | 技术栈

- **Runtime**: Node.js + TypeScript
- **Backend**: NestJS 11 + Moleculer 0.14 microservices
- **Frontend**: React + Amis (Baidu low-code UI framework)
- **Database**: MongoDB / PostgreSQL / MySQL
- **Metadata**: YAML files (.object.yml, .button.yml, .trigger.yml, etc.)
- **NOT Python** — all server-side code is JavaScript/TypeScript

## Core Concepts | 核心概念

1. **Objects** — Database tables defined in YAML (.object.yml), with fields, relationships, and standard audit columns
2. **Metadata Files** — YAML files that declare UI, logic, and security; deployed via CLI or file sync
3. **Packages** — Self-contained modules (steedos-packages/*) that bundle objects, triggers, pages, and permissions
4. **Triggers** — Server-side JavaScript hooks that run before/after data operations (insert, update, delete)
5. **Functions** — Server-side JavaScript functions exposed as REST API endpoints
6. **Micro Pages** — Custom UI pages built with the Amis JSON schema framework
7. **Builder6 Server** — The NestJS-based runtime that serves the REST API, WebSocket, and plugin system

## Skill Routing | 技能路由

### By Task | 按任务选择技能

**"I want to create a new project"**
→ [steedos-project-format](../steedos-project-format/SKILL.md) → [steedos-package-format](../steedos-package-format/SKILL.md) → [steedos-environment-variables](../steedos-environment-variables/SKILL.md)

**"I want to understand built-in objects"**
→ [steedos-builtin-objects](../steedos-builtin-objects/SKILL.md) (core objects: users, spaces, organizations, permission_set, apps, accounts, contacts, tasks, etc.)

**"I want to define data models and fields"**
→ [steedos-objects](../steedos-objects/SKILL.md) → [steedos-object-fields](../steedos-object-fields/SKILL.md) → [steedos-object-list-views](../steedos-object-list-views/SKILL.md)

**"I want to add business logic"**
→ [steedos-object-triggers](../steedos-object-triggers/SKILL.md) (event hooks) → [steedos-object-functions](../steedos-object-functions/SKILL.md) (REST-exposed functions) → [steedos-object-buttons](../steedos-object-buttons/SKILL.md) (UI actions)

**"I want to build UI pages"**
→ [steedos-micro-pages](../steedos-micro-pages/SKILL.md) (standalone pages) → [steedos-object-micro-pages](../steedos-object-micro-pages/SKILL.md) (object detail/form pages) → [steedos-applications](../steedos-applications/SKILL.md) + [steedos-tabs](../steedos-tabs/SKILL.md) (navigation)

**"I want to develop custom React amis components"**
→ [steedos-webapps](../steedos-webapps/SKILL.md) (React + Vite webapps in packages with IIFE amis Renderer registration)

**"I want to set up permissions and i18n"**
→ [steedos-object-permissions](../steedos-object-permissions/SKILL.md) → [steedos-translations](../steedos-translations/SKILL.md)

**"I want to create dashboards and reports"**
→ [steedos-dashboards](../steedos-dashboards/SKILL.md) → [steedos-questions](../steedos-questions/SKILL.md) (requires enterprise license)

**"I want to load seed data"**
→ [steedos-seed-data](../steedos-seed-data/SKILL.md)

**"I want to use the CLI"**
→ [steedos-cli-commands](../steedos-cli-commands/SKILL.md) (start, deploy, import/export)

**"I want to use the REST or GraphQL API"**
→ [steedos-server-api](../steedos-server-api/SKILL.md) (REST) → [steedos-graphql-api](../steedos-graphql-api/SKILL.md) (GraphQL)

**"I want to understand the server"**
→ [steedos-server-architecture](../steedos-server-architecture/SKILL.md) → [steedos-server-api](../steedos-server-api/SKILL.md) → [steedos-graphql-api](../steedos-graphql-api/SKILL.md) → [steedos-server-config](../steedos-server-config/SKILL.md) → [steedos-server-moleculer](../steedos-server-moleculer/SKILL.md) → [steedos-server-websocket](../steedos-server-websocket/SKILL.md)

**"I want to work with Builder6 internals"**
→ [steedos-builder6-architecture](../steedos-builder6-architecture/SKILL.md) → [steedos-builder6-api](../steedos-builder6-api/SKILL.md) → [steedos-builder6-config](../steedos-builder6-config/SKILL.md) → [steedos-builder6-tables](../steedos-builder6-tables/SKILL.md) → [steedos-auth](../steedos-auth/SKILL.md) → [steedos-files](../steedos-files/SKILL.md) → [steedos-plugin](../steedos-plugin/SKILL.md)

### Typical Development Flow | 典型开发流程

```
1. steedos-project-format    → Create project structure
2. steedos-objects            → Define data models
3. steedos-object-fields      → Add fields and relationships
4. steedos-object-triggers    → Add validation and automation
5. steedos-object-buttons     → Add custom actions
6. steedos-object-list-views  → Configure list displays
7. steedos-applications       → Create app with navigation
8. steedos-tabs               → Define tabs for the app
9. steedos-object-permissions → Set up access control
10. steedos-translations      → Add i18n labels
11. steedos-cli-commands      → Deploy and manage
```

### All Skills | 全部技能一览

| Category | Skills |
|----------|--------|
| Foundation | steedos-project-format, steedos-package-format, steedos-environment-variables, steedos-cli-commands |
| Data Modeling | steedos-builtin-objects, steedos-objects, steedos-object-fields, steedos-object-list-views |
| Business Logic | steedos-object-triggers, steedos-object-functions, steedos-object-buttons, steedos-object-micro-pages |
| UI & Apps | steedos-applications, steedos-tabs, steedos-micro-pages, steedos-webapps |
| Analytics | steedos-dashboards, steedos-questions |
| Security | steedos-object-permissions |
| i18n | steedos-translations |
| Data | steedos-seed-data |
| Server | steedos-server-architecture, steedos-server-api, steedos-graphql-api, steedos-server-config, steedos-server-moleculer, steedos-server-websocket |
| Builder6 | steedos-builder6-architecture, steedos-builder6-api, steedos-builder6-config, steedos-builder6-tables, steedos-auth, steedos-files, steedos-plugin |

## Key File Types | 关键文件类型

| Extension | Purpose | Skill |
|-----------|---------|-------|
| `.object.yml` | Object definition | steedos-objects |
| `.field.yml` | Field definition | steedos-object-fields |
| `.trigger.yml` | Server trigger | steedos-object-triggers |
| `.function.yml` | Server function | steedos-object-functions |
| `.button.yml` | Custom button | steedos-object-buttons |
| `.listview.yml` | List view | steedos-object-list-views |
| `.app.yml` | Application | steedos-applications |
| `.tab.yml` | Navigation tab | steedos-tabs |
| `.page.yml` + `.page.amis.json` | Micro page | steedos-micro-pages |
| `.permission.yml` | Permission set | steedos-object-permissions |
| `.translation.yml` | Translation | steedos-translations |
| `.data.yml` / `.data.json` | Seed data | steedos-seed-data |

## Install | 安装

```bash
npx skills add steedos/steedos-platform --all
npx skills add steedos/steedos-platform --skill steedos-overview
```
