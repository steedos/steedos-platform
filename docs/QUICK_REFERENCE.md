# Steedos Platform Quick Reference

> Version: 3.0.12  
> Last Updated: 2026-01-09

This document provides a quick reference for commonly used commands, APIs, and configurations.

---

## 🚀 Common Commands

### Project Management

```bash
# Clone project
git clone https://github.com/steedos/steedos-platform.git

# Install dependencies
yarn

# Build all packages
yarn build

# Start development server
yarn start

# Start Web application development server
yarn webapp

# Clean dependencies
yarn clean

# Start all services with Docker
yarn docker

# Start database services only
yarn docker:db
```

### Create New App/Package

```bash
# Create new application
npx create-steedos-app my-app
cd my-app
yarn install
yarn start

# Create new package
npx create-steedos-package my-package
```

### Moleculer REPL

```bash
# Start REPL
yarn repl

# Common REPL commands
mol$ actions                    # List all actions
mol$ services                   # List all services
mol$ nodes                      # List all nodes
mol$ info objectql              # View service info
mol$ call objectql.find --objectName accounts
```

---

## 📊 ObjectQL API

### Query (find)

```javascript
const records = await objects.accounts.find({
  fields: ['name', 'industry', 'owner'],
  filters: [
    ['owner', '=', userId],
    ['industry', '=', 'tech']
  ],
  sort: 'created desc',
  top: 10,
  skip: 0
});
```

### Find One (findOne)

```javascript
const record = await objects.accounts.findOne(
  recordId,
  {
    fields: ['name', 'industry']
  }
);
```

### Insert

```javascript
const newRecord = await objects.accounts.insert(
  {
    name: 'New Account',
    industry: 'tech',
    status: 'active'
  },
  userSession  // optional, for permission check
);
```

### Update

```javascript
const updated = await objects.accounts.update(
  recordId,
  {
    status: 'inactive',
    notes: 'Update notes'
  },
  userSession  // optional
);
```

### Delete

```javascript
const result = await objects.accounts.delete(
  recordId,
  userSession  // optional
);
```

### Aggregate

```javascript
const result = await objects.accounts.aggregate(
  {
    filters: [['industry', '=', 'tech']]
  },
  [
    { $group: { _id: '$industry', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ],
  userSession  // optional
);
```

---

## 🔍 Filter Syntax

### Basic Operators

```javascript
// Equals
['field', '=', 'value']

// Not equals
['field', '!=', 'value']

// Greater than/less than
['age', '>', 18]
['age', '>=', 18]
['age', '<', 65]
['age', '<=', 65]

// Text operations
['name', 'startswith', 'A']
['name', 'contains', 'test']
['name', 'notcontains', 'delete']

// Range
['age', 'between', [18, 65]]
```

### Combined Conditions

```javascript
// AND (default)
[
  ['field1', '=', 'value1'],
  ['field2', '=', 'value2']
]

// Explicit AND
[
  ['field1', '=', 'value1'],
  'and',
  ['field2', '=', 'value2']
]

// OR
[
  ['field1', '=', 'value1'],
  'or',
  ['field2', '=', 'value2']
]

// Complex combination
[
  [
    ['status', '=', 'active'],
    'or',
    ['status', '=', 'pending']
  ],
  'and',
  ['owner', '=', userId]
]
```

### Array Values

```javascript
// IN operation (auto-converts)
['status', '=', ['active', 'pending']]
// Equivalent to
[
  ['status', '=', 'active'],
  'or',
  ['status', '=', 'pending']
]

// NOT IN
['status', '!=', ['closed', 'deleted']]
```

---

## 🎯 Metadata Definitions

### Object Definition

```yaml
# custom_object.object.yml
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

### Field Types

| Type | Description | Example |
|------|-------------|---------|
| text | Text | `type: text` |
| textarea | Multi-line text | `type: textarea, rows: 3` |
| number | Number | `type: number, scale: 2` |
| currency | Currency | `type: currency, precision: 2` |
| percent | Percentage | `type: percent, scale: 2` |
| boolean | Boolean | `type: boolean` |
| date | Date | `type: date` |
| datetime | Datetime | `type: datetime` |
| select | Dropdown select | `type: select, options: [...]` |
| lookup | Lookup relationship | `type: lookup, reference_to: users` |
| master_detail | Master-detail relationship | `type: master_detail, reference_to: accounts` |
| grid | Sub-table | `type: grid` |
| file | File | `type: file` |
| image | Image | `type: image` |
| url | URL | `type: url` |
| email | Email | `type: email` |
| autonumber | Auto-number | `type: autonumber, formula: 'A{0000}'` |
| formula | Formula | `type: formula, data_type: text` |
| summary | Summary | `type: summary, summary_type: count` |

### Application Definition

```yaml
# custom_app.app.yml
_id: custom_app
name: Custom Application
description: Application description
icon: apps
is_creator: true
visible: true
sort: 100
objects:
  - custom_object
  - accounts
  - contacts
```

### Permission Set

```yaml
# custom.permissionset.yml
name: custom_permission
label: Custom Permission
license: platform
object_permissions:
  accounts:
    allowCreate: true
    allowDelete: false
    allowEdit: true
    allowRead: true
    modifyAllRecords: false
    viewAllRecords: true
field_permissions:
  accounts.revenue:
    readable: true
    editable: true
  accounts.secret_field:
    readable: false
    editable: false
```

---

## 🔧 Triggers

### Complete Trigger Example

```javascript
// accounts.trigger.js
module.exports = {
  listenTo: 'accounts',
  
  beforeInsert: async function() {
    const { doc } = this;
    // Before insert logic
    if (!doc.code) {
      doc.code = await generateCode('ACC');
    }
  },
  
  afterInsert: async function() {
    const { doc, id } = this;
    // After insert logic
    console.log('New record created:', doc.name);
  },
  
  beforeUpdate: async function() {
    const { doc, previousDoc } = this;
    // Before update logic
    if (doc.status !== previousDoc.status) {
      console.log('Status changed:', previousDoc.status, '->', doc.status);
    }
  },
  
  afterUpdate: async function() {
    const { doc, previousDoc } = this;
    // After update logic
  },
  
  beforeDelete: async function() {
    const { id } = this;
    // Before delete logic - can throw error to prevent deletion
    const hasRelated = await checkRelatedRecords(id);
    if (hasRelated) {
      throw new Error('Cannot delete: related data exists');
    }
  },
  
  afterDelete: async function() {
    const { previousDoc } = this;
    // After delete logic
    console.log('Record deleted:', previousDoc.name);
  }
};
```

### Trigger Context

```javascript
{
  userId,        // Current user ID
  spaceId,       // Current workspace ID  
  objectName,    // Object name
  id,            // Record ID (empty for insert)
  doc,           // Current document
  previousDoc,   // Previous document (update/delete)
  datasource     // Datasource instance
}
```

---

## 🌐 REST API

### Base URL

```
http://localhost:5100/api/v4
```

### Authentication

```bash
# Login to get Token
curl -X POST http://localhost:5100/api/v4/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password"
  }'

# Use Token
curl -H "Authorization: Bearer ******" \
  http://localhost:5100/api/v4/accounts
```

### CRUD Operations

```bash
# Query
POST /api/v4/:objectName/find
{
  "fields": ["name", "industry"],
  "filters": [["owner", "=", "userId"]],
  "top": 10
}

# Get one
GET /api/v4/:objectName/:id

# Insert
POST /api/v4/:objectName
{
  "name": "New Record",
  "status": "active"
}

# Update
PUT /api/v4/:objectName/:id
{
  "status": "inactive"
}

# Delete
DELETE /api/v4/:objectName/:id
```

---

## 🔐 Environment Variables

### Basic Configuration

```bash
# Service configuration
ROOT_URL=http://localhost:5100
PORT=5100
NODE_ENV=development

# Database
MONGO_URL=mongodb://localhost:27017/steedos
MONGO_OPLOG_URL=mongodb://localhost:27017/local

# Redis
REDIS_URL=redis://localhost:6379

# Moleculer
TRANSPORTER=redis://localhost:6379
CACHER=redis://localhost:6379

# Logging
STEEDOS_LOG_LEVEL=info  # trace, debug, info, warn, error
```

### Email Configuration

```bash
MAIL_URL=smtp://smtp.example.com:587
MAIL_FROM=noreply@example.com
```

### File Storage

```bash
# Local storage
STEEDOS_STORAGE_DIR=/app/storage

# S3 storage
STEEDOS_CFS_STORE=S3
STEEDOS_CFS_AWS_S3_BUCKET=my-bucket
STEEDOS_CFS_AWS_S3_REGION=us-east-1
STEEDOS_CFS_AWS_S3_ENDPOINT=https://s3.amazonaws.com
```

---

## 🎨 Amis Page Configuration

### Basic Page

```yaml
# custom_page.page.yml
name: custom_page
label: Custom Page
type: page
body:
  type: crud
  api: /api/v4/accounts/find
  columns:
    - name: name
      label: Name
      searchable: true
    - name: status
      label: Status
      type: select
```

---

## 📝 Formula Syntax

### Common Functions

```javascript
// Text functions
CONCATENATE(text1, text2, ...)  // Concatenate text
UPPER(text)                     // Convert to uppercase
LOWER(text)                     // Convert to lowercase
LEN(text)                       // Text length

// Math functions
SUM(num1, num2, ...)           // Sum
AVERAGE(num1, num2, ...)       // Average
MAX(num1, num2, ...)           // Maximum
MIN(num1, num2, ...)           // Minimum
ROUND(number, decimals)        // Round

// Date functions
TODAY()                        // Today
NOW()                          // Current time
YEAR(date)                     // Year
MONTH(date)                    // Month
DAY(date)                      // Day

// Logical functions
IF(condition, value_if_true, value_if_false)
AND(condition1, condition2, ...)
OR(condition1, condition2, ...)
NOT(condition)
```

---

## 🐛 Debugging Tips

### Log Output

```javascript
// In triggers or actions
console.log('Debug info:', data);
this.logger.info('Info message');
this.logger.error('Error message');
```

### Set Log Level

```javascript
// steedos.config.js
module.exports = {
  logLevel: "debug"  // trace, debug, info, warn, error, fatal
};
```

### VS Code Breakpoint Debugging

1. Set breakpoints in code
2. Press F5 to start debugging
3. Or run in terminal: `node --inspect server.js`

---

## 📚 Related Links

- **Official Documentation**: [docs.steedos.com](https://docs.steedos.com/)
- **Core Architecture**: [CORE_ARCHITECTURE_EN.md](./CORE_ARCHITECTURE_EN.md)
- **Developer Guide**: [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md)
- **Packages Index**: [PACKAGES_INDEX.md](./PACKAGES_INDEX.md)
- **GitHub**: [github.com/steedos/steedos-platform](https://github.com/steedos/steedos-platform)

---

**Quick Reference Version**: 3.0.12  
**Last Updated**: 2026-01-09
