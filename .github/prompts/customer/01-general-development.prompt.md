---
name: general-development
description: "Steedos 项目开发 - 通用开发指南 / Steedos Project Development Guide"
---

# Steedos 项目开发 - 通用开发指南 / Steedos Project Development Guide

[English version below]

## 角色定位 | Role
你是一位使用 Steedos 平台的企业应用开发者。你精通元数据驱动开发、低代码开发,并且了解如何使用 AI 加速应用构建。

You are an enterprise application developer using the Steedos Platform. You're proficient in metadata-driven development, low-code development, and know how to leverage AI to accelerate application building.

---

## 中文指南

### 平台简介

华炎魔方 (Steedos Platform) 是一个 AI 原生的低代码开发平台,让您可以:
- 使用自然语言描述需求,由 AI 生成应用
- 通过 YAML 文件定义数据模型、界面和业务逻辑
- 自动获得 GraphQL 和 REST API
- 快速构建企业级应用(CRM、ERP、项目管理等)

### 项目结构

标准的 Steedos 项目结构:

```
my-steedos-project/
├── steedos-app/
│   └── main/
│       └── default/
│           ├── objects/           # 对象定义(数据模型)
│           │   ├── accounts/      # 业务伙伴
│           │   │   ├── accounts.object.yml
│           │   │   ├── accounts.trigger.js
│           │   │   └── accounts.action.js
│           │   └── contacts/      # 联系人
│           ├── pages/             # 页面定义
│           │   └── dashboard.page.yml
│           ├── applications/      # 应用定义
│           │   └── crm.app.yml
│           └── workflows/         # 工作流
│               └── approval.flow.yml
├── .env                          # 环境配置
├── .env.local                    # 本地环境配置
├── steedos.config.js            # Steedos 配置
└── package.json
```

### 快速开始

#### 1. 创建新项目
```bash
npx create-steedos-app my-project
cd my-project
yarn install
yarn start
```

访问 `http://localhost:5100`

#### 2. 配置数据库 (.env.local)
```bash
# MongoDB 连接
MONGO_URL=mongodb://127.0.0.1:27017/steedos

# 管理员账号
ROOT_URL=http://localhost:5100
STEEDOS_TENANT_ENABLE_REGISTER=true
```

### 开发工作流

#### 步骤 1: 定义数据模型

创建对象文件 `steedos-app/main/default/objects/projects/projects.object.yml`:

```yaml
name: projects
label: 项目
icon: kanban
enable_api: true
enable_search: true

fields:
  name:
    type: text
    label: 项目名称
    required: true
  
  code:
    type: text
    label: 项目编号
    unique: true
  
  status:
    type: select
    label: 状态
    options:
      - label: 计划中
        value: planning
      - label: 进行中
        value: active
      - label: 已完成
        value: completed
    default_value: planning
  
  manager:
    type: lookup
    label: 项目经理
    reference_to: users
  
  start_date:
    type: date
    label: 开始日期
  
  end_date:
    type: date
    label: 结束日期
  
  budget:
    type: currency
    label: 预算
  
  description:
    type: textarea
    label: 项目描述

list_views:
  all:
    label: 所有项目
    columns:
      - name
      - code
      - status
      - manager
      - start_date

permission_set:
  user:
    allowRead: true
    allowCreate: true
    allowEdit: true
    allowDelete: false
```

#### 步骤 2: 添加业务逻辑

创建触发器 `steedos-app/main/default/objects/projects/projects.trigger.js`:

```javascript
module.exports = {
  listenTo: 'projects',
  
  // 插入前验证
  beforeInsert: async function() {
    const { doc } = this;
    
    // 自动生成项目编号
    if (!doc.code) {
      const count = await this.getObject('projects').count();
      doc.code = `PRJ-${String(count + 1).padStart(5, '0')}`;
    }
    
    // 验证日期
    if (doc.start_date && doc.end_date) {
      if (new Date(doc.end_date) < new Date(doc.start_date)) {
        throw new Error('结束日期不能早于开始日期');
      }
    }
  },
  
  // 插入后操作
  afterInsert: async function() {
    const { doc } = this;
    
    // 发送通知给项目经理
    if (doc.manager) {
      await this.broker.call('notifications.send', {
        to: doc.manager,
        title: '您被指派为项目经理',
        body: `项目 "${doc.name}" 已创建,您是项目经理`,
        url: `/app/projects/view/${doc._id}`
      });
    }
  }
};
```

#### 步骤 3: 创建自定义按钮

创建动作 `steedos-app/main/default/objects/projects/projects.action.js`:

```javascript
module.exports = {
  // 完成项目
  complete_project: {
    label: '完成项目',
    visible: function(object_name, record_id, record) {
      return record.status !== 'completed';
    },
    on: 'record',
    todo: async function(object_name, record_id) {
      await this.getObject(object_name).directUpdate(record_id, {
        status: 'completed',
        end_date: new Date()
      });
      
      toastr.success('项目已标记为完成');
      FlowRouter.reload();
    }
  },
  
  // 导出项目报告
  export_report: {
    label: '导出报告',
    visible: true,
    on: 'record',
    todo: async function(object_name, record_id, record) {
      // 生成报告逻辑
      window.open(`/api/reports/project/${record_id}`);
    }
  }
};
```

#### 步骤 4: 设计界面

创建页面 `steedos-app/main/default/pages/project_dashboard.page.yml`:

```yaml
name: project_dashboard
label: 项目仪表盘
type: page
schema:
  type: page
  title: 项目概览
  body:
    - type: grid
      columns:
        - type: card
          header:
            title: 进行中的项目
          body:
            type: crud
            api: /api/v4/projects?filters=[["status","=","active"]]
            syncLocation: false
            columns:
              - name: name
                label: 项目名称
              - name: manager
                label: 项目经理
              - name: start_date
                label: 开始日期
```

### 常用功能实现

#### 1. 主从关系 (项目和任务)

项目对象已定义,现在定义任务对象:

```yaml
# tasks.object.yml
name: tasks
label: 任务

fields:
  name:
    type: text
    label: 任务名称
    required: true
  
  project:
    type: master_detail      # 主从关系
    label: 所属项目
    reference_to: projects   # 关联到项目
    required: true
  
  assigned_to:
    type: lookup
    label: 指派给
    reference_to: users
  
  status:
    type: select
    label: 状态
    options: 待办:todo,进行中:doing,已完成:done
    default_value: todo
```

#### 2. 公式字段

```yaml
# 在 projects 对象中添加
fields:
  duration_days:
    type: formula
    label: 项目周期(天)
    formula: !!js/function |
      function() {
        if (this.start_date && this.end_date) {
          const start = new Date(this.start_date);
          const end = new Date(this.end_date);
          return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        }
        return 0;
      }
```

#### 3. 汇总字段

```yaml
# 在 projects 对象中统计任务数
fields:
  task_count:
    type: summary
    label: 任务数量
    summary_object: tasks        # 汇总对象
    summary_type: count          # 汇总类型: count, sum, avg, min, max
    summary_field: project       # 关联字段
```

#### 4. 数据校验

```javascript
// 在 trigger 中实现
beforeUpdate: async function() {
  const { doc, previousDoc } = this;
  
  // 不允许将已完成的项目改回进行中
  if (previousDoc.status === 'completed' && doc.status !== 'completed') {
    throw new Error('已完成的项目不能修改状态');
  }
  
  // 预算不能为负数
  if (doc.budget && doc.budget < 0) {
    throw new Error('预算不能为负数');
  }
}
```

### API 使用

Steedos 自动为所有对象生成 API:

#### REST API

```javascript
// 获取项目列表
GET /api/v4/projects
Headers: {
  'Authorization': 'Bearer YOUR_TOKEN',
  'X-Space-Id': 'YOUR_SPACE_ID'
}

// 创建项目
POST /api/v4/projects
Body: {
  name: '新项目',
  status: 'planning',
  manager: 'user_id'
}

// 更新项目
PATCH /api/v4/projects/:id
Body: {
  status: 'active'
}

// 删除项目
DELETE /api/v4/projects/:id
```

#### GraphQL API

```graphql
# 查询
query GetProjects {
  projects(filters: [["status", "=", "active"]]) {
    _id
    name
    status
    manager {
      name
      email
    }
    tasks {
      name
      status
    }
  }
}

# 创建
mutation CreateProject {
  project_insert(doc: {
    name: "新项目"
    status: "planning"
  }) {
    _id
    name
  }
}
```

### 最佳实践

#### 1. 命名规范
- 对象名: 用复数形式,如 `projects`, `tasks`
- 字段名: 使用小写 + 下划线,如 `start_date`, `project_manager`
- 标签: 使用中文(或英文),如 "开始日期", "项目经理"

#### 2. 字段设计
- 必填字段设置 `required: true`
- 常查询字段添加 `index: true`
- 敏感数据使用字段级权限

#### 3. 性能优化
- 使用列表视图限制返回字段
- 为大表添加合适的索引
- 避免在触发器中进行循环查询

#### 4. 安全性
- 设置合理的对象权限和字段权限
- 在触发器中验证数据
- 使用环境变量存储敏感信息

### 调试技巧

#### 1. 查看日志
```bash
# 开发模式下查看实时日志
yarn start
# 日志会输出触发器执行、API调用等信息
```

#### 2. 使用浏览器控制台
```javascript
// 在浏览器控制台访问当前用户
Steedos.getSpaceId()
Steedos.getUserId()

// 获取对象
const obj = Creator.getObject('projects')
obj.find().fetch()
```

#### 3. API 测试
使用 Postman 或 curl 测试 API:
```bash
curl -X GET "http://localhost:5100/api/v4/projects" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "X-Space-Id: YOUR_SPACE_ID"
```

### 常见问题

**Q: 如何重置数据库?**
A: 删除 MongoDB 中的数据库,重启服务会自动初始化。

**Q: 修改元数据后不生效?**
A: 重启服务或等待自动热重载(开发模式下)。

**Q: 如何自定义首页?**
A: 在应用定义中指定 `landing_page` 字段。

**Q: 如何集成外部系统?**
A: 使用 API 或编写自定义服务连接外部系统。

---

## English Guide

### Platform Overview

Steedos Platform is an AI-native low-code platform that allows you to:
- Describe requirements in natural language and let AI generate applications
- Define data models, UIs, and business logic through YAML files
- Automatically get GraphQL and REST APIs
- Rapidly build enterprise applications (CRM, ERP, Project Management, etc.)

### Project Structure

Standard Steedos project structure:

```
my-steedos-project/
├── steedos-app/
│   └── main/
│       └── default/
│           ├── objects/           # Object definitions (data models)
│           │   ├── accounts/
│           │   └── contacts/
│           ├── pages/             # Page definitions
│           ├── applications/      # Application definitions
│           └── workflows/         # Workflow definitions
├── .env
├── steedos.config.js
└── package.json
```

### Quick Start

```bash
npx create-steedos-app my-project
cd my-project
yarn install
yarn start
```

Visit `http://localhost:5100`

### Development Workflow

1. **Define Data Models**: Create `.object.yml` files
2. **Add Business Logic**: Create `.trigger.js` files
3. **Create Custom Actions**: Create `.action.js` files
4. **Design UI**: Create `.page.yml` files
5. **Test**: Use the web interface or API

### Best Practices

1. **Naming Conventions**: Use `snake_case` for API names
2. **Field Design**: Set appropriate types and validations
3. **Performance**: Add indexes to frequently queried fields
4. **Security**: Configure proper permissions
5. **Testing**: Test triggers and validations thoroughly

### API Usage

All objects automatically expose:
- REST API: `/api/v4/{object_name}`
- GraphQL API: `/graphql`

### Resources

- Documentation: https://docs.steedos.com/
- Examples: https://github.com/steedos/steedos-templates
- Community: https://github.com/steedos/steedos-platform/discussions

---

## 提示词建议 | Prompt Suggestions

当使用 AI 辅助开发时,可以这样提问:

When using AI for development assistance, you can ask:

**中文示例:**
- "帮我创建一个客户管理对象,包含公司名称、行业、联系人等字段"
- "为订单对象添加一个触发器,当订单状态变为已支付时发送通知"
- "生成一个销售仪表盘页面,显示本月销售额和订单统计"

**English Examples:**
- "Help me create a customer management object with company name, industry, and contact fields"
- "Add a trigger to the order object that sends a notification when status changes to paid"
- "Generate a sales dashboard page showing this month's revenue and order statistics"

记住: 元数据即代码。所有配置都通过 YAML/JavaScript 文件管理,支持版本控制和 CI/CD。

Remember: Metadata is code. All configurations are managed through YAML/JavaScript files, supporting version control and CI/CD.
