---
name: steedos-server-architecture
description: |
  TRIGGER when: user asks about HOW Steedos Server is built internally — NestJS
  module organization, Moleculer service setup, bootstrap sequence, Express
  middleware stack, AuthGuard/AdminGuard implementation, Socket.IO gateway,
  dependency injection patterns, or the @builder6/* package ecosystem; asks how
  to extend or contribute to the server source (builder6/server/src/); asks how
  NestJS modules, controllers, and services are wired together in Steedos.
  SKIP: user wants to USE the REST API (call endpoints) — use steedos-server-api
  or steedos-builder6-api; user wants to configure the server (env vars, YAML
  settings) — use steedos-server-config or steedos-builder6-config; user wants
  an overview of Steedos — use steedos-overview.
  Internal architecture reference for Steedos Server: NestJS 11 + Moleculer 0.14
  hybrid, module layout, bootstrap, middleware, guards, Socket.IO, Redis, and the
  @builder6 package ecosystem.
---

# Steedos Server Architecture | Steedos 服务端架构

## Overview | 概述

Steedos Server (`builder6/server`) is a NestJS + Moleculer hybrid backend that powers the Steedos low-code platform. It combines NestJS for HTTP/REST handling with Moleculer for microservice orchestration.

Steedos 服务端是基于 NestJS + Moleculer 的混合后端，为低代码平台提供 HTTP/REST 接口和微服务编排。

## Technology Stack | 技术栈

- **HTTP Framework**: NestJS 11 (Express adapter)
- **Microservices**: Moleculer 0.14
- **Real-time**: Socket.IO via `@nestjs/websockets`
- **Database**: MongoDB 3.7 via `@steedos/objectql`
- **Session Store**: Redis via `connect-redis` + `ioredis`
- **Cache**: Redis via Moleculer cacher
- **Auth**: Passport (local + OIDC) + JWT via `@builder6/core`
- **API Docs**: Swagger/OpenAPI at `/api/v6`

## Source Layout | 源码结构

```
builder6/server/
├── package.json                      # @steedos/server v3.0.x
├── default.steedos.settings.yml      # Default configuration template
├── steedos-config.yml                # Project-level config (optional)
├── plugins/                          # Dynamic plugin directory
└── src/
    ├── main.ts                       # Entry point → calls bootstrap()
    ├── bootstrap.ts                  # App creation, middleware, Swagger, static files
    ├── app.module.ts                 # Root NestJS module (25+ imports)
    ├── app.controller.ts             # Health checks, public settings
    ├── app.gateway.ts                # WebSocket gateway (Socket.IO)
    ├── app.moleculer.ts              # Moleculer service definition + events
    ├── config/
    │   ├── index.ts                  # Config export (getConfigs, getMoleculerConfigs)
    │   ├── steedos.config.ts         # YAML config loader with env interpolation
    │   └── moleculler.config.ts      # Moleculer broker settings
    ├── api/
    │   ├── api.module.ts             # API module
    │   └── data/
    │       ├── data.controller.ts    # CRUD at /api/v6/data/:objectName
    │       └── data.service.ts       # ObjectQL data access
    ├── objects/
    │   ├── objects.module.ts         # Objects module
    │   ├── objects.controller.ts     # GET /api/v6/objects/:objectApiName
    │   ├── objects.service.ts        # ObjectQL schema access + function runner
    │   └── functions.controller.ts   # GET|POST /api/v6/functions/:obj/:func
    └── workflow/
        ├── workflow.module.ts        # Workflow module
        ├── file.controller.ts        # File upload endpoint
        ├── file.service.ts           # File processing
        └── file.moleculer.ts         # Moleculer file service
```

## NestJS Modules | NestJS 模块

The root `AppModule` imports 25+ modules:

| Module | Package | Purpose |
|--------|---------|---------|
| `ConfigModule` | `@nestjs/config` | Environment/config loading |
| `LoggerModule` | `nestjs-pino` | Structured logging |
| `ScheduleModule` | `@nestjs/schedule` | Cron/task scheduling |
| `MoleculerModule` | `@builder6/moleculer` | Moleculer broker integration |
| `AuthModule` | `@builder6/core` | Authentication guards + strategies |
| `MongodbModule` | `@builder6/core` | MongoDB connection management |
| `SteedosModule` | `@builder6/steedos` | Core Steedos metadata + ObjectQL |
| `TablesModule` | `@builder6/tables` | Data table management |
| `FilesModule` | `@builder6/files` | File upload/download |
| `EmailModule` | `@builder6/email` | Email services |
| `PagesModule` | `@builder6/pages` | Micro page management |
| `RoomsModule` | `@builder6/rooms` | Real-time collaboration rooms |
| `ServicesModule` | `@builder6/services` | Microservice management |
| `SharepointModule` | `@builder6/sharepoint` | SharePoint integration |
| `OidcModule` | `@builder6/oidc` | OpenID Connect client |
| `OnlyOfficeModule` | `@builder6/onlyoffice` | Office document editing |
| `DocsModule` | `@builder6/docs` | Documentation services |
| `AiModule` | `@steedos/ai` | AI features |
| `PluginModule` | `@builder6/core` | Dynamic plugin loading |
| `MicroserviceModule` | `@builder6/microservices` | Inter-service communication |
| `ApiModule` | (local) | REST data API |
| `ObjectsModule` | (local) | Object metadata + functions API |
| `WorkflowModule` | (local) | File upload workflow |

## Bootstrap Sequence | 启动流程

```
main.ts → bootstrap()
  1. NestFactory.create<NestExpressApplication>(AppModule)
  2. Connect Redis cluster microservice transport
  3. Set up Logger (pino), GlobalFilters (AllExceptionsFilter)
  4. Set up HybridAdapter for WebSocket
  5. Enable CORS (all origins, credentials: true)
  6. Create Redis session store
  7. Apply Express middleware stack (see below)
  8. Configure Swagger at /api/v6
  9. Set up cloud proxy if STEEDOS_CLOUD_URL is set
  10. Start all microservices
  11. Mount static router (@steedos/router)
  12. Serve @steedos/webapp SPA (frontend routes → index.html)
  13. Listen on B6_PORT (default: 5100)
```

## Middleware Stack | 中间件栈

Applied in order during bootstrap:

1. **Session** — Redis-backed via `connect-redis` (prefix: `steedos-session:`)
2. **Cookie Parser** — `cookie-parser`
3. **JSON Body** — `express.json()` (limit: 50mb)
4. **URL Encoded** — `express.urlencoded()` (limit: 100mb)
5. **Compression** — `compression()`
6. **Cloud Proxy** — `http-proxy-middleware` → `STEEDOS_CLOUD_URL/api/cloud` (if configured)
7. **Static Router** — `@steedos/router` for platform static assets
8. **SPA Fallback** — `@steedos/webapp` index.html with injected `BUILDER6_PUBLIC_SETTINGS`

## Guards | 认证守卫

| Guard | Package | Usage |
|-------|---------|-------|
| `AuthGuard` | `@builder6/core` | Applied to all data/objects/functions controllers |
| `AdminGuard` | `@builder6/core` | Available for admin-only endpoints |

Authentication uses cookie-based tokens: `X-Space-Id` + `X-Auth-Token` headers/cookies.

## ObjectQL Data Access Pattern | ObjectQL 数据访问模式

All data operations go through `@steedos/objectql`:

```typescript
import { getObject } from "@steedos/objectql";

const obj = getObject("orders");
await obj.find(query, userSession);
await obj.findOne(id, userSession);
await obj.insert(doc, userSession);
await obj.update(id, data, userSession);
await obj.delete(id, userSession);
await obj.runFunction(functionApiName, params, userSession);
```

The `userSession` parameter enforces permission checks based on the authenticated user.

## Edition System | 版本系统

The server supports three editions based on environment configuration:

| Edition | Condition | Services |
|---------|-----------|----------|
| Community (ce) | Default | `@steedos/service-community` |
| Enterprise (ee) | `STEEDOS_LICENSE` set | + `@steedos/service-license` + `@steedos/service-enterprise` |
| Cloud | `STEEDOS_TENANT_ENABLE_SAAS=true` | Same as Enterprise |

## Development Commands | 开发命令

```bash
# Build
nest build

# Development with hot reload
nest start --watch

# Debug mode
nest start --debug --watch

# Production
node dist/main

# Lint
eslint "{src,apps,libs,test}/**/*.ts" --fix

# Format
prettier --write "src/**/*.ts"

# Moleculer REPL (debugging)
moleculer connect --config ./steedos.config.js
```
