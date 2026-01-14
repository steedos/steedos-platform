# Steedos Platform - GitHub Copilot Instructions

## Project Overview

Steedos Platform is an **AI-Native Low-Code Platform** that combines metadata-driven architecture with generative AI to enable rapid enterprise application development. The platform supports "Prompt to App" development, allowing developers to create data models, UIs, and microservices using natural language.

## Tech Stack

- **Backend**: Node.js, Moleculer (microservices), MongoDB/PostgreSQL/MySQL
- **Frontend**: React, Baidu Amis (Low-Code UI Framework)
- **Architecture**: Metadata-Driven, Event-Driven Microservices
- **Query Language**: ObjectQL (cross-database abstraction layer)

## Key Concepts

### 1. Metadata-Driven Architecture

Everything in Steedos is defined through metadata:

```yaml
# Example: Object Definition
name: accounts
label: Account
fields:
  name:
    type: text
    label: Name
    required: true
  annual_revenue:
    type: currency
    label: Annual Revenue
```

### 2. ObjectQL - Query Abstraction Layer

ObjectQL provides a unified query interface across different databases:

```javascript
// Query with permissions
const accounts = await objects.accounts.find({
  fields: ['name', 'annual_revenue'],
  filters: [['status', '=', 'active']],
  sort: 'name',
  top: 100
}, userSession);
```

### 3. Triggers - Business Logic

Triggers execute before/after data operations:

```javascript
module.exports = {
  listenTo: 'accounts',
  beforeInsert: async function() {
    const { doc } = this;
    // Validate and modify data before saving
  }
};
```

## Project Structure

```
steedos-platform/
├── packages/           # Core NPM packages (26 packages)
│   ├── objectql/      # Query abstraction layer
│   ├── metadata-core/ # Metadata engine
│   ├── accounts/      # User authentication
│   └── ...
├── services/          # Microservices (39 services)
│   ├── service-metadata-objects/
│   ├── service-api/
│   └── ...
├── builder6/          # Builder application
│   ├── server/        # Main server
│   └── webapp/        # React frontend
├── docs/              # Documentation
│   ├── metadata/      # Metadata docs
│   ├── objectql/      # ObjectQL docs
│   └── triggers/      # Trigger docs
└── test/              # Tests
```

## Development Guidelines

### Metadata Development

1. **Object Definition** - Define business entities in `.object.yml` files
2. **Field Types** - Use appropriate field types (text, number, lookup, master_detail, formula, etc.)
3. **Inheritance** - Extend standard objects by creating same-named objects in custom packages
4. **Permissions** - Define object and field-level permissions in `.permissionset.yml` files

### ObjectQL Usage

1. **Always pass userSession** - Ensure permission checks: `objects.xxx.find({...}, userSession)`
2. **Select specific fields** - Only query needed fields: `fields: ['name', 'status']`
3. **Use indexed fields** - Filter on indexed fields for better performance
4. **Limit results** - Always use `top` parameter to limit result size

### Trigger Development

1. **Keep triggers simple** - Complex logic should be in services
2. **Avoid infinite loops** - Be careful with update operations in afterUpdate
3. **Handle errors** - Always wrap external calls in try-catch
4. **Document purpose** - Add comments explaining trigger logic

### Coding Standards

- **Language**: TypeScript preferred, JavaScript acceptable
- **Style**: Follow ESLint configuration
- **Naming**: 
  - Objects: `snake_case` (e.g., `sales_orders`)
  - Fields: `snake_case` (e.g., `order_number`)
  - Services: `kebab-case` (e.g., `service-metadata-objects`)
  - Classes: `PascalCase`
  - Functions: `camelCase`

## Common Patterns

### Creating a New Object

```yaml
# objects/custom_object.object.yml
name: custom_object
label: Custom Object
icon: custom1
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
```

### Querying Related Objects

```javascript
// Query with relationship traversal
const contacts = await objects.contacts.find({
  fields: ['name', 'account.name', 'account.industry'],
  filters: [
    ['account.status', '=', 'active'],
    'and',
    ['is_primary', '=', true]
  ]
}, userSession);
```

### Implementing Validation

```javascript
// triggers/custom_object.trigger.js
module.exports = {
  listenTo: 'custom_object',
  
  beforeInsert: async function() {
    const { doc } = this;
    
    if (doc.amount < 0) {
      throw new Error('Amount must be greater than 0');
    }
  }
};
```

### Creating Related Records

```javascript
// triggers/accounts.trigger.js
module.exports = {
  listenTo: 'accounts',
  
  afterInsert: async function() {
    const { doc, id } = this;
    
    // Create default contact
    await this.getObject('contacts').insert({
      name: `${doc.name} - Primary Contact`,
      account: id,
      is_primary: true
    });
  }
};
```

## Metadata Inheritance Rules

When multiple packages define the same object:

1. **Objects merge** - Fields from all packages are combined
2. **Fields override** - Later packages override field properties
3. **Arrays append** - Array properties (like options) are appended
4. **Objects deep merge** - Object properties merge recursively
5. **Triggers replace** - Later triggers completely replace earlier ones

Example:

```yaml
# Base package
name: accounts
fields:
  phone:
    type: text
    required: false

# Extension package (loaded later)
name: accounts
fields:
  phone:
    required: true    # Override
  industry:          # Add new field
    type: select
```

## Testing

```bash
# Run tests for specific package
cd packages/objectql
yarn test

# Run tests with coverage
yarn test:coverage

# Run specific test file
yarn test src/test.spec.ts
```

## Documentation References

- **[Metadata Documentation](../docs/metadata/)** - Complete metadata guide
- **[ObjectQL Guide](../docs/objectql/)** - Query language reference
- **[Trigger Guide](../docs/triggers/)** - Trigger development
- **[Developer Guide](../docs/DEVELOPER_GUIDE.md)** - Setup and workflows
- **[Architecture](../docs/CORE_ARCHITECTURE_EN.md)** - System architecture

## Microservices Architecture

Steedos uses Moleculer for microservices:

```javascript
// Example service action
module.exports = {
  name: "accounts",
  
  actions: {
    create: {
      async handler(ctx) {
        const { doc } = ctx.params;
        // Trigger beforeInsert
        // Save to database
        // Trigger afterInsert
        return result;
      }
    }
  },
  
  events: {
    "account.created": {
      async handler(ctx) {
        // React to account creation
      }
    }
  }
};
```

## Permission Model

Permissions are evaluated in this order (most privileged wins):

1. **Profile** - Base permissions
2. **Permission Sets** - Additional permissions (union)
3. **Object Settings** - Object-level defaults
4. **Sharing Rules** - Record-level sharing
5. **Manual Sharing** - Individual record sharing

## AI Integration Points

When writing code for AI features:

1. **Metadata Generation** - Generate valid YAML metadata from natural language
2. **UI Generation** - Create Amis JSON configurations for pages
3. **Code Generation** - Generate Node.js code for business logic
4. **Schema Inference** - Infer object relationships from descriptions

## Environment Variables

Key environment variables:

- `ROOT_URL` - Application root URL
- `MONGO_URL` - MongoDB connection string
- `MONGO_OPLOG_URL` - MongoDB oplog URL
- `STEEDOS_TENANT_ENABLE_REGISTER` - Enable tenant registration
- `STEEDOS_CFS_STORE` - File storage type (local/s3)

## Build Commands

```bash
# Install dependencies
yarn

# Build all packages
yarn build

# Start development server
yarn start

# Start with watch mode
yarn dev

# Build Docker image
docker build -t steedos/steedos-platform .
```

## Common Issues and Solutions

### Issue: "Object not found"
- Ensure object metadata is loaded
- Check package dependencies
- Verify object name spelling

### Issue: "Permission denied"
- Check userSession is passed
- Verify permission set configuration
- Review object-level permissions

### Issue: "Trigger not firing"
- Check listenTo matches object name
- Verify trigger file location
- Ensure server restarted after changes

## When to Use What

- **Objects** - For data models and entities
- **Triggers** - For validation and automation
- **Actions** - For custom API endpoints
- **Buttons** - For custom UI actions
- **Workflows** - For approval processes
- **Reports** - For data analysis
- **Dashboards** - For data visualization

## Code Examples Repository

For more examples, see:
- [Steedos Templates](https://github.com/steedos/steedos-templates)
- [Example Apps](../test/)
- [Service Examples](../services/)

---

**Remember**: Steedos is metadata-driven. Always think "configuration over code" first, then implement custom logic only when necessary.
