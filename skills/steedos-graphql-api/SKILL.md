---
name: steedos-graphql-api
description: |
  Steedos GraphQL API auto-generated from object metadata at /graphql.
  TRIGGER: POST /graphql; {object}, {object}__findOne, {object}__count,
  {object}__insert, {object}__update, {object}__delete;
  __expand (lookup expansion), _display (formatted values),
  _permissions (record permissions), _related_* (related records);
  filters/pagination/sorting in GraphQL; Apollo Playground.
  SKIP: REST CRUD → steedos-server-api or steedos-builder6-api;
  server functions → steedos-server-logic.
---

# Steedos GraphQL API | Steedos GraphQL 接口

## Overview | 概述

Steedos provides a GraphQL API that is **auto-generated from object metadata**. Every Steedos object automatically gets GraphQL queries and mutations — no manual schema definition required. The schema updates dynamically when objects or fields change.

Steedos 提供的 GraphQL API **根据对象元数据自动生成**。每个 Steedos 对象自动获得 GraphQL 查询和变更操作，无需手动定义 Schema。对象或字段变更时 Schema 自动更新。

## Endpoint | 端点

```
POST /graphql
```

- **Authentication**: `Authorization: Bearer {token}` header, or cookie-based session
- **Content-Type**: `application/json`
- **Apollo Playground**: Enabled by default at `/graphql` (controlled by `STEEDOS_GRAPHQL_ENABLE_CONSOLE`)

## Queries | 查询

For each object (e.g., `orders`), three queries are auto-generated:

### List Records — `{objectName}`

```graphql
{
  orders(
    filters: [["status", "=", "approved"]]
    fields: ["_id", "name", "amount"]
    top: 20
    skip: 0
    sort: "created desc"
  ) {
    _id
    name
    amount
    status
  }
}
```

### Find One — `{objectName}__findOne`

```graphql
{
  orders__findOne(id: "67abc123def456") {
    _id
    name
    amount
    customer
  }
}
```

### Count — `{objectName}__count`

```graphql
{
  orders__count(filters: [["status", "=", "draft"]])
}
```

### Query Parameters | 查询参数

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `filters` | JSON | No | none | OData-style filter array, e.g. `[["name", "contains", "test"]]` |
| `fields` | JSON | No | all | Array of field names to return |
| `top` | Int | **Yes** | 10000 | Max records to return (max 10,000) |
| `skip` | Int | **Yes** | 0 | Pagination offset |
| `sort` | String | No | none | Sort expression, e.g. `"created desc"`, `"name asc, amount desc"` |

### Filter Operators | 筛选运算符

```
=, !=, >, >=, <, <=
contains, notcontains, startswith
in, notin
between
```

Example filters:

```json
[["status", "=", "active"]]
[["amount", ">", 1000], ["status", "in", ["draft", "submitted"]]]
[["name", "contains", "test"]]
```

## Mutations | 变更

### Insert — `{objectName}__insert`

```graphql
mutation {
  orders__insert(doc: {
    name: "ORD-2026-001",
    customer: "cust_abc123",
    amount: 5000,
    status: "draft"
  }) {
    _id
    name
    amount
  }
}
```

The `space` field is auto-injected from the authenticated user's session.

### Update — `{objectName}__update`

```graphql
mutation {
  orders__update(
    id: "67abc123def456",
    doc: { status: "approved", approved_at: "2026-04-23T10:00:00Z" }
  ) {
    _id
    name
    status
  }
}
```

### Delete — `{objectName}__delete`

```graphql
mutation {
  orders__delete(id: "67abc123def456")
}
```

Respects the object's `enable_trash` setting — soft-delete or hard-delete accordingly.

## Special Fields | 特殊字段

### Lookup Expansion — `__expand`

Expand lookup/master_detail references to get the full related record:

```graphql
{
  orders__findOne(id: "67abc123def456") {
    _id
    name
    customer              # Returns raw ID: "cust_abc123"
    customer__expand {    # Returns expanded object
      _id
      name
      email
      phone
    }
  }
}
```

### Display Formatting — `_display`

Get localized, formatted field values:

```graphql
{
  orders__findOne(id: "67abc123def456") {
    _id
    amount                # Raw value: 5000
    status                # Raw value: "approved"
    _display {
      amount              # Formatted: "¥5,000.00"
      status              # Localized label: "已批准"
      created             # Formatted date: "2026-04-23 10:00"
    }
  }
}
```

### Record Permissions — `_permissions`

Check what the current user can do with a record:

```graphql
{
  orders__findOne(id: "67abc123def456") {
    _id
    name
    _permissions {
      allowCreate
      allowEdit
      allowDelete
      field_permissions
    }
  }
}
```

### Related Records — `_related_*`

Access related child records, files, tasks, etc.:

```graphql
{
  orders__findOne(id: "67abc123def456") {
    _id
    name
    _related_order_items_order {  # Detail records via lookup field "order"
      _id
      product
      quantity
      price
    }
    _related_files {
      _id
      name
    }
    _related_tasks {
      _id
      name
      status
    }
    _related_notes {
      _id
      body
    }
  }
}
```

Related field naming: `_related_{childObjectName}_{lookupFieldName}`

## Field Type Mapping | 字段类型映射

| Steedos Field Type | GraphQL Type |
|-------------------|--------------|
| text, textarea, html, url, email | `String` |
| number, currency, percent | `Float` |
| boolean | `Boolean` |
| date, datetime, time | `Date` |
| select (single) | `String` |
| select (multiple) | `[String]` |
| lookup, master_detail | `JSON` (raw) + `__expand` (referenced type) |
| image, file | `JSON` |
| formula, summary | Depends on return type |
| Other | `JSON` |

## Authentication | 认证

GraphQL requests require authentication via one of:

```bash
# Bearer token
curl -X POST /graphql \
  -H "Authorization: Bearer eyJhbGciOi..." \
  -H "Content-Type: application/json" \
  -d '{"query": "{ space_users { _id name } }"}'

# Cookie-based session (from browser)
# Cookies: X-Space-Id, X-Auth-Token
```

Unauthenticated requests return `UnAuthorizedError`.

## DataLoader Batching | DataLoader 批量优化

GraphQL queries automatically use DataLoader to batch and cache database lookups within a single request, preventing N+1 query problems when expanding lookup fields.

Controlled by environment variable:
```
STEEDOS_GRAPHQL_ENABLE_DATALOADER=true  # default
```

## Complete Example | 完整示例

```graphql
# Fetch orders with expanded customer, display values, and permissions
{
  orders(
    filters: [["status", "in", ["submitted", "approved"]], ["amount", ">", 1000]]
    sort: "amount desc"
    top: 10
  ) {
    _id
    name
    amount
    status
    order_date
    customer__expand {
      _id
      name
      phone
    }
    _display {
      amount
      status
      order_date
    }
    _permissions {
      allowEdit
      allowDelete
    }
  }
}
```

```graphql
# Create an order and return the new record
mutation {
  orders__insert(doc: {
    name: "ORD-2026-042",
    customer: "cust_abc123",
    amount: 8500,
    status: "draft",
    order_date: "2026-04-23"
  }) {
    _id
    name
    amount
    customer__expand {
      name
    }
  }
}
```

## Environment Variables | 环境变量

| Variable | Default | Description |
|----------|---------|-------------|
| `STEEDOS_GRAPHQL_ENABLE_CONSOLE` | `true` | Enable Apollo Playground at /graphql |
| `STEEDOS_GRAPHQL_ENABLE_DATALOADER` | `true` | Enable DataLoader batching |

## Limitations | 限制

- Max **10,000** records per query (`top` parameter)
- Max **10MB** request/response body
- No subscriptions (real-time updates use WebSocket instead, see steedos-server-internals)
- Deleted records (`is_deleted: true`) are excluded by default
