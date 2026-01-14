# 元数据类型详细说明

## Objects (对象)

对象是 Steedos 平台中的核心概念，代表一个业务实体（如客户、订单、产品等）。

### 文件格式

```yaml
# objects/object_name.object.yml
name: object_name
label: 对象标签
icon: account
description: 对象描述
enable_search: true
enable_files: true
enable_tasks: true
enable_notes: true
enable_api: true
enable_share: true
enable_audit: true
version: 2
```

### 主要属性

| 属性 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name | String | 是 | 对象API名称，唯一标识符 |
| label | String | 是 | 对象显示名称 |
| icon | String | 否 | 对象图标 |
| description | String | 否 | 对象描述 |
| enable_search | Boolean | 否 | 是否启用搜索，默认 false |
| enable_files | Boolean | 否 | 是否启用附件，默认 false |
| enable_tasks | Boolean | 否 | 是否启用任务，默认 false |
| enable_notes | Boolean | 否 | 是否启用备注，默认 false |
| enable_api | Boolean | 否 | 是否启用API，默认 true |
| enable_share | Boolean | 否 | 是否启用共享，默认 false |
| enable_audit | Boolean | 否 | 是否启用审计，默认 false |
| enable_enhanced_lookup | Boolean | 否 | 是否启用增强查找，默认 false |
| version | Number | 否 | 版本号，默认 2 |

### 对象示例

```yaml
name: sales_order
label: 销售订单
icon: orders
description: 管理销售订单信息
enable_search: true
enable_files: true
enable_tasks: true
enable_api: true
enable_share: true
enable_audit: true
version: 2
fields:
  order_number:
    type: autonumber
    label: 订单号
    formula: "SO-{0000}"
  customer:
    type: lookup
    label: 客户
    reference_to: accounts
    required: true
  total_amount:
    type: currency
    label: 总金额
    summary_type: sum
  status:
    type: select
    label: 状态
    options:
      - label: 草稿
        value: draft
      - label: 已提交
        value: submitted
      - label: 已完成
        value: completed
    default_value: draft
list_views:
  all:
    label: 所有订单
    columns: [order_number, customer, total_amount, status, created]
    filter_scope: space
    filters: []
  my_orders:
    label: 我的订单
    columns: [order_number, customer, total_amount, status, created]
    filter_scope: mine
    filters: []
```

## Applications (应用)

应用是对象的集合，用于组织相关的业务功能。

### 文件格式

```yaml
# applications/app_name.app.yml
_id: app_name
name: 应用名称
description: 应用描述
icon: apps
is_creator: true
visible: true
sort: 100
objects:
  - object1
  - object2
```

### 主要属性

| 属性 | 类型 | 必填 | 说明 |
|------|------|------|------|
| _id | String | 是 | 应用唯一标识符 |
| name | String | 是 | 应用名称 |
| description | String | 否 | 应用描述 |
| icon | String | 否 | 应用图标 |
| is_creator | Boolean | 否 | 是否显示在创建菜单，默认 false |
| visible | Boolean | 否 | 是否可见，默认 true |
| sort | Number | 否 | 排序号 |
| objects | Array | 否 | 包含的对象列表 |

### 应用示例

```yaml
_id: sales
name: 销售管理
description: 完整的销售管理解决方案
icon: apps
is_creator: true
visible: true
sort: 100
objects:
  - accounts
  - contacts
  - sales_order
  - products
```

## Layouts (页面布局)

页面布局定义对象详情页面的显示方式。

### 文件格式

```yaml
# layouts/object_layout.layout.yml
name: layout_name
object_name: object_name
profiles:
  - user
  - admin
sections:
  - label: 基本信息
    columns: 2
    fields:
      - field1
      - field2
```

### 主要属性

| 属性 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name | String | 是 | 布局名称 |
| object_name | String | 是 | 关联的对象名称 |
| profiles | Array | 否 | 适用的配置文件 |
| sections | Array | 是 | 页面区块定义 |

### 布局示例

```yaml
name: sales_order_default
object_name: sales_order
profiles:
  - user
  - admin
sections:
  - label: 基本信息
    columns: 2
    fields:
      - order_number
      - customer
      - order_date
      - status
  - label: 金额信息
    columns: 2
    fields:
      - subtotal
      - tax
      - total_amount
  - label: 订单明细
    columns: 1
    fields:
      - order_items
```

## Permission Sets (权限集)

权限集定义用户对对象和字段的访问权限。

### 文件格式

```yaml
# permissionsets/permissionset_name.permissionset.yml
name: permissionset_name
label: 权限集标签
license: platform
object_permissions:
  object_name:
    allowCreate: true
    allowDelete: false
    allowEdit: true
    allowRead: true
    modifyAllRecords: false
    viewAllRecords: false
field_permissions:
  object_name.field_name:
    readable: true
    editable: false
```

### 主要属性

| 属性 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name | String | 是 | 权限集名称 |
| label | String | 是 | 权限集标签 |
| license | String | 否 | 许可证类型 |
| object_permissions | Object | 否 | 对象权限配置 |
| field_permissions | Object | 否 | 字段权限配置 |

### 权限示例

```yaml
name: sales_manager
label: 销售经理
license: platform
object_permissions:
  sales_order:
    allowCreate: true
    allowDelete: false
    allowEdit: true
    allowRead: true
    modifyAllRecords: true
    viewAllRecords: true
  accounts:
    allowCreate: true
    allowDelete: false
    allowEdit: true
    allowRead: true
    modifyAllRecords: false
    viewAllRecords: true
field_permissions:
  sales_order.total_amount:
    readable: true
    editable: false
  sales_order.discount:
    readable: true
    editable: true
```

## Tabs (标签页)

标签页定义导航栏中的标签。

### 文件格式

```yaml
# tabs/tab_name.tab.yml
name: tab_name
label: 标签名称
icon: custom1
type: object
object: object_name
sort: 100
```

### 主要属性

| 属性 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name | String | 是 | 标签名称 |
| label | String | 是 | 标签显示名称 |
| icon | String | 否 | 标签图标 |
| type | String | 是 | 标签类型 (object/url/page) |
| object | String | 否 | 关联对象（type=object时） |
| url | String | 否 | URL地址（type=url时） |
| sort | Number | 否 | 排序号 |

## Triggers (触发器)

触发器定义在记录操作前后执行的业务逻辑。

### 文件格式

```javascript
// triggers/object_trigger.trigger.js
module.exports = {
  listenTo: 'object_name',
  
  beforeInsert: async function() {
    const { doc } = this;
    // 插入前逻辑
  },
  
  afterInsert: async function() {
    const { doc, id } = this;
    // 插入后逻辑
  },
  
  beforeUpdate: async function() {
    const { doc, previousDoc } = this;
    // 更新前逻辑
  },
  
  afterUpdate: async function() {
    const { doc, previousDoc, id } = this;
    // 更新后逻辑
  },
  
  beforeDelete: async function() {
    const { previousDoc, id } = this;
    // 删除前逻辑
  },
  
  afterDelete: async function() {
    const { previousDoc, id } = this;
    // 删除后逻辑
  }
};
```

详细说明请参阅 [触发器文档](../triggers/)。

## 元数据文件命名规范

| 元数据类型 | 文件命名规范 | 示例 |
|-----------|-------------|------|
| Object | `{object_name}.object.yml` | `accounts.object.yml` |
| Application | `{app_name}.app.yml` | `sales.app.yml` |
| Layout | `{layout_name}.layout.yml` | `account_default.layout.yml` |
| Permission Set | `{permissionset_name}.permissionset.yml` | `admin.permissionset.yml` |
| Tab | `{tab_name}.tab.yml` | `accounts_tab.tab.yml` |
| Trigger | `{trigger_name}.trigger.js` | `account_validation.trigger.js` |

## 元数据加载顺序

系统按以下顺序加载元数据：

1. **Objects** - 对象定义
2. **Fields** - 字段定义
3. **Applications** - 应用定义
4. **Tabs** - 标签页定义
5. **Layouts** - 页面布局
6. **Permission Sets** - 权限集
7. **Triggers** - 触发器

## 相关文档

- [对象元数据详细说明](./object-metadata.md)
- [字段类型完整参考](./field-types.md)
- [元数据继承规则](./inheritance-rules.md)
- [权限配置](./permissions.md)
