---
name: steedos-builder6-architecture
description: |
  Builder6 Server architecture overview. NestJS 11 + Moleculer 0.14 hybrid
  monorepo with 20+ @builder6/* packages. Covers module organization
  (AppModule.forRoot), bootstrap sequence, middleware stack (Redis session,
  cookie parser, compression, CORS), WebSocket (Socket.IO HybridAdapter),
  Swagger/OpenAPI at /api/v6, guards (AuthGuard, AdminGuard), Nx/Lerna
  workspace, and development commands (start:dev, build, lint).
---

# Builder6 Server Architecture | Builder6 服务端架构

## Overview | 概述

Builder6 Server is a NestJS + Moleculer hybrid backend monorepo powering the Builder6/Steedos low-code platform. It uses Nx + Lerna for workspace management with 20+ specialized `@builder6/*` packages.

## Technology Stack | 技术栈

- **HTTP Framework**: NestJS 11 (Express adapter)
- **Microservices**: Moleculer 0.14
- **Real-time**: Socket.IO via `@nestjs/websockets` (HybridAdapter)
- **Database**: MongoDB via `MongodbService`
- **Session Store**: Redis via `connect-redis` + `ioredis`
- **Cache/Transport**: Redis via Moleculer
- **Auth**: JWT + session tokens via `@builder6/core`
- **API Docs**: Swagger/OpenAPI at `/api/v6`
- **Build**: Nx 22 + Lerna 9
- **Package Manager**: Yarn 3.8 (workspaces)

## Monorepo Structure | Monorepo 结构

```
builder6-server/
├── package.json                # Root workspace config
├── nx.json                     # Nx build config
├── lerna.json                  # Lerna monorepo config
├── tsconfig.json               # Base TypeScript config
├── .env                        # Environment variables
└── packages/
    ├── server/                 # Main entry point (@builder6/server)
    │   ├── src/
    │   │   ├── main.ts         # Entry → bootstrap()
    │   │   ├── index.ts        # getNestExpressApplication() + bootstrap()
    │   │   └── app.module.ts   # AppModule.forRoot() with all imports
    │   └── public/             # Static assets
    ├── core/                   # @builder6/core (auth, config, mongodb, plugins, filters, websockets)
    ├── tables/                 # @builder6/tables (data table CRUD with DataLoader)
    ├── files/                  # @builder6/files (file upload: local + S3)
    ├── pages/                  # @builder6/pages (micro page management)
    ├── email/                  # @builder6/email (SMTP + queue)
    ├── rooms/                  # @builder6/rooms (real-time collaboration)
    ├── docs/                   # @builder6/docs (collaborative documents)
    ├── moleculer/              # @builder6/moleculer (NestJS-Moleculer bridge)
    ├── microservices/          # @builder6/microservices (service management)
    ├── services/               # @builder6/services (service API)
    ├── steedos/                # @builder6/steedos (Steedos metadata + ObjectQL)
    ├── oidc/                   # @builder6/oidc (OIDC client)
    ├── oidc-provider/          # @builder6/oidc-provider (OIDC server)
    ├── onlyoffice/             # @builder6/onlyoffice (document editing)
    ├── sharepoint/             # @builder6/sharepoint (SharePoint integration)
    ├── node-red/               # @builder6/node-red (Node-RED integration)
    ├── automation/             # @builder6/automation (workflow automation)
    ├── query-mongodb/          # @builder6/query-mongodb (DevExtreme query adapter)
    └── cli/                    # @builder6/cli (command-line tool)
```

## NestJS Module Tree | NestJS 模块树

`AppModule.forRoot()` imports (in `packages/server/src/app.module.ts`):

| Module | Package | Purpose |
|--------|---------|---------|
| `ConfigModule` | `@nestjs/config` | Global config via `getConfigs()` |
| `LoggerModule` | `nestjs-pino` | Structured logging |
| `MoleculerModule` | `@builder6/moleculer` | Moleculer broker bridge |
| `AuthModule` | `@builder6/core` | JWT + session auth, guards |
| `MongodbModule` | `@builder6/core` | MongoDB connection pool |
| `ScheduleModule` | `@nestjs/schedule` | Cron/task scheduling |
| `SteedosModule` | `@builder6/steedos` | Steedos metadata, Direct MongoDB API |
| `TablesModule` | `@builder6/tables` | Data table CRUD |
| `FilesModule` | `@builder6/files` | File upload/download |
| `EmailModule` | `@builder6/email` | Email services |
| `ServicesModule` | `@builder6/services` | Microservice management API |
| `RoomsModule` | `@builder6/rooms` | Real-time collaboration rooms |
| `OidcModule` | `@builder6/oidc` | OIDC client |
| `OidcProviderModule` | `@builder6/oidc-provider` | OIDC server |
| `MicroserviceModule` | `@builder6/microservices` | Inter-service comms |
| `OnlyOfficeModule` | `@builder6/onlyoffice` | Document editing |
| `DocsModule` | `@builder6/docs` | Collaborative docs |
| `SharepointModule` | `@builder6/sharepoint` | SharePoint integration |
| `PluginModule` | `@builder6/core` | Dynamic plugin loading |

## Bootstrap Sequence | 启动流程

```
main.ts → bootstrap()
  1. NestFactory.create<NestExpressApplication>(AppModule.forRoot({}))
  2. Connect Redis cluster microservice transport (B6_CLUSTER_TRANSPORTER)
  3. Set up Logger (pino), AllExceptionsFilter, LoggerErrorInterceptor
  4. Set up HybridAdapter (Socket.IO + WebSocket)
  5. Enable CORS (all origins, credentials: true)
  6. Create Redis session store (B6_CLUSTER_CACHER, prefix: B6_SESSION_PREFIX)
  7. Configure Swagger at /api/v6 (explorer + OpenAPI JSON at /api/v6-json)
  8. Serve static assets from packages/server/public/
  9. Apply middleware: cookieParser → JSON(50mb) → urlencoded(100mb) → compression
  10. Start all microservices
  11. Listen on B6_PORT (default: 5100)
```

## Middleware Stack | 中间件栈

1. **Session** — Redis-backed via `connect-redis`
2. **Cookie Parser** — `cookie-parser`
3. **JSON Body** — limit 50mb
4. **URL Encoded** — limit 100mb
5. **Compression** — `compression()`

## Guards | 守卫

| Guard | Location | Usage |
|-------|----------|-------|
| `AuthGuard` | `@builder6/core` | Validates token, sets `req.user`. Used on Tables, Files, Users endpoints |
| `AdminGuard` | `@builder6/core` | Validates token + checks `profile === 'admin'` + primary space. Used on Direct MongoDB API |

## Development Commands | 开发命令

```bash
# Development with hot reload
yarn start:dev

# Debug mode
yarn start:debug

# Production
yarn start:prod

# Build all packages
yarn build

# Build and watch
yarn build:watch

# Lint all packages
yarn lint

# Format code
yarn format

# Release
yarn release
```

## Key Design Patterns | 关键设计模式

- **Controller → Service → MongodbService**: Standard NestJS layered architecture
- **`@InjectBroker()`**: Inject Moleculer broker into NestJS services
- **`AppModule.forRoot(config)`**: Dynamic module with Moleculer config injection
- **DataLoader**: Batch loading for lookup field resolution in Tables
- **`@builder6/query-mongodb`**: Translates DevExtreme query parameters to MongoDB aggregation
