---
name: steedos-getting-started
description: |
  Steedos Platform overview, skill routing guide, and CLI commands.
  TRIGGER: new to Steedos, "what is Steedos", "where do I start";
  which skill to use; no specific skill matches; Steedos CLI
  (steedos start, restart, deploy, import/export); package validation.
  SKIP: specific task identified → route to relevant skill directly.
  Orientation/routing guide ONLY, not for implementation details.
---

# Steedos Platform Overview | Steedos 平台概览

## What is Steedos? | 什么是 Steedos?

Steedos (华炎魔方) is an enterprise low-code platform for building business applications. Developers define data models, UI, permissions, and business logic through YAML metadata files, and the platform generates a full-stack application with REST API, real-time WebSocket, and a React + Amis frontend.

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
4. **Triggers** — Server-side JavaScript hooks that run before/after data operations
5. **Functions** — Server-side JavaScript functions exposed as REST API endpoints
6. **Micro Pages** — Custom UI pages built with the Amis JSON schema framework
7. **Builder6 Server** — The NestJS-based runtime that serves the REST API, WebSocket, and plugin system

## Skill Routing | 技能路由

### By Task | 按任务选择技能

**"I want to create a new project"**
→ steedos-project-package → steedos-configuration

**"I want to understand built-in objects"**
→ steedos-builtin-objects (core objects: users, spaces, organizations, permission_set, apps, etc.)

**"I want to define data models and fields"**
→ steedos-objects → steedos-object-fields

**"I want to add business logic"**
→ steedos-server-logic (triggers + functions) → steedos-object-buttons (UI actions)

**"I want to build UI pages"**
→ steedos-pages (standalone + object-bound pages) → steedos-applications + steedos-tabs (navigation)

**"I want to develop custom React amis components"**
→ steedos-webapps (React + Vite webapps with IIFE amis Renderer registration)

**"I want to set up permissions and i18n"**
→ steedos-object-permissions → steedos-translations

**"I want to create dashboards and reports"**
→ steedos-analytics (questions + dashboards, requires enterprise license)

**"I want to load seed data"**
→ steedos-seed-data

**"I want to use the REST or GraphQL API"**
→ steedos-server-api (REST) → steedos-graphql-api (GraphQL)

**"I want to understand the server"**
→ steedos-server-internals → steedos-server-api → steedos-graphql-api

**"I want to work with Builder6 internals"**
→ steedos-builder6-internals → steedos-builder6-api → steedos-builder6-modules

### Typical Development Flow | 典型开发流程

```
1. steedos-project-package   → Create project structure
2. steedos-objects            → Define data models
3. steedos-object-fields      → Add fields and relationships
4. steedos-server-logic       → Add triggers and functions
5. steedos-object-buttons     → Add custom actions
6. steedos-applications       → Create app with navigation
7. steedos-tabs               → Define tabs for the app
8. steedos-object-permissions → Set up access control
9. steedos-translations       → Add i18n labels
10. CLI commands below         → Deploy and manage
```

### All Skills | 全部技能一览

| Category | Skills |
|----------|--------|
| Foundation | steedos-project-package, steedos-configuration, steedos-getting-started |
| Data Modeling | steedos-builtin-objects, steedos-objects, steedos-object-fields |
| Business Logic | steedos-server-logic, steedos-object-buttons, steedos-pages |
| UI & Apps | steedos-applications, steedos-tabs, steedos-webapps |
| Analytics | steedos-analytics |
| Security | steedos-object-permissions |
| i18n | steedos-translations |
| Data | steedos-seed-data |
| Server | steedos-server-api, steedos-graphql-api, steedos-server-internals |
| Builder6 | steedos-builder6-internals, steedos-builder6-api, steedos-builder6-modules |

## Key File Types | 关键文件类型

| Extension | Purpose | Skill |
|-----------|---------|-------|
| `.object.yml` | Object definition | steedos-objects |
| `.field.yml` | Field definition | steedos-object-fields |
| `.trigger.yml` | Server trigger | steedos-server-logic |
| `.function.yml` | Server function | steedos-server-logic |
| `.button.yml` | Custom button | steedos-object-buttons |
| `.listview.yml` | List view | steedos-objects |
| `.app.yml` | Application | steedos-applications |
| `.tab.yml` | Navigation tab | steedos-tabs |
| `.page.yml` + `.page.amis.json` | Micro page | steedos-pages |
| `.permission.yml` | Permission set | steedos-object-permissions |
| `.translation.yml` | Translation | steedos-translations |
| `.data.yml` / `.data.json` | Seed data | steedos-seed-data |

---

# CLI Commands | 命令行工具

## Overview | 概述

The Steedos CLI (`steedos`) is an oclif-based command-line tool for managing Steedos projects. It provides commands for starting/restarting servers, managing source code, importing/exporting data, and package operations.

## Commands Reference | 命令参考

### steedos start

Start the Steedos server. Writes a PID file (`.steedos.pid`) to the current working directory.

```bash
steedos start
```

**Behavior:**
- Resolves and loads `@steedos/server` module
- Writes current process PID to `.steedos.pid`
- Registers signal handlers (SIGINT, SIGTERM) to clean up PID file on exit
- Calls `server.bootstrap()` to start the server

### steedos restart

Stop the running Steedos instance and start a new one. Designed for **local development**, especially AI-assisted development workflows.

```bash
steedos restart
```

**Behavior:**
1. Reads `.steedos.pid` to find the running process
2. Sends `SIGTERM` to gracefully stop
3. Waits up to 30 seconds; if timeout, sends `SIGKILL`
4. Starts a new server instance (same as `steedos start`)

**Important**: Local development only — not for Docker/cluster deployments.

### steedos package:start

Run Steedos packages as Moleculer microservices. Supports clustering and hot reload.

```bash
steedos package:start [--instances <count|max>] [--hot]
```

### steedos source:deploy

Deploy local source metadata to the metadata server.

```bash
steedos source:deploy -p <path>
```

### steedos source:retrieve

Retrieve source metadata from the metadata server to local.

```bash
steedos source:retrieve -p <path>
```

### steedos source:config

Configure the metadata server connection (interactive).

```bash
steedos source:config
```

### steedos source:convert

Convert legacy format files to the modern source format.

```bash
steedos source:convert -p <path>
```

### steedos source:merge

Merge split object-related files into a single `.object.yml` file.

```bash
steedos source:merge -p <path>
```

### steedos data:export

Export object data to JSON files.

```bash
steedos data:export -o <objectName> [-i <ids>] [-f <fields>]
```

### steedos data:import

Import data from JSON files or plan files.

```bash
steedos data:import -p <path>
```

### steedos auth:login

Authenticate with the metadata server.

```bash
steedos auth:login -u <username> -p <password>
```

### steedos i18n

Sync internationalization resources.

```bash
steedos i18n
```

### steedos package:build

Build/compress a Steedos package.

```bash
steedos package:build
```

## PID File Management

- **Location**: `{project_root}/.steedos.pid`
- **Created**: On `steedos start` or `steedos restart`
- **Removed**: On process exit (SIGINT, SIGTERM, or normal exit)
- Add `.steedos.pid` to `.gitignore`

## Deployment Contexts | 部署场景

| Context | Restart Method | Notes |
|---------|---------------|-------|
| Local development | `steedos restart` | Uses PID file, foreground process |
| Docker single container | supervisord `autorestart` | `steedos start` managed by supervisord |
| Docker Swarm / K8s | Orchestrator rolling update | `docker service update` or `kubectl rollout` |
| Moleculer microservice | `steedos package:start --hot` | Hot reload for development |

---

# Package Validation | 软件包校验

After creating or modifying a Steedos package, run the validator to check all files.

## Usage | 使用方法

```bash
# Validate a single package
npx @steedos/validate steedos-packages/my-package

# JSON output (for CI)
npx @steedos/validate steedos-packages/my-package --json
```

Or install as a dev dependency:

```json
{
  "devDependencies": {
    "@steedos/validate": "latest"
  },
  "scripts": {
    "validate": "steedos-validate"
  }
}
```

## What is Validated | 校验内容

| File Type | Key Checks |
|-----------|------------|
| Package structure | `package.json` with `main: package.service.js`; `package.service.js` with `packageLoader` |
| `.object.yml` | Required: `name`, `label`, `icon`; name matches folder; name must be prefixed `{org_code}_{project_code}_`; must have a `name` field or `is_name` field |
| `.field.yml` | Required: `name`, `type`, `label`; name matches filename; valid field type |
| `.trigger.yml` | Required: `name`, `listenTo`, `when`, `type`, `isEnabled`, `handler`; `type` must be `"code"`; must be in `triggers/` folder |
| `.function.yml` | Required: `name`, `objectApiName`, `isEnabled`, `is_rest`, `script`; must be in `functions/` folder |
| `.button.yml` | Required: `name`, `label`, `on`, `amis_schema`; `type` must be `"amis_button"`; root `type` must be `"service"` |
| `.listview.yml` | Required: `name`, `label` |
| `.permission.yml` | Required: `name` or `permission_set_id` |
| `.app.yml` | Required: `name`, `code`; code must be prefixed `{org_code}_{project_code}_` |
| `.tab.yml` | Required: `name`, `label` |
| `.page.yml` | Must have matching `.page.amis.json` |

## Common Errors | 常见错误

| Error | Fix |
|-------|-----|
| `button.amis-root-service` | Wrap amis_schema with `{"type":"service","body":{...}}` |
| `trigger.location` | Move trigger files to `main/default/triggers/` |
| `function.location` | Move function files to `main/default/functions/` |
| `field.name-mismatch` | File name must match `name` field value |
| `button.no-label_zh` | Remove `label_zh`, use i18n translation files instead |
| `page.missing-amis` | Create matching `.page.amis.json` file |
| `object.name-prefix` | Object `name` must start with `{org_code}_{project_code}_` |
| `app.code-prefix` | App `code` must start with `{org_code}_{project_code}_` |

## Install Skills | 安装技能

```bash
npx skills add steedos/steedos-platform --all
npx skills add steedos/steedos-platform --skill steedos-getting-started
```
