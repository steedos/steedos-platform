---
name: steedos-pages
description: |
  Amis-based custom pages: standalone (type: app) and object-bound (type: record/list).
  TRIGGER: .page.yml, .page.amis.json files; standalone Amis pages for
  dashboards/reports/forms; record detail pages, list pages, pageAssignments;
  Steedos Amis components (steedos-record-service, steedos-object-listview,
  steedos-record-form, steedos-record-detail-header); render_engine: amis.
  SKIP: React webapp → steedos-webapps; action buttons → steedos-object-buttons;
  sidebar nav → steedos-tabs.
---

# Steedos Pages | Steedos 页面

## Overview | 概述

Steedos pages are custom UI built with Amis low-code framework, defined as paired `.page.yml` (metadata) + `.page.amis.json` (UI schema) files. There are three page types:

- **`app`** — Standalone page (dashboard, report, custom form) not tied to any object
- **`record`** — Record detail page replacing the default view for a specific object
- **`list`** — List page replacing the default list view for a specific object

页面由一对文件定义：`.page.yml`（元数据）和 `.page.amis.json`（UI Schema）。

## File Location | 文件位置

All pages go in the `pages/` folder (NOT inside object folders):

```
steedos-packages/
└── my-package/
    └── main/default/
        └── pages/
            ├── sales_dashboard.page.yml           # Standalone page (type: app)
            ├── sales_dashboard.page.amis.json
            ├── order_detail.page.yml              # Record page (type: record)
            ├── order_detail.page.amis.json
            ├── order_detail_mobile.page.yml       # Mobile variant
            ├── order_detail_mobile.page.amis.json
            ├── order_list.page.yml                # List page (type: list)
            └── order_list.page.amis.json
```

## Page YAML Properties | 页面 YAML 属性

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `name` | string | **Yes** | **⚠️ Unique page name. MUST NOT be omitted.** |
| `label` | string | Yes | Display label |
| `type` | string | Yes | **⚠️ MUST be one of: `app` (standalone), `record`, `list`. No other values are valid.** |
| `render_engine` | string | Yes | **⚠️ MUST be `amis`. No other value is valid.** |
| `is_active` | boolean | Yes | Enable/disable page |
| `locked` | boolean | No | Lock from editing |
| `object_name` | string | record/list only | Associated object API name |
| `pageAssignments` | array | record/list only | Desktop/mobile display settings |

---

## Standalone Pages (type: app) | 独立页面

Standalone pages are not tied to any object. Use for dashboards, reports, custom forms.

```yaml
# pages/sales_dashboard.page.yml
name: sales_dashboard
label: Sales Dashboard
type: app
render_engine: amis
is_active: true
locked: false
```

---

## Object Pages (type: record / list) | 对象页面

Object pages replace or enhance the default UI for a specific object.

### Record Page (type: record) | 记录详情页面

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

### pageAssignments | 页面分配

```yaml
pageAssignments:
  - type: orgDefault        # Default for entire org
    page: order_detail      # Page name reference
    desktop: true           # Show on desktop
    mobile: false           # Don't show on mobile
```

---

## API Call Rules | API 调用规则

> **⚠️ CRITICAL: When calling `/api/v6/data/` endpoints in Amis schemas, the `skip` and `top` query parameters are REQUIRED. Omitting them will cause errors or return incomplete data.**
>
> **⚠️ 重要：在 Amis Schema 中调用 `/api/v6/data/` 接口时，`skip` 和 `top` 查询参数是必填的。省略会导致错误或返回不完整数据。**

```
✅ Correct:  /api/v6/data/orders?skip=0&top=20
✅ Correct:  /api/v6/data/orders?skip=0&top=100&filters=["status","=","active"]&sort=created desc
❌ Wrong:    /api/v6/data/orders
❌ Wrong:    /api/v6/data/orders?filters=["status","=","active"]
```

This rule applies to ALL `/api/v6/` list endpoints: `/api/v6/data/`, `/api/v6/tables/`, `/api/v6/direct/`.

## API v6 Response Structures | API v6 响应数据结构

> **⚠️ You MUST use the correct response structure when writing `adaptor` or accessing API response data. Different endpoints return DIFFERENT formats.**

| Endpoint | Response Format | Example |
|----------|----------------|---------|
| `GET /api/v6/data/:obj` (list) | `{ "data": [...], "totalCount": 42 }` | Items in `data` array, total in `totalCount` |
| `GET /api/v6/data/:obj/:id` (single) | `{ "_id": "...", "name": "...", ... }` | Raw document, **NOT** wrapped |
| `POST /api/v6/data/:obj` (create) | `{ "_id": "...", "name": "...", ... }` | Raw created document, **NOT** wrapped |
| `PATCH /api/v6/data/:obj/:id` (update) | `{ "_id": "...", "name": "...", ... }` | Raw updated document, **NOT** wrapped |
| `DELETE /api/v6/data/:obj/:id` (delete) | `{ "deleted": true, "_id": "..." }` | Deletion confirmation |
| `POST /api/v6/functions/:obj/:fn` (function) | Whatever the function returns | **NO wrapping** — raw return value |

### Amis Adaptor Examples | Amis 适配器示例

```json
// CRUD — list endpoint returns { data: [...], totalCount: N }
// Amis CRUD auto-maps this: data → items, totalCount → total
{
  "type": "crud",
  "api": "/api/v6/data/orders?skip=0&top=20"
}

// Service — list endpoint: access items via ${data}
{
  "type": "service",
  "api": "/api/v6/data/orders?skip=0&top=20",
  "body": {
    "type": "tpl",
    "tpl": "Total: ${totalCount}"
  }
}

// Function call — response IS the return value, use adaptor to extract
{
  "api": {
    "url": "/api/v6/functions/orders/get_summary",
    "method": "post",
    "requestAdaptor": "api.data = { id: context.recordId }",
    "adaptor": "return { data: payload }"
  }
}

// Function call with message
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

## Amis Schema Guide | Amis Schema 指南

### Common Components | 常用组件

```json
// Service - load data from API (⚠️ skip & top required for /api/v6/data/)
{ "type": "service", "api": "/api/v6/data/orders?skip=0&top=20", "body": [...] }

// CRUD - data table with paging (⚠️ skip & top required)
{ "type": "crud", "api": "/api/v6/data/orders?skip=0&top=20", "columns": [...] }

// Chart - ECharts integration
{ "type": "chart", "api": "/api/v6/data/stats?skip=0&top=100", "config": {...} }

// Form - input form with submit
{ "type": "form", "api": "post:/api/v6/data/orders", "body": [...] }

// Tabs - tabbed navigation
{ "type": "tabs", "tabs": [...] }

// Grid - responsive layout
{ "type": "grid", "columns": [...] }

// Template - HTML template with data binding
{ "type": "tpl", "tpl": "<div>${variable}</div>" }
```

## Steedos-Specific Amis Components | Steedos 专用 Amis 组件

| Component | Description |
|-----------|-------------|
| `steedos-record-service` | Data loader for a single record — wraps child components, provides `${fieldName}` access |
| `steedos-record-detail-header` | Standard record header with action buttons |
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

## Complete Examples | 完整示例

### Example 1: Standalone Dashboard (type: app)

**pages/sales_dashboard.page.yml:**
```yaml
name: sales_dashboard
label: Sales Dashboard
type: app
render_engine: amis
is_active: true
```

**pages/sales_dashboard.page.amis.json:**
```json
{
  "type": "page",
  "title": "Sales Dashboard",
  "body": [
    {
      "type": "service",
      "api": "/api/v4/stats/sales-summary",
      "body": [
        {
          "type": "grid",
          "columns": [
            {
              "type": "card",
              "className": "bg-blue-50",
              "body": {
                "type": "tpl",
                "tpl": "<div class=\"p-4\"><div class=\"text-gray-600\">Today's Sales</div><div class=\"text-3xl font-bold text-blue-600\">¥${today_sales}</div></div>"
              }
            },
            {
              "type": "card",
              "className": "bg-green-50",
              "body": {
                "type": "tpl",
                "tpl": "<div class=\"p-4\"><div class=\"text-gray-600\">This Month</div><div class=\"text-3xl font-bold text-green-600\">¥${month_sales}</div></div>"
              }
            }
          ]
        }
      ]
    },
    {
      "type": "card",
      "className": "mt-4",
      "header": { "title": "Recent Orders" },
      "body": {
        "type": "crud",
        "api": "/api/v6/data/orders?skip=0&top=10&sort=created desc",
        "syncLocation": false,
        "columns": [
          { "name": "order_number", "label": "Order #" },
          { "name": "customer__expand.name", "label": "Customer" },
          { "name": "total_amount", "label": "Amount", "type": "number" },
          { "name": "status", "label": "Status" }
        ]
      }
    }
  ]
}
```

### Example 2: Record Detail Page (type: record)

**pages/order_detail.page.yml:**
```yaml
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

**pages/order_detail.page.amis.json:**
```json
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

### Example 3: Report with Filters (type: app)

**pages/order_report.page.yml:**
```yaml
name: order_report
label: Order Report
type: app
render_engine: amis
is_active: true
```

**pages/order_report.page.amis.json:**
```json
{
  "type": "page",
  "title": "Order Report",
  "body": [
    {
      "type": "form",
      "mode": "horizontal",
      "wrapWithPanel": false,
      "target": "report-table",
      "submitOnChange": true,
      "body": [
        { "type": "input-date-range", "name": "date_range", "label": "Date Range" },
        {
          "type": "select",
          "name": "status",
          "label": "Status",
          "options": [
            { "label": "All", "value": "" },
            { "label": "Draft", "value": "draft" },
            { "label": "Approved", "value": "approved" }
          ],
          "clearable": true
        }
      ]
    },
    {
      "type": "crud",
      "name": "report-table",
      "className": "mt-4",
      "api": "/api/v6/data/orders?skip=0&top=100&filters=[\"status\",\"=\",\"${status}\"]&sort=created desc",
      "syncLocation": false,
      "columns": [
        { "name": "order_number", "label": "Order #" },
        { "name": "total_amount", "label": "Amount" },
        { "name": "status", "label": "Status" },
        { "name": "created", "label": "Date", "type": "datetime" }
      ]
    }
  ]
}
```

## Best Practices | 最佳实践

1. **Always pass `skip` and `top`**: Every `/api/v6/data/` list call MUST include `skip` and `top` parameters — the #1 mistake when building pages
2. **Separate metadata from UI**: Keep `.page.yml` minimal (metadata only), put all UI in `.page.amis.json`
3. **Create mobile variants**: Add `_mobile` suffix for mobile pages (e.g., `dashboard_mobile.page.yml`)
4. **Use pageAssignments**: Set `desktop: true, mobile: false` for desktop pages and vice versa
5. **Leverage Steedos components**: Use `steedos-record-service`, `steedos-record-detail`, and `steedos-object-listview` instead of raw API calls where possible
6. **Responsive design**: Use `grid` with `lg`/`md` breakpoints for multi-column layouts
