# ObjectQL 查询语法详解

## 概述

ObjectQL 查询语法提供了一套统一的 API 来操作不同类型的数据库（MongoDB、PostgreSQL、MySQL 等），使开发者无需关心底层数据库的差异。

## 查询参数结构

### 标准查询参数

```javascript
{
  fields: [],           // 要返回的字段列表
  filters: [],          // 过滤条件
  sort: '',            // 排序规则
  top: 100,            // 返回记录数
  skip: 0              // 跳过记录数
}
```

## Fields（字段选择）

### 选择特定字段

```javascript
// 只返回 name 和 email 字段
const records = await objects.accounts.find({
  fields: ['name', 'email']
});
```

### 选择所有字段

```javascript
// 不指定 fields 或传入空数组返回所有字段
const records = await objects.accounts.find({
  fields: []
});
```

### 选择关联对象字段

```javascript
// 选择关联对象的字段
const records = await objects.contacts.find({
  fields: ['name', 'account.name', 'account.industry']
});
```

### 字段别名

```javascript
// 使用 $ 符号访问原始字段值
const records = await objects.accounts.find({
  fields: ['name', '$owner.name']
});
```

## Filters（过滤条件）

### 基本过滤语法

```javascript
// 格式：[field, operator, value]
filters: [['field_name', 'operator', value]]
```

### 简单条件示例

```javascript
// 等于
filters: [['status', '=', 'active']]

// 不等于
filters: [['status', '!=', 'inactive']]

// 大于
filters: [['amount', '>', 1000]]

// 大于等于
filters: [['amount', '>=', 1000]]

// 小于
filters: [['amount', '<', 5000]]

// 小于等于
filters: [['amount', '<=', 5000]]

// 包含
filters: [['name', 'contains', '公司']]

// 不包含
filters: [['name', 'notcontains', '测试']]

// 以...开始
filters: [['name', 'startswith', 'A']]

// 以...结束
filters: [['name', 'endswith', '有限公司']]

// 在范围内
filters: [['age', 'between', [20, 30]]]
```

### 空值判断

```javascript
// 为空
filters: [['description', '=', null]]

// 不为空
filters: [['description', '!=', null]]
```

### 数组值查询

```javascript
// 值在数组中（IN 查询）
filters: [['status', '=', ['active', 'pending']]]

// 等同于
filters: [['status', 'in', ['active', 'pending']]]

// 值不在数组中（NOT IN 查询）
filters: [['status', '!=', ['inactive', 'deleted']]]

// 等同于
filters: [['status', 'not in', ['inactive', 'deleted']]]
```

### 组合条件

#### AND 条件

```javascript
// 默认使用 AND 连接
filters: [
  ['status', '=', 'active'],
  ['amount', '>', 1000]
]

// 等同于显式指定 AND
filters: [
  ['status', '=', 'active'],
  'and',
  ['amount', '>', 1000]
]
```

#### OR 条件

```javascript
// 使用 OR 连接条件
filters: [
  ['status', '=', 'active'],
  'or',
  ['status', '=', 'pending']
]
```

#### 复杂组合

```javascript
// (status = 'active' OR status = 'pending') AND amount > 1000
filters: [
  [
    ['status', '=', 'active'],
    'or',
    ['status', '=', 'pending']
  ],
  'and',
  ['amount', '>', 1000]
]
```

```javascript
// status = 'active' AND (amount > 1000 OR priority = 'high')
filters: [
  ['status', '=', 'active'],
  'and',
  [
    ['amount', '>', 1000],
    'or',
    ['priority', '=', 'high']
  ]
]
```

### 关联对象查询

```javascript
// 查询关联对象字段
filters: [['account.industry', '=', 'IT']]

// 多层关联
filters: [['account.owner.name', '=', '张三']]
```

### 当前用户变量

```javascript
// 使用 {userId} 表示当前用户
filters: [['owner', '=', '{userId}']]

// 使用 {spaceId} 表示当前工作区
filters: [['space', '=', '{spaceId}']]
```

### 日期查询

```javascript
// 特定日期
filters: [['created', '=', '2024-01-01']]

// 日期范围
filters: [['created', 'between', ['2024-01-01', '2024-12-31']]]

// 相对日期
filters: [['created', '=', 'this_month']]    // 本月
filters: [['created', '=', 'last_month']]    // 上月
filters: [['created', '=', 'this_year']]     // 今年
filters: [['created', '=', 'last_year']]     // 去年
filters: [['created', '=', 'this_week']]     // 本周
filters: [['created', '=', 'last_week']]     // 上周
filters: [['created', '=', 'today']]         // 今天
filters: [['created', '=', 'yesterday']]     // 昨天
filters: [['created', '=', 'tomorrow']]      // 明天
filters: [['created', '=', 'next_7_days']]   // 未来7天
filters: [['created', '=', 'next_30_days']]  // 未来30天
filters: [['created', '=', 'next_60_days']]  // 未来60天
filters: [['created', '=', 'next_90_days']]  // 未来90天
filters: [['created', '=', 'last_7_days']]   // 过去7天
filters: [['created', '=', 'last_30_days']]  // 过去30天
filters: [['created', '=', 'last_60_days']]  // 过去60天
filters: [['created', '=', 'last_90_days']]  // 过去90天
```

## Sort（排序）

### 单字段排序

```javascript
// 升序
const records = await objects.accounts.find({
  sort: 'name'
});

// 降序
const records = await objects.accounts.find({
  sort: 'name desc'
});
```

### 多字段排序

```javascript
// 多字段排序，用逗号分隔
const records = await objects.accounts.find({
  sort: 'priority desc, created desc'
});
```

### 数组格式排序

```javascript
// 使用数组格式
const records = await objects.accounts.find({
  sort: [['priority', 'desc'], ['created', 'desc']]
});
```

## Top 和 Skip（分页）

### 限制返回数量

```javascript
// 返回前 10 条记录
const records = await objects.accounts.find({
  top: 10
});
```

### 分页查询

```javascript
// 第一页（0-9）
const page1 = await objects.accounts.find({
  top: 10,
  skip: 0
});

// 第二页（10-19）
const page2 = await objects.accounts.find({
  top: 10,
  skip: 10
});

// 第三页（20-29）
const page3 = await objects.accounts.find({
  top: 10,
  skip: 20
});
```

### 分页函数示例

```javascript
async function getPage(objectName, pageNumber, pageSize) {
  const skip = (pageNumber - 1) * pageSize;
  return await objects[objectName].find({
    top: pageSize,
    skip: skip,
    sort: 'created desc'
  });
}

// 获取第 1 页，每页 20 条
const page1 = await getPage('accounts', 1, 20);

// 获取第 2 页，每页 20 条
const page2 = await getPage('accounts', 2, 20);
```

## 完整查询示例

### 示例 1：基础查询

```javascript
// 查询活跃客户的名称和电话
const activeAccounts = await objects.accounts.find({
  fields: ['name', 'phone', 'email'],
  filters: [['status', '=', 'active']],
  sort: 'name',
  top: 50
});
```

### 示例 2：复杂条件查询

```javascript
// 查询高优先级或金额大于10000的活跃订单
const orders = await objects.sales_orders.find({
  fields: ['order_number', 'account', 'amount', 'priority', 'status'],
  filters: [
    ['status', '=', 'active'],
    'and',
    [
      ['priority', '=', 'high'],
      'or',
      ['amount', '>', 10000]
    ]
  ],
  sort: 'created desc',
  top: 100
});
```

### 示例 3：关联查询

```javascript
// 查询联系人及其所属客户信息
const contacts = await objects.contacts.find({
  fields: [
    'name',
    'email',
    'phone',
    'account.name',
    'account.industry',
    'account.owner.name'
  ],
  filters: [
    ['account.status', '=', 'active'],
    'and',
    ['account.industry', '=', 'IT']
  ],
  sort: 'name'
});
```

### 示例 4：日期范围查询

```javascript
// 查询本月创建的订单
const thisMonthOrders = await objects.sales_orders.find({
  fields: ['order_number', 'account', 'amount', 'created'],
  filters: [['created', '=', 'this_month']],
  sort: 'created desc'
});

// 查询指定日期范围的订单
const rangeOrders = await objects.sales_orders.find({
  fields: ['order_number', 'account', 'amount', 'created'],
  filters: [['created', 'between', ['2024-01-01', '2024-12-31']]],
  sort: 'created desc'
});
```

### 示例 5：当前用户相关查询

```javascript
// 查询当前用户拥有的记录
const myRecords = await objects.accounts.find({
  fields: ['name', 'status', 'created'],
  filters: [['owner', '=', '{userId}']],
  sort: 'modified desc'
}, userSession);
```

### 示例 6：分页查询

```javascript
// 实现完整分页
async function getPaginatedResults(pageNumber = 1, pageSize = 20) {
  const skip = (pageNumber - 1) * pageSize;
  
  // 获取总数
  const total = await objects.accounts.count({
    filters: [['status', '=', 'active']]
  });
  
  // 获取当前页数据
  const records = await objects.accounts.find({
    fields: ['name', 'phone', 'email', 'status'],
    filters: [['status', '=', 'active']],
    sort: 'name',
    top: pageSize,
    skip: skip
  });
  
  return {
    records: records,
    total: total,
    pageNumber: pageNumber,
    pageSize: pageSize,
    totalPages: Math.ceil(total / pageSize)
  };
}

// 使用
const result = await getPaginatedResults(1, 20);
console.log(`共 ${result.total} 条记录，当前第 ${result.pageNumber}/${result.totalPages} 页`);
```

## 性能优化建议

### 1. 只查询需要的字段

```javascript
// 推荐：只选择需要的字段
const records = await objects.accounts.find({
  fields: ['name', 'phone']
});

// 不推荐：查询所有字段
const records = await objects.accounts.find({});
```

### 2. 使用索引字段作为过滤条件

```javascript
// 推荐：使用索引字段
filters: [['status', '=', 'active']]

// 注意：非索引字段查询可能较慢
filters: [['description', 'contains', '关键词']]
```

### 3. 合理使用 top 限制

```javascript
// 推荐：限制返回数量
const records = await objects.accounts.find({
  top: 100
});

// 不推荐：不限制可能返回大量数据
const records = await objects.accounts.find({});
```

### 4. 避免深层关联查询

```javascript
// 推荐：一层关联
fields: ['name', 'account.name']

// 注意：多层关联可能影响性能
fields: ['name', 'account.owner.manager.name']
```

## 常见问题

### Q: 如何查询空值？

```javascript
filters: [['field_name', '=', null]]
```

### Q: 如何实现 LIKE 查询？

```javascript
// 包含
filters: [['name', 'contains', '关键词']]

// 以...开始
filters: [['name', 'startswith', '前缀']]
```

### Q: 如何查询数组字段？

```javascript
// 数组包含某个值
filters: [['tags', '=', 'important']]
```

### Q: 如何进行不区分大小写的查询？

ObjectQL 查询默认根据数据库特性处理大小写。对于需要不区分大小写的查询，建议在存储时统一转换为小写。

## 相关文档

- [ObjectQL 概述](./README.md)
- [过滤器操作符参考](./filter-operators.md)
- [ObjectQL 最佳实践](./best-practices.md)
- [对象元数据](../metadata/object-metadata.md)
