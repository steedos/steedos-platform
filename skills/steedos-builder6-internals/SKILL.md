---
name: steedos-builder6-internals
description: |
  Builder6 Server architecture: NestJS 11 + Moleculer 0.14 hybrid monorepo.
  TRIGGER: @builder6/* packages, monorepo structure, module organization,
  bootstrap, middleware, guards; B6_* environment variables, dotenv-flow,
  STEEDOS_ compatibility aliases, ConfigService access.
  SKIP: use API → steedos-builder6-api; Steedos Server internals →
  steedos-server-internals; project env config → steedos-configuration.
---

# Builder6 Server Architecture & Configuration

## Overview | 概述

Builder6 Server is a NestJS + Moleculer hybrid monorepo powering the Steedos platform. It uses Nx + Lerna for workspace management with 20+ specialized `@builder6/*` packages.

## Technology Stack | 技术栈

- **HTTP**: NestJS 11 (Express adapter)
- **Microservices**: Moleculer 0.14
- **Real-time**: Socket.IO (HybridAdapter)
- **Database**: MongoDB via `MongodbService`
- **Session/Cache**: Redis (connect-redis + ioredis)
- **Auth**: JWT + session tokens via `@builder6/core`
- **API Docs**: Swagger at `/api/v6`
- **Build**: Nx 22 + Lerna 9 + pnpm 3.8

## Monorepo Structure | 结构

```
builder6-server/
├── package.json
├── nx.json / lerna.json
└── packages/
    ├── server/          # @builder6/server — main entry
    ├── core/            # @builder6/core — auth, config, mongodb, plugins, filters, websockets
    ├── tables/          # @builder6/tables — data table CRUD with DataLoader
    ├── files/           # @builder6/files — file upload (local + S3)
    ├── pages/           # @builder6/pages — micro page management
    ├── email/           # @builder6/email — SMTP + queue
    ├── rooms/           # @builder6/rooms — real-time collaboration
    ├── moleculer/       # @builder6/moleculer — NestJS-Moleculer bridge
    ├── microservices/   # @builder6/microservices — service management
    ├── steedos/         # @builder6/steedos — Steedos metadata + ObjectQL
    ├── oidc/            # @builder6/oidc — OIDC client
    ├── onlyoffice/      # @builder6/onlyoffice — document editing
    ├── query-mongodb/   # @builder6/query-mongodb — DevExtreme query adapter
    └── cli/             # @builder6/cli — CLI tool
```

## NestJS Module Tree

`AppModule.forRoot()` imports:

| Module | Package | Purpose |
|--------|---------|---------|
| `ConfigModule` | `@nestjs/config` | Global config |
| `MoleculerModule` | `@builder6/moleculer` | Moleculer broker |
| `AuthModule` | `@builder6/core` | JWT + session auth |
| `MongodbModule` | `@builder6/core` | MongoDB pool |
| `SteedosModule` | `@builder6/steedos` | Metadata + ObjectQL |
| `TablesModule` | `@builder6/tables` | Data table CRUD |
| `FilesModule` | `@builder6/files` | File upload/download |
| `PluginModule` | `@builder6/core` | Dynamic plugin loading |

## Bootstrap & Middleware

```
bootstrap()
  1. NestFactory.create(AppModule.forRoot({}))
  2. Redis cluster transport
  3. Logger + AllExceptionsFilter
  4. HybridAdapter (Socket.IO)
  5. CORS (all origins)
  6. Redis session store
  7. Swagger at /api/v6
  8. Middleware: cookieParser → JSON(50mb) → urlencoded(100mb) → compression
  9. Start microservices → listen on B6_PORT
```

## Guards

| Guard | Usage |
|-------|-------|
| `AuthGuard` | Tables, Files, Users endpoints |
| `AdminGuard` | Direct MongoDB API (`profile === 'admin'`) |

## Key Design Patterns

- **Controller → Service → MongodbService**: Standard NestJS layered architecture
- **`@InjectBroker()`**: Inject Moleculer broker into NestJS services
- **DataLoader**: Batch loading for lookup field resolution
- **`@builder6/query-mongodb`**: DevExtreme → MongoDB aggregation

## Development Commands

```bash
pnpm start:dev      # Hot reload
pnpm start:debug    # Debug mode
pnpm start:prod     # Production
pnpm build          # Build all
pnpm lint           # Lint
```

---

# Configuration | 配置

## Environment Variable Parsing | 环境变量解析

`getEnvConfigs()` in `@builder6/core` parses `B6_*` and `STEEDOS_*` env vars via `dotenv-flow`:

- Underscores become nested keys: `B6_MONGO_URL` → `configService.get('mongo.url')`
- `"true"/"false"` → boolean, numeric strings → numbers
- `B6_` takes precedence over `STEEDOS_`

## Steedos Compatibility Aliases | 兼容别名

| Legacy Variable | Maps To |
|----------------|---------|
| `MONGO_URL` | `B6_MONGO_URL` |
| `ROOT_URL` | `B6_ROOT_URL` |
| `PORT` | `B6_PORT` |
| `TRANSPORTER` | `B6_TRANSPORTER` |
| `CACHER` | `B6_CACHER` |
| `JWT_SECRET` | `B6_JWT_SECRET` |

## All B6_* Variables

### Server Core

| Variable | Default | Description |
|----------|---------|-------------|
| `B6_PORT` | `5100` | Server port |
| `B6_ROOT_URL` | `http://127.0.0.1:5100` | Root URL |
| `B6_HOME` | `process.cwd()` | Working directory |
| `B6_LOG_LEVEL` | `warn` | Log level |

### Database & Cache

| Variable | Default | Description |
|----------|---------|-------------|
| `B6_MONGO_URL` | `mongodb://127.0.0.1/steedos` | MongoDB |
| `B6_TRANSPORTER` | `redis://127.0.0.1:6379` | Moleculer transporter |
| `B6_CACHER` | `redis://127.0.0.1:6379/1` | Moleculer cacher |
| `B6_NAMESPACE` | `steedos` | Moleculer namespace |

### Authentication

| Variable | Default | Description |
|----------|---------|-------------|
| `B6_JWT_SECRET` | `steedos` | JWT secret |
| `B6_SESSION_SECRET` | `steedos-session-secret` | Session secret |
| `B6_SESSION_PREFIX` | `steedos-session:` | Redis session prefix |

### File Storage

| Variable | Default | Description |
|----------|---------|-------------|
| `B6_STORAGE_DIR` | `./steedos-storage` | Local storage dir |
| `B6_CFS_STORE` | `local` | `local` or `S3` |
| `B6_CFS_AWS_S3_*` | — | S3 endpoint, key, secret, region, bucket |
| `B6_CFS_DOWNLOAD_PUBLIC` | `["avatars"]` | Public download collections |

### Plugin System

| Variable | Description |
|----------|-------------|
| `B6_PLUGIN_MODULES` | NestJS module packages |
| `B6_PLUGIN_PACKAGES` | Moleculer service packages |
| `B6_PLUGIN_NPMRC` | Custom npm registry |

## ConfigService Access

```typescript
@Injectable()
export class MyService {
  constructor(private configService: ConfigService) {}
  example() {
    const mongoUrl = this.configService.get('mongo.url');
    const port = this.configService.get('port');
  }
}
```
