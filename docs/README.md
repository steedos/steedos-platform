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
- **[ObjectQL](./objectql.md)** - Object Query Language detailed documentation
- **[Object Service](./object-service.md)** - Object service architecture
- **[Trigger](./trigger.md)** - Trigger usage guide
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
pnpm create steedos-app my-project

# Enter directory and install dependencies
cd my-project
pnpm install

# Start service
pnpm start
```

Visit http://localhost:5100

## 📖 Learning Path

### For Beginners
1. Read [README](../README.md) to understand project overview
2. Follow Quick Start to deploy your first application
3. Learn [ObjectQL](./objectql.md) for data operations

### For Developers
1. Read [Core Architecture](./CORE_ARCHITECTURE_EN.md)
2. Follow [Developer Guide](./DEVELOPER_GUIDE.md) to set up development environment
3. Browse [Packages Index](./PACKAGES_INDEX.md) to understand each module

### For Advanced Users
1. Deep dive into microservices architecture and extension mechanisms
2. Customize triggers and business logic
3. Integrate third-party systems and AI services

## 🔗 Resources

- **Official Website**: [www.steedos.com](https://www.steedos.com/)
- **Online Documentation**: [docs.steedos.com](https://docs.steedos.com/)
- **GitHub**: [github.com/steedos/steedos-platform](https://github.com/steedos/steedos-platform)
- **Example Projects**: [github.com/steedos/steedos-templates](https://github.com/steedos/steedos-templates)
- **Community**: [GitHub Discussions](https://github.com/steedos/steedos-platform/discussions)

## 📝 Documentation Structure

```
docs/
├── README.md                    # This document
├── CORE_ARCHITECTURE_EN.md      # Core architecture
├── DEVELOPER_GUIDE.md           # Developer guide
├── PACKAGES_INDEX.md            # Packages and services index
├── QUICK_REFERENCE.md           # Quick reference
├── objectql.md                  # ObjectQL documentation
├── object-service.md            # Object service documentation
├── trigger.md                   # Trigger documentation
├── env.md                       # Environment variables
├── cn/                          # Chinese documentation directory
└── images/                      # Image resources
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
