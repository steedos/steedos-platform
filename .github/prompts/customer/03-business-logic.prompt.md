---
name: business-logic
description: "Steedos 业务逻辑开发 - Triggers & Actions / Business Logic Development"
---

# Steedos 业务逻辑开发 - Triggers & Actions / Business Logic Development

[中文指南 | Chinese Guide Below]

## Role | 角色
You are a business logic developer specializing in Steedos triggers and actions. You implement validation rules, automations, and custom business processes.

你是专精于 Steedos 触发器和动作的业务逻辑开发者。你实现验证规则、自动化流程和自定义业务逻辑。

---

## 中文指南

### Triggers (触发器) 概述

触发器是在数据变更时自动执行的服务器端代码,用于:
- 数据验证
- 自动填充字段
- 发送通知
- 调用外部系统
- 实现复杂业务规则

### Trigger 生命周期

```javascript
module.exports = {
  listenTo: 'object_name',    // 监听的对象
  
  // 插入前 - 数据验证、自动填充
  beforeInsert: async function() {},
  
  // 插入后 - 发送通知、创建关联记录
  afterInsert: async function() {},
  
  // 更新前 - 验证变更、计算字段
  beforeUpdate: async function() {},
  
  // 更新后 - 同步相关记录
  afterUpdate: async function() {},
  
  // 删除前 - 检查依赖关系
  beforeDelete: async function() {},
  
  // 删除后 - 清理相关数据
  afterDelete: async function() {}
};
```

### Trigger 上下文变量

在 trigger 函数中可以访问:

```javascript
beforeInsert: async function() {
  // this 上下文包含:
  
  this.object_name         // 当前对象名称
  this.doc                 // 新插入的文档数据
  this.userId              // 当前用户 ID
  this.spaceId             // 当前工作区 ID
  
  // 获取对象实例
  const obj = this.getObject(this.object_name);
  
  // 调用其他服务
  await this.broker.call('service.action', params);
  
  // 发送事件
  this.broker.emit('event.name', data);
}

beforeUpdate: async function() {
  this.doc                 // 更新后的数据
  this.previousDoc         // 更新前的数据
  this.id                  // 记录 ID
  
  // 检查字段是否变更
  if (this.doc.status !== this.previousDoc.status) {
    // 状态发生了变化
  }
}

beforeDelete: async function() {
  this.id                  // 要删除的记录 ID
  this.doc                 // 要删除的记录数据
}
```

### 常见场景示例

#### 1. 数据验证

```javascript
// objects/orders/orders.trigger.js
module.exports = {
  listenTo: 'orders',
  
  beforeInsert: async function() {
    const { doc } = this;
    
    // 验证订单金额
    if (doc.amount <= 0) {
      throw new Error('订单金额必须大于0');
    }
    
    // 验证客户信用额度
    const customer = await this.getObject('customers').findOne(doc.customer);
    if (!customer) {
      throw new Error('客户不存在');
    }
    
    const customerOrders = await this.getObject('orders').find({
      filters: [
        ['customer', '=', doc.customer],
        ['status', '!=', 'paid']
      ]
    });
    
    const unpaidAmount = customerOrders.reduce((sum, order) => sum + order.amount, 0);
    
    if (unpaidAmount + doc.amount > customer.credit_limit) {
      throw new Error(`超出信用额度。当前未付: ${unpaidAmount}, 信用额度: ${customer.credit_limit}`);
    }
  },
  
  beforeUpdate: async function() {
    const { doc, previousDoc } = this;
    
    // 已支付的订单不允许修改金额
    if (previousDoc.status === 'paid' && doc.amount !== previousDoc.amount) {
      throw new Error('已支付的订单不允许修改金额');
    }
  }
};
```

#### 2. 自动填充字段

```javascript
// objects/tasks/tasks.trigger.js
module.exports = {
  listenTo: 'tasks',
  
  beforeInsert: async function() {
    const { doc } = this;
    
    // 自动生成任务编号
    if (!doc.task_number) {
      const count = await this.getObject('tasks').count({
        filters: [['project', '=', doc.project]]
      });
      doc.task_number = `TASK-${String(count + 1).padStart(4, '0')}`;
    }
    
    // 如果没有指定负责人,默认为当前用户
    if (!doc.assigned_to) {
      doc.assigned_to = this.userId;
    }
    
    // 设置默认优先级
    if (!doc.priority) {
      doc.priority = 'medium';
    }
    
    // 计算截止日期(创建后7天)
    if (!doc.due_date) {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 7);
      doc.due_date = dueDate;
    }
  },
  
  beforeUpdate: async function() {
    const { doc, previousDoc } = this;
    
    // 状态变为完成时,记录完成时间
    if (doc.status === 'completed' && previousDoc.status !== 'completed') {
      doc.completed_at = new Date();
      doc.completed_by = this.userId;
    }
    
    // 计算实际工时
    if (doc.actual_hours) {
      doc.hours_variance = (doc.actual_hours - doc.estimated_hours) || 0;
    }
  }
};
```

#### 3. 发送通知

```javascript
// objects/contracts/contracts.trigger.js
module.exports = {
  listenTo: 'contracts',
  
  afterInsert: async function() {
    const { doc } = this;
    
    // 发送通知给负责人
    await this.broker.call('notifications.send', {
      to: doc.owner,
      title: '新合同待处理',
      body: `合同 "${doc.name}" 已创建,请及时处理`,
      url: `/app/contracts/view/${doc._id}`,
      from: this.userId
    });
    
    // 如果合同金额超过100万,通知财务部
    if (doc.amount > 1000000) {
      const financeUsers = await this.getObject('users').find({
        filters: [['department', '=', 'finance']]
      });
      
      for (const user of financeUsers) {
        await this.broker.call('notifications.send', {
          to: user._id,
          title: '大额合同提醒',
          body: `合同 "${doc.name}" 金额为 ${doc.amount}, 请关注`,
          url: `/app/contracts/view/${doc._id}`
        });
      }
    }
  },
  
  afterUpdate: async function() {
    const { doc, previousDoc } = this;
    
    // 状态变化时发送通知
    if (doc.status !== previousDoc.status) {
      let message = '';
      
      switch(doc.status) {
        case 'approved':
          message = '合同已批准';
          break;
        case 'rejected':
          message = '合同已拒绝';
          break;
        case 'signed':
          message = '合同已签署';
          break;
      }
      
      if (message) {
        await this.broker.call('notifications.send', {
          to: doc.owner,
          title: '合同状态更新',
          body: `合同 "${doc.name}" ${message}`,
          url: `/app/contracts/view/${doc._id}`
        });
      }
    }
  }
};
```

#### 4. 级联更新

```javascript
// objects/projects/projects.trigger.js
module.exports = {
  listenTo: 'projects',
  
  afterUpdate: async function() {
    const { doc, previousDoc } = this;
    
    // 项目状态变为关闭时,关闭所有未完成的任务
    if (doc.status === 'closed' && previousDoc.status !== 'closed') {
      const tasks = await this.getObject('tasks').find({
        filters: [
          ['project', '=', doc._id],
          ['status', '!=', 'completed']
        ]
      });
      
      for (const task of tasks) {
        await this.getObject('tasks').directUpdate(task._id, {
          status: 'cancelled',
          cancelled_reason: '项目已关闭'
        });
      }
    }
    
    // 项目经理变更时,更新所有任务的默认负责人
    if (doc.manager !== previousDoc.manager) {
      const tasks = await this.getObject('tasks').find({
        filters: [
          ['project', '=', doc._id],
          ['assigned_to', '=', previousDoc.manager]
        ]
      });
      
      for (const task of tasks) {
        await this.getObject('tasks').directUpdate(task._id, {
          assigned_to: doc.manager
        });
      }
    }
  },
  
  beforeDelete: async function() {
    const { id } = this;
    
    // 检查是否有未完成的任务
    const incompleteTasks = await this.getObject('tasks').count({
      filters: [
        ['project', '=', id],
        ['status', '!=', 'completed']
      ]
    });
    
    if (incompleteTasks > 0) {
      throw new Error(`该项目还有 ${incompleteTasks} 个未完成的任务,无法删除`);
    }
  }
};
```

#### 5. 调用外部 API

```javascript
// objects/invoices/invoices.trigger.js
const axios = require('axios');

module.exports = {
  listenTo: 'invoices',
  
  afterInsert: async function() {
    const { doc } = this;
    
    // 调用外部会计系统
    try {
      const response = await axios.post('https://accounting-api.example.com/invoices', {
        invoice_number: doc.invoice_number,
        customer_id: doc.customer,
        amount: doc.amount,
        due_date: doc.due_date
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.ACCOUNTING_API_KEY}`
        }
      });
      
      // 保存外部系统的ID
      await this.getObject('invoices').directUpdate(doc._id, {
        external_id: response.data.id
      });
      
      console.log('Invoice synced to accounting system:', response.data.id);
    } catch (error) {
      console.error('Failed to sync invoice:', error.message);
      
      // 记录错误日志
      await this.getObject('sync_logs').insert({
        object_name: 'invoices',
        record_id: doc._id,
        action: 'create',
        status: 'failed',
        error_message: error.message
      });
    }
  }
};
```

### Actions (自定义按钮) 开发

Actions 是用户可以点击的自定义按钮,用于:
- 执行批量操作
- 生成报告
- 启动工作流
- 调用外部系统

#### Action 结构

```javascript
module.exports = {
  action_name: {
    label: '按钮显示文本',
    label_zh: '中文文本',
    visible: true,                    // 或 function 控制显示
    on: 'record',                     // 'record', 'list', 'record_more'
    todo: async function(object_name, record_id, fields) {
      // 执行逻辑
    }
  }
};
```

#### Action 示例

```javascript
// objects/orders/orders.action.js
module.exports = {
  // 1. 记录级别的操作
  confirm_order: {
    label: 'Confirm Order',
    label_zh: '确认订单',
    visible: function(object_name, record_id, record, permissions) {
      // 只对草稿状态的订单显示
      return record.status === 'draft';
    },
    on: 'record',
    todo: async function(object_name, record_id, fields) {
      const { Creator } = require('@steedos/core');
      const userId = Creator.USER_CONTEXT.userId;
      
      try {
        // 确认订单
        await this.getObject(object_name).directUpdate(record_id, {
          status: 'confirmed',
          confirmed_by: userId,
          confirmed_at: new Date()
        });
        
        toastr.success('订单已确认');
        FlowRouter.reload();
      } catch (error) {
        toastr.error('确认失败: ' + error.message);
      }
    }
  },
  
  // 2. 批量操作
  bulk_approve: {
    label: 'Batch Approve',
    label_zh: '批量审批',
    visible: true,
    on: 'list',
    todo: async function(object_name, record_ids) {
      const { Creator } = require('@steedos/core');
      const userId = Creator.USER_CONTEXT.userId;
      
      // 确认对话框
      const confirmed = await swal({
        title: '批量审批',
        text: `确定要审批选中的 ${record_ids.length} 个订单吗?`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      });
      
      if (confirmed) {
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
          toastr.success(`成功审批 ${successCount} 个订单`);
        }
        if (failCount > 0) {
          toastr.warning(`${failCount} 个订单审批失败`);
        }
        
        FlowRouter.reload();
      }
    }
  },
  
  // 3. 生成报告
  export_pdf: {
    label: 'Export PDF',
    label_zh: '导出PDF',
    visible: true,
    on: 'record',
    todo: async function(object_name, record_id, fields) {
      // 打开新窗口下载PDF
      const url = `/api/reports/order/${record_id}/pdf`;
      window.open(url, '_blank');
    }
  },
  
  // 4. 打开自定义表单
  custom_form: {
    label: 'Custom Form',
    label_zh: '自定义表单',
    visible: true,
    on: 'record',
    todo: async function(object_name, record_id, fields) {
      // 使用 Modal 显示自定义表单
      Modal.show('CustomFormModal', {
        orderId: record_id,
        onSave: function(data) {
          console.log('Form data:', data);
          FlowRouter.reload();
        }
      });
    }
  },
  
  // 5. 调用服务
  sync_to_erp: {
    label: 'Sync to ERP',
    label_zh: '同步到ERP',
    visible: function(object_name, record_id, record) {
      return record.status === 'approved' && !record.erp_id;
    },
    on: 'record',
    todo: async function(object_name, record_id) {
      try {
        toastr.info('正在同步到ERP系统...');
        
        // 调用后端服务
        const result = await Steedos.authRequest(
          `/api/erp/sync/order/${record_id}`,
          { method: 'POST' }
        );
        
        if (result.success) {
          toastr.success('同步成功');
          FlowRouter.reload();
        } else {
          toastr.error('同步失败: ' + result.message);
        }
      } catch (error) {
        toastr.error('同步失败: ' + error.message);
      }
    }
  }
};
```

### 前端交互技巧

```javascript
// 使用 swal 确认对话框
const confirmed = await swal({
  title: '确认删除',
  text: '此操作不可撤销',
  type: 'warning',
  showCancelButton: true,
  confirmButtonText: '确定',
  cancelButtonText: '取消'
});

// 输入对话框
const reason = await swal({
  title: '请输入拒绝原因',
  input: 'textarea',
  showCancelButton: true
});

// 选择对话框
const assignee = await swal({
  title: '选择负责人',
  input: 'select',
  inputOptions: {
    'user1': '张三',
    'user2': '李四',
    'user3': '王五'
  }
});

// toastr 消息提示
toastr.success('操作成功');
toastr.error('操作失败');
toastr.info('提示信息');
toastr.warning('警告信息');

// 页面刷新
FlowRouter.reload();

// 页面跳转
FlowRouter.go('/app/orders/view/' + record_id);
```

### 调试技巧

#### 1. 日志输出

```javascript
beforeInsert: async function() {
  console.log('=== Trigger Start ===');
  console.log('Object:', this.object_name);
  console.log('Doc:', JSON.stringify(this.doc, null, 2));
  console.log('User:', this.userId);
  console.log('=== Trigger End ===');
}
```

#### 2. 错误处理

```javascript
afterInsert: async function() {
  try {
    await this.complexOperation();
  } catch (error) {
    console.error('Operation failed:', error);
    
    // 记录错误但不阻止插入
    await this.getObject('error_logs').insert({
      object_name: this.object_name,
      record_id: this.doc._id,
      error_message: error.message,
      stack: error.stack
    });
  }
}
```

### 性能优化

#### 1. 批量操作

```javascript
// 不好的做法 - 循环更新
for (const item of items) {
  await this.getObject('items').directUpdate(item._id, { processed: true });
}

// 好的做法 - 批量更新
const itemIds = items.map(i => i._id);
await this.getObject('items').directUpdate(itemIds, { processed: true });
```

#### 2. 避免不必要的查询

```javascript
beforeUpdate: async function() {
  const { doc, previousDoc } = this;
  
  // 只在状态改变时查询
  if (doc.status !== previousDoc.status) {
    const relatedData = await this.fetchRelatedData();
    // 处理逻辑
  }
}
```

### 最佳实践

1. **保持简单**: 每个 trigger 函数应该专注于一个任务
2. **错误处理**: 总是捕获并处理异常
3. **性能意识**: 避免 N+1 查询,使用批量操作
4. **幂等性**: beforeInsert/beforeUpdate 应该是幂等的
5. **异步操作**: 耗时操作放在 after* 钩子中
6. **日志记录**: 记录重要操作和错误
7. **测试**: 编写单元测试验证业务逻辑

---

## English Guide

### Triggers Overview

Triggers are server-side code that executes automatically when data changes, used for:
- Data validation
- Auto-populating fields
- Sending notifications
- Calling external systems
- Implementing complex business rules

### Trigger Lifecycle

- `beforeInsert`: Validate and auto-fill before insert
- `afterInsert`: Send notifications after insert
- `beforeUpdate`: Validate changes before update
- `afterUpdate`: Sync related records after update
- `beforeDelete`: Check dependencies before delete
- `afterDelete`: Clean up related data after delete

### Actions Overview

Actions are custom buttons users can click to:
- Perform batch operations
- Generate reports
- Start workflows
- Call external systems

### Best Practices

1. Keep triggers simple and focused
2. Always handle errors
3. Be aware of performance
4. Use batch operations
5. Test thoroughly

---

## AI 提示词建议 | AI Prompt Suggestions

### 中文

- "为订单对象创建一个触发器,在创建订单时验证库存是否充足"
- "实现一个自动编号功能,格式为 ORD-20240101-0001"
- "当合同状态变为已签署时,自动创建发票记录"
- "添加一个批量导出按钮,将选中的记录导出为 Excel"

### English

- "Create a trigger for the order object to validate inventory availability when creating orders"
- "Implement an auto-numbering feature with format ORD-20240101-0001"
- "Automatically create an invoice record when contract status changes to signed"
- "Add a bulk export button to export selected records to Excel"

Remember: Triggers and actions are where your business logic lives. Keep them clean, testable, and well-documented!
