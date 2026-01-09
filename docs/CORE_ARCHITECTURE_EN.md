# Steedos Platform Core Architecture Documentation

> Version: 3.0.12  
> Last Updated: 2026-01-09

## Table of Contents

- [1. Project Overview](#1-project-overview)
- [2. Core Architecture](#2-core-architecture)
- [3. Technology Stack](#3-technology-stack)
- [4. Core Modules](#4-core-modules)
- [5. Service Architecture](#5-service-architecture)
- [6. Data Flow](#6-data-flow)
- [7. Extension Mechanisms](#7-extension-mechanisms)
- [8. Security](#8-security)

---

## 1. Project Overview

### 1.1 Introduction

**Steedos Platform** is the next-generation AI-native low-code development platform that combines metadata-driven architecture with generative AI technology. Built on a modern open-source technology stack, it supports on-premises deployment and hybrid cloud architectures.

### 1.2 Core Features

- **🤖 AI-Driven Development**: Generate data models, UIs, and business logic through natural language prompts
- **🧠 Metadata-Driven**: Salesforce-like metadata architecture with all configurations stored as YAML/JSON files
- **🚀 Microservices Architecture**: Distributed microservices framework based on Moleculer
- **⚡ Cross-Database Support**: ObjectQL unified query language supporting both MongoDB and SQL databases
- **🛡️ Enterprise-Grade Security**: Object-level, field-level, and record-level permission control
- **🎨 Modern UI**: Built on React and Baidu's Amis low-code framework

### 1.3 Project Structure

```
steedos-platform/
├── packages/          # Core NPM packages
│   ├── objectql/      # Object Query Language
│   ├── metadata-core/ # Metadata core
│   ├── accounts/      # Account management
│   └── ...
├── services/          # Microservice modules
│   ├── service-metadata-server/  # Metadata server
│   ├── service-api/              # API service
│   └── ...
├── builder6/          # Builder application
│   ├── server/        # Server side
│   ├── webapp/        # Web application
│   └── ai/            # AI modules
├── ee/                # Enterprise edition features
├── deploy/            # Deployment configurations
└── docs/              # Documentation
```

---

## 2. Core Architecture

### 2.1 Overall Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend Layer                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   React UI   │  │  Amis Engine │  │    Mobile    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      API Gateway Layer                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  REST API    │  │   GraphQL    │  │    OData     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   Microservices Layer                        │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐   │
│  │  Metadata │ │ ObjectQL  │ │  Account  │ │    ...    │   │
│  │  Service  │ │  Service  │ │  Service  │ │  Service  │   │
│  └───────────┘ └───────────┘ └───────────┘ └───────────┘   │
│                   Moleculer Framework                        │
└─────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                        Data Layer                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   MongoDB    │  │  PostgreSQL  │  │    Redis     │      │
│  │  (Metadata)  │  │(Business Data)│  │   (Cache)    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Design Patterns

#### Metadata-Driven Architecture

All business objects, fields, permissions, page layouts, and other configurations are stored as metadata:

```yaml
# Object definition example
name: accounts
label: Account
fields:
  name:
    type: text
    label: Account Name
    required: true
  industry:
    type: select
    label: Industry
    options:
      - label: Technology
        value: tech
      - label: Finance
        value: finance
```

#### Microservices Architecture

Built on the [Moleculer](https://moleculer.services/) framework:

- **Service Discovery**: Automatic service discovery and registration
- **Load Balancing**: Built-in request load balancing
- **Fault Tolerance**: Circuit breaker, retry, and timeout control
- **Distributed Tracing**: Request tracking and performance monitoring

---

## 3. Technology Stack

### 3.1 Backend Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | ≥22.0.0 | Runtime environment |
| TypeScript | 5.7.3 | Development language |
| Moleculer | - | Microservices framework |
| MongoDB | ≥4.2 | Metadata storage |
| TypeORM | 0.3.26 | SQL ORM |
| GraphQL | 15.8.0 | API query language |
| Express | 5.1.0 | Web framework |

### 3.2 Frontend Stack

| Technology | Purpose |
|------------|---------|
| React | UI framework |
| Amis | Low-code page rendering engine |
| amis-formula | Formula calculation engine |

### 3.3 Database Support

- **MongoDB**: Metadata storage, default business database
- **PostgreSQL**: Business data storage (optional)
- **MySQL**: Business data storage (optional)
- **Oracle**: Business data storage (optional)
- **Redis**: Cache and message queue
- **NATS**: Message transport (optional)

---

## 4. Core Modules

### 4.1 ObjectQL (@steedos/objectql)

**Object Query Language** providing unified data access interface.

**Core Features**:
- Cross-database queries (MongoDB/SQL)
- CRUD operations
- Permission validation
- Trigger execution
- Aggregation queries

**Example**:

```javascript
// Query data
const records = await objects.accounts.find({
  fields: ['name', 'industry'],
  filters: [['owner', '=', userId]],
  sort: 'created desc'
});

// Insert data
const newRecord = await objects.accounts.insert({
  name: 'New Account',
  industry: 'tech'
}, userSession);
```

### 4.2 Metadata Core (@steedos/metadata-core)

**Metadata Core** responsible for loading, parsing, and merging metadata.

**Core Features**:
- Metadata file scanning and loading
- Metadata validation
- Metadata inheritance and override
- Metadata export and import

**Metadata Types**:
- Objects
- Fields
- Permissions
- Layouts
- Apps
- Tabs
- Triggers

### 4.3 Accounts (@steedos/accounts)

**Account Management** providing user authentication and authorization.

**Core Features**:
- User registration and login
- Password encryption and validation
- JWT Token generation and verification
- Third-party login integration (OIDC, SAML, LDAP)

### 4.4 Process (@steedos/process)

**Process Engine** supporting approval flows and workflows.

**Core Features**:
- BPMN process definitions
- Process instance management
- Counter-signing, rejection, delegation
- Process monitoring

### 4.5 Filters (@steedos/filters)

**Filter Library** providing unified query condition processing.

**Supported Operators**:
- Comparison: `=`, `!=`, `>`, `>=`, `<`, `<=`
- Text: `startswith`, `contains`, `notcontains`
- Range: `between`
- Logic: `and`, `or`

### 4.6 Formula (@steedos/formula)

**Formula Engine** supporting field formula calculations.

Built on `amis-formula`, supports:
- Mathematical operations
- Text processing
- Date and time
- Logical operations
- Data aggregation

---

## 5. Service Architecture

### 5.1 Core Services

#### service-metadata-server

**Metadata Server** providing HTTP API for metadata.

**Endpoints**:
- `GET /api/metadata/objects/:objectName`
- `POST /api/metadata/reload`
- `GET /api/metadata/apps`

#### service-api

**API Service** providing unified API gateway.

**Supported Protocols**:
- REST API
- GraphQL
- OData v4

#### service-objectql

**ObjectQL Service** wrapping ObjectQL as a microservice.

**Actions**:
- `objectql.find`
- `objectql.findOne`
- `objectql.insert`
- `objectql.update`
- `objectql.delete`
- `objectql.aggregate`

#### service-accounts

**Account Service** handling user authentication and authorization.

**Actions**:
- `accounts.login`
- `accounts.logout`
- `accounts.register`
- `accounts.verifyToken`

### 5.2 Metadata Services

| Service | Function |
|---------|----------|
| service-metadata | Metadata loading and management |
| service-metadata-objects | Object metadata |
| service-metadata-apps | Application metadata |
| service-metadata-layouts | Page layouts |
| service-metadata-tabs | Tabs |
| service-metadata-permissionsets | Permission sets |
| service-metadata-triggers | Triggers |
| service-metadata-translations | i18n translations |

### 5.3 Standard Services

| Service | Function |
|---------|----------|
| standard-accounts | Standard account objects |
| standard-object-database | Database standard objects |
| standard-permission | Standard permission management |
| standard-process-approval | Standard approval process |
| standard-ui | Standard UI components |

### 5.4 Service Communication

```
┌─────────────┐
│   Service A │
└──────┬──────┘
       │ broker.call('serviceB.action', params)
       ▼
┌─────────────────┐
│  Moleculer Bus  │  (NATS/Redis/TCP)
└────────┬────────┘
         │
         ▼
┌─────────────┐
│  Service B  │
└─────────────┘
```

**Communication Methods**:
- **Request-Response**: `broker.call()`
- **Events**: `broker.emit()` / `broker.broadcast()`
- **Load Balancing**: Automatic load balancing

---

## 6. Data Flow

### 6.1 Request Processing Flow

```
User Request
    ↓
API Gateway (Express)
    ↓
Moleculer Action
    ↓
ObjectQL (Permission Check)
    ↓
Before Trigger
    ↓
Database Driver (MongoDB/SQL)
    ↓
After Trigger
    ↓
Return Response
```

### 6.2 Metadata Loading Flow

```
Start Steedos Server
    ↓
Scan Packages (packages/)
    ↓
Load Packages by Dependency Order
    ↓
Merge Metadata
    ↓
Create Object Services
    ↓
Register API Routes
    ↓
Service Ready
```

### 6.3 Trigger Execution Flow

**Trigger Types**:
- `beforeFind` / `afterFind`
- `beforeInsert` / `afterInsert`
- `beforeUpdate` / `afterUpdate`
- `beforeDelete` / `afterDelete`
- `beforeAggregate` / `afterAggregate`

**Execution Order**:

```javascript
// Using insert as example
1. Call objects.accounts.insert(doc, userSession)
2. Execute permission check
3. Execute beforeInsert trigger
4. Insert data to database
5. Execute afterInsert trigger
6. Send notifications (if configured)
7. Return inserted record
```

---

## 7. Extension Mechanisms

### 7.1 Packages

Steedos supports extending functionality through packages.

**Package Structure**:

```
my-package/
├── package.json
├── main/
│   └── default/
│       ├── objects/
│       │   └── custom_object.object.yml
│       ├── applications/
│       │   └── custom_app.app.yml
│       ├── triggers/
│       │   └── custom_trigger.trigger.js
│       └── pages/
│           └── custom_page.page.yml
```

**Creating a Package**:

```bash
npx create-steedos-package my-package
```

### 7.2 Object Inheritance

Extend existing objects in new packages:

```yaml
# Extend accounts object
name: accounts
extend: accounts
fields:
  custom_field:
    type: text
    label: Custom Field
```

### 7.3 Custom Services

Create custom Moleculer services:

```javascript
// custom.service.js
module.exports = {
  name: "custom",
  actions: {
    hello: {
      async handler(ctx) {
        return "Hello from custom service!";
      }
    }
  }
};
```

### 7.4 Custom Actions

Add custom actions to objects:

```javascript
// accounts.action.js
module.exports = {
  sendEmail: async function(object_name, record_id, userSession) {
    // Email sending logic
    return { success: true };
  }
};
```

---

## 8. Security

### 8.1 Permission Model

**Three-Level Permission Control**:

1. **Object-Level Permissions**: Control user access to entire objects
2. **Field-Level Permissions**: Control user read/write access to specific fields
3. **Record-Level Permissions**: Control user access to specific records through sharing rules

### 8.2 Permission Configuration

```yaml
# Permission set definition
name: sales_manager
label: Sales Manager
object_permissions:
  accounts:
    allowCreate: true
    allowRead: true
    allowEdit: true
    allowDelete: false
field_permissions:
  accounts.revenue:
    readable: true
    editable: true
```

### 8.3 Data Isolation

**Organization Structure**:
- Multi-tenant data isolation
- Separated by `space` field
- Cross-organization queries require special permissions

### 8.4 Authentication Methods

- **Local Authentication**: Username and password
- **JWT Token**: Stateless authentication
- **OIDC**: OpenID Connect
- **SAML**: Enterprise SSO
- **LDAP/AD**: Domain integration

### 8.5 Security Best Practices

1. **Sensitive Data Encryption**: Passwords encrypted with bcrypt
2. **XSS Protection**: Frontend input validation and escaping
3. **CSRF Protection**: Token validation
4. **SQL Injection Protection**: Use ORM and parameterized queries
5. **Permission Validation**: Permission check on every ObjectQL operation

---

## Appendix

### A. Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| ROOT_URL | Root URL | http://localhost:5100 |
| PORT | Service port | 5100 |
| MONGO_URL | MongoDB connection string | mongodb://localhost/steedos |
| REDIS_URL | Redis connection string | redis://localhost:6379 |
| TRANSPORTER | Moleculer transporter | - |
| NODE_ENV | Environment | development |

### B. Common Commands

```bash
# Install dependencies
yarn

# Start development server
yarn start

# Build all packages
yarn build

# Run Docker
yarn docker

# Clean dependencies
yarn clean
```

### C. References

- [Official Website](https://www.steedos.com/)
- [Documentation](https://docs.steedos.com/)
- [GitHub](https://github.com/steedos/steedos-platform)
- [Moleculer Docs](https://moleculer.services/)
- [Amis Docs](https://aisuda.bce.baidu.com/amis/)

---

**Maintained by**: Steedos Development Team  
**Last Reviewed**: 2026-01-09
