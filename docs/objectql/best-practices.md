# ObjectQL 最佳实践

## 概述

本文档提供使用 ObjectQL 的最佳实践和建议，帮助您编写高效、可维护的代码。

## 查询优化

### 1. 只查询需要的字段

**不推荐** ❌:
```javascript
// 查询所有字段
const records = await objects.accounts.find({
  filters: [['status', '=', 'active']]
});
```

**推荐** ✅:
```javascript
// 只查询需要的字段
const records = await objects.accounts.find({
  fields: ['name', 'phone', 'email'],
  filters: [['status', '=', 'active']]
});
```

**原因**: 减少数据传输量，提高查询速度。

### 2. 使用 top 限制返回数量

**不推荐** ❌:
```javascript
// 不限制返回数量，可能返回大量数据
const records = await objects.accounts.find({
  filters: [['status', '=', 'active']]
});
```

**推荐** ✅:
```javascript
// 限制返回数量
const records = await objects.accounts.find({
  filters: [['status', '=', 'active']],
  top: 100
});
```

**原因**: 防止一次性加载过多数据，影响性能和内存使用。

### 3. 在索引字段上建立过滤条件

**不推荐** ❌:
```javascript
// 在非索引字段上过滤
const records = await objects.accounts.find({
  filters: [['description', 'contains', '关键词']]
});
```

**推荐** ✅:
```javascript
// 优先在索引字段上过滤
const records = await objects.accounts.find({
  filters: [
    ['status', '=', 'active'],  // 索引字段
    'and',
    ['category', '=', 'important']  // 索引字段
  ]
});
```

**原因**: 索引字段查询速度更快。

### 4. 使用 IN 代替多个 OR 条件

**不推荐** ❌:
```javascript
const records = await objects.accounts.find({
  filters: [
    ['status', '=', 'active'],
    'or',
    ['status', '=', 'pending'],
    'or',
    ['status', '=', 'approved']
  ]
});
```

**推荐** ✅:
```javascript
const records = await objects.accounts.find({
  filters: [['status', 'in', ['active', 'pending', 'approved']]]
});
```

**原因**: 更简洁，性能更好。

### 5. 合理使用分页

**推荐** ✅:
```javascript
async function getPaginatedData(pageNumber = 1, pageSize = 20) {
  const skip = (pageNumber - 1) * pageSize;
  
  const records = await objects.accounts.find({
    fields: ['name', 'status', 'created'],
    filters: [['status', '=', 'active']],
    sort: 'created desc',
    top: pageSize,
    skip: skip
  });
  
  return records;
}
```

**原因**: 避免一次性加载所有数据。

## 权限和安全

### 1. 始终传递 userSession

**不推荐** ❌:
```javascript
// 不传递 userSession，绕过权限检查
const records = await objects.accounts.find({
  filters: [['status', '=', 'active']]
});
```

**推荐** ✅:
```javascript
// 传递 userSession 进行权限验证
const records = await objects.accounts.find({
  filters: [['status', '=', 'active']]
}, userSession);
```

**原因**: 确保数据安全，只返回用户有权访问的数据。

### 2. 在触发器中验证权限

**推荐** ✅:
```javascript
module.exports = {
  beforeUpdate: async function() {
    const { userId, spaceId, doc, previousDoc } = this;
    
    // 验证用户是否有权修改关键字段
    if (doc.status !== previousDoc.status) {
      const hasPermission = await checkApprovalPermission(userId, spaceId);
      if (!hasPermission) {
        throw new Error('您没有权限修改状态');
      }
    }
  }
};
```

### 3. 过滤敏感数据

**推荐** ✅:
```javascript
// 不返回敏感字段
const records = await objects.accounts.find({
  fields: ['name', 'phone', 'email'],  // 不包含敏感字段
  filters: [['status', '=', 'active']]
}, userSession);
```

## 错误处理

### 1. 使用 try-catch 处理错误

**推荐** ✅:
```javascript
async function getAccount(id) {
  try {
    const record = await objects.accounts.findOne(id, {
      fields: ['name', 'phone', 'email']
    }, userSession);
    
    if (!record) {
      throw new Error('记录不存在');
    }
    
    return record;
  } catch (error) {
    console.error('查询失败:', error);
    throw error;
  }
}
```

### 2. 验证查询结果

**推荐** ✅:
```javascript
async function updateAccount(id, data) {
  // 先查询记录是否存在
  const existing = await objects.accounts.findOne(id, {
    fields: ['_id']
  }, userSession);
  
  if (!existing) {
    throw new Error('记录不存在');
  }
  
  // 执行更新
  return await objects.accounts.update(id, data, userSession);
}
```

### 3. 提供有意义的错误消息

**不推荐** ❌:
```javascript
if (!record) {
  throw new Error('错误');
}
```

**推荐** ✅:
```javascript
if (!record) {
  throw new Error('未找到 ID 为 ${id} 的客户记录');
}
```

## 代码组织

### 1. 封装常用查询

**推荐** ✅:
```javascript
// services/accountService.js
class AccountService {
  // 获取活跃客户
  async getActiveAccounts(userSession) {
    return await objects.accounts.find({
      fields: ['name', 'phone', 'email', 'status'],
      filters: [['status', '=', 'active']],
      sort: 'name'
    }, userSession);
  }
  
  // 获取高价值客户
  async getHighValueAccounts(userSession) {
    return await objects.accounts.find({
      fields: ['name', 'annual_revenue', 'rating'],
      filters: [
        ['annual_revenue', '>', 1000000],
        'and',
        ['rating', '=', 'A']
      ],
      sort: 'annual_revenue desc'
    }, userSession);
  }
  
  // 搜索客户
  async searchAccounts(keyword, userSession) {
    return await objects.accounts.find({
      fields: ['name', 'phone', 'email'],
      filters: [['name', 'contains', keyword]],
      top: 50
    }, userSession);
  }
}

module.exports = new AccountService();
```

### 2. 使用常量定义过滤条件

**推荐** ✅:
```javascript
// constants/filters.js
const ACCOUNT_FILTERS = {
  ACTIVE: [['status', '=', 'active']],
  HIGH_VALUE: [['annual_revenue', '>', 1000000]],
  VIP: [['customer_type', '=', 'vip']]
};

// 使用
const records = await objects.accounts.find({
  filters: ACCOUNT_FILTERS.ACTIVE
}, userSession);
```

### 3. 创建可复用的查询函数

**推荐** ✅:
```javascript
// utils/queryHelper.js
async function findByOwner(objectName, userId, fields, userSession) {
  return await objects[objectName].find({
    fields: fields,
    filters: [['owner', '=', userId]],
    sort: 'modified desc'
  }, userSession);
}

// 使用
const myAccounts = await findByOwner('accounts', userId, ['name', 'status'], userSession);
const myOrders = await findByOwner('sales_orders', userId, ['order_number', 'amount'], userSession);
```

## 触发器最佳实践

### 1. 保持触发器逻辑简单

**不推荐** ❌:
```javascript
module.exports = {
  beforeInsert: async function() {
    // 复杂的业务逻辑
    // ...大量代码...
  }
};
```

**推荐** ✅:
```javascript
module.exports = {
  beforeInsert: async function() {
    const { doc } = this;
    
    // 调用外部服务处理复杂逻辑
    await accountService.validateAccount(doc);
    await accountService.enrichAccountData(doc);
  }
};
```

### 2. 避免在触发器中进行循环查询

**不推荐** ❌:
```javascript
module.exports = {
  afterInsert: async function() {
    const { doc } = this;
    
    // 为每个联系人单独查询
    for (const contactId of doc.contacts) {
      const contact = await objects.contacts.findOne(contactId);
      // 处理联系人
    }
  }
};
```

**推荐** ✅:
```javascript
module.exports = {
  afterInsert: async function() {
    const { doc } = this;
    
    // 一次性查询所有联系人
    const contacts = await objects.contacts.find({
      filters: [['_id', 'in', doc.contacts]]
    });
    
    // 批量处理
    for (const contact of contacts) {
      // 处理联系人
    }
  }
};
```

### 3. 使用事务保证数据一致性

**推荐** ✅:
```javascript
module.exports = {
  afterInsert: async function() {
    const { doc, id } = this;
    
    try {
      // 更新相关记录
      await objects.contacts.update(doc.primary_contact, {
        account: id
      });
      
      // 创建关联记录
      await objects.opportunities.insert({
        account: id,
        name: `${doc.name} - Initial Opportunity`
      });
    } catch (error) {
      // 错误处理
      console.error('触发器执行失败:', error);
      throw error;
    }
  }
};
```

## 性能监控

### 1. 记录查询时间

**推荐** ✅:
```javascript
async function getAccountsWithTiming(filters, userSession) {
  const startTime = Date.now();
  
  try {
    const records = await objects.accounts.find({
      fields: ['name', 'status'],
      filters: filters
    }, userSession);
    
    const duration = Date.now() - startTime;
    console.log(`查询耗时: ${duration}ms, 返回 ${records.length} 条记录`);
    
    return records;
  } catch (error) {
    console.error('查询失败:', error);
    throw error;
  }
}
```

### 2. 添加查询日志

**推荐** ✅:
```javascript
async function loggedQuery(objectName, query, userSession) {
  console.log(`[ObjectQL] 查询 ${objectName}:`, JSON.stringify(query));
  
  const result = await objects[objectName].find(query, userSession);
  
  console.log(`[ObjectQL] 返回 ${result.length} 条记录`);
  
  return result;
}
```

## 测试

### 1. 编写单元测试

**推荐** ✅:
```javascript
// tests/accountService.test.js
describe('AccountService', () => {
  it('should get active accounts', async () => {
    const userSession = createTestUserSession();
    
    const accounts = await accountService.getActiveAccounts(userSession);
    
    expect(accounts).toBeDefined();
    expect(accounts.length).toBeGreaterThan(0);
    expect(accounts[0].status).toBe('active');
  });
  
  it('should search accounts by name', async () => {
    const userSession = createTestUserSession();
    
    const accounts = await accountService.searchAccounts('Test', userSession);
    
    expect(accounts).toBeDefined();
    accounts.forEach(account => {
      expect(account.name).toContain('Test');
    });
  });
});
```

### 2. 模拟 ObjectQL 调用

**推荐** ✅:
```javascript
// tests/mocks/objectql.mock.js
const mockObjectQL = {
  accounts: {
    find: jest.fn(),
    findOne: jest.fn(),
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  }
};

// 在测试中使用
mockObjectQL.accounts.find.mockResolvedValue([
  { _id: '1', name: 'Test Account', status: 'active' }
]);
```

## 常见陷阱

### 1. 忘记传递 userSession

```javascript
// ❌ 错误：绕过权限检查
const records = await objects.accounts.find({ filters: [...] });

// ✅ 正确：包含权限检查
const records = await objects.accounts.find({ filters: [...] }, userSession);
```

### 2. 在循环中进行查询

```javascript
// ❌ 错误：N+1 查询问题
for (const accountId of accountIds) {
  const account = await objects.accounts.findOne(accountId);
  // 处理...
}

// ✅ 正确：批量查询
const accounts = await objects.accounts.find({
  filters: [['_id', 'in', accountIds]]
});
```

### 3. 不处理空结果

```javascript
// ❌ 错误：未检查结果
const record = await objects.accounts.findOne(id);
const name = record.name;  // 可能报错

// ✅ 正确：检查结果
const record = await objects.accounts.findOne(id);
if (!record) {
  throw new Error('记录不存在');
}
const name = record.name;
```

### 4. 过度使用 viewAllRecords

```javascript
// ❌ 错误：不必要的全局权限
const records = await objects.accounts.find({
  filters: [['owner', '=', userId]]  // 只查询自己的记录
}, { ...userSession, viewAllRecords: true });  // 不需要全局权限

// ✅ 正确：使用正常权限
const records = await objects.accounts.find({
  filters: [['owner', '=', userId]]
}, userSession);
```

## 文档化

### 1. 添加注释说明查询用途

**推荐** ✅:
```javascript
/**
 * 获取需要跟进的客户列表
 * 条件：
 * 1. 状态为活跃
 * 2. 最后联系时间超过 30 天
 * 3. 客户评级为 A 或 B
 */
async function getAccountsNeedingFollowUp(userSession) {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  return await objects.accounts.find({
    fields: ['name', 'last_contact_date', 'rating', 'owner'],
    filters: [
      ['status', '=', 'active'],
      'and',
      ['last_contact_date', '<', thirtyDaysAgo],
      'and',
      ['rating', 'in', ['A', 'B']]
    ],
    sort: 'last_contact_date'
  }, userSession);
}
```

### 2. 记录复杂过滤条件的业务逻辑

**推荐** ✅:
```javascript
// 高价值客户定义：
// - 年收入 > 100万 或
// - (客户评级 = A 且 订单数 > 10)
const HIGH_VALUE_CUSTOMER_FILTERS = [
  ['annual_revenue', '>', 1000000],
  'or',
  [
    ['rating', '=', 'A'],
    'and',
    ['order_count', '>', 10]
  ]
];
```

## 相关文档

- [ObjectQL 概述](./README.md)
- [查询语法详解](./query-syntax.md)
- [过滤器操作符参考](./filter-operators.md)
- [触发器开发](../triggers/)
