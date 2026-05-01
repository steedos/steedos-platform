---
name: steedos-server-internals
description: |
  Steedos Server internal architecture: NestJS 11 + Moleculer 0.14 hybrid.
  TRIGGER: NestJS module organization; Moleculer broker (namespace, transporter,
  cacher, serializer); AppMoleculer events ($packages.changed, $metadata.*,
  @objectRecordEvent); Socket.IO AppGateway, WebSocket rooms; bootstrap sequence,
  middleware, guards, dependency injection; broker.call, broker.emit;
  edition system, @builder6/* ecosystem.
  SKIP: use REST API → steedos-server-api or steedos-builder6-api;
  configure server → steedos-configuration; Builder6 internals →
  steedos-builder6-internals; overview → steedos-getting-started.
---

# Steedos Server Architecture | Steedos 服务端架构

## Overview | 概述

Steedos Server (`builder6/server`) is a NestJS + Moleculer hybrid backend. NestJS handles HTTP/REST, Moleculer handles microservice orchestration, and Socket.IO provides real-time communication.

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
builder6/server/src/
├── main.ts                       # Entry point → bootstrap()
├── bootstrap.ts                  # App creation, middleware, Swagger
├── app.module.ts                 # Root NestJS module (25+ imports)
├── app.controller.ts             # Health checks, public settings
├── app.gateway.ts                # WebSocket gateway (Socket.IO)
├── app.moleculer.ts              # Moleculer service + events
├── config/
│   ├── steedos.config.ts         # YAML config loader
│   └── moleculler.config.ts      # Moleculer broker settings
├── api/
│   └── data/
│       ├── data.controller.ts    # CRUD at /api/v6/data/:objectName
│       └── data.service.ts       # ObjectQL data access
├── objects/
│   ├── objects.controller.ts     # GET /api/v6/objects/:objectApiName
│   ├── objects.service.ts        # ObjectQL schema + function runner
│   └── functions.controller.ts   # GET|POST /api/v6/functions/:obj/:func
└── workflow/
    └── file.controller.ts        # File upload endpoint
```

## NestJS Modules | NestJS 模块

The root `AppModule` imports 25+ modules:

| Module | Package | Purpose |
|--------|---------|---------|
| `ConfigModule` | `@nestjs/config` | Environment/config loading |
| `MoleculerModule` | `@builder6/moleculer` | Moleculer broker integration |
| `AuthModule` | `@builder6/core` | Authentication guards + strategies |
| `MongodbModule` | `@builder6/core` | MongoDB connection management |
| `SteedosModule` | `@builder6/steedos` | Core Steedos metadata + ObjectQL |
| `TablesModule` | `@builder6/tables` | Data table management |
| `FilesModule` | `@builder6/files` | File upload/download |
| `PagesModule` | `@builder6/pages` | Micro page management |
| `PluginModule` | `@builder6/core` | Dynamic plugin loading |
| `MicroserviceModule` | `@builder6/microservices` | Inter-service communication |

## Bootstrap Sequence | 启动流程

```
main.ts → bootstrap()
  1. NestFactory.create<NestExpressApplication>(AppModule)
  2. Connect Redis cluster microservice transport
  3. Set up Logger (pino), GlobalFilters, LoggerErrorInterceptor
  4. Set up HybridAdapter for WebSocket (Socket.IO)
  5. Enable CORS (all origins, credentials: true)
  6. Create Redis session store
  7. Apply Express middleware stack
  8. Configure Swagger at /api/v6
  9. Start all microservices
  10. Mount static router + SPA fallback
  11. Listen on B6_PORT (default: 5100)
```

## Middleware Stack | 中间件栈

1. **Session** — Redis-backed via `connect-redis` (prefix: `steedos-session:`)
2. **Cookie Parser** — `cookie-parser`
3. **JSON Body** — `express.json()` (limit: 50mb)
4. **URL Encoded** — `express.urlencoded()` (limit: 100mb)
5. **Compression** — `compression()`
6. **Cloud Proxy** — `http-proxy-middleware` → `STEEDOS_CLOUD_URL` (if configured)
7. **Static Router** — `@steedos/router` for platform assets
8. **SPA Fallback** — `@steedos/webapp` index.html

## Guards | 认证守卫

| Guard | Usage |
|-------|-------|
| `AuthGuard` | All data/objects/functions controllers |
| `AdminGuard` | Admin-only endpoints (Direct MongoDB API) |

Authentication: cookie-based `X-Space-Id` + `X-Auth-Token` headers/cookies.

## ObjectQL Data Access | ObjectQL 数据访问

```typescript
const obj = getObject("orders");
await obj.find(query, userSession);
await obj.insert(doc, userSession);
await obj.update(id, data, userSession);
await obj.delete(id, userSession);
```

## Edition System | 版本系统

| Edition | Condition | Services |
|---------|-----------|----------|
| Community (ce) | Default | `@steedos/service-community` |
| Enterprise (ee) | `STEEDOS_LICENSE` set | + `@steedos/service-license` + `@steedos/service-enterprise` |

---

# Moleculer Integration | Moleculer 集成

## Broker Configuration | 代理配置

```typescript
{
  namespace: "steedos",
  transporter: process.env.B6_TRANSPORTER,
  cacher: process.env.B6_CACHER,
  serializer: "JSON",
  requestTimeout: 0,
  heartbeatInterval: 10,
  heartbeatTimeout: 30,
  logger: { type: "Console", level: process.env.B6_LOG_LEVEL || "warn" },
  registry: { strategy: "RoundRobin", preferLocal: true },
}
```

## NestJS Integration

```typescript
// app.module.ts
MoleculerModule.forRoot(getMoleculerConfig())

// Inject broker
@Injectable()
export class MyService {
  constructor(@InjectBroker() private broker: ServiceBroker) {}
}
```

## AppMoleculer Event Handlers | 事件处理

### `$packages.changed`
Fired when all packages finish loading. Sets `global.STEEDOS_STARTED = true`, loads tenant, broadcasts `@steedos/server.started`.

### `$metadata.*`
Forwards all metadata changes to WebSocket:
```typescript
appGateway.metadataChange({
  type: payload.type,     // apps, objects, object_listviews, etc.
  action: payload.action, // insert, update, delete
  _id, name, objectName
});
```

### `@objectRecordEvent.*.*`
Record change events → WebSocket room broadcast to `{spaceId}-record:{objectApiName}:change-{id}`.

### `$broadcast.$notification.users`
Routes user notifications to per-user WebSocket rooms.

## Inter-Service Communication | 跨服务通信

```javascript
// Synchronous call
const records = await broker.call("objectql.directFind", {
  objectName: "spaces", query: { top: 1 }
});

// Emit event
broker.emit("$metadata.objects", { type: "objects", action: "update", data: {...} });

// Broadcast
broker.broadcast("@steedos/server.started");
```

## Package Loader Flow | 软件包加载流程

```
Package starts → loads YAML metadata → emits $metadata.* events
  → AppMoleculer handles → forwards to WebSocket
  → All packages loaded → emits $packages.changed
  → initializes tenant + broadcasts server.started
```

---

# WebSocket (Socket.IO) | WebSocket 实时通信

## Gateway Configuration | 网关配置

```typescript
@WebSocketGateway({ path: "/socket.io/", cors: true })
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect
```

## Connection Authentication | 连接认证

1. Parse `cookie` header from `socket.handshake.headers`
2. Extract `X-Space-Id` + `X-Auth-Token`
3. Validate via `AuthService.getUserByToken(token)`

## Room System | 房间系统

Rooms are scoped by tenant: `{tenantId}-{roomPart}`. Individual rooms: `{roomPart}-{userId}`.

```javascript
// Subscribe
socket.emit("subscribe", { roomParts: ["orders"], individual: false });
socket.emit("subscribe", { roomParts: "notification-change", individual: true });
socket.emit("unsubscribe", { roomParts: ["orders"] });
```

## Server → Client Events

| Event | Description |
|-------|-------------|
| `s:metadata:change` | Metadata change (objects, fields, apps, etc.) |
| `s:notification-change` | User notification (per-user room) |
| `s:record:{obj}:change-{id}` | Record change event |

## Moleculer → WebSocket Mapping

| Moleculer Event | WebSocket Event |
|-----------------|-----------------|
| `$metadata.*` | `s:metadata:change` (global) |
| `$broadcast.$notification.users` | `s:notification-change` (per-user) |
| `$broadcast.socket.emit` | Generic emit with optional room |
| `@objectRecordEvent.*.*` | `s:record:{obj}:change-{id}` (record rooms) |

### Broadcasting from Moleculer Services

```javascript
broker.emit("$broadcast.socket.emit", {
  data: { eventName: "custom-event", eventParams: {...}, room: "tenantId-room" }
});

broker.emit("$broadcast.$notification.users", {
  data: { tenantId: "space_id", users: ["user1"], message: "New task" }
});
```
