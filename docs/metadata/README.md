# Steedos Platform 元数据文档

## 概述 (Overview)

元数据 (Metadata) 是 Steedos 平台的核心概念，用于定义业务对象、字段、权限、界面布局等。通过元数据配置，您可以快速构建企业应用，无需编写大量代码。

## 什么是元数据？

在 Steedos 平台中，元数据是描述应用程序结构和行为的配置文件。这些配置文件以 YAML 或 JavaScript 格式存储，包括：

- **对象定义** (Objects) - 定义业务实体及其字段
- **字段定义** (Fields) - 定义对象的属性和数据类型
- **应用定义** (Applications) - 定义应用及其包含的对象
- **页面布局** (Layouts) - 定义界面的显示方式
- **权限集** (Permission Sets) - 定义用户权限
- **标签页** (Tabs) - 定义导航标签
- **触发器** (Triggers) - 定义业务逻辑

## 元数据类型

### 核心元数据类型

| 类型 | 文件扩展名 | 说明 | 文档链接 |
|------|-----------|------|---------|
| Object | `.object.yml` | 对象定义 | [详细说明](./object-metadata.md) |
| Field | 在 object 文件中定义 | 字段定义 | [字段类型](./field-types.md) |
| Application | `.app.yml` | 应用定义 | - |
| Layout | `.layout.yml` | 页面布局 | - |
| Permission Set | `.permissionset.yml` | 权限集 | [权限说明](./permissions.md) |
| Tab | `.tab.yml` | 标签页 | - |
| Trigger | `.trigger.js` | 触发器 | [触发器文档](../triggers/) |

## 元数据继承和覆盖

Steedos 平台支持元数据的继承和覆盖机制，允许在不同的软件包中扩展和定制元数据。详细说明请参阅：

- [元数据继承规则](./inheritance-rules.md)

## 元数据文件位置

元数据文件通常位于软件包的特定目录结构中：

```
your-package/
└── main/
    └── default/
        ├── objects/           # 对象定义
        │   └── accounts/
        │       └── accounts.object.yml
        ├── applications/      # 应用定义
        │   └── app.app.yml
        ├── layouts/          # 页面布局
        │   └── layout.layout.yml
        ├── permissionsets/   # 权限集
        │   └── admin.permissionset.yml
        ├── tabs/             # 标签页
        │   └── tab.tab.yml
        └── triggers/         # 触发器
            └── trigger.trigger.js
```

## 元数据加载过程

1. **扫描阶段** - 系统启动时扫描所有软件包中的元数据文件
2. **解析阶段** - 解析 YAML/JS 文件，验证语法
3. **合并阶段** - 根据依赖关系和继承规则合并元数据
4. **生效阶段** - 生成运行时对象和服务

## 元数据开发工具

### VSCode 扩展

使用 `Steedos Extension Pack` VSCode 扩展可以：
- 语法高亮和自动补全
- 元数据同步 (retrieve/deploy)
- 实时验证

### CLI 工具

```bash
# 导出元数据
steedos source:retrieve

# 部署元数据
steedos source:deploy

# 验证元数据
steedos source:validate
```

## 快速开始

### 创建一个简单的对象

```yaml
# objects/custom_product.object.yml
name: custom_product
label: 产品
icon: product
fields:
  name:
    type: text
    label: 产品名称
    required: true
  price:
    type: currency
    label: 价格
  description:
    type: textarea
    label: 描述
```

### 创建一个应用

```yaml
# applications/sales.app.yml
name: sales
label: 销售管理
icon: apps
objects:
  - custom_product
  - accounts
  - contacts
```

## 相关文档

- [对象元数据详细说明](./object-metadata.md)
- [字段类型完整参考](./field-types.md)
- [元数据继承规则](./inheritance-rules.md)
- [权限配置](./permissions.md)
- [ObjectQL 查询语言](../objectql/)
- [触发器开发](../triggers/)

## 最佳实践

1. **使用描述性名称** - 对象和字段名称应该清晰表达其用途
2. **合理组织目录** - 按功能模块组织元数据文件
3. **版本控制** - 使用 Git 管理元数据变更
4. **文档注释** - 在元数据文件中添加必要的注释
5. **遵循命名规范** - 使用统一的命名约定

## 参考资源

- [开发者指南](../DEVELOPER_GUIDE.md)
- [核心架构](../CORE_ARCHITECTURE_EN.md)
- [包和服务索引](../PACKAGES_INDEX.md)
