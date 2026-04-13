---
name: object-fields
description: |
  Comprehensive guide to all Steedos field types and their configurations.
Covers text fields (text, textarea, HTML, code, URL, email, password), numeric
fields (number, currency, percent, autonumber), date/time fields,
boolean/selection fields (boolean, toggle, select), relationship fields
(lookup, master-detail), computed fields (formula, summary), file/media types,
and special field types. Includes field properties, validation, default
values, dependencies, and best practices.
---
# Steedos Object Fields | Steedos 对象字段

## Overview | 概述

Fields are the building blocks of Steedos objects. Each field represents a column in the database and defines how data is stored, validated, and displayed. This guide covers all available field types and their configurations.

字段是 Steedos 对象的基本构建块。每个字段代表数据库中的一列,定义数据如何存储、验证和显示。本指南涵盖所有可用的字段类型及其配置。

## Field Definition Structure | 字段定义结构

### Basic Structure | 基本结构

```yaml
fields:
  field_name:
    type: text              # Field type (required)
    label: Field Label      # Display label (required)
    label_zh: 字段标签      # Chinese label
    required: false         # Is required
    readonly: false         # Is read-only
    hidden: false           # Hide from UI
    omit: false             # Omit from forms
    defaultValue: value     # Default value
    group: Group Name       # Field group
    sort_no: 100            # Display order
    is_wide: false          # Full width in forms
    index: false            # Create database index
    unique: false           # Unique constraint
    searchable: false       # Include in global search
```

## Text Field Types | 文本字段类型

### 1. Text (Short Text) | 短文本

```yaml
customer_name:
  type: text
  label: Customer Name
  label_zh: 客户名称
  required: true
  maxlength: 255          # Maximum length
  minlength: 2            # Minimum length
  searchable: true        # Include in search
  index: true             # Create index
  unique: false           # Not unique by default
  trim: true              # Trim whitespace
  lowercase: false        # Convert to lowercase
  uppercase: false        # Convert to uppercase
  defaultValue: ''        # Default value
```

**Use cases**: Names, titles, short descriptions, codes, IDs

### 2. Textarea (Long Text) | 长文本

```yaml
description:
  type: textarea
  label: Description
  label_zh: 描述
  rows: 4                 # Number of rows
  maxlength: 5000         # Maximum length
  is_wide: true           # Full width
  searchable: true
```

**Use cases**: Descriptions, comments, notes, addresses

### 3. HTML (Rich Text) | 富文本

```yaml
content:
  type: html
  label: Content
  label_zh: 内容
  is_wide: true
  rows: 10
```

**Use cases**: Article content, formatted text, email templates

### 4. Code (Code Editor) | 代码编辑器

```yaml
javascript_code:
  type: code
  label: JavaScript Code
  label_zh: JavaScript 代码
  language: javascript    # javascript, json, yaml, etc.
  is_wide: true
  rows: 20
```

**Use cases**: Scripts, formulas, JSON configs

### 5. URL

```yaml
website:
  type: url
  label: Website
  label_zh: 网站
  defaultValue: 'https://'
```

**Use cases**: Website URLs, external links

### 6. Email

```yaml
email:
  type: email
  label: Email
  label_zh: 邮箱
  unique: true            # Enforce unique emails
  index: true
  lowercase: true         # Store in lowercase
```

**Use cases**: Email addresses

### 7. Password

```yaml
password:
  type: password
  label: Password
  label_zh: 密码
  minlength: 8
  hidden: true            # Hide in UI
```

**Use cases**: Passwords, API keys (stored encrypted)

## Numeric Field Types | 数值字段类型

### 1. Number (Integer or Decimal) | 数字

```yaml
quantity:
  type: number
  label: Quantity
  label_zh: 数量
  scale: 0                # Decimal places (0 = integer)
  precision: 18           # Total digits
  min: 0                  # Minimum value
  max: 999999             # Maximum value
  defaultValue: 0

# Decimal example
discount_rate:
  type: number
  label: Discount Rate
  label_zh: 折扣率
  scale: 2                # 2 decimal places
  min: 0
  max: 100
```

**Use cases**: Quantities, counts, ratings, measurements

### 2. Currency | 货币

```yaml
price:
  type: currency
  label: Price
  label_zh: 价格
  scale: 2                # Decimal places
  precision: 18           # Total digits
  min: 0
  required: true
  defaultValue: 0
```

**Use cases**: Prices, amounts, financial values

**Display**: Automatically formatted with currency symbol (¥, $, etc.)

### 3. Percent | 百分比

```yaml
completion_rate:
  type: percent
  label: Completion Rate
  label_zh: 完成率
  scale: 2                # Decimal places
  min: 0
  max: 100
  defaultValue: 0
```

**Use cases**: Percentages, rates, progress

**Display**: Shown as "25.50%" in UI

### 4. Autonumber | 自动编号

```yaml
order_number:
  type: autonumber
  label: Order Number
  label_zh: 订单号
  formula: 'ORD-{YYYY}{MM}{DD}-{0000}'
  readonly: true

invoice_number:
  type: autonumber
  label: Invoice Number
  formula: 'INV-{0000}'   # Simple counter
  readonly: true
```

**Format placeholders**:
- `{YYYY}`: 4-digit year (2024)
- `{YY}`: 2-digit year (24)
- `{MM}`: 2-digit month (01-12)
- `{DD}`: 2-digit day (01-31)
- `{0000}`: Sequential number with padding

**Use cases**: Order numbers, invoice numbers, ticket IDs

## Date and Time Types | 日期时间类型

### 1. Date | 日期

```yaml
birth_date:
  type: date
  label: Birth Date
  label_zh: 出生日期
  required: false

start_date:
  type: date
  label: Start Date
  defaultValue: '{now}'   # Current date
```

**Format**: YYYY-MM-DD

### 2. Datetime | 日期时间

```yaml
created_at:
  type: datetime
  label: Created At
  label_zh: 创建时间
  defaultValue: '{now}'
  readonly: true

deadline:
  type: datetime
  label: Deadline
  label_zh: 截止时间
  required: true
```

**Format**: YYYY-MM-DD HH:mm:ss

### 3. Time | 时间

```yaml
work_start_time:
  type: time
  label: Work Start Time
  label_zh: 上班时间
  defaultValue: '09:00'
```

**Format**: HH:mm

## Boolean and Selection Types | 布尔和选择类型

### 1. Boolean | 布尔值

```yaml
is_active:
  type: boolean
  label: Is Active
  label_zh: 是否启用
  defaultValue: true

agree_terms:
  type: boolean
  label: Agree to Terms
  label_zh: 同意条款
  required: true
```

**Display**: Checkbox in forms, ✓/✗ in lists

### 2. Toggle | 切换开关

```yaml
enable_notifications:
  type: toggle
  label: Enable Notifications
  label_zh: 启用通知
  defaultValue: true
```

**Display**: Toggle switch (better UX than checkbox)

### 3. Select (Picklist) | 单选下拉

```yaml
# Array format (recommended)
priority:
  type: select
  label: Priority
  label_zh: 优先级
  options:
    - label: Low
      value: low
      color: green
    - label: Medium
      value: medium
      color: blue
    - label: High
      value: high
      color: orange
    - label: Urgent
      value: urgent
      color: red
  defaultValue: medium
  required: true

# String format (compact)
status:
  type: select
  label: Status
  options: 'Draft:draft,Submitted:submitted,Approved:approved'
  defaultValue: draft
```

**Use cases**: Status, priority, category, type

### 4. Select (Multiple) | 多选下拉

```yaml
tags:
  type: select
  label: Tags
  label_zh: 标签
  multiple: true          # Enable multiple selection
  options:
    - label: Technology
      value: tech
    - label: Sales
      value: sales
    - label: Marketing
      value: marketing
    - label: Finance
      value: finance
```

**Storage**: Array of selected values `['tech', 'sales']`

### 5. Lookup Select | 关联选择

```yaml
# Lookup with custom options function
manager:
  type: lookup
  label: Manager
  label_zh: 经理
  reference_to: users
  optionsFunction: !!js/function |
    function() {
      // Return only active managers
      return Creator.getSelectOptions('users', {
        filters: [
          ['active', '=', true],
          ['role', '=', 'manager']
        ]
      });
    }
```

## Relationship Field Types | 关系字段类型

### 1. Lookup (Many-to-One) | 查找关系

```yaml
customer:
  type: lookup
  label: Customer
  label_zh: 客户
  reference_to: customers        # Target object
  required: true
  index: true

  # Optional: Filter referenced records
  filters: [["status", "=", "active"]]

  # Optional: Dynamic filters based on other fields
  filters: !!js/function |
    function() {
      return [["category", "=", this.category]];
    }

  # Optional: Depend on other fields (reload when changed)
  depend_on:
    - category

# Multiple lookups (select multiple records)
assigned_users:
  type: lookup
  label: Assigned Users
  label_zh: 指派用户
  reference_to: users
  multiple: true                 # Enable multiple selection
  index: true
```

**Characteristics**:
- Creates foreign key relationship
- Parent can be deleted independently
- Child record references parent
- No cascade delete

**Use cases**: Customer on order, user assignments, categorization

### 2. Master-Detail (Parent-Child) | 主从关系

```yaml
order:
  type: master_detail
  label: Order
  label_zh: 订单
  reference_to: orders           # Parent object
  required: true
  index: true
```

**Characteristics**:
- Strong parent-child relationship
- Cascade delete (delete parent → delete children)
- Child cannot exist without parent
- Child inherits parent's sharing settings
- Parent can have rollup summary fields

**Use cases**: Order → Order Items, Account → Contacts (when cascade delete needed)

### 3. Relationship Patterns | 关系模式

#### One-to-Many | 一对多

```yaml
# In tasks.object.yml
project:
  type: lookup
  reference_to: projects

# Automatically creates "related list" in projects
```

#### Many-to-Many | 多对多

```yaml
# Create junction object: student_courses.object.yml
name: student_courses
fields:
  student:
    type: master_detail
    reference_to: students
    required: true

  course:
    type: master_detail
    reference_to: courses
    required: true

  grade:
    type: number
    label: Grade

  semester:
    type: text
    label: Semester
```

#### Self-Referencing | 自关联

```yaml
# Hierarchical structure (e.g., departments)
parent_department:
  type: lookup
  label: Parent Department
  label_zh: 上级部门
  reference_to: departments      # Same object
```

## Computed Field Types | 计算字段类型

### 1. Formula | 公式字段

```yaml
# Simple calculation
total_price:
  type: formula
  label: Total Price
  label_zh: 总价
  data_type: currency            # Return type
  scale: 2
  formula: !!js/function |
    function() {
      return (this.quantity || 0) * (this.unit_price || 0);
    }

# Conditional formula
discount_amount:
  type: formula
  label: Discount Amount
  data_type: currency
  scale: 2
  formula: !!js/function |
    function() {
      const total = this.subtotal || 0;
      const rate = this.discount_rate || 0;
      if (this.customer_type === 'vip') {
        return total * rate * 1.2;  // VIP gets 20% more discount
      }
      return total * rate;
    }

# String formula
full_name:
  type: formula
  label: Full Name
  data_type: text
  formula: !!js/function |
    function() {
      return (this.first_name || '') + ' ' + (this.last_name || '');
    }

# Date formula
days_until_due:
  type: formula
  label: Days Until Due
  data_type: number
  scale: 0
  formula: !!js/function |
    function() {
      if (!this.due_date) return null;
      const now = new Date();
      const due = new Date(this.due_date);
      const diff = Math.ceil((due - now) / (1000 * 60 * 60 * 24));
      return diff;
    }
```

**Characteristics**:
- Read-only (calculated automatically)
- Recalculated on every read
- Cannot be edited by users
- Supports complex JavaScript expressions

**Available in formula**:
- `this.field_name`: Access field values
- `this.related_field.name`: Access related record fields
- Standard JavaScript functions
- Date, Math operations

### 2. Summary (Rollup) | 汇总字段

```yaml
# Count related records
total_orders:
  type: summary
  label: Total Orders
  label_zh: 订单总数
  summary_object: orders         # Child object
  summary_type: count            # count, sum, avg, min, max
  summary_field: customer        # Relationship field in child
  summary_filters: [["status", "!=", "cancelled"]]  # Optional filter

# Sum field values
total_revenue:
  type: summary
  label: Total Revenue
  label_zh: 总收入
  summary_object: orders
  summary_type: sum
  summary_field: total_amount    # Field to sum
  summary_filters: [["status", "=", "completed"]]

# Average
average_order_value:
  type: summary
  label: Average Order Value
  summary_object: orders
  summary_type: avg
  summary_field: total_amount

# Minimum
first_order_date:
  type: summary
  label: First Order Date
  summary_object: orders
  summary_type: min
  summary_field: order_date

# Maximum
latest_order_date:
  type: summary
  label: Latest Order Date
  summary_object: orders
  summary_type: max
  summary_field: order_date
```

**Summary Types**:
- `count`: Count related records
- `sum`: Sum numeric field
- `avg`: Average of numeric field
- `min`: Minimum value
- `max`: Maximum value

**Performance**: Updated when child records change (background job)

## File and Media Types | 文件和媒体类型

### 1. File | 文件

```yaml
attachment:
  type: file
  label: Attachment
  label_zh: 附件
  accept: '.pdf,.doc,.docx'      # Accepted file types
  max_size: 10                   # Max size in MB
  multiple: true                 # Allow multiple files
```

**Storage**: Files stored in configured storage (filesystem, S3, etc.)

### 2. Image | 图片

```yaml
avatar:
  type: image
  label: Avatar
  label_zh: 头像
  accept: '.jpg,.jpeg,.png,.gif'
  max_size: 5                    # 5MB
  crop: true                     # Enable image cropping
  crop_aspect_ratio: 1           # Square crop (1:1)
```

**Features**: Automatic thumbnails, image preview

### 3. Avatar | 头像

```yaml
user_avatar:
  type: avatar
  label: User Avatar
  label_zh: 用户头像
```

**Features**: Optimized for user avatars, circular display

## Special Field Types | 特殊字段类型

### 1. Object (JSON) | 对象

```yaml
metadata:
  type: object
  label: Metadata
  label_zh: 元数据
  blackbox: true                 # Allow any structure
  is_wide: true
```

**Storage**: JSON object in database

**Use cases**: Flexible data structures, API responses, configuration

### 2. Grid (Table/Array) | 表格

```yaml
line_items:
  type: grid
  label: Line Items
  label_zh: 明细项
  is_wide: true
  schema:                        # Define columns
    product:
      type: text
      label: Product
    quantity:
      type: number
      label: Quantity
    price:
      type: currency
      label: Price
```

**Storage**: Array of objects

**Use cases**: Invoice line items, configurations

### 3. Geolocation | 地理位置

```yaml
location:
  type: geolocation
  label: Location
  label_zh: 位置
```

**Storage**: `{ latitude: number, longitude: number }`

**Use cases**: Store locations, customer addresses

### 4. Color | 颜色

```yaml
brand_color:
  type: color
  label: Brand Color
  label_zh: 品牌颜色
  defaultValue: '#3498db'
```

**Display**: Color picker in forms

## Field Properties Reference | 字段属性参考

### Common Properties | 通用属性

| Property | Type | Description |
|----------|------|-------------|
| `type` | string | Field type (required) |
| `label` | string | English label (required) |
| `label_zh` | string | Chinese label |
| `required` | boolean | Is field required |
| `readonly` | boolean | Field is read-only |
| `hidden` | boolean | Hide from all UI |
| `omit` | boolean | Omit from forms (show in details) |
| `defaultValue` | any | Default value |
| `group` | string | Field group name |
| `sort_no` | number | Display order |
| `is_wide` | boolean | Use full width in forms |
| `index` | boolean | Create database index |
| `unique` | boolean | Unique constraint |
| `searchable` | boolean | Include in global search |

### Text Field Properties | 文本字段属性

| Property | Type | Description |
|----------|------|-------------|
| `maxlength` | number | Maximum length |
| `minlength` | number | Minimum length |
| `pattern` | string | Regex validation pattern |
| `trim` | boolean | Trim whitespace |
| `lowercase` | boolean | Convert to lowercase |
| `uppercase` | boolean | Convert to uppercase |

### Number Field Properties | 数值字段属性

| Property | Type | Description |
|----------|------|-------------|
| `scale` | number | Decimal places |
| `precision` | number | Total digits |
| `min` | number | Minimum value |
| `max` | number | Maximum value |

### Lookup Field Properties | 关系字段属性

| Property | Type | Description |
|----------|------|-------------|
| `reference_to` | string/array | Target object(s) |
| `multiple` | boolean | Allow multiple selections |
| `filters` | array/function | Filter target records |
| `depend_on` | array | Dependent fields |
| `reference_sort` | object | Sort referenced records |
| `reference_limit` | number | Limit displayed records |

### Formula Field Properties | 公式字段属性

| Property | Type | Description |
|----------|------|-------------|
| `formula` | function | Calculation function |
| `data_type` | string | Return data type |
| `scale` | number | Decimal places (for numbers) |

### Summary Field Properties | 汇总字段属性

| Property | Type | Description |
|----------|------|-------------|
| `summary_object` | string | Child object name |
| `summary_type` | string | count/sum/avg/min/max |
| `summary_field` | string | Field to aggregate |
| `summary_filters` | array | Filter child records |

## Default Values | 默认值

### Static Default Values | 静态默认值

```yaml
status:
  type: select
  defaultValue: 'draft'

quantity:
  type: number
  defaultValue: 1

is_active:
  type: boolean
  defaultValue: true
```

### Dynamic Default Values | 动态默认值

```yaml
# Current date/time
created_date:
  type: datetime
  defaultValue: '{now}'

# Current user
owner:
  type: lookup
  reference_to: users
  defaultValue: '{userId}'

# Current space
space:
  type: lookup
  reference_to: spaces
  defaultValue: '{spaceId}'

# Function-based default
code:
  type: text
  defaultValue: !!js/function |
    function() {
      return 'CUST-' + Date.now();
    }
```

## Field Validation | 字段验证

### Built-in Validation | 内置验证

```yaml
email:
  type: email
  required: true                  # Not empty
  unique: true                    # No duplicates
  pattern: '^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$'

age:
  type: number
  min: 18
  max: 100

phone:
  type: text
  pattern: '^1[3-9]\d{9}$'
  error_message: 'Invalid phone number format'
```

### Custom Validation | 自定义验证

Use triggers for complex validation (see [10-object-triggers.md](./10-object-triggers.md)):

```javascript
// In triggers
beforeInsert: async function() {
  if (this.doc.age < 18) {
    throw new Error('Age must be at least 18');
  }
}
```

## Field Dependencies | 字段依赖

### Dependent Picklists | 依赖选择列表

```yaml
country:
  type: select
  label: Country
  options:
    - label: USA
      value: usa
    - label: China
      value: china

state:
  type: select
  label: State
  depend_on:
    - country                     # Reload when country changes
  optionsFunction: !!js/function |
    function() {
      if (this.country === 'usa') {
        return [
          {label: 'California', value: 'ca'},
          {label: 'New York', value: 'ny'}
        ];
      } else if (this.country === 'china') {
        return [
          {label: 'Beijing', value: 'beijing'},
          {label: 'Shanghai', value: 'shanghai'}
        ];
      }
      return [];
    }
```

### Conditional Visibility | 条件可见性

```yaml
shipping_method:
  type: select
  label: Shipping Method
  options: 'Standard:standard,Express:express'

tracking_number:
  type: text
  label: Tracking Number
  # Show only when express shipping selected
  visible_on: !!js/function |
    function() {
      return this.shipping_method === 'express';
    }
```

## Best Practices | 最佳实践

### 1. Use Appropriate Field Types | 使用合适的字段类型

```yaml
# Good - specific types
price:
  type: currency              # Not just 'number'

email:
  type: email                 # Not just 'text'

status:
  type: select                # Not just 'text'

# Bad - too generic
price:
  type: number                # Missing currency formatting

email:
  type: text                  # Missing email validation
```

### 2. Add Indexes | 添加索引

```yaml
# Index frequently queried fields
email:
  type: email
  index: true
  unique: true

status:
  type: select
  index: true                 # Frequently filtered

customer:
  type: lookup
  reference_to: customers
  index: true                 # Foreign keys
```

### 3. Use Formulas for Calculations | 使用公式计算

```yaml
# Good - formula field (auto-calculated)
total:
  type: formula
  formula: !!js/function |
    function() { return this.quantity * this.price; }

# Bad - manual calculation in code
# Requires triggers, more complex
```

### 4. Provide Clear Labels | 提供清晰的标签

```yaml
# Good - descriptive labels
customer_name:
  label: Customer Name
  label_zh: 客户名称

# Bad - unclear
name:
  label: Name                 # Name of what?
```

### 5. Set Reasonable Limits | 设置合理限制

```yaml
name:
  type: text
  maxlength: 255              # Prevent excessive data
  required: true

age:
  type: number
  min: 0
  max: 150

discount:
  type: percent
  min: 0
  max: 100
```

## Troubleshooting | 故障排除

### Field Not Saving | 字段无法保存

1. Check field type is valid
2. Verify required fields are provided
3. Check validation rules (min, max, pattern)
4. Review unique constraints
5. Check server logs for detailed errors

### Formula Not Calculating | 公式未计算

1. Verify `type: formula` is set
2. Check `data_type` matches return value
3. Test formula function syntax
4. Check for null values (use `|| 0`)
5. Review browser console for errors

### Lookup Not Working | 查找关系无效

1. Verify target object exists
2. Check `reference_to` spelling
3. Verify permissions on target object
4. Check filter conditions
5. Review `depend_on` fields

## References | 参考资料

- [05-objects.md](./05-objects.md) - Object definitions
- [10-object-triggers.md](./10-object-triggers.md) - Validation triggers
- [09-object-permissions.md](./09-object-permissions.md) - Field permissions
- [Steedos Field Types Documentation](https://docs.steedos.com/)
