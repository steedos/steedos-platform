# 触发器上下文详细说明

## 概述

触发器函数在执行时可以访问丰富的上下文信息，包括记录数据、用户信息、对象实例等。理解这些上下文对象是编写高效触发器的关键。

## 上下文属性 (this)

在触发器函数中，`this` 对象包含以下属性：

### 基本属性

| 属性 | 类型 | 说明 | 可用事件 |
|------|------|------|----------|
| userId | String | 当前用户 ID | 所有事件 |
| spaceId | String | 当前工作区 ID | 所有事件 |
| objectName | String | 当前对象名称 | 所有事件 |
| id | String | 记录 ID | 除 beforeInsert 外的所有事件 |
| doc | Object | 当前记录内容 | Insert/Update 事件 |
| previousDoc | Object | 操作前的记录内容 | Update/Delete 的 after 事件 |

### 事件标志

| 属性 | 类型 | 说明 |
|------|------|------|
| isInsert | Boolean | 是否为插入操作 |
| isUpdate | Boolean | 是否为更新操作 |
| isDelete | Boolean | 是否为删除操作 |
| isFind | Boolean | 是否为查询操作 |
| isBefore | Boolean | 是否为 before 事件 |
| isAfter | Boolean | 是否为 after 事件 |

### 查询相关

| 属性 | 类型 | 说明 | 可用事件 |
|------|------|------|----------|
| query | Object | 查询参数 | beforeFind |
| data | Array | 查询结果 | afterFind |

## Context 对象 (ctx)

触发器函数接收一个 `ctx` 参数，包含：

```javascript
module.exports = {
  beforeInsert: async function(ctx) {
    // ctx 对象包含以下属性
  }
};
```

### ctx.params

包含触发器参数：

```javascript
{
  isInsert: true,
  isBefore: true,
  userId: 'user123',
  spaceId: 'space456',
  objectName: 'sales_orders',
  doc: { /* 记录数据 */ }
}
```

### ctx.broker

Moleculer broker 实例，用于调用其他服务：

```javascript
{
  meta: {},           // 元数据
  call: Function,     // 调用服务方法
  emit: Function,     // 发出事件
  broadcast: Function,// 广播事件
  namespace: String,  // 命名空间
  nodeID: String,     // 节点 ID
  instanceID: String, // 实例 ID
  logger: Object,     // 日志对象
  metadata: Object    // 元数据
}
```

### 辅助方法

| 方法 | 参数 | 返回值 | 说明 |
|------|------|--------|------|
| getObject | objectName | Object | 获取对象实例 |
| getUser | userId, spaceId | Object | 获取用户会话信息 |
| makeNewID | - | String | 生成唯一 ID |

## 详细说明

### 1. userId 和 spaceId

当前操作用户和工作区的标识。

**示例**:
```javascript
module.exports = {
  beforeInsert: async function() {
    const { userId, spaceId } = this;
    
    console.log(`用户 ${userId} 在工作区 ${spaceId} 中创建记录`);
    
    // 获取用户信息
    const user = await this.getUser(userId, spaceId);
    console.log(`用户名: ${user.name}`);
  }
};
```

### 2. doc - 当前记录

在 Insert 和 Update 事件中可用，包含即将保存或正在保存的记录数据。

**beforeInsert/beforeUpdate**: 可以修改 doc 的值
```javascript
module.exports = {
  beforeInsert: async function() {
    const { doc } = this;
    
    // 读取字段
    console.log(`订单金额: ${doc.amount}`);
    
    // 修改字段（会保存到数据库）
    doc.discount_amount = doc.amount * 0.1;
    doc.final_amount = doc.amount - doc.discount_amount;
  }
};
```

**afterInsert/afterUpdate**: 只读，不能修改
```javascript
module.exports = {
  afterInsert: async function() {
    const { doc, id } = this;
    
    // 可以读取字段
    console.log(`已创建订单: ${id}, 金额: ${doc.amount}`);
    
    // 但修改不会生效
    doc.status = 'processed';  // ❌ 不会保存
  }
};
```

### 3. previousDoc - 原记录

在 Update 和 Delete 的 after 事件中可用，包含操作前的记录数据。

**比较变更**:
```javascript
module.exports = {
  afterUpdate: async function() {
    const { doc, previousDoc } = this;
    
    // 检查状态是否变更
    if (doc.status !== previousDoc.status) {
      console.log(`状态从 ${previousDoc.status} 变更为 ${doc.status}`);
    }
    
    // 检查金额是否变更
    if (doc.amount !== previousDoc.amount) {
      console.log(`金额从 ${previousDoc.amount} 变更为 ${doc.amount}`);
    }
  }
};
```

**beforeUpdate 获取原记录**:
```javascript
module.exports = {
  beforeUpdate: async function() {
    const { doc, id } = this;
    
    // beforeUpdate 没有 previousDoc，需要手动查询
    const previousDoc = await this.getObject(this.objectName).findOne(id);
    
    if (doc.status && doc.status !== previousDoc.status) {
      // 验证状态转换
    }
  }
};
```

### 4. id - 记录 ID

记录的唯一标识符。

**注意**: beforeInsert 事件中没有 id（因为还未保存到数据库）

```javascript
module.exports = {
  beforeInsert: async function() {
    // ❌ beforeInsert 中 this.id 为 undefined
    console.log(this.id);  // undefined
    
    // 如果需要，可以生成一个
    const newId = this.makeNewID();
    this.doc._id = newId;
  },
  
  afterInsert: async function() {
    // ✅ afterInsert 中 this.id 可用
    console.log(`已创建记录: ${this.id}`);
  }
};
```

### 5. query - 查询参数

在 beforeFind 事件中可用，包含查询参数，可以修改。

```javascript
module.exports = {
  beforeFind: async function() {
    const { query, userId } = this;
    
    console.log('原始查询:', query);
    
    // 修改查询条件
    if (!query.filters) {
      query.filters = [];
    }
    
    // 添加额外的过滤条件
    query.filters.push(['owner', '=', userId]);
    
    console.log('修改后查询:', query);
  }
};
```

### 6. data - 查询结果

在 afterFind 事件中可用，包含查询结果，可以修改。

```javascript
module.exports = {
  afterFind: async function() {
    const { data } = this;
    
    console.log(`查询返回 ${data.length} 条记录`);
    
    // 可以修改结果
    data.forEach(record => {
      // 添加计算字段
      record.computed_field = record.field1 + record.field2;
      
      // 过滤敏感字段
      delete record.sensitive_field;
    });
  }
};
```

## 辅助方法

### getObject()

获取对象实例，用于执行 CRUD 操作。

**语法**:
```javascript
const object = this.getObject(objectName)
```

**示例**:
```javascript
module.exports = {
  afterInsert: async function() {
    const { doc, id } = this;
    
    // 获取 contacts 对象
    const contactsObject = this.getObject('contacts');
    
    // 创建联系人
    await contactsObject.insert({
      name: `${doc.name} - 主联系人`,
      account: id
    });
    
    // 查询联系人
    const contacts = await contactsObject.find({
      filters: [['account', '=', id]]
    });
  }
};
```

### getUser()

获取用户会话信息。

**语法**:
```javascript
const userSession = await this.getUser(userId, spaceId)
```

**返回值**:
```javascript
{
  userId: 'user123',
  spaceId: 'space456',
  name: '张三',
  email: 'zhangsan@example.com',
  roles: ['user', 'sales'],
  permissions: { /* ... */ }
}
```

**示例**:
```javascript
module.exports = {
  beforeInsert: async function() {
    const { userId, spaceId } = this;
    
    // 获取用户信息
    const user = await this.getUser(userId, spaceId);
    
    // 验证用户角色
    if (!user.roles.includes('sales_manager')) {
      throw new Error('只有销售经理可以创建此类型记录');
    }
    
    // 使用用户信息
    this.doc.created_by_name = user.name;
  }
};
```

### makeNewID()

生成一个新的唯一 ID。

**语法**:
```javascript
const newId = this.makeNewID()
```

**示例**:
```javascript
module.exports = {
  beforeInsert: async function() {
    const { doc } = this;
    
    // 生成自定义 ID
    if (!doc._id) {
      doc._id = this.makeNewID();
    }
    
    // 为子记录生成 ID
    if (doc.items && doc.items.length > 0) {
      doc.items.forEach(item => {
        if (!item._id) {
          item._id = this.makeNewID();
        }
      });
    }
  }
};
```

## 全局对象

触发器中可以访问一些全局对象：

### _ (Lodash)

```javascript
module.exports = {
  beforeInsert: async function() {
    const { doc } = this;
    
    // 使用 Lodash
    const uniqueTags = _.uniq(doc.tags);
    const sortedItems = _.sortBy(doc.items, 'price');
  }
};
```

### moment

```javascript
module.exports = {
  beforeInsert: async function() {
    const { doc } = this;
    
    // 使用 Moment.js
    doc.due_date = moment().add(30, 'days').toDate();
    doc.formatted_date = moment(doc.date).format('YYYY-MM-DD');
  }
};
```

### validator

```javascript
module.exports = {
  beforeInsert: async function() {
    const { doc } = this;
    
    // 使用 Validator
    if (!validator.isEmail(doc.email)) {
      throw new Error('无效的邮箱地址');
    }
    
    if (!validator.isURL(doc.website)) {
      throw new Error('无效的网址');
    }
  }
};
```

### Filters

```javascript
module.exports = {
  beforeFind: async function() {
    const { query } = this;
    
    // 使用 Filters 工具
    const Filters = require('@steedos/filters');
    
    // 格式化过滤条件
    query.filters = Filters.formatFilters(query.filters);
  }
};
```

## Broker 调用

使用 `ctx.broker` 或 `this.broker` 调用其他微服务：

### 调用服务方法

```javascript
module.exports = {
  afterInsert: async function() {
    const { doc, id } = this;
    
    // 调用通知服务
    await this.broker.call('notifications.send', {
      to: doc.owner,
      title: '新记录创建',
      message: `记录 ${doc.name} 已创建`,
      link: `/app/${this.objectName}/${id}`
    });
    
    // 调用邮件服务
    await this.broker.call('email.send', {
      to: doc.email,
      subject: '欢迎',
      template: 'welcome',
      data: { name: doc.name }
    });
  }
};
```

### 发出事件

```javascript
module.exports = {
  afterUpdate: async function() {
    const { doc, previousDoc, id } = this;
    
    // 发出自定义事件
    if (doc.status === 'completed' && previousDoc.status !== 'completed') {
      this.broker.emit('order.completed', {
        orderId: id,
        orderNumber: doc.order_number,
        amount: doc.amount
      });
    }
  }
};
```

## 完整示例

```javascript
/**
 * 销售订单触发器
 * 
 * 功能：
 * 1. 自动生成订单号
 * 2. 验证订单金额
 * 3. 状态变更通知
 * 4. 更新客户统计
 */
module.exports = {
  listenTo: 'sales_orders',
  
  // 插入前：生成订单号、验证数据
  beforeInsert: async function() {
    const { doc, userId, spaceId } = this;
    
    // 验证金额
    if (!doc.amount || doc.amount <= 0) {
      throw new Error('订单金额必须大于0');
    }
    
    // 获取用户信息
    const user = await this.getUser(userId, spaceId);
    
    // 生成订单号
    if (!doc.order_number) {
      const dateStr = moment().format('YYYYMMDD');
      const sequence = await this.getNextSequence('sales_orders', dateStr);
      doc.order_number = `SO-${dateStr}-${sequence.toString().padStart(4, '0')}`;
    }
    
    // 记录创建人信息
    doc.created_by_name = user.name;
  },
  
  // 插入后：创建关联记录、发送通知
  afterInsert: async function() {
    const { doc, id } = this;
    
    // 创建订单明细（如果有）
    if (doc.items && doc.items.length > 0) {
      const orderItemsObject = this.getObject('order_items');
      for (const item of doc.items) {
        await orderItemsObject.insert({
          ...item,
          order: id
        });
      }
    }
    
    // 发送通知
    await this.broker.call('notifications.send', {
      to: doc.owner,
      title: '新订单创建',
      message: `订单 ${doc.order_number} 已创建`,
      link: `/app/sales_orders/${id}`
    });
  },
  
  // 更新前：验证状态转换
  beforeUpdate: async function() {
    const { doc, id } = this;
    
    // 如果状态变更，验证转换
    if (doc.status) {
      const previousDoc = await this.getObject('sales_orders').findOne(id);
      
      if (previousDoc.status !== doc.status) {
        this.validateStatusChange(previousDoc.status, doc.status);
      }
    }
  },
  
  // 更新后：状态变更处理、更新统计
  afterUpdate: async function() {
    const { doc, previousDoc, id } = this;
    
    // 状态变更通知
    if (doc.status && doc.status !== previousDoc.status) {
      await this.broker.call('notifications.send', {
        to: doc.owner,
        title: '订单状态变更',
        message: `订单 ${doc.order_number} 状态变更为 ${doc.status}`,
        link: `/app/sales_orders/${id}`
      });
    }
    
    // 金额变更时更新客户统计
    if (doc.amount !== previousDoc.amount) {
      await this.updateAccountTotals(doc.account);
    }
  },
  
  // 删除前：检查依赖
  beforeDelete: async function() {
    const { id } = this;
    
    // 检查是否有关联的发票
    const invoiceCount = await this.getObject('invoices').count({
      filters: [['order', '=', id]]
    });
    
    if (invoiceCount > 0) {
      throw new Error('此订单已有发票，无法删除');
    }
  },
  
  // 删除后：清理数据、更新统计
  afterDelete: async function() {
    const { previousDoc, id } = this;
    
    // 删除订单明细
    const orderItems = await this.getObject('order_items').find({
      filters: [['order', '=', id]]
    });
    
    for (const item of orderItems) {
      await this.getObject('order_items').delete(item._id);
    }
    
    // 更新客户统计
    await this.updateAccountTotals(previousDoc.account);
  },
  
  // 辅助方法
  validateStatusChange: function(oldStatus, newStatus) {
    const validTransitions = {
      'draft': ['submitted', 'cancelled'],
      'submitted': ['approved', 'rejected'],
      'approved': ['completed', 'cancelled'],
      'rejected': [],
      'completed': [],
      'cancelled': []
    };
    
    const allowed = validTransitions[oldStatus] || [];
    if (!allowed.includes(newStatus)) {
      throw new Error(`不能从 ${oldStatus} 变更为 ${newStatus}`);
    }
  },
  
  getNextSequence: async function(prefix, date) {
    // 获取序列号的实现
    // ...
    return 1;
  },
  
  updateAccountTotals: async function(accountId) {
    // 更新客户统计的实现
    // ...
  }
};
```

## 相关文档

- [触发器概述](./README.md)
- [触发器类型和使用场景](./trigger-types.md)
- [ObjectQL 查询](../objectql/)
- [对象元数据](../metadata/object-metadata.md)
