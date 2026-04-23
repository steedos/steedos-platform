---
name: steedos-server-api
description: |
  Steedos Server REST API reference (v6). Covers data CRUD endpoints
  (/api/v6/data), object metadata endpoints (/api/v6/objects), function
  execution endpoints (/api/v6/functions), file upload, health checks, and
  public settings. Includes query parameters (fields, filters, sort, skip,
  top), filter operators, authentication via cookies/bearer token, response
  formats, and Swagger/OpenAPI documentation.
---

# Steedos Server API | Steedos 服务端 API

## Overview | 概述

The Steedos Server exposes REST APIs under the `/api/v6/` namespace. All data/object/function endpoints require authentication via `AuthGuard`.

Steedos 服务端在 `/api/v6/` 命名空间下提供 REST API。所有数据/对象/函数端点需要身份认证。

## Authentication | 认证

All protected endpoints use cookie-based authentication:

- **Cookies**: `X-Space-Id` (tenant ID) + `X-Auth-Token` (auth token)
- **Bearer Token**: `Authorization: Bearer <token>` (Swagger/API calls)

The server extracts user context as: `{ user: userId, space: spaceId }`.

## Swagger / OpenAPI

- **Swagger UI**: `GET /api/v6`
- **OpenAPI JSON**: `GET /api/v6-json`

API Tags: Auth, Users, Records, Mongodb, Files, Rooms, Tables, Pages, Services, Email, Docs, Automation, Oidc, App

## Data API — `/api/v6/data` | 数据 API

CRUD operations for any object's records. All endpoints are under `@UseGuards(AuthGuard)`.

### Create Record | 创建记录

```
POST /api/v6/data/:objectName
```

**Body**: Record JSON object. You can specify `_id` or it will be auto-generated.

**Auto-generated fields**: `created`, `created_by`, `modified`, `modified_by`, `space`, `owner`

**Response**: `200` — The created record with all auto-generated fields.

```json
// Request
POST /api/v6/data/orders
{ "customer": "acme_corp", "total_amount": 5000 }

// Response
{
  "_id": "f5e2b3c4-...",
  "customer": "acme_corp",
  "total_amount": 5000,
  "created": "2026-04-18T...",
  "created_by": "user_id",
  "modified": "2026-04-18T...",
  "modified_by": "user_id",
  "owner": "user_id",
  "space": "tenant_id"
}
```

### List Records | 查询记录列表

```
GET /api/v6/data/:objectName
```

**Query Parameters**:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `fields` | string | all | Comma-separated or JSON array: `"name,created"` or `["name","created"]` |
| `filters` | string (JSON) | none | Filter criteria: `["status","=","active"]` |
| `sort` | string | none | Sort string: `"name asc, created desc"` |
| `skip` | number | 0 | Pagination offset |
| `top` | number | 100 | Records per page |

**Response**:

```json
{
  "data": [...],
  "totalCount": 42
}
```

### Get Single Record | 获取单条记录

```
GET /api/v6/data/:objectName/:recordId
```

**Response**: `200` — The record object. `404` if not found.

### Update Record | 更新记录

```
PATCH /api/v6/data/:objectName/:id
```

**Body**: Partial record with fields to update.

**Response**: `200` — The updated record. `404` if not found.

### Delete Record | 删除记录

```
DELETE /api/v6/data/:objectName/:id
```

**Response**: `200` — `{ "deleted": true, "_id": "..." }`. `404` if not found.

## Filter Operators | 筛选运算符

| Operator | Description |
|----------|-------------|
| `=` | Equal |
| `<>` | Not equal |
| `<` | Less than |
| `>` | Greater than |
| `<=` | Less than or equal |
| `>=` | Greater than or equal |
| `startsWith` | Starts with (strings) |
| `endswith` | Ends with (strings) |
| `contains` | Contains (strings) |
| `notcontains` | Does not contain (strings) |

### Complex Filters | 复合筛选

```json
// AND
[["status", "=", "active"], "and", ["amount", ">", 1000]]

// OR
[["status", "=", "active"], "or", ["status", "=", "pending"]]

// Nested
[["field", "=", 10], "and", [["other", "<", 3], "or", ["other", ">", 11]]]
```

## Objects API — `/api/v6/objects` | 对象元数据 API

### Get Object Configuration | 获取对象配置

```
GET /api/v6/objects/:objectApiName
```

Returns the full object schema (fields, listviews, permissions, etc.).

### Get Simplified Object | 获取简化对象

```
GET /api/v6/objects/:objectApiName/simplified
```

Returns only `name`, `label`, and non-hidden fields (with `label`, `type`, `name` per field).

## Functions API — `/api/v6/functions` | 函数执行 API

### Execute Function (GET) | 执行函数 (GET)

```
GET /api/v6/functions/:objectApiName/:functionApiName?param1=value1
```

Query parameters are passed to the function as `ctx.input`.

### Execute Function (POST) | 执行函数 (POST)

```
POST /api/v6/functions/:objectApiName/:functionApiName
```

**Body**: JSON object passed to the function as `ctx.input`.

Both methods merge `objectName` and `functionApiName` into the parameters:

```javascript
// Inside the function handler, ctx.input contains:
{
  objectName: "orders",
  functionApiName: "approve_order",
  ...bodyOrQueryParams
}
```

## File Upload API | 文件上传 API

```
POST /api/instance/:instanceId/file
```

Multipart form data with field name `file`. Uses `FileInterceptor`.

## App / Health Endpoints | 应用/健康端点

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v6/amis/public_settings` | GET | Returns public env settings, asset URLs, server status |
| `/api/health_check` | GET | Returns `{ status: "ok" }` |
| `/api/v6/amis/health_check` | GET/POST | Returns `{ status: 0, data: {} }` (Amis format) |

### Public Settings Response | 公共设置响应

```json
{
  "rootUrl": "https://example.com",
  "assetUrls": ["...assets.json", "...assets.json"],
  "unpkgUrl": "/unpkg",
  "serverStatus": "running",
  "steedosVersion": "3.0.13",
  "steedosAmisVersion": "6.3.0-patch.8",
  "PUBLIC_SETTINGS": { ... }
}
```
