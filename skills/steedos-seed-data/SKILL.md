---
name: steedos-seed-data
description: |
  Initial seed data files (.data.json/.yml/.csv) in main/default/data/.
  TRIGGER: .data.json, .data.yml, .data.csv files; pre-populate initial
  records at startup; seed data naming, _id requirements, template variables
  (${space_id}, ${space_owner_id}), EJSON date format, autonumber values;
  import behavior (onlyInsert on startup vs upsert on space init).
  SKIP: CLI import → steedos-getting-started; object schema → steedos-objects;
  programmatic insert in trigger → steedos-server-logic.
---
# Steedos Seed Data | Steedos 初始化数据

## Overview | 概述

Seed data files provide initial records that are automatically imported when the service starts or a workspace initializes. They are placed in `main/default/data/` and support JSON, YAML, and CSV formats.

初始化数据文件提供服务启动或工作区初始化时自动导入的初始记录，放在 `main/default/data/` 目录下，支持 JSON、YAML、CSV 格式。

## File Location | 文件位置

```
steedos-packages/
└── my-package/
    └── main/default/
        └── data/
            ├── products.data.json
            ├── categories.data.yml
            └── regions.data.csv
```

## Naming Convention | 命名规则

```
{objectName}.data.json
{objectName}.data.yml
{objectName}.data.csv
```

The file name before the first `.` is the object API name (i.e. the MongoDB collection name).

文件名第一个 `.` 之前的部分是对象 API 名称（即 MongoDB collection 名称）。

## File Structure | 文件结构

### JSON Format | JSON 格式

```json
[
  {
    "_id": "product_001",
    "name": "标准服务套餐",
    "price": 9800,
    "status": "active"
  },
  {
    "_id": "product_002",
    "name": "高级服务套餐",
    "price": 19800,
    "status": "active"
  }
]
```

### YAML Format | YAML 格式

```yaml
- _id: "product_001"
  name: "标准服务套餐"
  price: 9800
  status: "active"

- _id: "product_002"
  name: "高级服务套餐"
  price: 19800
  status: "active"
```

### CSV Format | CSV 格式

```csv
_id,name,price,status
product_001,标准服务套餐,9800,active
product_002,高级服务套餐,19800,active
```

## Required Fields | 必填字段

| Field | Description |
|-------|-------------|
| `_id` | Unique record identifier. Required for every record. |

The following fields are **auto-populated** on import (do NOT include them manually):

| Auto Field | Description |
|------------|-------------|
| `space` | Workspace ID |
| `owner` | Workspace owner |
| `created` | Creation timestamp |
| `created_by` | Creator |
| `modified` | Modification timestamp |
| `modified_by` | Modifier |
| `company_id` | Company ID |
| `company_ids` | Company IDs |

## Autonumber Fields | 自动编号字段

> **⚠️ CRITICAL: `autonumber` fields do NOT auto-generate values during seed data import. You MUST explicitly set values for autonumber fields in seed data files.**
>
> **⚠️ 重要：`autonumber` 类型字段在初始化数据导入时不会自动生成编号，必须在数据文件中手动设置值。**

Autonumber fields (e.g., `order_number` with formula `ORD-{YYYY}{MM}{DD}-{0000}`) only auto-generate when records are created through the UI or API. During seed data import, if you omit the autonumber field, it will be empty/null.

自动编号字段（如 `order_number`，公式 `ORD-{YYYY}{MM}{DD}-{0000}`）仅在通过界面或 API 创建记录时自动生成。导入初始化数据时，如果不设置该字段，值将为空。

```yaml
# ✅ CORRECT — explicitly set autonumber field values
- _id: "order_001"
  order_number: "ORD-20240101-0001"
  customer: "客户A"
  amount: 9800

- _id: "order_002"
  order_number: "ORD-20240101-0002"
  customer: "客户B"
  amount: 19800

# ❌ WRONG — omitting autonumber field, value will be null
- _id: "order_003"
  customer: "客户C"
  amount: 29800
```

## Template Variables | 模板变量

Use template variables for workspace-dependent IDs:

| Variable | Replaced With |
|----------|---------------|
| `${space_id}` | Current workspace ID |
| `${space_owner_id}` | Workspace owner user ID |

```yaml
- _id: "${space_id}_default_config"
  name: "default_config"
  space: "${space_id}"
  owner: "${space_owner_id}"
  setting_key: "theme"
  setting_value: "blue"
```

## Date Format | 日期格式

> **⚠️ CRITICAL: `date` and `datetime` field values MUST be valid date formats. Do NOT use arbitrary strings, descriptive text, or non-date values.**
>
> **⚠️ 重要：`date` 和 `datetime` 类型字段的值必须是合法的日期格式，严禁使用任意字符串或非日期值。**

### JSON Format — Use EJSON `$date` | JSON 格式 — 使用 EJSON `$date`

```json
[
  {
    "_id": "record_001",
    "name": "示例记录",
    "start_date": { "$date": "2024-01-15T00:00:00.000Z" },
    "submitted_at": { "$date": "2024-03-20T08:30:00.000Z" }
  }
]
```

### YAML Format — Use ISO Date Strings | YAML 格式 — 使用 ISO 日期字符串

In YAML, `js-yaml` automatically parses ISO date strings as Date objects:

```yaml
- _id: "record_001"
  name: "示例记录"
  start_date: 2024-01-15              # date type — date only
  submitted_at: 2024-03-20T08:30:00Z  # datetime type — date and time
```

### Valid Date Formats | 有效日期格式

| Field Type | JSON Format | YAML Format | Example |
|------------|-------------|-------------|---------|
| `date` | `{ "$date": "2024-01-15T00:00:00.000Z" }` | `2024-01-15` | Date only |
| `datetime` | `{ "$date": "2024-03-20T08:30:00.000Z" }` | `2024-03-20T08:30:00Z` | Date and time |

**⚠️ INVALID examples (will cause errors):**

```yaml
# ❌ WRONG — arbitrary strings, not valid dates
start_date: "today"
start_date: "next week"
start_date: "2024年1月"
start_date: "TBD"
start_date: "Q1 2024"

# ❌ WRONG — template expressions (not supported for date fields)
start_date: "{now}"         # {now} only works as defaultValue in field definitions
submitted_at: "{today}"

# ✅ CORRECT
start_date: 2024-01-15
start_date: 2024-01-15T00:00:00Z
submitted_at: 2024-03-20T08:30:00Z
```

## Import Behavior | 导入行为

Seed data is imported at two points:

| Trigger | Mode | Behavior |
|---------|------|----------|
| Service startup | `onlyInsert` | Only imports if records do NOT already exist. If any record by `_id` is found, the entire import is skipped. |
| Space initialized | `upsert` | Inserts new records, updates existing records (matched by `_id`). |

On **upsert**, existing records preserve their original `space`, `owner`, `created`, `created_by` values; only `modified` and `modified_by` are updated.

## Complete Example | 完整示例

```
steedos-packages/
└── my-package/
    └── main/default/
        ├── objects/
        │   └── products/
        │       ├── products.object.yml
        │       └── fields/
        │           └── ...
        └── data/
            └── products.data.yml
```

```yaml
# main/default/data/products.data.yml
- _id: "${space_id}_prod_basic"
  name: "基础版"
  code: "BASIC"
  price: 9800
  is_active: true
  launch_date: 2024-01-01
  published_at: 2024-01-01T09:00:00Z

- _id: "${space_id}_prod_pro"
  name: "专业版"
  code: "PRO"
  price: 29800
  is_active: true
  launch_date: 2024-03-15
  published_at: 2024-03-15T09:00:00Z

- _id: "${space_id}_prod_enterprise"
  name: "企业版"
  code: "ENTERPRISE"
  price: 99800
  is_active: true
  launch_date: 2024-06-01
  published_at: 2024-06-01T09:00:00Z
```

## Best Practices | 最佳实践

1. **Always include `_id`**: Every record must have a unique `_id`. Use `${space_id}` prefix for workspace-scoped data.
2. **Date fields MUST use valid date format**: `date` fields use `2024-01-15` (YAML) or `{ "$date": "..." }` (JSON). `datetime` fields use `2024-01-15T08:30:00Z` (YAML) or `{ "$date": "..." }` (JSON). Never use arbitrary strings.（日期字段必须使用合法日期格式，严禁使用任意字符串）
3. **Use YAML for readability**: YAML is easier to maintain than JSON for seed data.
4. **Don't set auto fields**: Do not include `space`, `owner`, `created`, `created_by`, `modified`, `modified_by` — they are auto-populated.
5. **Always set autonumber fields**: Autonumber fields do NOT auto-generate during import. You must provide explicit values matching the field's formula pattern (e.g., `ORD-20240101-0001`).（自动编号字段在导入时不会自动生成，必须手动设置值）
6. **Idempotent IDs**: Use deterministic `_id` values (not random) so repeated imports don't create duplicates.
7. **Match object API name**: The filename must exactly match the object's API name (e.g., `orders.data.yml` for the `orders` object).
8. **Keep data minimal**: Only include essential initial data (config, default options, system records). Don't use for large datasets.
