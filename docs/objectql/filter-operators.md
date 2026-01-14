# ObjectQL 过滤器操作符完整参考

## 概述

ObjectQL 提供了丰富的过滤器操作符，用于构建灵活的查询条件。所有操作符都支持跨数据库使用（MongoDB、PostgreSQL、MySQL 等）。

## 基本操作符

### 等于 (=)

匹配等于指定值的记录。

**语法**:
```javascript
[field, '=', value]
```

**示例**:
```javascript
// 单个值
filters: [['status', '=', 'active']]

// 数组值（IN 查询）
filters: [['status', '=', ['active', 'pending']]]

// 等同于
filters: [['status', 'in', ['active', 'pending']]]

// 空值
filters: [['description', '=', null]]

// 布尔值
filters: [['is_active', '=', true]]

// 日期
filters: [['created', '=', '2024-01-01']]
```

### 不等于 (!=)

匹配不等于指定值的记录。

**语法**:
```javascript
[field, '!=', value]
```

**示例**:
```javascript
// 单个值
filters: [['status', '!=', 'deleted']]

// 数组值（NOT IN 查询）
filters: [['status', '!=', ['deleted', 'cancelled']]]

// 等同于
filters: [['status', 'not in', ['deleted', 'cancelled']]]

// 非空
filters: [['description', '!=', null]]
```

## 比较操作符

### 大于 (>)

匹配大于指定值的记录。

**语法**:
```javascript
[field, '>', value]
```

**示例**:
```javascript
// 数字
filters: [['amount', '>', 1000]]

// 日期
filters: [['created', '>', '2024-01-01']]

// 日期时间
filters: [['created', '>', '2024-01-01T00:00:00Z']]
```

### 大于等于 (>=)

匹配大于或等于指定值的记录。

**语法**:
```javascript
[field, '>=', value]
```

**示例**:
```javascript
filters: [['amount', '>=', 1000]]
filters: [['score', '>=', 60]]
filters: [['created', '>=', '2024-01-01']]
```

### 小于 (<)

匹配小于指定值的记录。

**语法**:
```javascript
[field, '<', value]
```

**示例**:
```javascript
filters: [['amount', '<', 5000]]
filters: [['age', '<', 30]]
filters: [['due_date', '<', '2024-12-31']]
```

### 小于等于 (<=)

匹配小于或等于指定值的记录。

**语法**:
```javascript
[field, '<=', value]
```

**示例**:
```javascript
filters: [['amount', '<=', 5000]]
filters: [['score', '<=', 100]]
filters: [['created', '<=', '2024-12-31']]
```

## 字符串操作符

### 包含 (contains)

匹配包含指定子字符串的记录。

**语法**:
```javascript
[field, 'contains', substring]
```

**示例**:
```javascript
// 名称包含"公司"
filters: [['name', 'contains', '公司']]

// 描述包含"重要"
filters: [['description', 'contains', '重要']]

// 邮箱包含"@example.com"
filters: [['email', 'contains', '@example.com']]
```

**注意**: 区分大小写取决于数据库配置。

### 不包含 (notcontains)

匹配不包含指定子字符串的记录。

**语法**:
```javascript
[field, 'notcontains', substring]
```

**示例**:
```javascript
// 名称不包含"测试"
filters: [['name', 'notcontains', '测试']]

// 描述不包含"已删除"
filters: [['description', 'notcontains', '已删除']]
```

### 以...开始 (startswith)

匹配以指定字符串开始的记录。

**语法**:
```javascript
[field, 'startswith', prefix]
```

**示例**:
```javascript
// 名称以"A"开始
filters: [['name', 'startswith', 'A']]

// 订单号以"SO-"开始
filters: [['order_number', 'startswith', 'SO-']]

// 邮箱以"admin"开始
filters: [['email', 'startswith', 'admin']]
```

### 以...结束 (endswith)

匹配以指定字符串结束的记录（部分数据库支持）。

**语法**:
```javascript
[field, 'endswith', suffix]
```

**示例**:
```javascript
// 名称以"有限公司"结束
filters: [['name', 'endswith', '有限公司']]

// 文件名以".pdf"结束
filters: [['filename', 'endswith', '.pdf']]

// 邮箱以"@example.com"结束
filters: [['email', 'endswith', '@example.com']]
```

## 范围操作符

### 在范围内 (between)

匹配在指定范围内的记录（包含边界值）。

**语法**:
```javascript
[field, 'between', [min, max]]
```

**示例**:
```javascript
// 金额在 1000 到 5000 之间
filters: [['amount', 'between', [1000, 5000]]]

// 等同于
filters: [
  ['amount', '>=', 1000],
  'and',
  ['amount', '<=', 5000]
]

// 年龄在 20 到 30 之间
filters: [['age', 'between', [20, 30]]]

// 日期范围
filters: [['created', 'between', ['2024-01-01', '2024-12-31']]]

// 开放范围（只有下限）
filters: [['age', 'between', [20, null]]]
// 等同于
filters: [['age', '>=', 20]]

// 开放范围（只有上限）
filters: [['age', 'between', [null, 30]]]
// 等同于
filters: [['age', '<=', 30]]
```

## 集合操作符

### 在列表中 (in)

匹配值在指定列表中的记录。

**语法**:
```javascript
[field, 'in', array]
```

**示例**:
```javascript
// 状态是 active、pending 或 approved
filters: [['status', 'in', ['active', 'pending', 'approved']]]

// 优先级是 high 或 urgent
filters: [['priority', 'in', ['high', 'urgent']]]

// 等同于使用 =
filters: [['status', '=', ['active', 'pending', 'approved']]]
```

### 不在列表中 (not in)

匹配值不在指定列表中的记录。

**语法**:
```javascript
[field, 'not in', array]
```

**示例**:
```javascript
// 状态不是 deleted、cancelled 或 archived
filters: [['status', 'not in', ['deleted', 'cancelled', 'archived']]]

// 等同于使用 !=
filters: [['status', '!=', ['deleted', 'cancelled', 'archived']]]
```

## 特殊日期操作符

ObjectQL 支持特殊的相对日期值，便于动态查询。

### 相对日期值

```javascript
// 今天
filters: [['created', '=', 'today']]

// 昨天
filters: [['created', '=', 'yesterday']]

// 明天
filters: [['created', '=', 'tomorrow']]

// 本周
filters: [['created', '=', 'this_week']]

// 上周
filters: [['created', '=', 'last_week']]

// 下周
filters: [['created', '=', 'next_week']]

// 本月
filters: [['created', '=', 'this_month']]

// 上月
filters: [['created', '=', 'last_month']]

// 下月
filters: [['created', '=', 'next_month']]

// 本季度
filters: [['created', '=', 'this_quarter']]

// 上季度
filters: [['created', '=', 'last_quarter']]

// 今年
filters: [['created', '=', 'this_year']]

// 去年
filters: [['created', '=', 'last_year']]

// 明年
filters: [['created', '=', 'next_year']]
```

### 相对天数范围

```javascript
// 过去 7 天
filters: [['created', '=', 'last_7_days']]

// 过去 30 天
filters: [['created', '=', 'last_30_days']]

// 过去 60 天
filters: [['created', '=', 'last_60_days']]

// 过去 90 天
filters: [['created', '=', 'last_90_days']]

// 未来 7 天
filters: [['created', '=', 'next_7_days']]

// 未来 30 天
filters: [['created', '=', 'next_30_days']]

// 未来 60 天
filters: [['created', '=', 'next_60_days']]

// 未来 90 天
filters: [['created', '=', 'next_90_days']]
```

## 逻辑操作符

### AND 操作符

连接多个条件，所有条件都必须满足。

**语法**:
```javascript
[condition1, 'and', condition2]
```

**示例**:
```javascript
// 默认使用 AND（可省略）
filters: [
  ['status', '=', 'active'],
  ['amount', '>', 1000]
]

// 显式使用 AND
filters: [
  ['status', '=', 'active'],
  'and',
  ['amount', '>', 1000]
]

// 多个 AND 条件
filters: [
  ['status', '=', 'active'],
  'and',
  ['amount', '>', 1000],
  'and',
  ['priority', '=', 'high']
]
```

### OR 操作符

连接多个条件，任一条件满足即可。

**语法**:
```javascript
[condition1, 'or', condition2]
```

**示例**:
```javascript
// 状态是 active 或 pending
filters: [
  ['status', '=', 'active'],
  'or',
  ['status', '=', 'pending']
]

// 多个 OR 条件
filters: [
  ['priority', '=', 'high'],
  'or',
  ['priority', '=', 'urgent'],
  'or',
  ['priority', '=', 'critical']
]

// 等同于使用 IN
filters: [['priority', 'in', ['high', 'urgent', 'critical']]]
```

## 复杂条件示例

### 示例 1: 混合 AND/OR

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

### 示例 2: 多层嵌套

```javascript
// status = 'active' AND (priority = 'high' OR (amount > 10000 AND customer_type = 'vip'))
filters: [
  ['status', '=', 'active'],
  'and',
  [
    ['priority', '=', 'high'],
    'or',
    [
      ['amount', '>', 10000],
      'and',
      ['customer_type', '=', 'vip']
    ]
  ]
]
```

### 示例 3: 日期范围和状态组合

```javascript
// 本月创建且状态为 active 或 pending 的记录
filters: [
  ['created', '=', 'this_month'],
  'and',
  [
    ['status', '=', 'active'],
    'or',
    ['status', '=', 'pending']
  ]
]
```

### 示例 4: 数值范围和字符串匹配

```javascript
// 金额在 1000-5000 之间且名称包含"公司"的记录
filters: [
  ['amount', 'between', [1000, 5000]],
  'and',
  ['name', 'contains', '公司']
]
```

## 操作符兼容性

| 操作符 | MongoDB | PostgreSQL | MySQL | 说明 |
|--------|---------|-----------|-------|------|
| = | ✓ | ✓ | ✓ | |
| != | ✓ | ✓ | ✓ | |
| > | ✓ | ✓ | ✓ | |
| >= | ✓ | ✓ | ✓ | |
| < | ✓ | ✓ | ✓ | |
| <= | ✓ | ✓ | ✓ | |
| contains | ✓ | ✓ | ✓ | |
| notcontains | ✓ | ✓ | ✓ | |
| startswith | ✓ | ✓ | ✓ | |
| endswith | ✓ | ✓ | ✓ | 部分数据库性能较低 |
| between | ✓ | ✓ | ✓ | |
| in | ✓ | ✓ | ✓ | |
| not in | ✓ | ✓ | ✓ | |

## 性能提示

### 1. 使用索引字段

```javascript
// 推荐：在索引字段上过滤
filters: [['status', '=', 'active']]

// 注意：未索引字段可能较慢
filters: [['description', 'contains', '关键词']]
```

### 2. 避免复杂的字符串操作

```javascript
// 推荐：精确匹配
filters: [['status', '=', 'active']]

// 注意：contains 查询较慢
filters: [['name', 'contains', '关键词']]

// 更慢：endswith 查询
filters: [['name', 'endswith', '有限公司']]
```

### 3. 使用 IN 代替多个 OR

```javascript
// 推荐：使用 IN
filters: [['status', 'in', ['active', 'pending', 'approved']]]

// 不推荐：多个 OR
filters: [
  ['status', '=', 'active'],
  'or',
  ['status', '=', 'pending'],
  'or',
  ['status', '=', 'approved']
]
```

### 4. 合理使用 between

```javascript
// 推荐：使用 between
filters: [['amount', 'between', [1000, 5000]]]

// 不推荐：分开的条件
filters: [
  ['amount', '>=', 1000],
  'and',
  ['amount', '<=', 5000]
]
```

## 常见错误

### 错误 1: 操作符拼写错误

```javascript
// 错误
filters: [['status', '==', 'active']]  // 应该是 '='

// 正确
filters: [['status', '=', 'active']]
```

### 错误 2: 数组格式错误

```javascript
// 错误
filters: ['status', '=', 'active']  // 缺少外层数组

// 正确
filters: [['status', '=', 'active']]
```

### 错误 3: 嵌套条件格式错误

```javascript
// 错误
filters: [
  'status', '=', 'active',
  'and',
  'amount', '>', 1000
]

// 正确
filters: [
  ['status', '=', 'active'],
  'and',
  ['amount', '>', 1000]
]
```

## 相关文档

- [ObjectQL 概述](./README.md)
- [查询语法详解](./query-syntax.md)
- [ObjectQL 最佳实践](./best-practices.md)
- [对象元数据](../metadata/object-metadata.md)
