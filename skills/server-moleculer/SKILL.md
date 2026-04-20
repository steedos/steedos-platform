---
name: server-moleculer
description: |
  Steedos Server Moleculer microservice integration. Covers broker
  configuration (namespace, transporter, cacher, serializer), the
  AppMoleculer service definition with event handlers ($packages.changed,
  $services.changed, $metadata.*, @objectRecordEvent.*.*, socket events),
  ObjectQL schema initialization, service lifecycle (created/started/stopped),
  inter-service communication patterns (broker.call, broker.emit,
  broker.broadcast), and dynamic service loading for community/enterprise
  editions.
---

# Steedos Server Moleculer Integration | Steedos 服务端 Moleculer 集成

## Overview | 概述

Steedos Server embeds a Moleculer service broker alongside NestJS. The broker handles microservice communication, metadata events, and cross-service orchestration. It connects to other Steedos services (package loaders, community/enterprise services) via Redis transporter.

Steedos 服务端内嵌 Moleculer 服务代理，处理微服务通信、元数据事件和跨服务编排。

## Broker Configuration | 代理配置

Configuration is in `src/config/moleculler.config.ts`:

```typescript
{
  namespace: "steedos",
  nodeID: null,                          // Auto-generated
  transporter: process.env.B6_TRANSPORTER,  // Redis URL
  cacher: process.env.B6_CACHER,            // Redis URL
  serializer: "JSON",
  requestTimeout: 0,                     // No timeout
  maxCallLevel: 100,
  heartbeatInterval: 10,
  heartbeatTimeout: 30,

  logger: {
    type: "Console",
    level: process.env.B6_LOG_LEVEL || "warn",
    formatter: "[MO] {timestamp} {level} [{mod}] {msg}",
  },

  registry: {
    strategy: "RoundRobin",
    preferLocal: true,
  },

  retryPolicy: { enabled: false },
  circuitBreaker: { enabled: false },
  bulkhead: { enabled: false },
  metrics: { enabled: false },
  tracing: { enabled: false },
  skipProcessEventRegistration: true,
}
```

The final config is merged from: `moleculerConfig` + `steedosConfig` + `envConfigs`.

## NestJS Integration | NestJS 集成

Using `@builder6/moleculer` package:

```typescript
// app.module.ts
MoleculerModule.forRoot(getMoleculerConfig())

// Inject broker in any service
import { InjectBroker } from "@builder6/moleculer";

@Injectable()
export class MyService {
  constructor(@InjectBroker() private broker: ServiceBroker) {}
}
```

## AppMoleculer Service | AppMoleculer 服务

The main Moleculer service is defined in `src/app.moleculer.ts`:

```typescript
@Injectable()
export class AppMoleculer extends Service {
  constructor(@InjectBroker() broker: ServiceBroker) {
    super(broker);
    this.parseServiceSchema({
      namespace: "steedos",
      name: "@steedos/server",
      events: { ... }
    });
  }
}
```

## Event Handlers | 事件处理

### `$packages.changed`

Fired when all packages finish loading. Triggers one-time initialization:

- Sets `global.STEEDOS_STARTED = true`
- Configures default language
- Broadcasts `@steedos/server.started`
- Loads tenant from database (first space record)
- Enables registration if no tenant exists

### `$services.changed`

Monitors service registry for license service:

```typescript
"$services.changed": async (ctx) => {
  global.HAS_LICENSE_SERVICE = broker.registry.hasService("@steedos/service-license");
}
```

### `$metadata.*`

Handles all metadata change events and forwards to WebSocket:

```typescript
"$metadata.*": async (payload) => {
  // Types: apps, objects, object_listviews, object_actions, object_fields
  appGateway.metadataChange({
    type: payload.type,
    action: payload.action,
    _id: payload.data._id || payload.data.id,
    name: payload.data.code || payload.data.name,
    objectName: payload.data.object || payload.data.object_name
  });
}
```

### `$broadcast.$notification.users`

Routes user notifications to WebSocket:

```typescript
"$broadcast.$notification.users": async (payload) => {
  appGateway.notificationChange(data.tenantId, data.users, data.message);
}
```

### `$broadcast.socket.emit`

Generic socket broadcast:

```typescript
"$broadcast.socket.emit": async (payload) => {
  appGateway.emit(data.eventName, data.eventParams, data.room);
}
```

### `@objectRecordEvent.*.*`

Record change events → WebSocket room broadcast:

```typescript
"@objectRecordEvent.*.*": async (payload) => {
  // Emits to room: {spaceId}-record:{objectApiName}:change-{id}
  // Event: s:record:{objectApiName}:change-{id}
}
```

## Service Lifecycle | 服务生命周期

### created

During broker creation:

1. Initialize `@steedos/objectql` with `objectql.broker.init(broker)`
2. Set up `global.broker`, `global.t` (i18n), `global._` (underscore)
3. Register SIGTERM/SIGINT handlers for graceful shutdown
4. Clear all cache entries on startup

### started

After broker starts:

1. Initialize ObjectQL schema: `getSteedosSchema(broker)`
2. Detect edition (ce/ee/cloud) from environment
3. Load edition-specific services:
   - Always: `@steedos/service-community`
   - Enterprise/Cloud: + `@steedos/service-license` + `@steedos/service-enterprise`

## Inter-Service Communication | 跨服务通信

### broker.call — 同步调用

```javascript
// Query objects directly (bypasses permissions)
const records = await broker.call("objectql.directFind", {
  objectName: "spaces",
  query: { top: 1, fields: ["_id"], sort: "created desc" }
});

// Broadcast via microservice
await broker.call("b6-microservice.broadcast", {
  name: "socket.emit",
  data: { room, eventName, eventParams }
});
```

### broker.emit — 发布事件

```javascript
// Emit metadata change
broker.emit("$metadata.objects", {
  type: "objects",
  action: "update",
  data: { _id: "xxx", name: "orders" }
});

// Emit notification
broker.emit("$broadcast.$notification.users", {
  data: { tenantId, users: ["user1"], message: "Task assigned" }
});

// Emit socket subscribe event
broker.emit("$socket.subscribe.room-name", { roomParts, userId, space });
```

### broker.broadcast — 广播

```javascript
// Server started notification
broker.broadcast("@steedos/server.started");
```

## Package Loader Integration | 软件包加载集成

Steedos packages use `@steedos/service-package-loader` as a Moleculer mixin. When a package service starts, it emits metadata events that the server picks up:

```
Package starts → loads YAML metadata → emits $metadata.* events
  → AppMoleculer handles → forwards to WebSocket
  → All packages loaded → emits $packages.changed
  → AppMoleculer initializes tenant + broadcasts server.started
```
