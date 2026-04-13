---
name: package-format
description: |
  Understand Steedos package structure and organization. Learn how to create
  self-contained, reusable modules with objects, business logic, and UI
  components using Moleculer microservices. Covers package.json setup, service
  configuration, metadata organization, naming conventions, and best practices.
  Use when developing or organizing Steedos packages.
---

# Steedos Package Format | Steedos 软件包格式

## Overview | 概述

A Steedos package is a self-contained, reusable module containing objects, business logic, UI components, and configurations. Packages are the building blocks of Steedos applications.

Steedos 软件包是一个独立的、可复用的模块,包含对象、业务逻辑、UI 组件和配置。软件包是 Steedos 应用的构建模块。

## Technology Stack | 技术栈

- **Language**: JavaScript/TypeScript (NOT Python)
- **Service Framework**: Moleculer microservices
- **Metadata Format**: YAML + JavaScript
- **Package Manager**: NPM/Yarn

## Package Structure | 软件包结构

```
steedos-packages/
└── my-package/
    ├── package.json              # NPM package configuration
    ├── package.service.js        # Moleculer service entry point
    ├── README.md                 # Documentation (optional)
    └── main/
        └── default/
            ├── objects/          # Object definitions
            │   ├── object1.object.yml
            │   └── object1.action.js
            ├── triggers/         # Server-side triggers
            │   └── object1.trigger.js
            ├── applications/     # Application definitions
            │   └── app1.app.yml
            ├── pages/            # Custom pages
            │   └── page1.page.yml
            ├── profiles/         # Permission profiles (optional)
            │   └── user.profile.yml
            └── translations/     # i18n translations (optional)
                └── zh-CN.i18n.yml
```

## Required Files | 必需文件

### 1. package.json (REQUIRED)

```json
{
  "name": "@steedos-packages/my-package",
  "version": "1.0.0",
  "description": "My Steedos Package",
  "main": "package.service.js",
  "scripts": {
    "test": "echo \"No tests\" && exit 0"
  },
  "keywords": [
    "steedos",
    "package"
  ],
  "author": "Your Name",
  "license": "MIT",
  "dependencies": {
    "@steedos/service-package-loader": "*"
  }
}
```

**Key Points:**
- Name format: `@steedos-packages/[package-name]`
- Main entry: `package.service.js`
- Required dependency: `@steedos/service-package-loader`

### 2. package.service.js (REQUIRED)

```javascript
"use strict";
const project = require('./package.json');
const packageName = project.name;
const packageLoader = require('@steedos/service-package-loader');

/**
 * Steedos Package Service
 * This service loads all metadata from the package
 */
module.exports = {
    name: packageName,
    namespace: "steedos",
    mixins: [packageLoader],

    /**
     * Service settings
     */
    settings: {
        packageInfo: {
            path: __dirname,
            name: packageName,
            isPackage: true  // Mark as package
        }
    },

    /**
     * Service dependencies
     */
    dependencies: [],

    /**
     * Service started lifecycle event handler
     */
    async started() {
        console.log(`${packageName} package started`);
    },

    /**
     * Service stopped lifecycle event handler
     */
    async stopped() {
        console.log(`${packageName} package stopped`);
    }
};
```

**Key Points:**
- Uses `@steedos/service-package-loader` mixin
- Namespace must be "steedos"
- `isPackage: true` is required

## Directory Structure Explanation | 目录结构说明

### main/default/ (Standard Metadata Location)

This is the standard Salesforce DX-compatible structure for storing metadata.

#### objects/ - Object Definitions

Contains object metadata files:
- `*.object.yml` - Object schema definition
- `*.action.js` - Custom actions/buttons
- Object-specific configurations

```
objects/
├── contracts.object.yml      # Object definition
└── contracts.action.js       # Custom actions
```

#### triggers/ - Business Logic Triggers

**IMPORTANT**: Triggers MUST be in the `triggers/` folder, NOT in `objects/`

```
triggers/
└── contracts.trigger.js      # Server-side validation
```

#### applications/ - Application Definitions

Application configurations that group objects:

```
applications/
└── contracts.app.yml         # Application definition
```

#### pages/ - Custom Pages

Custom UI pages using Amis framework:

```
pages/
├── dashboard.page.yml        # Dashboard page
└── custom_form.page.yml      # Custom form
```

#### profiles/ - Permission Profiles

Permission configurations for different user types:

```
profiles/
├── user.profile.yml          # User permissions
└── admin.profile.yml         # Admin permissions
```

#### translations/ - Internationalization

Multi-language support:

```
translations/
├── zh-CN.i18n.yml           # Chinese translations
└── en.i18n.yml              # English translations
```

## Package Types | 软件包类型

### 1. Simple Package (Basic)

Minimal structure with one object:

```
my-package/
├── package.json
├── package.service.js
└── main/default/
    ├── objects/
    │   └── my_object.object.yml
    └── triggers/
        └── my_object.trigger.js
```

### 2. Complete Package (Recommended)

Full-featured package with all components:

```
my-package/
├── package.json
├── package.service.js
└── main/default/
    ├── objects/
    │   ├── object1.object.yml
    │   ├── object1.action.js
    │   └── object2.object.yml
    ├── triggers/
    │   ├── object1.trigger.js
    │   └── object2.trigger.js
    ├── applications/
    │   └── app.app.yml
    ├── pages/
    │   └── dashboard.page.yml
    └── profiles/
        └── user.profile.yml
```

### 3. Service Package (Advanced)

Package with custom Moleculer services:

```
my-package/
├── package.json
├── package.service.js
├── services/
│   ├── custom.service.js    # Custom service
│   └── api.service.js       # Custom API
└── main/default/
    └── objects/
        └── my_object.object.yml
```

## Naming Conventions | 命名规范

### Package Names

- Format: `@steedos-packages/[name]`
- Use lowercase and hyphens
- Examples:
  - `@steedos-packages/contract-management`
  - `@steedos-packages/crm`
  - `@steedos-packages/project-management`

### File Names

- Objects: `[object_name].object.yml`
- Triggers: `[object_name].trigger.js`
- Actions: `[object_name].action.js`
- Applications: `[app_code].app.yml`
- Pages: `[page_name].page.yml`

### API Names (in YAML)

Use `snake_case`:
- Object names: `contracts`, `contract_items`
- Field names: `contract_no`, `start_date`, `customer_name`

## Package Registration | 软件包注册

### In Project (Local)

Edit `steedos-config.yml`:

```yaml
metadata:
  - ./steedos-packages/my-package
```

### As NPM Dependency

In project `package.json`:

```json
{
  "dependencies": {
    "@steedos-packages/my-package": "^1.0.0"
  }
}
```

Then in `steedos-config.yml`:

```yaml
metadata_packages:
  - '@steedos-packages/my-package'
```

## Package Development Workflow | 软件包开发流程

### Step 1: Create Package Directory

```bash
cd steedos-packages
mkdir my-package
cd my-package
```

### Step 2: Initialize Package

```bash
npm init -y
```

### Step 3: Create Directory Structure

```bash
mkdir -p main/default/objects
mkdir -p main/default/triggers
mkdir -p main/default/applications
mkdir -p main/default/pages
```

### Step 4: Create package.service.js

Create the Moleculer service file (see template above).

### Step 5: Create Metadata

Create objects, triggers, applications as needed.

### Step 6: Register Package

Add to `steedos-config.yml` or install via NPM.

### Step 7: Test

```bash
cd ../..  # Back to project root
npm start
```

## Package Dependencies | 软件包依赖

### Between Packages

If your package depends on another:

```javascript
// package.service.js
module.exports = {
    name: packageName,
    namespace: "steedos",
    mixins: [packageLoader],

    dependencies: [
        '@steedos-packages/base-package'
    ],

    // ... rest of configuration
};
```

### External Libraries

Add to package.json:

```json
{
  "dependencies": {
    "@steedos/service-package-loader": "*",
    "lodash": "^4.17.21",
    "moment": "^2.29.4"
  }
}
```

## Publishing Packages | 发布软件包

### Prepare for Publishing

1. Update version in `package.json`
2. Add README.md
3. Test thoroughly
4. Update CHANGELOG

### Publish to NPM

```bash
# Login to NPM
npm login

# Publish (public)
npm publish --access public

# Or publish (private)
npm publish
```

### Versioning

Follow Semantic Versioning:
- `1.0.0` - Major.Minor.Patch
- `1.0.1` - Bug fixes
- `1.1.0` - New features
- `2.0.0` - Breaking changes

## Best Practices | 最佳实践

### 1. Package Organization

- One package per business domain
- Keep packages focused and cohesive
- Avoid circular dependencies

### 2. File Organization

- ✅ Triggers in `triggers/` folder
- ❌ NOT in `objects/[object-name]/` folder
- Group related objects together
- Separate concerns (objects, triggers, pages)

### 3. Naming

- Use descriptive package names
- Follow `snake_case` for API names
- Use bilingual labels (English + Chinese)

### 4. Documentation

- Add README.md to each package
- Document configuration options
- Include usage examples

### 5. Version Control

- Use Git for version control
- Tag releases
- Keep CHANGELOG updated

### 6. Testing

- Test packages independently
- Test integration with other packages
- Validate metadata structure

## Common Issues | 常见问题

### Issue: Package not loading

**Solution**:
1. Check `steedos-config.yml` configuration
2. Verify package.service.js exists
3. Check console for errors
4. Restart server

### Issue: Triggers not working

**Solution**:
1. Ensure triggers are in `triggers/` folder
2. Check `listenTo` matches object name
3. Verify no syntax errors
4. Check console logs

### Issue: Objects not visible

**Solution**:
1. Check object YAML syntax
2. Verify permissions are set
3. Check if application includes the object
4. Clear cache and restart

## Example Packages | 示例软件包

### Minimal Example

```
@steedos-packages/simple/
├── package.json
├── package.service.js
└── main/default/
    └── objects/
        └── tasks.object.yml
```

### Complete Example

See `.github/prompts/customer/05-package-development.md` for a complete contract management package example.

## References | 参考资料

- [Package Development Guide](../.github/prompts/customer/05-package-development.md)
- [Object Format](./05-objects.md)
- [Trigger Format](./10-object-triggers.md)
- [Steedos Documentation](https://docs.steedos.com/)
