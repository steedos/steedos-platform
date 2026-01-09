# Steedos Platform Developer Guide

> Version: 3.0.12  
> Last Updated: 2026-01-09

## Table of Contents

- [1. Development Environment Setup](#1-development-environment-setup)
- [2. Project Structure](#2-project-structure)
- [3. Development Workflow](#3-development-workflow)
- [4. Metadata Development](#4-metadata-development)
- [5. Business Logic Development](#5-business-logic-development)
- [6. API Development](#6-api-development)
- [7. Testing](#7-testing)
- [8. Debugging Tips](#8-debugging-tips)
- [9. Best Practices](#9-best-practices)

---

## 1. Development Environment Setup

### 1.1 System Requirements

- **Node.js**: ≥22.0.0
- **Yarn**: 3.8.7 (Yarn 3 recommended)
- **MongoDB**: ≥4.2.17
- **Redis**: ≥6.2.6 (Optional, for caching and message queue)

### 1.2 Clone the Project

```bash
# Clone repository
git clone https://github.com/steedos/steedos-platform.git
cd steedos-platform

# Install dependencies
yarn

# Build all packages
yarn build
```

### 1.3 Start MongoDB and Redis

**Using Docker Compose (Recommended)**:

```bash
# Start database services
yarn docker:db
```

This starts the following services:
- MongoDB (port 27017)
- Redis (port 6379)
- NATS (port 4222)

**Manual Start**:

```bash
# Start MongoDB
mongod --dbpath /data/db

# Start Redis
redis-server
```

### 1.4 Start Development Server

```bash
# Start main server
yarn start

# Access application
# Open browser: http://localhost:5100
```

### 1.5 Develop Web Application

```bash
# Start webapp development server in another terminal
yarn webapp

# Access development server
# Open browser: http://localhost:3000
```

---

## 2. Project Structure

### 2.1 Top-Level Directories

```
steedos-platform/
├── packages/          # Core NPM packages (26 packages)
├── services/          # Microservice modules (39 services)
├── builder6/          # Builder application
│   ├── server/        # Main server (@steedos/server)
│   ├── webapp/        # Web frontend application
│   └── ai/            # AI-related modules
├── ee/                # Enterprise edition features
│   ├── branding/      # Brand customization
│   └── service-enterprise/  # Enterprise services
├── deploy/            # Deployment configurations
│   ├── cluster/       # Cluster deployment
│   └── enterprise/    # Enterprise deployment
├── docs/              # Documentation
└── test/              # Test files
```

### 2.2 Core Packages Directory (packages/)

| Package | Description |
|---------|-------------|
| `objectql` | Object Query Language core |
| `metadata-core` | Metadata core engine |
| `metadata-api` | Metadata API |
| `metadata-registrar` | Metadata registrar |
| `accounts` | Account management |
| `auth` | Authentication module |
| `process` | Process engine |
| `filters` | Filter library |
| `formula` | Formula calculation engine |
| `i18n` | Internationalization |
| `router` | Router management |
| `utils` | Utility functions library |
| `schemas` | Schema definitions |
| `client` | Client SDK |
| `cli` | Command line tools |
| `create-steedos-app` | Application scaffolding |
| `create-steedos-package` | Package scaffolding |
| `moleculer-apollo-server` | GraphQL server |
| `odata-v4-*` | OData v4 related packages |
| `cachers` | Cache management |
| `migrate` | Data migration |
| `data-import` | Data import |

### 2.3 Services Directory (services/)

**Metadata Services**:
- `service-metadata` - Metadata management
- `service-metadata-server` - Metadata server
- `service-metadata-objects` - Object metadata
- `service-metadata-apps` - Application metadata
- `service-metadata-layouts` - Page layouts
- `service-metadata-tabs` - Tabs
- `service-metadata-permissionsets` - Permission sets
- `service-metadata-triggers` - Triggers
- `service-metadata-translations` - Translations

**Core Services**:
- `service-api` - API gateway
- `service-objectql` - ObjectQL service
- `service-accounts` - Account service
- `service-rest` - REST API
- `service-object-graphql` - GraphQL API

**Standard Services**:
- `standard-accounts` - Standard account objects
- `standard-object-database` - Standard object database
- `standard-permission` - Standard permissions
- `standard-process-approval` - Standard approval process
- `standard-ui` - Standard UI components

**Other Services**:
- `service-package-loader` - Package loader
- `service-package-registry` - Package registry
- `service-pages` - Page service
- `service-ui` - UI service
- `service-plugin-amis` - Amis plugin
- `service-bull-dashboard` - Bull queue monitoring
- `moleculer-bullmq` - BullMQ integration

---

## 3. Development Workflow

### 3.1 Monorepo Management

Project uses **Lerna** and **Yarn Workspaces** for monorepo management:

```json
// lerna.json
{
  "packages": [
    "packages/*",
    "services/*",
    "ee/**",
    "builder6/*"
  ],
  "npmClient": "yarn",
  "version": "3.0.12"
}
```

### 3.2 Common Commands

```bash
# Install dependencies
yarn

# Build all packages
yarn build

# Start server
yarn start

# Start webapp
yarn webapp

# Clean node_modules
yarn clean

# Release new version (beta)
yarn release:beta

# Run Docker environment
yarn docker

# Start databases only
yarn docker:db
```

### 3.3 Package Management

**Add dependency to specific package**:

```bash
# Add dependency to packages/objectql
cd packages/objectql
yarn add lodash
```

**Add dependency in workspace root**:

```bash
# Add to all workspaces
yarn add -W <package-name>
```

### 3.4 Code Formatting

Project uses **Prettier** and **ESLint**:

```bash
# Format code (runs automatically via git hooks)
prettier --write "**/*.ts"

# Lint check
eslint .
```

---

## 4. Metadata Development

### 4.1 Object Definition

**Create an object**:

```yaml
# objects/custom_object.object.yml
name: custom_object
label: Custom Object
icon: account
enable_search: true
enable_files: true
enable_tasks: true
enable_notes: true
fields:
  name:
    type: text
    label: Name
    required: true
    searchable: true
  description:
    type: textarea
    label: Description
  status:
    type: select
    label: Status
    options:
      - label: Draft
        value: draft
      - label: Published
        value: published
    default_value: draft
  owner:
    type: lookup
    reference_to: users
    label: Owner
  amount:
    type: currency
    label: Amount
    precision: 2
list_views:
  all:
    label: All
    columns: [name, status, owner, created]
    filter_scope: space
    filters: []
  recent:
    label: Recently Viewed
    columns: [name, status, modified]
    filter_scope: space
    filters: []
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

**Field Types**:
- `text` - Text
- `textarea` - Multi-line text
- `number` - Number
- `currency` - Currency
- `date` - Date
- `datetime` - Datetime
- `boolean` - Boolean
- `select` - Dropdown select
- `lookup` - Lookup relationship
- `master_detail` - Master-detail relationship
- `grid` - Sub-table
- `file` - File
- `image` - Image

### 4.2 Application Definition

```yaml
# applications/custom_app.app.yml
_id: custom_app
name: Custom Application
description: This is a custom application
icon: apps
is_creator: true
visible: true
sort: 100
objects:
  - custom_object
  - accounts
  - contacts
```

### 4.3 Page Layout

```yaml
# layouts/custom_object_default.layout.yml
name: custom_object_default
object_name: custom_object
profiles:
  - user
  - admin
sections:
  - label: Basic Information
    columns: 2
    fields:
      - name
      - status
      - owner
      - description
```

### 4.4 Permission Set

```yaml
# permissionsets/sales_manager.permissionset.yml
name: sales_manager
label: Sales Manager
license: platform
object_permissions:
  accounts:
    allowCreate: true
    allowDelete: false
    allowEdit: true
    allowRead: true
    modifyAllRecords: true
    viewAllRecords: true
  contacts:
    allowCreate: true
    allowDelete: false
    allowEdit: true
    allowRead: true
field_permissions:
  accounts.revenue:
    readable: true
    editable: true
```

---

## 5. Business Logic Development

### 5.1 Triggers

**Before/After Triggers**:

```javascript
// triggers/accounts.trigger.js
module.exports = {
  // Before insert trigger
  beforeInsert: async function() {
    const { doc } = this;
    // Auto-generate code
    if (!doc.code) {
      doc.code = await generateCode('ACC');
    }
  },
  
  // After insert trigger
  afterInsert: async function() {
    const { doc, id } = this;
    // Send notification
    await sendNotification({
      to: doc.owner,
      message: `New account created: ${doc.name}`
    });
  },
  
  // Before update trigger
  beforeUpdate: async function() {
    const { doc, previousDoc } = this;
    // Check status change
    if (doc.status !== previousDoc.status) {
      // Validate status transition
      validateStatusChange(previousDoc.status, doc.status);
    }
  },
  
  // Before delete trigger
  beforeDelete: async function() {
    const { id } = this;
    // Check related data
    const relatedCount = await objects.contacts.count({
      filters: [['account', '=', id]]
    });
    if (relatedCount > 0) {
      throw new Error('Cannot delete: related contacts exist');
    }
  }
};
```

**Trigger Context**:

```javascript
{
  userId,        // Current user ID
  spaceId,       // Current workspace ID
  objectName,    // Object name
  id,            // Record ID
  doc,           // Current document
  previousDoc,   // Previous document (update only)
  datasource     // Datasource instance
}
```

### 5.2 Custom Actions

```javascript
// actions/accounts.action.js
module.exports = {
  // Custom action
  sendWelcomeEmail: async function(object_name, record_id, userSession) {
    // Get record
    const account = await this.broker.call(
      'objectql.findOne',
      {
        objectName: object_name,
        id: record_id,
        fields: ['name', 'email', 'owner']
      }
    );
    
    // Send email
    await this.broker.call('email.send', {
      to: account.email,
      subject: 'Welcome to our service',
      template: 'welcome',
      data: { name: account.name }
    });
    
    return { success: true, message: 'Welcome email sent' };
  },
  
  // Batch operation
  batchUpdateStatus: async function(object_name, record_ids, status, userSession) {
    const results = [];
    for (const id of record_ids) {
      const result = await this.broker.call(
        'objectql.update',
        {
          objectName: object_name,
          id,
          doc: { status },
          userSession
        }
      );
      results.push(result);
    }
    return results;
  }
};
```

### 5.3 Custom Services

```javascript
// services/custom.service.js
module.exports = {
  name: "custom",
  
  actions: {
    // Custom action
    calculateCommission: {
      params: {
        amount: "number",
        rate: "number"
      },
      async handler(ctx) {
        const { amount, rate } = ctx.params;
        return amount * rate;
      }
    },
    
    // Call other services
    createAccountWithContact: {
      async handler(ctx) {
        const { accountData, contactData } = ctx.params;
        
        // Create account
        const account = await ctx.call('objectql.insert', {
          objectName: 'accounts',
          doc: accountData,
          userSession: ctx.meta.user
        });
        
        // Create contact
        contactData.account = account._id;
        const contact = await ctx.call('objectql.insert', {
          objectName: 'contacts',
          doc: contactData,
          userSession: ctx.meta.user
        });
        
        return { account, contact };
      }
    }
  },
  
  events: {
    // Subscribe to events
    "objectql.inserted.accounts": async function(ctx) {
      const { doc } = ctx.params;
      this.logger.info(`New account created: ${doc.name}`);
      // Execute follow-up logic
    }
  },
  
  methods: {
    // Private methods
    calculateTotal(items) {
      return items.reduce((sum, item) => sum + item.amount, 0);
    }
  },
  
  async started() {
    this.logger.info("Custom service started");
  }
};
```

---

## 6. API Development

### 6.1 REST API

**Calling ObjectQL**:

```bash
# Query
curl -X POST http://localhost:5100/api/v4/accounts/find \
  -H "Authorization: Bearer ******" \
  -H "Content-Type: application/json" \
  -d '{
    "fields": ["name", "industry"],
    "filters": [["owner", "=", "userId"]],
    "top": 10
  }'

# Insert
curl -X POST http://localhost:5100/api/v4/accounts \
  -H "Authorization: Bearer ******" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Account",
    "industry": "tech"
  }'

# Update
curl -X PUT http://localhost:5100/api/v4/accounts/:id \
  -H "Authorization: Bearer ******" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "active"
  }'

# Delete
curl -X DELETE http://localhost:5100/api/v4/accounts/:id \
  -H "Authorization: Bearer ******"
```

### 6.2 GraphQL API

```graphql
# Query
query {
  accounts(
    filters: [["owner", "=", "userId"]]
    sort: "created desc"
    top: 10
  ) {
    _id
    name
    industry
    owner {
      name
      email
    }
  }
}

# Insert
mutation {
  accounts__insert(
    doc: {
      name: "New Account"
      industry: "tech"
    }
  ) {
    _id
    name
  }
}

# Update
mutation {
  accounts__update(
    id: "xxxxx"
    doc: {
      status: "active"
    }
  ) {
    _id
    status
  }
}
```

### 6.3 OData API

```bash
# Query
curl "http://localhost:5100/api/odata/v4/accounts?\$select=name,industry&\$filter=owner eq 'userId'&\$top=10"

# Aggregate
curl "http://localhost:5100/api/odata/v4/accounts?\$apply=groupby((industry),aggregate(amount with sum as total))"
```

---

## 7. Testing

### 7.1 Unit Tests

```javascript
// test/unit/objectql.test.ts
import { expect } from 'chai';
import { getObject } from '@steedos/objectql';

describe('ObjectQL', () => {
  it('should find records', async () => {
    const accounts = getObject('accounts');
    const records = await accounts.find({
      filters: [['name', 'contains', 'test']]
    });
    expect(records).to.be.an('array');
  });
  
  it('should insert record', async () => {
    const accounts = getObject('accounts');
    const doc = {
      name: 'Test Account',
      industry: 'tech'
    };
    const result = await accounts.insert(doc);
    expect(result).to.have.property('_id');
    expect(result.name).to.equal('Test Account');
  });
});
```

### 7.2 Running Tests

```bash
# Run all tests
yarn test

# Run tests for specific package
cd packages/objectql
yarn test
```

---

## 8. Debugging Tips

### 8.1 Log Levels

Set in `steedos.config.js`:

```javascript
module.exports = {
  logLevel: "debug", // trace, debug, info, warn, error, fatal
};
```

### 8.2 VS Code Debug Configuration

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Steedos Server",
      "runtimeExecutable": "yarn",
      "runtimeArgs": ["start"],
      "cwd": "${workspaceFolder}",
      "console": "integratedTerminal"
    }
  ]
}
```

### 8.3 Moleculer REPL

```bash
# Start REPL
yarn repl

# REPL commands
mol$ actions        # List all actions
mol$ services       # List all services
mol$ call objectql.find --objectName accounts --fields name
```

---

## 9. Best Practices

### 9.1 Metadata Organization

- Use meaningful naming conventions
- Organize metadata files by functional modules
- Use `extend` to extend objects instead of modifying original objects
- Add detailed `label` and `description`

### 9.2 Code Style

- Follow TypeScript best practices
- Use async/await instead of callbacks
- Proper error handling
- Write unit tests

### 9.3 Performance Optimization

- Use Redis caching
- Limit `fields`, query only needed fields
- Use indexes to optimize queries
- Avoid N+1 queries

### 9.4 Security

- Always pass `userSession` for permission checks
- Validate user input
- Use parameterized queries
- Regularly update dependencies

---

## Appendix

### A. Environment Variables

Create `.env.local` file:

```bash
# Service configuration
ROOT_URL=http://localhost:5100
PORT=5100

# Database
MONGO_URL=mongodb://localhost:27017/steedos
MONGO_OPLOG_URL=mongodb://localhost:27017/local

# Redis
REDIS_URL=redis://localhost:6379

# Moleculer
TRANSPORTER=redis://localhost:6379
CACHER=redis://localhost:6379

# Logging
STEEDOS_LOG_LEVEL=debug

# Email
MAIL_URL=smtp://smtp.example.com:587
```

### B. Common Issues

**Q: Changes to metadata not taking effect?**
A: Restart server or call `/api/metadata/reload`

**Q: How to debug triggers?**
A: Use `console.log()` in triggers or set `logLevel: "debug"`

**Q: How to clear cache?**
A: Restart Redis or call `broker.cacher.clean()`

---

**Maintained by**: Steedos Development Team  
**Need Help?**: [GitHub Discussions](https://github.com/steedos/steedos-platform/discussions)
