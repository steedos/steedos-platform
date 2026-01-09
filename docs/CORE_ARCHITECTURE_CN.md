# Steedos Platform 核心架构文档

> 版本: 3.0.12  
> 最后更新: 2026-01-09

## 目录

- [1. 项目概览](#1-项目概览)
- [2. 核心架构](#2-核心架构)
- [3. 技术栈](#3-技术栈)
- [4. 核心模块](#4-核心模块)
- [5. 服务架构](#5-服务架构)
- [6. 数据流](#6-数据流)
- [7. 扩展机制](#7-扩展机制)
- [8. 安全性](#8-安全性)

---

## 1. 项目概览

### 1.1 项目简介

**Steedos Platform (华炎魔方)** 是新一代 AI 原生低代码开发平台，融合了元数据驱动架构与生成式 AI 技术。平台基于现代开源技术栈构建，支持私有部署和混合云架构。

### 1.2 核心特性

- **🤖 AI 驱动开发**: 通过自然语言提示词生成数据模型、界面和业务逻辑
- **🧠 元数据驱动**: 类 Salesforce 的元数据架构，所有配置存储为 YAML/JSON 文件
- **🚀 微服务架构**: 基于 Moleculer 的分布式微服务框架
- **⚡ 跨数据库支持**: ObjectQL 统一查询语言，同时支持 MongoDB 和 SQL 数据库
- **🛡️ 企业级安全**: 对象级、字段级、记录级权限控制
- **🎨 现代化界面**: 基于 React 和百度 Amis 低代码框架

### 1.3 项目结构

```
steedos-platform/
├── packages/          # 核心 NPM 包
│   ├── objectql/      # 对象查询语言
│   ├── metadata-core/ # 元数据核心
│   ├── accounts/      # 账户管理
│   └── ...
├── services/          # 微服务模块
│   ├── service-metadata-server/  # 元数据服务器
│   ├── service-api/              # API 服务
│   └── ...
├── builder6/          # 构建器应用
│   ├── server/        # 服务端
│   ├── webapp/        # Web 应用
│   └── ai/            # AI 相关模块
├── ee/                # 企业版功能
├── deploy/            # 部署配置
└── docs/              # 文档

```

---

## 2. 核心架构

### 2.1 整体架构图

```
┌─────────────────────────────────────────────────────────────┐
│                      前端层 (Frontend)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   React UI   │  │  Amis 引擎   │  │   移动端     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    API 网关层 (API Gateway)                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  REST API    │  │   GraphQL    │  │    OData     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  微服务层 (Microservices)                    │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐   │
│  │  Metadata │ │ ObjectQL  │ │  Account  │ │    ...    │   │
│  │  Service  │ │  Service  │ │  Service  │ │  Service  │   │
│  └───────────┘ └───────────┘ └───────────┘ └───────────┘   │
│                   Moleculer 微服务框架                       │
└─────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    数据层 (Data Layer)                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   MongoDB    │  │  PostgreSQL  │  │    Redis     │      │
│  │  (元数据)     │  │  (业务数据)   │  │   (缓存)     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 设计模式

#### 元数据驱动 (Metadata-Driven)

所有业务对象、字段、权限、页面布局等配置均以元数据形式存储：

```yaml
# 对象定义示例
name: accounts
label: 客户
fields:
  name:
    type: text
    label: 客户名称
    required: true
  industry:
    type: select
    label: 行业
    options:
      - label: 科技
        value: tech
      - label: 金融
        value: finance
```

#### 微服务架构

基于 [Moleculer](https://moleculer.services/) 框架实现：

- **服务发现**: 自动发现和注册服务
- **负载均衡**: 内置请求负载均衡
- **容错机制**: 断路器、重试、超时控制
- **分布式追踪**: 请求追踪和性能监控

---

## 3. 技术栈

### 3.1 后端技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Node.js | ≥22.0.0 | 运行时环境 |
| TypeScript | 5.7.3 | 开发语言 |
| Moleculer | - | 微服务框架 |
| MongoDB | ≥4.2 | 元数据存储 |
| TypeORM | 0.3.26 | SQL ORM |
| GraphQL | 15.8.0 | API 查询语言 |
| Express | 5.1.0 | Web 框架 |

### 3.2 前端技术栈

| 技术 | 用途 |
|------|------|
| React | UI 框架 |
| Amis | 低代码页面渲染引擎 |
| amis-formula | 公式计算引擎 |

### 3.3 数据库支持

- **MongoDB**: 元数据存储、默认业务数据库
- **PostgreSQL**: 业务数据存储（可选）
- **MySQL**: 业务数据存储（可选）
- **Oracle**: 业务数据存储（可选）
- **Redis**: 缓存和消息队列
- **NATS**: 消息传输（可选）

---

## 4. 核心模块

### 4.1 ObjectQL (@steedos/objectql)

**对象查询语言**，提供统一的数据访问接口。

**核心功能**:
- 跨数据库查询（MongoDB/SQL）
- CRUD 操作
- 权限校验
- 触发器执行
- 聚合查询

**示例**:

```javascript
// 查询数据
const records = await objects.accounts.find({
  fields: ['name', 'industry'],
  filters: [['owner', '=', userId]],
  sort: 'created desc'
});

// 插入数据
const newRecord = await objects.accounts.insert({
  name: '新客户',
  industry: 'tech'
}, userSession);
```

### 4.2 Metadata Core (@steedos/metadata-core)

**元数据核心**，负责元数据的加载、解析、合并。

**核心功能**:
- 元数据文件扫描和加载
- 元数据验证
- 元数据继承和覆盖
- 元数据导出和导入

**元数据类型**:
- Objects (对象)
- Fields (字段)
- Permissions (权限)
- Layouts (页面布局)
- Apps (应用)
- Tabs (选项卡)
- Triggers (触发器)

### 4.3 Accounts (@steedos/accounts)

**账户管理**，提供用户认证和授权。

**核心功能**:
- 用户注册和登录
- 密码加密和验证
- JWT Token 生成和验证
- 第三方登录集成（OIDC、SAML、LDAP）

### 4.4 Process (@steedos/process)

**流程引擎**，支持审批流和工作流。

**核心功能**:
- BPMN 流程定义
- 流程实例管理
- 会签、回退、转交
- 流程监控

### 4.5 Filters (@steedos/filters)

**过滤器库**，提供统一的查询条件处理。

**支持的操作符**:
- 比较: `=`, `!=`, `>`, `>=`, `<`, `<=`
- 文本: `startswith`, `contains`, `notcontains`
- 范围: `between`
- 逻辑: `and`, `or`

### 4.6 Formula (@steedos/formula)

**公式引擎**，支持字段公式计算。

基于 `amis-formula` 实现，支持：
- 数学运算
- 文本处理
- 日期时间
- 逻辑判断
- 数据聚合

---

## 5. 服务架构

### 5.1 核心服务

#### service-metadata-server

**元数据服务器**，提供元数据的 HTTP API。

**端点**:
- `GET /api/metadata/objects/:objectName`
- `POST /api/metadata/reload`
- `GET /api/metadata/apps`

#### service-api

**API 服务**，提供统一的 API 网关。

**支持的协议**:
- REST API
- GraphQL
- OData v4

#### service-objectql

**ObjectQL 服务**，将 ObjectQL 封装为微服务。

**Actions**:
- `objectql.find`
- `objectql.findOne`
- `objectql.insert`
- `objectql.update`
- `objectql.delete`
- `objectql.aggregate`

#### service-accounts

**账户服务**，处理用户认证和授权。

**Actions**:
- `accounts.login`
- `accounts.logout`
- `accounts.register`
- `accounts.verifyToken`

### 5.2 元数据服务

| 服务 | 功能 |
|------|------|
| service-metadata | 元数据加载和管理 |
| service-metadata-objects | 对象元数据 |
| service-metadata-apps | 应用元数据 |
| service-metadata-layouts | 页面布局 |
| service-metadata-tabs | 选项卡 |
| service-metadata-permissionsets | 权限集 |
| service-metadata-triggers | 触发器 |
| service-metadata-translations | 国际化翻译 |

### 5.3 标准服务

| 服务 | 功能 |
|------|------|
| standard-accounts | 标准账户对象 |
| standard-object-database | 数据库标准对象 |
| standard-permission | 标准权限管理 |
| standard-process-approval | 标准审批流程 |
| standard-ui | 标准 UI 组件 |

### 5.4 服务通信

```
┌─────────────┐
│   Service A │
└──────┬──────┘
       │ broker.call('serviceB.action', params)
       ▼
┌─────────────────┐
│  Moleculer Bus  │  (NATS/Redis/TCP)
└────────┬────────┘
         │
         ▼
┌─────────────┐
│  Service B  │
└─────────────┘
```

**通信方式**:
- **Request-Response**: `broker.call()`
- **Events**: `broker.emit()` / `broker.broadcast()`
- **Load Balancing**: 自动负载均衡

---

## 6. 数据流

### 6.1 请求处理流程

```
用户请求
    ↓
API Gateway (Express)
    ↓
Moleculer Action
    ↓
ObjectQL (权限检查)
    ↓
Before Trigger
    ↓
Database Driver (MongoDB/SQL)
    ↓
After Trigger
    ↓
返回响应
```

### 6.2 元数据加载流程

```
启动 Steedos Server
    ↓
扫描软件包 (packages/)
    ↓
按依赖顺序加载包
    ↓
合并元数据
    ↓
创建 Object Service
    ↓
注册 API 路由
    ↓
服务就绪
```

### 6.3 触发器执行流程

**触发器类型**:
- `beforeFind` / `afterFind`
- `beforeInsert` / `afterInsert`
- `beforeUpdate` / `afterUpdate`
- `beforeDelete` / `afterDelete`
- `beforeAggregate` / `afterAggregate`

**执行顺序**:

```javascript
// 以 insert 为例
1. 调用 objects.accounts.insert(doc, userSession)
2. 执行权限检查
3. 执行 beforeInsert 触发器
4. 插入数据到数据库
5. 执行 afterInsert 触发器
6. 发送通知 (如果配置)
7. 返回插入的记录
```

---

## 7. 扩展机制

### 7.1 软件包 (Package)

Steedos 支持通过软件包扩展功能。

**软件包结构**:

```
my-package/
├── package.json
├── main/
│   └── default/
│       ├── objects/
│       │   └── custom_object.object.yml
│       ├── applications/
│       │   └── custom_app.app.yml
│       ├── triggers/
│       │   └── custom_trigger.trigger.js
│       └── pages/
│           └── custom_page.page.yml
```

**创建软件包**:

```bash
npx create-steedos-package my-package
```

### 7.2 对象继承

可以在新软件包中扩展已有对象：

```yaml
# 扩展 accounts 对象
name: accounts
extend: accounts
fields:
  custom_field:
    type: text
    label: 自定义字段
```

### 7.3 自定义服务

创建自定义 Moleculer 服务：

```javascript
// custom.service.js
module.exports = {
  name: "custom",
  actions: {
    hello: {
      async handler(ctx) {
        return "Hello from custom service!";
      }
    }
  }
};
```

### 7.4 自定义 Action

在对象上添加自定义 Action：

```javascript
// accounts.action.js
module.exports = {
  sendEmail: async function(object_name, record_id, userSession) {
    // 发送邮件逻辑
    return { success: true };
  }
};
```

---

## 8. 安全性

### 8.1 权限模型

**三级权限控制**:

1. **对象级权限**: 控制用户对整个对象的访问权限
2. **字段级权限**: 控制用户对特定字段的读写权限
3. **记录级权限**: 通过共享规则控制用户对特定记录的访问

### 8.2 权限配置

```yaml
# 权限集定义
name: sales_manager
label: 销售经理
object_permissions:
  accounts:
    allowCreate: true
    allowRead: true
    allowEdit: true
    allowDelete: false
field_permissions:
  accounts.revenue:
    readable: true
    editable: true
```

### 8.3 数据隔离

**组织架构 (Organization)**:
- 多租户数据隔离
- 基于 `space` 字段区分
- 跨组织查询需要特殊权限

### 8.4 认证方式

- **本地认证**: 用户名密码
- **JWT Token**: 无状态认证
- **OIDC**: OpenID Connect
- **SAML**: 企业级单点登录
- **LDAP/AD**: 域集成

### 8.5 安全最佳实践

1. **敏感数据加密**: 密码使用 bcrypt 加密
2. **XSS 防护**: 前端输入验证和转义
3. **CSRF 防护**: Token 验证
4. **SQL 注入防护**: 使用 ORM 和参数化查询
5. **权限校验**: 每次 ObjectQL 操作都进行权限检查

---

## 附录

### A. 环境变量

| 变量 | 说明 | 默认值 |
|------|------|--------|
| ROOT_URL | 根 URL | http://localhost:5100 |
| PORT | 服务端口 | 5100 |
| MONGO_URL | MongoDB 连接字符串 | mongodb://localhost/steedos |
| REDIS_URL | Redis 连接字符串 | redis://localhost:6379 |
| TRANSPORTER | Moleculer 传输器 | - |
| NODE_ENV | 环境 | development |

### B. 常用命令

```bash
# 安装依赖
yarn

# 启动开发服务器
yarn start

# 构建所有包
yarn build

# 运行 Docker
yarn docker

# 清理依赖
yarn clean
```

### C. 参考资料

- [官方网站](https://www.steedos.com/)
- [在线文档](https://docs.steedos.com/)
- [GitHub](https://github.com/steedos/steedos-platform)
- [Moleculer 文档](https://moleculer.services/)
- [Amis 文档](https://aisuda.bce.baidu.com/amis/)

---

**文档维护者**: Steedos 开发团队  
**最后审核**: 2026-01-09
