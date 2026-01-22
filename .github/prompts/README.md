# Steedos AI Prompts Collection

<p align="center">
  <strong>Complete AI Prompts for Steedos Platform Development and Application Building</strong>
</p>

<p align="center">
  华炎魔方 AI 提示词完整集合 - 涵盖平台开发和应用构建
</p>

---

## ⚠️ Important: For Package Creation | 创建软件包必读

**If you want to create a Steedos package, use this file as context for AI:**

**如果要创建 Steedos 软件包,请将此文件作为 AI 的上下文:**

➡️ **`STEEDOS_PACKAGE_CONTEXT.md`** ⬅️

This concise file ensures AI assistants generate Node.js/JavaScript code (not Python) with proper Steedos package structure.

这个精简文件确保 AI 助手生成 Node.js/JavaScript 代码(而不是 Python),并使用正确的 Steedos 软件包结构。

---

## 📖 Overview | 概述

This repository contains comprehensive AI prompts designed to assist developers working with the Steedos Platform. The prompts are divided into two main categories:

本仓库包含为 Steedos 平台开发者设计的全面 AI 提示词集合。提示词分为两大类:

1. **Platform Development** - For core Steedos platform developers
2. **Customer Development** - For developers building applications on Steedos

## 📁 Structure | 结构

```
.github/prompts/
├── STEEDOS_PACKAGE_CONTEXT.md   # 🆕 Quick context for package creation
├── platform/          # Platform Development Prompts | 平台开发提示词
│   ├── 01-core-architecture.md      # Core architecture development
│   ├── 02-metadata-development.md   # Metadata & ObjectQL
│   ├── 03-microservices-development.md  # Microservices
│   └── 04-testing-quality.md        # Testing & QA
│
└── customer/          # Customer Development Prompts | 客户开发提示词
    ├── 01-general-development.md    # General guide (中英双语)
    ├── 02-objectql-modeling.md      # Data modeling
    ├── 03-business-logic.md         # Triggers & Actions
    ├── 04-ui-pages.md               # UI development with Amis
    └── 05-package-development.md    # Complete package creation (中英双语)

.cursorrules           # Root-level cursor rules for platform dev
```

## 🎯 For Platform Developers | 平台开发者

If you're working on the core Steedos platform:

如果你在开发 Steedos 平台核心代码:

### Quick Start

1. **Use `.cursorrules`** - The root-level file provides general platform development guidelines
2. **Refer to specific prompts**:
   - 🏗️ **Core Architecture** - For core packages and infrastructure
   - 📝 **Metadata Development** - For ObjectQL and metadata engine
   - 🔧 **Microservices** - For Moleculer service development
   - ✅ **Testing & QA** - For writing tests and ensuring quality

### When to Use Each Prompt

| Scenario | Use This Prompt |
|----------|----------------|
| Building core packages | Core Architecture |
| Creating object schemas | Metadata Development |
| Developing new services | Microservices Development |
| Writing tests | Testing & Quality |
| General platform work | .cursorrules |

### Technology Stack

- **Backend**: Node.js 22+, TypeScript, Moleculer
- **Databases**: MongoDB, PostgreSQL, MySQL
- **Frontend**: React, Amis
- **Testing**: Jest
- **Build**: Yarn 3.8.7, Lerna

## 🚀 For Application Developers | 应用开发者

If you're building applications using Steedos:

如果你在使用 Steedos 构建应用:

### Quick Start

1. **Start with General Development** - Read `customer/01-general-development.md` (bilingual)
2. **Follow the workflow**:
   - 📦 **Package Development** → Create complete packages (NEW!)
   - 📊 **Data Modeling** → Define objects with ObjectQL
   - 🔄 **Business Logic** → Add triggers and actions
   - 🎨 **UI Development** → Create pages with Amis

### Development Workflow

```
1. Define Data Models (ObjectQL)
   ↓
2. Add Business Logic (Triggers)
   ↓
3. Create Custom Actions (Buttons)
   ↓
4. Design UI (Amis Pages)
   ↓
5. Test and Deploy
```

### Common Use Cases

| What You Want to Do | Read This Prompt |
|---------------------|-----------------|
| Create complete package | Package Development (NEW!) |
| Create data models | ObjectQL Modeling |
| Validate data | Business Logic (Triggers) |
| Auto-fill fields | Business Logic (Triggers) |
| Add custom buttons | Business Logic (Actions) |
| Create dashboards | UI & Pages |
| Build forms | UI & Pages |

## 💡 How to Use These Prompts | 如何使用提示词

### With Cursor IDE

1. Create a `.cursorrules` file in your project root
2. Copy the relevant prompt content
3. Cursor will automatically use it as context

### With GitHub Copilot

1. Open the relevant prompt file
2. Reference it in comments:
   ```javascript
   // Following the Steedos ObjectQL modeling guide
   // Create a customer object with name, email, and phone
   ```

### With ChatGPT / Claude

1. Start your conversation by pasting the prompt
2. Then ask specific questions:
   ```
   [Paste the prompt first]
   
   Now, help me create a project management object with tasks and milestones.
   ```

## 📚 Prompt Content Summary | 提示词内容摘要

### Platform Development Prompts

#### 1. Core Architecture (`01-core-architecture.md`)
- Microservices patterns
- TypeScript best practices
- Performance optimization
- Security guidelines
- Testing requirements

#### 2. Metadata Development (`02-metadata-development.md`)
- ObjectQL schema design
- Field types and relationships
- Triggers and validations
- Permissions
- Complete examples

#### 3. Microservices Development (`03-microservices-development.md`)
- Moleculer service structure
- Actions and events
- Inter-service communication
- Error handling
- Caching strategies

#### 4. Testing & Quality (`04-testing-quality.md`)
- Unit testing with Jest
- Integration testing
- API testing
- E2E testing
- Coverage requirements

### Customer Development Prompts

#### 1. General Development (`01-general-development.md`)
- Platform overview (bilingual)
- Project structure
- Quick start guide
- Development workflow
- Best practices
- Common patterns

#### 2. ObjectQL Modeling (`02-objectql-modeling.md`)
- Field types reference
- Relationship patterns
- Indexing strategies
- Data validation
- Complete examples

#### 3. Business Logic (`03-business-logic.md`)
- Trigger lifecycle
- Validation patterns
- Auto-fill fields
- Sending notifications
- Custom actions
- Frontend interactions

#### 4. UI & Pages (`04-ui-pages.md`)
- Amis framework guide
- Component reference
- Layout patterns
- Data binding
- Charts and visualizations
- Responsive design

#### 5. Package Development (`05-package-development.md`) **NEW!**
- Complete package structure
- Step-by-step package creation
- Server-side validation in triggers
- Package configuration
- Testing and deployment
- Real-world example: Contract Management

## 🌟 Key Features | 核心特性

### ✅ Comprehensive Coverage
- Covers all aspects of Steedos development
- Both platform and application development

### 🌏 Bilingual Support
- Customer prompts in both Chinese and English
- Platform prompts in English

### 📖 Practical Examples
- Real-world code examples
- Complete implementations
- Common patterns

### 🎯 AI-Optimized
- Designed for AI assistants
- Clear structure and formatting
- Specific instructions

## 🤖 Using with AI Assistants | AI 辅助开发

### Quick Start for Package Creation | 快速创建软件包

**Problem**: AI generates Python code instead of Steedos package?  
**问题**: AI 生成了 Python 代码而不是 Steedos 软件包?

**Solution**: Use the specific context file!  
**解决方案**: 使用专用的上下文文件!

```
Step 1: Copy this file content to your conversation:
第一步: 将此文件内容复制到对话中:
➡️ .github/prompts/STEEDOS_PACKAGE_CONTEXT.md

Step 2: Then give your instruction:
第二步: 然后给出指令:

"使用 Steedos 平台(Node.js + JavaScript)创建合同管理软件包,
在服务端校验合同名称长度不能大于20个字符。
生成所有必需文件: package.json, package.service.js, 
contracts.object.yml, contracts.trigger.js"
```

### Example Prompts

#### For Data Modeling
```
Using the Steedos ObjectQL guide, create a customer management system 
with customers, contacts, and opportunities. Include proper relationships 
and validation rules.
```

#### For Business Logic
```
Following the Steedos trigger patterns, implement automatic order numbering 
in format ORD-YYYYMMDD-0001, and send email notifications when order 
status changes.
```

#### For UI Development
```
Using Amis framework, create a sales dashboard with revenue cards, 
trend charts, and a recent orders table. Make it responsive for mobile.
```

## 📖 Additional Resources | 其他资源

### Official Documentation
- 📘 [Steedos Docs](https://docs.steedos.com/)
- 🏠 [Website](https://www.steedos.com/)
- 💬 [Community Discussions](https://github.com/steedos/steedos-platform/discussions)

### Code Examples
- 📦 [Steedos Templates](https://github.com/steedos/steedos-templates)
- 🔧 [Services Directory](../../../services/)
- 📝 [Developer Guide](../../../docs/DEVELOPER_GUIDE.md)

## 🤝 Contributing | 贡献

We welcome contributions to improve these prompts!

欢迎贡献改进这些提示词!

### How to Contribute

1. **Report Issues**: If you find errors or unclear instructions
2. **Suggest Improvements**: Share better examples or explanations
3. **Add New Prompts**: Contribute prompts for new scenarios
4. **Translate**: Help with translations

### Guidelines

- Keep prompts clear and actionable
- Include practical examples
- Follow the existing structure
- Test prompts with AI assistants

## 📄 License

These prompts are part of the Steedos Platform project and follow the same MIT license.

## 📧 Contact | 联系我们

- GitHub Issues: [Report Issues](https://github.com/steedos/steedos-platform/issues)
- Discussions: [Join Discussions](https://github.com/steedos/steedos-platform/discussions)
- Website: [www.steedos.com](https://www.steedos.com)

---

<p align="center">
  <strong>Happy Coding with Steedos and AI! 🚀</strong><br>
  <em>用 AI 加速你的 Steedos 开发! 🚀</em>
</p>
