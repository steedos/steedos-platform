---
name: steedos-dashboards
description: |
  Create analytics dashboard files (.dashboard.yml) in Steedos projects.
  Dashboards are visual containers that arrange multiple question cards in a
  grid layout, stored as YAML seed data files under
  <package>/main/default/dashboards/. Covers file format, card placement
  (row/col/size_x/size_y), parameter definitions, parameter_mappings, and
  multi-tab layout. Based on the @steedos-labs/analytics package.
---

# Steedos Analytics Dashboards — File Format Guide

## Overview | 概述

Dashboards are defined as `.dashboard.yml` seed data files stored under
`<package>/main/default/dashboards/`. Each file describes one dashboard: its
cards (question references + grid positions) and optional filter parameters.

仪表盘以 `.dashboard.yml` 种子数据文件形式存储，位于
`<package>/main/default/dashboards/` 目录下。

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

## ID Generation | ID 生成

All `id`, `entity_id` values are **24-character MongoDB-style hex ObjectIds**.
The dashboard's `entity_id` and `id` are always the same value.
Each card placement also gets its own unique `id` and `entity_id` (same value).

Example: `68a58065b74676d1c8cb3615`

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

## Complete Example | 完整示例

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
  - card_id: 68a580dfb74676d1c8cb3617   # 从业人员数 (scalar)
    col: 6
    row: 0
    size_x: 6
    size_y: 3
    entity_id: 68a580ebb74676d1c8cb3619
    id: 68a580ebb74676d1c8cb3619
    series: []
    visualization_settings: '{}'
    parameter_mappings:
      - parameter_id: 9e2d576d
        card_id: 68a580dfb74676d1c8cb3617
        target:
          - dimension
          - - field
            - media_journalist.media_org_info
            - null
      - parameter_id: f82fb543
        card_id: 68a580dfb74676d1c8cb3617
        target:
          - dimension
          - - field
            - media_journalist.organizational_level
            - null
  - card_id: 68a5810eb74676d1c8cb361a   # 媒体总数 (scalar)
    col: 12
    row: 0
    size_x: 6
    size_y: 3
    entity_id: 68a58147b74676d1c8cb361b
    id: 68a58147b74676d1c8cb361b
    series: []
    visualization_settings: '{}'
    parameter_mappings:
      - parameter_id: 9e2d576d
        card_id: 68a5810eb74676d1c8cb361a
        target:
          - dimension
          - - field
            - media_infor.media_org_info
            - null
      - parameter_id: f82fb543
        card_id: 68a5810eb74676d1c8cb361a
        target:
          - dimension
          - - field
            - media_infor.organizational_level
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

## Key Rules | 关键规则

1. **File name = dashboard name**: `日常看板.dashboard.yml`
2. **`id` == `entity_id`** for both the dashboard and each card placement
3. **Each card placement gets its own unique ObjectId** (different from the question's id)
4. **`card_id`** references the question's `id` field (defined in `.question.yml`)
5. **Grid is 18 columns wide** — `col + size_x` must not exceed 18
6. **`parameter_mappings` on each card** must reference `parameter_id` values defined in the top-level `parameters` list
7. **Boolean-like fields** (`archived`, `auto_apply_filters`, `enable_embedding`, `show_in_getting_started`) are **strings**: `'true'`/`'false'`
8. **`visualization_settings`** on each card is a JSON string `'{}'` (override per-card display settings, usually left empty)
9. **`series`** is always `[]` unless using combo/multi-series charts
10. No `tabs` field needed for single-tab dashboards

## Workflow | 创建步骤

1. **Create questions first**: write all `.question.yml` files, note their `id` values
2. **Plan the grid layout**: decide rows, cols, sizes for each card
3. **Define parameters** (if filtering is needed): assign 8-char hex `id`s
4. **Write the dashboard file**: reference question ids in `card_id`, add `parameter_mappings` for each card that participates in filtering
