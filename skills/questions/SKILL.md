---
name: questions
description: |
  Create and manage analytics questions (reports/charts) in Steedos. Questions
  are data queries with visualizations, based on the @steedos-labs/analytics
  package (Metabase engine). Covers analytics_card object, dataset_query
  structure, display types, visualization_settings, parameters, MBQL query
  language, REST API endpoints, embedding, and permissions. Requires
  enterprise license.
---

# Steedos Analytics Questions | Steedos 分析问题（报表）

## Overview | 概述

Analytics questions (internally called "cards") are data queries paired with visualizations. They can query any Steedos object using MBQL (Metabase Query Language) or native SQL, then display results as tables, charts, maps, or other visual formats. Questions are the building blocks of dashboards.

分析问题（内部称为"卡片"）是数据查询与可视化的组合。它们可以使用 MBQL 或原生 SQL 查询任何 Steedos 对象，然后以表格、图表、地图或其他可视化格式显示结果。问题是仪表盘的构建模块。

**Prerequisites | 前置条件:**
- Enterprise license (企业版许可证)
- `@steedos-labs/analytics` plugin enabled

## Object: analytics_card | 报表对象

### Object Definition | 对象定义

```yaml
# objects/analytics_card/analytics_card.object.yml
name: analytics_card
custom: true
hidden: true
enable_api: true
enable_dataloader: true
enable_inline_edit: true
icon: metrics
is_enable: true
label: 报表
version: 2
```

### Key Fields | 关键字段

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | text | No | Unique identifier (indexed) |
| `name` | text | Yes | Question name (indexed) |
| `table_id` | lookup(objects) | No | Source object reference |
| `description` | text | No | Description (is_wide) |
| `disable_permission` | boolean | No | Skip permission filtering when querying |
| `dataset` | boolean | No | Whether this is a dataset (default: false) |
| `dataset_query` | object (blackbox) | No | MBQL or native query definition |
| `display` | text | No | Visualization type (table, bar, line, pie, etc.) |
| `visualization_settings` | text | No | Chart configuration |
| `parameters` | object[] (blackbox) | No | Query parameters |
| `parameter_mappings` | object[] (blackbox) | No | Parameter-to-field mappings |
| `result_metadata` | object[] (blackbox) | No | Result column metadata |
| `query_type` | text | No | Query type (e.g., "query", "native") |
| `collection_id` | text | No | Collection for organization |
| `collection_position` | number | No | Position in collection |
| `collection_preview` | boolean | No | Show in collection preview |
| `database_id` | text | No | Target database |
| `archived` | boolean | No | Archive status (default: false) |
| `cache_ttl` | number | No | Cache time-to-live |
| `enable_embedding` | boolean | No | Enable iframe embedding (default: false) |
| `embedding_params` | text | No | Embedding parameter config |
| `entity_id` | text | No | Entity identifier |
| `public_uuid` | text | No | Public sharing UUID |
| `made_public_by_id` | number | No | User who made it public |
| `creator_id` | lookup(users) | No | Creator reference |
| `created_at` | datetime | No | Creation timestamp |
| `updated_at` | datetime | No | Last update timestamp |

### Field Definition Examples | 字段定义示例

```yaml
# objects/analytics_card/fields/name.field.yml
name: name
index: true
label: 名称
required: true
sort_no: 100
type: text
```

```yaml
# objects/analytics_card/fields/table_id.field.yml
name: table_id
label: 对象
precision: 18
scale: 0
sort_no: 115
type: lookup
reference_to: objects
reference_to_field: name
```

```yaml
# objects/analytics_card/fields/disable_permission.field.yml
name: disable_permission
label: 禁用权限过滤
description: 查询数据时跳过权限集设置的权限限制（如用户只能看到自己创建的数据）
type: boolean
sort_no: 300
is_wide: true
```

```yaml
# objects/analytics_card/fields/dataset_query.field.yml
name: dataset_query
label: dataset_query
required: false
sort_no: 120
type: object
blackbox: true
hidden: false
```

```yaml
# objects/analytics_card/fields/display.field.yml
name: display
label: display
required: false
sort_no: 120
type: text
hidden: false
```

### List Views | 列表视图

```yaml
# objects/analytics_card/listviews/all.listview.yml
name: all
columns:
  - field: name
  - field: table_id
  - field: disable_permission
filter_scope: space
filters: []
label: 所有
scrolling_mode: standard
shared: true
sort_no: 100
type: grid
```

```yaml
# objects/analytics_card/listviews/recent.listview.yml
name: recent
columns:
  - field: name
filter_scope: space
filters: []
label: 最近查看
scrolling_mode: standard
shared: true
sort_no: 100
type: grid
```

### Permissions | 权限

```yaml
# objects/analytics_card/permissions/admin.permission.yml
name: Card.管理员
allowCreate: true
allowCreateFiles: true
allowDelete: true
allowDeleteFiles: true
allowEdit: true
allowEditFiles: true
allowRead: true
allowReadFiles: true
modifyAllFiles: true
modifyAllRecords: true
permission_set_id: admin
viewAllFiles: true
viewAllRecords: true
```

```yaml
# objects/analytics_card/permissions/user.permission.yml
name: Card.用户
allowCreate: true
allowCreateFiles: true
allowDelete: true
allowDeleteFiles: true
allowEdit: true
allowEditFiles: true
allowRead: true
allowReadFiles: true
modifyAllRecords: false
permission_set_id: user
viewAllFiles: true
viewAllRecords: true
```

### Buttons | 按钮

#### New Question Button (List Action)

Opens the notebook query builder:

```yaml
# objects/analytics_card/buttons/standard_new.button.yml
name: standard_new
is_enable: true
label: 新建
'on': list
type: amis_button
visible: true
amis_schema: |-
  {
      "type": "service",
      "body": [
          {
              "type": "button",
              "label": "${'CustomAction.analytics_card.standard_new' | t}",
              "onEvent": {
                  "click": {
                      "actions": [
                          {
                              "actionType": "url",
                              "args": {
                                  "url": "${context.rootUrl}/analytics/question/notebook"
                              }
                          }
                      ]
                  }
              }
          }
      ],
      "bodyClassName": "p-0"
  }
```

#### Edit Button (Record Action)

Opens the question editor:

```yaml
# objects/analytics_card/buttons/standard_edit.button.yml
name: standard_edit
is_enable: true
label: 编辑
'on': record_only
type: amis_button
visible: true
amis_schema: |-
  {
      "type": "service",
      "body": [
          {
              "type": "button",
              "label": "${'CustomAction.analytics_card.standard_edit' | t}",
              "onEvent": {
                  "click": {
                      "actions": [
                          {
                              "actionType": "url",
                              "args": {
                                  "url": "${context.rootUrl}/analytics/question/${recordId}"
                              }
                          }
                      ]
                  }
              }
          }
      ]
  }
```

#### Viewer Button (Record Action)

Opens the question in Amis viewer:

```yaml
# objects/analytics_card/buttons/viewer.button.yml
name: viewer
is_enable: true
label: 查看
'on': record_only
type: amis_button
visible: true
amis_schema: |-
  {
      "type": "service",
      "body": [
          {
              "type": "button",
              "label": "${'CustomAction.analytics_card.viewer' | t}",
              "onEvent": {
                  "click": {
                      "actions": [
                          {
                              "actionType": "url",
                              "args": {
                                  "url": "${context.rootUrl}/analytics/amis/question/${recordId}"
                              }
                          }
                      ]
                  }
              }
          }
      ]
  }
```

## Display Types | 显示类型

Questions support various visualization types via the `display` field:

| Display | Description |
|---------|-------------|
| `table` | Data table |
| `bar` | Bar chart |
| `line` | Line chart |
| `pie` | Pie chart |
| `area` | Area chart |
| `scalar` | Single number |
| `smartscalar` | Number with trend |
| `row` | Horizontal bar |
| `funnel` | Funnel chart |
| `progress` | Progress bar |
| `map` | Geographic map |
| `scatter` | Scatter plot |
| `waterfall` | Waterfall chart |
| `pivot` | Pivot table |
| `combo` | Combined chart |
| `object` | Raw object view |

## Query Types | 查询类型

### MBQL Query (Structured)

MBQL (Metabase Query Language) is a structured query format:

```json
{
  "dataset_query": {
    "database": 1,
    "type": "query",
    "query": {
      "source-table": "contracts",
      "aggregation": [["count"]],
      "breakout": [["field", "status", {"base-type": "type/Text"}]],
      "filter": ["=", ["field", "archived", {"base-type": "type/Boolean"}], false]
    }
  }
}
```

### Native Query (SQL)

```json
{
  "dataset_query": {
    "database": 1,
    "type": "native",
    "native": {
      "query": "SELECT status, COUNT(*) FROM contracts GROUP BY status"
    }
  }
}
```

## Record Detail Page | 记录详情页

```yaml
# pages/analytics_card_detail.page.yml
name: analytics_card_detail
label: 图表记录详情页
object_name: analytics_card
is_active: true
render_engine: amis
type: record
pageAssignments:
  - type: orgDefault
    page: analytics_card_detail
    desktop: true
    mobile: true
```

The detail page (`.page.amis.json`) contains three tabs:
1. **Chart View** — iframe loading `/analytics/amis/question/{recordId}`
2. **Details** — Object form with fields: name, table_id, description, disable_permission, owner, company_id, created, created_by, modified, modified_by
3. **Development** — Shows API URL for integration and copy button

## API Endpoints | API 端点

The analytics package exposes REST APIs under `/analytics/api/`:

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/analytics/api/card` | Create new question |
| `GET` | `/analytics/api/card/:cardIdOrName` | Get question details |
| `PUT` | `/analytics/api/card/:id` | Update question |
| `POST` | `/analytics/api/card/:cardId/query` | Execute question query |
| `POST` | `/analytics/api/card/pivot/:cardId/query` | Execute pivot query |
| `POST` | `/analytics/api/card/:cardId/series` | Get series data |
| `POST` | `/analytics/api/dataset` | Execute ad-hoc query |

### URL Routes | URL 路由

| URL | Description |
|-----|-------------|
| `/analytics/question/notebook` | New question builder (notebook mode) |
| `/analytics/question/{id}` | Question editor |
| `/analytics/amis/question/{id}` | Question viewer (Amis renderer) |
| `/analytics/embed/question/{token}` | Embedded question |
| `/analytics/public/question/{uuid}` | Public shared question |

## Application & Tab Configuration | 应用与标签页配置

### Question Admin Tab

```yaml
# tabs/admin_analytics_card.tab.yml
name: admin_analytics_card
label: 问题
type: object
object: analytics_card
desktop: true
mobile: true
icon: omni_supervisor
is_new_window: false
permissions:
  - permission: 'on'
    permission_set: admin
  - permission: 'off'
    permission_set: user
license:
  - platform-standard
  - platform-enterprise
  - platform-professional
```

### Browse & Collection Tabs

```yaml
# tabs/analytics_browse.tab.yml
name: analytics_browse
label: 浏览数据
type: url
url: /analytics/browse/1
is_use_iframe: true
desktop: true
mobile: true
icon: account
```

```yaml
# tabs/analytics_collection.tab.yml
name: analytics_collection
label: 分析中心
type: url
url: /analytics/collection/root
is_use_iframe: true
desktop: true
mobile: true
icon: account
```

## Triggers | 触发器

Question triggers are implemented in JavaScript (via `src/triggers/`):

| Trigger | Description |
|---------|-------------|
| `analytics_card_afterFind` | Merge system card metadata after query |
| `analytics_card_afterCount` | Calculate actual count including system cards |
| `analytics_card_afterFindOne` | Merge metadata for single record fetch |
| `analytics_card_beforeInsert` | Check enterprise license before creation |

## Source Code Structure | 源代码结构

The analytics package's `src/` directory contains the business logic:

```
src/
├── actions/card/          # Card CRUD & query execution
│   ├── card.js            # GET card by ID/name
│   ├── cardNew.js         # Create new card
│   ├── cardSave.js        # Update card
│   ├── cardQuery.js       # Execute card query
│   ├── cardAmis.js        # Amis rendering
│   ├── pivotQuery.js      # Pivot table queries
│   └── series.js          # Chart series data
├── methods/               # Shared utilities
│   ├── convertRowsToAmisRows.js  # Convert to Amis format
│   ├── getDatabase.js     # Database resolution
│   ├── getObjectField.js  # Field metadata
│   └── dashboardParameters2Filter.js  # Parameter conversion
├── metabase/              # Metabase query engine
│   ├── query_processor.js # MBQL-to-SQL translation
│   ├── mbql_u.js          # MBQL utilities
│   ├── annotate.js        # Result annotation
│   └── drivers/           # Database-specific drivers
├── utils/                 # Data transformation
│   ├── fieldsConversion.js
│   ├── summarizeConversion.js
│   └── transform.js
└── app.js                 # Express route registration
```

## Best Practices | 最佳实践

1. **Enterprise license required**: Question creation checks license via `beforeInsert` trigger
2. **Use `table_id`**: Always set the source object via `table_id` (references `objects.name`)
3. **Permission control**: Use `disable_permission` cautiously — it bypasses row-level security
4. **Datasets**: Mark reusable queries as `dataset: true` for use as virtual tables
5. **Caching**: Set `cache_ttl` for expensive queries to improve performance
6. **Embedding**: Enable `enable_embedding` for iframe integration in external apps
7. **Public sharing**: Use `public_uuid` for unauthenticated access (security implications)
8. **Admin-only management**: Tab permissions restrict question management to admin users
9. **Collections**: Organize questions into collections (`collection_id`) for better navigation
