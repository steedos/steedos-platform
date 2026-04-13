# Steedos Objects | Steedos 对象定义

## Overview | 概述

Steedos objects are the foundation of your data model. Each object represents a database table and defines its structure, fields, permissions, and behaviors. Objects are defined using YAML files with the `.object.yml` extension.

Steedos 对象是数据模型的基础。每个对象代表一个数据库表,定义其结构、字段、权限和行为。对象使用 `.object.yml` 扩展名的 YAML 文件定义。

## File Location | 文件位置

```
steedos-packages/
└── my-package/
    └── main/default/
        └── objects/
            ├── customers.object.yml         # Simple format
            └── orders/                      # Folder format (recommended)
                ├── orders.object.yml        # Object definition
                ├── orders.trigger.js        # Triggers
                └── orders.action.js         # Actions
```

**Note**: Triggers (.trigger.js) should be placed in `main/default/triggers/` folder, NOT inside object folders.

**注意**: 触发器文件 (.trigger.js) 应该放在 `main/default/triggers/` 文件夹中,而不是对象文件夹内。

## Object Definition Structure | 对象定义结构

### Minimal Object | 最小对象定义

```yaml
name: customers
label: Customer
fields:
  name:
    type: text
    label: Name
    required: true
```

### Complete Object | 完整对象定义

```yaml
name: customers
label: Customer
label_zh: 客户
icon: account
description: Customer management
enable_search: true
enable_files: true
enable_tasks: true
enable_notes: true
enable_api: true
enable_share: true
enable_chatter: false
enable_audit: true
enable_trash: true
enable_space_global: false
enable_tree: false
enable_enhanced_lookup: true
is_enable: true
version: 2

fields:
  # Field definitions (see 06-object-fields.md)

list_views:
  # List view definitions (see 08-object-list-views.md)

permission_set:
  # Permission configurations (see 09-object-permissions.md)

actions:
  # Quick actions (inline definition)

triggers:
  # Workflow triggers (inline definition)
```

## Core Properties | 核心属性

### Basic Properties | 基本属性

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `name` | string | Yes | Object API name (snake_case) |
| `label` | string | Yes | English label for UI |
| `label_zh` | string | No | Chinese label for UI |
| `icon` | string | No | Icon name from SLDS |
| `description` | string | No | Object description |
| `version` | number | No | Object schema version (default: 1) |

```yaml
name: customers
label: Customer
label_zh: 客户
icon: account
description: Customer relationship management
version: 2
```

### Feature Flags | 功能开关

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `enable_search` | boolean | true | Enable global search |
| `enable_files` | boolean | false | Enable file attachments |
| `enable_tasks` | boolean | false | Enable related tasks |
| `enable_notes` | boolean | false | Enable notes/comments |
| `enable_api` | boolean | true | Enable API access |
| `enable_share` | boolean | false | Enable record sharing |
| `enable_chatter` | boolean | false | Enable social features |
| `enable_audit` | boolean | false | Enable field history tracking |
| `enable_trash` | boolean | true | Enable recycle bin |
| `enable_tree` | boolean | false | Enable tree/hierarchy view |
| `enable_enhanced_lookup` | boolean | true | Enhanced lookup UI |
| `is_enable` | boolean | true | Object is active |

```yaml
# Enable common features
enable_search: true
enable_files: true
enable_tasks: true
enable_api: true
enable_audit: true
```

### Data Source | 数据源

```yaml
# Use default data source (MongoDB)
datasource: default

# Use specific data source
datasource: mysql_prod

# Use custom database
database_name: custom_db
```

### Display Options | 显示选项

```yaml
# Hide from app menu
hidden: true

# Display in sidebar
is_view: true

# Enable inline editing in list views
enable_inline_edit: true

# Enable import/export
enable_import: true
enable_export: true

# Record display template
record_name: "name"  # or formula: "{name} - {code}"
```

## Standard Fields | 标准字段

Steedos automatically adds these system fields to every object:

Steedos 自动为每个对象添加这些系统字段:

```yaml
# Automatically added (no need to define)
_id:          # Record ID (primary key)
  type: text

name:         # Record name/title (if not defined)
  type: text
  label: Name

owner:        # Record owner
  type: lookup
  reference_to: users

space:        # Workspace ID
  type: lookup
  reference_to: spaces

created:      # Creation date
  type: datetime

created_by:   # Creator
  type: lookup
  reference_to: users

modified:     # Last modified date
  type: datetime

modified_by:  # Last modifier
  type: lookup
  reference_to: users

company_id:   # Primary company
  type: lookup
  reference_to: company

company_ids:  # Associated companies
  type: lookup
  reference_to: company
  multiple: true

locked:       # Record is locked
  type: boolean

instance_state: # Approval state
  type: select
```

### Hiding System Fields | 隐藏系统字段

```yaml
fields:
  created:
    omit: true
    hidden: true

  modified:
    omit: true
    hidden: true

  owner:
    omit: false    # Show but don't allow editing
    readonly: true
```

## Object Naming Conventions | 对象命名规范

### Object Name | 对象名称

```yaml
# Good - lowercase, underscores for multi-word
name: customers
name: sales_orders
name: product_categories

# Bad - avoid
name: Customers        # No uppercase
name: sales-orders     # No hyphens
name: SalesOrders      # No CamelCase
```

### Field Names | 字段名称

```yaml
fields:
  # Good - descriptive, snake_case
  customer_name:
    type: text

  order_date:
    type: date

  total_amount:
    type: currency

  # Bad - avoid
  CustomerName:    # No CamelCase
  order-date:      # No hyphens
  amt:             # Avoid abbreviations
```

## Complete Examples | 完整示例

### Example 1: Simple Object | 简单对象

```yaml
name: products
label: Product
label_zh: 产品
icon: product
enable_search: true
enable_api: true

fields:
  name:
    type: text
    label: Product Name
    label_zh: 产品名称
    required: true
    searchable: true
    index: true

  code:
    type: text
    label: Product Code
    label_zh: 产品编号
    unique: true
    index: true

  price:
    type: currency
    label: Price
    label_zh: 价格
    scale: 2
    required: true

  category:
    type: select
    label: Category
    label_zh: 类别
    options:
      - label: Electronics
        value: electronics
      - label: Clothing
        value: clothing
      - label: Food
        value: food

  in_stock:
    type: boolean
    label: In Stock
    label_zh: 有货
    default_value: true

  description:
    type: textarea
    label: Description
    label_zh: 描述
    rows: 4

list_views:
  all:
    label: All Products
    columns:
      - name
      - code
      - price
      - category
      - in_stock
    sort:
      - field_name: created
        order: desc

permission_set:
  user:
    allowCreate: true
    allowRead: true
    allowEdit: true
    allowDelete: false

  admin:
    allowCreate: true
    allowRead: true
    allowEdit: true
    allowDelete: true
    modifyAllRecords: true
    viewAllRecords: true
```

### Example 2: Complex Object with Relationships | 复杂对象(含关系)

```yaml
name: orders
label: Order
label_zh: 订单
icon: orders
enable_search: true
enable_files: true
enable_api: true
enable_audit: true
version: 2

fields:
  # Basic Information
  order_number:
    type: autonumber
    label: Order Number
    label_zh: 订单号
    formula: 'ORD-{YYYY}{MM}{DD}-{0000}'
    readonly: true
    sort_no: 100

  order_date:
    type: date
    label: Order Date
    label_zh: 订单日期
    required: true
    defaultValue: '{now}'
    sort_no: 110

  # Customer Relationship
  customer:
    type: lookup
    label: Customer
    label_zh: 客户
    reference_to: customers
    required: true
    sort_no: 200

  # Contact Information
  contact:
    type: lookup
    label: Contact
    label_zh: 联系人
    reference_to: contacts
    filters: [["account", "=", "{$customer}"]]  # Filter by customer
    depend_on:
      - customer
    sort_no: 210

  # Financial Information
  subtotal:
    type: currency
    label: Subtotal
    label_zh: 小计
    scale: 2
    readonly: true
    sort_no: 300

  tax_rate:
    type: percent
    label: Tax Rate
    label_zh: 税率
    scale: 2
    default_value: 13
    sort_no: 310

  tax_amount:
    type: formula
    label: Tax Amount
    label_zh: 税额
    formula: !!js/function |
      function() {
        return (this.subtotal || 0) * (this.tax_rate || 0) / 100;
      }
    data_type: currency
    scale: 2
    sort_no: 320

  total_amount:
    type: formula
    label: Total Amount
    label_zh: 总金额
    formula: !!js/function |
      function() {
        return (this.subtotal || 0) + (this.tax_amount || 0);
      }
    data_type: currency
    scale: 2
    sort_no: 330

  # Rollup Summary (count order items)
  item_count:
    type: summary
    label: Item Count
    label_zh: 项目数量
    summary_object: order_items
    summary_type: count
    summary_field: order
    sort_no: 340

  # Status
  status:
    type: select
    label: Status
    label_zh: 状态
    options:
      - label: Draft
        value: draft
        color: gray
      - label: Submitted
        value: submitted
        color: blue
      - label: Approved
        value: approved
        color: green
      - label: Shipped
        value: shipped
        color: purple
      - label: Completed
        value: completed
        color: green
      - label: Cancelled
        value: cancelled
        color: red
    default_value: draft
    required: true
    index: true
    sort_no: 400

  # Shipping Information
  shipping_address:
    type: textarea
    label: Shipping Address
    label_zh: 收货地址
    rows: 3
    is_wide: true
    sort_no: 500

  shipping_date:
    type: date
    label: Shipping Date
    label_zh: 发货日期
    sort_no: 510

  tracking_number:
    type: text
    label: Tracking Number
    label_zh: 物流单号
    sort_no: 520

  # Notes
  notes:
    type: textarea
    label: Notes
    label_zh: 备注
    rows: 4
    is_wide: true
    sort_no: 600

# List Views
list_views:
  all:
    label: All Orders
    label_zh: 所有订单
    columns:
      - order_number
      - customer
      - order_date
      - total_amount
      - status
      - owner
    filter_fields:
      - status
      - customer
      - order_date
    sort:
      - field_name: order_date
        order: desc

  my_orders:
    label: My Orders
    label_zh: 我的订单
    filters: [["owner", "=", "{userId}"]]
    columns:
      - order_number
      - customer
      - order_date
      - total_amount
      - status
    sort:
      - field_name: order_date
        order: desc

  pending_approval:
    label: Pending Approval
    label_zh: 待审批
    filters: [["status", "=", "submitted"]]
    columns:
      - order_number
      - customer
      - order_date
      - total_amount
      - owner

  recent_shipped:
    label: Recently Shipped
    label_zh: 近期发货
    filters:
      - ["status", "=", "shipped"]
      - ["shipping_date", ">=", "{lastNDays(7)}"]
    columns:
      - order_number
      - customer
      - shipping_date
      - tracking_number
      - total_amount

# Permission Sets
permission_set:
  user:
    allowCreate: true
    allowRead: true
    allowEdit: true
    allowDelete: false
    modifyAllRecords: false
    viewAllRecords: true

  sales_manager:
    allowCreate: true
    allowRead: true
    allowEdit: true
    allowDelete: true
    modifyAllRecords: true
    viewAllRecords: true

  admin:
    allowCreate: true
    allowRead: true
    allowEdit: true
    allowDelete: true
    modifyAllRecords: true
    viewAllRecords: true
```

## Object Relationships | 对象关系

See [06-object-fields.md](./06-object-fields.md) for detailed information on relationship fields:
- `lookup`: One-to-many relationships
- `master_detail`: Parent-child relationships (cascade delete)

查看 [06-object-fields.md](./06-object-fields.md) 了解关系字段的详细信息:
- `lookup`: 一对多关系
- `master_detail`: 父子关系(级联删除)

## Best Practices | 最佳实践

### 1. Naming Conventions | 命名规范

```yaml
# Use descriptive, plural names for objects
name: customers     # Good
name: customer      # Bad (should be plural)

# Use snake_case for all names
name: sales_orders  # Good
name: SalesOrders   # Bad
```

### 2. Required Fields | 必填字段

```yaml
fields:
  # Always have a meaningful 'name' field
  name:
    type: text
    label: Customer Name
    required: true
    searchable: true
    index: true
```

### 3. Indexes | 索引

```yaml
fields:
  # Add indexes to frequently queried fields
  email:
    type: email
    label: Email
    unique: true
    index: true

  status:
    type: select
    label: Status
    index: true  # Frequently used in filters
```

### 4. Performance | 性能

```yaml
# Use summary fields instead of counting in code
item_count:
  type: summary
  summary_object: order_items
  summary_type: count

# Use formula fields for calculations
total:
  type: formula
  formula: !!js/function |
    function() { return this.quantity * this.price; }
```

### 5. Labels | 标签

```yaml
# Always provide both English and Chinese labels
name: customers
label: Customer
label_zh: 客户

fields:
  name:
    label: Customer Name
    label_zh: 客户名称
```

### 6. Field Organization | 字段组织

```yaml
fields:
  # Use sort_no to control field order
  name:
    sort_no: 100
  code:
    sort_no: 110
  status:
    sort_no: 200

  # Use groups for better organization
  shipping_address:
    group: Shipping Information
    sort_no: 300
```

## Validation | 验证

### Field-Level Validation | 字段级验证

```yaml
fields:
  email:
    type: email
    required: true
    pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'

  phone:
    type: text
    pattern: '^1[3-9]\d{9}$'
    error_message: 'Please enter valid phone number'

  age:
    type: number
    min: 0
    max: 150
```

### Server-Side Validation | 服务端验证

See [10-object-triggers.md](./10-object-triggers.md) for trigger-based validation.

查看 [10-object-triggers.md](./10-object-triggers.md) 了解基于触发器的验证。

## Troubleshooting | 故障排除

### Object Not Appearing | 对象未显示

1. Check object file syntax (YAML format)
2. Verify `is_enable: true`
3. Check permissions
4. Restart server

### Fields Not Saving | 字段无法保存

1. Check field `type` is valid
2. Verify `required` fields are provided
3. Check field validations (min, max, pattern)
4. Review server logs for errors

### Performance Issues | 性能问题

1. Add indexes to frequently queried fields
2. Use summary fields instead of counting
3. Use formula fields for calculations
4. Optimize lookup filters

## References | 参考资料

- [06-object-fields.md](./06-object-fields.md) - Field types reference
- [07-object-buttons.md](./07-object-buttons.md) - Custom actions
- [08-object-list-views.md](./08-object-list-views.md) - List views
- [09-object-permissions.md](./09-object-permissions.md) - Permissions
- [10-object-triggers.md](./10-object-triggers.md) - Triggers
- [ObjectQL Documentation](https://docs.steedos.com/)
