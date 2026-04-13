---
name: object-permissions
description: |
  Configure comprehensive multi-level permission control for Steedos objects. Use this skill to set up object-level permissions (CRUD operations), record-level permissions (ownership, company-based, sharing rules), and field-level permissions (read/write access). Covers permission sets (user, admin, custom), permission properties (allowCreate, allowRead, allowEdit, allowDelete, viewAllRecords, modifyAllRecords), field visibility, and dynamic permissions with triggers.
---
# Steedos Object Permissions | Steedos 对象权限

## Overview | 概述

Steedos provides comprehensive permission control at multiple levels: object-level, record-level, and field-level. Permissions determine who can view, create, edit, and delete records, as well as which fields users can access.

Steedos 提供多级别的全面权限控制:对象级、记录级和字段级。权限决定谁可以查看、创建、编辑和删除记录,以及用户可以访问哪些字段。

## Permission Levels | 权限级别

1. **Object Permissions** (对象权限): CRUD operations on object
2. **Record Permissions** (记录权限): Access to specific records
3. **Field Permissions** (字段权限): Read/write access to fields

## Object Permissions | 对象权限

### Definition in Object File | 在对象文件中定义

```yaml
# objects/customers.object.yml
name: customers
label: Customer
fields:
  # ... field definitions

permission_set:
  user:
    allowCreate: true
    allowRead: true
    allowEdit: true
    allowDelete: false
    modifyAllRecords: false
    viewAllRecords: false

  admin:
    allowCreate: true
    allowRead: true
    allowEdit: true
    allowDelete: true
    modifyAllRecords: true
    viewAllRecords: true
```

### Permission Properties | 权限属性

| Property | Type | Description |
|----------|------|-------------|
| `allowCreate` | boolean | Can create new records |
| `allowRead` | boolean | Can view records |
| `allowEdit` | boolean | Can edit records |
| `allowDelete` | boolean | Can delete records |
| `viewAllRecords` | boolean | Can view all records (not just own) |
| `modifyAllRecords` | boolean | Can edit all records (not just own) |
| `viewCompanyRecords` | boolean | Can view company records |
| `modifyCompanyRecords` | boolean | Can edit company records |

### Permission Sets | 权限集

Steedos has built-in permission sets (profiles):

Steedos 有内置权限集(简档):

- `user`: Regular users (普通用户)
- `admin`: Administrators (管理员)
- `guest`: Guest users (访客)
- `supplier`: Suppliers (供应商)
- `customer`: Customers (客户)

### Custom Permission Sets | 自定义权限集

```yaml
permission_set:
  # Sales team
  sales:
    allowCreate: true
    allowRead: true
    allowEdit: true
    allowDelete: false
    viewAllRecords: true
    modifyAllRecords: false

  # Sales managers
  sales_manager:
    allowCreate: true
    allowRead: true
    allowEdit: true
    allowDelete: true
    viewAllRecords: true
    modifyAllRecords: true

  # Read-only auditors
  auditor:
    allowCreate: false
    allowRead: true
    allowEdit: false
    allowDelete: false
    viewAllRecords: true
    modifyAllRecords: false

  # Customer service
  customer_service:
    allowCreate: true
    allowRead: true
    allowEdit: true
    allowDelete: false
    viewAllRecords: true
    modifyAllRecords: false
    field_permissions:
      price:
        readable: false              # Can't see price
        editable: false
      cost:
        readable: false              # Can't see cost
        editable: false
```

## Record-Level Permissions | 记录级权限

### Ownership-Based | 基于所有权

By default, users can only modify their own records unless `modifyAllRecords` is true:

默认情况下,用户只能修改自己的记录,除非 `modifyAllRecords` 为 true:

```yaml
permission_set:
  user:
    allowEdit: true
    modifyAllRecords: false         # Can only edit own records

  manager:
    allowEdit: true
    modifyAllRecords: true          # Can edit all records
```

### Company-Based | 基于公司

```yaml
permission_set:
  user:
    allowRead: true
    viewAllRecords: false           # Only own records
    viewCompanyRecords: true        # + company records

  admin:
    viewAllRecords: true            # All records
```

### Sharing Rules | 共享规则

Enable record sharing to allow users to share specific records:

启用记录共享以允许用户共享特定记录:

```yaml
name: contracts
enable_share: true                  # Enable sharing feature
permission_set:
  user:
    allowRead: true
    viewAllRecords: false
```

Users can then share records with specific users or roles.

## Field-Level Permissions | 字段级权限

### Field Permission Properties | 字段权限属性

```yaml
permission_set:
  profile_name:
    allowCreate: true
    allowRead: true
    allowEdit: true
    allowDelete: false
    field_permissions:
      field_name:
        readable: true              # Can view field
        editable: true              # Can edit field
```

### Example: Sensitive Fields | 示例:敏感字段

```yaml
# objects/employees.object.yml
fields:
  name:
    type: text
    label: Name

  salary:
    type: currency
    label: Salary

  ssn:
    type: text
    label: SSN

permission_set:
  user:
    allowRead: true
    allowEdit: false
    field_permissions:
      salary:
        readable: false             # Users can't see salary
        editable: false
      ssn:
        readable: false             # Users can't see SSN
        editable: false

  hr:
    allowRead: true
    allowEdit: true
    field_permissions:
      salary:
        readable: true              # HR can see salary
        editable: true              # HR can edit salary
      ssn:
        readable: true              # HR can see SSN
        editable: true              # HR can edit SSN

  manager:
    allowRead: true
    allowEdit: false
    field_permissions:
      salary:
        readable: true              # Managers can see salary
        editable: false             # But can't edit
      ssn:
        readable: false             # Can't see SSN
        editable: false
```

### Field Visibility in Forms | 表单中的字段可见性

You can also control field visibility using field properties:

您还可以使用字段属性控制字段可见性:

```yaml
fields:
  internal_notes:
    type: textarea
    label: Internal Notes
    hidden: true                    # Hidden from all non-admin users
    readonly: true                  # Read-only for all users

  admin_only_field:
    type: text
    label: Admin Only
    omit: false
    hidden: false
    readonly: false
    # Control via permission_set instead
```

## Complete Permission Examples | 完整权限示例

### Example 1: Customer Management | 客户管理

```yaml
# objects/customers.object.yml
name: customers
label: Customer
fields:
  name:
    type: text
    label: Customer Name

  credit_limit:
    type: currency
    label: Credit Limit

  internal_rating:
    type: select
    label: Internal Rating
    options: A:a,B:b,C:c

  sales_notes:
    type: textarea
    label: Sales Notes

permission_set:
  # Regular sales users
  user:
    allowCreate: true
    allowRead: true
    allowEdit: true
    allowDelete: false
    viewAllRecords: false           # Only see own customers
    modifyAllRecords: false
    field_permissions:
      credit_limit:
        readable: false             # Can't see credit limit
        editable: false
      internal_rating:
        readable: false             # Can't see rating
        editable: false

  # Sales managers
  sales_manager:
    allowCreate: true
    allowRead: true
    allowEdit: true
    allowDelete: false
    viewAllRecords: true            # See all customers
    modifyAllRecords: true          # Edit all customers
    field_permissions:
      credit_limit:
        readable: true              # Can see credit limit
        editable: true              # Can edit credit limit
      internal_rating:
        readable: true              # Can see rating
        editable: true              # Can edit rating

  # Finance team
  finance:
    allowCreate: false
    allowRead: true
    allowEdit: true
    allowDelete: false
    viewAllRecords: true
    modifyAllRecords: false         # Can't edit all, only specific fields
    field_permissions:
      credit_limit:
        readable: true
        editable: true              # Finance can edit credit limits
      sales_notes:
        readable: false             # Can't see sales notes
        editable: false

  # Read-only for reports
  analyst:
    allowCreate: false
    allowRead: true
    allowEdit: false
    allowDelete: false
    viewAllRecords: true
    field_permissions:
      internal_rating:
        readable: true              # Can see for analysis
        editable: false
      credit_limit:
        readable: true
        editable: false

  # System administrators
  admin:
    allowCreate: true
    allowRead: true
    allowEdit: true
    allowDelete: true
    viewAllRecords: true
    modifyAllRecords: true
    # No field restrictions (full access)
```

### Example 2: Contract Management | 合同管理

```yaml
# objects/contracts.object.yml
name: contracts
label: Contract
enable_share: true                  # Enable sharing
fields:
  name:
    type: text
    label: Contract Name

  amount:
    type: currency
    label: Contract Amount

  legal_terms:
    type: html
    label: Legal Terms

  internal_comments:
    type: textarea
    label: Internal Comments

  profit_margin:
    type: percent
    label: Profit Margin

permission_set:
  # Regular users
  user:
    allowCreate: true
    allowRead: true
    allowEdit: true
    allowDelete: false
    viewAllRecords: false           # Only own records
    modifyAllRecords: false
    field_permissions:
      profit_margin:
        readable: false
        editable: false
      internal_comments:
        readable: false
        editable: false

  # Contract managers
  contract_manager:
    allowCreate: true
    allowRead: true
    allowEdit: true
    allowDelete: false
    viewAllRecords: true
    modifyAllRecords: true
    field_permissions:
      profit_margin:
        readable: true
        editable: true
      internal_comments:
        readable: true
        editable: true

  # Legal team
  legal:
    allowCreate: false
    allowRead: true
    allowEdit: true
    allowDelete: false
    viewAllRecords: true
    modifyAllRecords: false
    field_permissions:
      legal_terms:
        readable: true
        editable: true              # Legal can edit terms
      amount:
        readable: true
        editable: false             # Can't change amount
      profit_margin:
        readable: false
        editable: false

  # Finance team
  finance:
    allowCreate: false
    allowRead: true
    allowEdit: true
    allowDelete: false
    viewAllRecords: true
    field_permissions:
      amount:
        readable: true
        editable: true              # Finance can adjust amounts
      profit_margin:
        readable: true
        editable: true
      legal_terms:
        readable: true
        editable: false             # Can't edit legal terms

  # Admin
  admin:
    allowCreate: true
    allowRead: true
    allowEdit: true
    allowDelete: true
    viewAllRecords: true
    modifyAllRecords: true
```

### Example 3: Employee Records | 员工记录

```yaml
# objects/employees.object.yml
name: employees
label: Employee
fields:
  name:
    type: text
    label: Name

  email:
    type: email
    label: Email

  phone:
    type: text
    label: Phone

  department:
    type: lookup
    reference_to: departments
    label: Department

  salary:
    type: currency
    label: Salary

  performance_rating:
    type: select
    label: Performance Rating
    options: Excellent:5,Good:4,Average:3,Poor:2

  ssn:
    type: text
    label: SSN

  bank_account:
    type: text
    label: Bank Account

permission_set:
  # Regular users (can see basic info only)
  user:
    allowCreate: false
    allowRead: true
    allowEdit: false
    allowDelete: false
    viewAllRecords: true            # See basic info of all employees
    field_permissions:
      salary:
        readable: false
        editable: false
      performance_rating:
        readable: false
        editable: false
      ssn:
        readable: false
        editable: false
      bank_account:
        readable: false
        editable: false

  # HR team (full access)
  hr:
    allowCreate: true
    allowRead: true
    allowEdit: true
    allowDelete: false              # Can't delete, only deactivate
    viewAllRecords: true
    modifyAllRecords: true
    field_permissions:
      salary:
        readable: true
        editable: true
      performance_rating:
        readable: true
        editable: true
      ssn:
        readable: true
        editable: true
      bank_account:
        readable: true
        editable: true

  # Department managers (can see team members)
  manager:
    allowCreate: false
    allowRead: true
    allowEdit: true
    allowDelete: false
    viewAllRecords: true
    modifyAllRecords: false         # Only edit own team
    field_permissions:
      salary:
        readable: true              # Can see salaries
        editable: false             # But can't edit
      performance_rating:
        readable: true
        editable: true              # Can rate performance
      ssn:
        readable: false
        editable: false
      bank_account:
        readable: false
        editable: false

  # Payroll team
  payroll:
    allowCreate: false
    allowRead: true
    allowEdit: true
    allowDelete: false
    viewAllRecords: true
    field_permissions:
      salary:
        readable: true
        editable: false             # View only
      bank_account:
        readable: true
        editable: true              # Can update bank info
      ssn:
        readable: true              # Need for tax purposes
        editable: false
      performance_rating:
        readable: false
        editable: false

  # Admin
  admin:
    allowCreate: true
    allowRead: true
    allowEdit: true
    allowDelete: true
    viewAllRecords: true
    modifyAllRecords: true
```

## Dynamic Permissions with Triggers | 使用触发器的动态权限

For complex permission logic, use triggers:

对于复杂的权限逻辑,使用触发器:

```javascript
// triggers/contracts.trigger.js
module.exports = {
  listenTo: 'contracts',

  beforeUpdate: async function() {
    const { doc, previousDoc, userId } = this;
    const userObj = this.getObject('users');
    const user = await userObj.findOne(userId);

    // Only contract owner or admin can change status
    if (doc.status !== previousDoc.status) {
      if (previousDoc.owner !== userId && !user.is_admin) {
        throw new Error('Only contract owner or admin can change status');
      }
    }

    // Can't modify signed contracts (except admin)
    if (previousDoc.status === 'signed' && !user.is_admin) {
      throw new Error('Signed contracts cannot be modified');
    }

    // Finance approval required for amounts over $100k
    if (doc.amount > 100000 && doc.status === 'approved') {
      if (!user.roles.includes('finance') && !user.is_admin) {
        throw new Error('Finance approval required for amounts over $100,000');
      }
    }
  }
};
```

## Permission Best Practices | 权限最佳实践

### 1. Principle of Least Privilege | 最小权限原则

```yaml
# Good - minimal necessary permissions
permission_set:
  user:
    allowCreate: true
    allowRead: true
    allowEdit: true                 # Only what's needed
    allowDelete: false              # No delete for regular users
    viewAllRecords: false
    modifyAllRecords: false

# Bad - too permissive
permission_set:
  user:
    allowCreate: true
    allowRead: true
    allowEdit: true
    allowDelete: true               # Risky
    modifyAllRecords: true          # Too much access
```

### 2. Protect Sensitive Fields | 保护敏感字段

```yaml
# Good - restrict sensitive data
field_permissions:
  salary:
    readable: false
    editable: false
  ssn:
    readable: false
    editable: false

# Bad - no field restrictions
# (all fields visible to all users)
```

### 3. Use Appropriate Permission Sets | 使用适当的权限集

```yaml
# Good - specific permission sets for roles
permission_set:
  user:
    # Regular users
  manager:
    # Department managers
  hr:
    # HR team
  admin:
    # Administrators

# Bad - only user and admin
# (no middle ground)
```

### 4. Enable Sharing for Collaboration | 启用共享以协作

```yaml
# Good - enable sharing for collaborative objects
enable_share: true
permission_set:
  user:
    viewAllRecords: false           # Users can share specific records
```

### 5. Document Permission Logic | 记录权限逻辑

```yaml
# Good - add comments
permission_set:
  # Sales team - can create and edit own customers
  sales:
    allowCreate: true
    allowRead: true
    allowEdit: true
    allowDelete: false
    viewAllRecords: false
    modifyAllRecords: false

  # Sales managers - can view and edit all customers
  sales_manager:
    allowCreate: true
    allowRead: true
    allowEdit: true
    allowDelete: false
    viewAllRecords: true
    modifyAllRecords: true
```

## Permission Debugging | 权限调试

### Check User Permissions | 检查用户权限

```javascript
// In browser console or action
const { Creator } = require('@steedos/core');
const userId = Creator.USER_CONTEXT.userId;
const spaceId = Creator.USER_CONTEXT.spaceId;

// Get user
const user = Creator.getCollection('users').findOne(userId);
console.log('User:', user);

// Get user permissions for object
const objectPermissions = Creator.getPermissions('customers', spaceId, userId);
console.log('Permissions:', objectPermissions);

// Check specific permission
console.log('Can create:', objectPermissions.allowCreate);
console.log('Can edit:', objectPermissions.allowEdit);
console.log('Can view all:', objectPermissions.viewAllRecords);
```

### Test Permission Scenarios | 测试权限场景

1. Log in as different user types
2. Try create/edit/delete operations
3. Check field visibility
4. Test record visibility
5. Verify sharing works correctly

## Troubleshooting | 故障排除

### Can't See Records | 看不到记录

1. Check `allowRead` is true
2. Verify `viewAllRecords` or ownership
3. Check record owner
4. Review sharing rules
5. Check space membership

### Can't Edit Records | 无法编辑记录

1. Check `allowEdit` is true
2. Verify `modifyAllRecords` or ownership
3. Check record is not locked
4. Review field permissions
5. Check triggers for validation

### Can't See Fields | 看不到字段

1. Check `field_permissions.readable`
2. Verify field is not `hidden`
3. Check field is not `omit`
4. Review user permission set
5. Check field group visibility

### Permission Changes Not Applied | 权限更改未生效

1. Restart server
2. Clear browser cache
3. Log out and log back in
4. Check YAML syntax
5. Review server logs

## References | 参考资料

- [05-objects.md](./05-objects.md) - Object definitions
- [06-object-fields.md](./06-object-fields.md) - Field types
- [10-object-triggers.md](./10-object-triggers.md) - Triggers for validation
- [Steedos Security Documentation](https://docs.steedos.com/)
