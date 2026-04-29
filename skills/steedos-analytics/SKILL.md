---
name: steedos-analytics
description: |
  Create analytics question files (.question.yml) and dashboard files
  (.dashboard.yml) in Steedos projects. Questions are report/chart definitions
  (MBQL queries, display types, visualization_settings, result_metadata).
  Dashboards are visual containers that arrange multiple question cards in a
  grid layout with filter parameters. Both stored as YAML seed data files
  under <package>/main/default/. Based on the @steedos-labs/analytics package.
  TRIGGER when: user creates/edits a .question.yml or .dashboard.yml file;
  asks about analytics reports, charts, MBQL queries, display types,
  visualization_settings, result_metadata; asks about dashboard grid layout,
  card placement, parameter definitions, parameter_mappings.
  SKIP: user wants a custom Amis page — use steedos-pages; user wants to
  call the analytics API programmatically — use steedos-server-api.
---

# Steedos Analytics — Questions & Dashboards File Format Guide

## Overview | 概述

Analytics in Steedos consists of two file types:
- **Questions** (`.question.yml`) — individual report/chart definitions with MBQL queries
- **Dashboards** (`.dashboard.yml`) — visual containers arranging multiple question cards in a grid

Workflow: **Create questions first**, then create dashboards that reference them.

基于 `@steedos-labs/analytics` 包。工作流程：**先创建 question，再创建 dashboard 引用它们。**

---

# Part 1: Questions | 问题

## File Location & Naming | 文件路径与命名

```
<package>/main/default/questions/<问题名称>.question.yml
```

Examples:
- `questions/单位总数.question.yml`
- `questions/媒体类型统计.question.yml`

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
`entity_id` and `id` are **always the same value** within one file.
Generate unique IDs — never reuse across different questions or dashboards.

Example: `68a5805bb74676d1c8cb3614`

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

## Question Examples | 问题示例

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

## Question Key Rules | 问题关键规则

1. **File name = question name**: `单位总数.question.yml`
2. **`id` == `entity_id`**: always the same 24-char hex value
3. **`table_id`**: the Steedos object name (e.g. `media_org_info`)
4. **`database_id`** and **`dataset_query.database`**: always `1`
5. **`query_type`**: always `"query"` (even for native SQL)
6. **`parameter_mappings`** and **`parameters`**: use `[]` unless participating in dashboard filtering
7. **`visualization_settings`**: must be a JSON **string** (quoted), not an object
8. Generate fresh unique ObjectIds — never copy IDs from other questions

---

# Part 2: Dashboards | 仪表盘

## File Location & Naming | 文件路径与命名

```
<package>/main/default/dashboards/<仪表盘名称>.dashboard.yml
```

Example: `dashboards/日常看板.dashboard.yml`

## File Structure | 文件结构

```yaml
name: <仪表盘名称>           # ⚠️ Required, MUST NOT be omitted | 必填，不能省略
archived: 'false'
auto_apply_filters: 'true'
enable_embedding: 'false'
entity_id: <MongoDB ObjectId>   # same as id
id: <MongoDB ObjectId>
show_in_getting_started: 'false'
parameters:                     # dashboard-level filter parameters (can be [])
  - ...
cards:                          # list of card placements
  - ...
```

> **Note**: `archived`, `auto_apply_filters`, `enable_embedding`,
> `show_in_getting_started` are **string** values `'true'`/`'false'`,
> not YAML booleans.

## Grid Layout | 网格布局

The dashboard uses an **18-column** grid. Cards are positioned with:

| Field    | Description |
|----------|-------------|
| `row`    | Starting row (0-based) |
| `col`    | Starting column (0-based, max 17) |
| `size_x` | Width in grid units (max 18) |
| `size_y` | Height in grid units (typical: 3–6) |

Common layout patterns:

| Pattern | cards per row | size_x each | col values |
|---------|--------------|-------------|------------|
| 3 equal columns | 3 | 6 | 0, 6, 12 |
| 2 equal columns | 2 | 9 | 0, 9 |
| Full width | 1 | 18 | 0 |
| 1/3 + 2/3 | 2 | 6, 12 | 0, 6 |

## cards — Card Placement | 卡片布局定义

Each entry in `cards` places one question onto the dashboard:

```yaml
cards:
  - card_id: <question id>          # references a question's id
    col: 0
    row: 0
    size_x: 6
    size_y: 3
    entity_id: <unique ObjectId>    # unique per card placement
    id: <same as entity_id>
    series: []
    visualization_settings: '{}'
    parameter_mappings: []          # or list if this card uses dashboard filters
```

### parameter_mappings for a card | 卡片的参数映射

When a dashboard parameter filters a card, add `parameter_mappings`:

```yaml
parameter_mappings:
  - parameter_id: <dashboard parameter id>   # matches parameters[].id
    card_id: <question id>                   # same as card_id above
    target:
      - dimension
      - - field
        - <object_name>.<field_name>
        - null
```

## parameters — Dashboard Filter Parameters | 仪表盘过滤参数

```yaml
parameters:
  - name: 单位名称
    slug: '%E5%8D%95%E4%BD%8D%E5%90%8D%E7%A7%B0'   # URL-encoded name
    id: 9e2d576d                                      # 8-char hex id
    type: string/=
    sectionId: string
    values_source_type: card        # or "static-list" or "connected-field"
    values_source_config:
      card_id: <question id>        # question that provides the value list
      value_field:
        - field
        - <object_name>.<field_name>
        - null
    filteringParameters:            # optional: other param ids that filter this one
      - f82fb543
```

### Parameter types | 参数类型

| `type` | Description |
|--------|-------------|
| `string/=` | Exact string match |
| `string/contains` | Contains string |
| `number/=` | Exact number match |
| `number/between` | Number range |
| `date/single` | Single date |
| `date/range` | Date range |
| `date/relative` | Relative date (e.g. "last 30 days") |
| `category` | Category selection |

### values_source_type options | 数据来源类型

| `values_source_type` | Description |
|----------------------|-------------|
| `static-list` | Hand-coded list in `values_source_config.values` |
| `card` | Pull values from a question's result column |
| `connected-field` | Pull values from a database field directly |

### slug | 参数 slug

`slug` is the URL-encoded version of `name`. In Python:
`urllib.parse.quote('单位名称')` → `'%E5%8D%95%E4%BD%8D%E5%90%8D%E7%A7%B0'`

For ASCII names, slug equals the name itself (e.g. `name: status` → `slug: status`).

## Dashboard Complete Example | 仪表盘完整示例

```yaml
name: 日常看板
archived: 'false'
auto_apply_filters: 'true'
enable_embedding: 'false'
entity_id: 68a58065b74676d1c8cb3615
id: 68a58065b74676d1c8cb3615
show_in_getting_started: 'false'
parameters:
  - name: 单位名称
    slug: '%E5%8D%95%E4%BD%8D%E5%90%8D%E7%A7%B0'
    id: 9e2d576d
    type: string/=
    sectionId: string
    values_source_type: card
    values_source_config:
      card_id: 68e75b39ae8aaf0623f11fb1
      value_field:
        - field
        - media_org_info.name
        - null
    filteringParameters:
      - f82fb543
  - name: 单位层级
    slug: '%E5%8D%95%E4%BD%8D%E5%B1%82%E7%BA%A7'
    id: f82fb543
    type: string/=
    sectionId: string
    values_source_type: static-list
    values_source_config:
      values:
        - 一级单位
        - 二级单位
        - 三级单位
cards:
  - card_id: 68a5805bb74676d1c8cb3614   # 单位总数 (scalar)
    col: 0
    row: 0
    size_x: 6
    size_y: 3
    entity_id: 68a580ebb74676d1c8cb3618
    id: 68a580ebb74676d1c8cb3618
    series: []
    visualization_settings: '{}'
    parameter_mappings:
      - parameter_id: 9e2d576d
        card_id: 68a5805bb74676d1c8cb3614
        target:
          - dimension
          - - field
            - media_org_info.media_matrix
            - null
      - parameter_id: f82fb543
        card_id: 68a5805bb74676d1c8cb3614
        target:
          - dimension
          - - field
            - media_org_info.organizational_level
            - null
  - card_id: 68a581feb74676d1c8cb361e   # 媒体类型统计 (bar chart, full width)
    col: 0
    row: 3
    size_x: 18
    size_y: 5
    entity_id: 68a58206b74676d1c8cb361f
    id: 68a58206b74676d1c8cb361f
    series: []
    visualization_settings: '{}'
    parameter_mappings:
      - parameter_id: 9e2d576d
        card_id: 68a581feb74676d1c8cb361e
        target:
          - dimension
          - - field
            - media_infor.media_org_info
            - null
      - parameter_id: f82fb543
        card_id: 68a581feb74676d1c8cb361e
        target:
          - dimension
          - - field
            - media_infor.organizational_level
            - null
```

## Dashboard Key Rules | 仪表盘关键规则

1. **File name = dashboard name**: `日常看板.dashboard.yml`
2. **`id` == `entity_id`** for both the dashboard and each card placement
3. **Each card placement gets its own unique ObjectId** (different from the question's id)
4. **`card_id`** references the question's `id` field (defined in `.question.yml`)
5. **Grid is 18 columns wide** — `col + size_x` must not exceed 18
6. **`parameter_mappings` on each card** must reference `parameter_id` values defined in the top-level `parameters` list
7. **Boolean-like fields** (`archived`, `auto_apply_filters`, `enable_embedding`, `show_in_getting_started`) are **strings**: `'true'`/`'false'`
8. **`visualization_settings`** on each card is a JSON string `'{}'`
9. **`series`** is always `[]` unless using combo/multi-series charts

## Workflow | 创建步骤

1. **Create questions first**: write all `.question.yml` files, note their `id` values
2. **Plan the grid layout**: decide rows, cols, sizes for each card
3. **Define parameters** (if filtering is needed): assign 8-char hex `id`s
4. **Write the dashboard file**: reference question ids in `card_id`, add `parameter_mappings` for each card that participates in filtering
