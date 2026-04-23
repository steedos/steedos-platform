---
name: steedos-questions
description: |
  Create analytics question files (.question.yml) in Steedos projects. Questions
  are report/chart definitions stored as YAML seed data files, based on the
  @steedos-labs/analytics package (Metabase engine). Covers file format,
  dataset_query structure (MBQL), display types, visualization_settings,
  result_metadata, and file naming conventions.
---

# Steedos Analytics Questions — File Format Guide

## Overview | 概述

Questions are analytics report/chart definitions stored as `.question.yml` seed
data files under `<package>/main/default/questions/`. Each file defines one
question (internally a "card") — a data query paired with a visualization.

问题是以 `.question.yml` 种子数据文件形式存储的分析报表/图表定义，位于
`<package>/main/default/questions/` 目录下。

## File Location & Naming | 文件路径与命名

```
<package>/main/default/questions/<问题名称>.question.yml
```

Examples:
- `questions/单位总数.question.yml`
- `questions/媒体类型统计.question.yml`
- `questions/从业人员数.question.yml`

## File Structure | 文件结构

```yaml
name: <问题名称>
created_at: <ISO8601 datetime>
creator_id: <MongoDB ObjectId>
database_id: 1
dataset_query:
  database: 1
  type: query          # "query" for MBQL, "native" for SQL
  query:
    source-table: <object_name>
    # optional: filter, aggregation, breakout, limit, order-by
display: <display_type>
enable_embedding: false
entity_id: <MongoDB ObjectId>   # same as id
id: <MongoDB ObjectId>
parameter_mappings: []
parameters: []
query_type: query
result_metadata:
  - ...               # column metadata list
table_id: <object_name>
updated_at: <ISO8601 datetime>
visualization_settings: '{}'
```

## ID Generation | ID 生成

All `id` and `entity_id` values are **24-character MongoDB-style hex ObjectIds**.
Generate unique IDs — never reuse the same ID across different questions.

Example: `68a5805bb74676d1c8cb3614`

`entity_id` and `id` are **always the same value** within one question file.

## dataset_query — MBQL Query | MBQL 查询结构

### Count (scalar) | 计数

```yaml
dataset_query:
  database: 1
  type: query
  query:
    source-table: media_org_info
    aggregation:
      - - count
```

### Count with filter | 带过滤的计数

```yaml
dataset_query:
  database: 1
  type: query
  query:
    source-table: media_journalist
    filter:
      - '='
      - - field
        - media_journalist.open
        - null
      - true
    aggregation:
      - - count
```

### Group by field (breakout) | 按字段分组

```yaml
dataset_query:
  database: 1
  type: query
  query:
    source-table: media_infor
    aggregation:
      - - count
    breakout:
      - - field
        - media_infor.type
        - null
```

### Table list with limit | 列表查询

```yaml
dataset_query:
  database: 1
  type: query
  query:
    source-table: media_org_info
    limit: 10000
```

### Native SQL query | 原生 SQL 查询

```yaml
dataset_query:
  database: 1
  type: native
  native:
    query: "SELECT status, COUNT(*) as cnt FROM contracts GROUP BY status"
```

## Display Types | 显示类型

| `display` value | Description |
|-----------------|-------------|
| `scalar`        | Single number (计数/合计等单值) |
| `table`         | Data table (数据列表) |
| `bar`           | Bar chart (柱状图) |
| `line`          | Line chart (折线图) |
| `pie`           | Pie chart (饼图) |
| `area`          | Area chart (面积图) |
| `row`           | Horizontal bar (横向柱状图) |
| `smartscalar`   | Number with trend (带趋势的数值) |
| `funnel`        | Funnel chart (漏斗图) |
| `pivot`         | Pivot table (透视表) |

## visualization_settings | 可视化设置

For simple questions, use `'{}'` (empty JSON string).

Common examples:

```yaml
# Scalar — show specific column
visualization_settings: '{"table.cell_column":"count"}'

# Bar chart — specify axes
visualization_settings: >-
  {"graph.dimensions":["type"],"graph.metrics":["count"],"graph.show_values":true,"graph.x_axis.labels_enabled":false,"graph.y_axis.labels_enabled":false}

# Table — specify pivot and cell columns
visualization_settings: >-
  {"table.pivot_column":"status","table.cell_column":"count"}
```

## result_metadata | 结果列元数据

`result_metadata` describes the output columns. Required format varies by query type.

### For aggregation (count) | 聚合查询结果

```yaml
result_metadata:
  - base_type: type/BigInteger
    display_name: 计数
    effective_type: type/BigInteger
    field_ref:
      - aggregation
      - 0
    name: count
    semantic_type: type/Quantity
    source: aggregation
```

### For breakout + count | 分组+计数结果

```yaml
result_metadata:
  - id: type                       # field name (short form when no table prefix)
    name: type
    display_name: 媒体类型
    base_type: type/Text
    effective_type: type/Text
    semantic_type: null
    source: breakout
    visibility_type: normal
    table_id: media_infor
    field_ref:
      - field
      - media_infor.type
      - null
  - base_type: type/BigInteger
    display_name: 计数
    effective_type: type/BigInteger
    field_ref:
      - aggregation
      - 0
    name: count
    semantic_type: type/Quantity
    source: aggregation
```

### For table list query | 列表查询结果

Each output column needs an entry. `id` uses `<table>.<field>` format:

```yaml
result_metadata:
  - id: media_org_info.name
    name: name
    display_name: 单位名称
    base_type: type/Text
    effective_type: type/Text
    semantic_type: null
    field_ref:
      - field
      - media_org_info.name
      - null
    source: fields
    visibility_type: normal
    table_id: media_org_info
  - id: media_org_info.created
    name: created
    display_name: 创建时间
    base_type: type/DateTime
    effective_type: type/DateTime
    semantic_type: null
    field_ref:
      - field
      - media_org_info.created
      - null
    source: fields
    visibility_type: normal
    table_id: media_org_info
```

#### base_type mapping | 字段类型映射

| Steedos field type | base_type |
|--------------------|-----------|
| text / select / lookup | `type/Text` |
| number / currency | `type/Float` |
| integer | `type/Integer` |
| date | `type/Date` |
| datetime | `type/DateTime` |
| boolean | `type/Boolean` |
| count result | `type/BigInteger` |

## Complete Examples | 完整示例

### Scalar — count of records

```yaml
name: 单位总数
created_at: 2025-08-20T07:59:23.569Z
creator_id: 689c34199c7714afa7502547
database_id: 1
dataset_query:
  query:
    source-table: media_org_info
    aggregation:
      - - count
  type: query
  database: 1
display: scalar
entity_id: 68a5805bb74676d1c8cb3614
id: 68a5805bb74676d1c8cb3614
parameter_mappings: []
parameters: []
query_type: query
result_metadata:
  - base_type: type/BigInteger
    display_name: 计数
    effective_type: type/BigInteger
    field_ref:
      - aggregation
      - 0
    name: count
    semantic_type: type/Quantity
    source: aggregation
table_id: media_org_info
updated_at: 2025-08-20T07:59:23.569Z
visualization_settings: '{}'
```

### Bar chart — grouped count

```yaml
name: 媒体类型统计
created_at: 2025-08-20T08:06:22.163Z
creator_id: 689c34199c7714afa7502547
database_id: 1
dataset_query:
  database: 1
  type: query
  query:
    source-table: media_infor
    aggregation:
      - - count
    breakout:
      - - field
        - media_infor.type
        - null
display: bar
enable_embedding: false
entity_id: 68a581feb74676d1c8cb361e
id: 68a581feb74676d1c8cb361e
parameter_mappings: []
parameters: []
query_type: query
result_metadata:
  - id: type
    name: type
    display_name: 媒体类型
    base_type: type/Text
    effective_type: type/Text
    semantic_type: null
    source: breakout
    visibility_type: normal
    table_id: media_infor
    field_ref:
      - field
      - media_infor.type
      - null
  - base_type: type/BigInteger
    display_name: 计数
    effective_type: type/BigInteger
    field_ref:
      - aggregation
      - 0
    name: count
    semantic_type: type/Quantity
    source: aggregation
table_id: media_infor
updated_at: 2025-08-20T08:06:22.163Z
visualization_settings: >-
  {"graph.x_axis.labels_enabled":false,"graph.y_axis.labels_enabled":false,"graph.dimensions":["type"],"graph.metrics":["count"],"graph.show_values":true}
```

### Scalar — count with filter

```yaml
name: 从业人员数
created_at: 2025-08-20T08:01:35.156Z
creator_id: 689c34199c7714afa7502547
database_id: 1
dataset_query:
  database: 1
  type: query
  query:
    source-table: media_journalist
    filter:
      - '='
      - - field
        - media_journalist.open
        - null
      - true
    aggregation:
      - - count
display: scalar
enable_embedding: false
entity_id: 68a580dfb74676d1c8cb3617
id: 68a580dfb74676d1c8cb3617
parameter_mappings: []
parameters: []
query_type: query
result_metadata:
  - base_type: type/BigInteger
    display_name: 计数
    effective_type: type/BigInteger
    field_ref:
      - aggregation
      - 0
    name: count
    semantic_type: type/Quantity
    source: aggregation
table_id: media_journalist
updated_at: 2025-08-20T08:01:35.156Z
visualization_settings: '{"table.cell_column":"count"}'
```

## Key Rules | 关键规则

1. **File name = question name**: `单位总数.question.yml`
2. **`id` == `entity_id`**: always the same 24-char hex value
3. **`table_id`**: the Steedos object name (e.g. `media_org_info`)
4. **`database_id`** and **`dataset_query.database`**: always `1`
5. **`query_type`**: always `"query"` (even for native SQL, use `"query"`)
6. **`parameter_mappings`** and **`parameters`**: use `[]` unless this question participates in dashboard filtering
7. **`visualization_settings`**: must be a JSON **string** (quoted), not an object
8. Generate fresh unique ObjectIds — never copy IDs from other questions
