# Steedos Platform 包和服务索引

> 版本: 3.0.12  
> 最后更新: 2026-01-09

本文档提供了 Steedos Platform 所有核心包和服务的详细索引。

---

## 📦 核心包 (Packages)

位于 `packages/` 目录下，共 26 个核心 NPM 包。

### 数据访问层

#### @steedos/objectql
**对象查询语言核心**

- **位置**: `packages/objectql/`
- **功能**: 提供统一的跨数据库查询接口
- **主要特性**:
  - 支持 MongoDB 和 SQL 数据库
  - CRUD 操作
  - 权限验证
  - 触发器执行
  - 聚合查询
- **依赖**:
  - @steedos/metadata-core
  - @steedos/filters
  - @steedos/formula
  - TypeORM, MongoDB, Sequelize

#### @steedos/odata-v4-mongodb
**MongoDB OData 服务**

- **位置**: `packages/odata-v4-mongodb/`
- **功能**: 将 MongoDB 查询转换为 OData v4 格式
- **特性**: 支持 OData v4 查询语法

#### @steedos/odata-v4-sql
**SQL OData 服务**

- **位置**: `packages/odata-v4-sql/`
- **功能**: 将 SQL 查询转换为 OData v4 格式

#### @steedos/odata-v4-typeorm
**TypeORM OData 集成**

- **位置**: `packages/odata-v4-typeorm/`
- **功能**: 基于 TypeORM 的 OData 实现

#### @steedos/odata-v4-parser
**OData v4 解析器**

- **位置**: `packages/odata-v4-parser/`
- **功能**: 解析 OData v4 查询语法

---

### 元数据层

#### @steedos/metadata-core
**元数据核心引擎**

- **位置**: `packages/metadata-core/`
- **功能**: 元数据加载、解析、验证、合并
- **主要特性**:
  - 元数据文件扫描
  - 元数据验证
  - 元数据继承和覆盖
  - 元数据导出导入
- **元数据类型**:
  - Objects, Fields, Permissions
  - Layouts, Apps, Tabs
  - Triggers, Workflows, Reports

#### @steedos/metadata-api
**元数据 API**

- **位置**: `packages/metadata-api/`
- **功能**: 提供元数据的 REST API
- **端点**:
  - `/api/metadata/objects`
  - `/api/metadata/reload`
  - `/api/metadata/export`

#### @steedos/metadata-registrar
**元数据注册器**

- **位置**: `packages/metadata-registrar/`
- **功能**: 元数据注册和管理

---

### 账户和权限

#### @steedos/accounts
**账户管理**

- **位置**: `packages/accounts/`
- **功能**: 用户账户管理
- **主要特性**:
  - 用户注册和登录
  - 密码加密验证
  - JWT Token 管理
  - 第三方登录集成

#### @steedos/auth
**认证模块**

- **位置**: `packages/auth/`
- **功能**: 认证和授权
- **支持**:
  - OIDC, SAML
  - LDAP, AD
  - OAuth 2.0

---

### 业务逻辑层

#### @steedos/process
**流程引擎**

- **位置**: `packages/process/`
- **功能**: 工作流和审批流
- **特性**:
  - BPMN 流程定义
  - 流程实例管理
  - 会签、回退、转交

#### @steedos/filters
**过滤器库**

- **位置**: `packages/filters/`
- **功能**: 统一查询条件处理
- **操作符**: =, !=, >, >=, <, <=, startswith, contains, between, and, or

#### @steedos/formula
**公式引擎**

- **位置**: `packages/formula/`
- **功能**: 字段公式计算
- **基于**: amis-formula
- **支持**: 数学、文本、日期、逻辑、聚合

---

### 工具和辅助

#### @steedos/utils
**工具函数库**

- **位置**: `packages/utils/`
- **功能**: 通用工具函数

#### @steedos/i18n
**国际化**

- **位置**: `packages/i18n/`
- **功能**: 多语言支持
- **支持语言**: 中文、英文

#### @steedos/schemas
**Schema 定义**

- **位置**: `packages/schemas/`
- **功能**: 数据 Schema 定义和验证

#### @steedos/cachers
**缓存管理**

- **位置**: `packages/cachers/`
- **功能**: 缓存抽象层
- **支持**: Redis, Memory

#### @steedos/router
**路由管理**

- **位置**: `packages/router/`
- **功能**: 前端路由管理

---

### API 和集成

#### @steedos/moleculer-apollo-server
**GraphQL 服务器**

- **位置**: `packages/moleculer-apollo-server/`
- **功能**: 基于 Moleculer 的 Apollo GraphQL 服务器
- **依赖**: apollo-server, graphql

#### @steedos/client
**客户端 SDK**

- **位置**: `packages/client/`
- **功能**: JavaScript/TypeScript 客户端 SDK
- **用途**: 在前端或 Node.js 中调用 Steedos API

---

### 开发工具

#### @steedos/cli
**命令行工具**

- **位置**: `packages/cli/`
- **功能**: Steedos 命令行界面
- **命令**:
  - `steedos start`
  - `steedos deploy`
  - `steedos sync`

#### @steedos/create-steedos-app
**应用脚手架**

- **位置**: `packages/create-steedos-app/`
- **功能**: 创建新的 Steedos 应用
- **用法**: `npx create-steedos-app my-app`

#### @steedos/create-steedos-package
**包脚手架**

- **位置**: `packages/create-steedos-package/`
- **功能**: 创建新的 Steedos 软件包
- **用法**: `npx create-steedos-package my-package`

#### @steedos/steedos-plugin-schema-builder
**Schema 构建器插件**

- **位置**: `packages/steedos-plugin-schema-builder/`
- **功能**: 可视化 Schema 设计工具

---

### 数据处理

#### @steedos/migrate
**数据迁移**

- **位置**: `packages/migrate/`
- **功能**: 数据库迁移工具

#### @steedos/data-import
**数据导入**

- **位置**: `packages/data-import/`
- **功能**: 批量数据导入

---

## 🔧 微服务 (Services)

位于 `services/` 目录下，共 39 个微服务模块。

### 核心服务

#### service-api
**API 网关服务**

- **位置**: `services/service-api/`
- **功能**: 统一 API 网关
- **协议**: REST, GraphQL, OData v4
- **端口**: 默认 5100

#### service-objectql
**ObjectQL 服务**

- **位置**: `services/service-objectql/`
- **功能**: 将 ObjectQL 封装为微服务
- **Actions**:
  - objectql.find
  - objectql.findOne
  - objectql.insert
  - objectql.update
  - objectql.delete
  - objectql.aggregate

#### service-rest
**REST API 服务**

- **位置**: `services/service-rest/`
- **功能**: REST API 实现
- **路径**: `/api/v4/*`

#### service-object-graphql
**GraphQL 服务**

- **位置**: `services/service-object-graphql/`
- **功能**: GraphQL API 实现
- **端点**: `/api/graphql`

---

### 元数据服务

#### service-metadata
**元数据管理服务**

- **位置**: `services/service-metadata/`
- **功能**: 核心元数据加载和管理

#### service-metadata-server
**元数据服务器**

- **位置**: `services/service-metadata-server/`
- **功能**: 元数据 HTTP 服务器
- **端点**: `/api/metadata/*`

#### service-metadata-objects
**对象元数据服务**

- **位置**: `services/service-metadata-objects/`
- **功能**: 管理对象元数据

#### service-metadata-apps
**应用元数据服务**

- **位置**: `services/service-metadata-apps/`
- **功能**: 管理应用元数据

#### service-metadata-layouts
**布局元数据服务**

- **位置**: `services/service-metadata-layouts/`
- **功能**: 管理页面布局元数据

#### service-metadata-tabs
**选项卡元数据服务**

- **位置**: `services/service-metadata-tabs/`
- **功能**: 管理选项卡元数据

#### service-metadata-permissionsets
**权限集元数据服务**

- **位置**: `services/service-metadata-permissionsets/`
- **功能**: 管理权限集元数据

#### service-metadata-triggers
**触发器元数据服务**

- **位置**: `services/service-metadata-triggers/`
- **功能**: 管理触发器元数据

#### service-metadata-translations
**翻译元数据服务**

- **位置**: `services/service-metadata-translations/`
- **功能**: 管理国际化翻译

#### service-metadata-database
**数据库元数据服务**

- **位置**: `services/service-metadata-database/`
- **功能**: 数据库相关元数据

---

### 账户和认证服务

#### service-accounts
**账户服务**

- **位置**: `services/service-accounts/`
- **功能**: 用户账户管理
- **Actions**:
  - accounts.login
  - accounts.logout
  - accounts.register
  - accounts.verifyToken

#### service-identity-jwt
**JWT 认证服务**

- **位置**: `services/service-identity-jwt/`
- **功能**: JWT Token 验证

---

### UI 服务

#### service-ui
**UI 服务**

- **位置**: `services/service-ui/`
- **功能**: 前端 UI 资源服务

#### service-pages
**页面服务**

- **位置**: `services/service-pages/`
- **功能**: 页面配置和渲染

#### service-plugin-amis
**Amis 插件服务**

- **位置**: `services/service-plugin-amis/`
- **功能**: Amis 低代码引擎集成

---

### 包管理服务

#### service-package-loader
**包加载器服务**

- **位置**: `services/service-package-loader/`
- **功能**: 软件包加载和管理

#### service-package-registry
**包注册中心服务**

- **位置**: `services/service-package-registry/`
- **功能**: 软件包注册和版本管理

#### service-packages
**包服务**

- **位置**: `services/service-packages/`
- **功能**: 软件包安装和卸载

---

### 标准服务

#### standard-accounts
**标准账户服务**

- **位置**: `services/standard-accounts/`
- **功能**: 提供标准账户对象

#### standard-object-database
**标准对象数据库**

- **位置**: `services/standard-object-database/`
- **功能**: 标准对象定义

#### standard-permission
**标准权限服务**

- **位置**: `services/standard-permission/`
- **功能**: 标准权限管理

#### standard-process-approval
**标准审批流程服务**

- **位置**: `services/standard-process-approval/`
- **功能**: 标准审批流程

#### standard-ui
**标准 UI 服务**

- **位置**: `services/standard-ui/`
- **功能**: 标准 UI 组件

---

### 其他服务

#### service-core-objects
**核心对象服务**

- **位置**: `services/service-core-objects/`
- **功能**: 提供核心业务对象

#### service-object-mixin
**对象混入服务**

- **位置**: `services/service-object-mixin/`
- **功能**: 对象混入和扩展

#### service-fields-indexs
**字段索引服务**

- **位置**: `services/service-fields-indexs/`
- **功能**: 数据库索引管理

#### service-i18n
**国际化服务**

- **位置**: `services/service-i18n/`
- **功能**: 国际化翻译管理

#### service-cachers-manager
**缓存管理服务**

- **位置**: `services/service-cachers-manager/`
- **功能**: 缓存策略管理

#### moleculer-bullmq
**BullMQ 集成**

- **位置**: `services/moleculer-bullmq/`
- **功能**: 任务队列集成

#### service-bull-dashboard
**Bull 监控面板**

- **位置**: `services/service-bull-dashboard/`
- **功能**: 任务队列监控

#### service-community
**社区服务**

- **位置**: `services/service-community/`
- **功能**: 社区版功能

#### service-saas
**SaaS 服务**

- **位置**: `services/service-saas/`
- **功能**: SaaS 多租户支持

#### unpkg
**NPM CDN 服务**

- **位置**: `services/unpkg/`
- **功能**: NPM 包 CDN 服务

#### workflow_time_trigger
**工作流时间触发器**

- **位置**: `services/workflow_time_trigger/`
- **功能**: 定时任务和工作流触发

---

## 🏗️ 构建器应用 (Builder6)

位于 `builder6/` 目录下。

### @steedos/server
**主服务器**

- **位置**: `builder6/server/`
- **功能**: Steedos 主服务器应用
- **启动**: `yarn start`
- **端口**: 5100

### builder6/webapp
**Web 前端应用**

- **位置**: `builder6/webapp/`
- **技术**: React, Amis
- **开发**: `yarn webapp`
- **端口**: 3000 (开发模式)

### builder6/ai
**AI 模块**

- **位置**: `builder6/ai/`
- **功能**: AI 相关功能和集成

---

## 🏢 企业版 (EE)

位于 `ee/` 目录下。

### branding
**品牌定制**

- **位置**: `ee/branding/`
- **功能**: 企业品牌定制

### service-enterprise
**企业服务**

- **位置**: `ee/service-enterprise/`
- **功能**: 企业版专属服务

---

## 📊 依赖关系

### 核心依赖链

```
@steedos/server
  ├── @steedos/objectql
  │   ├── @steedos/metadata-core
  │   ├── @steedos/filters
  │   └── @steedos/formula
  ├── @steedos/accounts
  ├── @steedos/process
  └── services/*
```

### 服务依赖

```
service-api
  ├── service-objectql
  ├── service-rest
  └── service-object-graphql
      └── @steedos/objectql
```

---

## 📝 元数据文件结构

```
package/
├── package.json
└── main/
    └── default/
        ├── objects/              # 对象定义
        │   ├── *.object.yml
        │   └── *.object.js
        ├── applications/         # 应用定义
        │   └── *.app.yml
        ├── permissionsets/       # 权限集
        │   └── *.permissionset.yml
        ├── layouts/              # 页面布局
        │   └── *.layout.yml
        ├── tabs/                 # 选项卡
        │   └── *.tab.yml
        ├── triggers/             # 触发器
        │   └── *.trigger.js
        ├── actions/              # 自定义 Actions
        │   └── *.action.js
        ├── pages/                # 页面配置
        │   └── *.page.yml
        └── translations/         # 翻译
            └── *.i18n.yml
```

---

**文档维护者**: Steedos 开发团队  
**最后更新**: 2026-01-09
