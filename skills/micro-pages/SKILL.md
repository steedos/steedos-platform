---
name: micro-pages
description: |
  Build standalone custom pages using Amis low-code framework, independent of
  object records. Pages are defined as paired .page.yml (metadata) and
  .page.amis.json (UI schema) files in main/default/pages/. Covers page types
  (app, list, record), render_engine configuration, pageAssignments for
  desktop/mobile, and Amis schema with components like service, crud, chart,
  form, wizard, tabs. Includes examples for dashboards, reports, and custom
  forms.
---
# Steedos Standalone Pages | Steedos 独立页面

## Overview | 概述

Standalone pages are custom pages built with Amis low-code framework that are not tied to specific object records. They can serve as dashboards, reports, custom forms, or any custom UI. Each page is defined as a pair of files: `.page.yml` (metadata) and `.page.amis.json` (UI schema).

独立页面使用 Amis 低代码框架构建，不绑定到特定对象记录。每个页面由一对文件定义：`.page.yml`（元数据）和 `.page.amis.json`（UI schema）。

## File Location | 文件位置

```
steedos-packages/
└── my-package/
    └── main/default/
        └── pages/
            ├── sales_dashboard.page.yml           # Page metadata
            ├── sales_dashboard.page.amis.json     # Amis UI schema
            ├── order_report.page.yml
            └── order_report.page.amis.json
```

## Page Definition | 页面定义

### Page YAML (Metadata) | 页面 YAML（元数据）

```yaml
# pages/sales_dashboard.page.yml
name: sales_dashboard
label: Sales Dashboard
type: app
render_engine: amis
is_active: true
locked: false
```

### Page AMIS JSON (UI Schema) | 页面 Amis JSON（UI Schema）

```json
// pages/sales_dashboard.page.amis.json
{
  "type": "page",
  "title": "Sales Dashboard",
  "body": [
    {
      "type": "service",
      "api": "/api/v4/stats/sales-summary",
      "body": [
        {
          "type": "tpl",
          "tpl": "<h2>Total Sales: ¥${total}</h2>"
        }
      ]
    }
  ]
}
```

## Page YAML Properties | 页面 YAML 属性

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `name` | string | Yes | Unique page name |
| `label` | string | Yes | Display label |
| `type` | string | Yes | **⚠️ MUST be one of: `app` (standalone), `record`, `list`. No other values are valid.** |
| `render_engine` | string | Yes | **⚠️ MUST be `amis`. No other value is valid.** |
| `is_active` | boolean | Yes | Enable/disable page |
| `locked` | boolean | No | Lock from editing |
| `object_name` | string | No | Associated object (for record/list types) |
| `pageAssignments` | array | No | Desktop/mobile display settings |
| `widgets` | array | No | Widget configurations |

### Page Types | 页面类型

- `app` — Standalone page (dashboard, report, custom form)
- `record` — Record detail page (replaces default record view)
- `list` — List page (replaces default list view)

### Page Assignments | 页面分配

```yaml
pageAssignments:
  - type: orgDefault
    page: sales_dashboard
    desktop: true
    mobile: false
```

## Amis Schema Guide | Amis Schema 指南

### Common Components | 常用组件

```json
// Service - load data from API
{ "type": "service", "api": "/api/endpoint", "body": [...] }

// CRUD - data table with paging
{ "type": "crud", "api": "/api/v4/orders", "columns": [...] }

// Chart - ECharts integration
{ "type": "chart", "api": "/api/stats", "config": {...} }

// Form - input form with submit
{ "type": "form", "api": "post:/api/endpoint", "body": [...] }

// Tabs - tabbed navigation
{ "type": "tabs", "tabs": [...] }

// Grid - responsive layout
{ "type": "grid", "columns": [...] }

// Template - HTML template with data binding
{ "type": "tpl", "tpl": "<div>${variable}</div>" }
```

## Complete Examples | 完整示例

### Example 1: Sales Dashboard | 销售仪表板

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
      "type": "grid",
      "className": "mt-4",
      "columns": [
        {
          "lg": 8,
          "md": 12,
          "body": {
            "type": "card",
            "header": { "title": "Sales Trend" },
            "body": {
              "type": "chart",
              "api": "/api/v4/stats/sales-trend",
              "config": {
                "xAxis": { "type": "category" },
                "yAxis": { "type": "value" },
                "series": [{ "type": "line", "smooth": true }]
              }
            }
          }
        },
        {
          "lg": 4,
          "md": 12,
          "body": {
            "type": "card",
            "header": { "title": "Top Products" },
            "body": {
              "type": "chart",
              "api": "/api/v4/stats/top-products",
              "config": {
                "series": [{ "type": "pie", "radius": ["40%", "70%"] }]
              }
            }
          }
        }
      ]
    },
    {
      "type": "card",
      "className": "mt-4",
      "header": { "title": "Recent Orders" },
      "body": {
        "type": "crud",
        "api": "/api/v4/orders?$top=10&$orderby=created desc",
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

### Example 2: Custom Report with Filters | 带筛选的自定义报表

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
        {
          "type": "input-date-range",
          "name": "date_range",
          "label": "Date Range"
        },
        {
          "type": "select",
          "name": "status",
          "label": "Status",
          "options": [
            { "label": "All", "value": "" },
            { "label": "Draft", "value": "draft" },
            { "label": "Approved", "value": "approved" },
            { "label": "Completed", "value": "completed" }
          ],
          "clearable": true
        }
      ]
    },
    {
      "type": "crud",
      "name": "report-table",
      "className": "mt-4",
      "api": "/api/v4/orders?$filter=status eq '${status}'",
      "syncLocation": false,
      "columns": [
        { "name": "order_number", "label": "Order #" },
        { "name": "customer__expand.name", "label": "Customer" },
        { "name": "total_amount", "label": "Amount" },
        { "name": "status", "label": "Status" },
        { "name": "created", "label": "Date", "type": "datetime" }
      ]
    }
  ]
}
```

## Steedos-Specific Amis Components | Steedos 特有 Amis 组件

In page AMIS schemas, you can use Steedos-specific components:

```json
// Record detail service - loads and displays a single record
{ "type": "steedos-record-service", "objectApiName": "orders", "recordId": "${recordId}" }

// Record detail header
{ "type": "steedos-record-detail-header" }

// Object list view
{ "type": "steedos-object-listview", "objectApiName": "orders", "listName": "all" }
```

## Best Practices | 最佳实践

1. **Separate metadata from UI**: Keep `.page.yml` minimal (metadata only), put all UI in `.page.amis.json`
2. **Use service components for data**: Load data dynamically with `service` + `api`
3. **Responsive design**: Use `grid` with `lg`/`md` breakpoints
4. **Create mobile variants**: Add `_mobile` suffix for mobile-specific pages (e.g., `dashboard_mobile.page.yml`)
5. **Use pageAssignments**: Control which pages show on desktop vs mobile
