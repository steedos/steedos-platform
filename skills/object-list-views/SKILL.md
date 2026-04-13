---
name: object-list-views
description: |
  Define and configure list views for displaying Steedos object records in table
  format. Use this skill to control visible columns, filtering, sorting, and
  grouping. Covers list view structure, column configuration (including related
  fields, formulas, summaries), filter operators and conditions, date-based
  filters, quick filter sidebars, sorting options, and mobile column
  optimization. Includes examples for various use cases.
---
# Steedos Object List Views | Steedos 对象列表视图

## Overview | 概述

List views define how records are displayed in table format. They control which fields are shown as columns, how records are filtered, sorted, and grouped. List views provide different perspectives on your data for different use cases.

列表视图定义记录如何以表格格式显示。它们控制哪些字段显示为列、记录如何筛选、排序和分组。列表视图为不同用例提供数据的不同视角。

## Definition Location | 定义位置

List views are defined within the object YAML file:

列表视图在对象 YAML 文件中定义:

```yaml
# objects/customers.object.yml
name: customers
label: Customer
fields:
  # ... field definitions

list_views:
  all:
    label: All Customers
    columns:
      - name
      - email
      - phone
    # ... more configuration

  my_customers:
    label: My Customers
    # ... configuration
```

## List View Structure | 列表视图结构

### Minimal List View | 最小列表视图

```yaml
list_views:
  all:
    label: All Records
    columns:
      - name
      - created
```

### Complete List View | 完整列表视图

```yaml
list_views:
  view_name:
    label: View Label
    label_zh: 视图标签
    columns:                          # Columns to display
      - field_name
      - another_field
    filter_scope: space               # Filter scope
    filters:                          # Filter conditions
      - ["field", "operator", "value"]
    filter_fields:                    # Quick filter fields
      - status
      - category
    sort:                             # Sort order
      - field_name: created
        order: desc
    extra_columns:                    # Additional columns
      - related_field
    mobile_columns:                   # Mobile view columns
      - name
      - status
    type: grid                        # View type
    scrolling_mode: standard          # Scrolling behavior
    shared: true                      # Shared with all users
    owner: user_id                    # View owner
```

## Core Properties | 核心属性

### Basic Properties | 基本属性

| Property | Type | Description |
|----------|------|-------------|
| `label` | string | English label |
| `label_zh` | string | Chinese label |
| `columns` | array | Fields to display as columns |
| `filters` | array | Filter conditions |
| `filter_fields` | array | Quick filter sidebar fields |
| `filter_scope` | string | Data scope filter |
| `sort` | array | Sort configuration |
| `type` | string | View type (grid, calendar, kanban) |

## Columns Configuration | 列配置

### Simple Column List | 简单列列表

```yaml
list_views:
  all:
    columns:
      - name                          # Field name
      - email
      - phone
      - status
      - created
```

### Column with Custom Settings | 自定义列设置

```yaml
list_views:
  detailed:
    columns:
      - field: name
        width: 200                    # Column width in pixels
        wrap: true                    # Wrap text

      - field: description
        width: 300
        wrap: true

      - field: amount
        width: 120
        wrap: false
```

### Related Fields | 关联字段

```yaml
list_views:
  with_relationships:
    columns:
      - name
      - customer                      # Lookup field
      - customer.email                # Related field
      - customer.phone                # Related field
      - owner                         # Lookup to users
      - owner.name                    # User name
      - created
```

### Formula and Summary Fields | 公式和汇总字段

```yaml
fields:
  total_amount:
    type: formula
    formula: !!js/function |
      function() { return this.quantity * this.price; }

  order_count:
    type: summary
    summary_object: orders
    summary_type: count

list_views:
  with_calculations:
    columns:
      - name
      - total_amount                  # Formula field
      - order_count                   # Summary field
      - created
```

## Filters | 筛选器

### Filter Operators | 筛选运算符

```yaml
# Equal
filters: [["status", "=", "active"]]

# Not equal
filters: [["status", "!=", "inactive"]]

# Greater than
filters: [["amount", ">", 1000]]

# Greater than or equal
filters: [["amount", ">=", 1000]]

# Less than
filters: [["created", "<", "2024-01-01"]]

# Less than or equal
filters: [["created", "<=", "2024-12-31"]]

# Between
filters: [["amount", "between", [100, 1000]]]

# Contains (like)
filters: [["name", "contains", "test"]]

# Starts with
filters: [["name", "startswith", "A"]]

# In list
filters: [["status", "in", ["active", "pending"]]]

# Not in list
filters: [["status", "notin", ["deleted", "cancelled"]]]
```

### Multiple Filters (AND) | 多个筛选条件(AND)

```yaml
list_views:
  active_high_value:
    label: Active High Value Customers
    filters:
      - ["status", "=", "active"]
      - ["total_purchases", ">", 10000]
      - ["rating", "=", "A"]
```

### Current User Filters | 当前用户筛选

```yaml
list_views:
  my_records:
    label: My Records
    filters: [["owner", "=", "{userId}"]]

  my_team_records:
    label: My Team Records
    filters: [["assigned_to", "=", "{userId}"]]

  my_space_records:
    label: My Space Records
    filters: [["space", "=", "{spaceId}"]]
```

### Date-Based Filters | 基于日期的筛选

```yaml
list_views:
  # Today
  today:
    filters: [["created", "=", "{today}"]]

  # This week
  this_week:
    filters: [["created", "between", "{this_week}"]]

  # This month
  this_month:
    filters: [["created", "between", "{this_month}"]]

  # This year
  this_year:
    filters: [["created", "between", "{this_year}"]]

  # Last N days
  last_7_days:
    filters: [["created", ">=", "{last_n_days(7)}"]]

  # Next N days
  next_30_days:
    filters: [["due_date", "<=", "{next_n_days(30)}"]]

  # Custom date range
  recent:
    filters:
      - ["created", ">=", "2024-01-01"]
      - ["created", "<=", "2024-12-31"]
```

### Complex Filters | 复杂筛选

```yaml
list_views:
  vip_active_recent:
    label: VIP Active Recent Customers
    filters:
      - ["customer_type", "=", "vip"]
      - ["status", "=", "active"]
      - ["last_purchase_date", ">=", "{last_n_days(30)}"]
      - ["total_purchases", ">", 50000]
```

## Filter Scope | 筛选范围

### Scope Options | 范围选项

```yaml
# All records in workspace
filter_scope: space

# Only my records (owner = current user)
filter_scope: mine

# All records I can view
filter_scope: space

# All records in organization
filter_scope: organization
```

### Examples | 示例

```yaml
list_views:
  all:
    label: All Customers
    filter_scope: space
    columns:
      - name
      - status

  my_customers:
    label: My Customers
    filter_scope: mine              # Automatically filters by owner
    columns:
      - name
      - status
      - phone
```

## Quick Filters | 快速筛选

```yaml
list_views:
  all:
    label: All Orders
    columns:
      - order_number
      - customer
      - amount
      - status
      - created

    # Show filter sidebar with these fields
    filter_fields:
      - status                        # Select field
      - customer                      # Lookup field
      - created                       # Date field
      - amount                        # Number field (range)
```

**Behavior**: Creates a filter sidebar where users can interactively filter records by these fields.

## Sorting | 排序

### Single Field Sort | 单字段排序

```yaml
list_views:
  recent_first:
    label: Recent First
    sort:
      - field_name: created
        order: desc                   # desc or asc

  alphabetical:
    label: Alphabetical
    sort:
      - field_name: name
        order: asc
```

### Multiple Field Sort | 多字段排序

```yaml
list_views:
  multi_sort:
    label: Sorted by Status and Date
    sort:
      - field_name: status
        order: asc
      - field_name: created
        order: desc
```

## Complete Examples | 完整示例

### Example 1: Customer List Views | 客户列表视图

```yaml
# objects/customers.object.yml
list_views:
  # All customers
  all:
    label: All Customers
    label_zh: 所有客户
    filter_scope: space
    columns:
      - name
      - code
      - type
      - status
      - rating
      - phone
      - email
      - created
    filter_fields:
      - status
      - type
      - rating
    sort:
      - field_name: created
        order: desc

  # My customers
  my_customers:
    label: My Customers
    label_zh: 我的客户
    filter_scope: mine
    columns:
      - name
      - status
      - phone
      - email
      - last_contact_date
    sort:
      - field_name: last_contact_date
        order: desc

  # Active customers
  active:
    label: Active Customers
    label_zh: 活跃客户
    filters: [["status", "=", "active"]]
    columns:
      - name
      - type
      - total_purchases
      - last_purchase_date
      - rating
    sort:
      - field_name: total_purchases
        order: desc

  # VIP customers
  vip:
    label: VIP Customers
    label_zh: VIP客户
    filters:
      - ["rating", "=", "A"]
      - ["status", "=", "active"]
    columns:
      - name
      - total_purchases
      - credit_limit
      - last_purchase_date
      - assigned_to
    sort:
      - field_name: total_purchases
        order: desc

  # New customers (last 30 days)
  new_customers:
    label: New Customers
    label_zh: 新客户
    filters: [["created", ">=", "{last_n_days(30)}"]]
    columns:
      - name
      - type
      - status
      - created
      - assigned_to
    sort:
      - field_name: created
        order: desc

  # Inactive customers
  inactive:
    label: Inactive Customers
    label_zh: 流失客户
    filters:
      - ["status", "=", "inactive"]
    columns:
      - name
      - last_contact_date
      - inactive_reason
      - assigned_to
    sort:
      - field_name: last_contact_date
        order: desc
```

### Example 2: Order List Views | 订单列表视图

```yaml
# objects/orders.object.yml
list_views:
  # All orders
  all:
    label: All Orders
    label_zh: 所有订单
    filter_scope: space
    columns:
      - order_number
      - customer
      - order_date
      - total_amount
      - status
      - assigned_to
      - created
    filter_fields:
      - status
      - customer
      - order_date
    sort:
      - field_name: order_date
        order: desc

  # My orders
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

  # Pending approval
  pending_approval:
    label: Pending Approval
    label_zh: 待审批
    filters: [["status", "=", "pending_approval"]]
    columns:
      - order_number
      - customer
      - order_date
      - total_amount
      - submitted_by
      - submitted_at
    sort:
      - field_name: submitted_at
        order: asc

  # Approved orders
  approved:
    label: Approved Orders
    label_zh: 已审批
    filters: [["status", "=", "approved"]]
    columns:
      - order_number
      - customer
      - order_date
      - total_amount
      - approved_by
      - approved_at
    sort:
      - field_name: approved_at
        order: desc

  # Shipped orders
  shipped:
    label: Shipped Orders
    label_zh: 已发货
    filters: [["status", "=", "shipped"]]
    columns:
      - order_number
      - customer
      - shipping_date
      - tracking_number
      - total_amount
    sort:
      - field_name: shipping_date
        order: desc

  # High value orders
  high_value:
    label: High Value Orders
    label_zh: 高价值订单
    filters: [["total_amount", ">", 50000]]
    columns:
      - order_number
      - customer
      - order_date
      - total_amount
      - status
      - assigned_to
    sort:
      - field_name: total_amount
        order: desc

  # Recent orders (last 7 days)
  recent:
    label: Recent Orders
    label_zh: 近期订单
    filters: [["order_date", ">=", "{last_n_days(7)}"]]
    columns:
      - order_number
      - customer
      - order_date
      - total_amount
      - status
    sort:
      - field_name: order_date
        order: desc
```

### Example 3: Task List Views | 任务列表视图

```yaml
# objects/tasks.object.yml
list_views:
  # All tasks
  all:
    label: All Tasks
    label_zh: 所有任务
    columns:
      - name
      - project
      - assigned_to
      - priority
      - status
      - due_date
    filter_fields:
      - status
      - priority
      - project
    sort:
      - field_name: due_date
        order: asc

  # My tasks
  my_tasks:
    label: My Tasks
    label_zh: 我的任务
    filters: [["assigned_to", "=", "{userId}"]]
    columns:
      - name
      - project
      - priority
      - status
      - due_date
    sort:
      - field_name: due_date
        order: asc

  # Open tasks
  open:
    label: Open Tasks
    label_zh: 进行中的任务
    filters: [["status", "in", ["new", "in_progress"]]]
    columns:
      - name
      - project
      - assigned_to
      - priority
      - due_date
    sort:
      - field_name: priority
        order: desc
      - field_name: due_date
        order: asc

  # Overdue tasks
  overdue:
    label: Overdue Tasks
    label_zh: 逾期任务
    filters:
      - ["status", "!=", "completed"]
      - ["due_date", "<", "{today}"]
    columns:
      - name
      - project
      - assigned_to
      - priority
      - due_date
    sort:
      - field_name: due_date
        order: asc

  # High priority
  high_priority:
    label: High Priority
    label_zh: 高优先级
    filters:
      - ["priority", "in", ["high", "urgent"]]
      - ["status", "!=", "completed"]
    columns:
      - name
      - project
      - assigned_to
      - priority
      - status
      - due_date
    sort:
      - field_name: priority
        order: desc
      - field_name: due_date
        order: asc

  # Completed tasks
  completed:
    label: Completed Tasks
    label_zh: 已完成任务
    filters: [["status", "=", "completed"]]
    columns:
      - name
      - project
      - assigned_to
      - completed_date
    sort:
      - field_name: completed_date
        order: desc
```

## Mobile Columns | 移动端列

```yaml
list_views:
  all:
    label: All Customers
    # Desktop columns
    columns:
      - name
      - code
      - email
      - phone
      - status
      - created

    # Mobile-optimized columns (fewer, more important fields)
    mobile_columns:
      - name
      - phone
      - status
```

## View Types | 视图类型

### Grid View (Default) | 表格视图

```yaml
list_views:
  all:
    type: grid                        # Standard table view
    columns:
      - name
      - status
```

### Calendar View | 日历视图

```yaml
list_views:
  calendar:
    type: calendar
    columns:
      - name
      - start_date
      - end_date
```

**Requirements**: Object must have date fields

### Kanban View | 看板视图

```yaml
list_views:
  kanban:
    type: kanban
    columns:
      - name
      - status
      - assigned_to
    # Status field used for kanban columns
```

**Requirements**: Object must have a select/picklist field for columns

## Best Practices | 最佳实践

### 1. Create Meaningful Views | 创建有意义的视图

```yaml
# Good - specific, useful views
list_views:
  my_open_tasks:
    label: My Open Tasks
    filters:
      - ["assigned_to", "=", "{userId}"]
      - ["status", "!=", "completed"]

  high_priority_overdue:
    label: High Priority Overdue
    filters:
      - ["priority", "=", "high"]
      - ["due_date", "<", "{today}"]
      - ["status", "!=", "completed"]

# Bad - too generic
list_views:
  view1:
    label: View 1
```

### 2. Limit Columns | 限制列数

```yaml
# Good - 5-8 columns for readability
columns:
  - name
  - status
  - priority
  - assigned_to
  - due_date
  - created

# Bad - too many columns
columns:
  - name
  - description
  - status
  - priority
  - type
  - category
  - assigned_to
  - created_by
  - modified_by
  - due_date
  - created
  - modified
  # ... (hard to read)
```

### 3. Add Quick Filters | 添加快速筛选

```yaml
# Good - provide quick filters for key fields
list_views:
  all:
    columns: [...]
    filter_fields:
      - status
      - priority
      - assigned_to

# Bad - no quick filters (users must use advanced filters)
```

### 4. Logical Sorting | 合理排序

```yaml
# Good - meaningful default sort
list_views:
  tasks:
    sort:
      - field_name: priority
        order: desc
      - field_name: due_date
        order: asc

# Bad - no sort or irrelevant sort
```

### 5. Bilingual Labels | 双语标签

```yaml
# Good - provide both languages
list_views:
  my_customers:
    label: My Customers
    label_zh: 我的客户

# Bad - only one language
list_views:
  my_customers:
    label: My Customers
```

## Troubleshooting | 故障排除

### View Not Appearing | 视图未显示

1. Check YAML syntax
2. Verify view name is unique
3. Check object permissions
4. Restart server
5. Clear browser cache

### Columns Not Showing | 列未显示

1. Verify field names exist
2. Check field permissions
3. Review field `omit` and `hidden` properties
4. Check view columns configuration

### Filters Not Working | 筛选器无效

1. Verify filter syntax
2. Check field names
3. Verify operators are correct
4. Check data types match
5. Review filter scope

### Performance Issues | 性能问题

1. Add indexes to filtered fields
2. Limit number of columns
3. Use simpler filters
4. Optimize related field queries
5. Consider pagination settings

## References | 参考资料

- [05-objects.md](./05-objects.md) - Object definitions
- [06-object-fields.md](./06-object-fields.md) - Field types
- [09-object-permissions.md](./09-object-permissions.md) - Permissions
- [Steedos List Views Documentation](https://docs.steedos.com/)
