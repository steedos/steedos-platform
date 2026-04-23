---
name: steedos-object-permissions
description: |
  Configure multi-level permission control for Steedos objects. Permissions
  are defined as .permission.yml files in objects/{name}/permissions/ and
  .permissionset.yml files in permissionsets/. Covers object-level permissions
  (allowCreate, allowRead, allowEdit, allowDelete, viewAllRecords,
  modifyAllRecords), field-level permissions, permission sets, profiles,
  restriction rules, and dynamic permissions with triggers.
---
# Steedos Object Permissions | Steedos 对象权限

## Overview | 概述

Steedos provides multi-level permission control: object-level, record-level, and field-level. Permissions are defined as separate `.permission.yml` files in the object's `permissions/` subfolder.

Steedos 提供多级别权限控制：对象级、记录级和字段级。权限作为独立的 `.permission.yml` 文件定义在对象的 `permissions/` 子文件夹中。

## File Location | 文件位置

```
steedos-packages/
└── my-package/
    └── main/default/
        ├── objects/
        │   └── orders/
        │       └── permissions/
        │           ├── user.permission.yml
        │           ├── admin.permission.yml
        │           └── sales_manager.permission.yml
        ├── permissionsets/
        │   ├── sales.permissionset.yml
        │   └── finance.permissionset.yml
        ├── profiles/
        │   └── user.profile.yml
        ├── roles/
        │   └── sales_manager.role.yml
        └── restrictionRules/
            └── user_filter.restrictionRule.yml
```

## Object Permission (.permission.yml) | 对象权限

```yaml
# objects/orders/permissions/user.permission.yml
name: orders.user
permission_set_id: user
allowCreate: true
allowRead: true
allowEdit: true
allowDelete: false
allowExport: true
viewAllRecords: true
modifyAllRecords: false
allowReadFiles: true
allowCreateFiles: true
allowEditFiles: true
allowDeleteFiles: false
viewAllFiles: true
modifyAllFiles: false
field_permissions: []
```

### Permission Properties | 权限属性

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `name` | string | **Yes** | **⚠️ MUST NOT be omitted.** Format: `{objectName}.{permissionSetId}` |
| `permission_set_id` | string | **Yes** | Permission set name |
| `allowCreate` | boolean | No | Can create new records |
| `allowRead` | boolean | No | Can view records |
| `allowEdit` | boolean | No | Can edit records |
| `allowDelete` | boolean | No | Can delete records |
| `allowExport` | boolean | No | Can export records |
| `viewAllRecords` | boolean | No | Can view all records |
| `modifyAllRecords` | boolean | No | Can edit all records |
| `allowReadFiles` | boolean | No | Can read file attachments |
| `allowCreateFiles` | boolean | No | Can upload files |
| `allowEditFiles` | boolean | No | Can edit files |
| `allowDeleteFiles` | boolean | No | Can delete files |
| `viewAllFiles` | boolean | No | Can view all files |
| `modifyAllFiles` | boolean | No | Can modify all files |
| `field_permissions` | array | No | Field-level permissions |

## Complete Examples | 完整示例

### Regular User Permission | 普通用户权限
```yaml
# objects/orders/permissions/user.permission.yml
name: orders.user
permission_set_id: user
allowCreate: true
allowRead: true
allowEdit: true
allowDelete: false
allowExport: true
viewAllRecords: false
modifyAllRecords: false
allowReadFiles: true
allowCreateFiles: true
allowEditFiles: true
allowDeleteFiles: false
viewAllFiles: false
modifyAllFiles: false
field_permissions: []
```

### Admin Permission | 管理员权限
```yaml
# objects/orders/permissions/admin.permission.yml
name: orders.admin
permission_set_id: admin
allowCreate: true
allowRead: true
allowEdit: true
allowDelete: true
allowExport: true
viewAllRecords: true
modifyAllRecords: true
allowReadFiles: true
allowCreateFiles: true
allowEditFiles: true
allowDeleteFiles: true
viewAllFiles: true
modifyAllFiles: true
field_permissions: []
```

### Custom Permission with Field Restrictions | 带字段限制的自定义权限
```yaml
# objects/orders/permissions/customer_service.permission.yml
name: orders.customer_service
permission_set_id: customer_service
allowCreate: true
allowRead: true
allowEdit: true
allowDelete: false
viewAllRecords: true
modifyAllRecords: false
field_permissions:
  - field: profit_margin
    readable: false
    editable: false
  - field: internal_notes
    readable: false
    editable: false
```

## Permission Set (.permissionset.yml) | 权限集

Permission sets group permissions and can be assigned to users:

```yaml
# permissionsets/sales.permissionset.yml
name: sales
label: Sales Team
type: permission_set
locked: false
```

```yaml
# permissionsets/finance.permissionset.yml
name: finance
label: Finance Team
type: permission_set
enable_MFA: false
login_expiration_in_days: 90
locked: false
```

## Profile (.profile.yml) | 简档

Profiles assign applications to user groups:

```yaml
# profiles/user.profile.yml
name: user
label: Standard User
type: profile
assigned_apps:
  - crm
  - orders
  - projects
max_login_attempts: '0'
lockout_interval: '15'
password_history: '3'
```

## Role (.role.yml) | 角色

```yaml
# roles/sales_manager.role.yml
name: Sales Manager
api_name: sales_manager
label: Sales Manager
locked: false
```

## Restriction Rules (.restrictionRule.yml) | 限制规则

Restrict record visibility based on user attributes:

```yaml
# restrictionRules/user_order_filter.restrictionRule.yml
name: user_order_filter
object_name: orders
active: true
entry_criteria: '{{$user.profile == "user"}}'
record_filter: >
  {{[
    ["owner", "=", "$user.userId"],
    "or",
    ["assigned_to", "=", "$user.userId"]
  ]}}
```

## Record-Level Permissions | 记录级权限

### Ownership-Based | 基于所有权
```yaml
# When modifyAllRecords: false, users can only modify their own records
modifyAllRecords: false    # Can only edit own records
viewAllRecords: false      # Can only view own records
```

### Company-Based | 基于公司
```yaml
viewCompanyRecords: true   # Can view company records
modifyCompanyRecords: true # Can edit company records
```

## Dynamic Permissions with Triggers | 触发器动态权限

For complex permission logic, use triggers:

```yaml
# triggers/contracts_permission.trigger.yml
name: contracts_permission
listenTo: contracts
when:
  - beforeUpdate
isEnabled: true
type: code
handler: |-
  const { doc, previousDoc } = ctx.params;

  // Only owner or admin can change status
  if (doc.status && doc.status !== previousDoc.status) {
    if (previousDoc.owner !== ctx.userId) {
      const user = await ctx.getUser(ctx.userId, ctx.spaceId);
      if (!user.is_admin) {
        throw new Error('Only contract owner or admin can change status');
      }
    }
  }

  return { doc };
```

## Best Practices | 最佳实践

1. **Principle of least privilege**: Start with minimal permissions, add as needed
2. **Protect sensitive fields**: Use `field_permissions` to hide salary, SSN, etc.
3. **Use restriction rules**: For row-level security beyond simple ownership
4. **Separate permission sets per role**: Create distinct permission sets for sales, finance, HR, etc.
5. **Always define both user and admin**: Every object should have at least these two permission sets
