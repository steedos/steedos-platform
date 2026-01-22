# Steedos Package Creation - AI Assistant Context

## ⚠️ IMPORTANT: THIS IS STEEDOS PLATFORM (Node.js), NOT PYTHON!

When the user asks to create a Steedos package, you MUST:

1. **Use the correct technology stack:**
   - Platform: **Steedos (华炎魔方)**
   - Language: **JavaScript/TypeScript** (NOT Python)
   - Metadata: **YAML files**
   - Backend: **Node.js + Moleculer**
   - Package Manager: **NPM/Yarn**

2. **Generate these file types:**
   - ✅ `.object.yml` - Object definitions
   - ✅ `.trigger.js` - Business logic (JavaScript)
   - ✅ `.action.js` - Custom actions (JavaScript)
   - ✅ `package.json` - NPM package configuration
   - ✅ `package.service.js` - Moleculer service

3. **DO NOT generate:**
   - ❌ `.py` files
   - ❌ `requirements.txt`
   - ❌ Django/Flask files
   - ❌ Any Python code

## Standard Steedos Package Structure

```
steedos-packages/
└── [package-name]/
    ├── package.json              # NPM package config
    ├── package.service.js        # Moleculer service (JavaScript)
    └── main/default/
        ├── objects/
        │   └── [object-name]/
        │       ├── [object-name].object.yml    # YAML
        │       ├── [object-name].trigger.js    # JavaScript
        │       └── [object-name].action.js     # JavaScript
        ├── applications/
        │   └── [app-name].app.yml
        └── pages/
            └── [page-name].page.yml
```

## Example: Contract Management Package

### package.json (NPM, NOT Python)
```json
{
  "name": "@steedos-packages/contract-management",
  "version": "1.0.0",
  "main": "package.service.js",
  "dependencies": {
    "@steedos/service-package-loader": "*"
  }
}
```

### package.service.js (Moleculer Service, JavaScript)
```javascript
"use strict";
const project = require('./package.json');
const packageLoader = require('@steedos/service-package-loader');

module.exports = {
    name: project.name,
    namespace: "steedos",
    mixins: [packageLoader],
    settings: {
        packageInfo: {
            path: __dirname,
            name: project.name,
            isPackage: true
        }
    }
};
```

### contracts.object.yml (Object Definition)
```yaml
name: contracts
label: 合同
icon: contract
enable_api: true

fields:
  name:
    type: text
    label: 合同名称
    required: true
  
  contract_no:
    type: autonumber
    label: 合同编号
    formula: 'HT-{YYYY}{MM}{DD}-{0000}'
  
  amount:
    type: currency
    label: 合同金额
    required: true
  
  status:
    type: select
    label: 状态
    options:
      - label: 草稿
        value: draft
      - label: 已签署
        value: signed

list_views:
  all:
    label: 所有合同
    columns:
      - name
      - contract_no
      - amount
      - status

permission_set:
  user:
    allowCreate: true
    allowRead: true
    allowEdit: true
    allowDelete: false
```

### contracts.trigger.js (Server-Side Validation, JavaScript)
```javascript
/**
 * Server-side validation for contracts
 * JavaScript trigger file
 */
module.exports = {
    listenTo: 'contracts',
    
    beforeInsert: async function() {
        const { doc } = this;
        
        // Validate: Contract name length <= 20 characters
        if (doc.name && doc.name.length > 20) {
            throw new Error(
                `合同名称长度不能超过20个字符,当前长度: ${doc.name.length}。` +
                `Contract name cannot exceed 20 characters, current: ${doc.name.length}.`
            );
        }
        
        // Validate: Amount must be positive
        if (doc.amount && doc.amount <= 0) {
            throw new Error('合同金额必须大于0。Amount must be positive.');
        }
        
        console.log(`[Contract Created] Validated: ${doc.name}`);
    },
    
    beforeUpdate: async function() {
        const { doc, previousDoc } = this;
        
        // Validate: Contract name length <= 20 characters
        if (doc.name && doc.name.length > 20) {
            throw new Error(
                `合同名称长度不能超过20个字符,当前长度: ${doc.name.length}。` +
                `Contract name cannot exceed 20 characters, current: ${doc.name.length}.`
            );
        }
        
        console.log(`[Contract Updated] Validated: ${doc.name || previousDoc.name}`);
    }
};
```

## Key Validation Points

When creating a Steedos package with server-side validation:

1. **Validation Location**: Implement in `.trigger.js` file (JavaScript)
2. **Validation Hooks**:
   - `beforeInsert` - Validates before creating new records
   - `beforeUpdate` - Validates before updating records
3. **Error Handling**: Use `throw new Error()` with clear messages
4. **Context Variables**:
   - `this.doc` - Current document data
   - `this.previousDoc` - Original data (in beforeUpdate)
   - `this.userId` - Current user ID
   - `this.object_name` - Object name

## Complete Directory Creation Commands

```bash
# Create package structure (Unix/Mac)
mkdir -p steedos-packages/contract-management/main/default/objects/contracts
mkdir -p steedos-packages/contract-management/main/default/applications

# Windows PowerShell
New-Item -ItemType Directory -Path steedos-packages/contract-management/main/default/objects/contracts -Force
New-Item -ItemType Directory -Path steedos-packages/contract-management/main/default/applications -Force
```

## Usage Instructions for Users

Tell users to provide this context to you:

```
使用 Steedos 平台(Node.js + JavaScript)创建合同管理软件包。
参考 .github/prompts/customer/05-package-development.md

要求:
1. 创建完整的 Steedos 软件包结构
2. 使用 JavaScript .trigger.js 文件实现服务端校验
3. 合同名称长度不能超过20个字符
4. 生成所有必需文件: package.json, package.service.js, .object.yml, .trigger.js

请生成完整的代码文件。
```

## Remember:
- ✅ Steedos = Node.js + JavaScript + YAML
- ✅ Triggers = .trigger.js files (JavaScript)
- ✅ Package config = package.json (NPM)
- ❌ NOT Python, NOT Django, NOT Flask
- ❌ NOT .py files, NOT requirements.txt

When in doubt, always use JavaScript/Node.js syntax for Steedos packages!
