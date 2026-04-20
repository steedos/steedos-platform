---
name: server-websocket
description: |
  Steedos Server real-time WebSocket system using Socket.IO. Covers the
  AppGateway (@WebSocketGateway), connection authentication via cookies,
  room-based event routing (tenant-scoped rooms), subscribe/unsubscribe
  events, metadata change notifications, record change events, notification
  broadcasting, and Moleculer event integration for cross-service real-time
  communication.
---

# Steedos Server WebSocket | Steedos 服务端 WebSocket

## Overview | 概述

Steedos Server uses Socket.IO via `@nestjs/websockets` for real-time communication. The `AppGateway` handles connections, authentication, room subscriptions, and event broadcasting.

Steedos 服务端使用 Socket.IO 进行实时通信。`AppGateway` 处理连接、认证、房间订阅和事件广播。

## Gateway Configuration | 网关配置

```typescript
@WebSocketGateway({ path: "/socket.io/", cors: true })
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect
```

- **Path**: `/socket.io/`
- **CORS**: Enabled for all origins
- **Adapter**: `HybridAdapter` from `@builder6/core`

## Connection Authentication | 连接认证

On connect, the gateway authenticates via cookies from the handshake:

1. Parse `cookie` header from `socket.handshake.headers`
2. Extract `X-Space-Id` (tenant) and `X-Auth-Token` (auth token)
3. Validate via `AuthService.getUserByToken(token)`
4. Create session: `{ user, anonymous, system, portal: { tenantId } }`

Unauthenticated connections are marked as `anonymous`.

## Room System | 房间系统

Rooms are scoped by tenant ID to ensure multi-tenant isolation:

```
Room format: {tenantId}-{roomPart}
Individual:  {roomPart}-{userId}
```

### Subscribe / Unsubscribe | 订阅 / 取消订阅

```javascript
// Client-side
socket.emit("subscribe", {
  roomParts: ["orders", "notifications"],
  individual: false          // shared room
});

socket.emit("subscribe", {
  roomParts: "notification-change",
  individual: true           // per-user room: "notification-change-{userId}"
});

socket.emit("unsubscribe", {
  roomParts: ["orders"]
});
```

## Events | 事件

### Client → Server

| Event | Payload | Description |
|-------|---------|-------------|
| `subscribe` | `{ roomParts, individual }` | Join rooms |
| `unsubscribe` | `{ roomParts, individual }` | Leave rooms |
| `ping` | date | System connection keep-alive |

### Server → Client

| Event | Payload | Description |
|-------|---------|-------------|
| `connection-init` | — | Sent on successful connection |
| `pong` | UTC date | Response to ping |
| `s:metadata:change` | `{ type, action, _id, name, objectName }` | Metadata change (objects, fields, apps, etc.) |
| `s:notification-change` | `{ message }` | User notification (per-user room) |
| `s:record:{objectApiName}:change-{id}` | `{ _id }` | Record change event |

## Metadata Change Events | 元数据变更事件

Triggered when objects, fields, listviews, actions, or apps change:

```javascript
// Emitted to ALL connected clients (global broadcast)
socket.on("s:metadata:change", ({ type, action, _id, name, objectName }) => {
  // type: "apps", "objects", "object_listviews", "object_actions", "object_fields"
  // action: "insert", "update", "delete"
  // Refresh UI accordingly
});
```

## Record Change Events | 记录变更事件

Scoped to specific rooms for fine-grained updates:

```javascript
// Client subscribes to a specific record
socket.emit("subscribe", {
  roomParts: `record:orders:change-${recordId}`,
  individual: false
});

// Server emits when record changes
socket.on(`s:record:orders:change-${recordId}`, ({ _id }) => {
  // Reload record
});
```

Room name format: `{tenantId}-record:{objectApiName}:change-{recordId}`

## Notification Events | 通知事件

Per-user notifications via individual rooms:

```javascript
// Client subscribes
socket.emit("subscribe", {
  roomParts: "notification-change",
  individual: true    // creates room: "notification-change-{userId}"
});

// Server pushes notification
socket.on("s:notification-change", ({ message }) => {
  // Show notification
});
```

## Moleculer Integration | Moleculer 集成

The WebSocket gateway is tightly integrated with Moleculer events:

| Moleculer Event | WebSocket Action |
|-----------------|------------------|
| `$metadata.*` | → `s:metadata:change` (global broadcast) |
| `$broadcast.$notification.users` | → `s:notification-change` (per-user rooms) |
| `$broadcast.socket.emit` | → Generic socket emit with optional room |
| `@objectRecordEvent.*.*` | → `s:record:{obj}:change-{id}` (record rooms) |
| `$socket.subscribe.*` | Moleculer event emitted when client subscribes |

### Broadcasting from Moleculer Services | 从 Moleculer 服务广播

```javascript
// Emit to specific room from a Moleculer service
broker.emit("$broadcast.socket.emit", {
  data: {
    eventName: "custom-event",
    eventParams: { key: "value" },
    room: "tenantId-room-name"    // optional, omit for global
  }
});

// Send notification to specific users
broker.emit("$broadcast.$notification.users", {
  data: {
    tenantId: "space_id",
    users: ["user1", "user2"],
    message: "You have a new task"
  }
});
```
