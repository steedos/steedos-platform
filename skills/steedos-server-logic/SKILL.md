---
name: steedos-server-logic
description: |
  TRIGGER when: user creates/edits a .trigger.yml or .function.yml file;
  asks how to run server-side JavaScript on record create/update/delete; asks about
  trigger lifecycle hooks (beforeInsert, afterInsert, beforeUpdate, afterUpdate,
  beforeDelete, afterDelete); asks about trigger context (ctx.params.doc,
  ctx.params.previousDoc, ctx.params.id); asks how to validate data, auto-fill
  fields, cascade updates, or call external APIs; asks how to define a server-side
  function callable via REST or from a button; asks about function properties
  (name, objectApiName, is_rest, script, isEnabled) or ctx.input, objects API.
  Trigger files: main/default/triggers/. Function files: main/default/functions/.
  SKIP: button UI — steedos-object-buttons; call existing REST — steedos-server-api;
  object definitions — steedos-objects.
  Server-side JavaScript triggers (.trigger.yml) and functions (.function.yml).
  Triggers fire on data change events. Functions are REST-exposed business logic.
---

# Steedos Server Logic: Triggers & Functions

## File Location | 文件位置

**IMPORTANT**: Triggers and functions must be in their own top-level folders, NOT inside object folders!

```
steedos-packages/
└── my-package/
    └── main/default/
        ├── objects/
        │   └── orders/
        │       └── orders.object.yml
        ├── triggers/
        │   ├── orders_validate.trigger.yml
        │   └── orders_auto_fill.trigger.yml
        └── functions/
            ├── orders_approve_order.function.yml
            └── orders_sync_to_erp.function.yml
```

## Shared Execution Context | 共享执行上下文

Both triggers and functions share the same sandbox variables:

### ctx — Execution Context

```javascript
ctx.params              // Operation data (trigger) or input (function)
ctx.params.userId       // Current user ID
ctx.params.spaceId      // Current workspace ID
ctx.broker              // Moleculer service broker
ctx.getObject(objectApiName) // Get object instance
ctx.getUser(userId, spaceId) // Get user session details
```

### objects — All Steedos Object Instances

```javascript
const records = await objects.orders.find({
  filters: [['status', '=', 'active']],
  fields: ['name', 'amount'],
  top: 100,
  skip: 0,
  sort: 'created desc'
});
const record = await objects.orders.findOne(id);

// Insert (MUST include space)
await objects.orders.insert({ ...doc, space: ctx.params.spaceId });

// Update (triggers other triggers)
await objects.orders.update(id, doc);

// Direct update/insert (bypass triggers)
await objects.orders.directUpdate(id, doc);
await objects.orders.directInsert(doc);

// Delete and count
await objects.orders.delete(id);
const count = await objects.orders.count({ filters: [...] });
```

### npm — Utility Libraries

```javascript
const { _ } = npm;              // lodash
const { moment } = npm;         // moment.js
const { validator } = npm;      // validator.js
const { axios } = npm;          // HTTP client
// Also: filters, formData, mongodb, sequelize
```

`global` is an alias for `npm`.

### db — MongoDB Client Instance

```javascript
db.collection('my_collection').find({}).toArray()
```

### Other Sandbox Variables

```javascript
makeNewID()             // Generate a new MongoDB ObjectId string
services                // Moleculer services registry
```

---

# Part 1: Triggers | 触发器

## Overview | 概述

Triggers are server-side JavaScript functions that execute automatically when data changes occur. They are defined as `.trigger.yml` files with inline handler code.

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

  if (doc.amount && doc.amount <= 0) {
    throw new Error('Order amount must be greater than 0');
  }

  return { doc };
```

## Trigger Properties | 触发器属性

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `name` | string | **Yes** | **⚠️ MUST start with `{listenTo}_` prefix, e.g. `orders_validate`** |
| `listenTo` | string | Yes | Object API name to listen to |
| `when` | array | Yes | **⚠️ MUST only contain values from the Event Hooks list below.** |
| `isEnabled` | boolean | Yes | Enable/disable trigger |
| `type` | string | Yes | **⚠️ MUST be `code`. No other value is valid.** |
| `locked` | boolean | No | Lock from editing |
| `handler` | string | Yes | Inline JavaScript (YAML block scalar `|-`) |

### Event Hooks (`when`) | 事件钩子

**⚠️ CRITICAL: Each value MUST be from the list below. Invalid values cause the trigger to fail silently.**

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

## Trigger ctx.params | 触发器参数

```javascript
// Common (all events)
ctx.params.objectName   // Object API name
ctx.params.userId       // Current user ID
ctx.params.spaceId      // Current workspace ID

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
ctx.params.isDelete     // true

// beforeFind / afterFind
ctx.params.query        // Query parameters
ctx.params.isFind       // true
```

### Returning Doc Changes

In `before*` triggers, return `{ doc: {...} }` to modify the document:

```javascript
return {
  doc: {
    ...ctx.params.doc,
    modified_field: newValue
  }
};
```

## Trigger Examples | 触发器示例

### Data Validation | 数据验证

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

  if (doc.amount !== undefined && doc.amount <= 0) {
    throw new Error('Order amount must be greater than 0');
  }

  if (doc.customer) {
    const customer = await objects.customers.findOne(doc.customer);
    if (!customer) {
      throw new Error('Customer not found');
    }
  }

  // Validate status transition (on update)
  if (isUpdate && doc.status && previousDoc) {
    const validTransitions = {
      'draft': ['submitted', 'cancelled'],
      'submitted': ['approved', 'rejected'],
      'approved': ['shipped', 'cancelled'],
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

### Auto-Fill Fields | 自动填充字段

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

  if (!doc.status) {
    doc.status = 'draft';
  }
  if (!doc.order_date) {
    doc.order_date = new Date();
  }

  if (doc.customer) {
    const customer = await objects.customers.findOne(doc.customer);
    if (customer) {
      doc.customer_name = customer.name;
      doc.customer_email = customer.email;
    }
  }

  return { doc };
```

### Cascade Operations | 级联操作

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

### Notification on Status Change | 状态变更通知

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

  if (doc.status && previousDoc && doc.status !== previousDoc.status) {
    const fullRecord = await objects.contracts.findOne(id);
    if (fullRecord.owner && fullRecord.owner !== ctx.params.userId) {
      try {
        await ctx.broker.call('notifications.send', {
          to: fullRecord.owner,
          title: 'Contract Status Updated',
          body: 'Contract "' + fullRecord.name + '" status changed to ' + doc.status,
          url: '/app/contracts/view/' + id,
          from: ctx.params.userId
        });
      } catch (e) {
        console.error('Failed to send notification:', e.message);
      }
    }
  }
```

---

# Part 2: Functions | 函数

## Overview | 概述

Object functions are server-side JavaScript functions defined as `.function.yml` files. They encapsulate business logic and can be exposed as REST API endpoints, called from buttons, triggers, or other functions.

## Function Structure | 函数结构

```yaml
# functions/orders_approve_order.function.yml
name: orders_approve_order
objectApiName: orders
description: Approve an order and update status
isEnabled: true
is_rest: true
locked: false
script: |-
  const { input } = ctx;

  const record = await objects.orders.findOne(input.id);
  if (!record) {
    throw new Error('Order not found');
  }
  if (record.status !== 'submitted') {
    throw new Error('Only submitted orders can be approved');
  }

  await objects.orders.directUpdate(input.id, {
    status: 'approved',
    approved_at: new Date(),
    approved_by: ctx.params.userId
  });

  return { message: 'Order approved successfully' };
```

## Function Properties | 函数属性

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `name` | string | **Yes** | **⚠️ MUST start with `{objectApiName}_` prefix, e.g. `orders_approve_order`** |
| `objectApiName` | string | Yes | Associated object API name |
| `description` | string | No | Human-readable description |
| `isEnabled` | boolean | Yes | Enable/disable function |
| `is_rest` | boolean | Yes | Expose as REST API endpoint |
| `locked` | boolean | No | Lock from editing |
| `script` | string | Yes | Inline JavaScript code (YAML block scalar `|-`) |

## Function-Specific Context | 函数专用上下文

```javascript
ctx.input                    // Function input parameters (from API body or caller)
```

### API Endpoint | API 端点

When `is_rest: true`, the function is accessible at:
```
POST /api/v6/functions/{objectApiName}/{functionApiName}
GET  /api/v6/functions/{objectApiName}/{functionApiName}
```

**⚠️ The `{functionApiName}` in the URL is the function `name` with the `{objectApiName}_` prefix removed.**

| Function `name` | `objectApiName` | API URL |
|---|---|---|
| `orders_approve_order` | `orders` | `/api/v6/functions/orders/approve_order` |
| `leads_convert_lead` | `leads` | `/api/v6/functions/leads/convert_lead` |

## Function Examples | 函数示例

### External API Integration | 外部 API 集成

```yaml
# functions/orders_sync_to_erp.function.yml
name: orders_sync_to_erp
objectApiName: orders
description: Sync order to external ERP system
isEnabled: true
is_rest: true
locked: false
script: |-
  const { input } = ctx;

  const order = await objects.orders.findOne(input.id);
  if (!order) {
    throw new Error('Order not found');
  }

  const customer = await objects.customers.findOne(order.customer);

  const fetch = require('node-fetch');
  const response = await fetch(process.env.ERP_API_URL + '/orders', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + process.env.ERP_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      order_number: order.order_number,
      customer_name: customer?.name,
      amount: order.total_amount,
      items: order.line_items
    })
  });

  const result = await response.json();

  await objects.orders.directUpdate(input.id, {
    erp_sync_id: result.id,
    erp_sync_status: 'synced',
    erp_synced_at: new Date()
  });

  return { message: 'Synced to ERP', erpId: result.id };
```

### Batch Processing | 批量处理

```yaml
# functions/orders_batch_approve.function.yml
name: orders_batch_approve
objectApiName: orders
description: Approve multiple orders at once
isEnabled: true
is_rest: true
locked: false
script: |-
  const { input } = ctx;
  const { _ } = npm;

  const ids = input.ids;
  if (!ids || !_.isArray(ids) || ids.length === 0) {
    throw new Error('No records selected');
  }

  let successCount = 0;
  let failCount = 0;
  const errors = [];

  for (const id of ids) {
    try {
      const order = await objects.orders.findOne(id);
      if (order && order.status === 'submitted') {
        await objects.orders.directUpdate(id, {
          status: 'approved',
          approved_at: new Date(),
          approved_by: ctx.params.userId
        });
        successCount++;
      } else {
        failCount++;
        errors.push({ id, reason: 'Not in submitted status' });
      }
    } catch (e) {
      failCount++;
      errors.push({ id, reason: e.message });
    }
  }

  return {
    message: `Approved ${successCount} orders, ${failCount} failed`,
    successCount,
    failCount,
    errors
  };
```

### Calling Functions from Buttons | 从按钮调用函数

```yaml
# In a .button.yml amis_schema:
amis_schema: |-
  {
    "type": "service",
    "body": {
      "type": "button",
      "label": "Approve",
      "onEvent": {
        "click": {
          "actions": [
            {
              "actionType": "ajax",
              "api": {
                "url": "/api/v6/functions/orders/approve_order",
                "method": "post",
                "requestAdaptor": "api.data = { id: api.body.recordId }",
                "messages": { "success": "Approved" }
              }
            }
          ]
        }
      }
    }
  }
```

---

## Best Practices | 最佳实践

1. **Always set `space` when inserting records**: Server-side inserts MUST include `space: ctx.params.spaceId`
2. **Use `before*` for validation and auto-fill**, `after*` for side effects (notifications, cascade updates)
3. **Use `directUpdate`/`directInsert` to bypass triggers** and avoid infinite loops
4. **Don't throw errors in `after*` triggers** unless absolutely necessary — the record is already saved
5. **Check for field changes before acting**: Compare `doc` with `previousDoc`
6. **Validate input early** in functions: Check parameters and record existence before processing
7. **Return meaningful results** from functions: Always return an object with a `message`. **⚠️ The API returns the function's return value directly — no wrapping.**
8. **Handle errors with throw**: Use `throw new Error('message')` for validation failures
9. **Keep triggers focused**: One trigger per concern (validation, auto-fill, notifications)
10. **Wrap external API calls in try/catch** to prevent blocking record saves
