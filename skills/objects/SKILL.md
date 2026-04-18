---
name: objects
description: |
  Defines Steedos object data models using YAML. Objects represent database
  tables with fields, permissions, list views, and behaviors. Use this skill to
  create and configure objects, define fields, set up relationships, configure
  feature flags, and establish naming conventions. Modern format uses separate
  .field.yml, .listview.yml, .permission.yml, .button.yml files in subfolders.
---

# Steedos Objects | Steedos 对象定义

## Overview | 概述

Steedos objects are the foundation of your data model. Each object represents a database table. Objects are defined using `.object.yml` files, with related metadata (fields, list views, permissions, buttons) in separate files within subfolders.

Steedos 对象是数据模型的基础。每个对象代表一个数据库表。对象使用 `.object.yml` 文件定义，相关元数据（字段、列表视图、权限、按钮）在子文件夹的独立文件中定义。

## File Location | 文件位置

### Modern Format (Recommended) | 现代格式（推荐）

Each object has its own folder with separate metadata files:

```
steedos-packages/
└── my-package/
    └── main/default/
        └── objects/
            └── orders/
                ├── orders.object.yml           # Object definition
                ├── fields/                      # Field definitions
                │   ├── order_number.field.yml
                │   ├── customer.field.yml
                │   ├── status.field.yml
                │   └── total_amount.field.yml
                ├── listviews/                   # List view definitions
                │   ├── all.listview.yml
                │   ├── my_orders.listview.yml
                │   └── pending.listview.yml
                ├── permissions/                 # Permission definitions
                │   ├── user.permission.yml
                │   └── admin.permission.yml
                └── buttons/                     # Button definitions
                    ├── submit_order.button.yml
                    └── standard_delete.button.yml
```

**Note**: Triggers and functions are in separate top-level folders:
```
main/default/
├── triggers/
│   └── orders_validate.trigger.yml
└── functions/
    └── approve_order.function.yml
```

## Object Definition | 对象定义

### Minimal Object | 最小对象定义

```yaml
# objects/products/products.object.yml
name: products
label: Product
custom: true
```

Fields, list views, and permissions are defined in separate files under the object folder.

### Complete Object | 完整对象定义

```yaml
# objects/orders/orders.object.yml
name: orders
label: Order
label_zh: 订单
icon: orders
custom: true
version: 2
is_enable: true
enable_search: true
enable_files: true
enable_api: true
enable_audit: true
enable_trash: true
enable_enhanced_lookup: true
enable_inline_edit: true
enable_dataloader: true
```

## Core Properties | 核心属性

### Basic Properties | 基本属性

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `name` | string | Yes | Object API name (snake_case) |
| `label` | string | Yes | English label for UI |
| `label_zh` | string | No | Chinese label for UI |
| `icon` | string | No | Icon name from SLDS |
| `custom` | boolean | No | Mark as custom object |
| `version` | number | No | Object schema version |
| `is_enable` | boolean | No | Object is active |

### Feature Flags | 功能开关

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `enable_search` | boolean | true | Enable global search |
| `enable_files` | boolean | false | Enable file attachments |
| `enable_api` | boolean | true | Enable API access |
| `enable_audit` | boolean | false | Enable field history tracking |
| `enable_trash` | boolean | true | Enable recycle bin |
| `enable_enhanced_lookup` | boolean | true | Enhanced lookup UI |
| `enable_inline_edit` | boolean | false | Inline editing in list views |
| `enable_dataloader` | boolean | false | Bulk operation support |
| `enable_workflow` | boolean | false | Workflow support |
| `enable_lock_detail` | boolean | false | Record locking |

### Field Groups | 字段分组

Organize fields into collapsible groups in the UI:

```yaml
# objects/orders/orders.object.yml
field_groups:
  - group_name: Basic Information
  - group_name: Shipping Details
    collapsed: true
  - group_name: Approval Info
    collapsed: true
    visible_on: "{{status != 'draft'}}"
```

## Standard Fields | 标准字段

Steedos automatically adds these system fields to every object (no need to define):

| Field | Type | Description |
|-------|------|-------------|
| `_id` | text | Record ID (primary key) |
| `name` | text | Record name/title |
| `owner` | lookup → users | Record owner |
| `space` | lookup → spaces | Workspace ID |
| `created` | datetime | Creation date |
| `created_by` | lookup → users | Creator |
| `modified` | datetime | Last modified date |
| `modified_by` | lookup → users | Last modifier |
| `company_id` | lookup → company | Primary company |
| `company_ids` | lookup → company (multiple) | Associated companies |

## Complete Example | 完整示例

### Object with Separate Files | 带独立文件的对象

**Object definition:**
```yaml
# objects/orders/orders.object.yml
name: orders
label: Order
label_zh: 订单
icon: orders
custom: true
version: 2
is_enable: true
enable_search: true
enable_files: true
enable_api: true
enable_audit: true
enable_trash: true
enable_enhanced_lookup: true
field_groups:
  - group_name: Basic Information
  - group_name: Financial
  - group_name: Shipping
    collapsed: true
```

**Field files:**
```yaml
# objects/orders/fields/order_number.field.yml
name: order_number
type: autonumber
label: Order Number
label_zh: 订单号
formula: 'ORD-{YYYY}{MM}{DD}-{0000}'
readonly: true
sort_no: 100
```

```yaml
# objects/orders/fields/customer.field.yml
name: customer
type: lookup
label: Customer
label_zh: 客户
reference_to: customers
required: true
index: true
sort_no: 200
```

```yaml
# objects/orders/fields/status.field.yml
name: status
type: select
label: Status
label_zh: 状态
required: true
index: true
sort_no: 300
options:
  - label: Draft
    value: draft
  - label: Submitted
    value: submitted
  - label: Approved
    value: approved
  - label: Completed
    value: completed
  - label: Cancelled
    value: cancelled
```

```yaml
# objects/orders/fields/total_amount.field.yml
name: total_amount
type: currency
label: Total Amount
label_zh: 总金额
scale: 2
readonly: true
group: Financial
sort_no: 400
```

**List view file:**
```yaml
# objects/orders/listviews/all.listview.yml
name: all
label: All Orders
is_enable: true
shared: true
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
```

**Permission file:**
```yaml
# objects/orders/permissions/user.permission.yml
name: orders.user
permission_set_id: user
allowCreate: true
allowRead: true
allowEdit: true
allowDelete: false
viewAllRecords: true
modifyAllRecords: false
```

**Button file:**
```yaml
# objects/orders/buttons/submit_order.button.yml
name: submit_order
label: Submit
type: amis_button
on: record_only
is_enable: true
visible: true
amis_schema: |-
  {
    "type": "button",
    "label": "Submit",
    "level": "primary",
    "visibleOn": "${status == 'draft'}",
    "onEvent": {
      "click": {
        "actions": [
          {
            "actionType": "ajax",
            "api": {
              "url": "/api/v1/orders/functions/submit_order",
              "method": "post",
              "requestAdaptor": "api.data = { id: api.body.recordId }",
              "messages": { "success": "Order submitted" }
            }
          },
          { "actionType": "broadcast", "args": { "eventName": "steedos:record:reload" } }
        ]
      }
    }
  }
```

## Naming Conventions | 命名规范

```yaml
# Object names: lowercase, plural, underscores for multi-word
name: customers        # Good
name: sales_orders     # Good
name: SalesOrders      # Bad - no CamelCase
name: sales-orders     # Bad - no hyphens

# Field names: lowercase, underscores
customer_name          # Good
orderDate              # Bad - no camelCase
```

## Object Relationships | 对象关系

- **lookup**: One-to-many (no cascade delete)
- **master_detail**: Parent-child (cascade delete, child inherits sharing)

See the object-fields skill for detailed relationship field configuration.

## Best Practices | 最佳实践

1. **Use separate files**: Put fields, listviews, permissions, and buttons in their own files for better version control
2. **Always provide bilingual labels**: `label` (English) and `label_zh` (Chinese)
3. **Add indexes**: Set `index: true` on frequently queried fields
4. **Use field groups**: Organize related fields into collapsible groups
5. **Name objects as plurals**: `orders`, `customers`, `products` (not singular)
