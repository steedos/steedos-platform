---
name: dashboards
description: |
  Create and manage analytics dashboards in Steedos. Dashboards are visual
  containers that display multiple report cards (questions) in a grid layout
  with tabs. Based on the @steedos-labs/analytics package (Metabase engine).
  Covers analytics_dashboard object, analytics_dashboard_card layout,
  analytics_dashboard_tab tabs, API endpoints, embedding, and permissions.
  Requires enterprise license.
---

# Steedos Analytics Dashboards | Steedos 分析仪表盘

## Overview | 概述

Analytics dashboards are visual containers that organize and display multiple report cards (questions/charts) in a flexible grid layout. Dashboards support multi-tab navigation, parameter filtering, embedding, and public sharing. They are part of the `@steedos-labs/analytics` package, built on the Metabase analytics engine.

分析仪表盘是可视化容器，以灵活的网格布局组织和显示多个报表卡片（问题/图表）。仪表盘支持多标签页导航、参数筛选、嵌入和公开分享。它们是 `@steedos-labs/analytics` 软件包的一部分，基于 Metabase 分析引擎构建。

**Prerequisites | 前置条件:**
- Enterprise license (企业版许可证)
- `@steedos-labs/analytics` plugin enabled

## Architecture | 架构

The dashboard system consists of three related objects:

| Object | Description |
|--------|-------------|
| `analytics_dashboard` | Dashboard definition (name, description, parameters) |
| `analytics_dashboard_card` | Card placement within a dashboard (position, size, card reference) |
| `analytics_dashboard_tab` | Tab pages within a dashboard |

```
analytics_dashboard (1)
├── analytics_dashboard_tab (N) — tabs/pages
└── analytics_dashboard_card (N) — card placements
    └── references analytics_card — the actual report/chart
```

## Object: analytics_dashboard | 仪表盘对象

### Object Definition | 对象定义

```yaml
# objects/analytics_dashboard/analytics_dashboard.object.yml
name: analytics_dashboard
custom: true
hidden: true
enable_api: true
enable_dataloader: true
enable_inline_edit: true
icon: dashboard_ea
is_enable: true
label: 仪表盘
version: 2
```

### Key Fields | 关键字段

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | text | No | Unique identifier (indexed) |
| `name` | text | Yes | Dashboard name (indexed) |
| `description` | text | No | Dashboard description (is_wide) |
| `archived` | boolean | No | Archive status (default: false) |
| `auto_apply_filters` | boolean | No | Auto apply filters (default: true) |
| `cache_ttl` | number | No | Cache time-to-live |
| `collection_id` | text | No | Collection ID for grouping |
| `collection_position` | number | No | Position in collection |
| `parameters` | grid | No | Dashboard filter parameters |
| `enable_embedding` | boolean | No | Enable iframe embedding (default: false) |
| `embedding_params` | text | No | Embedding parameter config |
| `public_uuid` | text | No | Public sharing UUID |
| `made_public_by_id` | number | No | User who made it public |
| `position` | number | No | Display position |
| `creator_id` | lookup(users) | No | Creator reference |
| `created_at` | datetime | No | Creation timestamp |
| `updated_at` | datetime | No | Last update timestamp |

### Field Definition Examples | 字段定义示例

```yaml
# objects/analytics_dashboard/fields/name.field.yml
name: name
index: true
label: 名称
required: true
sort_no: 100
type: text
```

```yaml
# objects/analytics_dashboard/fields/description.field.yml
name: description
label: 描述
sort_no: 110
type: text
is_wide: true
```

```yaml
# objects/analytics_dashboard/fields/parameters.field.yml
name: parameters
label: parameters
required: false
sort_no: 120
type: grid
hidden: false
```

```yaml
# objects/analytics_dashboard/fields/auto_apply_filters.field.yml
name: auto_apply_filters
defaultValue: 'true'
label: auto_apply_filters
precision: 18
required: false
scale: 2
sort_no: 130
type: boolean
hidden: false
```

### List Views | 列表视图

```yaml
# objects/analytics_dashboard/listviews/all.listview.yml
name: all
columns:
  - field: name
  - field: description
filter_scope: space
filters: []
label: 所有
scrolling_mode: standard
shared: true
sort_no: 100
type: grid
```

```yaml
# objects/analytics_dashboard/listviews/recent.listview.yml
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
# objects/analytics_dashboard/permissions/admin.permission.yml
name: Dashboard.管理员
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
# objects/analytics_dashboard/permissions/user.permission.yml
name: Dashboard.用户
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

#### New Dashboard Button (List Action)

Creates a dashboard via dialog with API call:

```yaml
# objects/analytics_dashboard/buttons/new_dashboard.button.yml
name: new_dashboard
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
              "label": "${'CustomAction.analytics_dashboard.new_dashboard' | t}",
              "onEvent": {
                  "click": {
                      "actions": [
                          {
                              "actionType": "dialog",
                              "dialog": {
                                  "type": "dialog",
                                  "title": "${'CustomAction.analytics_dashboard.new_dashboard' | t}",
                                  "body": [
                                      {
                                          "type": "form",
                                          "body": [
                                              {
                                                  "label": "${'CustomField.analytics_dashboard.name.label' | t}",
                                                  "type": "input-text",
                                                  "name": "name"
                                              },
                                              {
                                                  "type": "textarea",
                                                  "label": "${'CustomField.analytics_dashboard.description.label' | t}",
                                                  "name": "description",
                                                  "minRows": 3,
                                                  "maxRows": 20
                                              }
                                          ],
                                          "api": {
                                              "url": "/analytics/api/dashboard",
                                              "method": "post",
                                              "messages": { "success": "新建成功" }
                                          },
                                          "onEvent": {
                                              "submitSucc": {
                                                  "actions": [
                                                      {
                                                          "actionType": "custom",
                                                          "script": "navigate(`/app/admin/analytics_dashboard/view/${event.data.result.data.id}?side_object=analytics_dashboard&side_listview_id=all`)"
                                                      }
                                                  ]
                                              }
                                          }
                                      }
                                  ],
                                  "size": "md"
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

#### Design Button (Record Action)

Opens the dashboard designer:

```yaml
# objects/analytics_dashboard/buttons/standard_edit.button.yml
name: standard_edit
is_enable: true
label: 设计
'on': record_only
type: amis_button
visible: true
amis_schema: |-
  {
      "type": "service",
      "body": [
          {
              "type": "button",
              "label": "${'CustomAction.analytics_dashboard.standard_edit' | t}",
              "onEvent": {
                  "click": {
                      "actions": [
                          {
                              "actionType": "url",
                              "args": {
                                  "url": "${context.rootUrl}/analytics/dashboard/${recordId}"
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

Opens the dashboard in Amis viewer:

```yaml
# objects/analytics_dashboard/buttons/viewer.button.yml
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
              "label": "${'CustomAction.analytics_dashboard.viewer' | t}",
              "onEvent": {
                  "click": {
                      "actions": [
                          {
                              "actionType": "url",
                              "args": {
                                  "url": "${context.rootUrl}/analytics/amis/dashboard/${recordId}"
                              }
                          }
                      ]
                  }
              }
          }
      ]
  }
```

## Object: analytics_dashboard_card | 仪表盘卡片对象

Dashboard cards define the placement and configuration of report cards within a dashboard grid.

仪表盘卡片定义报表卡片在仪表盘网格中的位置和配置。

### Key Fields | 关键字段

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | number | Yes | Unique identifier (indexed) |
| `name` | text | Yes | Card name (indexed) |
| `dashboard_id` | number | Yes | Parent dashboard ID (indexed) |
| `dashboard_tab_id` | number | No | Tab page ID (indexed) |
| `card_id` | number | No | Referenced analytics_card ID |
| `action_id` | number | No | Action ID (indexed) |
| `row` | number | Yes | Grid row position |
| `col` | number | Yes | Grid column position |
| `size_x` | number | Yes | Width in grid units |
| `size_y` | number | Yes | Height in grid units |
| `parameter_mappings` | text | Yes | Parameter mapping config |
| `visualization_settings` | text | Yes | Visualization config |
| `entity_id` | text | No | Entity identifier (indexed) |
| `created_at` | datetime | Yes | Creation timestamp |
| `updated_at` | datetime | Yes | Last update timestamp |

## Object: analytics_dashboard_tab | 仪表盘标签页对象

Dashboard tabs enable multi-page navigation within a single dashboard.

仪表盘标签页支持在单个仪表盘内进行多页导航。

### Key Fields | 关键字段

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | number | Yes | Unique identifier |
| `name` | text | Yes | Tab name (indexed) |
| `dashboard_id` | number | Yes | Parent dashboard ID |
| `entity_id` | text | Yes | Entity identifier |
| `position` | number | Yes | Tab display order |
| `created_at` | datetime | Yes | Creation timestamp |
| `updated_at` | datetime | Yes | Last update timestamp |

## Record Detail Page | 记录详情页

```yaml
# pages/analytics_dashboard_detail.page.yml
name: analytics_dashboard_detail
label: 仪表盘记录详情页
object_name: analytics_dashboard
is_active: true
render_engine: amis
type: record
pageAssignments:
  - type: orgDefault
    page: analytics_dashboard_detail
    desktop: true
    mobile: true
```

The detail page (`.page.amis.json`) contains two tabs:
1. **Dashboard View** — iframe loading `/analytics/amis/dashboard/{recordId}`
2. **Details** — Object form with fields: name, description, created, created_by, modified, modified_by

## API Endpoints | API 端点

The analytics package exposes REST APIs under `/analytics/api/`:

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/analytics/api/dashboard` | Create new dashboard |
| `GET` | `/analytics/api/dashboard/:id` | Get dashboard details |
| `PUT` | `/analytics/api/dashboard/:id` | Update dashboard |
| `POST` | `/analytics/api/dashboard/:id/dashcard` | Add card to dashboard |
| `PUT` | `/analytics/api/dashboard/:id/dashcard` | Update dashboard cards |
| `DELETE` | `/analytics/api/dashboard/:id/dashcard` | Remove card from dashboard |
| `POST` | `/analytics/api/dashboard/:dashboardId/dashcard/:dashcardId/card/:cardId/query` | Execute card query |

### URL Routes | URL 路由

| URL | Description |
|-----|-------------|
| `/analytics/dashboard/{id}` | Dashboard designer (Metabase editor) |
| `/analytics/amis/dashboard/{id}` | Dashboard viewer (Amis renderer) |
| `/analytics/embed/dashboard/{token}` | Embedded dashboard |
| `/analytics/public/dashboard/{uuid}` | Public shared dashboard |

## Application & Tab Configuration | 应用与标签页配置

### Admin Application

```yaml
# applications/admin.app.yml
name: admin_analytics
code: admin
description: 使用可视化界面进行数据分析
icon_slds: account
is_creator: true
mobile: true
sort: 9100
visible: true
tab_items:
  admin_analytics_card:
    group: statistical_analysis
    index: 17.4
  admin_analytics_dashboard:
    group: statistical_analysis
    index: 17.6
```

### Dashboard Admin Tab

```yaml
# tabs/admin_analytics_dashboard.tab.yml
name: admin_analytics_dashboard
label: 仪表盘
type: object
object: analytics_dashboard
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

## Triggers | 触发器

Dashboard triggers are implemented in JavaScript (via `src/triggers/`):

| Trigger | Description |
|---------|-------------|
| `analytics_dashboard_afterFind` | Merge system dashboard metadata after query |
| `analytics_dashboard_afterCount` | Calculate actual count including system dashboards |
| `analytics_dashboard_afterFindOne` | Merge metadata for single record fetch |
| `analytics_dashboard_afterInsert` | Auto-create default tab after dashboard creation |

## Best Practices | 最佳实践

1. **Enterprise license required**: Dashboard creation checks license via `beforeInsert` trigger
2. **Grid layout**: Cards use a grid system with `row`, `col`, `size_x`, `size_y` for positioning
3. **Multi-tab dashboards**: Use `analytics_dashboard_tab` to organize cards into tabs
4. **Parameter filtering**: Dashboards support global parameters that filter across all cards
5. **Embedding**: Enable `enable_embedding` and configure `embedding_params` for iframe integration
6. **Public sharing**: Set `public_uuid` to share dashboards without authentication
7. **Caching**: Use `cache_ttl` to control query result caching
8. **Admin-only management**: Tab permissions restrict dashboard management to admin users
