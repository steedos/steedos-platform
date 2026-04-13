---
name: project-format
description: |
  Learn how to create and structure Steedos projects using Node.js/TypeScript.
Covers minimal project requirements, package.json configuration,
steedos-config.yml setup, directory structure, environment variables, and
installation procedures. Use when creating a new Steedos project or
understanding project organization.
---

# Steedos Project Format | Steedos 项目格式

## Overview | 概述

A Steedos project is a Node.js/TypeScript project that runs the Steedos platform. This is the standard structure for creating Steedos applications.

Steedos 项目是运行 Steedos 平台的 Node.js/TypeScript 项目。这是创建 Steedos 应用的标准结构。

## Technology Stack | 技术栈

- **Platform**: Steedos (华炎魔方) - Enterprise Low-Code Platform
- **Backend**: Node.js + TypeScript + Moleculer microservices
- **Frontend**: React + Amis (Baidu low-code UI framework)
- **Metadata**: YAML files (.object.yml, .trigger.js, .action.js)
- **Databases**: MongoDB (metadata), PostgreSQL/MySQL (business data)
- **Package Manager**: Yarn 3.8.7 or NPM

## Minimal Project Structure | 最小项目结构

```
my-steedos-project/
├── package.json              # NPM package configuration (REQUIRED)
├── steedos-config.yml        # Steedos configuration (REQUIRED)
├── .env                      # Environment variables (RECOMMENDED)
├── .gitignore               # Git ignore rules
└── steedos-packages/        # Custom packages (OPTIONAL)
    └── my-package/
        └── ...
```

## Required Files | 必需文件

### 1. package.json (REQUIRED)

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

**Key Points:**
- `@steedos/server` dependency is REQUIRED
- `workspaces` for custom packages (if using Yarn)
- `start` script to run Steedos

### 2. steedos-config.yml (REQUIRED)

This file is REQUIRED by Steedos, even if empty.

```yaml
# Empty file is acceptable
# Or add configuration:
metadata_packages:
  - '@steedos-packages/my-package'
```

**Note**: Can be empty, but must exist.

### 3. .env (RECOMMENDED)

```env
# Server Configuration
PORT=5100
ROOT_URL=http://localhost:5100

# Database
MONGO_URL=mongodb://127.0.0.1:27017/steedos

# Message Queue & Cache
TRANSPORTER=redis://127.0.0.1:6379
CACHER=redis://127.0.0.1:6379/1

# Storage
STEEDOS_STORAGE_DIR=./steedos-storage

# Logging
B6_LOG_LEVEL=warn
```

## Complete Project Structure | 完整项目结构

```
my-steedos-project/
├── package.json                      # NPM configuration
├── steedos-config.yml                # Steedos configuration
├── .env                              # Environment variables
├── .gitignore                        # Git ignore
├── yarn.lock / package-lock.json    # Dependency lock file
├── node_modules/                     # Dependencies
├── steedos-storage/                  # File storage
└── steedos-packages/                 # Custom packages
    ├── package-1/
    │   ├── package.json
    │   ├── package.service.js
    │   └── main/default/
    │       ├── objects/
    │       ├── applications/
    │       ├── triggers/
    │       └── pages/
    └── package-2/
        └── ...
```

## Installation & Setup | 安装和设置

### Step 1: Create Project Directory

```bash
mkdir my-steedos-project
cd my-steedos-project
```

### Step 2: Create package.json

```bash
npm init -y
# Edit package.json to add required fields
```

### Step 3: Create steedos-config.yml

```bash
touch steedos-config.yml
```

### Step 4: Create .env

```bash
cat > .env << EOF
PORT=5100
ROOT_URL=http://localhost:5100
MONGO_URL=mongodb://127.0.0.1:27017/steedos
TRANSPORTER=redis://127.0.0.1:6379
CACHER=redis://127.0.0.1:6379/1
STEEDOS_STORAGE_DIR=./steedos-storage
B6_LOG_LEVEL=warn
EOF
```

### Step 5: Install Dependencies

```bash
npm install @steedos/server
# or
yarn add @steedos/server
```

### Step 6: Start Server

```bash
npm start
# or
steedos start
```

## Creating with CLI | 使用 CLI 创建

Steedos provides a CLI tool for quick project creation:

```bash
# Install CLI
npm install -g @steedos/cli

# Create project
steedos create my-project
cd my-project

# Start
npm start
```

## Workspace Configuration | 工作区配置

If using Yarn workspaces (recommended for multiple packages):

```json
{
  "name": "my-steedos-project",
  "private": true,
  "workspaces": [
    "steedos-packages/*"
  ]
}
```

This allows packages to be:
- Developed independently
- Shared across projects
- Version controlled separately

## Git Configuration | Git 配置

Recommended .gitignore:

```
# Dependencies
node_modules/
.yarn/
.pnp.*

# Environment
.env
.env.local

# Storage
steedos-storage/
.steedos/

# Logs
logs/
*.log

# Build
dist/
build/
.cache/

# IDE
.vscode/
.idea/
*.swp
*.swo
```

## Best Practices | 最佳实践

1. **Version Control**:
   - Always commit `package.json`, `steedos-config.yml`
   - Use `.gitignore` for `node_modules/`, `.env`, storage

2. **Environment Variables**:
   - Use `.env` for local development
   - Use environment variables for production
   - Never commit `.env` to version control

3. **Package Organization**:
   - Group related functionality in packages
   - Use meaningful package names
   - Follow naming convention: `@steedos-packages/[name]`

4. **Dependencies**:
   - Lock dependency versions in production
   - Regularly update dependencies
   - Use `yarn.lock` or `package-lock.json`

## Common Commands | 常用命令

```bash
# Start development server
npm start

# Build packages
npm run build

# Install dependencies
npm install
# or
yarn install

# Add new package
cd steedos-packages
mkdir my-package
cd my-package
npm init -y
```

## Troubleshooting | 故障排除

### Issue: Server won't start
- Check if `steedos-config.yml` exists
- Verify MongoDB and Redis are running
- Check `.env` configuration
- Review logs for errors

### Issue: Packages not loading
- Verify package structure
- Check `steedos-config.yml` configuration
- Restart server after changes
- Check console for error messages

### Issue: Port already in use
- Change `PORT` in `.env`
- Kill existing process: `lsof -ti:5100 | xargs kill`

## References | 参考资料

- [Steedos Documentation](https://docs.steedos.com/)
- [Getting Started Guide](https://docs.steedos.com/getting-started)
- [Project Examples](https://github.com/steedos/steedos-templates)
