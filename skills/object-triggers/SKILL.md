---
name: object-triggers
description: |
  Create server-side JavaScript triggers that execute automatically on data
changes. Use this skill for data validation, automation, notifications, and
external system integration. Covers trigger lifecycle hooks (beforeInsert,
afterInsert, beforeUpdate, afterUpdate, beforeDelete, afterDelete), context
variables (doc, previousDoc, userId, spaceId), complete examples for
validation, auto-fill, notifications, cascade operations, and API integration.
Important: triggers must be in main/default/triggers/ folder.
---
# Steedos Object Triggers | Steedos 对象触发器

## Overview | 概述

Triggers are server-side JavaScript functions that execute automatically when data changes occur. They enable data validation, automation, notifications, and integration with external systems.

触发器是在数据更改时自动执行的服务端 JavaScript 函数。它们支持数据验证、自动化、通知和与外部系统的集成。

## File Location | 文件位置

**IMPORTANT**: Triggers must be placed in the `triggers/` folder, NOT inside object folders!

**重要**: 触发器必须放在 `triggers/` 文件夹中,而不是对象文件夹内!

```
steedos-packages/
└── my-package/
    └── main/default/
        ├── objects/
        │   └── orders.object.yml
        └── triggers/                    # Triggers folder
            ├── orders.trigger.js        # Order triggers
            └── customers.trigger.js     # Customer triggers
```

## Trigger File Structure | 触发器文件结构

```javascript
// triggers/orders.trigger.js
"use strict";

module.exports = {
  listenTo: 'orders',                    // Object name (required)

  // Before insert
  beforeInsert: async function() {
    // Validation and auto-fill logic
  },

  // After insert
  afterInsert: async function() {
    // Notifications and related record creation
  },

  // Before update
  beforeUpdate: async function() {
    // Validation and field updates
  },

  // After update
  afterUpdate: async function() {
    // Cascade updates and notifications
  },

  // Before delete
  beforeDelete: async function() {
    // Dependency checks
  },

  // After delete
  afterDelete: async function() {
    // Cleanup and related record deletion
  }
};
```

## Trigger Lifecycle | 触发器生命周期

### Execution Order | 执行顺序

1. **beforeInsert**: Before record creation, validate and auto-fill
2. **afterInsert**: After record created, notify and create related records
3. **beforeUpdate**: Before update, validate changes
4. **afterUpdate**: After update, sync related records
5. **beforeDelete**: Before deletion, check dependencies
6. **afterDelete**: After deletion, cleanup

### When to Use Each Hook | 何时使用各个钩子

| Hook | Use For | Examples |
|------|---------|----------|
| `beforeInsert` | Validation, auto-fill, defaults | Validate email unique, set defaults |
| `afterInsert` | Notifications, create related | Send welcome email, create tasks |
| `beforeUpdate` | Validation, prevent changes | Prevent editing approved records |
| `afterUpdate` | Cascade updates, notifications | Update related totals, notify owner |
| `beforeDelete` | Dependency checks | Prevent delete if has children |
| `afterDelete` | Cleanup | Delete related files, update counts |

## Context Variables | 上下文变量

### Available in All Hooks | 所有钩子中可用

```javascript
beforeInsert: async function() {
  // this.object_name: Object API name
  console.log('Object:', this.object_name);

  // this.userId: Current user ID
  console.log('User:', this.userId);

  // this.spaceId: Current workspace ID
  console.log('Space:', this.spaceId);

  // this.broker: Moleculer broker for service calls
  await this.broker.call('service.action', params);

  // Get object instance
  const obj = this.getObject('object_name');
}
```

### Insert Context | 插入上下文

```javascript
beforeInsert: async function() {
  // this.doc: New document being inserted
  console.log('New doc:', this.doc);

  // Modify document
  this.doc.status = 'draft';
  this.doc.created_by = this.userId;
}

afterInsert: async function() {
  // this.doc: Inserted document (with _id)
  console.log('Inserted doc ID:', this.doc._id);
}
```

### Update Context | 更新上下文

```javascript
beforeUpdate: async function() {
  // this.id: Record ID being updated
  console.log('Record ID:', this.id);

  // this.doc: New values
  console.log('New values:', this.doc);

  // this.previousDoc: Original values before update
  console.log('Old values:', this.previousDoc);

  // Check what changed
  if (this.doc.status !== this.previousDoc.status) {
    console.log('Status changed from', this.previousDoc.status, 'to', this.doc.status);
  }
}

afterUpdate: async function() {
  // Same context as beforeUpdate
  console.log('Update completed for:', this.id);
}
```

### Delete Context | 删除上下文

```javascript
beforeDelete: async function() {
  // this.id: Record ID being deleted
  console.log('Deleting record:', this.id);

  // this.doc: Record being deleted
  console.log('Record data:', this.doc);
}

afterDelete: async function() {
  // Same context as beforeDelete
  console.log('Deleted record:', this.id);
}
```

## Complete Examples | 完整示例

### Example 1: Data Validation | 数据验证

```javascript
// triggers/orders.trigger.js
"use strict";

module.exports = {
  listenTo: 'orders',

  beforeInsert: async function() {
    const { doc } = this;

    // Validation 1: Order amount must be positive
    if (doc.amount <= 0) {
      throw new Error('Order amount must be greater than 0');
    }

    // Validation 2: Validate customer exists and is active
    const customerObj = this.getObject('customers');
    const customer = await customerObj.findOne(doc.customer);

    if (!customer) {
      throw new Error('Customer not found');
    }

    if (customer.status !== 'active') {
      throw new Error('Customer is not active');
    }

    // Validation 3: Check credit limit
    const existingOrders = await this.getObject('orders').find({
      filters: [
        ['customer', '=', doc.customer],
        ['status', 'in', ['pending', 'approved']]
      ]
    });

    const totalPending = existingOrders.reduce((sum, order) => sum + order.amount, 0);

    if (totalPending + doc.amount > customer.credit_limit) {
      throw new Error(
        `Exceeds customer credit limit. ` +
        `Pending: ${totalPending}, ` +
        `Credit limit: ${customer.credit_limit}`
      );
    }

    // Validation 4: Delivery date must be in future
    if (doc.delivery_date) {
      const deliveryDate = new Date(doc.delivery_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (deliveryDate < today) {
        throw new Error('Delivery date must be in the future');
      }
    }

    console.log('[Order Insert] Validation passed:', doc.order_number);
  },

  beforeUpdate: async function() {
    const { doc, previousDoc } = this;

    // Prevent modifying approved orders
    if (previousDoc.status === 'approved' && doc.status === 'approved') {
      if (doc.amount !== previousDoc.amount) {
        throw new Error('Cannot modify amount of approved orders');
      }
    }

    // Prevent changing customer once order is shipped
    if (previousDoc.status === 'shipped') {
      if (doc.customer !== previousDoc.customer) {
        throw new Error('Cannot change customer of shipped orders');
      }
    }

    // Validate status transitions
    const validTransitions = {
      'draft': ['pending', 'cancelled'],
      'pending': ['approved', 'rejected', 'cancelled'],
      'approved': ['shipped', 'cancelled'],
      'shipped': ['completed'],
      'completed': [],
      'cancelled': [],
      'rejected': []
    };

    if (doc.status !== previousDoc.status) {
      const allowed = validTransitions[previousDoc.status] || [];
      if (!allowed.includes(doc.status)) {
        throw new Error(
          `Invalid status transition from ${previousDoc.status} to ${doc.status}`
        );
      }
    }

    console.log('[Order Update] Validation passed:', this.id);
  }
};
```

### Example 2: Auto-Fill Fields | 自动填充字段

```javascript
// triggers/tasks.trigger.js
"use strict";

module.exports = {
  listenTo: 'tasks',

  beforeInsert: async function() {
    const { doc } = this;

    // Auto-generate task number
    if (!doc.task_number) {
      const project = doc.project;
      const count = await this.getObject('tasks').count({
        filters: [['project', '=', project]]
      });
      doc.task_number = `TASK-${String(count + 1).padStart(4, '0')}`;
    }

    // Default assigned user to current user
    if (!doc.assigned_to) {
      doc.assigned_to = this.userId;
    }

    // Set default priority
    if (!doc.priority) {
      doc.priority = 'medium';
    }

    // Calculate due date (7 days from now if not specified)
    if (!doc.due_date) {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 7);
      doc.due_date = dueDate;
    }

    // Set default status
    if (!doc.status) {
      doc.status = 'new';
    }

    // Auto-fill from project
    if (doc.project) {
      const projectObj = this.getObject('projects');
      const project = await projectObj.findOne(doc.project);

      if (project) {
        // Inherit project category
        if (!doc.category) {
          doc.category = project.category;
        }

        // Inherit project tags
        if (!doc.tags || doc.tags.length === 0) {
          doc.tags = project.tags || [];
        }
      }
    }

    console.log('[Task Created] Auto-filled:', doc.task_number);
  },

  beforeUpdate: async function() {
    const { doc, previousDoc } = this;

    // Record completion time
    if (doc.status === 'completed' && previousDoc.status !== 'completed') {
      doc.completed_at = new Date();
      doc.completed_by = this.userId;

      // Calculate actual duration
      if (previousDoc.started_at) {
        const duration = (doc.completed_at - new Date(previousDoc.started_at)) / (1000 * 60 * 60);
        doc.actual_hours = Math.round(duration * 10) / 10;
      }
    }

    // Record start time
    if (doc.status === 'in_progress' && previousDoc.status !== 'in_progress') {
      doc.started_at = new Date();
      doc.started_by = this.userId;
    }

    // Update modified timestamp
    doc.modified_at = new Date();
    doc.modified_by = this.userId;

    console.log('[Task Updated]:', this.id);
  }
};
```

### Example 3: Send Notifications | 发送通知

```javascript
// triggers/contracts.trigger.js
"use strict";

module.exports = {
  listenTo: 'contracts',

  afterInsert: async function() {
    const { doc, userId } = this;

    try {
      // Notify contract owner (if different from creator)
      if (doc.owner && doc.owner !== userId) {
        await this.broker.call('notifications.send', {
          to: doc.owner,
          title: 'New Contract Assigned',
          title_zh: '新合同已分配',
          body: `Contract "${doc.name}" (${doc.contract_number}) has been assigned to you.`,
          body_zh: `合同 "${doc.name}" (${doc.contract_number}) 已分配给您。`,
          url: `/app/contracts/view/${doc._id}`,
          from: userId
        });
      }

      // Notify finance team for high-value contracts
      if (doc.amount > 1000000) {
        const usersObj = this.getObject('users');
        const financeUsers = await usersObj.find({
          filters: [['department', '=', 'finance']]
        });

        for (const user of financeUsers) {
          await this.broker.call('notifications.send', {
            to: user._id,
            title: 'High-Value Contract Alert',
            title_zh: '高价值合同提醒',
            body: `High-value contract "${doc.name}" (${doc.contract_number}) ` +
                  `for ${doc.amount} has been created.`,
            body_zh: `高价值合同 "${doc.name}" (${doc.contract_number}) ` +
                    `金额 ${doc.amount} 已创建。`,
            url: `/app/contracts/view/${doc._id}`
          });
        }
      }

      console.log('[Contract Created] Notifications sent:', doc.contract_number);
    } catch (error) {
      console.error('[Contract Created] Failed to send notifications:', error.message);
    }
  },

  afterUpdate: async function() {
    const { doc, previousDoc } = this;

    try {
      // Notify on status change
      if (doc.status !== previousDoc.status) {
        let message = '';
        let message_zh = '';

        switch(doc.status) {
          case 'approved':
            message = 'Contract has been approved';
            message_zh = '合同已批准';
            break;
          case 'rejected':
            message = 'Contract has been rejected';
            message_zh = '合同已拒绝';
            break;
          case 'signed':
            message = 'Contract has been signed';
            message_zh = '合同已签署';
            break;
          case 'executed':
            message = 'Contract is now being executed';
            message_zh = '合同正在执行';
            break;
          case 'completed':
            message = 'Contract has been completed';
            message_zh = '合同已完成';
            break;
        }

        if (message) {
          await this.broker.call('notifications.send', {
            to: doc.owner,
            title: 'Contract Status Update',
            title_zh: '合同状态更新',
            body: `Contract "${doc.name}" (${doc.contract_number}): ${message}`,
            body_zh: `合同 "${doc.name}" (${doc.contract_number}): ${message_zh}`,
            url: `/app/contracts/view/${doc._id}`
          });
        }
      }

      // Notify on owner change
      if (doc.owner !== previousDoc.owner) {
        await this.broker.call('notifications.send', {
          to: doc.owner,
          title: 'Contract Reassigned',
          title_zh: '合同已重新分配',
          body: `Contract "${doc.name}" (${doc.contract_number}) has been assigned to you.`,
          body_zh: `合同 "${doc.name}" (${doc.contract_number}) 已分配给您。`,
          url: `/app/contracts/view/${doc._id}`
        });
      }

      console.log('[Contract Updated] Notifications sent:', doc.contract_number);
    } catch (error) {
      console.error('[Contract Updated] Failed to send notifications:', error.message);
    }
  }
};
```

### Example 4: Cascade Operations | 级联操作

```javascript
// triggers/projects.trigger.js
"use strict";

module.exports = {
  listenTo: 'projects',

  afterUpdate: async function() {
    const { doc, previousDoc } = this;

    // When project status changes to closed, close all open tasks
    if (doc.status === 'closed' && previousDoc.status !== 'closed') {
      try {
        const tasksObj = this.getObject('tasks');
        const openTasks = await tasksObj.find({
          filters: [
            ['project', '=', doc._id],
            ['status', 'notin', ['completed', 'cancelled']]
          ]
        });

        console.log(`[Project Closed] Closing ${openTasks.length} open tasks`);

        for (const task of openTasks) {
          await tasksObj.directUpdate(task._id, {
            status: 'cancelled',
            cancelled_reason: 'Project closed',
            cancelled_at: new Date(),
            cancelled_by: this.userId
          });
        }

        console.log('[Project Closed] All tasks closed');
      } catch (error) {
        console.error('[Project Closed] Failed to close tasks:', error.message);
      }
    }

    // When project manager changes, reassign unassigned tasks
    if (doc.manager !== previousDoc.manager) {
      try {
        const tasksObj = this.getObject('tasks');
        const unassignedTasks = await tasksObj.find({
          filters: [
            ['project', '=', doc._id],
            ['assigned_to', '=', previousDoc.manager]
          ]
        });

        console.log(`[Project Manager Changed] Reassigning ${unassignedTasks.length} tasks`);

        for (const task of unassignedTasks) {
          await tasksObj.directUpdate(task._id, {
            assigned_to: doc.manager
          });
        }

        console.log('[Project Manager Changed] Tasks reassigned');
      } catch (error) {
        console.error('[Project Manager Changed] Failed to reassign tasks:', error.message);
      }
    }

    // Update project progress based on tasks
    try {
      const tasksObj = this.getObject('tasks');
      const allTasks = await tasksObj.find({
        filters: [['project', '=', doc._id]]
      });

      const completedTasks = allTasks.filter(t => t.status === 'completed').length;
      const progress = allTasks.length > 0 ? Math.round((completedTasks / allTasks.length) * 100) : 0;

      if (progress !== doc.progress) {
        await this.getObject('projects').directUpdate(doc._id, {
          progress: progress,
          completed_tasks: completedTasks,
          total_tasks: allTasks.length
        });

        console.log('[Project Progress] Updated:', progress + '%');
      }
    } catch (error) {
      console.error('[Project Progress] Failed to update:', error.message);
    }
  },

  beforeDelete: async function() {
    const { id, doc } = this;

    // Check if project has incomplete tasks
    const tasksObj = this.getObject('tasks');
    const incompleteTasks = await tasksObj.count({
      filters: [
        ['project', '=', id],
        ['status', 'notin', ['completed', 'cancelled']]
      ]
    });

    if (incompleteTasks > 0) {
      throw new Error(
        `Cannot delete project. It has ${incompleteTasks} incomplete task(s). ` +
        `Please complete or cancel all tasks first.`
      );
    }

    // Check if project has time entries
    const timeEntriesObj = this.getObject('time_entries');
    const timeEntries = await timeEntriesObj.count({
      filters: [['project', '=', id]]
    });

    if (timeEntries > 0) {
      throw new Error(
        `Cannot delete project. It has ${timeEntries} time entry/entries. ` +
        `Please remove time entries first.`
      );
    }

    console.log('[Project Delete] Validation passed:', doc.name);
  },

  afterDelete: async function() {
    const { id } = this;

    try {
      // Delete all completed/cancelled tasks
      const tasksObj = this.getObject('tasks');
      const tasks = await tasksObj.find({
        filters: [['project', '=', id]]
      });

      for (const task of tasks) {
        await tasksObj.delete(task._id);
      }

      console.log('[Project Deleted] Cleaned up', tasks.length, 'tasks');
    } catch (error) {
      console.error('[Project Deleted] Failed to cleanup:', error.message);
    }
  }
};
```

### Example 5: External API Integration | 外部API集成

```javascript
// triggers/invoices.trigger.js
"use strict";
const axios = require('axios');

module.exports = {
  listenTo: 'invoices',

  afterInsert: async function() {
    const { doc } = this;

    // Sync to accounting system
    try {
      console.log('[Invoice Created] Syncing to accounting system:', doc.invoice_number);

      const response = await axios.post(
        process.env.ACCOUNTING_API_URL + '/invoices',
        {
          invoice_number: doc.invoice_number,
          customer_id: doc.customer,
          amount: doc.amount,
          tax_amount: doc.tax_amount,
          due_date: doc.due_date,
          items: doc.line_items || []
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.ACCOUNTING_API_KEY}`,
            'Content-Type': 'application/json'
          },
          timeout: 10000
        }
      );

      // Save external ID
      await this.getObject('invoices').directUpdate(doc._id, {
        external_id: response.data.id,
        sync_status: 'synced',
        synced_at: new Date()
      });

      console.log('[Invoice Created] Synced successfully:', response.data.id);
    } catch (error) {
      console.error('[Invoice Created] Sync failed:', error.message);

      // Log error
      await this.getObject('sync_logs').insert({
        object_name: 'invoices',
        record_id: doc._id,
        action: 'create',
        status: 'failed',
        error_message: error.message,
        error_stack: error.stack,
        created_at: new Date()
      });

      // Update sync status
      await this.getObject('invoices').directUpdate(doc._id, {
        sync_status: 'failed',
        sync_error: error.message
      });
    }
  },

  afterUpdate: async function() {
    const { doc, previousDoc } = this;

    // Only sync if amount or status changed
    if (doc.amount === previousDoc.amount && doc.status === previousDoc.status) {
      return;
    }

    if (!doc.external_id) {
      console.log('[Invoice Update] No external ID, skipping sync');
      return;
    }

    try {
      console.log('[Invoice Updated] Syncing to accounting system:', doc.invoice_number);

      await axios.put(
        process.env.ACCOUNTING_API_URL + '/invoices/' + doc.external_id,
        {
          amount: doc.amount,
          tax_amount: doc.tax_amount,
          status: doc.status,
          due_date: doc.due_date
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.ACCOUNTING_API_KEY}`,
            'Content-Type': 'application/json'
          },
          timeout: 10000
        }
      );

      await this.getObject('invoices').directUpdate(doc._id, {
        sync_status: 'synced',
        synced_at: new Date()
      });

      console.log('[Invoice Updated] Synced successfully');
    } catch (error) {
      console.error('[Invoice Updated] Sync failed:', error.message);

      await this.getObject('invoices').directUpdate(doc._id, {
        sync_status: 'failed',
        sync_error: error.message
      });
    }
  }
};
```

## Useful Patterns | 常用模式

### Pattern 1: Unique Field Validation | 唯一字段验证

```javascript
beforeInsert: async function() {
  const { doc } = this;

  // Check email uniqueness
  const existing = await this.getObject('users').count({
    filters: [['email', '=', doc.email]]
  });

  if (existing > 0) {
    throw new Error('Email already exists');
  }
}
```

### Pattern 2: Conditional Required Fields | 条件必填字段

```javascript
beforeInsert: async function() {
  const { doc } = this;

  // Require approval_notes when rejecting
  if (doc.status === 'rejected' && !doc.approval_notes) {
    throw new Error('Approval notes required when rejecting');
  }

  // Require tracking_number when shipped
  if (doc.status === 'shipped' && !doc.tracking_number) {
    throw new Error('Tracking number required for shipped orders');
  }
}
```

### Pattern 3: Calculate Rollup Summary | 计算汇总

```javascript
afterInsert: async function() {
  const { doc } = this;

  // Update customer total orders count
  if (doc.customer) {
    const count = await this.getObject('orders').count({
      filters: [['customer', '=', doc.customer]]
    });

    await this.getObject('customers').directUpdate(doc.customer, {
      total_orders: count
    });
  }
}
```

### Pattern 4: Audit Trail | 审计追踪

```javascript
afterUpdate: async function() {
  const { doc, previousDoc, userId } = this;

  // Log significant changes
  if (doc.status !== previousDoc.status) {
    await this.getObject('audit_logs').insert({
      object_name: 'orders',
      record_id: doc._id,
      field_name: 'status',
      old_value: previousDoc.status,
      new_value: doc.status,
      changed_by: userId,
      changed_at: new Date()
    });
  }
}
```

### Pattern 5: Prevent Deletion with Dependencies | 防止删除有依赖的记录

```javascript
beforeDelete: async function() {
  const { id } = this;

  // Check for dependent records
  const orderCount = await this.getObject('orders').count({
    filters: [['customer', '=', id]]
  });

  if (orderCount > 0) {
    throw new Error(`Cannot delete customer with ${orderCount} order(s)`);
  }
}
```

## Best Practices | 最佳实践

### 1. Keep Triggers Simple | 保持触发器简单

```javascript
// Good - focused, single responsibility
beforeInsert: async function() {
  // Only validation
  if (this.doc.amount <= 0) {
    throw new Error('Amount must be positive');
  }
}

// Bad - too complex, multiple responsibilities
beforeInsert: async function() {
  // Validation + calculation + API call + notification
  // (split into multiple functions)
}
```

### 2. Handle Errors Gracefully | 优雅处理错误

```javascript
// Good - try/catch with logging
afterInsert: async function() {
  try {
    await this.sendNotification();
  } catch (error) {
    console.error('Notification failed:', error);
    // Don't throw - allow insert to complete
  }
}

// Bad - unhandled error blocks operation
afterInsert: async function() {
  await this.sendNotification();  // If fails, insert fails
}
```

### 3. Use before* for Validation | 使用 before* 进行验证

```javascript
// Good - validate in beforeInsert
beforeInsert: async function() {
  if (!this.doc.email) {
    throw new Error('Email required');
  }
}

// Bad - validate in afterInsert (too late)
afterInsert: async function() {
  if (!this.doc.email) {
    throw new Error('Email required');  // Already inserted!
  }
}
```

### 4. Use after* for Side Effects | 使用 after* 处理副作用

```javascript
// Good - notifications in afterInsert
afterInsert: async function() {
  await this.sendWelcomeEmail();
}

// Bad - notifications in beforeInsert
beforeInsert: async function() {
  await this.sendWelcomeEmail();  // Don't send before record exists
}
```

### 5. Provide Clear Error Messages | 提供清晰的错误信息

```javascript
// Good - descriptive, bilingual
throw new Error('Order amount exceeds customer credit limit. ' +
                'Please contact finance for approval. ' +
                '订单金额超过客户信用额度。请联系财务部门批准。');

// Bad - vague
throw new Error('Invalid amount');
```

### 6. Log Important Operations | 记录重要操作

```javascript
beforeInsert: async function() {
  console.log('[Order Create] Validating:', this.doc.order_number);
  // ... validation logic
  console.log('[Order Create] Validation passed');
}
```

## Performance Tips | 性能提示

### 1. Avoid N+1 Queries | 避免 N+1 查询

```javascript
// Good - batch query
const customerIds = docs.map(d => d.customer);
const customers = await this.getObject('customers').find({
  filters: [['_id', 'in', customerIds]]
});

// Bad - query in loop
for (const doc of docs) {
  const customer = await this.getObject('customers').findOne(doc.customer);
}
```

### 2. Use directUpdate for Performance | 使用 directUpdate 提高性能

```javascript
// Good - bypass triggers
await obj.directUpdate(id, { count: 10 });

// Bad - triggers other triggers
await obj.update(id, { count: 10 });
```

### 3. Limit Query Results | 限制查询结果

```javascript
// Good - limit results
const recent = await obj.find({
  filters: [['created', '>=', lastWeek]],
  top: 100
});

// Bad - fetch all
const all = await obj.find({
  filters: [['created', '>=', lastWeek]]
});
```

## Troubleshooting | 故障排除

### Trigger Not Firing | 触发器未触发

1. Check file location (must be in `triggers/` folder)
2. Verify `listenTo` matches object name
3. Check file naming: `{object}.trigger.js`
4. Restart server
5. Check server logs for errors

### Validation Not Working | 验证无效

1. Use `beforeInsert`/`beforeUpdate` (not after)
2. Throw `Error` objects
3. Check error messages in UI
4. Review server logs

### Performance Issues | 性能问题

1. Reduce database queries
2. Use `directUpdate` when appropriate
3. Avoid complex calculations
4. Consider async jobs for slow operations
5. Add database indexes

## References | 参考资料

- [05-objects.md](./05-objects.md) - Object definitions
- [06-object-fields.md](./06-object-fields.md) - Field types
- [07-object-buttons.md](./07-object-buttons.md) - Custom actions
- [09-object-permissions.md](./09-object-permissions.md) - Permissions
- [Steedos Triggers Documentation](https://docs.steedos.com/)
