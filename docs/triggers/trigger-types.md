# 触发器类型和使用场景

## 概述

触发器 (Trigger) 是在数据操作前后自动执行的服务端代码，用于实现业务逻辑、数据验证、自动化流程等功能。

## 触发器类型

### Before 触发器（操作前）

在数据库操作之前执行，可以：
- 验证数据
- 修改即将保存的数据
- 阻止不合法的操作

### After 触发器（操作后）

在数据库操作之后执行，可以：
- 执行关联操作
- 发送通知
- 同步数据到其他系统

## 触发器事件

| 事件 | 触发时机 | 主要用途 |
|------|----------|----------|
| beforeInsert | 插入记录前 | 数据验证、自动填充字段 |
| afterInsert | 插入记录后 | 创建关联记录、发送通知 |
| beforeUpdate | 更新记录前 | 验证变更、记录审计 |
| afterUpdate | 更新记录后 | 同步数据、触发工作流 |
| beforeDelete | 删除记录前 | 检查依赖、阻止删除 |
| afterDelete | 删除记录后 | 清理关联数据 |
| beforeFind | 查询记录前 | 修改查询条件 |
| afterFind | 查询记录后 | 过滤结果、补充数据 |

## 使用场景

### 1. 数据验证

#### 场景：验证订单金额必须大于0

```javascript
module.exports = {
  listenTo: 'sales_orders',
  
  beforeInsert: async function() {
    const { doc } = this;
    
    if (doc.amount <= 0) {
      throw new Error('订单金额必须大于0');
    }
  },
  
  beforeUpdate: async function() {
    const { doc } = this;
    
    if (doc.amount !== undefined && doc.amount <= 0) {
      throw new Error('订单金额必须大于0');
    }
  }
};
```

#### 场景：验证日期逻辑

```javascript
module.exports = {
  listenTo: 'projects',
  
  beforeInsert: async function() {
    const { doc } = this;
    
    if (doc.end_date < doc.start_date) {
      throw new Error('结束日期不能早于开始日期');
    }
  },
  
  beforeUpdate: async function() {
    const { doc, previousDoc } = this;
    
    const startDate = doc.start_date || previousDoc.start_date;
    const endDate = doc.end_date || previousDoc.end_date;
    
    if (endDate < startDate) {
      throw new Error('结束日期不能早于开始日期');
    }
  }
};
```

### 2. 自动填充字段

#### 场景：自动生成编号

```javascript
module.exports = {
  listenTo: 'sales_orders',
  
  beforeInsert: async function() {
    const { doc } = this;
    
    if (!doc.order_number) {
      // 生成订单号：SO-20240101-0001
      const date = new Date();
      const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
      
      // 查询当天最大编号
      const lastOrder = await this.getObject('sales_orders').find({
        filters: [['order_number', 'startswith', `SO-${dateStr}`]],
        sort: 'order_number desc',
        top: 1
      });
      
      let sequence = 1;
      if (lastOrder.length > 0) {
        const lastNumber = lastOrder[0].order_number.split('-')[2];
        sequence = parseInt(lastNumber) + 1;
      }
      
      doc.order_number = `SO-${dateStr}-${sequence.toString().padStart(4, '0')}`;
    }
  }
};
```

#### 场景：计算字段值

```javascript
module.exports = {
  listenTo: 'sales_orders',
  
  beforeInsert: async function() {
    const { doc } = this;
    
    // 计算总金额 = 小计 + 税额
    doc.total_amount = (doc.subtotal || 0) + (doc.tax || 0);
  },
  
  beforeUpdate: async function() {
    const { doc, previousDoc } = this;
    
    // 如果小计或税额变更，重新计算总金额
    if (doc.subtotal !== undefined || doc.tax !== undefined) {
      const subtotal = doc.subtotal !== undefined ? doc.subtotal : previousDoc.subtotal;
      const tax = doc.tax !== undefined ? doc.tax : previousDoc.tax;
      doc.total_amount = subtotal + tax;
    }
  }
};
```

### 3. 状态转换控制

#### 场景：限制状态变更路径

```javascript
module.exports = {
  listenTo: 'sales_orders',
  
  beforeUpdate: async function() {
    const { doc, previousDoc } = this;
    
    // 只有状态变更时才验证
    if (doc.status && doc.status !== previousDoc.status) {
      const validTransitions = {
        'draft': ['submitted', 'cancelled'],
        'submitted': ['approved', 'rejected'],
        'approved': ['completed', 'cancelled'],
        'rejected': [],
        'completed': [],
        'cancelled': []
      };
      
      const allowedNext = validTransitions[previousDoc.status] || [];
      
      if (!allowedNext.includes(doc.status)) {
        throw new Error(
          `不能从 ${previousDoc.status} 变更为 ${doc.status}`
        );
      }
    }
  }
};
```

### 4. 权限控制

#### 场景：只有创建人可以删除

```javascript
module.exports = {
  listenTo: 'documents',
  
  beforeDelete: async function() {
    const { previousDoc, userId } = this;
    
    if (previousDoc.created_by !== userId) {
      throw new Error('只有创建人可以删除此文档');
    }
  }
};
```

#### 场景：特定角色才能修改关键字段

```javascript
module.exports = {
  listenTo: 'sales_orders',
  
  beforeUpdate: async function() {
    const { doc, previousDoc, userId, spaceId } = this;
    
    // 如果折扣变更，检查权限
    if (doc.discount !== undefined && doc.discount !== previousDoc.discount) {
      const user = await this.getUser(userId, spaceId);
      
      if (!user.roles.includes('sales_manager')) {
        throw new Error('只有销售经理可以修改折扣');
      }
    }
  }
};
```

### 5. 创建关联记录

#### 场景：创建客户时自动创建默认联系人

```javascript
module.exports = {
  listenTo: 'accounts',
  
  afterInsert: async function() {
    const { doc, id } = this;
    
    // 创建默认联系人
    await this.getObject('contacts').insert({
      name: `${doc.name} - 主要联系人`,
      account: id,
      is_primary: true
    });
  }
};
```

#### 场景：订单完成后创建发票

```javascript
module.exports = {
  listenTo: 'sales_orders',
  
  afterUpdate: async function() {
    const { doc, previousDoc, id } = this;
    
    // 订单状态变为"已完成"时创建发票
    if (doc.status === 'completed' && previousDoc.status !== 'completed') {
      await this.getObject('invoices').insert({
        order: id,
        order_number: doc.order_number,
        amount: doc.total_amount,
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30天后
        status: 'pending'
      });
    }
  }
};
```

### 6. 同步数据

#### 场景：客户信息变更时同步到联系人

```javascript
module.exports = {
  listenTo: 'accounts',
  
  afterUpdate: async function() {
    const { doc, previousDoc, id } = this;
    
    // 如果行业变更，更新所有关联联系人的行业字段
    if (doc.industry && doc.industry !== previousDoc.industry) {
      const contacts = await this.getObject('contacts').find({
        filters: [['account', '=', id]]
      });
      
      for (const contact of contacts) {
        await this.getObject('contacts').update(contact._id, {
          account_industry: doc.industry
        });
      }
    }
  }
};
```

### 7. 发送通知

#### 场景：任务分配时通知负责人

```javascript
module.exports = {
  listenTo: 'tasks',
  
  afterInsert: async function() {
    const { doc, id } = this;
    
    // 发送通知给负责人
    await this.broker.call('notifications.send', {
      to: doc.assigned_to,
      title: '新任务分配',
      message: `您有一个新任务：${doc.name}`,
      link: `/app/tasks/${id}`
    });
  },
  
  afterUpdate: async function() {
    const { doc, previousDoc, id } = this;
    
    // 负责人变更时通知新负责人
    if (doc.assigned_to && doc.assigned_to !== previousDoc.assigned_to) {
      await this.broker.call('notifications.send', {
        to: doc.assigned_to,
        title: '任务转交',
        message: `任务"${doc.name}"已转交给您`,
        link: `/app/tasks/${id}`
      });
    }
  }
};
```

### 8. 审计日志

#### 场景：记录重要字段的变更历史

```javascript
module.exports = {
  listenTo: 'contracts',
  
  afterUpdate: async function() {
    const { doc, previousDoc, id, userId } = this;
    
    // 监控的重要字段
    const auditFields = ['amount', 'status', 'expiry_date'];
    
    for (const field of auditFields) {
      if (doc[field] !== undefined && doc[field] !== previousDoc[field]) {
        // 记录变更
        await this.getObject('audit_logs').insert({
          object_name: 'contracts',
          record_id: id,
          field_name: field,
          old_value: previousDoc[field],
          new_value: doc[field],
          changed_by: userId,
          changed_at: new Date()
        });
      }
    }
  }
};
```

### 9. 检查依赖关系

#### 场景：删除前检查是否有关联记录

```javascript
module.exports = {
  listenTo: 'accounts',
  
  beforeDelete: async function() {
    const { id } = this;
    
    // 检查是否有关联的联系人
    const contactCount = await this.getObject('contacts').count({
      filters: [['account', '=', id]]
    });
    
    if (contactCount > 0) {
      throw new Error(`此客户有 ${contactCount} 个关联联系人，无法删除`);
    }
    
    // 检查是否有关联的订单
    const orderCount = await this.getObject('sales_orders').count({
      filters: [['account', '=', id]]
    });
    
    if (orderCount > 0) {
      throw new Error(`此客户有 ${orderCount} 个关联订单，无法删除`);
    }
  }
};
```

### 10. 数据清理

#### 场景：删除记录后清理关联数据

```javascript
module.exports = {
  listenTo: 'accounts',
  
  afterDelete: async function() {
    const { id } = this;
    
    // 删除关联的联系人（如果配置为级联删除）
    const contacts = await this.getObject('contacts').find({
      filters: [['account', '=', id]]
    });
    
    for (const contact of contacts) {
      await this.getObject('contacts').delete(contact._id);
    }
    
    // 删除关联的附件
    await this.broker.call('files.deleteByRecord', {
      recordId: id
    });
  }
};
```

### 11. 汇总计算

#### 场景：订单变更时更新客户的订单总额

```javascript
module.exports = {
  listenTo: 'sales_orders',
  
  afterInsert: async function() {
    await this.updateAccountTotals(this.doc.account);
  },
  
  afterUpdate: async function() {
    const { doc, previousDoc } = this;
    
    // 如果金额或客户变更，更新相关客户的总额
    if (doc.amount !== previousDoc.amount || doc.account !== previousDoc.account) {
      await this.updateAccountTotals(doc.account);
      
      if (doc.account !== previousDoc.account) {
        await this.updateAccountTotals(previousDoc.account);
      }
    }
  },
  
  afterDelete: async function() {
    await this.updateAccountTotals(this.previousDoc.account);
  },
  
  // 辅助方法
  updateAccountTotals: async function(accountId) {
    if (!accountId) return;
    
    // 计算该客户的订单总额
    const result = await this.getObject('sales_orders').aggregate({
      filters: [
        ['account', '=', accountId],
        ['status', '!=', 'cancelled']
      ]
    }, [
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    
    const totalAmount = result[0]?.total || 0;
    
    // 更新客户记录
    await this.getObject('accounts').update(accountId, {
      total_order_amount: totalAmount
    });
  }
};
```

### 12. 数据同步到外部系统

#### 场景：订单创建后同步到 ERP 系统

```javascript
module.exports = {
  listenTo: 'sales_orders',
  
  afterInsert: async function() {
    const { doc, id } = this;
    
    try {
      // 调用 ERP API
      const response = await this.broker.call('erp.createOrder', {
        order_number: doc.order_number,
        customer_code: doc.customer_code,
        amount: doc.total_amount,
        items: doc.items
      });
      
      // 保存 ERP 系统返回的 ID
      await this.getObject('sales_orders').update(id, {
        erp_id: response.id,
        sync_status: 'synced',
        synced_at: new Date()
      });
    } catch (error) {
      // 记录同步失败
      await this.getObject('sales_orders').update(id, {
        sync_status: 'failed',
        sync_error: error.message
      });
    }
  }
};
```

## 最佳实践

### 1. 保持触发器简单

- 触发器应该只包含核心逻辑
- 复杂操作应该封装到服务中
- 避免在触发器中进行大量计算

### 2. 避免无限循环

```javascript
// ❌ 错误：可能导致无限循环
module.exports = {
  afterUpdate: async function() {
    const { id } = this;
    await this.getObject('sales_orders').update(id, {
      modified: new Date()  // 这会再次触发 afterUpdate
    });
  }
};

// ✅ 正确：使用标志避免循环
module.exports = {
  afterUpdate: async function() {
    const { id, doc } = this;
    
    if (!doc._skipTrigger) {
      await this.getObject('sales_orders').update(id, {
        modified: new Date(),
        _skipTrigger: true
      });
    }
  }
};
```

### 3. 处理错误

```javascript
module.exports = {
  afterInsert: async function() {
    const { doc, id } = this;
    
    try {
      // 可能失败的操作
      await sendNotification(doc.owner);
    } catch (error) {
      // 记录错误但不阻断流程
      console.error('发送通知失败:', error);
    }
  }
};
```

### 4. 使用事务保证一致性

对于需要保证数据一致性的操作，应该使用事务。

### 5. 文档化触发器逻辑

```javascript
/**
 * 订单触发器
 * 
 * beforeInsert:
 * - 验证订单金额
 * - 生成订单号
 * 
 * afterInsert:
 * - 创建发票
 * - 发送通知
 * 
 * beforeUpdate:
 * - 验证状态转换
 * 
 * afterUpdate:
 * - 更新客户总额
 * - 同步到 ERP
 */
module.exports = {
  listenTo: 'sales_orders',
  // ...
};
```

## 相关文档

- [触发器概述](./README.md)
- [触发器上下文](./trigger-context.md)
- [ObjectQL 查询](../objectql/)
- [对象元数据](../metadata/object-metadata.md)
