---
name: object-buttons
description: |
  Create custom actions and buttons for Steedos objects. Use this skill to
define object actions that appear on record pages or list views, enabling
custom workflows, integrations, and batch operations. Covers action properties
(label, visible, on, todo), display locations (record, list, record_more),
visibility control, user input dialogs, batch operations, API integrations,
and UI interactions. Includes complete examples and best practices.
---
# Steedos Object Actions | Steedos 对象动作

## Overview | 概述

Object actions (custom buttons) allow users to perform operations on records. Actions can be displayed as buttons on record pages or list views, enabling custom workflows, integrations, and batch operations.

对象动作(自定义按钮)允许用户对记录执行操作。动作可以显示为记录页面或列表视图上的按钮,实现自定义工作流、集成和批量操作。

## File Location | 文件位置

```
steedos-packages/
└── my-package/
    └── main/default/
        └── objects/
            ├── orders.object.yml
            └── orders.action.js          # Actions file
```

## Action File Structure | 动作文件结构

```javascript
// objects/orders.action.js
module.exports = {
  action_name: {
    label: 'Button Label',
    label_zh: '按钮标签',
    visible: true,                    // or function
    on: 'record',                     // 'record', 'list', 'record_more'
    todo: async function(object_name, record_id, fields) {
      // Action logic here
    }
  },

  another_action: {
    // Another action definition
  }
};
```

## Action Properties | 动作属性

### Core Properties | 核心属性

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `label` | string | Yes | English button label |
| `label_zh` | string | No | Chinese button label |
| `visible` | boolean/function | No | Show/hide button |
| `on` | string | Yes | Where button appears |
| `todo` | function | Yes | Action function |
| `sort` | number | No | Button display order |

### Display Locations (`on`) | 显示位置

```javascript
// Record detail page (main button area)
on: 'record'

// Record detail page (more actions menu)
on: 'record_more'

// List view (batch operations)
on: 'list'

// List view (more actions menu)
on: 'list_more'

// Record only (without list)
on: 'record_only'
```

### Visibility Control | 可见性控制

```javascript
// Always visible
visible: true

// Always hidden
visible: false

// Conditional visibility (function)
visible: function(object_name, record_id, record, permissions) {
  // Show only for draft orders
  return record.status === 'draft';
}

// Check user permissions
visible: function(object_name, record_id, record, permissions) {
  const { Creator } = require('@steedos/core');
  const userId = Creator.USER_CONTEXT.userId;

  // Show only for record owner or admins
  return record.owner === userId || permissions.modifyAllRecords;
}
```

## Complete Examples | 完整示例

### Example 1: Simple Record Action | 简单记录动作

```javascript
// objects/orders.action.js
module.exports = {
  // Submit order for approval
  submit_order: {
    label: 'Submit for Approval',
    label_zh: '提交审批',

    // Show only for draft orders
    visible: function(object_name, record_id, record) {
      return record.status === 'draft';
    },

    on: 'record',

    todo: async function(object_name, record_id, fields) {
      try {
        // Update order status
        await this.getObject(object_name).directUpdate(record_id, {
          status: 'submitted',
          submitted_at: new Date(),
          submitted_by: Steedos.userId()
        });

        // Show success message
        toastr.success('Order submitted successfully');

        // Reload page
        FlowRouter.reload();
      } catch (error) {
        toastr.error('Failed to submit: ' + error.message);
      }
    }
  }
};
```

### Example 2: Action with Confirmation | 带确认的动作

```javascript
// objects/orders.action.js
module.exports = {
  // Cancel order with confirmation
  cancel_order: {
    label: 'Cancel Order',
    label_zh: '取消订单',

    visible: function(object_name, record_id, record) {
      // Show only for orders that can be cancelled
      return ['draft', 'submitted'].includes(record.status);
    },

    on: 'record',

    todo: async function(object_name, record_id, fields) {
      // Show confirmation dialog
      const confirmed = await swal({
        title: 'Cancel Order',
        text: 'Are you sure you want to cancel this order? This cannot be undone.',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, cancel it',
        cancelButtonText: 'No, keep it',
        confirmButtonColor: '#d33'
      });

      if (confirmed) {
        try {
          const { Creator } = require('@steedos/core');
          const userId = Creator.USER_CONTEXT.userId;

          await this.getObject(object_name).directUpdate(record_id, {
            status: 'cancelled',
            cancelled_at: new Date(),
            cancelled_by: userId
          });

          toastr.success('Order cancelled');
          FlowRouter.reload();
        } catch (error) {
          toastr.error('Failed to cancel: ' + error.message);
        }
      }
    }
  }
};
```

### Example 3: Action with User Input | 带用户输入的动作

```javascript
// objects/orders.action.js
module.exports = {
  // Add notes to order
  add_notes: {
    label: 'Add Notes',
    label_zh: '添加备注',
    visible: true,
    on: 'record',

    todo: async function(object_name, record_id, fields) {
      // Prompt for notes
      const result = await swal({
        title: 'Add Notes',
        input: 'textarea',
        inputPlaceholder: 'Enter your notes here...',
        showCancelButton: true,
        confirmButtonText: 'Save',
        cancelButtonText: 'Cancel',
        inputValidator: (value) => {
          if (!value) {
            return 'Please enter some notes';
          }
        }
      });

      if (result) {
        try {
          const { Creator } = require('@steedos/core');
          const userId = Creator.USER_CONTEXT.userId;
          const userInfo = Creator.getCollection('users').findOne(userId);

          // Get current record
          const record = await this.getObject(object_name).findOne(record_id);

          // Append new notes
          const timestamp = new Date().toLocaleString();
          const newNote = `[${timestamp}] ${userInfo.name}: ${result}`;
          const updatedNotes = record.notes
            ? `${record.notes}\n${newNote}`
            : newNote;

          await this.getObject(object_name).directUpdate(record_id, {
            notes: updatedNotes
          });

          toastr.success('Notes added');
          FlowRouter.reload();
        } catch (error) {
          toastr.error('Failed to add notes: ' + error.message);
        }
      }
    }
  }
};
```

### Example 4: Batch List Action | 批量列表动作

```javascript
// objects/orders.action.js
module.exports = {
  // Batch approve orders
  batch_approve: {
    label: 'Approve Selected',
    label_zh: '批量审批',
    visible: true,
    on: 'list',

    todo: async function(object_name, record_ids) {
      if (!record_ids || record_ids.length === 0) {
        toastr.warning('Please select at least one order');
        return;
      }

      // Confirm action
      const confirmed = await swal({
        title: 'Batch Approve',
        text: `Approve ${record_ids.length} selected order(s)?`,
        type: 'question',
        showCancelButton: true,
        confirmButtonText: 'Approve',
        cancelButtonText: 'Cancel'
      });

      if (confirmed) {
        const { Creator } = require('@steedos/core');
        const userId = Creator.USER_CONTEXT.userId;

        let successCount = 0;
        let failCount = 0;

        for (const id of record_ids) {
          try {
            await this.getObject(object_name).directUpdate(id, {
              status: 'approved',
              approved_by: userId,
              approved_at: new Date()
            });
            successCount++;
          } catch (error) {
            console.error('Failed to approve order:', id, error);
            failCount++;
          }
        }

        if (successCount > 0) {
          toastr.success(`${successCount} order(s) approved`);
        }
        if (failCount > 0) {
          toastr.warning(`${failCount} order(s) failed`);
        }

        FlowRouter.reload();
      }
    }
  }
};
```

### Example 5: Export to PDF | 导出PDF

```javascript
// objects/invoices.action.js
module.exports = {
  // Export invoice to PDF
  export_pdf: {
    label: 'Export PDF',
    label_zh: '导出PDF',
    visible: true,
    on: 'record',

    todo: async function(object_name, record_id, fields) {
      try {
        // Open PDF in new window
        const url = Steedos.absoluteUrl(`/api/pdf/invoices/${record_id}`);
        window.open(url, '_blank');

        toastr.info('Generating PDF...');
      } catch (error) {
        toastr.error('Failed to export: ' + error.message);
      }
    }
  },

  // Download invoice as Excel
  export_excel: {
    label: 'Export Excel',
    label_zh: '导出Excel',
    visible: true,
    on: 'record',

    todo: async function(object_name, record_id) {
      try {
        const url = Steedos.absoluteUrl(`/api/export/invoices/${record_id}/excel`);
        window.location.href = url;

        toastr.info('Downloading Excel file...');
      } catch (error) {
        toastr.error('Failed to export: ' + error.message);
      }
    }
  }
};
```

### Example 6: Call External API | 调用外部API

```javascript
// objects/customers.action.js
module.exports = {
  // Sync customer to ERP system
  sync_to_erp: {
    label: 'Sync to ERP',
    label_zh: '同步到ERP',

    visible: function(object_name, record_id, record) {
      // Show only for approved customers without ERP ID
      return record.status === 'approved' && !record.erp_id;
    },

    on: 'record',

    todo: async function(object_name, record_id) {
      try {
        toastr.info('Syncing to ERP...');

        // Call backend API
        const result = await Steedos.authRequest(
          `/api/integrations/erp/sync/customer/${record_id}`,
          { method: 'POST' }
        );

        if (result.success) {
          toastr.success('Customer synced successfully');
          FlowRouter.reload();
        } else {
          toastr.error('Sync failed: ' + result.message);
        }
      } catch (error) {
        toastr.error('Sync failed: ' + error.message);
      }
    }
  },

  // Pull data from external CRM
  pull_from_crm: {
    label: 'Pull from CRM',
    label_zh: '从CRM拉取',
    visible: true,
    on: 'record',

    todo: async function(object_name, record_id, fields) {
      const { crm_id } = fields;

      if (!crm_id) {
        toastr.warning('No CRM ID specified');
        return;
      }

      try {
        toastr.info('Pulling data from CRM...');

        const result = await Steedos.authRequest(
          `/api/integrations/crm/pull/customer/${crm_id}`,
          { method: 'POST' }
        );

        if (result.success) {
          // Update record with pulled data
          await this.getObject(object_name).directUpdate(record_id, result.data);

          toastr.success('Data pulled successfully');
          FlowRouter.reload();
        } else {
          toastr.error('Pull failed: ' + result.message);
        }
      } catch (error) {
        toastr.error('Pull failed: ' + error.message);
      }
    }
  }
};
```

### Example 7: Open Modal/Dialog | 打开弹窗

```javascript
// objects/projects.action.js
module.exports = {
  // Assign team members
  assign_team: {
    label: 'Assign Team',
    label_zh: '分配团队',
    visible: true,
    on: 'record',

    todo: async function(object_name, record_id, fields) {
      // Show modal with custom form
      Modal.show('AssignTeamModal', {
        projectId: record_id,
        projectName: fields.name,
        onAssign: async function(selectedUsers) {
          try {
            await this.getObject(object_name).directUpdate(record_id, {
              team_members: selectedUsers
            });

            toastr.success('Team assigned');
            FlowRouter.reload();
          } catch (error) {
            toastr.error('Failed to assign: ' + error.message);
          }
        }
      });
    }
  },

  // Schedule meeting
  schedule_meeting: {
    label: 'Schedule Meeting',
    label_zh: '安排会议',
    visible: true,
    on: 'record',

    todo: async function(object_name, record_id, fields) {
      // Navigate to meeting creation page with pre-filled data
      FlowRouter.go('/app/meetings/new', {}, {
        related_to: record_id,
        subject: `Meeting about ${fields.name}`
      });
    }
  }
};
```

### Example 8: Complex Workflow | 复杂工作流

```javascript
// objects/contracts.action.js
module.exports = {
  // Start approval process
  start_approval: {
    label: 'Start Approval',
    label_zh: '发起审批',

    visible: function(object_name, record_id, record) {
      return record.status === 'draft' && !record.approval_id;
    },

    on: 'record',

    todo: async function(object_name, record_id, fields) {
      try {
        // Validate contract data
        if (!fields.amount || fields.amount <= 0) {
          toastr.error('Contract amount is required');
          return;
        }

        if (!fields.customer) {
          toastr.error('Customer is required');
          return;
        }

        // Determine approval flow based on amount
        let approvalFlow;
        if (fields.amount < 10000) {
          approvalFlow = 'contract_approval_small';
        } else if (fields.amount < 100000) {
          approvalFlow = 'contract_approval_medium';
        } else {
          approvalFlow = 'contract_approval_large';
        }

        toastr.info('Starting approval process...');

        // Start approval workflow
        const result = await Steedos.authRequest(
          '/api/workflow/start',
          {
            method: 'POST',
            body: JSON.stringify({
              flow: approvalFlow,
              object_name: object_name,
              record_id: record_id
            })
          }
        );

        if (result.success) {
          // Update contract status
          await this.getObject(object_name).directUpdate(record_id, {
            status: 'pending_approval',
            approval_id: result.approval_id,
            approval_started_at: new Date()
          });

          toastr.success('Approval process started');
          FlowRouter.reload();
        } else {
          toastr.error('Failed to start approval: ' + result.message);
        }
      } catch (error) {
        toastr.error('Error: ' + error.message);
      }
    }
  }
};
```

## Action Function Parameters | 动作函数参数

### Record Actions | 记录动作

```javascript
todo: async function(object_name, record_id, fields) {
  // object_name: string - Object API name
  // record_id: string - Record ID
  // fields: object - Current record field values

  console.log('Object:', object_name);
  console.log('Record ID:', record_id);
  console.log('Fields:', fields);
}
```

### List Actions | 列表动作

```javascript
todo: async function(object_name, record_ids) {
  // object_name: string - Object API name
  // record_ids: array - Selected record IDs

  console.log('Object:', object_name);
  console.log('Selected IDs:', record_ids);
  console.log('Count:', record_ids.length);
}
```

## Available Methods and Objects | 可用方法和对象

### Get Object Instance | 获取对象实例

```javascript
// Get object
const obj = this.getObject('customers');

// Update record
await obj.directUpdate(record_id, { status: 'active' });

// Insert record
await obj.insert({ name: 'New Customer' });

// Delete record
await obj.delete(record_id);

// Find records
const records = await obj.find({ filters: [['status', '=', 'active']] });
```

### User Context | 用户上下文

```javascript
const { Creator } = require('@steedos/core');

// Current user ID
const userId = Creator.USER_CONTEXT.userId;

// Current space ID
const spaceId = Creator.USER_CONTEXT.spaceId;

// Get user info
const user = Creator.getCollection('users').findOne(userId);
console.log('User:', user.name, user.email);
```

### API Requests | API请求

```javascript
// Authenticated request
const result = await Steedos.authRequest(
  '/api/custom/endpoint',
  {
    method: 'POST',
    body: JSON.stringify({ data: 'value' })
  }
);

// Get absolute URL
const url = Steedos.absoluteUrl('/api/reports/download');
```

### UI Interactions | UI交互

```javascript
// Toast notifications
toastr.success('Success message');
toastr.error('Error message');
toastr.info('Info message');
toastr.warning('Warning message');

// Confirmation dialog
const confirmed = await swal({
  title: 'Confirm',
  text: 'Are you sure?',
  type: 'warning',
  showCancelButton: true,
  confirmButtonText: 'Yes',
  cancelButtonText: 'No'
});

// Input dialog
const value = await swal({
  title: 'Enter value',
  input: 'text',  // or 'textarea', 'select', 'email', etc.
  showCancelButton: true,
  inputValidator: (value) => {
    if (!value) return 'Value is required';
  }
});

// Page reload
FlowRouter.reload();

// Page navigation
FlowRouter.go('/app/customers/view/' + record_id);
```

## Best Practices | 最佳实践

### 1. Error Handling | 错误处理

```javascript
// Good - proper error handling
todo: async function(object_name, record_id) {
  try {
    await this.performAction();
    toastr.success('Action completed');
    FlowRouter.reload();
  } catch (error) {
    console.error('Action failed:', error);
    toastr.error('Failed: ' + error.message);
  }
}
```

### 2. User Feedback | 用户反馈

```javascript
// Good - inform user of progress
todo: async function(object_name, record_id) {
  toastr.info('Processing...');

  try {
    await this.longRunningOperation();
    toastr.success('Completed successfully');
  } catch (error) {
    toastr.error('Failed: ' + error.message);
  }
}
```

### 3. Validation | 验证

```javascript
// Good - validate before action
todo: async function(object_name, record_id, fields) {
  // Validate required data
  if (!fields.customer) {
    toastr.error('Customer is required');
    return;
  }

  if (fields.amount <= 0) {
    toastr.error('Amount must be greater than 0');
    return;
  }

  // Proceed with action
  await this.performAction();
}
```

### 4. Confirmations | 确认操作

```javascript
// Good - confirm destructive actions
todo: async function(object_name, record_id) {
  const confirmed = await swal({
    title: 'Delete Record',
    text: 'This cannot be undone',
    type: 'warning',
    showCancelButton: true
  });

  if (confirmed) {
    await this.deleteRecord();
  }
}
```

### 5. Bilingual Labels | 双语标签

```javascript
// Good - provide both English and Chinese
{
  label: 'Approve',
  label_zh: '审批'
}

// Bad - only one language
{
  label: 'Approve'
}
```

## Troubleshooting | 故障排除

### Action Button Not Appearing | 按钮未显示

1. Check `visible` condition
2. Verify user permissions
3. Check `on` property matches page type
4. Review action file location
5. Restart server

### Action Not Working | 动作无效

1. Check browser console for errors
2. Verify `todo` function syntax
3. Check API endpoints exist
4. Review server logs
5. Test with try-catch blocks

### Permission Errors | 权限错误

1. Check user has permission to modify records
2. Verify API permissions
3. Review object permission sets
4. Check field-level permissions

## References | 参考资料

- [05-objects.md](./05-objects.md) - Object definitions
- [10-object-triggers.md](./10-object-triggers.md) - Server-side triggers
- [09-object-permissions.md](./09-object-permissions.md) - Permissions
- [Steedos Actions Documentation](https://docs.steedos.com/)
