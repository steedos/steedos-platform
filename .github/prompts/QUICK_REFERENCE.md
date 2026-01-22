# Steedos AI Prompts - Quick Reference

快速参考指南 | Quick Reference Guide

## 📋 Prompt Index | 提示词索引

### For Platform Developers | 平台开发者

| File | Purpose | Use When |
|------|---------|----------|
| `.cursorrules` | General platform dev rules | Starting any platform work |
| `platform/01-core-architecture.md` | Core system development | Building packages, infrastructure |
| `platform/02-metadata-development.md` | ObjectQL & metadata | Creating object schemas, metadata engine |
| `platform/03-microservices-development.md` | Moleculer services | Developing services, actions, events |
| `platform/04-testing-quality.md` | Testing & QA | Writing tests, ensuring quality |

### For Application Developers | 应用开发者

| File | Purpose | Use When |
|------|---------|----------|
| `customer/01-general-development.md` | Platform overview & workflow | Starting a new project |
| `customer/02-objectql-modeling.md` | Data modeling | Designing database schema |
| `customer/03-business-logic.md` | Triggers & Actions | Adding validation, automation |
| `customer/04-ui-pages.md` | UI with Amis | Creating dashboards, forms |
| `customer/05-package-development.md` | Complete package creation | Building reusable packages (NEW!) |

## 🎯 Quick Decision Tree | 快速决策树

```
Are you working on Steedos platform core?
你是在开发 Steedos 平台核心吗?
├─ Yes → Use Platform Prompts (.github/prompts/platform/)
│   ├─ Building core packages? → 01-core-architecture.md
│   ├─ Working on metadata? → 02-metadata-development.md
│   ├─ Developing services? → 03-microservices-development.md
│   └─ Writing tests? → 04-testing-quality.md
│
└─ No (Building applications) → Use Customer Prompts (.github/prompts/customer/)
    ├─ Just starting? → 01-general-development.md
    ├─ Creating a complete package? → 05-package-development.md (NEW!)
    ├─ Designing data models? → 02-objectql-modeling.md
    ├─ Adding business logic? → 03-business-logic.md
    └─ Creating UI? → 04-ui-pages.md
```

## 💡 Common Scenarios | 常见场景

### Scenario 0: Creating a Complete Package (NEW!)
场景 0: 创建完整的软件包 (新增!)

**Prompt to Use**: `customer/05-package-development.md`

**Ask AI**:
```
Following the Steedos package development guide, create a contract management package with:
- Contract object with name, type, customer, amount, dates
- Server-side validation: contract name length cannot exceed 20 characters
- Trigger with beforeInsert and beforeUpdate validation
- Custom actions for submit and sign
- Complete package structure with package.json and package.service.js

按照 Steedos 软件包开发指南,创建合同管理软件包:
- 合同对象,包含名称、类型、客户、金额、日期等字段
- 服务端校验: 合同名称长度不能大于20个字符
- 触发器实现 beforeInsert 和 beforeUpdate 验证
- 自定义动作用于提交和签署
- 完整的软件包结构,包含 package.json 和 package.service.js
```

### Scenario 1: Creating a New Business Object
场景 1: 创建新的业务对象

**Prompt to Use**: `customer/02-objectql-modeling.md`

**Ask AI**:
```
Using the Steedos ObjectQL guide, create a customer object with:
- Basic fields: name, email, phone
- Select field for industry
- Lookup to users for account manager
- Proper indexes and validation
```

### Scenario 2: Adding Data Validation
场景 2: 添加数据验证

**Prompt to Use**: `customer/03-business-logic.md`

**Ask AI**:
```
Following the Steedos trigger patterns, add validation to orders:
- Order amount must be positive
- Delivery date must be in the future
- Check customer credit limit
```

### Scenario 3: Building a Dashboard
场景 3: 构建仪表盘

**Prompt to Use**: `customer/04-ui-pages.md`

**Ask AI**:
```
Using Amis framework, create a sales dashboard with:
- Revenue card showing monthly total
- Line chart for sales trend
- Table of recent orders
- Make it responsive
```

### Scenario 4: Developing a Microservice
场景 4: 开发微服务

**Prompt to Use**: `platform/03-microservices-development.md`

**Ask AI**:
```
Create a Moleculer service for order processing with:
- Action to validate inventory
- Event handler for order.created
- Proper error handling
- Integration tests
```

## 🔧 AI Assistant Integration | AI 助手集成

### Cursor IDE

1. Copy the relevant prompt to `.cursorrules` in your project
2. Cursor will automatically use it as context
3. Start coding - AI will follow the patterns

### GitHub Copilot

```javascript
// Following the Steedos ObjectQL modeling guide
// Create a project management object with:
// - name (required)
// - status (select: planning, active, completed)
// - manager (lookup to users)
// - start_date and end_date
```

### ChatGPT / Claude

```
[Paste the entire prompt first]

Now, help me implement a customer management system with 
the following requirements:
- Track customers and contacts
- Manage opportunities and quotes
- Send email notifications
- Generate sales reports
```

## 📊 Prompt Content Summary | 内容摘要

### Platform Prompts (English)

| Prompt | Lines | Topics Covered |
|--------|-------|----------------|
| Core Architecture | 230 | TypeScript, microservices, security, performance |
| Metadata Development | 543 | ObjectQL, fields, relationships, permissions |
| Microservices | 651 | Moleculer, actions, events, testing |
| Testing & QA | 710 | Jest, integration tests, E2E, coverage |

### Customer Prompts (Bilingual 中英双语)

| Prompt | Lines | Topics Covered |
|--------|-------|----------------|
| General Development | 561 | Overview, workflow, best practices |
| ObjectQL Modeling | 765 | Field types, relationships, validation |
| Business Logic | 711 | Triggers, actions, notifications |
| UI & Pages | 672 | Amis, components, charts, layouts |
| Package Development | 850 | Complete package creation, validation (NEW!) |

## 📚 Learning Path | 学习路径

### For New Developers | 新手开发者

1. **Week 1**: Read `customer/01-general-development.md`
   - Understand platform concepts
   - Set up development environment
   - Create first object

2. **Week 2**: Study `customer/05-package-development.md` (NEW!)
   - Learn complete package structure
   - Create your first package
   - Implement server-side validation

3. **Week 3**: Study `customer/02-objectql-modeling.md`
   - Learn all field types
   - Practice relationships
   - Design your data model

4. **Week 4**: Master `customer/03-business-logic.md`
   - Implement triggers
   - Create custom actions
   - Add validations

5. **Week 5**: Explore `customer/04-ui-pages.md`
   - Build dashboards
   - Create forms
   - Design user interfaces

### For Platform Contributors | 平台贡献者

1. Start with `.cursorrules` for general guidelines
2. Deep dive into specific areas based on your contribution:
   - Core packages → `platform/01-core-architecture.md`
   - Metadata engine → `platform/02-metadata-development.md`
   - Services → `platform/03-microservices-development.md`
   - Testing → `platform/04-testing-quality.md`

## 🌟 Tips for Best Results | 最佳实践建议

1. **Be Specific**: The more specific your question, the better the AI response
   具体明确: 问题越具体,AI 回答越准确

2. **Provide Context**: Reference the prompt and your specific requirements
   提供上下文: 引用提示词并说明具体需求

3. **Iterate**: Start simple, then add complexity
   迭代改进: 从简单开始,逐步增加复杂度

4. **Validate**: Always review and test AI-generated code
   验证确认: 始终审查和测试 AI 生成的代码

5. **Learn Patterns**: Study the examples to understand best practices
   学习模式: 研究示例以理解最佳实践

## 🔗 Related Resources | 相关资源

- **Main README**: `.github/prompts/README.md`
- **Developer Guide**: `/docs/DEVELOPER_GUIDE.md`
- **Official Docs**: https://docs.steedos.com/
- **Examples**: https://github.com/steedos/steedos-templates
- **Community**: https://github.com/steedos/steedos-platform/discussions

---

**Happy Coding! 快乐编码! 🚀**
