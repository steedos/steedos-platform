# Steedos Platform Packages and Services Index

> Version: 3.0.12  
> Last Updated: 2026-01-09

This document provides a detailed index of all core packages and services in the Steedos Platform.

---

## 📦 Core Packages

Located in the `packages/` directory, consisting of 26 core NPM packages.

### Data Access Layer

#### @steedos/objectql
**Object Query Language Core**

- **Location**: `packages/objectql/`
- **Function**: Provides unified cross-database query interface
- **Key Features**:
  - Supports MongoDB and SQL databases
  - CRUD operations
  - Permission validation
  - Trigger execution
  - Aggregation queries
- **Dependencies**:
  - @steedos/metadata-core
  - @steedos/filters
  - @steedos/formula
  - TypeORM, MongoDB, Sequelize

#### @steedos/odata-v4-mongodb
**MongoDB OData Service**

- **Location**: `packages/odata-v4-mongodb/`
- **Function**: Converts MongoDB queries to OData v4 format
- **Features**: Supports OData v4 query syntax

#### @steedos/odata-v4-sql
**SQL OData Service**

- **Location**: `packages/odata-v4-sql/`
- **Function**: Converts SQL queries to OData v4 format

#### @steedos/odata-v4-typeorm
**TypeORM OData Integration**

- **Location**: `packages/odata-v4-typeorm/`
- **Function**: OData implementation based on TypeORM

#### @steedos/odata-v4-parser
**OData v4 Parser**

- **Location**: `packages/odata-v4-parser/`
- **Function**: Parses OData v4 query syntax

---

### Metadata Layer

#### @steedos/metadata-core
**Metadata Core Engine**

- **Location**: `packages/metadata-core/`
- **Function**: Metadata loading, parsing, validation, and merging
- **Key Features**:
  - Metadata file scanning
  - Metadata validation
  - Metadata inheritance and override
  - Metadata export and import
- **Metadata Types**:
  - Objects, Fields, Permissions
  - Layouts, Apps, Tabs
  - Triggers, Workflows, Reports

#### @steedos/metadata-api
**Metadata API**

- **Location**: `packages/metadata-api/`
- **Function**: Provides REST API for metadata
- **Endpoints**:
  - `/api/metadata/objects`
  - `/api/metadata/reload`
  - `/api/metadata/export`

#### @steedos/metadata-registrar
**Metadata Registrar**

- **Location**: `packages/metadata-registrar/`
- **Function**: Metadata registration and management

---

### Accounts and Permissions

#### @steedos/accounts
**Account Management**

- **Location**: `packages/accounts/`
- **Function**: User account management
- **Key Features**:
  - User registration and login
  - Password encryption and validation
  - JWT Token management
  - Third-party login integration

#### @steedos/auth
**Authentication Module**

- **Location**: `packages/auth/`
- **Function**: Authentication and authorization
- **Supports**:
  - OIDC, SAML
  - LDAP, AD
  - OAuth 2.0

---

### Business Logic Layer

#### @steedos/process
**Process Engine**

- **Location**: `packages/process/`
- **Function**: Workflow and approval flows
- **Features**:
  - BPMN process definitions
  - Process instance management
  - Counter-signing, rejection, delegation

#### @steedos/filters
**Filter Library**

- **Location**: `packages/filters/`
- **Function**: Unified query condition processing
- **Operators**: =, !=, >, >=, <, <=, startswith, contains, between, and, or

#### @steedos/formula
**Formula Engine**

- **Location**: `packages/formula/`
- **Function**: Field formula calculations
- **Based on**: amis-formula
- **Supports**: Math, text, date, logic, aggregation

---

### Tools and Utilities

#### @steedos/utils
**Utility Functions Library**

- **Location**: `packages/utils/`
- **Function**: Common utility functions

#### @steedos/i18n
**Internationalization**

- **Location**: `packages/i18n/`
- **Function**: Multi-language support
- **Supported Languages**: Chinese, English

#### @steedos/schemas
**Schema Definitions**

- **Location**: `packages/schemas/`
- **Function**: Data schema definitions and validation

#### @steedos/cachers
**Cache Management**

- **Location**: `packages/cachers/`
- **Function**: Cache abstraction layer
- **Supports**: Redis, Memory

#### @steedos/router
**Router Management**

- **Location**: `packages/router/`
- **Function**: Frontend routing management

---

### API and Integration

#### @steedos/moleculer-apollo-server
**GraphQL Server**

- **Location**: `packages/moleculer-apollo-server/`
- **Function**: Apollo GraphQL server based on Moleculer
- **Dependencies**: apollo-server, graphql

#### @steedos/client
**Client SDK**

- **Location**: `packages/client/`
- **Function**: JavaScript/TypeScript client SDK
- **Use**: Call Steedos API from frontend or Node.js

---

### Development Tools

#### @steedos/cli
**Command Line Tools**

- **Location**: `packages/cli/`
- **Function**: Steedos command line interface
- **Commands**:
  - `steedos start`
  - `steedos deploy`
  - `steedos sync`

#### @steedos/create-steedos-app
**Application Scaffolding**

- **Location**: `packages/create-steedos-app/`
- **Function**: Create new Steedos applications
- **Usage**: `npx create-steedos-app my-app`

#### @steedos/create-steedos-package
**Package Scaffolding**

- **Location**: `packages/create-steedos-package/`
- **Function**: Create new Steedos packages
- **Usage**: `npx create-steedos-package my-package`

#### @steedos/steedos-plugin-schema-builder
**Schema Builder Plugin**

- **Location**: `packages/steedos-plugin-schema-builder/`
- **Function**: Visual schema design tool

---

### Data Processing

#### @steedos/migrate
**Data Migration**

- **Location**: `packages/migrate/`
- **Function**: Database migration tools

#### @steedos/data-import
**Data Import**

- **Location**: `packages/data-import/`
- **Function**: Bulk data import

---

## 🔧 Microservices

Located in the `services/` directory, consisting of 39 microservice modules.

### Core Services

#### service-api
**API Gateway Service**

- **Location**: `services/service-api/`
- **Function**: Unified API gateway
- **Protocols**: REST, GraphQL, OData v4
- **Port**: Default 5100

#### service-objectql
**ObjectQL Service**

- **Location**: `services/service-objectql/`
- **Function**: Wraps ObjectQL as a microservice
- **Actions**:
  - objectql.find
  - objectql.findOne
  - objectql.insert
  - objectql.update
  - objectql.delete
  - objectql.aggregate

#### service-rest
**REST API Service**

- **Location**: `services/service-rest/`
- **Function**: REST API implementation
- **Path**: `/api/v4/*`

#### service-object-graphql
**GraphQL Service**

- **Location**: `services/service-object-graphql/`
- **Function**: GraphQL API implementation
- **Endpoint**: `/api/graphql`

---

### Metadata Services

#### service-metadata
**Metadata Management Service**

- **Location**: `services/service-metadata/`
- **Function**: Core metadata loading and management

#### service-metadata-server
**Metadata Server**

- **Location**: `services/service-metadata-server/`
- **Function**: Metadata HTTP server
- **Endpoint**: `/api/metadata/*`

#### service-metadata-objects
**Object Metadata Service**

- **Location**: `services/service-metadata-objects/`
- **Function**: Manages object metadata

#### service-metadata-apps
**Application Metadata Service**

- **Location**: `services/service-metadata-apps/`
- **Function**: Manages application metadata

#### service-metadata-layouts
**Layout Metadata Service**

- **Location**: `services/service-metadata-layouts/`
- **Function**: Manages page layout metadata

#### service-metadata-tabs
**Tab Metadata Service**

- **Location**: `services/service-metadata-tabs/`
- **Function**: Manages tab metadata

#### service-metadata-permissionsets
**Permission Set Metadata Service**

- **Location**: `services/service-metadata-permissionsets/`
- **Function**: Manages permission set metadata

#### service-metadata-triggers
**Trigger Metadata Service**

- **Location**: `services/service-metadata-triggers/`
- **Function**: Manages trigger metadata

#### service-metadata-translations
**Translation Metadata Service**

- **Location**: `services/service-metadata-translations/`
- **Function**: Manages internationalization translations

#### service-metadata-database
**Database Metadata Service**

- **Location**: `services/service-metadata-database/`
- **Function**: Database-related metadata

---

### Account and Authentication Services

#### service-accounts
**Account Service**

- **Location**: `services/service-accounts/`
- **Function**: User account management
- **Actions**:
  - accounts.login
  - accounts.logout
  - accounts.register
  - accounts.verifyToken

#### service-identity-jwt
**JWT Authentication Service**

- **Location**: `services/service-identity-jwt/`
- **Function**: JWT Token verification

---

### UI Services

#### service-ui
**UI Service**

- **Location**: `services/service-ui/`
- **Function**: Frontend UI resource service

#### service-pages
**Page Service**

- **Location**: `services/service-pages/`
- **Function**: Page configuration and rendering

#### service-plugin-amis
**Amis Plugin Service**

- **Location**: `services/service-plugin-amis/`
- **Function**: Amis low-code engine integration

---

### Package Management Services

#### service-package-loader
**Package Loader Service**

- **Location**: `services/service-package-loader/`
- **Function**: Package loading and management

#### service-package-registry
**Package Registry Service**

- **Location**: `services/service-package-registry/`
- **Function**: Package registration and version management

#### service-packages
**Package Service**

- **Location**: `services/service-packages/`
- **Function**: Package installation and uninstallation

---

### Standard Services

#### standard-accounts
**Standard Account Service**

- **Location**: `services/standard-accounts/`
- **Function**: Provides standard account objects

#### standard-object-database
**Standard Object Database**

- **Location**: `services/standard-object-database/`
- **Function**: Standard object definitions

#### standard-permission
**Standard Permission Service**

- **Location**: `services/standard-permission/`
- **Function**: Standard permission management

#### standard-process-approval
**Standard Approval Process Service**

- **Location**: `services/standard-process-approval/`
- **Function**: Standard approval processes

#### standard-ui
**Standard UI Service**

- **Location**: `services/standard-ui/`
- **Function**: Standard UI components

---

### Other Services

#### service-core-objects
**Core Objects Service**

- **Location**: `services/service-core-objects/`
- **Function**: Provides core business objects

#### service-object-mixin
**Object Mixin Service**

- **Location**: `services/service-object-mixin/`
- **Function**: Object mixin and extension

#### service-fields-indexs
**Field Index Service**

- **Location**: `services/service-fields-indexs/`
- **Function**: Database index management

#### service-i18n
**Internationalization Service**

- **Location**: `services/service-i18n/`
- **Function**: Internationalization translation management

#### service-cachers-manager
**Cache Manager Service**

- **Location**: `services/service-cachers-manager/`
- **Function**: Cache strategy management

#### moleculer-bullmq
**BullMQ Integration**

- **Location**: `services/moleculer-bullmq/`
- **Function**: Task queue integration

#### service-bull-dashboard
**Bull Dashboard**

- **Location**: `services/service-bull-dashboard/`
- **Function**: Task queue monitoring

#### service-community
**Community Service**

- **Location**: `services/service-community/`
- **Function**: Community edition features

#### service-saas
**SaaS Service**

- **Location**: `services/service-saas/`
- **Function**: SaaS multi-tenant support

#### unpkg
**NPM CDN Service**

- **Location**: `services/unpkg/`
- **Function**: NPM package CDN service

#### workflow_time_trigger
**Workflow Time Trigger**

- **Location**: `services/workflow_time_trigger/`
- **Function**: Scheduled tasks and workflow triggers

---

## 🏗️ Builder Application (Builder6)

Located in the `builder6/` directory.

### @steedos/server
**Main Server**

- **Location**: `builder6/server/`
- **Function**: Steedos main server application
- **Start**: `yarn start`
- **Port**: 5100

### builder6/webapp
**Web Frontend Application**

- **Location**: `builder6/webapp/`
- **Technology**: React, Amis
- **Development**: `yarn webapp`
- **Port**: 3000 (development mode)

### builder6/ai
**AI Modules**

- **Location**: `builder6/ai/`
- **Function**: AI-related features and integration

---

## 🏢 Enterprise Edition (EE)

Located in the `ee/` directory.

### branding
**Brand Customization**

- **Location**: `ee/branding/`
- **Function**: Enterprise brand customization

### service-enterprise
**Enterprise Service**

- **Location**: `ee/service-enterprise/`
- **Function**: Enterprise edition exclusive services

---

## 📊 Dependency Relationships

### Core Dependency Chain

```
@steedos/server
  ├── @steedos/objectql
  │   ├── @steedos/metadata-core
  │   ├── @steedos/filters
  │   └── @steedos/formula
  ├── @steedos/accounts
  ├── @steedos/process
  └── services/*
```

### Service Dependencies

```
service-api
  ├── service-objectql
  ├── service-rest
  └── service-object-graphql
      └── @steedos/objectql
```

---

## 📝 Metadata File Structure

```
package/
├── package.json
└── main/
    └── default/
        ├── objects/              # Object definitions
        │   ├── *.object.yml
        │   └── *.object.js
        ├── applications/         # Application definitions
        │   └── *.app.yml
        ├── permissionsets/       # Permission sets
        │   └── *.permissionset.yml
        ├── layouts/              # Page layouts
        │   └── *.layout.yml
        ├── tabs/                 # Tabs
        │   └── *.tab.yml
        ├── triggers/             # Triggers
        │   └── *.trigger.js
        ├── actions/              # Custom actions
        │   └── *.action.js
        ├── pages/                # Page configurations
        │   └── *.page.yml
        └── translations/         # Translations
            └── *.i18n.yml
```

---

**Maintained by**: Steedos Development Team  
**Last Updated**: 2026-01-09
