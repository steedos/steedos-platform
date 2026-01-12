# Steedos Platform - AI Programming Guide

> **Version**: 3.0  
> **Last Updated**: 2026-01-12  
> **Scope**: Steedos Platform Full-Stack Development

## 📋 Table of Contents

- [1. Project Overview](#1-project-overview)
- [2. Codebase Architecture](#2-codebase-architecture)
- [3. Development Environment Setup](#3-development-environment-setup)
- [4. Coding Standards & Best Practices](#4-coding-standards--best-practices)
- [5. Metadata Development Guide](#5-metadata-development-guide)
- [6. Microservices Development](#6-microservices-development)
- [7. API Development](#7-api-development)
- [8. Frontend Development](#8-frontend-development)
- [9. AI Integration](#9-ai-integration)
- [10. Testing Strategy](#10-testing-strategy)
- [11. Build & Release](#11-build--release)
- [12. Troubleshooting](#12-troubleshooting)
- [13. FAQ](#13-faq)

---

## 1. Project Overview

### 1.1 Introduction

**Steedos Platform** is the next-generation AI-Native Low-Code Development Platform, integrating Salesforce-level metadata-driven architecture with generative AI.

**Core Features**:
- 🤖 **AI-First**: Prompt-Driven development paradigm
- 🧠 **Metadata-Driven**: All configurations stored in YAML/JSON format
- ⚛️ **Modern Tech Stack**: Node.js + React + Amis
- 🚀 **Microservices Architecture**: Based on Moleculer framework
- ☁️ **Flexible Deployment**: Support for private and hybrid cloud

### 1.2 Technology Stack

**Backend Core**:
- **Runtime**: Node.js ≥22.0.0
- **Language**: TypeScript 5.7.3
- **Microservices Framework**: Moleculer
- **Database**: MongoDB (metadata), MySQL/PostgreSQL/Oracle (business data)
- **Cache**: Redis 6.2.6+
- **Message Queue**: NATS, BullMQ

**Frontend Core**:
- **Framework**: React
- **Low-Code Engine**: Baidu Amis
- **Build Tools**: Webpack, Vite

**Build Tools**:
- **Package Manager**: Yarn 3.8.7
- **Monorepo**: Lerna 9.x
- **TypeScript Compiler**: tsc, tslib

### 1.3 Repository Statistics

- **Core Packages (packages/)**: 27 NPM packages
- **Microservices (services/)**: 39 microservice modules
- **Enterprise Edition (ee/)**: Enterprise features
- **Builder6 (builder6/)**: Main application and AI modules
- **Code Volume**: 1M+ lines of code
- **TypeScript Files**: 756
- **JavaScript Files**: 493

---

## 2. Codebase Architecture

### 2.1 Directory Structure

```
steedos-platform/
├── packages/              # Core NPM packages (27)
│   ├── accounts/          # Account management
│   ├── auth/              # Authentication
│   ├── cli/               # CLI tools
│   ├── objectql/          # Object Query Language (OQL)
│   ├── metadata-core/     # Metadata core
│   ├── metadata-api/      # Metadata API
│   ├── formula/           # Formula engine
│   └── ...
│
├── services/              # Microservice modules (39)
│   ├── service-api/       # API gateway
│   ├── service-metadata/  # Metadata service
│   ├── service-accounts/  # Account service
│   ├── service-community/ # Community features
│   └── ...
│
├── builder6/              # Builder application
│   ├── server/            # Main server (@steedos/server)
│   ├── webapp/            # Web frontend
│   └── ai/                # AI modules
│
├── ee/                    # Enterprise Edition features
├── docs/                  # Documentation
├── test/                  # Test files
└── deploy/                # Deployment configs
```

### 2.2 Core Packages

#### 2.2.1 Metadata Layer
- **@steedos/metadata-core**: Metadata engine for loading, parsing, and validation
- **@steedos/metadata-api**: Metadata CRUD API
- **@steedos/metadata-registrar**: Metadata registrar

#### 2.2.2 Data Access Layer
- **@steedos/objectql**: Object Query Language, unified data access interface
- **@steedos/filters**: Data filters
- **@steedos/formula**: Formula engine for field calculations

#### 2.2.3 Authentication & Authorization
- **@steedos/auth**: Authentication module
- **@steedos/accounts**: Account management

#### 2.2.4 Utilities
- **@steedos/cli**: Command-line tools
- **@steedos/i18n**: Internationalization
- **@steedos/client**: Client SDK

### 2.3 Microservices Architecture

Steedos uses the Moleculer microservices framework. Each service is an independent node.

**Core Services**:
- **service-api**: API gateway, unified entry point
- **service-metadata**: Metadata management service
- **service-metadata-objects**: Object metadata service
- **service-accounts**: Account service
- **service-identity-jwt**: JWT authentication service

---

## 3. Development Environment Setup

### 3.1 System Requirements

**Required Components**:
- **Node.js**: ≥22.0.0 (use `nvm` for version management)
- **Yarn**: 3.8.7 (Yarn 3)
- **MongoDB**: ≥4.2.17
- **Redis**: ≥6.2.6 (optional, for caching)

**Recommended Specs**:
- **Memory**: 8GB+
- **Disk**: 20GB+ available space
- **OS**: macOS, Linux, WSL2

### 3.2 Environment Initialization

```bash
# 1. Clone repository
git clone https://github.com/steedos/steedos-platform.git
cd steedos-platform

# 2. Install dependencies
yarn

# 3. Bootstrap (link local packages)
yarn bootstrap

# 4. Build all packages
yarn build

# 5. Start database services (using Docker)
yarn docker:db

# 6. Start development server
yarn start
```

### 3.3 Environment Variables

Create `.env.local` file:

```bash
# MongoDB connection
MONGO_URL=mongodb://127.0.0.1:27017/steedos

# Redis connection (optional)
REDIS_URL=redis://127.0.0.1:6379

# Root URL
ROOT_URL=http://localhost:5100

# AI configuration (OpenAI compatible)
OPENAI_API_KEY=your_api_key
OPENAI_BASE_URL=https://api.openai.com/v1

# Log level
STEEDOS_LOG_LEVEL=debug
```

### 3.4 IDE Configuration

**Recommended VSCode Extensions**:
- ESLint
- Prettier
- TypeScript and JavaScript Language Features
- YAML
- MongoDB for VS Code

**VSCode Settings** (`.vscode/settings.json`):

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

## 4. Coding Standards & Best Practices

### 4.1 TypeScript Guidelines

#### 4.1.1 Type Definitions

**✅ Recommended**:

```typescript
// Use interface for object structures
interface SteedosObject {
  name: string;
  label: string;
  fields: Record<string, SteedosField>;
  triggers?: SteedosTrigger[];
}

// Use type for unions and complex types
type FieldType = 'text' | 'number' | 'date' | 'lookup' | 'master_detail';

// Avoid 'any', use 'unknown' instead
function parseMetadata(data: unknown): SteedosObject {
  // Perform type checking
  if (typeof data !== 'object' || data === null) {
    throw new Error('Invalid metadata');
  }
  // ...
}
```

**❌ Avoid**:

```typescript
// Avoid using 'any'
function processData(data: any): any {
  return data;
}

// Avoid excessive type assertions
const obj = {} as SteedosObject; // Dangerous
```

#### 4.1.2 Function Definitions

```typescript
// Use explicit return types
async function getObject(objectName: string): Promise<SteedosObject | null> {
  // ...
}

// Use optional parameters and default values
function findRecords(
  objectName: string,
  filters?: Record<string, any>,
  fields?: string[],
  options: { top?: number; skip?: number } = {}
): Promise<any[]> {
  // ...
}
```

### 4.2 Naming Conventions

#### 4.2.1 File Naming

```
# TypeScript source files
objectql.ts
metadata-manager.ts

# Test files
objectql.test.ts
metadata-manager.spec.ts

# Type definition files
types.d.ts
index.d.ts
```

#### 4.2.2 Variable and Function Naming

```typescript
// Use camelCase
const objectName = 'accounts';
const userInfo = getCurrentUser();

// Constants use UPPER_SNAKE_CASE
const DEFAULT_PAGE_SIZE = 20;
const MAX_RETRY_COUNT = 3;

// Classes and interfaces use PascalCase
class ObjectManager {}
interface SteedosUser {}

// Private members use underscore prefix
class DataLoader {
  private _cache: Map<string, any>;
  
  private _loadData(): void {}
}

// Booleans use is/has/can prefix
const isValid = true;
const hasPermission = false;
const canEdit = true;
```

### 4.3 Code Organization

#### 4.3.1 Import Order

```typescript
// 1. Node.js built-in modules
import { join } from 'path';
import { readFile } from 'fs/promises';

// 2. Third-party libraries
import _ from 'lodash';
import { Service, ServiceBroker } from 'moleculer';

// 3. Steedos core packages
import { objectql } from '@steedos/objectql';
import { loadMetadata } from '@steedos/metadata-core';

// 4. Relative imports
import { parseYaml } from './utils';
import type { MetadataOptions } from './types';
```

### 4.4 Error Handling

```typescript
// Use custom error classes
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

// Usage in functions
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

// Error catching
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

### 4.5 Asynchronous Programming

```typescript
// ✅ Use async/await
async function loadAllObjects(): Promise<SteedosObject[]> {
  const objectNames = await getObjectNames();
  const objects = await Promise.all(
    objectNames.map(name => getObject(name))
  );
  return objects.filter(obj => obj !== null);
}

// ✅ Handle concurrency control
async function processRecordsInBatch(
  records: any[],
  batchSize: number = 10
): Promise<void> {
  for (let i = 0; i < records.length; i += batchSize) {
    const batch = records.slice(i, i + batchSize);
    await Promise.all(batch.map(record => processRecord(record)));
  }
}

// ❌ Avoid callback hell
// Don't use callback style
```

---

## 5. Metadata Development Guide

### 5.1 Object Metadata

Objects are the core concept in Steedos, similar to database tables.

**Object Definition Example** (`accounts.object.yml`):

```yaml
name: accounts
label: Accounts
icon: account
enable_files: true
enable_tasks: true
enable_notes: true
enable_api: true

fields:
  name:
    type: text
    label: Account Name
    required: true
    searchable: true
    index: true
    is_name: true
  
  rating:
    type: select
    label: Account Rating
    options:
      - label: Hot
        value: hot
      - label: Warm
        value: warm
      - label: Cold
        value: cold
    defaultValue: warm
  
  industry:
    type: lookup
    label: Industry
    reference_to: industries
    searchable: true
  
  annual_revenue:
    type: currency
    label: Annual Revenue
    scale: 2
  
  employees:
    type: number
    label: Employees
    scale: 0
  
  owner:
    type: lookup
    label: Owner
    reference_to: users
    defaultValue: "{userId}"

list_views:
  all:
    label: All Accounts
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

### 5.2 Field Types

| Field Type | Description | Example |
|-----------|-------------|---------|
| text | Text | Account Name |
| textarea | Multi-line text | Description |
| select | Dropdown | Account Rating |
| boolean | Boolean | Is Active |
| date | Date | Birthday |
| datetime | DateTime | Created Time |
| number | Number | Employees |
| currency | Currency | Annual Revenue |
| lookup | Lookup Relationship | Related Account |
| master_detail | Master-Detail | Order Line Item |
| formula | Formula Field | Total Price |
| summary | Rollup Summary | Total Orders |

### 5.3 Triggers

Triggers execute custom logic before/after data operations.

**Trigger Example** (`accounts.trigger.js`):

```javascript
module.exports = {
  listenTo: 'accounts',
  
  beforeInsert: async function() {
    const { doc } = this;
    
    // Auto-generate account number
    if (!doc.account_number) {
      doc.account_number = await generateAccountNumber();
    }
    
    // Data validation
    if (doc.annual_revenue < 0) {
      throw new Error('Annual revenue cannot be negative');
    }
  },
  
  afterInsert: async function() {
    const { doc, userId, spaceId } = this;
    
    // Create related task
    await broker.call('objectql.insert', {
      objectName: 'tasks',
      doc: {
        name: `Follow up: ${doc.name}`,
        related_to: doc._id,
        owner: userId,
        space: spaceId
      },
      userId,
      spaceId
    });
  },
  
  beforeUpdate: async function() {
    const { doc, previousDoc } = this;
    
    // Track important field changes
    if (doc.rating !== previousDoc.rating) {
      doc.rating_changed_at = new Date();
    }
  }
};
```

---

## 6. Microservices Development

### 6.1 Moleculer Service Structure

**Service Example** (`service-example.service.ts`):

```typescript
import { Service, ServiceBroker, Context } from 'moleculer';

export default class ExampleService extends Service {
  constructor(broker: ServiceBroker) {
    super(broker);

    this.parseServiceSchema({
      name: 'example',
      
      settings: {
        defaultPageSize: 20,
      },

      dependencies: ['metadata', 'objectql'],

      actions: {
        list: {
          params: {
            objectName: 'string',
            filters: { type: 'object', optional: true },
            top: { type: 'number', optional: true, default: 20 },
          },
          async handler(ctx: Context) {
            const { objectName, filters, top } = ctx.params;
            
            const result = await ctx.call('objectql.find', {
              objectName,
              query: { filters: filters || [], top },
            });
            
            return result;
          },
        },
      },

      events: {
        'object.created': {
          async handler(ctx: Context) {
            this.logger.info('Object created:', ctx.params);
          },
        },
      },

      methods: {
        formatData(data: any): any {
          return data;
        },
      },

      created() {
        this.logger.info('Service created');
      },

      started() {
        this.logger.info('Service started');
      },
    });
  }
}
```

---

## 7. API Development

### 7.1 GraphQL API

**Query Example**:

```graphql
query {
  accounts(
    filters: [["rating", "=", "hot"]]
    top: 10
    sort: "name"
  ) {
    _id
    name
    rating
    industry
    owner {
      _id
      name
    }
  }
}
```

**Mutation Example**:

```graphql
mutation {
  accounts__insert(doc: {
    name: "Test Company"
    rating: "hot"
  }) {
    _id
    name
  }
}
```

### 7.2 RESTful API

```bash
# List
GET /api/v1/accounts
Query: filters=[["rating","=","hot"]]&top=10

# Get
GET /api/v1/accounts/:id

# Create
POST /api/v1/accounts
Body: {"name": "Test", "rating": "hot"}

# Update
PUT /api/v1/accounts/:id
Body: {"rating": "warm"}

# Delete
DELETE /api/v1/accounts/:id
```

---

## 8. Frontend Development

### 8.1 Amis Page Configuration

**List Page Example**:

```json
{
  "type": "page",
  "title": "Accounts",
  "body": {
    "type": "crud",
    "api": "/api/v1/accounts",
    "columns": [
      {
        "name": "name",
        "label": "Account Name",
        "searchable": true
      },
      {
        "name": "rating",
        "label": "Rating"
      }
    ]
  }
}
```

### 8.2 React Component Development

```typescript
import React, { useState, useEffect } from 'react';

export const AccountList: React.FC = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    const response = await fetch('/api/v1/accounts');
    const data = await response.json();
    setAccounts(data.value);
    setLoading(false);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Accounts</h2>
      <ul>
        {accounts.map(account => (
          <li key={account._id}>{account.name}</li>
        ))}
      </ul>
    </div>
  );
};
```

---

## 9. AI Integration

### 9.1 AI Configuration

**Environment Variables**:

```bash
# OpenAI
OPENAI_API_KEY=sk-xxx
OPENAI_BASE_URL=https://api.openai.com/v1

# Alibaba Cloud
OPENAI_API_KEY=sk-xxx
OPENAI_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1

# DeepSeek
OPENAI_API_KEY=sk-xxx
OPENAI_BASE_URL=https://api.deepseek.com/v1
```

### 9.2 AI Service Usage

```typescript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL,
});

async function generateObjectMetadata(description: string): Promise<any> {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: 'You are a Steedos metadata generation assistant.'
      },
      {
        role: 'user',
        content: `Generate object definition for: ${description}`
      }
    ],
  });

  return parseYaml(completion.choices[0].message.content);
}
```

---

## 10. Testing Strategy

### 10.1 Unit Testing

```typescript
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
});
```

### 10.2 Run Tests

```bash
# Run all tests
yarn test

# Run specific test
yarn test object-manager.test.ts

# Coverage report
yarn test --coverage
```

---

## 11. Build & Release

### 11.1 Build Process

```bash
# Clean
yarn clean

# Install
yarn

# Bootstrap
yarn bootstrap

# Build
yarn build

# Test
yarn test
```

### 11.2 Release Process

```bash
# Version
lerna version --conventional-commits

# Publish (Beta)
yarn release:beta

# Publish (Production)
lerna publish --registry https://registry.npmjs.org
```

---

## 12. Troubleshooting

### 12.1 Common Issues

**MongoDB Connection Failed**:
```bash
# Check MongoDB
mongod --version

# Test connection
mongo mongodb://127.0.0.1:27017/steedos
```

**Build Failed**:
```bash
# Clean cache
yarn clean
rm -rf node_modules

# Reinstall
yarn

# Rebuild
yarn build
```

---

## 13. FAQ

**Q: How to create a new package?**

```bash
npx @steedos/create-steedos-package my-package
```

**Q: How to add a new object?**

1. Create object definition: `src/.steedos/objects/my_object.object.yml`
2. Define structure (see Chapter 5)
3. Restart server

**Q: How to configure production?**

```bash
export NODE_ENV=production
export MONGO_URL=mongodb://prod-server:27017/steedos
export ROOT_URL=https://app.example.com
yarn start
```

---

## Appendix

### Related Resources

- **Website**: https://www.steedos.com
- **Documentation**: https://docs.steedos.com
- **GitHub**: https://github.com/steedos/steedos-platform
- **Community**: https://github.com/steedos/steedos-platform/discussions

### Tech Stack Documentation

- **Moleculer**: https://moleculer.services
- **Amis**: https://aisuda.bce.baidu.com/amis
- **MongoDB**: https://docs.mongodb.com
- **TypeScript**: https://www.typescriptlang.org

---

**Last Updated**: 2026-01-12  
**Maintainer**: Steedos Team  
**Feedback**: https://github.com/steedos/steedos-platform/issues
