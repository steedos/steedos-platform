---
name: steedos-object-buttons
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

> **⚠️ 关键规则：`amis_schema` 最外层必须是 `service`**
>
> `amis_schema` 的根节点 **必须** 是 `{"type": "service", "body": ...}`，
> 将实际按钮放在 `body` 中。如果最外层直接是 `button`，按钮将**无法显示**。
>
> **⚠️ Critical: `amis_schema` root MUST be a `service` wrapper.**
> The actual button goes inside `body`. A bare `button` at the root will not render.

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
    "type": "service",
    "body": {
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
                "url": "/api/v6/functions/orders/submit_order",
                "method": "post",
                "requestAdaptor": "api.data = { id: context.recordId }",
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
  }
```

## Button Properties | 按钮属性

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `name` | string | **Yes** | **⚠️ Unique identifier (snake_case). MUST NOT be omitted.** |
| `label` | string | Yes | Display label |
| `type` | string | Yes | **⚠️ MUST be `amis_button`. No other value is valid.** |
| `on` | string | Yes | **⚠️ MUST be one of: `record_only`, `record`, `list`, `list_record`. See [Display Locations](#display-locations-on--显示位置) below.** |
| `is_enable` | boolean | Yes | Enable/disable button |
| `visible` | boolean | No | Show/hide button |
| `locked` | boolean | No | Lock button from editing |
| `amis_schema` | string | Yes | Inline Amis JSON schema (YAML block scalar `|-`) |

### Display Locations (`on`) | 显示位置

**⚠️ The `on` value MUST be one of the values below. Do NOT use other values.**

**⚠️ `on` 值必须为下表中的值之一，严禁使用其他值。**

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
    "type": "service",
    "body": {
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
                "url": "/api/v6/functions/orders/approve_order",
                "method": "post",
                "requestAdaptor": "api.data = { id: context.recordId }",
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
    "type": "service",
    "body": {
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
                "url": "/api/v6/functions/orders/cancel_order",
                "method": "post",
                "requestAdaptor": "api.data = { id: context.recordId }",
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
    "type": "service",
    "body": {
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
            "url": "/api/v6/functions/orders/reject_order",
            "method": "post",
            "requestAdaptor": "api.data = { id: context.recordId, reason: api.body.reject_reason }",
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
                  "url": "/api/v6/functions/materials/approve",
                  "method": "post",
                  "requestAdaptor": "api.data = { id: context.recordId }",
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
    "type": "service",
    "body": {
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
                "url": "/api/v6/functions/materials/sync_data",
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
                  "url": "/api/v6/functions/orders/pick_order",
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

On record detail pages (`on: record_only` / `record`), the Amis data scope automatically includes:

- `recordId` — Current record's `_id`
- All fields of the current record (e.g., `status`, `name`, `amount`)
- `context.user.user` — Current user ID

### In Amis Template Expressions | 在 Amis 模板表达式中

Use `${variable}` syntax for `visibleOn`, `disabledOn`, `value`, etc.:

```json
{
  "visibleOn": "${status == 'draft'}",
  "visibleOn": "${ARRAYINCLUDES(approvers, '${context.user.user}')}",
  "value": "${name} - copy"
}
```

### In requestAdaptor | 在发送适配器中

Use `context.recordId` to get the current record's `_id`:

```json
{
  "requestAdaptor": "api.data = { id: context.recordId }",
  "requestAdaptor": "api.data = { id: context.recordId, reason: api.body.reject_reason }"
}
```

- `context.recordId` — Current record `_id` (recommended)
- `context.user.user` — Current user ID
- `api.body.fieldName` — Access form field values (in dialog forms)

## Best Practices | 最佳实践

1. **`amis_schema` root MUST be `service`**: Always wrap the button in `{"type":"service","body":{...}}`. A bare `button` at the root will not render. （`amis_schema` 根节点必须是 `service`，否则按钮无法显示）
2. **Use functions for business logic**: Buttons should call server-side functions via AJAX, not embed business logic in the client
3. **Provide confirmation**: Use `confirmText` for destructive actions
4. **Reload after action**: Always reload record detail or list view after successful action
5. **Conditional visibility**: Use `visibleOn` to show buttons only when appropriate
6. **Bilingual labels**: Provide both English and Chinese labels where needed

## Real-world Example | 真实完整示例

Complex dialog form button with conditional fields (线索转化按钮):

```yaml
name: convert_lead
label: 转化
type: amis_button
'on': record_only
is_enable: true
visible: true
locked: false
amis_schema: |-
  {
    "type": "service",
    "body": {
      "type": "button",
      "label": "转化",
      "level": "primary",
      "icon": "fa fa-exchange",
      "visibleOn": "${status == 'new' || status == 'following'}",
      "actionType": "dialog",
      "dialog": {
        "title": "线索转化",
        "size": "md",
        "body": {
          "type": "form",
          "api": {
            "url": "/api/v6/functions/leads/convert_lead",
            "method": "post",
            "requestAdaptor": "api.data = { id: context.recordId, account_name: api.body.account_name, contact_name: api.body.contact_name, create_opportunity: api.body.create_opportunity, opportunity_name: api.body.opportunity_name, opportunity_amount: api.body.opportunity_amount }",
            "adaptor": "return { ...payload, msg: payload.data?.message || '转化成功' }",
            "messages": { "success": "线索转化成功" }
          },
          "body": [
            {
              "type": "alert",
              "body": "将此线索转化为客户和联系人，并可选创建销售机会。",
              "level": "info",
              "className": "mb-3"
            },
            {
              "type": "divider",
              "title": "客户信息"
            },
            {
              "type": "input-text",
              "name": "account_name",
              "label": "客户名称",
              "required": true,
              "value": "${company}",
              "placeholder": "请输入客户名称"
            },
            {
              "type": "divider",
              "title": "联系人信息"
            },
            {
              "type": "input-text",
              "name": "contact_name",
              "label": "联系人姓名",
              "required": true,
              "value": "${name}",
              "placeholder": "请输入联系人姓名"
            },
            {
              "type": "divider",
              "title": "销售机会"
            },
            {
              "type": "switch",
              "name": "create_opportunity",
              "label": "创建销售机会",
              "value": false
            },
            {
              "type": "input-text",
              "name": "opportunity_name",
              "label": "机会名称",
              "visibleOn": "${create_opportunity}",
              "required": true,
              "requiredOn": "${create_opportunity}",
              "value": "${company} - 新商机",
              "placeholder": "请输入销售机会名称"
            },
            {
              "type": "input-number",
              "name": "opportunity_amount",
              "label": "预计金额",
              "visibleOn": "${create_opportunity}",
              "precision": 2,
              "step": 1000,
              "prefix": "¥",
              "placeholder": "请输入预计金额"
            }
          ]
        }
      }
    }
  }
```
