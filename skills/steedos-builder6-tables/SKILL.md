---
name: steedos-builder6-tables
description: |
  Builder6 Tables module for structured data management. Tables API at
  /api/v6/tables/:baseId/:tableId. Covers collection naming (t_{baseId}_{tableId}),
  record CRUD with auto-generated fields, lookup field resolution via
  DataLoader, DevExtreme query adapter (@builder6/query-mongodb), batch
  delete, table metadata, field type handling (lookup rollback, date
  conversion), and MetaService for field schema.
---

# Builder6 Tables | Builder6 数据表

## Overview | 概述

The Tables module (`@builder6/tables`) provides data table management with automatic lookup field resolution, DataLoader batching, and DevExtreme-compatible query parameters. Collections are stored in MongoDB with the naming convention `t_{baseId}_{tableId}`.

## Collection Naming | 集合命名

```
MongoDB collection: t_{baseId}_{tableId}
```

Example: `t_app1_orders` for base `app1`, table `orders`.

## API Endpoints | API 端点

All endpoints require `AuthGuard`. Base path: `/api/v6/tables/`.

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/:baseId/:tableId` | Create record |
| `GET` | `/:baseId/:tableId` | List records (paginated) |
| `GET` | `/:baseId/:tableId/:recordId` | Get single record |
| `PUT/PATCH` | `/:baseId/:tableId/:recordId` | Update record |
| `DELETE` | `/:baseId/:tableId/:recordId` | Delete record |
| `DELETE` | `/:baseId/:tableId` | Delete multiple (body: `{records: [...]}`) |
| `GET` | `/meta/bases/:baseId/tables/:tableId` | Get table metadata |

## Record Operations | 记录操作

### Create | 创建

```
POST /api/v6/tables/app1/orders
Body: { "name": "Order 1", "amount": 100 }
```

Auto-injected fields: `owner`, `created_by`, `created`, `modified_by`, `modified`, `space`.

Lookup fields in the body are automatically resolved — you can pass `{ _id: "..." }` objects or plain string IDs.

### Query | 查询

```
GET /api/v6/tables/app1/orders?filters=["amount",">",50]&sort=created desc&top=20&skip=0
```

| Parameter | Required | Default | Description |
|-----------|----------|---------|-------------|
| `fields` | No | all | Comma-separated or JSON array |
| `filters` | No | none | DevExtreme filter format (JSON) |
| `sort` | No | none | `"field asc, field2 desc"` |
| `skip` | **Yes** | 0 | Pagination offset |
| `top` | **Yes** | 20 | Page size |

**Response**:

```json
{
  "data": [{ "_id": "...", "name": "Order 1", "amount": 100, ... }],
  "totalCount": 42
}
```

### Batch Delete | 批量删除

```
DELETE /api/v6/tables/app1/orders
Body: { "records": ["id1", "id2", "id3"] }
Response: { "records": [{ "deleted": true, "_id": "id1" }, ...] }
```

## Lookup Field Resolution | 查找字段解析

### On Read (convertRecordLookupFields)

When records are returned, lookup fields are expanded:

```
// Stored in DB
{ "customer": "cust123" }

// Returned to client (expanded via DataLoader)
{ "customer": { "_id": "cust123", "name": "Acme Corp" } }
```

Supports both single lookup and `multiple: true` (array of IDs → array of objects).

### On Write (roolbackRecordFields)

When records are saved, lookup fields are converted back:

```
// Client sends
{ "customer": { "_id": "cust123", "name": "Acme Corp" } }

// Stored in DB
{ "customer": "cust123" }
```

If a string value (not an ID) is passed, the system searches by both `_id` and `name` in the referenced collection.

### DataLoader Batching

Lookup fields are resolved via `DataLoader` to prevent N+1 queries:

```typescript
const loader = new DataLoader(async (ids: string[]) => {
  const records = await mongodbService.find(collectionName, {
    _id: { $in: ids }
  }, { projection: { _id: 1, name: 1 } });
  return ids.map(id => records.find(r => r._id === id));
});
```

Loaders are cached per collection name within the service instance.

## Field Type Handling | 字段类型处理

On write, field types are auto-converted:

| Field Type | Conversion |
|------------|------------|
| `lookup` | Object → `_id` string; string → lookup by `_id` or `name` |
| `date`, `datetime`, `time` | String → `new Date(value)` |

## MetaService | 元数据服务

`MetaService` provides table field schema:

```typescript
// Get all fields for a table
const fields = await metaService.getTableMeta(baseId, tableId);

// Built-in lookup fields
// created_by and modified_by are automatically treated as lookup → users
```

## DevExtreme Query Adapter | DevExtreme 查询适配器

`@builder6/query-mongodb` translates DevExtreme `loadOptions` to MongoDB aggregation:

```typescript
import { querySimple } from '@builder6/query-mongodb';

const result = await querySimple(collection, {
  take: 20,
  skip: 0,
  filter: ["amount", ">", 50],
  sort: [{ selector: "created", desc: true }],
  select: ["name", "amount"],
  requireTotalCount: true,
}, { replaceIds: false });

// result: { data: [...], totalCount: N }
```
