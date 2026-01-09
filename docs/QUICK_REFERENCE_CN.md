# Steedos Platform 快速参考

> 版本: 3.0.12  
> 最后更新: 2026-01-09

本文档提供快速查阅的常用命令、API 和配置参考。

---

## 🚀 常用命令

### 项目管理

```bash
# 克隆项目
git clone https://github.com/steedos/steedos-platform.git

# 安装依赖
yarn

# 构建所有包
yarn build

# 启动开发服务器
yarn start

# 启动 Web 应用开发服务器
yarn webapp

# 清理依赖
yarn clean

# Docker 启动所有服务
yarn docker

# 仅启动数据库服务
yarn docker:db
```

### 创建新应用/包

```bash
# 创建新应用
npx create-steedos-app my-app
cd my-app
yarn install
yarn start

# 创建新软件包
npx create-steedos-package my-package
```

### Moleculer REPL

```bash
# 启动 REPL
yarn repl

# REPL 常用命令
mol$ actions                    # 列出所有 actions
mol$ services                   # 列出所有 services
mol$ nodes                      # 列出所有节点
mol$ info objectql              # 查看服务信息
mol$ call objectql.find --objectName accounts
```

---

## 📊 ObjectQL API

### 查询 (find)

```javascript
const records = await objects.accounts.find({
  fields: ['name', 'industry', 'owner'],
  filters: [
    ['owner', '=', userId],
    ['industry', '=', 'tech']
  ],
  sort: 'created desc',
  top: 10,
  skip: 0
});
```

### 查询单条 (findOne)

```javascript
const record = await objects.accounts.findOne(
  recordId,
  {
    fields: ['name', 'industry']
  }
);
```

### 插入 (insert)

```javascript
const newRecord = await objects.accounts.insert(
  {
    name: '新客户',
    industry: 'tech',
    status: 'active'
  },
  userSession  // 可选，用于权限检查
);
```

### 更新 (update)

```javascript
const updated = await objects.accounts.update(
  recordId,
  {
    status: 'inactive',
    notes: '更新备注'
  },
  userSession  // 可选
);
```

### 删除 (delete)

```javascript
const result = await objects.accounts.delete(
  recordId,
  userSession  // 可选
);
```

### 聚合 (aggregate)

```javascript
const result = await objects.accounts.aggregate(
  {
    filters: [['industry', '=', 'tech']]
  },
  [
    { $group: { _id: '$industry', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ],
  userSession  // 可选
);
```

---

## 🔍 过滤器语法

### 基本操作符

```javascript
// 等于
['field', '=', 'value']

// 不等于
['field', '!=', 'value']

// 大于/小于
['age', '>', 18]
['age', '>=', 18]
['age', '<', 65]
['age', '<=', 65]

// 文本操作
['name', 'startswith', 'A']
['name', 'contains', '测试']
['name', 'notcontains', '删除']

// 范围
['age', 'between', [18, 65]]
```

### 组合条件

```javascript
// AND (默认)
[
  ['field1', '=', 'value1'],
  ['field2', '=', 'value2']
]

// 显式 AND
[
  ['field1', '=', 'value1'],
  'and',
  ['field2', '=', 'value2']
]

// OR
[
  ['field1', '=', 'value1'],
  'or',
  ['field2', '=', 'value2']
]

// 复杂组合
[
  [
    ['status', '=', 'active'],
    'or',
    ['status', '=', 'pending']
  ],
  'and',
  ['owner', '=', userId]
]
```

### 数组值

```javascript
// IN 操作 (自动转换)
['status', '=', ['active', 'pending']]
// 等同于
[
  ['status', '=', 'active'],
  'or',
  ['status', '=', 'pending']
]

// NOT IN
['status', '!=', ['closed', 'deleted']]
```

---

## 🎯 元数据定义

### 对象定义 (Object)

```yaml
# custom_object.object.yml
name: custom_object
label: 自定义对象
icon: account
enable_search: true
enable_files: true
enable_tasks: true
enable_notes: true
fields:
  name:
    type: text
    label: 名称
    required: true
    searchable: true
  status:
    type: select
    label: 状态
    options:
      - label: 草稿
        value: draft
      - label: 已发布
        value: published
    default_value: draft
  owner:
    type: lookup
    reference_to: users
    label: 所有者
  amount:
    type: currency
    label: 金额
    precision: 2
list_views:
  all:
    label: 所有
    columns: [name, status, owner, created]
    filter_scope: space
    filters: []
  recent:
    label: 最近查看
    columns: [name, status, modified]
    filter_scope: space
    filters: []
permission_set:
  user:
    allowCreate: true
    allowRead: true
    allowEdit: true
    allowDelete: false
  admin:
    allowCreate: true
    allowRead: true
    allowEdit: true
    allowDelete: true
    modifyAllRecords: true
    viewAllRecords: true
```

### 字段类型

| 类型 | 说明 | 示例 |
|------|------|------|
| text | 文本 | `type: text` |
| textarea | 多行文本 | `type: textarea, rows: 3` |
| number | 数字 | `type: number, scale: 2` |
| currency | 货币 | `type: currency, precision: 2` |
| percent | 百分比 | `type: percent, scale: 2` |
| boolean | 布尔 | `type: boolean` |
| date | 日期 | `type: date` |
| datetime | 日期时间 | `type: datetime` |
| select | 下拉选择 | `type: select, options: [...]` |
| lookup | 查找关系 | `type: lookup, reference_to: users` |
| master_detail | 主从关系 | `type: master_detail, reference_to: accounts` |
| grid | 子表 | `type: grid` |
| file | 文件 | `type: file` |
| image | 图片 | `type: image` |
| url | URL | `type: url` |
| email | 邮箱 | `type: email` |
| autonumber | 自动编号 | `type: autonumber, formula: 'A{0000}'` |
| formula | 公式 | `type: formula, data_type: text` |
| summary | 汇总 | `type: summary, summary_type: count` |

### 应用定义 (App)

```yaml
# custom_app.app.yml
_id: custom_app
name: 自定义应用
description: 应用描述
icon: apps
is_creator: true
visible: true
sort: 100
objects:
  - custom_object
  - accounts
  - contacts
```

### 权限集 (Permission Set)

```yaml
# custom.permissionset.yml
name: custom_permission
label: 自定义权限
license: platform
object_permissions:
  accounts:
    allowCreate: true
    allowDelete: false
    allowEdit: true
    allowRead: true
    modifyAllRecords: false
    viewAllRecords: true
field_permissions:
  accounts.revenue:
    readable: true
    editable: true
  accounts.secret_field:
    readable: false
    editable: false
```

---

## 🔧 触发器

### 完整触发器示例

```javascript
// accounts.trigger.js
module.exports = {
  listenTo: 'accounts',
  
  beforeInsert: async function() {
    const { doc } = this;
    // 插入前逻辑
    if (!doc.code) {
      doc.code = await generateCode('ACC');
    }
  },
  
  afterInsert: async function() {
    const { doc, id } = this;
    // 插入后逻辑
    console.log('新记录创建:', doc.name);
  },
  
  beforeUpdate: async function() {
    const { doc, previousDoc } = this;
    // 更新前逻辑
    if (doc.status !== previousDoc.status) {
      console.log('状态变更:', previousDoc.status, '->', doc.status);
    }
  },
  
  afterUpdate: async function() {
    const { doc, previousDoc } = this;
    // 更新后逻辑
  },
  
  beforeDelete: async function() {
    const { id } = this;
    // 删除前逻辑 - 可以抛出错误阻止删除
    const hasRelated = await checkRelatedRecords(id);
    if (hasRelated) {
      throw new Error('存在关联数据，无法删除');
    }
  },
  
  afterDelete: async function() {
    const { previousDoc } = this;
    // 删除后逻辑
    console.log('记录已删除:', previousDoc.name);
  }
};
```

### 触发器上下文

```javascript
{
  userId,        // 当前用户 ID
  spaceId,       // 当前工作区 ID  
  objectName,    // 对象名称
  id,            // 记录 ID (insert 时为空)
  doc,           // 当前文档
  previousDoc,   // 更新/删除前的文档
  datasource     // 数据源实例
}
```

---

## 🌐 REST API

### 基础 URL

```
http://localhost:5100/api/v4
```

### 认证

```bash
# 登录获取 Token
curl -X POST http://localhost:5100/api/v4/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password"
  }'

# 使用 Token
curl -H "Authorization: Bearer <token>" \
  http://localhost:5100/api/v4/accounts
```

### CRUD 操作

```bash
# 查询
POST /api/v4/:objectName/find
{
  "fields": ["name", "industry"],
  "filters": [["owner", "=", "userId"]],
  "top": 10
}

# 查询单条
GET /api/v4/:objectName/:id

# 插入
POST /api/v4/:objectName
{
  "name": "新记录",
  "status": "active"
}

# 更新
PUT /api/v4/:objectName/:id
{
  "status": "inactive"
}

# 删除
DELETE /api/v4/:objectName/:id
```

---

## 🔐 环境变量

### 基础配置

```bash
# 服务配置
ROOT_URL=http://localhost:5100
PORT=5100
NODE_ENV=development

# 数据库
MONGO_URL=mongodb://localhost:27017/steedos
MONGO_OPLOG_URL=mongodb://localhost:27017/local

# Redis
REDIS_URL=redis://localhost:6379

# Moleculer
TRANSPORTER=redis://localhost:6379
CACHER=redis://localhost:6379

# 日志
STEEDOS_LOG_LEVEL=info  # trace, debug, info, warn, error
```

### 邮件配置

```bash
MAIL_URL=smtp://username:password@smtp.example.com:587
MAIL_FROM=noreply@example.com
```

### 文件存储

```bash
# 本地存储
STEEDOS_STORAGE_DIR=/app/storage

# S3 存储
STEEDOS_CFS_STORE=S3
STEEDOS_CFS_AWS_S3_BUCKET=my-bucket
STEEDOS_CFS_AWS_S3_REGION=us-east-1
STEEDOS_CFS_AWS_S3_ENDPOINT=https://s3.amazonaws.com
```

---

## 🎨 Amis 页面配置

### 基础页面

```yaml
# custom_page.page.yml
name: custom_page
label: 自定义页面
type: page
body:
  type: crud
  api: /api/v4/accounts/find
  columns:
    - name: name
      label: 名称
      searchable: true
    - name: status
      label: 状态
      type: select
```

---

## 📝 公式语法

### 常用函数

```javascript
// 文本函数
CONCATENATE(text1, text2, ...)  // 连接文本
UPPER(text)                     // 转大写
LOWER(text)                     // 转小写
LEN(text)                       // 文本长度

// 数学函数
SUM(num1, num2, ...)           // 求和
AVERAGE(num1, num2, ...)       // 平均值
MAX(num1, num2, ...)           // 最大值
MIN(num1, num2, ...)           // 最小值
ROUND(number, decimals)        // 四舍五入

// 日期函数
TODAY()                        // 今天
NOW()                          // 当前时间
YEAR(date)                     // 年份
MONTH(date)                    // 月份
DAY(date)                      // 天数

// 逻辑函数
IF(condition, value_if_true, value_if_false)
AND(condition1, condition2, ...)
OR(condition1, condition2, ...)
NOT(condition)
```

---

## 🐛 调试技巧

### 日志输出

```javascript
// 在触发器或 Action 中
console.log('Debug info:', data);
this.logger.info('Info message');
this.logger.error('Error message');
```

### 设置日志级别

```javascript
// steedos.config.js
module.exports = {
  logLevel: "debug"  // trace, debug, info, warn, error, fatal
};
```

### VS Code 断点调试

1. 在代码中设置断点
2. 按 F5 启动调试
3. 或在终端运行: `node --inspect server.js`

---

## 📚 相关链接

- **官方文档**: [docs.steedos.com](https://docs.steedos.com/)
- **核心架构**: [CORE_ARCHITECTURE_CN.md](./CORE_ARCHITECTURE_CN.md)
- **开发者指南**: [DEVELOPER_GUIDE_CN.md](./DEVELOPER_GUIDE_CN.md)
- **包和服务索引**: [PACKAGES_INDEX_CN.md](./PACKAGES_INDEX_CN.md)
- **GitHub**: [github.com/steedos/steedos-platform](https://github.com/steedos/steedos-platform)

---

**快速参考版本**: 3.0.12  
**最后更新**: 2026-01-09
