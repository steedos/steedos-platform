# Steedos Platform - Repository Summary

> **Last Updated**: 2026-01-14  
> **Version**: 3.0.12  
> **Purpose**: AI-Native Low-Code Platform for Enterprise Applications

## 📋 Quick Facts

| Aspect | Details |
|--------|---------|
| **Architecture** | Metadata-Driven, Microservices-based |
| **Primary Language** | JavaScript/TypeScript |
| **Backend Framework** | Node.js with Moleculer |
| **Frontend Framework** | React with Baidu Amis |
| **Databases Supported** | MongoDB, PostgreSQL, MySQL |
| **Core Packages** | 26 NPM packages |
| **Microservices** | 39 services |
| **Metadata Files** | 167+ object/trigger/action definitions |
| **License** | MIT |

## 🎯 Project Mission

Steedos Platform enables **10x faster enterprise application development** by combining:
1. **Generative AI** - Natural language to app generation
2. **Metadata-Driven Core** - Configuration over code
3. **Standard Technologies** - Open source, standard Node.js/React

## 🏗️ Architecture Overview

### Three-Layer Architecture

```
┌─────────────────────────────────────────┐
│         Presentation Layer              │
│  (React + Amis Low-Code UI Framework)   │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│         Application Layer               │
│    (Moleculer Microservices + API)      │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│          Data Layer                     │
│  (ObjectQL + MongoDB/PostgreSQL/MySQL)  │
└─────────────────────────────────────────┘
```

### Key Components

1. **Metadata Engine** (`@steedos/metadata-core`)
   - Loads and parses metadata from YAML/JS files
   - Handles metadata inheritance and merging
   - Supports hot-reload for development

2. **ObjectQL Engine** (`@steedos/objectql`)
   - Cross-database query abstraction
   - Permission enforcement
   - Trigger execution
   - Formula and validation processing

3. **Object Service** (Moleculer services)
   - Auto-generated microservices from metadata
   - RESTful and GraphQL APIs
   - Event-driven communication
   - Horizontal scalability

4. **Builder Application** (`builder6/`)
   - Visual metadata editor
   - Page designer
   - Workflow designer
   - AI-powered generation tools

## 📦 Package Structure

### Core Packages (`packages/`)

| Package | Purpose | Key Features |
|---------|---------|--------------|
| `@steedos/objectql` | Query engine | Cross-DB queries, permissions, triggers |
| `@steedos/metadata-core` | Metadata engine | Load, parse, merge metadata |
| `@steedos/accounts` | Authentication | User management, SSO, OAuth |
| `@steedos/server` | Main server | Bootstrap, routing, middleware |
| `@steedos/api` | API layer | REST, GraphQL, OData endpoints |
| `@steedos/formula` | Formula engine | Field formulas, validation rules |
| `@steedos/filters` | Query filters | Filter parsing and execution |
| `@steedos/process-approval` | Workflow | Approval processes, routing |

### Microservices (`services/`)

| Service | Purpose |
|---------|---------|
| `service-metadata-objects` | Object metadata management |
| `service-metadata-server` | Metadata sync server |
| `service-api` | API Gateway |
| `service-pages` | Page rendering |
| `service-workflow` | Workflow engine |
| `standard-objects` | Standard object definitions |
| `standard-accounts` | Account management |
| `standard-space` | Workspace management |

### Builder Application (`builder6/`)

| Component | Purpose |
|-----------|---------|
| `server/` | Main application server |
| `webapp/` | React frontend application |
| `ai/` | AI integration services |

## 🔑 Core Concepts

### 1. Metadata Types

```yaml
# Object Definition (.object.yml)
name: sales_order
label: Sales Order
fields:
  order_number:
    type: autonumber
    formula: "SO-{0000}"
  customer:
    type: lookup
    reference_to: accounts
  amount:
    type: currency

# Application Definition (.app.yml)
name: sales
label: Sales Management
objects:
  - accounts
  - sales_orders

# Permission Set (.permissionset.yml)
name: sales_manager
object_permissions:
  sales_orders:
    allowCreate: true
    allowRead: true

# Trigger (.trigger.js)
module.exports = {
  listenTo: 'sales_orders',
  beforeInsert: async function() {
    // Validation logic
  }
};
```

### 2. ObjectQL Query Patterns

```javascript
// Basic query
const records = await objects.accounts.find({
  fields: ['name', 'status'],
  filters: [['status', '=', 'active']],
  sort: 'name',
  top: 100
}, userSession);

// Complex filters
filters: [
  ['status', '=', 'active'],
  'and',
  [
    ['amount', '>', 10000],
    'or',
    ['priority', '=', 'high']
  ]
];

// Relationship queries
fields: ['name', 'account.name', 'account.owner.name']
```

### 3. Trigger Patterns

```javascript
// Data validation
beforeInsert: async function() {
  if (this.doc.amount < 0) {
    throw new Error('Invalid amount');
  }
}

// Auto-fill fields
beforeInsert: async function() {
  this.doc.code = await generateCode();
}

// Create related records
afterInsert: async function() {
  await this.getObject('tasks').insert({
    related_to: this.id
  });
}

// Send notifications
afterUpdate: async function() {
  if (this.doc.status !== this.previousDoc.status) {
    await notifyOwner(this.id);
  }
}
```

## 🔄 Data Flow

### Creating a Record

```
1. User submits form
   ↓
2. API validates request
   ↓
3. ObjectQL checks permissions
   ↓
4. beforeInsert trigger executes
   ↓
5. Record saved to database
   ↓
6. afterInsert trigger executes
   ↓
7. Events published to message queue
   ↓
8. Response returned to user
```

### Querying Records

```
1. User requests data
   ↓
2. API validates request
   ↓
3. beforeFind trigger executes
   ↓
4. ObjectQL builds database query
   ↓
5. Permissions applied as filters
   ↓
6. Database executes query
   ↓
7. afterFind trigger executes
   ↓
8. Results returned to user
```

## 🛠️ Development Workflow

### 1. Create Object Metadata

```bash
# Create object definition
touch objects/custom_object.object.yml
```

### 2. Define Fields and Permissions

Edit the YAML file with object structure.

### 3. Create Triggers (if needed)

```bash
touch triggers/custom_object.trigger.js
```

### 4. Test Locally

```bash
yarn start
# Open http://localhost:5100
```

### 5. Deploy

```bash
# Build
yarn build

# Deploy to production
docker build -t myapp .
docker push myapp
```

## 📊 Metadata Statistics

| Metadata Type | Count | Location |
|---------------|-------|----------|
| Objects | 80+ | `*/objects/` |
| Triggers | 40+ | `*/triggers/` |
| Actions | 20+ | `*/actions/` |
| Applications | 10+ | `*/applications/` |
| Permission Sets | 15+ | `*/permissionsets/` |
| Layouts | 30+ | `*/layouts/` |

## 🔐 Security Model

### Permission Layers

1. **Object-level**: Create, Read, Update, Delete permissions
2. **Field-level**: Read, Edit permissions per field
3. **Record-level**: Owner, sharing rules, role hierarchy
4. **API-level**: API key, OAuth token validation

### Permission Evaluation

```javascript
// Permissions are checked in this order:
1. Is user authenticated?
2. Does user have object-level permission?
3. Does user have field-level permission?
4. Does user own the record OR have viewAllRecords?
5. Is record shared with user?
```

## 🚀 Performance Optimization

### Database Queries

- Index frequently filtered fields
- Use `top` to limit results
- Select only needed fields
- Avoid N+1 queries in triggers

### Metadata Loading

- Lazy load metadata packages
- Cache parsed metadata
- Use metadata hot-reload in development only

### Caching

- Redis for session data
- In-memory cache for metadata
- CDN for static assets

## 🧪 Testing Strategy

### Unit Tests

```javascript
// Test ObjectQL queries
describe('ObjectQL', () => {
  it('should query with filters', async () => {
    const results = await objects.accounts.find({
      filters: [['status', '=', 'active']]
    });
    expect(results.length).toBeGreaterThan(0);
  });
});
```

### Integration Tests

```javascript
// Test triggers
describe('Triggers', () => {
  it('should execute beforeInsert', async () => {
    const doc = { name: 'Test' };
    await objects.accounts.insert(doc);
    expect(doc.code).toBeDefined();
  });
});
```

### E2E Tests

Using Playwright for UI testing.

## 📈 Scaling Considerations

### Horizontal Scaling

- Stateless microservices
- Load balancer distributes requests
- Redis for session sharing
- MongoDB replica sets

### Vertical Scaling

- Increase Node.js memory: `--max-old-space-size=4096`
- Optimize database indexes
- Use database read replicas

### Caching Strategy

- Object metadata: In-memory cache
- User sessions: Redis
- Query results: Application-level cache
- Static assets: CDN

## 🔍 Monitoring and Debugging

### Logging

```javascript
// Enable debug logging
export DEBUG=objectql:*,metadata:*

// Log levels
logger.trace('Detailed trace');
logger.debug('Debug info');
logger.info('Info message');
logger.warn('Warning');
logger.error('Error', error);
```

### Performance Monitoring

- Moleculer metrics
- Database slow query log
- APM tools (New Relic, DataDog)

### Error Tracking

- Sentry integration
- Custom error handlers
- Audit logs

## 🌐 Internationalization

### Supported Languages

- English (en)
- Chinese (zh-CN)
- Extensible to other languages

### Translation Files

```yaml
# translations/custom.en.yml
custom_object:
  label: Custom Object
  fields:
    name: Name
    status: Status
```

## 🔄 CI/CD Pipeline

### GitHub Actions Workflows

1. **Lint**: ESLint, Prettier
2. **Test**: Unit and integration tests
3. **Build**: Compile TypeScript, bundle assets
4. **Deploy**: Docker image build and push

### Deployment Targets

- Docker containers
- Kubernetes clusters
- Cloud platforms (AWS, Azure, GCP)
- On-premises servers

## 📚 Learning Resources

### For Beginners

1. [Quick Start Guide](docs/README.md#-quick-start)
2. [Metadata Basics](docs/metadata/README.md)
3. [ObjectQL Tutorial](docs/objectql/README.md)

### For Developers

1. [Developer Guide](docs/DEVELOPER_GUIDE.md)
2. [Architecture Documentation](docs/CORE_ARCHITECTURE_EN.md)
3. [API Reference](docs/QUICK_REFERENCE.md)

### For Advanced Users

1. [Metadata Inheritance](docs/metadata/inheritance-rules.md)
2. [Trigger Development](docs/triggers/trigger-types.md)
3. [Performance Optimization](docs/objectql/best-practices.md)

## 🤝 Contributing

### Code Contributions

1. Fork the repository
2. Create feature branch
3. Follow coding standards
4. Write tests
5. Submit pull request

### Documentation Contributions

1. Improve existing docs
2. Add examples
3. Translate to other languages
4. Report errors

## 🔮 Roadmap

### Current Focus (Q1 2026)

- Enhanced AI code generation
- Improved metadata editor
- Performance optimizations
- More database drivers

### Future Plans

- Real-time collaboration
- Advanced analytics
- Mobile app builder
- More AI integrations

## 📞 Support

- **Documentation**: [docs.steedos.com](https://docs.steedos.com)
- **Community**: [GitHub Discussions](https://github.com/steedos/steedos-platform/discussions)
- **Issues**: [GitHub Issues](https://github.com/steedos/steedos-platform/issues)
- **Website**: [www.steedos.com](https://www.steedos.com)

## 📄 License

MIT License - See [LICENSE.txt](LICENSE.txt)

---

**For AI Assistants**: This repository uses a metadata-driven architecture. When helping with code, always consider the metadata definitions first, then implement custom logic only when configuration isn't sufficient.
