# GitHub Copilot Custom Instructions for Steedos Platform

## ⚠️ CRITICAL: Technology Stack

**This is a Steedos Platform project using Node.js and JavaScript - NOT Python!**

When working with this repository:

### Technology Stack
- **Platform**: Steedos (华炎魔方) - Enterprise Low-Code Platform
- **Backend**: Node.js + TypeScript + Moleculer microservices
- **Frontend**: React + Amis (Baidu low-code UI framework)
- **Metadata**: YAML files (.object.yml, .trigger.js, .action.js)
- **Databases**: MongoDB (metadata), PostgreSQL/MySQL (business data)
- **Package Manager**: Yarn 3.8.7

## Creating a New Steedos Project

### Quick Start (Minimal Setup)

To create a new Steedos project from scratch:

1. **Create project directory and package.json**:
```json
{
  "name": "my-steedos-project",
  "version": "0.0.1",
  "private": true,
  "workspaces": [
    "steedos-packages/*"
  ],
  "scripts": {
    "start": "steedos start",
    "build": "lerna run build"
  },
  "dependencies": {
    "@steedos/server": "latest"
  }
}
```

2. **Create steedos-config.yml (REQUIRED)**:
```bash
touch steedos-config.yml
```
Create an empty `steedos-config.yml` file in the project root. This file is required by Steedos.

3. **Create .env file (RECOMMENDED)**:
Create a `.env` file with default configuration:
```env
PORT=5100
ROOT_URL=http://localhost:5100
MONGO_URL=mongodb://127.0.0.1:27017/steedos
TRANSPORTER=redis://127.0.0.1:6379
CACHER=redis://127.0.0.1:6379/1

STEEDOS_STORAGE_DIR=./steedos-storage

B6_LOG_LEVEL=warn
```

4. **Install dependencies**:
```bash
yarn install
```

5. **Start the server**:
```bash
yarn start
```

### Project Structure

A minimal Steedos project only needs:
- `package.json` with `@steedos/server` dependency
- `steedos-config.yml` **REQUIRED** configuration file (can be empty)
- `.env` file **RECOMMENDED** with default configuration (see below)
- Optional: `steedos-packages/` folder for custom packages

The `@steedos/server` package provides everything needed to run Steedos.

### When User Says "创建 Steedos 项目" (Create Steedos Project)

Generate a Node.js project with:
1. ✅ `package.json` with `@steedos/server` dependency
2. ✅ `steedos-config.yml` file (empty or basic config) - **REQUIRED**
3. ✅ `.env` file with default configuration - **RECOMMENDED**
4. ✅ `workspaces` configuration for packages
5. ✅ Start script: `"start": "steedos start"`
6. ✅ Optional: Initial package in `steedos-packages/`
7. ❌ NOT Python files or Django/Flask setup

### When Creating Steedos Packages

**ALWAYS generate these file types:**
- ✅ `.object.yml` - Object definitions (YAML format)
- ✅ `.trigger.js` - Business logic triggers (JavaScript)
- ✅ `.action.js` - Custom actions (JavaScript)
- ✅ `package.json` - NPM package configuration
- ✅ `package.service.js` - Moleculer service (JavaScript)

**NEVER generate these:**
- ❌ `.py` files (Python)
- ❌ `requirements.txt` (Python)
- ❌ Django or Flask files
- ❌ Any Python code

### Required Elements in .object.yml Files

**Every .object.yml MUST include:**
1. ✅ **list_views** section with at least an `all` view
2. ✅ **permission_set** section with at least `user` and `admin` permissions
3. ✅ **fields** section with proper field definitions

**Example of required sections:**
```yaml
list_views:
  all:
    label: All Records
    columns: [name, status, modified]
    filter_scope: space

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

### Package Structure Template

```
steedos-packages/
└── [package-name]/
    ├── package.json              # NPM config
    ├── package.service.js        # Moleculer service (JavaScript)
    └── main/default/
        ├── objects/
        │   ├── [object-name].object.yml    # Object definition (YAML)
        │   └── [object-name].action.js     # Custom actions (JavaScript)
        ├── triggers/
        │   └── [object-name].trigger.js    # Server-side validation (JavaScript)
        ├── applications/
        │   └── [app-name].app.yml          # Application definition (optional)
        └── pages/
            └── [page-name].page.yml        # Custom pages (optional)
```

**Important Notes:**
- Triggers go in `main/default/triggers/` folder (NOT inside objects folder)
- Applications should be created based on user requirements
- Each package should have at least one object and may include an application

### Server-Side Validation Pattern

Always implement validation in `.trigger.js` files using JavaScript:

```javascript
module.exports = {
    listenTo: 'object_name',
    
    beforeInsert: async function() {
        const { doc } = this;
        
        // Example: Validate field length
        if (doc.name && doc.name.length > 20) {
            throw new Error(`名称长度不能超过20个字符。Length cannot exceed 20 characters.`);
        }
    },
    
    beforeUpdate: async function() {
        const { doc, previousDoc } = this;
        // Validation logic
    }
};
```

### Key Patterns

**Object Definition (.object.yml):**
```yaml
name: object_name
label: Object Label
enable_api: true

fields:
  name:
    type: text
    label: Name
    required: true
  
  status:
    type: select
    label: Status
    options:
      - label: Active
        value: active
      - label: Inactive
        value: inactive

# Default list view (REQUIRED)
list_views:
  all:
    label: All Records
    columns:
      - name
      - status
      - owner
      - modified
    filter_scope: space
    sort:
      - field_name: modified
        order: desc

# Default permissions (REQUIRED)
permission_set:
  user:
    allowCreate: true
    allowDelete: false
    allowEdit: true
    allowRead: true
    modifyAllRecords: false
    viewAllRecords: true
  
  admin:
    allowCreate: true
    allowDelete: true
    allowEdit: true
    allowRead: true
    modifyAllRecords: true
    viewAllRecords: true
```
```

**Moleculer Service (package.service.js):**
```javascript
"use strict";
const packageLoader = require('@steedos/service-package-loader');

module.exports = {
    name: "@steedos-packages/package-name",
    namespace: "steedos",
    mixins: [packageLoader],
    settings: {
        packageInfo: {
            path: __dirname,
            name: "@steedos-packages/package-name",
            isPackage: true
        }
    }
};
```

## Code Standards

### TypeScript/JavaScript
- Use TypeScript for core platform code
- Use async/await (not callbacks)
- Follow ES6+ syntax
- Use meaningful variable names
- Add JSDoc comments

### Metadata (YAML)
- Use snake_case for API names (e.g., `contract_no`, `start_date`)
- Provide bilingual labels (English and Chinese)
- Include proper field types and validations

### File Naming
- Objects: `{object_name}.object.yml` (in `objects/` folder)
- Triggers: `{object_name}.trigger.js` (in `triggers/` folder, NOT in objects/)
- Actions: `{object_name}.action.js` (in `objects/` folder)
- Pages: `{page_name}.page.yml` (in `pages/` folder)
- Applications: `{app_name}.app.yml` (in `applications/` folder)

### Application Files (.app.yml)

**When to create an application:**
- Create when user requests a specific app or management interface
- Applications group related objects together
- Include relevant objects in the `objects:` list or use `tab_items:` for detailed configuration

**Example Application:**
```yaml
name: Contract Management
code: contracts
description: Contract management application
icon: contract
is_creator: true
objects:
  - contracts
  - contract_items
visible: true
```

## Common Mistakes to Avoid

1. ❌ Don't generate Python code for Steedos packages
2. ❌ Don't use .py extension for any Steedos files
3. ❌ Don't confuse "软件包" (package) with Python packages
4. ❌ Don't create Django/Flask applications
5. ❌ Don't put triggers inside `objects/[object-name]/` folder
   - ✅ Triggers go in `main/default/triggers/` folder
6. ❌ Don't forget to create application files when user requests a management interface

## When User Says "创建软件包" (Create Package)

Understand this as: **Create a Steedos package using Node.js/JavaScript**

Generate:
- package.json (NPM format)
- package.service.js (JavaScript Moleculer service)
- .object.yml files (YAML metadata)
- .trigger.js files (JavaScript validation)

## Additional Resources

For detailed guidance, refer to:
- `.github/prompts/STEEDOS_PACKAGE_CONTEXT.md` - Package creation guide
- `.github/prompts/customer/05-package-development.md` - Complete tutorial
- `.cursorrules` - General development rules

## Remember

**Steedos = Node.js + JavaScript + YAML**, NOT Python!

When in doubt about technology stack, always choose JavaScript/Node.js for Steedos platform development.
