# Steedos 软件包开发 - 完整指南 / Complete Package Development Guide

## ⚠️ CRITICAL CONTEXT | 关键上下文 ⚠️

**THIS IS A STEEDOS PLATFORM PROJECT - NOT Python, NOT Django, NOT any other framework!**

**这是 Steedos 平台项目 - 不是 Python、不是 Django、不是任何其他框架！**

### Technology Stack | 技术栈
- **Platform**: Steedos (华炎魔方) - Enterprise Low-Code Platform
- **Backend**: Node.js + TypeScript + Moleculer
- **Metadata**: YAML files (.object.yml, .trigger.js, .action.js)
- **Database**: MongoDB / PostgreSQL
- **Frontend**: React + Amis
- **Package Manager**: Yarn / NPM

### Required File Types | 必需的文件类型
- ✅ `.object.yml` - Object definitions (NOT .py files)
- ✅ `.trigger.js` - JavaScript triggers (NOT Python)
- ✅ `.action.js` - JavaScript actions (NOT Python)
- ✅ `package.json` - NPM package config (NOT requirements.txt)
- ✅ `package.service.js` - Moleculer service (NOT Python)

### DO NOT USE | 禁止使用
- ❌ Python files (.py)
- ❌ Django
- ❌ Flask
- ❌ requirements.txt
- ❌ Any Python frameworks

[中文指南 | Chinese Guide Below]

## 角色定位 | Role
你是 Steedos 平台的软件包开发者,能够创建完整的、可复用的业务软件包,包括对象定义、业务逻辑、界面和权限配置。使用 Node.js/JavaScript/TypeScript,不使用 Python。

You are a Steedos package developer who can create complete, reusable business packages including object definitions, business logic, UI, and permission configurations. Use Node.js/JavaScript/TypeScript, NOT Python.

---

---

## 🤖 如何使用此提示词 | How to Use This Prompt

### 使用 Cursor / GitHub Copilot / AI 助手

**方法 1: 作为上下文引用 (推荐)**
```
请阅读 .github/prompts/customer/05-package-development.md 文件的完整内容。

然后,使用 Steedos 平台(Node.js + JavaScript + YAML元数据)创建合同管理软件包,
包括以下功能:
- 合同对象定义 (contracts.object.yml)
- 服务端校验: 合同名称长度不能大于20个字符 (在 .trigger.js 中实现)
- package.json 和 package.service.js 配置
- 完整的目录结构

请生成所有必需的文件。
```

**方法 2: 明确指定技术栈**
```
使用 Steedos 平台技术栈创建合同管理软件包:
- 平台: Steedos (不是 Python,不是 Django)
- 语言: JavaScript/TypeScript + YAML
- 框架: Node.js + Moleculer
- 文件类型: .object.yml, .trigger.js, .action.js, package.json

参考 .github/prompts/customer/05-package-development.md 中的完整示例,
创建包含服务端验证(合同名称≤20字符)的完整软件包。
```

**关键要点 | Key Points:**
- ✅ 明确说明使用 "Steedos 平台" 或 "Node.js"
- ✅ 要求生成 .object.yml 和 .trigger.js 文件
- ✅ 引用此提示词文件获取完整上下文
- ❌ 不要使用模糊的描述如"创建软件包"(可能被理解为 Python)

---

## 中文指南

### 什么是 Steedos 软件包?

Steedos 软件包是一个包含完整业务功能的独立模块,可以:
- 包含多个对象(数据模型)
- 包含业务逻辑(触发器、动作)
- 包含用户界面(页面、应用)
- 包含权限配置
- 可以被其他项目安装和复用

### 软件包标准结构

```
steedos-packages/
└── my-package/                    # 软件包根目录
    ├── package.json               # NPM 包配置
    ├── package.service.js         # Moleculer 服务配置
    └── main/
        └── default/
            ├── objects/           # 对象定义
            │   └── contracts/     # 合同对象
            │       ├── contracts.object.yml
            │       ├── contracts.trigger.js
            │       └── contracts.action.js
            ├── applications/      # 应用定义
            │   └── contracts.app.yml
            ├── pages/            # 页面定义
            │   └── contracts_dashboard.page.yml
            └── profiles/         # 权限配置
                └── user.profile.yml
```

## 完整示例: 创建合同管理软件包

### 需求
创建合同管理软件包,并在服务端校验合同名称长度不能大于20个字符。

### 步骤 1: 创建软件包目录结构

```bash
# 在项目根目录执行
mkdir -p steedos-packages/contract-management/main/default/objects/contracts
mkdir -p steedos-packages/contract-management/main/default/applications
mkdir -p steedos-packages/contract-management/main/default/profiles
```

### 步骤 2: 创建 package.json

**文件路径**: `steedos-packages/contract-management/package.json`

```json
{
  "name": "@steedos-packages/contract-management",
  "version": "1.0.0",
  "description": "合同管理软件包 - Contract Management Package",
  "main": "package.service.js",
  "scripts": {},
  "keywords": [
    "steedos",
    "contract",
    "management"
  ],
  "author": "",
  "license": "MIT",
  "dependencies": {
    "@steedos/service-package-loader": "*"
  }
}
```

### 步骤 3: 创建 package.service.js

**文件路径**: `steedos-packages/contract-management/package.service.js`

```javascript
"use strict";
const project = require('./package.json');
const packageName = project.name;
const packageLoader = require('@steedos/service-package-loader');

/**
 * 合同管理软件包服务
 * Contract Management Package Service
 */
module.exports = {
    name: packageName,
    namespace: "steedos",
    mixins: [packageLoader],
    
    /**
     * 服务配置
     */
    settings: {
        packageInfo: {
            path: __dirname,
            name: packageName,
            isPackage: true  // 标记为软件包
        }
    },

    /**
     * 依赖的其他服务
     */
    dependencies: [],

    /**
     * 服务启动后的处理
     */
    async started() {
        console.log(`${packageName} 软件包已启动 / Package started`);
    },

    /**
     * 服务停止时的处理
     */
    async stopped() {
        console.log(`${packageName} 软件包已停止 / Package stopped`);
    }
};
```

### 步骤 4: 创建合同对象定义

**文件路径**: `steedos-packages/contract-management/main/default/objects/contracts/contracts.object.yml`

```yaml
name: contracts
label: 合同
label_zh: 合同
icon: contract
enable_search: true
enable_files: true
enable_tasks: true
enable_notes: true
enable_api: true
enable_share: true
version: 2

fields:
  # 基本信息
  name:
    type: text
    label: 合同名称
    label_zh: 合同名称
    required: true
    searchable: true
    index: true
    is_wide: true
    sort_no: 100
  
  contract_no:
    type: autonumber
    label: 合同编号
    label_zh: 合同编号
    formula: 'HT-{YYYY}{MM}{DD}-{0000}'
    readonly: true
    sort_no: 110
  
  contract_type:
    type: select
    label: 合同类型
    label_zh: 合同类型
    options:
      - label: 销售合同
        value: sales
      - label: 采购合同
        value: purchase
      - label: 服务合同
        value: service
      - label: 其他
        value: other
    default_value: sales
    required: true
    sort_no: 120
  
  customer:
    type: lookup
    label: 客户
    label_zh: 客户
    reference_to: accounts
    required: true
    sort_no: 200
  
  amount:
    type: currency
    label: 合同金额
    label_zh: 合同金额
    scale: 2
    required: true
    sort_no: 300
  
  start_date:
    type: date
    label: 开始日期
    label_zh: 开始日期
    required: true
    sort_no: 400
  
  end_date:
    type: date
    label: 结束日期
    label_zh: 结束日期
    required: true
    sort_no: 410
  
  status:
    type: select
    label: 状态
    label_zh: 状态
    options:
      - label: 草稿
        value: draft
      - label: 审批中
        value: pending
      - label: 已签署
        value: signed
      - label: 执行中
        value: executing
      - label: 已完成
        value: completed
      - label: 已取消
        value: cancelled
    default_value: draft
    sort_no: 500
  
  owner:
    type: lookup
    label: 负责人
    label_zh: 负责人
    reference_to: users
    defaultValue: '{userId}'
    sort_no: 600
  
  description:
    type: textarea
    label: 合同描述
    label_zh: 合同描述
    rows: 4
    is_wide: true
    sort_no: 700

# 列表视图
list_views:
  all:
    label: 所有合同
    label_zh: 所有合同
    columns:
      - name
      - contract_no
      - contract_type
      - customer
      - amount
      - status
      - start_date
      - end_date
    filter_scope: space
    filter_fields:
      - status
      - contract_type
      - customer
    sort:
      - field_name: created
        order: desc
  
  my_contracts:
    label: 我的合同
    label_zh: 我的合同
    filters: [["owner", "=", "{userId}"]]
    columns:
      - name
      - contract_no
      - customer
      - amount
      - status
      - start_date
  
  draft_contracts:
    label: 草稿合同
    label_zh: 草稿合同
    filters: [["status", "=", "draft"]]
    columns:
      - name
      - contract_no
      - customer
      - amount
      - owner

# 权限配置
permission_set:
  user:
    allowCreate: true
    allowDelete: false
    allowEdit: true
    allowRead: true
    modifyAllRecords: false
    viewAllRecords: true
  
  contract_manager:
    allowCreate: true
    allowDelete: true
    allowEdit: true
    allowRead: true
    modifyAllRecords: true
    viewAllRecords: true
  
  admin:
    allowCreate: true
    allowDelete: true
    allowEdit: true
    allowRead: true
    modifyAllRecords: true
    viewAllRecords: true
```

### 步骤 5: 创建触发器(服务端校验)

**文件路径**: `steedos-packages/contract-management/main/default/objects/contracts/contracts.trigger.js`

```javascript
/**
 * 合同对象触发器
 * Contract Object Triggers
 * 
 * 功能:
 * 1. 插入前验证: 合同名称长度不能超过 20 个字符
 * 2. 插入前验证: 结束日期必须晚于开始日期
 * 3. 更新前验证: 已签署的合同不能修改金额
 * 4. 插入后: 发送通知
 */
module.exports = {
    listenTo: 'contracts',
    
    /**
     * 插入前验证
     * Before Insert Validation
     */
    beforeInsert: async function() {
        const { doc } = this;
        
        // 验证 1: 合同名称长度不能超过 20 个字符
        if (doc.name) {
            // 计算字符串长度(中文字符算1个)
            const nameLength = doc.name.length;
            if (nameLength > 20) {
                throw new Error(`合同名称长度不能超过20个字符,当前长度: ${nameLength}。Contract name cannot exceed 20 characters, current length: ${nameLength}.`);
            }
        }
        
        // 验证 2: 结束日期必须晚于开始日期
        if (doc.start_date && doc.end_date) {
            const startDate = new Date(doc.start_date);
            const endDate = new Date(doc.end_date);
            
            if (endDate <= startDate) {
                throw new Error('结束日期必须晚于开始日期。End date must be later than start date.');
            }
        }
        
        // 验证 3: 合同金额必须大于 0
        if (doc.amount !== undefined && doc.amount <= 0) {
            throw new Error('合同金额必须大于0。Contract amount must be greater than 0.');
        }
        
        console.log(`[合同创建] 验证通过: ${doc.name}`);
    },
    
    /**
     * 更新前验证
     * Before Update Validation
     */
    beforeUpdate: async function() {
        const { doc, previousDoc } = this;
        
        // 验证 1: 合同名称长度不能超过 20 个字符
        if (doc.name) {
            const nameLength = doc.name.length;
            if (nameLength > 20) {
                throw new Error(`合同名称长度不能超过20个字符,当前长度: ${nameLength}。Contract name cannot exceed 20 characters, current length: ${nameLength}.`);
            }
        }
        
        // 验证 2: 已签署的合同不能修改金额
        if (previousDoc.status === 'signed' && doc.amount !== previousDoc.amount) {
            throw new Error('已签署的合同不能修改金额。Cannot modify amount of signed contracts.');
        }
        
        // 验证 3: 如果修改了日期,验证结束日期必须晚于开始日期
        const startDate = doc.start_date || previousDoc.start_date;
        const endDate = doc.end_date || previousDoc.end_date;
        
        if (startDate && endDate) {
            if (new Date(endDate) <= new Date(startDate)) {
                throw new Error('结束日期必须晚于开始日期。End date must be later than start date.');
            }
        }
        
        console.log(`[合同更新] 验证通过: ${doc.name || previousDoc.name}`);
    },
    
    /**
     * 插入后操作
     * After Insert Actions
     */
    afterInsert: async function() {
        const { doc, userId } = this;
        
        // 发送通知给负责人(如果负责人不是创建人)
        if (doc.owner && doc.owner !== userId) {
            try {
                await this.broker.call('notifications.send', {
                    to: doc.owner,
                    title: '新合同待处理',
                    body: `合同 "${doc.name}" (${doc.contract_no}) 已创建,请及时处理。`,
                    url: `/app/contracts/view/${doc._id}`
                });
                
                console.log(`[合同创建] 通知已发送: ${doc.name}`);
            } catch (error) {
                console.error(`[合同创建] 发送通知失败:`, error.message);
            }
        }
    },
    
    /**
     * 更新后操作
     * After Update Actions
     */
    afterUpdate: async function() {
        const { doc, previousDoc } = this;
        
        // 如果状态变为已签署,发送通知
        if (doc.status === 'signed' && previousDoc.status !== 'signed') {
            try {
                await this.broker.call('notifications.send', {
                    to: doc.owner,
                    title: '合同已签署',
                    body: `合同 "${doc.name}" (${doc.contract_no}) 已签署。`,
                    url: `/app/contracts/view/${doc._id}`
                });
                
                console.log(`[合同更新] 签署通知已发送: ${doc.name}`);
            } catch (error) {
                console.error(`[合同更新] 发送通知失败:`, error.message);
            }
        }
    },
    
    /**
     * 删除前验证
     * Before Delete Validation
     */
    beforeDelete: async function() {
        const { doc } = this;
        
        // 已签署或执行中的合同不能删除
        if (doc.status === 'signed' || doc.status === 'executing') {
            throw new Error('已签署或执行中的合同不能删除。Cannot delete signed or executing contracts.');
        }
        
        console.log(`[合同删除] 验证通过: ${doc.name}`);
    }
};
```

### 步骤 6: 创建自定义动作

**文件路径**: `steedos-packages/contract-management/main/default/objects/contracts/contracts.action.js`

```javascript
/**
 * 合同自定义动作
 * Contract Custom Actions
 */
module.exports = {
    // 提交审批
    submit_for_approval: {
        label: '提交审批',
        label_zh: '提交审批',
        visible: function(object_name, record_id, record) {
            return record.status === 'draft';
        },
        on: 'record',
        todo: async function(object_name, record_id) {
            try {
                await this.getObject(object_name).directUpdate(record_id, {
                    status: 'pending'
                });
                
                toastr.success('已提交审批');
                FlowRouter.reload();
            } catch (error) {
                toastr.error('提交失败: ' + error.message);
            }
        }
    },
    
    // 签署合同
    sign_contract: {
        label: '签署合同',
        label_zh: '签署合同',
        visible: function(object_name, record_id, record) {
            return record.status === 'pending';
        },
        on: 'record',
        todo: async function(object_name, record_id) {
            const confirmed = await swal({
                title: '确认签署',
                text: '确定要签署这份合同吗?',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            });
            
            if (confirmed) {
                try {
                    const { Creator } = require('@steedos/core');
                    const userId = Creator.USER_CONTEXT.userId;
                    
                    await this.getObject(object_name).directUpdate(record_id, {
                        status: 'signed',
                        signed_by: userId,
                        signed_date: new Date()
                    });
                    
                    toastr.success('合同已签署');
                    FlowRouter.reload();
                } catch (error) {
                    toastr.error('签署失败: ' + error.message);
                }
            }
        }
    },
    
    // 导出合同PDF
    export_pdf: {
        label: '导出PDF',
        label_zh: '导出PDF',
        visible: true,
        on: 'record',
        todo: async function(object_name, record_id) {
            const url = `/api/reports/contract/${record_id}/pdf`;
            window.open(url, '_blank');
        }
    }
};
```

### 步骤 7: 创建应用定义

**文件路径**: `steedos-packages/contract-management/main/default/applications/contracts.app.yml`

```yaml
_id: contracts
name: 合同管理
description: 合同管理应用 - Contract Management Application
icon: contract
is_creator: true
sort: 100
objects:
  - contracts
mobile_objects:
  - contracts
```

### 步骤 8: 在项目中引用软件包

**方法 1: 在 steedos.config.js 中配置**

```javascript
module.exports = {
    // ... 其他配置
    
    // 添加软件包路径
    metadata_packages: [
        '@steedos-packages/contract-management'
    ],
    
    // 或者使用本地路径
    metadata: [
        './steedos-packages/contract-management'
    ]
};
```

**方法 2: 在 package.json 中添加依赖**

如果软件包已发布到 npm:

```json
{
  "dependencies": {
    "@steedos-packages/contract-management": "^1.0.0"
  }
}
```

### 步骤 9: 启动项目测试

```bash
# 安装依赖(如果需要)
yarn install

# 启动服务
yarn start

# 访问 http://localhost:5100
# 登录后可以在应用列表中看到"合同管理"应用
```

### 测试验证功能

#### 测试 1: 验证合同名称长度限制

1. 创建新合同
2. 输入超过 20 个字符的名称,例如: "这是一个超过二十个字符长度的合同名称用于测试"
3. 点击保存
4. 应该看到错误提示: "合同名称长度不能超过20个字符"

#### 测试 2: 验证日期逻辑

1. 创建新合同
2. 设置结束日期早于开始日期
3. 点击保存
4. 应该看到错误提示: "结束日期必须晚于开始日期"

#### 测试 3: 测试自定义动作

1. 创建一个草稿状态的合同
2. 点击"提交审批"按钮
3. 状态应变为"审批中"
4. 点击"签署合同"按钮
5. 确认后状态应变为"已签署"

## 软件包开发最佳实践

### 1. 命名规范

```
软件包名称: @steedos-packages/[功能名称]
对象名称: [功能]_[实体] (例如: contracts, contract_items)
字段名称: 使用下划线命名法 (例如: contract_no, start_date)
```

### 2. 文件组织

```
main/default/
├── objects/              # 按对象分组
│   ├── object1/
│   │   ├── object1.object.yml
│   │   ├── object1.trigger.js
│   │   └── object1.action.js
│   └── object2/
├── applications/         # 应用定义
├── pages/               # 页面定义
├── profiles/            # 权限配置
└── translations/        # 多语言翻译
```

### 3. 验证逻辑位置

- **客户端验证**: 在对象字段定义中使用 `required`, `min`, `max`, `pattern`
- **服务端验证**: 在触发器的 `beforeInsert` 和 `beforeUpdate` 中实现
- **复杂业务逻辑**: 在触发器中实现

### 4. 错误处理

```javascript
// 好的做法: 提供清晰的中英文错误信息
throw new Error('合同名称长度不能超过20个字符。Contract name cannot exceed 20 characters.');

// 不好的做法: 只有代码或不清晰的信息
throw new Error('Invalid length');
```

### 5. 日志记录

```javascript
console.log(`[合同创建] 验证通过: ${doc.name}`);
console.error(`[合同创建] 发送通知失败:`, error.message);
```

### 6. 国际化支持

所有用户可见的文本都应提供中英文:

```yaml
label: 合同名称
label_zh: 合同名称
```

## 常见问题

### Q1: 软件包不生效怎么办?

A: 
1. 检查 `steedos.config.js` 中是否正确配置了软件包路径
2. 重启服务
3. 检查控制台日志是否有错误信息

### Q2: 验证规则没有执行?

A:
1. 确认触发器文件名正确: `{object_name}.trigger.js`
2. 确认 `listenTo` 字段与对象名称一致
3. 检查触发器中是否有语法错误
4. 重启服务

### Q3: 如何调试触发器?

A:
```javascript
beforeInsert: async function() {
    console.log('===== 触发器开始 =====');
    console.log('对象:', this.object_name);
    console.log('文档:', JSON.stringify(this.doc, null, 2));
    console.log('用户:', this.userId);
    console.log('===== 触发器结束 =====');
}
```

### Q4: 如何打包发布软件包?

A:
```bash
# 1. 更新版本号
npm version patch

# 2. 发布到 npm (如果是公开包)
npm publish --access public

# 3. 或者打包为 tgz 文件
npm pack
```

## 总结

创建一个完整的 Steedos 软件包需要:

1. ✅ 正确的目录结构
2. ✅ package.json 和 package.service.js 配置
3. ✅ 对象定义 (.object.yml)
4. ✅ 触发器验证 (.trigger.js)
5. ✅ 自定义动作 (.action.js)
6. ✅ 应用定义 (.app.yml)
7. ✅ 在项目中正确引用

关键点:
- 服务端验证必须在 trigger 的 `beforeInsert` 和 `beforeUpdate` 中实现
- 错误信息要清晰明确,最好提供中英文
- 合理使用字段验证和触发器验证
- 完整的测试验证

---

## English Guide

### What is a Steedos Package?

A Steedos package is a self-contained module with complete business functionality that can:
- Contain multiple objects (data models)
- Include business logic (triggers, actions)
- Provide user interfaces (pages, applications)
- Define permissions
- Be installed and reused in other projects

### Standard Package Structure

```
steedos-packages/
└── my-package/
    ├── package.json
    ├── package.service.js
    └── main/default/
        ├── objects/
        ├── applications/
        ├── pages/
        └── profiles/
```

### Complete Example: Contract Management Package

Follow the steps in the Chinese guide above to:
1. Create directory structure
2. Define package.json
3. Create package.service.js
4. Define contract object (.object.yml)
5. Implement server-side validation (.trigger.js)
6. Add custom actions (.action.js)
7. Create application definition (.app.yml)
8. Reference the package in your project
9. Test validation rules

Key validation in trigger:
```javascript
beforeInsert: async function() {
    const { doc } = this;
    
    // Validate contract name length <= 20 characters
    if (doc.name && doc.name.length > 20) {
        throw new Error(`Contract name cannot exceed 20 characters, current length: ${doc.name.length}.`);
    }
}
```

Remember: Server-side validation MUST be implemented in triggers, not just in object field definitions!
