---
name: steedos-builder6-api
description: |
  Builder6 Server REST API reference. Covers all /api/v6/ endpoints: Tables
  CRUD (/api/v6/tables/:baseId/:tableId), Direct MongoDB CRUD
  (/api/v6/direct/:objectName, admin-only), Files upload/download
  (/api/v6/files), Auth login (/api/v6/auth/login), Users profile
  (/api/v6/users/me), health check. Includes query parameters (fields,
  filters, sort, skip, top), filter operators, batch operations, presigned
  URLs, and Swagger/OpenAPI documentation.
---

# Builder6 Server API | Builder6 服务端 API

## Overview | 概述

Builder6 Server exposes REST APIs under `/api/v6/`. Endpoints are organized by module: Tables (data CRUD), Direct MongoDB (admin CRUD), Files, Auth, and Users.

## Swagger / OpenAPI

- **Swagger UI**: `GET /api/v6`
- **OpenAPI JSON**: `GET /api/v6-json`

API Tags: Auth, Users, Records, Mongodb, Files, Rooms, Tables, Pages, Services, Email, Docs, Automation, Oidc, App

## Authentication | 认证

All protected endpoints accept:

- **Cookies**: `X-Space-Id` + `X-Auth-Token` (session-based)
- **Bearer Token**: `Authorization: Bearer <jwt>` (JWT-based)
- **API Key**: `Authorization: Bearer apikey,<your-api-key>` (API key-based)

## Auth API — `/api/v6/auth` | 认证 API

### Login | 登录

```
POST /api/v6/auth/login
```

**Body**:

```json
{
  "username": "admin",
  "password": "password123",
  "space_id": "optional_tenant_id"
}
```

**Response** (`200`): Returns user profile + tokens. Sets cookies: `X-Access-Token`, `X-Auth-Token`, `X-User-Id`, `X-Space-Id`.

**Query**: `?redirect_to=<url>` — Redirect after login.

### Health Check | 健康检查

```
GET /api/v6/health
```

**Response**: `{ "space_id": "...", "status": "ok", "timestamp": "..." }`

## Users API — `/api/v6/users` | 用户 API

### Get Current User | 获取当前用户

```
GET /api/v6/users/me
```

**Guard**: `AuthGuard`. **Response**: Current user profile object.

### Get User Avatar | 获取用户头像

```
GET /api/v6/users/:userId/avatar
```

Public endpoint. Returns avatar image or redirects to file URL. Falls back to default SVG.

## Tables API — `/api/v6/tables` | 数据表 API

CRUD for table records. Uses `AuthGuard`. Collection naming: `t_{baseId}_{tableId}`.

### Create Record | 创建记录

```
POST /api/v6/tables/:baseId/:tableId
```

**Body**: Record JSON. Auto-generated: `owner`, `created_by`, `created`, `modified_by`, `modified`, `space`.

### List Records | 查询记录

```
GET /api/v6/tables/:baseId/:tableId
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `fields` | string | all | `"name,created"` or JSON array |
| `filters` | string (JSON) | none | `["status","=","active"]` |
| `sort` | string | none | `"name asc, created desc"` |
| `skip` | number | 0 | Pagination offset |
| `top` | number | 20 | Records per page |

**Response**: `{ data: [...], totalCount: N }`

### Get Record | 获取记录

```
GET /api/v6/tables/:baseId/:tableId/:recordId
```

### Update Record | 更新记录

```
PUT /api/v6/tables/:baseId/:tableId/:recordId
PATCH /api/v6/tables/:baseId/:tableId/:recordId
```

### Delete Record | 删除记录

```
DELETE /api/v6/tables/:baseId/:tableId/:recordId
```

### Delete Multiple | 批量删除

```
DELETE /api/v6/tables/:baseId/:tableId
Body: { "records": ["id1", "id2"] }
Response: { "records": [{ "deleted": true, "_id": "id1" }, ...] }
```

### Get Table Metadata | 获取表元数据

```
GET /api/v6/tables/meta/bases/:baseId/tables/:tableId
```

## Direct MongoDB API — `/api/v6/direct` | 直接数据库 API

Admin-only CRUD bypassing permission checks. Uses `AdminGuard`.

### Create Record | 创建记录

```
POST /api/v6/direct/:objectName
```

### List Records | 查询记录

```
GET /api/v6/direct/:objectName
```

Same query parameters as Tables API (`fields`, `filters`, `sort`, `skip`, `top`).

### Get Record | 获取记录

```
GET /api/v6/direct/:objectName/:recordId
```

### Get by External ID | 按外部 ID 获取

```
GET /api/v6/direct/:objectName/:fieldName/:fieldValue
```

### Update Record | 更新记录

```
PATCH /api/v6/direct/:objectName/:id
```

### Update by External ID | 按外部 ID 更新

```
PATCH /api/v6/direct/:objectName/:fieldName/:fieldValue
```

### Batch Update / Upsert | 批量更新

```
PATCH /api/v6/direct/:objectName
Body: { "records": [{ "_id": "...", "name": "..." }], "performUpsert": true }
```

When `performUpsert: true`, records without `_id` are inserted; records with `_id` are updated.

### Delete Record | 删除记录

```
DELETE /api/v6/direct/:objectName/:id
```

### Delete Multiple | 批量删除

```
DELETE /api/v6/direct/:objectName
Body: { "records": ["id1", "id2"] }
```

## Files API — `/api/v6/files` | 文件 API

### Upload File | 上传文件

```
POST /api/v6/files/:collectionName
```

**Guard**: `AuthGuard`. Multipart form data:

| Field | Type | Description |
|-------|------|-------------|
| `file` | binary | File to upload |
| `object_name` | string | Associated object name |
| `record_id` | string | Associated record ID |
| `parent` | string | Parent record ID |

**Collection names**: `cfs.files.filerecord`, `cfs.avatars.filerecord`, `cfs.images.filerecord`

### Download File | 下载文件

```
GET /api/v6/files/:collectionName/:fileId
GET /api/v6/files/:collectionName/:fileId/:fileName
```

Query params: `?redirect=true` (S3 signed URL redirect), `?download=true` (force download header).

### Download File Direct | 直接下载

```
GET /api/v6/files/download/:collectionName/:fileId/:fileName
```

Always streams the file directly (no S3 redirect).

### Get Presigned URLs | 获取预签名 URL

```
POST /api/v6/files/:collectionName/presigned-urls
Body: { "records": ["fileId1", "fileId2"] }
Response: { "urls": ["https://...", "https://..."] }
```

## Filter Operators | 筛选运算符

| Operator | Description |
|----------|-------------|
| `=` | Equal |
| `<>` | Not equal |
| `<` | Less than |
| `>` | Greater than |
| `<=` | Less or equal |
| `>=` | Greater or equal |
| `startsWith` | Starts with (strings) |
| `endswith` | Ends with (strings) |
| `contains` | Contains (strings) |
| `notcontains` | Does not contain (strings) |

### Complex Filters | 复合筛选

```json
[["status", "=", "active"], "and", ["amount", ">", 1000]]
[["a", "=", 1], "or", ["b", "=", 2]]
```
