---
name: steedos-object-micro-pages
description: |
  TRIGGER when: user wants to customize/replace an OBJECT's record detail page or
  list page using Amis UI; asks about `.page.yml` files with `type: record` or
  `type: list` that have an `object_name` field; asks about `pageAssignments` to
  bind a page to an object (orgDefault, desktop, mobile); asks about Steedos-specific
  Amis components: steedos-record-service, steedos-object-listview, steedos-record-form;
  asks how to override the default detail view for a specific object.
  SKIP: user wants a STANDALONE page not bound to an object — use steedos-micro-pages;
  user wants action buttons on a record — use steedos-object-buttons.
  Creates customizable record detail (type: record) and list (type: list) pages for
  specific Steedos objects using Amis, with pageAssignments binding.
---
# Steedos Object Pages | Steedos 对象页面

## Overview | 概述

Object pages are custom record detail or list pages that replace or enhance the default UI for specific objects. They are defined as paired `.page.yml` and `.page.amis.json` files, associated with objects via `pageAssignments`.

对象页面是自定义的记录详情或列表页面，替换或增强特定对象的默认 UI。通过 `pageAssignments` 与对象关联。

## File Location | 文件位置

Object pages are in the `pages/` folder (NOT inside object folders):

```
steedos-packages/
└── my-package/
    └── main/default/
        └── pages/
            ├── order_detail.page.yml              # Record page metadata
            ├── order_detail.page.amis.json        # Record page UI schema
            ├── order_detail_mobile.page.yml       # Mobile variant
            ├── order_detail_mobile.page.amis.json
            ├── order_list.page.yml                # List page metadata
            └── order_list.page.amis.json
```

## Page Types | 页面类型

### Record Page (type: record) | 记录页面

Replaces the default record detail view for an object:

```yaml
# pages/order_detail.page.yml
name: order_detail
label: Order Detail
type: record
object_name: orders
render_engine: amis
is_active: true
locked: false
pageAssignments:
  - type: orgDefault
    page: order_detail
    desktop: true
    mobile: false
```

### List Page (type: list) | 列表页面

Replaces the default list view for an object:

```yaml
# pages/order_list.page.yml
name: order_list
label: Order List
type: list
object_name: orders
render_engine: amis
is_active: true
locked: false
pageAssignments:
  - type: orgDefault
    page: order_list
    desktop: true
    mobile: false
```

## Page YAML Properties | 页面 YAML 属性

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `name` | string | Yes | Unique page name |
| `label` | string | Yes | Display label |
| `type` | string | Yes | **⚠️ MUST be `record` or `list`. No other values are valid.** |
| `object_name` | string | Yes | Associated object API name |
| `render_engine` | string | Yes | **⚠️ MUST be `amis`. No other value is valid.** |
| `is_active` | boolean | Yes | Enable/disable page |
| `locked` | boolean | No | Lock from editing |
| `pageAssignments` | array | Yes | Desktop/mobile display settings |

### pageAssignments | 页面分配

```yaml
pageAssignments:
  - type: orgDefault        # Default for entire org
    page: order_detail      # Page name reference
    desktop: true           # Show on desktop
    mobile: false           # Don't show on mobile
```

## API Call Rules | API 调用规则

> **⚠️ CRITICAL: When calling `/api/v6/data/` endpoints in Amis schemas, the `skip` and `top` query parameters are REQUIRED. Omitting them will cause errors or return incomplete data.**
>
> **⚠️ 重要：在 Amis Schema 中调用 `/api/v6/data/` 接口时，`skip` 和 `top` 查询参数是必填的。省略会导致错误或返回不完整数据。**

```
✅ Correct:  /api/v6/data/orders?skip=0&top=20
❌ Wrong:    /api/v6/data/orders
```

This rule applies to ALL `/api/v6/` list endpoints: `/api/v6/data/`, `/api/v6/tables/`, `/api/v6/direct/`.

## API v6 Response Structures | API v6 响应数据结构

> **⚠️ Different endpoints return DIFFERENT response formats. You MUST use the correct structure when writing `adaptor` or accessing data.**

| Endpoint | Response Format |
|----------|----------------|
| `GET /api/v6/data/:obj` (list) | `{ "data": [...], "totalCount": 42 }` — Items in `data` array |
| `GET /api/v6/data/:obj/:id` (single) | `{ "_id": "...", "name": "...", ... }` — Raw document, **NOT** wrapped |
| `POST /api/v6/data/:obj` (create) | `{ "_id": "...", ... }` — Raw created document, **NOT** wrapped |
| `PATCH /api/v6/data/:obj/:id` (update) | `{ "_id": "...", ... }` — Raw updated document, **NOT** wrapped |
| `DELETE /api/v6/data/:obj/:id` (delete) | `{ "deleted": true, "_id": "..." }` |
| `POST /api/v6/functions/:obj/:fn` (function) | Whatever the function returns — **NO wrapping**, raw return value |

### Amis Adaptor for Function Calls | 函数调用适配器

```json
{
  "api": {
    "url": "/api/v6/functions/orders/approve",
    "method": "post",
    "requestAdaptor": "api.data = { id: context.recordId }",
    "adaptor": "return { ...payload, msg: payload.message || 'Success' }",
    "messages": { "success": "${msg}" }
  }
}
```

> **📖 For complete API v6 documentation** (all endpoints, filter operators, complex filters, authentication), **load the [steedos-server-api](../steedos-server-api/SKILL.md) skill**.
>
> **📖 如需 API v6 完整文档**（所有端点、筛选运算符、复合筛选、认证方式），**请加载 [steedos-server-api](../steedos-server-api/SKILL.md) 技能**。

## Amis JSON Schema | Amis JSON Schema

### Record Detail Page Example | 记录详情页面示例

```json
// pages/order_detail.page.amis.json
{
  "type": "page",
  "body": [
    {
      "type": "steedos-record-service",
      "objectApiName": "orders",
      "id": "steedos-record-detail",
      "body": [
        {
          "type": "steedos-record-detail-header"
        },
        {
          "type": "grid",
          "columns": [
            {
              "lg": 8,
              "md": 12,
              "body": [
                {
                  "type": "steedos-record-detail",
                  "objectApiName": "orders"
                }
              ]
            },
            {
              "lg": 4,
              "md": 12,
              "body": [
                {
                  "type": "panel",
                  "title": "Order Summary",
                  "body": {
                    "type": "tpl",
                    "tpl": "<div class=\"p-4\"><div class=\"text-2xl font-bold\">¥${total_amount}</div><div class=\"mt-2 text-gray-600\">${status}</div></div>"
                  }
                }
              ]
            }
          ]
        },
        {
          "type": "tabs",
          "className": "mt-4",
          "tabs": [
            {
              "title": "Order Items",
              "body": {
                "type": "steedos-object-listview",
                "objectApiName": "order_items",
                "filters": [["order", "=", "${_id}"]],
                "listName": "all"
              }
            },
            {
              "title": "Attachments",
              "body": {
                "type": "steedos-object-listview",
                "objectApiName": "cms_files",
                "filters": [["parent.ids", "=", "${_id}"]],
                "listName": "all"
              }
            }
          ]
        }
      ]
    }
  ]
}
```

### Mobile Record Page Example | 移动端记录页面示例

```yaml
# pages/order_detail_mobile.page.yml
name: order_detail_mobile
label: Order Detail (Mobile)
type: record
object_name: orders
render_engine: amis
is_active: true
locked: false
pageAssignments:
  - type: orgDefault
    page: order_detail_mobile
    desktop: false
    mobile: true
```

The mobile `.page.amis.json` typically uses a simpler single-column layout.

## Steedos-Specific Amis Components | Steedos 专用 Amis 组件

| Component | Description |
|-----------|-------------|
| `steedos-record-service` | Data loader for a single record |
| `steedos-record-detail-header` | Standard record header with buttons |
| `steedos-record-detail` | Standard record detail form |
| `steedos-object-listview` | Standard object list view component |

### steedos-record-service

Wraps record data loading. All child components can access record fields via `${fieldName}`:

```json
{
  "type": "steedos-record-service",
  "objectApiName": "orders",
  "id": "steedos-record-detail",
  "body": [...]
}
```

### steedos-object-listview

Embeds a list view for related records:

```json
{
  "type": "steedos-object-listview",
  "objectApiName": "order_items",
  "filters": [["order", "=", "${_id}"]],
  "listName": "all"
}
```

## Best Practices | 最佳实践

1. **Always pass `skip` and `top`**: Every `/api/v6/data/` list call in Amis schemas MUST include `skip` and `top` parameters.（每个 `/api/v6/data/` 列表请求必须包含 `skip` 和 `top` 参数）
2. **Create separate desktop and mobile pages**: Use `_mobile` suffix naming convention
3. **Use pageAssignments**: Set `desktop: true, mobile: false` for desktop pages and vice versa
4. **Leverage Steedos components**: Use `steedos-record-service`, `steedos-record-detail`, and `steedos-object-listview` instead of raw API calls where possible
5. **Keep AMIS JSON in separate file**: Never put AMIS schema inline in the `.page.yml`
6. **Use responsive grid**: `lg`/`md` breakpoints for multi-column layouts on desktop
