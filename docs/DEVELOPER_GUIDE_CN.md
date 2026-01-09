# Steedos Platform 开发者指南

> 版本: 3.0.12  
> 最后更新: 2026-01-09

## 目录

- [1. 开发环境搭建](#1-开发环境搭建)
- [2. 项目结构详解](#2-项目结构详解)
- [3. 开发工作流](#3-开发工作流)
- [4. 元数据开发](#4-元数据开发)
- [5. 业务逻辑开发](#5-业务逻辑开发)
- [6. API 开发](#6-api-开发)
- [7. 测试](#7-测试)
- [8. 调试技巧](#8-调试技巧)
- [9. 最佳实践](#9-最佳实践)

---

## 1. 开发环境搭建

### 1.1 系统要求

- **Node.js**: ≥22.0.0
- **Yarn**: 3.8.7 (推荐使用 Yarn 3)
- **MongoDB**: ≥4.2.17
- **Redis**: ≥6.2.6 (可选，用于缓存和消息队列)

### 1.2 克隆项目

```bash
# 克隆仓库
git clone https://github.com/steedos/steedos-platform.git
cd steedos-platform

# 安装依赖
yarn

# 构建所有包
yarn build
```

### 1.3 启动 MongoDB 和 Redis

**使用 Docker Compose (推荐)**:

```bash
# 启动数据库服务
yarn docker:db
```

这会启动以下服务：
- MongoDB (端口 27017)
- Redis (端口 6379)
- NATS (端口 4222)

**手动启动**:

```bash
# 启动 MongoDB
mongod --dbpath /data/db

# 启动 Redis
redis-server
```

### 1.4 启动开发服务器

```bash
# 启动主服务器
yarn start

# 访问应用
# 浏览器打开: http://localhost:5100
```

### 1.5 开发 Web 应用

```bash
# 在另一个终端启动 webapp 开发服务器
yarn webapp

# 访问开发服务器
# 浏览器打开: http://localhost:3000
```

---

## 2. 项目结构详解

### 2.1 顶层目录

```
steedos-platform/
├── packages/          # 核心 NPM 包 (26个)
├── services/          # 微服务模块 (39个)
├── builder6/          # 构建器应用
│   ├── server/        # 主服务器 (@steedos/server)
│   ├── webapp/        # Web 前端应用
│   └── ai/            # AI 相关模块
├── ee/                # 企业版功能
│   ├── branding/      # 品牌定制
│   └── service-enterprise/  # 企业服务
├── deploy/            # 部署配置
│   ├── cluster/       # 集群部署
│   └── enterprise/    # 企业部署
├── docs/              # 文档
└── test/              # 测试文件
```

### 2.2 核心包目录 (packages/)

| 包名 | 说明 |
|------|------|
| `objectql` | 对象查询语言核心 |
| `metadata-core` | 元数据核心引擎 |
| `metadata-api` | 元数据 API |
| `metadata-registrar` | 元数据注册器 |
| `accounts` | 账户管理 |
| `auth` | 认证模块 |
| `process` | 流程引擎 |
| `filters` | 过滤器库 |
| `formula` | 公式计算引擎 |
| `i18n` | 国际化 |
| `router` | 路由管理 |
| `utils` | 工具函数库 |
| `schemas` | Schema 定义 |
| `client` | 客户端 SDK |
| `cli` | 命令行工具 |
| `create-steedos-app` | 应用脚手架 |
| `create-steedos-package` | 包脚手架 |
| `moleculer-apollo-server` | GraphQL 服务器 |
| `odata-v4-*` | OData v4 相关包 |
| `cachers` | 缓存管理 |
| `migrate` | 数据迁移 |
| `data-import` | 数据导入 |

### 2.3 服务目录 (services/)

**元数据服务**:
- `service-metadata` - 元数据管理
- `service-metadata-server` - 元数据服务器
- `service-metadata-objects` - 对象元数据
- `service-metadata-apps` - 应用元数据
- `service-metadata-layouts` - 页面布局
- `service-metadata-tabs` - 选项卡
- `service-metadata-permissionsets` - 权限集
- `service-metadata-triggers` - 触发器
- `service-metadata-translations` - 翻译

**核心服务**:
- `service-api` - API 网关
- `service-objectql` - ObjectQL 服务
- `service-accounts` - 账户服务
- `service-rest` - REST API
- `service-object-graphql` - GraphQL API

**标准服务**:
- `standard-accounts` - 标准账户对象
- `standard-object-database` - 标准对象数据库
- `standard-permission` - 标准权限
- `standard-process-approval` - 标准审批流程
- `standard-ui` - 标准 UI 组件

**其他服务**:
- `service-package-loader` - 包加载器
- `service-package-registry` - 包注册中心
- `service-pages` - 页面服务
- `service-ui` - UI 服务
- `service-plugin-amis` - Amis 插件
- `service-bull-dashboard` - Bull 队列监控
- `moleculer-bullmq` - BullMQ 集成

---

## 3. 开发工作流

### 3.1 Monorepo 管理

项目使用 **Lerna** 和 **Yarn Workspaces** 管理 monorepo：

```json
// lerna.json
{
  "packages": [
    "packages/*",
    "services/*",
    "ee/**",
    "builder6/*"
  ],
  "npmClient": "yarn",
  "version": "3.0.12"
}
```

### 3.2 常用命令

```bash
# 安装依赖
yarn

# 构建所有包
yarn build

# 启动服务器
yarn start

# 启动 webapp
yarn webapp

# 清理 node_modules
yarn clean

# 发布新版本 (beta)
yarn release:beta

# 运行 Docker 环境
yarn docker

# 仅启动数据库
yarn docker:db
```

### 3.3 包管理

**添加依赖到特定包**:

```bash
# 在 packages/objectql 中添加依赖
cd packages/objectql
yarn add lodash
```

**在 workspace 根目录添加依赖**:

```bash
# 添加到所有 workspace
yarn add -W <package-name>
```

### 3.4 代码格式化

项目使用 **Prettier** 和 **ESLint**：

```bash
# 格式化代码 (通过 git hooks 自动执行)
prettier --write "**/*.ts"

# Lint 检查
eslint .
```

---

## 4. 元数据开发

### 4.1 对象定义

**创建对象**:

```yaml
# objects/custom_object.object.yml
name: custom_object
label: 自定义对象
icon: account
fields:
  name:
    type: text
    label: 名称
    required: true
  description:
    type: textarea
    label: 描述
  status:
    type: select
    label: 状态
    options:
      - label: 草稿
        value: draft
      - label: 已发布
        value: published
  owner:
    type: lookup
    reference_to: users
    label: 所有者
list_views:
  all:
    label: 所有
    filter_scope: space
    columns:
      - name
      - status
      - owner
      - created
permission_set:
  user:
    allowRead: true
    allowCreate: true
    allowEdit: true
    allowDelete: false
```

**字段类型**:
- `text` - 文本
- `textarea` - 多行文本
- `number` - 数字
- `currency` - 货币
- `date` - 日期
- `datetime` - 日期时间
- `boolean` - 布尔
- `select` - 下拉选择
- `lookup` - 查找关系
- `master_detail` - 主从关系
- `grid` - 子表
- `file` - 文件
- `image` - 图片

### 4.2 应用定义

```yaml
# applications/custom_app.app.yml
_id: custom_app
name: 自定义应用
description: 这是一个自定义应用
icon: apps
is_creator: true
visible: true
sort: 100
objects:
  - custom_object
  - accounts
  - contacts
```

### 4.3 页面布局

```yaml
# layouts/custom_object_default.layout.yml
name: custom_object_default
object_name: custom_object
profiles:
  - user
  - admin
sections:
  - label: 基本信息
    columns: 2
    fields:
      - name
      - status
      - owner
      - description
```

### 4.4 权限集

```yaml
# permissionsets/sales_manager.permissionset.yml
name: sales_manager
label: 销售经理
license: platform
object_permissions:
  accounts:
    allowCreate: true
    allowDelete: false
    allowEdit: true
    allowRead: true
    modifyAllRecords: true
    viewAllRecords: true
  contacts:
    allowCreate: true
    allowDelete: false
    allowEdit: true
    allowRead: true
field_permissions:
  accounts.revenue:
    readable: true
    editable: true
```

---

## 5. 业务逻辑开发

### 5.1 触发器 (Triggers)

**Before/After 触发器**:

```javascript
// triggers/accounts.trigger.js
module.exports = {
  // 插入前触发
  beforeInsert: async function() {
    const { doc } = this;
    // 自动生成编号
    if (!doc.code) {
      doc.code = await generateCode('ACC');
    }
  },
  
  // 插入后触发
  afterInsert: async function() {
    const { doc, id } = this;
    // 发送通知
    await sendNotification({
      to: doc.owner,
      message: `新客户创建: ${doc.name}`
    });
  },
  
  // 更新前触发
  beforeUpdate: async function() {
    const { doc, previousDoc } = this;
    // 状态变更检查
    if (doc.status !== previousDoc.status) {
      // 验证状态转换
      validateStatusChange(previousDoc.status, doc.status);
    }
  },
  
  // 删除前触发
  beforeDelete: async function() {
    const { id } = this;
    // 检查关联数据
    const relatedCount = await objects.contacts.count({
      filters: [['account', '=', id]]
    });
    if (relatedCount > 0) {
      throw new Error('存在关联联系人，无法删除');
    }
  }
};
```

**触发器上下文**:

```javascript
{
  userId,        // 当前用户 ID
  spaceId,       // 当前工作区 ID
  objectName,    // 对象名称
  id,            // 记录 ID
  doc,           // 当前文档
  previousDoc,   // 更新前的文档 (仅 update)
  datasource     // 数据源实例
}
```

### 5.2 自定义 Actions

```javascript
// actions/accounts.action.js
module.exports = {
  // 自定义 Action
  sendWelcomeEmail: async function(object_name, record_id, userSession) {
    // 获取记录
    const account = await this.broker.call(
      'objectql.findOne',
      {
        objectName: object_name,
        id: record_id,
        fields: ['name', 'email', 'owner']
      }
    );
    
    // 发送邮件
    await this.broker.call('email.send', {
      to: account.email,
      subject: '欢迎使用我们的服务',
      template: 'welcome',
      data: { name: account.name }
    });
    
    return { success: true, message: '欢迎邮件已发送' };
  },
  
  // 批量操作
  batchUpdateStatus: async function(object_name, record_ids, status, userSession) {
    const results = [];
    for (const id of record_ids) {
      const result = await this.broker.call(
        'objectql.update',
        {
          objectName: object_name,
          id,
          doc: { status },
          userSession
        }
      );
      results.push(result);
    }
    return results;
  }
};
```

### 5.3 自定义服务

```javascript
// services/custom.service.js
module.exports = {
  name: "custom",
  
  actions: {
    // 自定义 Action
    calculateCommission: {
      params: {
        amount: "number",
        rate: "number"
      },
      async handler(ctx) {
        const { amount, rate } = ctx.params;
        return amount * rate;
      }
    },
    
    // 调用其他服务
    createAccountWithContact: {
      async handler(ctx) {
        const { accountData, contactData } = ctx.params;
        
        // 创建账户
        const account = await ctx.call('objectql.insert', {
          objectName: 'accounts',
          doc: accountData,
          userSession: ctx.meta.user
        });
        
        // 创建联系人
        contactData.account = account._id;
        const contact = await ctx.call('objectql.insert', {
          objectName: 'contacts',
          doc: contactData,
          userSession: ctx.meta.user
        });
        
        return { account, contact };
      }
    }
  },
  
  events: {
    // 订阅事件
    "objectql.inserted.accounts": async function(ctx) {
      const { doc } = ctx.params;
      this.logger.info(`New account created: ${doc.name}`);
      // 执行后续逻辑
    }
  },
  
  methods: {
    // 私有方法
    calculateTotal(items) {
      return items.reduce((sum, item) => sum + item.amount, 0);
    }
  },
  
  async started() {
    this.logger.info("Custom service started");
  }
};
```

---

## 6. API 开发

### 6.1 REST API

**调用 ObjectQL**:

```bash
# 查询
curl -X POST http://localhost:5100/api/v4/accounts/find \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "fields": ["name", "industry"],
    "filters": [["owner", "=", "userId"]],
    "top": 10
  }'

# 插入
curl -X POST http://localhost:5100/api/v4/accounts \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "新客户",
    "industry": "tech"
  }'

# 更新
curl -X PUT http://localhost:5100/api/v4/accounts/:id \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "active"
  }'

# 删除
curl -X DELETE http://localhost:5100/api/v4/accounts/:id \
  -H "Authorization: Bearer <token>"
```

### 6.2 GraphQL API

```graphql
# 查询
query {
  accounts(
    filters: [["owner", "=", "userId"]]
    sort: "created desc"
    top: 10
  ) {
    _id
    name
    industry
    owner {
      name
      email
    }
  }
}

# 插入
mutation {
  accounts__insert(
    doc: {
      name: "新客户"
      industry: "tech"
    }
  ) {
    _id
    name
  }
}

# 更新
mutation {
  accounts__update(
    id: "xxxxx"
    doc: {
      status: "active"
    }
  ) {
    _id
    status
  }
}
```

### 6.3 OData API

```bash
# 查询
curl "http://localhost:5100/api/odata/v4/accounts?\$select=name,industry&\$filter=owner eq 'userId'&\$top=10"

# 聚合
curl "http://localhost:5100/api/odata/v4/accounts?\$apply=groupby((industry),aggregate(amount with sum as total))"
```

---

## 7. 测试

### 7.1 单元测试

```javascript
// test/unit/objectql.test.ts
import { expect } from 'chai';
import { getObject } from '@steedos/objectql';

describe('ObjectQL', () => {
  it('should find records', async () => {
    const accounts = getObject('accounts');
    const records = await accounts.find({
      filters: [['name', 'contains', 'test']]
    });
    expect(records).to.be.an('array');
  });
  
  it('should insert record', async () => {
    const accounts = getObject('accounts');
    const doc = {
      name: 'Test Account',
      industry: 'tech'
    };
    const result = await accounts.insert(doc);
    expect(result).to.have.property('_id');
    expect(result.name).to.equal('Test Account');
  });
});
```

### 7.2 运行测试

```bash
# 运行所有测试
yarn test

# 运行特定包的测试
cd packages/objectql
yarn test
```

---

## 8. 调试技巧

### 8.1 日志级别

在 `steedos.config.js` 中设置：

```javascript
module.exports = {
  logLevel: "debug", // trace, debug, info, warn, error, fatal
};
```

### 8.2 VS Code 调试配置

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Steedos Server",
      "runtimeExecutable": "yarn",
      "runtimeArgs": ["start"],
      "cwd": "${workspaceFolder}",
      "console": "integratedTerminal"
    }
  ]
}
```

### 8.3 Moleculer REPL

```bash
# 启动 REPL
yarn repl

# REPL 命令
mol$ actions        # 列出所有 actions
mol$ services       # 列出所有 services
mol$ call objectql.find --objectName accounts --fields name
```

---

## 9. 最佳实践

### 9.1 元数据组织

- 使用有意义的命名约定
- 按功能模块组织元数据文件
- 使用 `extend` 扩展对象而不是修改原对象
- 添加详细的 `label` 和 `description`

### 9.2 代码风格

- 遵循 TypeScript 最佳实践
- 使用 async/await 而不是 callbacks
- 适当的错误处理
- 编写单元测试

### 9.3 性能优化

- 使用 Redis 缓存
- 限制 `fields` 字段，只查询需要的字段
- 使用索引优化查询
- 避免 N+1 查询

### 9.4 安全性

- 始终传递 `userSession` 进行权限检查
- 验证用户输入
- 使用参数化查询
- 定期更新依赖包

---

## 附录

### A. 环境变量

创建 `.env.local` 文件：

```bash
# 服务配置
ROOT_URL=http://localhost:5100
PORT=5100

# 数据库
MONGO_URL=mongodb://localhost:27017/steedos
MONGO_OPLOG_URL=mongodb://localhost:27017/local

# Redis
REDIS_URL=redis://localhost:6379

# Moleculer
TRANSPORTER=redis://localhost:6379
CACHER=redis://localhost:6379

# 日志
STEEDOS_LOG_LEVEL=debug

# 邮件
MAIL_URL=smtp://user:pass@smtp.example.com:587
```

### B. 常见问题

**Q: 修改元数据后不生效？**
A: 重启服务器或调用 `/api/metadata/reload`

**Q: 如何调试触发器？**
A: 在触发器中使用 `console.log()` 或设置 `logLevel: "debug"`

**Q: 如何清除缓存？**
A: 重启 Redis 或调用 `broker.cacher.clean()`

---

**文档维护者**: Steedos 开发团队  
**需要帮助?**: [GitHub Discussions](https://github.com/steedos/steedos-platform/discussions)
