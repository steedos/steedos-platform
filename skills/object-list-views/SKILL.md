---
name: object-list-views
description: |
  Define list views for displaying Steedos object records in table format.
  List views are .listview.yml files in objects/{name}/listviews/. Covers
  column configuration, filter operators and conditions, date-based filters,
  searchable fields, sorting, mobile columns, view types (grid, calendar,
  kanban), crud_mode, shared settings, and filter scope.
---
# Steedos Object List Views | Steedos 对象列表视图

## Overview | 概述

List views define how records are displayed in table format. Each view is a separate `.listview.yml` file in the object's `listviews/` subfolder.

列表视图定义记录的表格显示方式。每个视图是独立的 `.listview.yml` 文件，位于对象的 `listviews/` 子文件夹中。

## File Location | 文件位置

```
steedos-packages/
└── my-package/
    └── main/default/
        └── objects/
            └── orders/
                └── listviews/
                    ├── all.listview.yml
                    ├── my_orders.listview.yml
                    ├── pending_approval.listview.yml
                    └── high_value.listview.yml
```

## List View Structure | 列表视图结构

```yaml
# objects/orders/listviews/all.listview.yml
name: all
label: 所有订单
is_enable: true
shared: true
shared_to: space
filter_scope: space
crud_mode: table
columns:
  - field: order_number
  - field: customer
  - field: total_amount
  - field: status
  - field: created
sort:
  - field_name: created
    order: desc
searchable_fields:
  - field: order_number
  - field: customer
mobile_columns:
  - field: order_number
  - field: status
```

## Properties | 属性

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `name` | string | Yes | Unique view name |
| `label` | string | Yes | Display label (use the language of the user's prompt) |
| `is_enable` | boolean | Yes | Enable/disable view |
| `crud_mode` | string | No | Display mode: `table` (default), `cards` |
| `columns` | array | Yes | Displayed columns |
| `shared` | boolean | No | Share with all users |
| `shared_to` | string | No | Who can see: `mine` (default), `space`, `organizations` |
| `filter_scope` | string | Yes | Data scope: `space` (all records, default), `mine` (my records only) |
| `filters` | array | No | Default filter conditions |
| `sort` | array | No | Default sort order (each item: `field_name` + `order`: `asc`/`desc`) |
| `searchable_fields` | array | No | Full-text search fields |
| `mobile_columns` | array | No | Mobile-optimized columns |
| `extra_columns` | array | No | Hidden columns (available for formulas) |
| `scrolling_mode` | string | No | Scroll behavior: `standard` (default), `virtual`, `infinite` |
| `show_count` | boolean | No | Show record count |

## Columns | 列配置

```yaml
# Simple column
columns:
  - field: name

# With width and wrapping
columns:
  - field: name
    width: '200'
    wrap: true
  - field: description
    width: '300'
    wrap: true
```

## Filters | 筛选器

```yaml
# Single filter
filters:
  - ["status", "=", "active"]

# Multiple filters (AND)
filters:
  - ["status", "=", "active"]
  - ["total_amount", ">", 10000]

# Current user
filters:
  - ["owner", "=", "{userId}"]

# Date-based
filters:
  - ["created", ">=", "{last_n_days(7)}"]
```

### Filter Operators | 筛选运算符

| Operator | Description |
|----------|-------------|
| `=` | Equal |
| `!=` | Not equal |
| `>` | Greater than |
| `>=` | Greater than or equal |
| `<` | Less than |
| `<=` | Less than or equal |
| `contains` | Contains text |
| `startswith` | Starts with |
| `in` | In list |
| `notin` | Not in list |
| `between` | Between range |

## Sorting | 排序

```yaml
sort:
  - field_name: status
    order: asc
  - field_name: created
    order: desc
```

## Complete Examples | 完整示例

### All Records View | 全部记录视图
```yaml
# objects/orders/listviews/all.listview.yml
name: all
label: 所有订单
is_enable: true
shared: true
shared_to: space
filter_scope: space
crud_mode: table
columns:
  - field: order_number
  - field: customer
  - field: order_date
  - field: total_amount
  - field: status
  - field: owner
  - field: created
sort:
  - field_name: created
    order: desc
searchable_fields:
  - field: order_number
  - field: customer
mobile_columns:
  - field: order_number
  - field: total_amount
  - field: status
```

### My Records View | 我的记录视图
```yaml
# objects/orders/listviews/my_orders.listview.yml
name: my_orders
label: 我的订单
is_enable: true
shared: true
filter_scope: mine
crud_mode: table
columns:
  - field: order_number
  - field: customer
  - field: total_amount
  - field: status
sort:
  - field_name: created
    order: desc
```

### Filtered View | 筛选视图
```yaml
# objects/orders/listviews/pending_approval.listview.yml
name: pending_approval
label: 待审批
is_enable: true
shared: true
filter_scope: space
crud_mode: table
filters:
  - ["status", "=", "submitted"]
columns:
  - field: order_number
  - field: customer
  - field: total_amount
  - field: submitted_at
  - field: owner
sort:
  - field_name: submitted_at
    order: asc
```

### High Value View | 高价值视图
```yaml
# objects/orders/listviews/high_value.listview.yml
name: high_value
label: 高价值订单
is_enable: true
shared: true
filter_scope: space
crud_mode: table
filters:
  - ["total_amount", ">", 50000]
columns:
  - field: order_number
  - field: customer
  - field: total_amount
    width: '150'
  - field: status
  - field: owner
sort:
  - field_name: total_amount
    order: desc
```

## Best Practices | 最佳实践

1. **Limit columns**: 5-8 columns for readability
2. **Add searchable_fields**: Enable search on key fields
3. **Mobile columns**: Only essential fields for mobile
4. **Meaningful filters**: Create views that match common workflows
5. **Label follows user's language**: Write `label` in the language of the user's prompt. For i18n, use the translations skill
6. **Default sort**: Always specify a meaningful sort order
