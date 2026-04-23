---
name: object-micro-pages
description: |
  Create customizable record detail and list pages for Steedos objects using
  Amis. Pages are defined as paired .page.yml and .page.amis.json files in
  main/default/pages/. Covers record pages (type: record), list pages
  (type: list), pageAssignments for associating pages with objects,
  desktop/mobile variants, and Steedos-specific Amis components like
  steedos-record-service and steedos-object-listview.
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

1. **Create separate desktop and mobile pages**: Use `_mobile` suffix naming convention
2. **Use pageAssignments**: Set `desktop: true, mobile: false` for desktop pages and vice versa
3. **Leverage Steedos components**: Use `steedos-record-service`, `steedos-record-detail`, and `steedos-object-listview` instead of raw API calls where possible
4. **Keep AMIS JSON in separate file**: Never put AMIS schema inline in the `.page.yml`
5. **Use responsive grid**: `lg`/`md` breakpoints for multi-column layouts on desktop
