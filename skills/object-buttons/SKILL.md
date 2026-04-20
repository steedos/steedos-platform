---
name: object-buttons
description: |
  Create custom buttons for Steedos objects using YAML with Amis UI schema.
  Buttons appear on record pages or list views. Covers button properties
  (name, label, type, on, amis_schema), display locations (record_only, list,
  list_record), visibility control via visibleOn formulas, Amis event actions
  (ajax, dialog, broadcast, reload, toast), and hiding standard buttons.
  Important: buttons are .button.yml files in objects/{name}/buttons/ folder.
---
# Steedos Object Buttons | Steedos 对象按钮

## Overview | 概述

Object buttons are custom actions displayed on record pages or list views. They are defined as `.button.yml` files using YAML with inline Amis JSON schema for UI and event handling.

对象按钮是显示在记录页面或列表视图上的自定义操作。使用 `.button.yml` 文件定义，通过内联 Amis JSON schema 配置 UI 和事件处理。

## File Location | 文件位置

```
steedos-packages/
└── my-package/
    └── main/default/
        └── objects/
            └── orders/
                ├── orders.object.yml
                └── buttons/
                    ├── submit_order.button.yml
                    ├── cancel_order.button.yml
                    ├── standard_edit.button.yml      # Override standard button
                    └── standard_delete.button.yml
```

## Button Structure | 按钮结构

```yaml
# objects/orders/buttons/submit_order.button.yml
name: submit_order
label: Submit for Approval
type: amis_button
on: record_only
is_enable: true
visible: true
locked: false
amis_schema: |-
  {
    "type": "button",
    "label": "Submit for Approval",
    "level": "primary",
    "onEvent": {
      "click": {
        "weight": 0,
        "actions": [
          {
            "actionType": "ajax",
            "api": {
              "url": "/api/v1/orders/functions/submit_order",
              "method": "post",
              "requestAdaptor": "api.data = { id: api.body.recordId }",
              "adaptor": "return { ...payload, msg: payload.data?.message || 'Submitted' }",
              "messages": { "success": "Order submitted" }
            }
          },
          {
            "actionType": "reload",
            "componentId": "steedos-record-detail"
          }
        ]
      }
    }
  }
```

## Button Properties | 按钮属性

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `name` | string | Yes | Unique identifier (snake_case) |
| `label` | string | Yes | Display label |
| `type` | string | Yes | Always `amis_button` |
| `on` | string | Yes | Where button appears |
| `is_enable` | boolean | Yes | Enable/disable button |
| `visible` | boolean | No | Show/hide button |
| `locked` | boolean | No | Lock button from editing |
| `amis_schema` | string | Yes | Inline Amis JSON schema (YAML block scalar `|-`) |

### Display Locations (`on`) | 显示位置

| Value | Description |
|-------|-------------|
| `record_only` | Record detail page only |
| `record` | Record context (detail + related) |
| `list` | List view toolbar |
| `list_record` | Both list and record |

## Complete Examples | 完整示例

### Example 1: Simple AJAX Button | 简单 AJAX 按钮

```yaml
# objects/orders/buttons/approve_order.button.yml
name: approve_order
label: Approve
type: amis_button
on: record_only
is_enable: true
visible: true
locked: false
amis_schema: |-
  {
    "type": "button",
    "label": "Approve",
    "level": "primary",
    "confirmText": "Are you sure you want to approve this order?",
    "confirmTitle": "Confirm Approval",
    "onEvent": {
      "click": {
        "weight": 0,
        "actions": [
          {
            "actionType": "ajax",
            "api": {
              "url": "/api/v1/orders/functions/approve_order",
              "method": "post",
              "requestAdaptor": "api.data = { id: api.body.recordId }",
              "adaptor": "return { ...payload, msg: payload.data?.message || 'Approved' }",
              "messages": { "success": "Order approved successfully" }
            }
          },
          {
            "actionType": "reload",
            "componentId": "steedos-record-detail"
          }
        ]
      }
    }
  }
```

### Example 2: Conditional Visibility | 条件显示按钮

```yaml
# objects/orders/buttons/cancel_order.button.yml
name: cancel_order
label: Cancel Order
type: amis_button
on: record_only
is_enable: true
visible: true
locked: false
amis_schema: |-
  {
    "type": "button",
    "label": "Cancel Order",
    "level": "danger",
    "visibleOn": "${status == 'draft' || status == 'submitted'}",
    "confirmText": "This cannot be undone. Are you sure?",
    "onEvent": {
      "click": {
        "weight": 0,
        "actions": [
          {
            "actionType": "ajax",
            "api": {
              "url": "/api/v1/orders/functions/cancel_order",
              "method": "post",
              "requestAdaptor": "api.data = { id: api.body.recordId }",
              "messages": { "success": "Order cancelled" }
            }
          },
          {
            "actionType": "reload",
            "componentId": "steedos-record-detail"
          }
        ]
      }
    }
  }
```

### Example 3: Button with Dialog Form | 带弹窗表单的按钮

```yaml
# objects/orders/buttons/reject_order.button.yml
name: reject_order
label: Reject
type: amis_button
on: record_only
is_enable: true
visible: true
locked: false
amis_schema: |-
  {
    "type": "button",
    "label": "Reject",
    "level": "danger",
    "visibleOn": "${status == 'submitted'}",
    "actionType": "dialog",
    "dialog": {
      "title": "Reject Order",
      "body": {
        "type": "form",
        "api": {
          "url": "/api/v1/orders/functions/reject_order",
          "method": "post",
          "requestAdaptor": "api.data = { id: api.body.recordId, reason: api.body.reject_reason }",
          "messages": { "success": "Order rejected" }
        },
        "body": [
          {
            "type": "textarea",
            "name": "reject_reason",
            "label": "Rejection Reason",
            "required": true,
            "rows": 4
          }
        ]
      }
    }
  }
```

### Example 4: Button with Multiple Actions | 多步骤操作按钮

```yaml
# objects/materials/buttons/approve_material.button.yml
name: approve_material
label: Approve Material
type: amis_button
on: record_only
is_enable: true
visible: true
locked: false
amis_schema: |-
  {
    "type": "service",
    "body": [
      {
        "type": "button",
        "label": "Approve",
        "level": "primary",
        "visibleOn": "${status == 'pending_review'}",
        "onEvent": {
          "click": {
            "weight": 0,
            "actions": [
              {
                "actionType": "ajax",
                "api": {
                  "url": "/api/v1/materials/functions/approve",
                  "method": "post",
                  "requestAdaptor": "api.data = { id: api.body.recordId }",
                  "messages": { "success": "Material approved" }
                }
              },
              {
                "actionType": "broadcast",
                "args": { "eventName": "steedos:record:reload" }
              }
            ]
          }
        }
      }
    ]
  }
```

### Example 5: List Button (Batch Operation) | 列表按钮（批量操作）

```yaml
# objects/materials/buttons/sync_data.button.yml
name: sync_data
label: Sync Data
type: amis_button
on: list
is_enable: true
visible: true
locked: false
amis_schema: |-
  {
    "type": "button",
    "label": "Sync",
    "level": "primary",
    "confirmText": "Sync all selected records?",
    "onEvent": {
      "click": {
        "weight": 0,
        "actions": [
          {
            "actionType": "ajax",
            "api": {
              "url": "/api/v1/materials/functions/sync_data",
              "method": "post",
              "messages": { "success": "Sync completed" }
            }
          },
          {
            "actionType": "reload",
            "componentId": "steedos-object-listview"
          }
        ]
      }
    }
  }
```

### Example 6: Disable/Enable Button State | 按钮禁用/启用状态

```yaml
# objects/orders/buttons/pick_order.button.yml
name: pick_order
label: Pick Order
type: amis_button
on: record_only
is_enable: true
visible: true
locked: false
amis_schema: |-
  {
    "type": "service",
    "body": [
      {
        "id": "u:pick_btn",
        "type": "button",
        "label": "Pick",
        "level": "primary",
        "visibleOn": "${status == 'available'}",
        "onEvent": {
          "click": {
            "weight": 0,
            "actions": [
              {
                "actionType": "disabled",
                "componentId": "u:pick_btn"
              },
              {
                "actionType": "ajax",
                "api": {
                  "url": "/api/v1/orders/functions/pick_order",
                  "method": "post",
                  "requestAdaptor": "api.data = { id: api.body.recordId }"
                }
              },
              {
                "actionType": "enabled",
                "componentId": "u:pick_btn"
              },
              {
                "actionType": "broadcast",
                "args": { "eventName": "steedos:record:reload" }
              }
            ]
          }
        }
      }
    ]
  }
```

## Hiding Standard Buttons | 隐藏标准按钮

Override standard buttons by creating a `.button.yml` with `visible: false`:

```yaml
# objects/orders/buttons/standard_delete.button.yml
name: standard_delete
visible: false

# objects/orders/buttons/standard_edit.button.yml
name: standard_edit
visible: false

# objects/orders/buttons/standard_new.button.yml
name: standard_new
visible: false

# objects/orders/buttons/standard_delete_many.button.yml
name: standard_delete_many
visible: false
```

## Amis Action Types | Amis 操作类型

Common `actionType` values used in button events:

| Action Type | Description |
|-------------|-------------|
| `ajax` | HTTP request to API endpoint |
| `dialog` | Open dialog/modal window |
| `reload` | Reload a component by ID |
| `broadcast` | Broadcast event (e.g., `steedos:record:reload`) |
| `toast` | Show toast notification |
| `closeDialog` | Close current dialog |
| `disabled` | Disable a component |
| `enabled` | Enable a component |
| `custom` | Custom JavaScript action |
| `setValue` | Set component value |
| `url` | Navigate to URL |

## Accessing Record Data in Amis Schema | 在 Amis Schema 中访问记录数据

Inside `amis_schema`, use Amis template variables:

```json
{
  "visibleOn": "${status == 'draft'}",
  "requestAdaptor": "api.data = { id: api.body.recordId }",
  "visibleOn": "${ARRAYINCLUDES(approvers, '${context.user.user}')}"
}
```

- `${fieldName}` — Access record field values
- `api.body.recordId` — Current record ID (in requestAdaptor)
- `${context.user.user}` — Current user ID

## Best Practices | 最佳实践

1. **Use functions for business logic**: Buttons should call server-side functions via AJAX, not embed business logic in the client
2. **Provide confirmation**: Use `confirmText` for destructive actions
3. **Reload after action**: Always reload record detail or list view after successful action
4. **Conditional visibility**: Use `visibleOn` to show buttons only when appropriate
5. **Bilingual labels**: Provide both English and Chinese labels where needed
