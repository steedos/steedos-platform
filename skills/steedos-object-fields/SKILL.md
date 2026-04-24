---
name: steedos-object-fields
description: |
  Comprehensive guide to Steedos field types and configurations. Fields are
  defined as .field.yml files in objects/{name}/fields/. Covers text fields,
  numeric fields (number, currency, percent, autonumber), date/time,
  boolean/select, relationship fields (lookup, master-detail), computed fields
  (formula, summary), file/media, and special types. Includes field properties,
  amis UI customization, visible_on formulas, validation, defaults, and
  dependencies.
---
# Steedos Object Fields | Steedos 对象字段

## Overview | 概述

Fields define how data is stored, validated, and displayed. Each field is defined as a separate `.field.yml` file in the object's `fields/` subfolder.

字段定义数据的存储、验证和显示方式。每个字段作为独立的 `.field.yml` 文件定义在对象的 `fields/` 子文件夹中。

## File Location | 文件位置

```
steedos-packages/
└── my-package/
    └── main/default/
        └── objects/
            └── orders/
                └── fields/
                    ├── order_number.field.yml
                    ├── customer.field.yml
                    ├── status.field.yml
                    ├── total_amount.field.yml
                    └── shipping_address.field.yml
```

## Field Structure | 字段结构

```yaml
# objects/orders/fields/customer.field.yml
name: customer
type: lookup
label: 客户
reference_to: customers
required: true
index: true
searchable: true
filterable: true
sortable: true
sort_no: 200
group: Basic Information
```

## Common Properties | 通用属性

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `name` | string | **Yes** | **⚠️ Field API name. MUST NOT be omitted. Must match the filename prefix (e.g. `customer` for `customer.field.yml`).** |
| `type` | string | **Yes** | Field type (see [Valid Field Types](#valid-field-types--有效字段类型) below) |
| `label` | string | **Yes** | Display label — use the language of the user's prompt |
| `required` | boolean | No | Is required |
| `readonly` | boolean | No | Read-only |
| `hidden` | boolean | No | Hide from all UI |
| `omit` | boolean | No | Omit from forms |
| `disabled` | boolean | No | Disable editing |
| `defaultValue` | any | No | Default value |
| `group` | string | No | Field group name |
| `sort_no` | number | No | Display order |
| `is_name` | boolean | No | Mark as the object's display name field (see below) |
| `is_wide` | boolean | No | Full width in forms |
| `index` | boolean | No | Create database index |
| `unique` | boolean | No | Unique constraint |
| `searchable` | boolean | No | Include in global search |
| `filterable` | boolean | No | Available in filters |
| `sortable` | boolean | No | Sortable in list views |
| `data_type` | string | No | Backend data type |
| `visible_on` | string | No | Amis formula for conditional visibility |
| `inlineHelpText` | string | No | Tooltip help text |

## Name Field (`is_name`) | 名称字段

Every object must have a **name field** — the human-readable identifier shown in lookups, related lists, and record titles. The system determines the name field by:

每个对象必须有一个**名称字段**——在查找、相关列表和记录标题中显示的人类可读标识。系统按以下优先级确定名称字段：

1. A field with `is_name: true` (highest priority)
2. A field named `name` (fallback)

Use `is_name: true` when the display name is not a simple `name` text field:

当显示名称不是简单的 `name` 文本字段时，使用 `is_name: true`：

```yaml
# autonumber as name field
name: order_number
type: autonumber
label: Order Number
formula: 'ORD-{YYYY}{MM}{DD}-{0000}'
is_name: true
readonly: true

# lookup as name field
name: permission_set
type: master_detail
label: Permission Set
reference_to: permission_set
required: true
is_name: true

# simple text name field (is_name not needed)
name: name
type: text
label: Product Name
required: true
searchable: true
```

## Valid Field Types | 有效字段类型

**⚠️ CRITICAL: The `type` property MUST be one of the values listed below. NEVER invent field types. Any value NOT in this list will cause an error.**

**⚠️ 重要：`type` 属性必须为下表中的值之一，严禁自行编造字段类型。不在此列表中的值会导致错误。**

| Type | Description |
|------|-------------|
| `text` | Short text |
| `textarea` | Long text (multiline) |
| `html` | Rich text (HTML editor) |
| `select` | Single or multiple choice (with `options`) |
| `boolean` | True/false |
| `toggle` | Toggle switch (same as boolean, different UI) |
| `date` | Date only |
| `datetime` | Date and time |
| `time` | Time only |
| `number` | Integer or decimal |
| `currency` | Money amount |
| `percent` | Percentage |
| `autonumber` | Auto-generated sequential number |
| `lookup` | Reference to another object (many-to-one) |
| `master_detail` | Parent-child reference (cascade delete) |
| `grid` | Inline table (array of objects) |
| `url` | URL |
| `email` | Email address |
| `image` | Image upload |
| `file` | File upload |
| `code` | Code editor |
| `markdown` | Markdown editor |
| `color` | Color picker |
| `location` | Geographic location |
| `object` | JSON object |
| `formula` | Computed formula field |
| `summary` | Roll-up summary field |
| `password` | Password (masked) |

## Text Field Types | 文本字段类型

### text (Short Text) | 短文本
```yaml
name: customer_name
type: text
label: Customer Name
required: true
searchable: true
index: true
```

### textarea (Long Text) | 长文本
```yaml
name: description
type: textarea
label: Description
rows: 4
is_wide: true
```

### html (Rich Text) | 富文本
```yaml
name: content
type: html
label: Content
is_wide: true
```

### url
```yaml
name: website
type: url
label: Website
```

### email
```yaml
name: email
type: email
label: Email
unique: true
index: true
```

## Numeric Field Types | 数值字段类型

### number
```yaml
name: quantity
type: number
label: Quantity
scale: 0
min: 0
max: 999999
```

### currency | 货币
```yaml
name: price
type: currency
label: Price
scale: 2
min: 0
```

### percent | 百分比
```yaml
name: discount_rate
type: percent
label: Discount Rate
scale: 2
min: 0
max: 100
```

### autonumber | 自动编号

```yaml
name: order_number
type: autonumber
label: Order Number
formula: 'ORD-{YYYY}{MM}{DD}-{0000}'
readonly: true
```

**⚠️ Valid placeholders — ONLY these are supported in the `formula` field:**

| Placeholder | Description | Example Output |
|-------------|-------------|----------------|
| `{YYYY}` | 4-digit year | `2026` |
| `{YY}` | 2-digit year | `26` |
| `{MM}` | 2-digit month | `04` |
| `{DD}` | 2-digit day | `23` |
| `{0000}` | Sequential number with zero-padding (length = number of zeros) | `0001`, `0042` |
| `{000}` | 3-digit sequential | `001` |
| `{00000}` | 5-digit sequential | `00001` |

**⚠️ `{project_code}`, `{org_code}`, `{user_name}` or any other field-name placeholders are NOT valid and will appear literally in the output. The `{...}` syntax ONLY supports the date/sequence placeholders listed above.**

**⚠️ `{project_code}`、`{org_code}`、`{user_name}` 等字段名占位符是无效的，会原样输出。`{...}` 语法仅支持上面列出的日期/序号占位符。**

**Formula examples:**
```yaml
# Basic: prefix + sequence
formula: 'INV-{0000}'              # → INV-0001, INV-0002

# Date + sequence (resets daily)
formula: 'ORD-{YYYY}{MM}{DD}-{0000}'  # → ORD-20260423-0001

# Date + sequence (resets monthly)
formula: 'PO-{YYYY}{MM}-{000}'        # → PO-202604-001

# Date + sequence (resets yearly)
formula: 'REQ-{YYYY}-{00000}'         # → REQ-2026-00001

# Prefix only + sequence (never resets)
formula: 'CUST-{000000}'              # → CUST-000001, CUST-000002
```

**Sequence reset rule:** The counter resets based on which date placeholders are present — `{YYYY}+{MM}+{DD}` resets daily, `{YYYY}+{MM}` resets monthly, `{YYYY}` only resets yearly, no date placeholder means never resets.

## Date and Time Types | 日期时间类型

### date
```yaml
name: order_date
type: date
label: Order Date
defaultValue: '{now}'
```

### datetime
```yaml
name: submitted_at
type: datetime
label: Submitted At
readonly: true
```

## Boolean and Selection Types | 布尔和选择类型

### boolean
```yaml
name: is_active
type: boolean
label: Is Active
defaultValue: true
```

### select (Single) | 单选
```yaml
name: status
type: select
label: Status
options:
  - label: Draft
    value: draft
  - label: Submitted
    value: submitted
  - label: Approved
    value: approved
defaultValue: draft
```

### select (Multiple) | 多选
```yaml
name: tags
type: select
label: Tags
multiple: true
options:
  - label: Technology
    value: tech
  - label: Sales
    value: sales
```

## Relationship Fields | 关系字段

### lookup (Many-to-One) | 查找关系
```yaml
name: customer
type: lookup
label: Customer
reference_to: customers
required: true
index: true

# With filters
name: contact
type: lookup
label: Contact
reference_to: contacts
filters: [["account", "=", "{$customer}"]]
depend_on:
  - customer

# Multiple selection
name: assigned_users
type: lookup
label: Assigned Users
reference_to: users
multiple: true
```

Lookup properties:
- `reference_to` — target object API name (required)
- `multiple` — allow selecting multiple records (`true`/`false`)
- `filters` — filter condition for lookup dropdown
- `depend_on` — re-fetch options when these fields change
- `deleted_lookup_record_behavior` — when referenced record is deleted. **⚠️ MUST be `clear` (set to null) or `retain` (keep stale reference). Only these two values are valid.**

### master_detail (Parent-Child) | 主从关系
```yaml
name: order
type: master_detail
label: Order
reference_to: orders
required: true
index: true
```

Cascade delete: deleting parent deletes all children.

## Computed Fields | 计算字段

### formula | 公式
```yaml
name: total_price
type: formula
label: Total Price
data_type: currency
scale: 2
formula_blank_value: zeroes
formula: !!js/function |
  function() {
    return (this.quantity || 0) * (this.unit_price || 0);
  }
```

`data_type` — the output type of the formula. **⚠️ MUST be one of: `text`, `number`, `currency`, `percent`, `boolean`, `date`, `datetime`. Do NOT use other values.**

`formula_blank_value` — how to treat blank fields. **⚠️ MUST be `zeroes` (default, treat as 0) or `blanks` (treat as null). Only these two values are valid.**

### summary (Rollup) | 汇总
```yaml
name: total_orders
type: summary
label: Total Orders
summary_object: orders
summary_type: count
summary_field: customer
summary_filters: [["status", "!=", "cancelled"]]
```

**⚠️ `summary_type` MUST be one of: `count`, `sum`, `avg`, `min`, `max`. Do NOT use other values.**

## File and Media Types | 文件和媒体类型

### file
```yaml
name: attachment
type: file
label: Attachment
multiple: true
```

### image
```yaml
name: avatar
type: image
label: Avatar
```

## Special Types | 特殊类型

### code (Code Editor) | 代码编辑器
```yaml
name: custom_script
type: code
label: Script
language: javascript
is_wide: true
```

**⚠️ `language` MUST be one of: `javascript`, `typescript`, `json`, `html`, `css`, `sql`, `python`, `java`, `ruby`, `go`, `shell`, `yaml`, `xml`, `markdown`, `php`, `csharp`, `cpp`, `c`, `swift`, `lua`, `r`. Do NOT use other values.**

### object (JSON)
```yaml
name: metadata
type: object
label: Metadata
blackbox: true
is_wide: true
```

### grid (Table/Array)
```yaml
name: line_items
type: grid
label: Line Items
is_wide: true
```

## Amis UI Customization | Amis UI 自定义

Fields can have custom Amis rendering configuration:

```yaml
# objects/materials/fields/classification.field.yml
name: classification
type: text
label: Classification
amis:
  id: 'u:classification'
  type: tree-select
  label: Classification
  multiple: true
  clearable: true
  source:
    url: /graphql
    method: post
    requestAdaptor: |
      api.data = {
        query: `{ hierarchical_picklist_items(filters: ["list", "=", "classification"]) { label, value, parent } }`
      }
    adaptor: |
      const items = payload.data?.hierarchical_picklist_items || [];
      return { options: buildTree(items) };
    cache: 86400000
  onEvent:
    change:
      weight: 0
      actions:
        - actionType: setValue
          args:
            value:
              related_field: "${event.data.value}"
```

## Conditional Visibility | 条件可见性

Use `visible_on` with Amis formula syntax:

```yaml
name: rejection_reason
type: textarea
label: Rejection Reason
visible_on: "{{status == 'rejected'}}"

name: tracking_number
type: text
label: Tracking Number
visible_on: "{{status == 'shipped' || status == 'completed'}}"
```

## Default Values | 默认值

```yaml
# Static
defaultValue: 'draft'
defaultValue: 0
defaultValue: true

# Dynamic
defaultValue: '{now}'        # Current date/time
defaultValue: '{userId}'     # Current user
defaultValue: '{spaceId}'    # Current workspace
```

## Field Dependencies | 字段依赖

```yaml
# Reload field when dependency changes
name: contact
type: lookup
label: Contact
reference_to: contacts
depend_on:
  - customer
filters: [["account", "=", "{$customer}"]]
```

## Best Practices | 最佳实践

1. **Use specific types**: `currency` not just `number`, `email` not just `text`
2. **Add indexes**: `index: true` on frequently queried/filtered fields
3. **Label follows user's language**: Write `label` in the language of the user's prompt. For i18n, use the translations skill
4. **Use sort_no**: Control field display order
5. **Group fields**: Use `group` to organize related fields
6. **Set appropriate defaults**: Use `defaultValue` to reduce user input
