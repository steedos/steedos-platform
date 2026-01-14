# Steedos Platform - Quick Reference Card

## 🚀 Common Commands

```bash
# Setup
yarn                          # Install dependencies
yarn build                    # Build all packages
yarn start                    # Start development server

# Development
yarn dev                      # Start with watch mode
yarn test                     # Run tests
yarn lint                     # Check code style

# Docker
yarn docker:db                # Start MongoDB/Redis/NATS
docker build -t myapp .       # Build Docker image
```

## 📝 Object Definition Template

```yaml
# objects/my_object.object.yml
name: my_object
label: My Object
icon: custom1
enable_search: true
enable_files: true
fields:
  name:
    type: text
    label: Name
    required: true
  status:
    type: select
    label: Status
    options:
      - { label: Active, value: active }
      - { label: Inactive, value: inactive }
    defaultValue: active
  related_to:
    type: lookup
    label: Related To
    reference_to: accounts
  hidden_field:
    type: text
    label: Hidden Field
    hidden: true
    visible_on: '{{false}}'  # Hidden by default
list_views:
  all:
    label: All
    columns: [name, status, created]
    filters: []
permission_set:
  user:
    allowCreate: true
    allowRead: true
    allowEdit: true
```

### Field Visibility Override

```yaml
# In extension package to make hidden field visible
fields:
  hidden_field:
    visible_on: '{{true}}'  # Make visible
    
  conditional_field:
    visible_on: '{{formData.status === "active"}}'  # Conditional
```

**Important**: Field visibility is primarily controlled by `visible_on` attribute. To show a hidden field, add `visible_on: '{{true}}'`.

## 🔍 ObjectQL Cheat Sheet

### Basic Query
```javascript
const records = await objects.my_object.find({
  fields: ['name', 'status'],
  filters: [['status', '=', 'active']],
  sort: 'name',
  top: 100
}, userSession);
```

### Filter Operators
```javascript
// Comparison
['amount', '>', 1000]
['amount', '>=', 1000]
['amount', '<', 5000]
['amount', '<=', 5000]
['amount', '=', 1000]
['amount', '!=', 0]

// String
['name', 'contains', 'company']
['name', 'startswith', 'A']
['email', 'endswith', '@example.com']

// Range
['age', 'between', [20, 30]]

// Array
['status', 'in', ['active', 'pending']]
['status', '=', ['active', 'pending']]  // Same as in

// Date
['created', '=', 'this_month']
['created', '=', 'last_30_days']
['created', 'between', ['2024-01-01', '2024-12-31']]

// Null
['description', '=', null]
['description', '!=', null]

// Logical
[
  ['status', '=', 'active'],
  'and',
  ['amount', '>', 1000]
]

[
  ['priority', '=', 'high'],
  'or',
  ['amount', '>', 10000]
]
```

### CRUD Operations
```javascript
// Create
const newRecord = await objects.my_object.insert({
  name: 'New Record',
  status: 'active'
}, userSession);

// Read
const record = await objects.my_object.findOne(id, {
  fields: ['name', 'status']
}, userSession);

// Update
await objects.my_object.update(id, {
  status: 'inactive'
}, userSession);

// Delete
await objects.my_object.delete(id, userSession);

// Count
const count = await objects.my_object.count({
  filters: [['status', '=', 'active']]
});

// Aggregate
const result = await objects.my_object.aggregate({
  filters: [['status', '=', 'active']]
}, [
  { $group: { _id: '$category', total: { $sum: '$amount' } } }
]);
```

## ⚡ Trigger Template

```javascript
// triggers/my_object.trigger.js
module.exports = {
  listenTo: 'my_object',
  
  // Before Insert
  beforeInsert: async function() {
    const { doc } = this;
    // Validate data
    if (doc.amount < 0) {
      throw new Error('Amount must be positive');
    }
    // Auto-fill fields
    doc.created_at = new Date();
  },
  
  // After Insert
  afterInsert: async function() {
    const { doc, id } = this;
    // Create related records
    await this.getObject('tasks').insert({
      related_to: id,
      name: `Task for ${doc.name}`
    });
  },
  
  // Before Update
  beforeUpdate: async function() {
    const { doc, id } = this;
    // Get previous doc
    const prev = await this.getObject(this.objectName).findOne(id);
    // Check status change
    if (doc.status && doc.status !== prev.status) {
      // Validate transition
      this.validateStatusChange(prev.status, doc.status);
    }
  },
  
  // After Update
  afterUpdate: async function() {
    const { doc, previousDoc, id } = this;
    // Detect changes
    if (doc.status !== previousDoc.status) {
      // Send notification
      await this.broker.call('notifications.send', {
        to: doc.owner,
        message: `Status changed to ${doc.status}`
      });
    }
  },
  
  // Before Delete
  beforeDelete: async function() {
    const { id } = this;
    // Check dependencies
    const count = await this.getObject('tasks').count({
      filters: [['related_to', '=', id]]
    });
    if (count > 0) {
      throw new Error('Cannot delete: has related records');
    }
  },
  
  // After Delete
  afterDelete: async function() {
    const { previousDoc } = this;
    // Cleanup
    await this.broker.call('files.deleteByRecord', {
      recordId: previousDoc._id
    });
  },
  
  // Helper methods
  validateStatusChange: function(oldStatus, newStatus) {
    const valid = {
      'draft': ['active', 'cancelled'],
      'active': ['completed', 'cancelled'],
      'completed': [],
      'cancelled': []
    };
    if (!valid[oldStatus]?.includes(newStatus)) {
      throw new Error(`Cannot change from ${oldStatus} to ${newStatus}`);
    }
  }
};
```

## 🔐 Permission Set Template

```yaml
# permissionsets/my_role.permissionset.yml
name: my_role
label: My Role
license: platform
object_permissions:
  my_object:
    allowCreate: true
    allowRead: true
    allowEdit: true
    allowDelete: false
    viewAllRecords: false
    modifyAllRecords: false
field_permissions:
  my_object.sensitive_field:
    readable: false
    editable: false
  my_object.readonly_field:
    readable: true
    editable: false
```

## 🎨 Application Template

```yaml
# applications/my_app.app.yml
_id: my_app
name: My Application
description: My application description
icon: apps
is_creator: true
visible: true
sort: 100
objects:
  - my_object
  - accounts
  - contacts
```

## 📋 Layout Template

```yaml
# layouts/my_object_default.layout.yml
name: my_object_default
object_name: my_object
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
  - label: Details
    columns: 1
    fields:
      - description
      - related_to
```

## 🔧 Field Type Quick Reference

| Type | Example | Use Case |
|------|---------|----------|
| `text` | `{ type: text }` | Short text |
| `textarea` | `{ type: textarea, rows: 5 }` | Long text |
| `number` | `{ type: number, scale: 2 }` | Numbers |
| `currency` | `{ type: currency }` | Money |
| `date` | `{ type: date }` | Date only |
| `datetime` | `{ type: datetime }` | Date and time |
| `boolean` | `{ type: boolean }` | Yes/No |
| `select` | `{ type: select, options: [...] }` | Dropdown |
| `lookup` | `{ type: lookup, reference_to: accounts }` | Relationship |
| `master_detail` | `{ type: master_detail, reference_to: accounts }` | Parent-child |
| `formula` | `{ type: formula, formula: "field1 + field2" }` | Calculated |
| `autonumber` | `{ type: autonumber, formula: "PRE-{0000}" }` | Auto ID |

## 🌐 Environment Variables

```bash
# Database
MONGO_URL=mongodb://localhost:27017/steedos
MONGO_OPLOG_URL=mongodb://localhost:27017/local

# Server
ROOT_URL=http://localhost:5100
PORT=5100
NODE_ENV=development

# Features
STEEDOS_TENANT_ENABLE_REGISTER=true
STEEDOS_CFS_STORE=local

# Redis (optional)
REDIS_URL=redis://localhost:6379

# Storage
STEEDOS_STORAGE_DIR=storage
```

## 🐛 Debug Commands

```bash
# Enable debug logging
export DEBUG=objectql:*           # ObjectQL logs
export DEBUG=metadata:*           # Metadata logs
export DEBUG=*                    # All logs

# View logs
tail -f logs/app.log

# Check metadata
curl http://localhost:5100/api/metadata/reload

# Test API
curl http://localhost:5100/api/v4/objects/accounts
```

## 📚 Useful Paths

| Resource | Path |
|----------|------|
| Objects | `objects/*.object.yml` |
| Triggers | `triggers/*.trigger.js` |
| Actions | `actions/*.action.js` |
| Apps | `applications/*.app.yml` |
| Permissions | `permissionsets/*.permissionset.yml` |
| Layouts | `layouts/*.layout.yml` |
| Translations | `translations/*.yml` |
| Documentation | `docs/` |

## 🔗 Important URLs

| URL | Purpose |
|-----|---------|
| http://localhost:5100 | Application UI |
| http://localhost:5100/api | API root |
| http://localhost:5100/graphql | GraphQL endpoint |
| http://localhost:5100/api/metadata | Metadata API |
| http://localhost:5100/steedos/api/odata/v4 | OData endpoint |

## 💡 Best Practices

### ✅ Do
- Pass `userSession` for permission checks
- Select only needed fields
- Use indexed fields in filters
- Limit query results with `top`
- Keep triggers simple
- Document complex logic
- Handle errors gracefully

### ❌ Don't
- Query all fields when not needed
- Forget permission checks
- Use non-indexed fields in filters
- Create infinite loops in triggers
- Perform N+1 queries
- Hardcode values
- Ignore error handling

## 🆘 Common Issues

### Object not found
- Check object name spelling
- Verify metadata loaded
- Restart server

### Permission denied
- Pass userSession parameter
- Check permission set config
- Verify user has access

### Trigger not firing
- Check listenTo matches object name
- Verify file location
- Restart server after changes

---

**For more details, see**: [Full Documentation](docs/README.md)
