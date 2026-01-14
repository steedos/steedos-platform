# Steedos Platform Documentation

Welcome to Steedos Platform documentation!

## 📚 Core Documentation

### Architecture Documentation
- **[Core Architecture](./CORE_ARCHITECTURE_EN.md)** - Comprehensive overview of Steedos platform architecture, design patterns, and technology stack

### Development Guides
- **[Developer Guide](./DEVELOPER_GUIDE.md)** - Complete guide for development environment setup, workflows, and best practices
- **[Packages & Services Index](./PACKAGES_INDEX.md)** - Detailed index of all 26 core packages and 39 microservices
- **[Quick Reference](./QUICK_REFERENCE.md)** - Quick reference for commands, APIs, and configurations

### Technical Documentation
- **[Metadata](./metadata/)** - Complete metadata documentation including inheritance rules
  - [Metadata Overview](./metadata/README.md)
  - [Metadata Types](./metadata/metadata-types.md)
  - [Inheritance Rules](./metadata/inheritance-rules.md)
  - [Object Metadata](./metadata/object-metadata.md)
  - [Field Types](./metadata/field-types.md)
  - [Permissions](./metadata/permissions.md)
- **[ObjectQL](./objectql/)** - Object Query Language complete guide
  - [ObjectQL Overview](./objectql/README.md)
  - [Query Syntax](./objectql/query-syntax.md)
  - [Filter Operators](./objectql/filter-operators.md)
  - [Best Practices](./objectql/best-practices.md)
- **[Triggers](./triggers/)** - Trigger development guide
  - [Trigger Overview](./triggers/README.md)
  - [Trigger Types](./triggers/trigger-types.md)
  - [Trigger Context](./triggers/trigger-context.md)
- **[Object Service](./object-service.md)** - Object service architecture
- **[Environment Variables](./env.md)** - Environment variable configuration

## 🚀 Quick Start

### Option 1: Docker One-Click Start

```bash
docker run -d -p 80:80 steedos/steedos-community:3.0
```

Visit http://localhost

### Option 2: Create New Project

```bash
# Create project
npx create-steedos-app my-project

# Enter directory and install dependencies
cd my-project
yarn install

# Start service
yarn start
```

Visit http://localhost:5100

## 📖 Learning Path

### For Beginners
1. Read [README](../README.md) to understand project overview
2. Follow Quick Start to deploy your first application
3. Learn [Metadata Basics](./metadata/) to understand data models
4. Learn [ObjectQL](./objectql/) for data operations

### For Developers
1. Read [Core Architecture](./CORE_ARCHITECTURE_EN.md)
2. Follow [Developer Guide](./DEVELOPER_GUIDE.md) to set up development environment
3. Understand [Metadata System](./metadata/) and [Inheritance Rules](./metadata/inheritance-rules.md)
4. Learn [Trigger Development](./triggers/) for business logic
5. Master [ObjectQL Best Practices](./objectql/best-practices.md)
6. Browse [Packages Index](./PACKAGES_INDEX.md) to understand each module

### For Advanced Users
1. Deep dive into [Metadata Inheritance](./metadata/inheritance-rules.md) and override mechanisms
2. Customize [Triggers](./triggers/) and implement complex business logic
3. Optimize [ObjectQL Queries](./objectql/query-syntax.md) for performance
4. Integrate third-party systems and AI services

## 🔗 Resources

- **Official Website**: [www.steedos.com](https://www.steedos.com/)
- **Online Documentation**: [docs.steedos.com](https://docs.steedos.com/)
- **GitHub**: [github.com/steedos/steedos-platform](https://github.com/steedos/steedos-platform)
- **Example Projects**: [github.com/steedos/steedos-templates](https://github.com/steedos/steedos-templates)
- **Community**: [GitHub Discussions](https://github.com/steedos/steedos-platform/discussions)

## 📝 Documentation Structure

```
docs/
├── README.md                         # This document
├── CORE_ARCHITECTURE_EN.md           # Core architecture
├── DEVELOPER_GUIDE.md                # Developer guide
├── PACKAGES_INDEX.md                 # Packages and services index
├── QUICK_REFERENCE.md                # Quick reference
├── object-service.md                 # Object service documentation
├── env.md                            # Environment variables
├── metadata/                         # Metadata documentation (NEW)
│   ├── README.md                     # Metadata overview
│   ├── metadata-types.md             # Metadata types reference
│   ├── inheritance-rules.md          # Inheritance and override rules
│   ├── object-metadata.md            # Object metadata detailed guide
│   ├── field-types.md                # Field types complete reference
│   └── permissions.md                # Permissions configuration
├── objectql/                         # ObjectQL documentation (NEW)
│   ├── README.md                     # ObjectQL overview
│   ├── query-syntax.md               # Query syntax detailed guide
│   ├── filter-operators.md           # Filter operators reference
│   └── best-practices.md             # ObjectQL best practices
├── triggers/                         # Trigger documentation (NEW)
│   ├── README.md                     # Trigger overview
│   ├── trigger-types.md              # Trigger types and use cases
│   └── trigger-context.md            # Trigger context reference
├── cn/                               # Chinese documentation directory
├── diagrams/                         # Architecture diagrams
└── images/                           # Image resources
```

## 🤝 Contributing

We welcome contributions to documentation! If you find errors or areas for improvement:

1. Fork the project
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📮 Get Help

- **Bug Reports**: [GitHub Issues](https://github.com/steedos/steedos-platform/issues)
- **Feature Requests**: [GitHub Discussions](https://github.com/steedos/steedos-platform/discussions)
- **Technical Support**: See contact information on official website

---

**More Documentation**: Additional detailed documentation available at [www.steedos.cn/docs](https://www.steedos.cn/docs)  
**Documentation Version**: 3.0.12  
**Last Updated**: 2026-01-09