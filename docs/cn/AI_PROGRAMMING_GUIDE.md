# Steedos Platform AI 编程指引

> **版本**: 3.0  
> **最后更新**: 2026-01-12  
> **适用范围**: Steedos Platform 全栈开发

## 📋 目录

- [1. 项目概述](#1-项目概述)
- [2. 代码库架构](#2-代码库架构)
- [3. 开发环境配置](#3-开发环境配置)
- [4. 编码规范与最佳实践](#4-编码规范与最佳实践)
- [5. 元数据开发指南](#5-元数据开发指南)
- [6. 微服务开发](#6-微服务开发)
- [7. API 开发](#7-api-开发)
- [8. 前端开发](#8-前端开发)
- [9. AI 功能集成](#9-ai-功能集成)
- [10. 测试策略](#10-测试策略)
- [11. 构建与发布](#11-构建与发布)
- [12. 故障排查](#12-故障排查)
- [13. 常见问题](#13-常见问题)

---

## 1. 项目概述

### 1.1 项目简介

**Steedos Platform (华炎魔方)** 是下一代 AI 原生低代码开发平台，将 Salesforce 级别的元数据驱动架构与生成式 AI 深度融合。

**核心特性**:
- 🤖 **AI 优先**: Prompt-Driven 开发模式
- 🧠 **元数据驱动**: 所有配置以 YAML/JSON 格式存储
- ⚛️ **现代技术栈**: Node.js + React + Amis
- 🚀 **微服务架构**: 基于 Moleculer 框架
- ☁️ **灵活部署**: 支持私有部署和混合云

### 1.2 技术栈

**后端核心**:
- **运行时**: Node.js ≥22.0.0
- **语言**: TypeScript 5.7.3
- **微服务框架**: Moleculer
- **数据库**: MongoDB (元数据), MySQL/PostgreSQL/Oracle (业务数据)
- **缓存**: Redis 6.2.6+
- **消息队列**: NATS, BullMQ

**前端核心**:
- **框架**: React
- **低代码引擎**: 百度 Amis
- **构建工具**: Webpack, Vite

**构建工具**:
- **包管理**: Yarn 3.8.7
- **Monorepo**: Lerna 9.x
- **TypeScript 编译**: tsc, tslib

### 1.3 仓库统计

- **核心包 (packages/)**: 27 个 NPM 包
- **微服务 (services/)**: 39 个微服务模块
- **企业版 (ee/)**: 企业版功能模块
- **Builder6 (builder6/)**: 主应用和 AI 模块
- **代码量**: 100 万+ 行代码
- **TypeScript 文件**: 756 个
- **JavaScript 文件**: 493 个

---

## 2. 代码库架构

### 2.1 目录结构

```
steedos-platform/
├── packages/              # 核心 NPM 包 (27 个)
│   ├── accounts/          # 账户管理
│   ├── auth/              # 身份认证
│   ├── cli/               # 命令行工具
│   ├── objectql/          # 对象查询语言 (OQL)
│   ├── metadata-core/     # 元数据核心
│   ├── metadata-api/      # 元数据 API
│   ├── formula/           # 公式引擎
│   └── ...
│
├── services/              # 微服务模块 (39 个)
│   ├── service-api/       # API 网关
│   ├── service-metadata/  # 元数据服务
│   ├── service-accounts/  # 账户服务
│   ├── service-community/ # 社区版功能
│   └── ...
│
├── builder6/              # Builder 应用
│   ├── server/            # 主服务器 (@steedos/server)
│   ├── webapp/            # Web 前端应用
│   └── ai/                # AI 相关模块
│
├── ee/                    # 企业版功能模块
├── docs/                  # 开发文档
├── test/                  # 测试文件
└── deploy/                # 部署配置

```

### 2.2 核心包说明

#### 2.2.1 元数据层
- **@steedos/metadata-core**: 元数据核心引擎，负责元数据的加载、解析和验证
- **@steedos/metadata-api**: 元数据 API，提供元数据的增删改查接口
- **@steedos/metadata-registrar**: 元数据注册器

#### 2.2.2 数据访问层
- **@steedos/objectql**: 对象查询语言，统一的数据访问接口
- **@steedos/filters**: 数据过滤器
- **@steedos/formula**: 公式引擎，支持字段计算

#### 2.2.3 认证授权层
- **@steedos/auth**: 认证模块
- **@steedos/accounts**: 账户管理

#### 2.2.4 工具层
- **@steedos/cli**: 命令行工具
- **@steedos/i18n**: 国际化
- **@steedos/client**: 客户端 SDK

### 2.3 微服务架构

Steedos 采用 Moleculer 微服务框架，每个 service 都是独立的微服务节点。

**核心服务**:
- **service-api**: API 网关，统一入口
- **service-metadata**: 元数据管理服务
- **service-metadata-objects**: 对象元数据服务
- **service-accounts**: 账户服务
- **service-identity-jwt**: JWT 身份验证服务

### 2.4 元数据存储结构

元数据以文件形式存储在项目中:

```
steedos-app/
└── src/
    └── .steedos/
        ├── objects/           # 对象定义
        │   ├── accounts.object.yml
        │   └── contacts.object.yml
        ├── applications/      # 应用定义
        ├── layouts/           # 页面布局
        ├── flows/             # 流程定义
        ├── triggers/          # 触发器
        └── reports/           # 报表
```

---

## 3. 开发环境配置

### 3.1 系统要求

**必需组件**:
- **Node.js**: ≥22.0.0 (使用 `nvm` 管理版本)
- **Yarn**: 3.8.7 (Yarn 3)
- **MongoDB**: ≥4.2.17
- **Redis**: ≥6.2.6 (可选，用于缓存)

**推荐配置**:
- **内存**: 8GB+
- **硬盘**: 20GB+ 可用空间
- **操作系统**: macOS, Linux, WSL2

### 3.2 环境初始化

```bash
# 1. 克隆仓库
git clone https://github.com/steedos/steedos-platform.git
cd steedos-platform

# 2. 安装依赖
yarn

# 3. Bootstrap (链接本地包)
yarn bootstrap

# 4. 构建所有包
yarn build

# 5. 启动数据库服务 (使用 Docker)
yarn docker:db

# 6. 启动开发服务器
yarn start
```

### 3.3 环境变量配置

创建 `.env.local` 文件:

```bash
# MongoDB 连接
MONGO_URL=mongodb://127.0.0.1:27017/steedos

# Redis 连接 (可选)
REDIS_URL=redis://127.0.0.1:6379

# 根 URL
ROOT_URL=http://localhost:5100

# AI 配置 (OpenAI 兼容)
OPENAI_API_KEY=your_api_key
OPENAI_BASE_URL=https://api.openai.com/v1

# 日志级别
STEEDOS_LOG_LEVEL=debug
```

### 3.4 IDE 配置

**推荐 VSCode 插件**:
- ESLint
- Prettier
- TypeScript and JavaScript Language Features
- YAML
- MongoDB for VS Code

**VSCode 配置** (`.vscode/settings.json`):

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "typescript.tsdk": "node_modules/typescript/lib",
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ]
}
```

---

## 4. 编码规范与最佳实践

### 4.1 TypeScript 规范

#### 4.1.1 类型定义

**✅ 推荐做法**:

```typescript
// 使用 interface 定义对象结构
interface SteedosObject {
  name: string;
  label: string;
  fields: Record<string, SteedosField>;
  triggers?: SteedosTrigger[];
}

// 使用 type 定义联合类型和复杂类型
type FieldType = 'text' | 'number' | 'date' | 'lookup' | 'master_detail';

// 避免使用 any，使用 unknown 代替
function parseMetadata(data: unknown): SteedosObject {
  // 进行类型检查
  if (typeof data !== 'object' || data === null) {
    throw new Error('Invalid metadata');
  }
  // ...
}
```

**❌ 避免**:

```typescript
// 避免使用 any
function processData(data: any): any {
  return data;
}

// 避免类型断言滥用
const obj = {} as SteedosObject; // 危险
```

#### 4.1.2 函数定义

```typescript
// 使用明确的返回类型
async function getObject(objectName: string): Promise<SteedosObject | null> {
  // ...
}

// 使用可选参数和默认值
function findRecords(
  objectName: string,
  filters?: Record<string, any>,
  fields?: string[],
  options: { top?: number; skip?: number } = {}
): Promise<any[]> {
  // ...
}
```

### 4.2 命名规范

#### 4.2.1 文件命名

```
# TypeScript 源文件
objectql.ts
metadata-manager.ts

# 测试文件
objectql.test.ts
metadata-manager.spec.ts

# 类型定义文件
types.d.ts
index.d.ts
```

#### 4.2.2 变量和函数命名

```typescript
// 使用 camelCase
const objectName = 'accounts';
const userInfo = getCurrentUser();

// 常量使用 UPPER_SNAKE_CASE
const DEFAULT_PAGE_SIZE = 20;
const MAX_RETRY_COUNT = 3;

// 类和接口使用 PascalCase
class ObjectManager {}
interface SteedosUser {}

// 私有成员使用下划线前缀
class DataLoader {
  private _cache: Map<string, any>;
  
  private _loadData(): void {}
}

// 布尔值使用 is/has/can 前缀
const isValid = true;
const hasPermission = false;
const canEdit = true;
```

### 4.3 代码组织

#### 4.3.1 模块导入顺序

```typescript
// 1. Node.js 内置模块
import { join } from 'path';
import { readFile } from 'fs/promises';

// 2. 第三方库
import _ from 'lodash';
import { Service, ServiceBroker } from 'moleculer';

// 3. Steedos 核心包
import { objectql } from '@steedos/objectql';
import { loadMetadata } from '@steedos/metadata-core';

// 4. 相对路径导入
import { parseYaml } from './utils';
import type { MetadataOptions } from './types';
```

#### 4.3.2 代码结构

```typescript
/**
 * 对象查询管理器
 * 负责处理对象的 CRUD 操作
 */
export class ObjectQueryManager {
  private broker: ServiceBroker;
  private cache: Map<string, any>;

  constructor(broker: ServiceBroker) {
    this.broker = broker;
    this.cache = new Map();
  }

  /**
   * 查询对象记录
   * @param objectName 对象名称
   * @param filters 过滤条件
   * @returns 记录列表
   */
  async find(
    objectName: string,
    filters?: Record<string, any>
  ): Promise<any[]> {
    // 实现...
  }

  // 其他方法...
}
```

### 4.4 错误处理

```typescript
// 使用自定义错误类
export class SteedosError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'SteedosError';
  }
}

// 在函数中使用
async function validateObject(objectName: string): Promise<void> {
  if (!objectName) {
    throw new SteedosError(
      'Object name is required',
      'INVALID_OBJECT_NAME',
      400
    );
  }

  const obj = await getObject(objectName);
  if (!obj) {
    throw new SteedosError(
      `Object ${objectName} not found`,
      'OBJECT_NOT_FOUND',
      404
    );
  }
}

// 在调用时捕获
try {
  await validateObject('accounts');
} catch (error) {
  if (error instanceof SteedosError) {
    console.error(`Error [${error.code}]: ${error.message}`);
  } else {
    console.error('Unexpected error:', error);
  }
}
```

### 4.5 异步编程

```typescript
// ✅ 使用 async/await
async function loadAllObjects(): Promise<SteedosObject[]> {
  const objectNames = await getObjectNames();
  const objects = await Promise.all(
    objectNames.map(name => getObject(name))
  );
  return objects.filter(obj => obj !== null);
}

// ✅ 处理并发控制
async function processRecordsInBatch(
  records: any[],
  batchSize: number = 10
): Promise<void> {
  for (let i = 0; i < records.length; i += batchSize) {
    const batch = records.slice(i, i + batchSize);
    await Promise.all(batch.map(record => processRecord(record)));
  }
}

// ❌ 避免回调地狱
// 不要使用 callback 方式
```

### 4.6 注释规范

```typescript
/**
 * 获取对象定义
 * 
 * @param objectName - 对象 API 名称
 * @param options - 可选配置
 * @param options.includeFields - 是否包含字段定义
 * @param options.includePermissions - 是否包含权限信息
 * @returns 对象定义，如果不存在返回 null
 * 
 * @example
 * ```typescript
 * const obj = await getObject('accounts', { includeFields: true });
 * if (obj) {
 *   console.log(obj.label);
 * }
 * ```
 */
async function getObject(
  objectName: string,
  options?: {
    includeFields?: boolean;
    includePermissions?: boolean;
  }
): Promise<SteedosObject | null> {
  // 实现...
}
```

---

## 5. 元数据开发指南

### 5.1 对象元数据 (Objects)

对象是 Steedos 的核心概念，类似数据库表。

**对象定义示例** (`accounts.object.yml`):

```yaml
name: accounts
label: 客户
icon: account
enable_files: true
enable_tasks: true
enable_notes: true
enable_api: true

fields:
  name:
    type: text
    label: 客户名称
    required: true
    searchable: true
    index: true
    is_name: true
  
  rating:
    type: select
    label: 客户等级
    options:
      - label: 热门
        value: hot
      - label: 温暖
        value: warm
      - label: 冷淡
        value: cold
    defaultValue: warm
  
  industry:
    type: lookup
    label: 所属行业
    reference_to: industries
    searchable: true
  
  annual_revenue:
    type: currency
    label: 年收入
    scale: 2
  
  employees:
    type: number
    label: 员工数
    scale: 0
  
  website:
    type: url
    label: 网站
  
  phone:
    type: text
    label: 电话
  
  owner:
    type: lookup
    label: 所有人
    reference_to: users
    defaultValue: "{userId}"
  
  created:
    type: datetime
    label: 创建时间
    omit: true
    defaultValue: "{now}"
  
  modified:
    type: datetime
    label: 修改时间
    omit: true

list_views:
  all:
    label: 所有客户
    columns:
      - name
      - rating
      - industry
      - annual_revenue
      - owner
    filter_scope: space
    sort:
      - field_name: modified
        order: desc
  
  recent:
    label: 最近查看
    filter_scope: space
    filters: [["modified", "between", "last_7_days"]]

permission_set:
  user:
    allowCreate: true
    allowDelete: true
    allowEdit: true
    allowRead: true
    modifyAllRecords: false
    viewAllRecords: false
  
  admin:
    allowCreate: true
    allowDelete: true
    allowEdit: true
    allowRead: true
    modifyAllRecords: true
    viewAllRecords: true
```

### 5.2 字段类型

| 字段类型 | 说明 | 示例 |
|---------|------|------|
| text | 文本 | 客户名称 |
| textarea | 多行文本 | 描述 |
| html | 富文本 | 详细信息 |
| select | 下拉选择 | 客户等级 |
| boolean | 布尔值 | 是否激活 |
| date | 日期 | 生日 |
| datetime | 日期时间 | 创建时间 |
| number | 数字 | 员工数 |
| currency | 货币 | 年收入 |
| percent | 百分比 | 完成度 |
| lookup | 查找关系 | 所属客户 |
| master_detail | 主从关系 | 订单明细 |
| autonumber | 自动编号 | 订单号 |
| url | URL | 网站 |
| email | 邮箱 | 联系邮箱 |
| image | 图片 | 头像 |
| file | 文件 | 附件 |
| formula | 公式字段 | 计算总价 |
| summary | 汇总字段 | 订单总额 |

### 5.3 触发器 (Triggers)

触发器用于在数据操作前后执行自定义逻辑。

**触发器示例** (`accounts.trigger.js`):

```javascript
module.exports = {
  // 插入前触发
  listenTo: 'accounts',
  
  beforeInsert: async function() {
    const { doc } = this;
    
    // 自动设置客户编号
    if (!doc.account_number) {
      doc.account_number = await generateAccountNumber();
    }
    
    // 数据验证
    if (doc.annual_revenue < 0) {
      throw new Error('年收入不能为负数');
    }
  },
  
  // 插入后触发
  afterInsert: async function() {
    const { doc, userId, spaceId } = this;
    
    // 创建关联任务
    await broker.call('objectql.insert', {
      objectName: 'tasks',
      doc: {
        name: `跟进客户: ${doc.name}`,
        related_to: doc._id,
        owner: userId,
        space: spaceId
      },
      userId,
      spaceId
    });
    
    // 发送通知
    await sendNotification(userId, `新客户 ${doc.name} 已创建`);
  },
  
  // 更新前触发
  beforeUpdate: async function() {
    const { doc, previousDoc } = this;
    
    // 检测重要字段变更
    if (doc.rating !== previousDoc.rating) {
      doc.rating_changed_at = new Date();
    }
  },
  
  // 更新后触发
  afterUpdate: async function() {
    const { doc, previousDoc } = this;
    
    // 客户等级变更通知
    if (doc.rating !== previousDoc.rating) {
      await notifyRatingChange(doc, previousDoc);
    }
  },
  
  // 删除前触发
  beforeDelete: async function() {
    const { _id } = this;
    
    // 检查是否有关联订单
    const orders = await broker.call('objectql.find', {
      objectName: 'orders',
      query: {
        filters: [['account', '=', _id]]
      }
    });
    
    if (orders.length > 0) {
      throw new Error('该客户下有关联订单，无法删除');
    }
  }
};
```

### 5.4 公式字段

公式字段用于自动计算值。

```yaml
# 订单对象中的公式字段
fields:
  quantity:
    type: number
    label: 数量
  
  unit_price:
    type: currency
    label: 单价
  
  discount:
    type: percent
    label: 折扣
    defaultValue: 0
  
  total_price:
    type: formula
    label: 总价
    data_type: currency
    formula: "quantity * unit_price * (1 - discount)"
  
  is_large_order:
    type: formula
    label: 大额订单
    data_type: boolean
    formula: "total_price > 10000"
```

### 5.5 汇总字段

汇总字段用于统计关联对象的数据。

```yaml
# 客户对象中的汇总字段
fields:
  # 统计客户下的订单总额
  total_order_amount:
    type: summary
    label: 订单总额
    data_type: currency
    summary_object: orders
    summary_field: total_price
    summary_type: sum
    summary_filters: [["status", "=", "approved"]]
  
  # 统计客户下的订单数量
  order_count:
    type: summary
    label: 订单数量
    data_type: number
    summary_object: orders
    summary_type: count
```

---

## 6. 微服务开发

### 6.1 Moleculer 服务结构

Steedos 基于 Moleculer 微服务框架。每个服务都是独立的节点。

**服务示例** (`service-example.service.ts`):

```typescript
import { Service, ServiceBroker, Context } from 'moleculer';

export default class ExampleService extends Service {
  constructor(broker: ServiceBroker) {
    super(broker);

    this.parseServiceSchema({
      name: 'example',
      
      /**
       * 服务设置
       */
      settings: {
        defaultPageSize: 20,
      },

      /**
       * 服务依赖
       */
      dependencies: ['metadata', 'objectql'],

      /**
       * Actions
       */
      actions: {
        /**
         * 获取数据列表
         */
        list: {
          params: {
            objectName: 'string',
            filters: { type: 'object', optional: true },
            top: { type: 'number', optional: true, default: 20 },
            skip: { type: 'number', optional: true, default: 0 },
          },
          async handler(ctx: Context<{
            objectName: string;
            filters?: any;
            top?: number;
            skip?: number;
          }>) {
            const { objectName, filters, top, skip } = ctx.params;
            
            // 调用其他服务
            const result = await ctx.call('objectql.find', {
              objectName,
              query: {
                filters: filters || [],
                top,
                skip,
              },
            });
            
            return result;
          },
        },

        /**
         * 获取单条记录
         */
        get: {
          params: {
            objectName: 'string',
            id: 'string',
          },
          async handler(ctx: Context<{
            objectName: string;
            id: string;
          }>) {
            const { objectName, id } = ctx.params;
            
            const result = await ctx.call('objectql.findOne', {
              objectName,
              query: {
                filters: [['_id', '=', id]],
              },
            });
            
            if (!result) {
              throw new Error(`Record not found: ${id}`);
            }
            
            return result;
          },
        },
      },

      /**
       * Events
       */
      events: {
        'object.created': {
          async handler(ctx: Context<any>) {
            this.logger.info('Object created:', ctx.params);
            // 处理对象创建事件
          },
        },
      },

      /**
       * Methods
       */
      methods: {
        /**
         * 格式化数据
         */
        formatData(data: any): any {
          // 实现格式化逻辑
          return data;
        },
      },

      /**
       * Service lifecycle hooks
       */
      created() {
        this.logger.info('Service created');
      },

      started() {
        this.logger.info('Service started');
      },

      stopped() {
        this.logger.info('Service stopped');
      },
    });
  }
}
```

### 6.2 服务间通信

```typescript
// 1. 调用其他服务的 Action
const result = await ctx.call('metadata.getObject', {
  objectName: 'accounts'
});

// 2. 广播事件
ctx.broadcast('user.created', {
  userId: 'xxx',
  username: 'test'
});

// 3. 发送事件到特定服务
ctx.emit('order.processed', {
  orderId: 'xxx'
}, 'order-service');

// 4. 请求-响应模式
const users = await ctx.call('users.list', {
  top: 10,
  skip: 0
});

// 5. 流式传输
const stream = await ctx.call('files.get', {
  fileId: 'xxx'
});
```

### 6.3 服务配置

**package.service.yml**:

```yaml
name: example
version: 1.0.0

metadata:
  name: Example Service
  description: 示例微服务

settings:
  pageSize: 20
  cacheEnabled: true

dependencies:
  - metadata
  - objectql

mixins:
  - '@steedos/service-metadata-server'
```

---

## 7. API 开发

### 7.1 GraphQL API

Steedos 使用 GraphQL 作为主要 API 接口。

**查询示例**:

```graphql
# 查询客户列表
query {
  accounts(
    filters: [["rating", "=", "hot"]]
    top: 10
    skip: 0
    sort: "name"
  ) {
    _id
    name
    rating
    industry
    annual_revenue
    owner {
      _id
      name
    }
  }
}

# 查询单个客户
query {
  account(id: "xxx") {
    _id
    name
    orders {
      _id
      order_number
      total_price
    }
  }
}
```

**变更示例**:

```graphql
# 创建客户
mutation {
  accounts__insert(doc: {
    name: "测试公司"
    rating: "hot"
    industry: "xxx"
  }) {
    _id
    name
  }
}

# 更新客户
mutation {
  accounts__update(
    id: "xxx"
    doc: {
      rating: "warm"
    }
  ) {
    _id
    rating
  }
}

# 删除客户
mutation {
  accounts__delete(id: "xxx")
}
```

### 7.2 RESTful API

Steedos 也提供 RESTful API。

```bash
# 查询列表
GET /api/v1/accounts
Query Parameters:
  - filters: [["rating","=","hot"]]
  - fields: ["name","rating","industry"]
  - top: 10
  - skip: 0
  - sort: name

# 查询单个
GET /api/v1/accounts/:id

# 创建
POST /api/v1/accounts
Body: {
  "name": "测试公司",
  "rating": "hot"
}

# 更新
PUT /api/v1/accounts/:id
Body: {
  "rating": "warm"
}

# 删除
DELETE /api/v1/accounts/:id
```

### 7.3 API 认证

```typescript
// JWT Token 认证
const token = await getAuthToken(username, password);

// 使用 Token 调用 API
const response = await fetch('/api/v1/accounts', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

---

## 8. 前端开发

### 8.1 Amis 页面配置

Steedos 前端基于百度 Amis 低代码框架。

**列表页示例**:

```json
{
  "type": "page",
  "title": "客户列表",
  "toolbar": [
    {
      "type": "button",
      "label": "新建客户",
      "actionType": "dialog",
      "dialog": {
        "title": "新建客户",
        "body": {
          "type": "form",
          "api": "post:/api/v1/accounts",
          "body": [
            {
              "type": "input-text",
              "name": "name",
              "label": "客户名称",
              "required": true
            },
            {
              "type": "select",
              "name": "rating",
              "label": "客户等级",
              "options": [
                {"label": "热门", "value": "hot"},
                {"label": "温暖", "value": "warm"},
                {"label": "冷淡", "value": "cold"}
              ]
            }
          ]
        }
      }
    }
  ],
  "body": {
    "type": "crud",
    "api": "/api/v1/accounts",
    "columns": [
      {
        "name": "name",
        "label": "客户名称",
        "searchable": true
      },
      {
        "name": "rating",
        "label": "客户等级",
        "type": "mapping",
        "map": {
          "hot": "<span class='label label-danger'>热门</span>",
          "warm": "<span class='label label-warning'>温暖</span>",
          "cold": "<span class='label label-default'>冷淡</span>"
        }
      },
      {
        "name": "annual_revenue",
        "label": "年收入",
        "type": "number"
      }
    ]
  }
}
```

### 8.2 React 组件开发

```typescript
import React, { useState, useEffect } from 'react';

interface Account {
  _id: string;
  name: string;
  rating: string;
}

export const AccountList: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/v1/accounts');
      const data = await response.json();
      setAccounts(data.value);
    } catch (error) {
      console.error('Failed to load accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="account-list">
      <h2>客户列表</h2>
      <ul>
        {accounts.map(account => (
          <li key={account._id}>
            {account.name} - {account.rating}
          </li>
        ))}
      </ul>
    </div>
  );
};
```

---

## 9. AI 功能集成

### 9.1 AI 配置

Steedos 支持多种 AI 服务提供商。

**环境变量配置**:

```bash
# OpenAI 官方
OPENAI_API_KEY=sk-xxx
OPENAI_BASE_URL=https://api.openai.com/v1

# 阿里云 DashScope
OPENAI_API_KEY=sk-xxx
OPENAI_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1

# DeepSeek
OPENAI_API_KEY=sk-xxx
OPENAI_BASE_URL=https://api.deepseek.com/v1

# 本地 LLM (Ollama)
OPENAI_BASE_URL=http://localhost:11434/v1
OPENAI_API_KEY=ollama
```

### 9.2 AI 服务调用

```typescript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL,
});

/**
 * AI 生成对象元数据
 */
async function generateObjectMetadata(
  description: string
): Promise<any> {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: '你是一个 Steedos 元数据生成助手，根据用户描述生成对象定义的 YAML 配置。'
      },
      {
        role: 'user',
        content: `请为以下业务场景生成对象定义：\n\n${description}`
      }
    ],
    temperature: 0.7,
  });

  const yaml = completion.choices[0].message.content;
  return parseYaml(yaml);
}

/**
 * AI 生成 Amis 页面配置
 */
async function generatePageSchema(
  description: string
): Promise<any> {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: '你是一个 Amis 页面配置生成助手，根据用户描述生成 Amis JSON Schema。'
      },
      {
        role: 'user',
        content: `请生成以下页面的 Amis 配置：\n\n${description}`
      }
    ],
    response_format: { type: 'json_object' },
    temperature: 0.7,
  });

  return JSON.parse(completion.choices[0].message.content);
}
```

### 9.3 AI Copilot 集成

```typescript
/**
 * AI 代码生成
 */
async function generateTriggerCode(
  description: string,
  objectName: string
): Promise<string> {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: `你是一个 Steedos 触发器代码生成助手。
生成的代码应该遵循 Node.js 和 TypeScript 最佳实践。
使用 module.exports 导出触发器配置。`
      },
      {
        role: 'user',
        content: `对象名称: ${objectName}
需求描述: ${description}

请生成触发器代码。`
      }
    ],
    temperature: 0.7,
  });

  return completion.choices[0].message.content;
}
```

---

## 10. 测试策略

### 10.1 单元测试

使用 Jest 进行单元测试。

```typescript
// object-manager.test.ts
import { ObjectManager } from '../src/object-manager';

describe('ObjectManager', () => {
  let manager: ObjectManager;

  beforeEach(() => {
    manager = new ObjectManager();
  });

  test('should get object definition', async () => {
    const obj = await manager.getObject('accounts');
    expect(obj).toBeDefined();
    expect(obj.name).toBe('accounts');
  });

  test('should throw error for non-existent object', async () => {
    await expect(
      manager.getObject('non_existent')
    ).rejects.toThrow('Object not found');
  });

  test('should validate object schema', () => {
    const validSchema = {
      name: 'test',
      label: 'Test Object',
      fields: {}
    };
    expect(manager.validateSchema(validSchema)).toBe(true);
  });
});
```

### 10.2 集成测试

```typescript
// api.integration.test.ts
import request from 'supertest';
import { app } from '../src/app';

describe('API Integration Tests', () => {
  let authToken: string;

  beforeAll(async () => {
    // 获取认证 Token
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({
        username: 'admin',
        password: 'admin'
      });
    authToken = response.body.token;
  });

  test('GET /api/v1/accounts should return accounts list', async () => {
    const response = await request(app)
      .get('/api/v1/accounts')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(response.body).toHaveProperty('value');
    expect(Array.isArray(response.body.value)).toBe(true);
  });

  test('POST /api/v1/accounts should create account', async () => {
    const newAccount = {
      name: 'Test Company',
      rating: 'hot'
    };

    const response = await request(app)
      .post('/api/v1/accounts')
      .set('Authorization', `Bearer ${authToken}`)
      .send(newAccount)
      .expect(201);

    expect(response.body).toHaveProperty('_id');
    expect(response.body.name).toBe(newAccount.name);
  });
});
```

### 10.3 运行测试

```bash
# 运行所有测试
yarn test

# 运行特定测试文件
yarn test object-manager.test.ts

# 运行测试并生成覆盖率报告
yarn test --coverage

# 监听模式
yarn test --watch
```

---

## 11. 构建与发布

### 11.1 构建流程

```bash
# 1. 清理构建产物
yarn clean

# 2. 安装依赖
yarn

# 3. Bootstrap (链接本地包)
yarn bootstrap

# 4. 构建所有包
yarn build

# 5. 运行测试
yarn test
```

### 11.2 发布流程

```bash
# 1. 更新版本号
lerna version --conventional-commits

# 2. 发布到 NPM (Beta)
yarn release:beta

# 3. 发布到 NPM (正式版)
lerna publish --registry https://registry.npmjs.org

# 4. 重新发布 (如果失败)
yarn release:again
```

### 11.3 Docker 构建

```bash
# 构建 Docker 镜像
docker build -t steedos/steedos-community:3.0 .

# 推送到 Docker Hub
docker push steedos/steedos-community:3.0

# 运行 Docker 容器
docker run -d -p 80:80 steedos/steedos-community:3.0
```

---

## 12. 故障排查

### 12.1 常见问题

#### 12.1.1 MongoDB 连接失败

```bash
# 检查 MongoDB 是否运行
mongod --version

# 检查连接字符串
echo $MONGO_URL

# 测试连接
mongo mongodb://127.0.0.1:27017/steedos
```

#### 12.1.2 构建失败

```bash
# 清理缓存
yarn clean
rm -rf node_modules
rm -rf .yarn/cache

# 重新安装
yarn

# 重新构建
yarn build
```

#### 12.1.3 服务启动失败

```bash
# 检查端口占用
lsof -i :5100

# 查看日志
tail -f logs/steedos.log

# 调试模式启动
DEBUG=* yarn start
```

### 12.2 调试技巧

#### 12.2.1 VSCode 调试配置

`.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Steedos",
      "cwd": "${workspaceFolder}/builder6/server",
      "runtimeExecutable": "yarn",
      "runtimeArgs": ["start"],
      "skipFiles": ["<node_internals>/**"],
      "env": {
        "NODE_ENV": "development",
        "DEBUG": "*"
      }
    }
  ]
}
```

#### 12.2.2 日志调试

```typescript
// 使用 logger
import { getLogger } from '@steedos/logger';

const logger = getLogger('my-module');

logger.debug('Debug message');
logger.info('Info message');
logger.warn('Warning message');
logger.error('Error message');
```

#### 12.2.3 性能分析

```bash
# 使用 Node.js Inspector
node --inspect builder6/server/index.js

# 使用 clinic.js 进行性能分析
npm install -g clinic
clinic doctor -- node builder6/server/index.js
```

---

## 13. 常见问题

### 13.1 开发相关

**Q: 如何创建新的 Package?**

```bash
# 使用脚手架
npx @steedos/create-steedos-package my-package

# 手动创建
mkdir packages/my-package
cd packages/my-package
yarn init
```

**Q: 如何调试单个 Service?**

```bash
# 设置环境变量
export SERVICES=service-example

# 启动 REPL
yarn repl

# 调用 Action
call service-example.list
```

**Q: 如何添加新的对象?**

1. 在项目中创建对象定义文件: `src/.steedos/objects/my_object.object.yml`
2. 定义对象结构（参考第 5 章）
3. 重启服务，对象会自动加载

### 13.2 部署相关

**Q: 如何配置生产环境?**

```bash
# 设置环境变量
export NODE_ENV=production
export MONGO_URL=mongodb://prod-server:27017/steedos
export ROOT_URL=https://app.example.com
export PORT=80

# 启动服务
yarn start
```

**Q: 如何配置 HTTPS?**

使用 Nginx 反向代理:

```nginx
server {
    listen 443 ssl;
    server_name app.example.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:5100;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 13.3 性能优化

**Q: 如何优化查询性能?**

1. 为常用查询字段添加索引:

```yaml
fields:
  name:
    type: text
    index: true
  
  email:
    type: email
    index: true
    unique: true
```

2. 使用缓存:

```typescript
// 启用 Redis 缓存
export REDIS_URL=redis://localhost:6379
```

3. 分页查询:

```typescript
// 使用 top 和 skip 参数
const result = await ctx.call('objectql.find', {
  objectName: 'accounts',
  query: {
    top: 20,
    skip: 0
  }
});
```

---

## 附录

### A. 相关资源

- **官方网站**: https://www.steedos.com
- **文档**: https://docs.steedos.com
- **GitHub**: https://github.com/steedos/steedos-platform
- **社区**: https://github.com/steedos/steedos-platform/discussions

### B. 技术栈文档

- **Moleculer**: https://moleculer.services
- **Amis**: https://aisuda.bce.baidu.com/amis
- **MongoDB**: https://docs.mongodb.com
- **TypeScript**: https://www.typescriptlang.org

### C. 术语表

| 术语 | 说明 |
|------|------|
| Object | 对象，类似数据库表 |
| Field | 字段，对象的属性 |
| Record | 记录，对象的实例 |
| Metadata | 元数据，描述对象结构的配置 |
| Trigger | 触发器，数据操作的钩子函数 |
| Permission Set | 权限集，定义用户权限 |
| List View | 列表视图，数据的展示方式 |
| Formula | 公式，自动计算字段值 |
| Summary | 汇总，统计关联数据 |
| Lookup | 查找关系，类似外键 |
| Master-Detail | 主从关系，级联删除的关联 |

---

**最后更新**: 2026-01-12  
**维护者**: Steedos 开发团队  
**反馈**: https://github.com/steedos/steedos-platform/issues
