---
name: steedos-seed-data
description: |
  Define initial seed data for Steedos objects using .data.json, .data.yml, or
  .data.csv files in main/default/data/. Records are imported on service startup
  (insert-only) and on space initialization (upsert). Covers file naming, record
  structure, _id requirement, template variables (${space_id}, ${space_owner_id}),
  EJSON date format, and import behavior (onlyInsert vs upsert).
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

Use EJSON `$date` format for date/datetime fields:

```json
[
  {
    "_id": "record_001",
    "name": "示例记录",
    "start_date": { "$date": "2024-01-01T00:00:00.000Z" },
    "created": { "$date": "2024-01-01T08:00:00.000Z" }
  }
]
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

- _id: "${space_id}_prod_pro"
  name: "专业版"
  code: "PRO"
  price: 29800
  is_active: true

- _id: "${space_id}_prod_enterprise"
  name: "企业版"
  code: "ENTERPRISE"
  price: 99800
  is_active: true
```

## Best Practices | 最佳实践

1. **Always include `_id`**: Every record must have a unique `_id`. Use `${space_id}` prefix for workspace-scoped data.
2. **Use YAML for readability**: YAML is easier to maintain than JSON for seed data.
3. **Don't set auto fields**: Do not include `space`, `owner`, `created`, `created_by`, `modified`, `modified_by` — they are auto-populated.
4. **Idempotent IDs**: Use deterministic `_id` values (not random) so repeated imports don't create duplicates.
5. **Match object API name**: The filename must exactly match the object's API name (e.g., `orders.data.yml` for the `orders` object).
6. **Keep data minimal**: Only include essential initial data (config, default options, system records). Don't use for large datasets.
