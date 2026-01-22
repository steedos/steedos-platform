# Steedos 项目创建指南 / Steedos Project Setup Guide

[English version below]

---

## 中文指南

### 快速创建 Steedos 项目

使用自然语言即可创建 Steedos 项目!只需告诉 AI:"创建一个 Steedos 项目"。

### 项目结构

Steedos 项目是一个简单的 Node.js 项目,核心只需要:

```
my-project/
├── package.json              # 包含 @steedos/server 依赖
├── steedos-config.yml        # 必需: Steedos 配置文件 (可以为空)
├── .env                      # 推荐: 环境配置 (包含默认设置)
├── steedos-packages/         # 可选: 自定义软件包
│   └── my-package/
│       ├── package.json
│       ├── package.service.js
│       └── main/default/
└── steedos-storage/          # 自动创建: 文件存储目录
```

### 最小化 package.json

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

**说明**:
- `@steedos/server`: 这是唯一必需的依赖,包含了运行 Steedos 所需的全部功能
- `workspaces`: 支持在 `steedos-packages/` 中创建多个软件包
- `steedos start`: 启动命令
- `steedos-config.yml`: **必需的配置文件**(可以为空文件)

### 创建步骤

#### 步骤 1: 创建项目目录

```bash
mkdir my-steedos-project
cd my-steedos-project
```

#### 步骤 2: 创建 package.json

```bash
npm init -y
```

然后编辑 `package.json`:

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
    "@steedos/server": "3.0.13-beta.11"
  }
}
```

#### 步骤 3: 安装依赖

```bash
npm install
# 或使用 yarn
yarn install
```

#### 步骤 4: 创建 steedos-config.yml

**必需**: 在项目根目录创建一个空的 `steedos-config.yml` 文件:

```bash
touch steedos-config.yml
```

或者创建一个基本的配置文件:

```yaml
# steedos-config.yml
# 这是 Steedos 的配置文件,可以为空或添加自定义配置
```

#### 步骤 5: (可选) 创建软件包目录

```bash
mkdir -p steedos-packages
```

#### 步骤 5: (可选但推荐) 创建 .env 文件

在项目根目录创建 `.env` 文件,包含默认配置:

```env
PORT=5100
ROOT_URL=http://localhost:5100
MONGO_URL=mongodb://127.0.0.1:27017/steedos
TRANSPORTER=redis://127.0.0.1:6379
CACHER=redis://127.0.0.1:6379/1

STEEDOS_STORAGE_DIR=./steedos-storage

B6_LOG_LEVEL=warn
```

#### 步骤 6: (可选) 创建软件包目录

```bash
mkdir -p steedos-packages
```

#### 步骤 7: 启动项目

```bash
npm start
# 或
steedos start
```

服务器将在 http://localhost:5100 启动。

### 添加自定义软件包

创建软件包后(参考 05-package-development.md),将其放入 `steedos-packages/` 目录:

```
steedos-packages/
└── contract-management/
    ├── package.json
    ├── package.service.js
    └── main/default/
        ├── objects/
        ├── triggers/
        └── applications/
```

Steedos 会自动加载所有 `steedos-packages/` 中的软件包。

### 环境配置

**推荐**: 在项目根目录创建 `.env` 文件,包含以下默认配置:

```env
PORT=5100
ROOT_URL=http://localhost:5100
MONGO_URL=mongodb://127.0.0.1:27017/steedos
TRANSPORTER=redis://127.0.0.1:6379
CACHER=redis://127.0.0.1:6379/1

STEEDOS_STORAGE_DIR=./steedos-storage

B6_LOG_LEVEL=warn
```

**说明**:
- `PORT`: 服务器端口,默认 5100
- `ROOT_URL`: 应用根 URL
- `MONGO_URL`: MongoDB 数据库连接地址
- `TRANSPORTER`: Moleculer 传输层 (Redis)
- `CACHER`: Moleculer 缓存层 (Redis)
- `STEEDOS_STORAGE_DIR`: 文件存储目录
- `B6_LOG_LEVEL`: 日志级别

### 自然语言指令示例

当用户说以下内容时,AI 应该创建 Steedos 项目:

- "创建一个 Steedos 项目"
- "新建 Steedos 应用项目"
- "初始化一个华炎魔方项目"
- "搭建 Steedos 开发环境"

**生成内容应包括:**
1. ✅ `package.json` (包含 `@steedos/server` 依赖)
2. ✅ `steedos-config.yml` (空文件或基本配置)
3. ✅ `.env` 文件 (推荐包含默认配置)
4. ✅ `workspaces` 配置
5. ✅ 启动脚本
6. ✅ 可选的初始软件包
7. ❌ 不要生成 Python 文件
8. ❌ 不要生成 requirements.txt

### 完整示例:创建带初始软件包的项目

**需求**: "创建一个 Steedos 项目,包含合同管理功能"

**生成文件**:

1. `package.json`:
```json
{
  "name": "contract-management-system",
  "version": "0.0.1",
  "private": true,
  "workspaces": [
    "steedos-packages/*"
  ],
  "scripts": {
    "start": "steedos start"
  },
  "dependencies": {
    "@steedos/server": "latest"
  }
}
```

2. `steedos-packages/contract-management/package.json`:
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

3. `steedos-packages/contract-management/package.service.js`
4. `steedos-packages/contract-management/main/default/objects/contracts.object.yml`
5. 其他必要文件...

### 关键要点

- ✅ Steedos 项目本质上是 Node.js 项目
- ✅ 唯一必需依赖: `@steedos/server`
- ✅ 使用 `steedos start` 启动
- ✅ 软件包放在 `steedos-packages/` 目录
- ✅ 支持 npm workspaces 管理多个软件包
- ❌ 不是 Python 项目
- ❌ 不需要 Django/Flask

---

## English Guide

### Quick Create Steedos Project

Use natural language to create a Steedos project! Just tell AI: "Create a Steedos project".

### Project Structure

A Steedos project is simply a Node.js project. The core requirements:

```
my-project/
├── package.json              # With @steedos/server dependency
├── steedos-config.yml        # Required: Steedos config file (can be empty)
├── .env                      # Recommended: Environment config (with default settings)
├── steedos-packages/         # Optional: Custom packages
│   └── my-package/
│       ├── package.json
│       ├── package.service.js
│       └── main/default/
└── steedos-storage/          # Auto-created: File storage directory
```

### Minimal package.json

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

**Explanation**:
- `@steedos/server`: The only required dependency containing all Steedos functionality
- `workspaces`: Support creating multiple packages in `steedos-packages/`
- `steedos start`: Start command
- `steedos-config.yml`: **Required configuration file** (can be empty)

### Creation Steps

#### Step 1: Create Project Directory

```bash
mkdir my-steedos-project
cd my-steedos-project
```

#### Step 2: Create package.json

```bash
npm init -y
```

Then edit `package.json`:

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
    "@steedos/server": "3.0.13-beta.11"
  }
}
```

#### Step 3: Install Dependencies

```bash
npm install
# or with yarn
yarn install
```

#### Step 4: Create steedos-config.yml

**Required**: Create an empty `steedos-config.yml` file in the project root:

```bash
touch steedos-config.yml
```

Or create a basic configuration file:

```yaml
# steedos-config.yml
# This is the Steedos configuration file, can be empty or contain custom config
```

#### Step 5: (Optional) Create Packages Directory

```bash
mkdir -p steedos-packages
```

#### Step 5: (Optional but Recommended) Create .env File

Create a `.env` file in the project root with default configuration:

```env
PORT=5100
ROOT_URL=http://localhost:5100
MONGO_URL=mongodb://127.0.0.1:27017/steedos
TRANSPORTER=redis://127.0.0.1:6379
CACHER=redis://127.0.0.1:6379/1

STEEDOS_STORAGE_DIR=./steedos-storage

B6_LOG_LEVEL=warn
```

#### Step 6: (Optional) Create Packages Directory

```bash
mkdir -p steedos-packages
```

#### Step 7: Start the Project

```bash
npm start
# or
steedos start
```

The server will start at http://localhost:5100.

### Adding Custom Packages

After creating a package (see 05-package-development.md), place it in `steedos-packages/` directory:

```
steedos-packages/
└── contract-management/
    ├── package.json
    ├── package.service.js
    └── main/default/
        ├── objects/
        ├── triggers/
        └── applications/
```

Steedos automatically loads all packages in `steedos-packages/`.

### Environment Configuration

**Recommended**: Create a `.env` file in the project root with the following default configuration:

```env
PORT=5100
ROOT_URL=http://localhost:5100
MONGO_URL=mongodb://127.0.0.1:27017/steedos
TRANSPORTER=redis://127.0.0.1:6379
CACHER=redis://127.0.0.1:6379/1

STEEDOS_STORAGE_DIR=./steedos-storage

B6_LOG_LEVEL=warn
```

**Explanation**:
- `PORT`: Server port, default 5100
- `ROOT_URL`: Application root URL
- `MONGO_URL`: MongoDB database connection URL
- `TRANSPORTER`: Moleculer transporter (Redis)
- `CACHER`: Moleculer cacher (Redis)
- `STEEDOS_STORAGE_DIR`: File storage directory
- `B6_LOG_LEVEL`: Logging level

### Natural Language Instruction Examples

When user says:

- "Create a Steedos project"
- "Initialize a new Steedos application"
- "Set up Steedos development environment"
- "创建一个 Steedos 项目" (Chinese)

**Generated content should include:**
1. ✅ `package.json` (with `@steedos/server` dependency)
2. ✅ `steedos-config.yml` (empty or basic config)
3. ✅ `.env` file (recommended with default config)
4. ✅ `workspaces` configuration
5. ✅ Start script
6. ✅ Optional initial package
7. ❌ NO Python files
8. ❌ NO requirements.txt

### Complete Example: Project with Initial Package

**Requirement**: "Create a Steedos project with contract management features"

**Generated Files**:

1. `package.json`:
```json
{
  "name": "contract-management-system",
  "version": "0.0.1",
  "private": true,
  "workspaces": [
    "steedos-packages/*"
  ],
  "scripts": {
    "start": "steedos start"
  },
  "dependencies": {
    "@steedos/server": "latest"
  }
}
```

2. `steedos-packages/contract-management/package.json`:
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

3. `steedos-packages/contract-management/package.service.js`
4. `steedos-packages/contract-management/main/default/objects/contracts.object.yml`
5. Other necessary files...

### Key Points

- ✅ Steedos project is essentially a Node.js project
- ✅ Only required dependency: `@steedos/server`
- ✅ Start with `steedos start`
- ✅ Packages go in `steedos-packages/` directory
- ✅ Supports npm workspaces for managing multiple packages
- ❌ NOT a Python project
- ❌ NO need for Django/Flask

## Additional References

- For package development: See `05-package-development.md`
- For object definitions: See `02-objectql-modeling.md`
- For business logic: See `03-business-logic.md`
- For UI development: See `04-ui-pages.md`
