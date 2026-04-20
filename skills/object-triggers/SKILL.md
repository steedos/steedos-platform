---
name: object-triggers
description: |
  Create server-side JavaScript triggers that execute automatically on data
  changes. Triggers are .trigger.yml files in main/default/triggers/ folder
  with inline handler code. Covers trigger lifecycle hooks (beforeInsert,
  afterInsert, beforeUpdate, afterUpdate, beforeDelete, afterDelete), context
  variables (ctx.params.doc, ctx.params.previousDoc, ctx.params.id), objects
  API, global utilities, and returning doc changes. Includes examples for
  validation, auto-fill, cascade operations, and external integration.
---
# Steedos Object Triggers | Steedos 对象触发器

## Overview | 概述

Triggers are server-side JavaScript functions that execute automatically when data changes occur. They are defined as `.trigger.yml` files with inline handler code. Triggers enable data validation, automation, notifications, and integration with external systems.

触发器是在数据更改时自动执行的服务端 JavaScript 函数。使用 `.trigger.yml` 文件定义，包含内联的 handler 代码。

## File Location | 文件位置

**IMPORTANT**: Triggers must be in the `triggers/` folder, NOT inside object folders!

**重要**: 触发器必须放在 `triggers/` 文件夹中，而不是对象文件夹内！

```
steedos-packages/
└── my-package/
    └── main/default/
        ├── objects/
        │   └── orders/
        │       └── orders.object.yml
        └── triggers/
            ├── orders_validate.trigger.yml
            ├── orders_auto_fill.trigger.yml
            └── customers_cascade.trigger.yml
```

## Trigger Structure | 触发器结构

```yaml
# triggers/orders_validate.trigger.yml
name: orders_validate
listenTo: orders
when:
  - beforeInsert
  - beforeUpdate
isEnabled: true
type: code
locked: false
handler: |-
  const { doc } = ctx.params;
  const { _ } = global;

  if (doc.amount && doc.amount <= 0) {
    throw new Error('Order amount must be greater than 0');
  }

  return { doc };
```

## Trigger Properties | 触发器属性

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `name` | string | Yes | Unique trigger name |
| `listenTo` | string | Yes | Object API name to listen to |
| `when` | array | Yes | Array of event hooks |
| `isEnabled` | boolean | Yes | Enable/disable trigger |
| `type` | string | Yes | Always `code` |
| `locked` | boolean | No | Lock from editing |
| `handler` | string | Yes | Inline JavaScript (YAML block scalar `|-`) |

### Event Hooks (`when`) | 事件钩子

Complete list of valid values:

```yaml
when:
  - beforeInsert      # Before record creation
  - afterInsert       # After record creation
  - beforeUpdate      # Before record update
  - afterUpdate       # After record update
  - beforeDelete      # Before record deletion
  - afterDelete       # After record deletion
  - beforeFind        # Before query
  - afterFind         # After query
  - afterFindOne      # After findOne query
  - afterCount        # After count query
  - beforeAggregate   # Before aggregation
  - afterAggregate    # After aggregation
```

## Handler Context | Handler 上下文

### ctx.params — Operation Data

```javascript
// beforeInsert / afterInsert
ctx.params.doc          // New document being inserted
ctx.params.isInsert     // true

// beforeUpdate / afterUpdate
ctx.params.id           // Record ID being updated
ctx.params.doc          // New values (partial)
ctx.params.previousDoc  // Original values before update
ctx.params.isUpdate     // true

// beforeDelete / afterDelete
ctx.params.id           // Record ID being deleted
```

### objects — Object API

```javascript
// Find records
const records = await objects.orders.find({
  filters: [['status', '=', 'active']],
  fields: ['name', 'amount'],
  top: 100,
  skip: 0,
  sort: 'created desc'
});

// Find one record
const record = await objects.orders.findOne(id);

// Insert record
const newRecord = await objects.orders.insert(doc);

// Update (triggers other triggers)
await objects.orders.update(id, doc);

// Direct update (bypass triggers)
await objects.orders.directUpdate(id, doc);

// Direct insert (bypass triggers)
await objects.orders.directInsert(doc);

// Delete record
await objects.orders.delete(id);

// Count records
const count = await objects.orders.count({ filters: [...] });
```

### global — Utility Libraries

```javascript
const { _ } = global;        // lodash
const { moment } = global;   // moment.js
const { validator } = global; // validator.js
```

### ctx — User Context

```javascript
ctx.userId       // Current user ID
ctx.spaceId      // Current workspace ID
ctx.getUser(userId, spaceId)  // Get user details
ctx.broker       // Moleculer service broker
```

### Returning Doc Changes | 返回文档变更

In `before*` triggers, return `{ doc: {...} }` to modify the document:

```javascript
// Modify fields before save
return {
  doc: {
    ...ctx.params.doc,
    modified_field: newValue
  }
};
```

## Complete Examples | 完整示例

### Example 1: Data Validation | 数据验证

```yaml
# triggers/orders_validate.trigger.yml
name: orders_validate
listenTo: orders
when:
  - beforeInsert
  - beforeUpdate
isEnabled: true
type: code
locked: false
handler: |-
  const { doc, previousDoc, isInsert, isUpdate } = ctx.params;

  // Validate amount
  if (doc.amount !== undefined && doc.amount <= 0) {
    throw new Error('Order amount must be greater than 0');
  }

  // Validate customer exists
  if (doc.customer) {
    const customer = await objects.customers.findOne(doc.customer);
    if (!customer) {
      throw new Error('Customer not found');
    }
    if (customer.status !== 'active') {
      throw new Error('Customer is not active');
    }
  }

  // Validate status transition (on update)
  if (isUpdate && doc.status && previousDoc) {
    const validTransitions = {
      'draft': ['submitted', 'cancelled'],
      'submitted': ['approved', 'rejected'],
      'approved': ['shipped', 'cancelled'],
      'shipped': ['completed'],
      'completed': [],
      'cancelled': []
    };
    const allowed = validTransitions[previousDoc.status] || [];
    if (!allowed.includes(doc.status)) {
      throw new Error(
        'Invalid status transition from ' + previousDoc.status + ' to ' + doc.status
      );
    }
  }

  return { doc };
```

### Example 2: Auto-Fill Fields | 自动填充字段

```yaml
# triggers/orders_auto_fill.trigger.yml
name: orders_auto_fill
listenTo: orders
when:
  - beforeInsert
isEnabled: true
type: code
locked: false
handler: |-
  const { doc } = ctx.params;

  // Auto-set defaults
  if (!doc.status) {
    doc.status = 'draft';
  }
  if (!doc.order_date) {
    doc.order_date = new Date();
  }

  // Auto-fill customer info
  if (doc.customer) {
    const customer = await objects.customers.findOne(doc.customer);
    if (customer) {
      doc.customer_name = customer.name;
      doc.customer_email = customer.email;
    }
  }

  return { doc };
```

### Example 3: Generate Name from Related Records | 从关联记录生成名称

```yaml
# triggers/order_items_name.trigger.yml
name: order_items_name
listenTo: order_items
when:
  - afterInsert
  - afterUpdate
isEnabled: true
type: code
locked: false
handler: |-
  const { doc, id } = ctx.params;

  // Look up product name
  if (doc.product) {
    const product = await objects.products.findOne(doc.product);
    if (product) {
      const newName = product.name + ' - ' + (doc.quantity || 1);
      await objects.order_items.directUpdate(id, { name: newName });
    }
  }
```

### Example 4: Cascade Operations | 级联操作

```yaml
# triggers/projects_cascade.trigger.yml
name: projects_cascade
listenTo: projects
when:
  - afterUpdate
  - beforeDelete
isEnabled: true
type: code
locked: false
handler: |-
  const { doc, previousDoc, id } = ctx.params;

  // On status change to closed, cancel all open tasks
  if (doc.status === 'closed' && previousDoc && previousDoc.status !== 'closed') {
    const openTasks = await objects.tasks.find({
      filters: [
        ['project', '=', id],
        ['status', '!=', 'completed'],
        ['status', '!=', 'cancelled']
      ]
    });

    for (const task of openTasks) {
      await objects.tasks.directUpdate(task._id, {
        status: 'cancelled',
        cancelled_reason: 'Project closed'
      });
    }
  }

  // Before delete, check for incomplete tasks
  if (ctx.params.isDelete) {
    const incompleteCount = await objects.tasks.count({
      filters: [
        ['project', '=', id],
        ['status', '!=', 'completed'],
        ['status', '!=', 'cancelled']
      ]
    });

    if (incompleteCount > 0) {
      throw new Error(
        'Cannot delete project with ' + incompleteCount + ' incomplete tasks'
      );
    }
  }
```

### Example 5: Initialize Fields on Insert | 插入时初始化字段

```yaml
# triggers/approval_init.trigger.yml
name: approval_init
listenTo: material_approvals
when:
  - beforeInsert
isEnabled: true
type: code
locked: false
handler: |-
  const { doc } = ctx.params;
  const { _ } = global;

  // Set initial approval status
  doc.approval_status = 'pending';
  doc.submitted_at = new Date();

  // Set submitter info
  if (ctx.userId) {
    const user = await ctx.getUser(ctx.userId, ctx.spaceId);
    if (user) {
      doc.submitter_name = user.name;
      doc.submitter_email = user.email;
    }
  }

  return { doc };
```

### Example 6: Notification on Status Change | 状态变更通知

```yaml
# triggers/contracts_notify.trigger.yml
name: contracts_notify
listenTo: contracts
when:
  - afterUpdate
isEnabled: true
type: code
locked: false
handler: |-
  const { doc, previousDoc, id } = ctx.params;

  // Notify on status change
  if (doc.status && previousDoc && doc.status !== previousDoc.status) {
    const fullRecord = await objects.contracts.findOne(id);

    if (fullRecord.owner && fullRecord.owner !== ctx.userId) {
      try {
        await ctx.broker.call('notifications.send', {
          to: fullRecord.owner,
          title: 'Contract Status Updated',
          body: 'Contract "' + fullRecord.name + '" status changed to ' + doc.status,
          url: '/app/contracts/view/' + id,
          from: ctx.userId
        });
      } catch (e) {
        console.error('Failed to send notification:', e.message);
      }
    }
  }
```

## Best Practices | 最佳实践

1. **Use `before*` for validation and auto-fill**, `after*` for side effects (notifications, cascade updates)
2. **Use `directUpdate` in after triggers** to avoid triggering infinite loops
3. **Don't throw errors in `after*` triggers** unless absolutely necessary — the record is already saved
4. **Check for field changes before acting**: Compare `doc` with `previousDoc` to avoid unnecessary operations
5. **Keep triggers focused**: One trigger per concern (validation, auto-fill, notifications)
6. **Handle errors gracefully**: Wrap external API calls in try/catch to prevent blocking record saves
7. **Return `{ doc }` in before triggers**: Always return the modified doc for before events
