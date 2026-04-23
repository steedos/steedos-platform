---
name: steedos-object-functions
description: |
  Define server-side JavaScript functions for Steedos objects using YAML.
  Functions are callable via REST API or from buttons/triggers. Covers
  function definition (.function.yml files in main/default/functions/),
  inline script with ctx/objects/global context, REST API exposure,
  calling from amis_button schemas, and examples for CRUD operations,
  data processing, and external API integration.
---
# Steedos Object Functions | Steedos 对象函数

## Overview | 概述

Object functions are server-side JavaScript functions defined as `.function.yml` files. They encapsulate business logic and can be exposed as REST API endpoints, called from buttons, triggers, or other functions.

对象函数是定义为 `.function.yml` 文件的服务端 JavaScript 函数。它们封装业务逻辑，可以作为 REST API 端点暴露，从按钮、触发器或其他函数调用。

## File Location | 文件位置

```
steedos-packages/
└── my-package/
    └── main/default/
        └── functions/
            ├── approve_order.function.yml
            ├── cancel_order.function.yml
            └── sync_to_erp.function.yml
```

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
  const { _ } = npm;

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
| `name` | string | **Yes** | **⚠️ MUST NOT be omitted. MUST start with `{objectApiName}_` prefix, e.g. `orders_approve_order`** |
| `objectApiName` | string | Yes | Associated object API name |
| `description` | string | No | Human-readable description |
| `isEnabled` | boolean | Yes | Enable/disable function |
| `is_rest` | boolean | Yes | Expose as REST API endpoint |
| `locked` | boolean | No | Lock from editing |
| `script` | string | Yes | Inline JavaScript code (YAML block scalar `|-`) |

## Script Context | 脚本上下文

### Available Variables | 可用变量

```javascript
// ctx: { input, params, broker, getObject, getUser }
ctx.input                    // Function input parameters (from API body or caller)
ctx.params.userId            // Current user ID
ctx.params.spaceId           // Current workspace ID
ctx.broker                   // Moleculer service broker
ctx.getObject(objectApiName) // Get object instance
ctx.getUser(userId, spaceId) // Get user session details

// objects - All Steedos object instances
objects.orders.findOne(id)
objects.orders.find({ filters, fields, top, skip, sort })
objects.orders.insert(doc)   // doc MUST include `space: ctx.params.spaceId`
objects.orders.update(id, doc)
objects.orders.directUpdate(id, doc)  // Bypass triggers
objects.orders.directInsert(doc)      // Bypass triggers
objects.orders.delete(id)
objects.orders.count({ filters })

// db - MongoDB client instance (for raw queries)
db.collection('my_collection').find({}).toArray()

// npm: { _, moment, validator, filters, axios, formData, mongodb, sequelize }
npm._              // lodash
npm.moment         // moment.js (date library)
npm.validator      // validator.js
npm.filters        // @steedos/filters
npm.axios          // HTTP client
npm.formData       // form-data
npm.mongodb        // MongoDB driver
npm.sequelize      // Sequelize ORM
```

### API Endpoint | API 端点

When `is_rest: true`, the function is accessible at:
```
POST /api/v6/functions/{objectApiName}/{functionApiName}
GET  /api/v6/functions/{objectApiName}/{functionApiName}
```

**⚠️ The `{functionApiName}` in the URL is the function `name` with the `{objectApiName}_` prefix removed.**

Example:
| Function `name` | `objectApiName` | API URL |
|---|---|---|
| `orders_approve_order` | `orders` | `/api/v6/functions/orders/approve_order` |
| `leads_convert_lead` | `leads` | `/api/v6/functions/leads/convert_lead` |

## Complete Examples | 完整示例

### Example 1: Simple Status Update | 简单状态更新

```yaml
# functions/orders_submit_order.function.yml
name: orders_submit_order
objectApiName: orders
description: Submit order for approval
isEnabled: true
is_rest: true
locked: false
script: |-
  const { input } = ctx;

  const record = await objects.orders.findOne(input.id);
  if (!record) {
    throw new Error('Order not found');
  }
  if (record.status !== 'draft') {
    throw new Error('Only draft orders can be submitted');
  }
  if (!record.customer) {
    throw new Error('Customer is required');
  }

  await objects.orders.directUpdate(input.id, {
    status: 'submitted',
    submitted_at: new Date(),
    submitted_by: ctx.params.userId
  });

  return { message: 'Order submitted for approval' };
```

### Example 2: Complex Business Logic | 复杂业务逻辑

```yaml
# functions/km_updates_adopt_update.function.yml
name: km_updates_adopt_update
objectApiName: km_updates
description: Adopt a knowledge management update into materials
isEnabled: true
is_rest: true
locked: false
script: |-
  const { input } = ctx;
  const { _ } = npm;

  const update = await objects.km_updates.findOne(input.id);
  if (!update) {
    throw new Error('Update record not found');
  }

  // Find related material
  const material = await objects.materials.findOne(update.material_id);
  if (!material) {
    throw new Error('Related material not found');
  }

  // Copy fields from update to material
  const updateData = {
    name: update.name,
    description: update.description,
    category: update.category,
    status: 'active',
    updated_from: input.id,
    adopted_at: new Date(),
    adopted_by: ctx.params.userId
  };

  await objects.materials.directUpdate(material._id, updateData);

  // Mark update as adopted
  await objects.km_updates.directUpdate(input.id, {
    status: 'adopted',
    adopted_at: new Date()
  });

  return { message: 'Update adopted successfully', materialId: material._id };
```

### Example 3: Soft Delete | 软删除

```yaml
# functions/km_updates_trash_record.function.yml
name: km_updates_trash_record
objectApiName: km_updates
description: Mark record as trashed instead of deleting
isEnabled: true
is_rest: true
locked: false
script: |-
  const { input } = ctx;

  const record = await objects.km_updates.findOne(input.id);
  if (!record) {
    throw new Error('Record not found');
  }

  await objects.km_updates.directUpdate(input.id, {
    is_deleted: true,
    deleted_at: new Date(),
    deleted_by: ctx.params.userId
  });

  return { message: 'Record moved to trash' };
```

### Example 4: External API Integration | 外部 API 集成

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

### Example 5: Batch Processing | 批量处理

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

## Calling Functions from Buttons | 从按钮调用函数

Functions with `is_rest: true` can be called from `amis_button` schemas:

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

## Best Practices | 最佳实践

1. **Always set `space` when inserting records**: Server-side inserts MUST include `space: ctx.params.spaceId`, otherwise the record will fail or be invisible:
   ```javascript
   await objects.orders.insert({ ...doc, space: ctx.params.spaceId });
   await objects.orders.directInsert({ ...doc, space: ctx.params.spaceId });
   ```
2. **Use `directUpdate`/`directInsert` when appropriate**: These bypass triggers to avoid infinite loops when updating related records
3. **Validate input early**: Check `input` parameters and record existence before processing
4. **Return meaningful results**: Always return an object with a `message` and relevant data
5. **Handle errors with throw**: Use `throw new Error('message')` for validation failures - the platform returns appropriate HTTP error responses
6. **Access user context**: Use `ctx.params.userId` and `ctx.getUser()` for permission checks
7. **Use npm utilities**: `const { _, moment, axios } = npm;` gives you lodash, moment, axios, etc.
