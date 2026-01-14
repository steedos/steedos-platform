# 对象元数据详细说明

## 概述

对象 (Object) 是 Steedos 平台的核心概念，代表一个业务实体，如客户、订单、产品等。每个对象都有完整的元数据定义，包括字段、视图、权限等。

## 对象文件结构

### 基本文件结构

```
objects/
└── object_name/
    ├── object_name.object.yml        # 对象主定义文件
    ├── fields/                       # 字段定义目录（可选）
    │   ├── field1.field.yml
    │   └── field2.field.yml
    ├── buttons/                      # 按钮定义目录（可选）
    │   └── custom_button.button.yml
    ├── actions/                      # 操作定义目录（可选）
    │   └── custom_action.action.js
    └── listviews/                    # 列表视图目录（可选）
        └── custom_view.listview.yml
```

### 简化结构

所有定义也可以放在一个文件中：

```yaml
# objects/object_name.object.yml
name: object_name
label: 对象标签
fields:
  field1: {...}
  field2: {...}
list_views:
  view1: {...}
  view2: {...}
actions:
  action1: {...}
```

## 对象主要属性

### 基本属性

```yaml
name: object_name              # API 名称（必填）
label: 对象显示名称             # 显示名称（必填）
icon: account                  # 图标名称
description: 对象描述          # 描述
table_name: custom_table       # 数据库表名（可选）
datasource: default            # 数据源名称（可选）
```

### 功能开关

```yaml
enable_search: true            # 启用全局搜索
enable_files: true             # 启用附件
enable_tasks: true             # 启用任务
enable_notes: true             # 启用备注
enable_events: true            # 启用事件
enable_api: true              # 启用 API 访问
enable_share: true            # 启用共享
enable_chatter: true          # 启用协作
enable_audit: true            # 启用字段历史跟踪
enable_trash: true            # 启用回收站
enable_space_global: false    # 是否为工作区全局对象
enable_enhanced_lookup: true  # 启用增强查找
enable_inline_edit: true      # 启用行内编辑
enable_instances: false       # 启用审批实例
enable_workflow: false        # 启用工作流
```

### 界面配置

```yaml
is_view: false                # 是否为视图对象
sidebar: null                 # 侧边栏配置
calendar: null                # 日历视图配置
enable_tree: false            # 启用树形视图
parent_field: null            # 父字段（树形视图）
children_field: null          # 子字段（树形视图）
```

### 版本和其他

```yaml
version: 2                    # 对象版本号
idFieldName: _id             # ID 字段名
is_enable: true              # 是否启用
in_development: false        # 是否处于开发中
```

## 字段定义

### 在对象文件中定义字段

```yaml
name: custom_object
label: 自定义对象
fields:
  # 文本字段
  name:
    type: text
    label: 名称
    required: true
    searchable: true
  
  # 数字字段
  amount:
    type: currency
    label: 金额
    scale: 2
  
  # 关系字段
  account:
    type: lookup
    label: 客户
    reference_to: accounts
    required: true
  
  # 选择字段
  status:
    type: select
    label: 状态
    options:
      - label: 草稿
        value: draft
      - label: 已提交
        value: submitted
    defaultValue: draft
```

### 独立字段文件

```yaml
# objects/custom_object/fields/priority.field.yml
name: priority
type: select
label: 优先级
options:
  - label: 高
    value: high
  - label: 中
    value: medium
  - label: 低
    value: low
defaultValue: medium
```

## 列表视图定义

### 基本列表视图

```yaml
list_views:
  all:
    label: 所有记录
    columns:                    # 显示的列
      - name
      - status
      - owner
      - created
    filter_scope: space        # 过滤范围：space, mine, queue
    filters: []                # 过滤条件
    sort: [["created", "desc"]] # 排序规则
    
  my_records:
    label: 我的记录
    columns:
      - name
      - status
      - modified
    filter_scope: mine
    filters: []
    
  high_priority:
    label: 高优先级
    columns:
      - name
      - priority
      - due_date
    filter_scope: space
    filters: [["priority", "=", "high"]]
    sort: [["due_date", "asc"]]
```

### 列表视图属性

| 属性 | 类型 | 说明 |
|------|------|------|
| label | String | 视图名称 |
| columns | Array | 显示的字段列表 |
| filter_scope | String | 过滤范围：space/mine/queue |
| filters | Array | 过滤条件，使用 ObjectQL 语法 |
| sort | Array | 排序规则 |
| type | String | 视图类型：grid/kanban/calendar |
| mobile_columns | Array | 移动端显示列 |
| extra_columns | Array | 额外的查询字段 |
| options | Object | 其他选项 |

## 权限配置

### 对象级权限

```yaml
permission_set:
  user:
    allowCreate: true         # 允许创建
    allowRead: true          # 允许读取
    allowEdit: true          # 允许编辑
    allowDelete: false       # 允许删除
    viewAllRecords: false    # 查看所有记录
    modifyAllRecords: false  # 修改所有记录
  
  admin:
    allowCreate: true
    allowRead: true
    allowEdit: true
    allowDelete: true
    viewAllRecords: true
    modifyAllRecords: true
```

### 字段级权限

在独立的权限集文件中定义：

```yaml
# permissionsets/sales_user.permissionset.yml
name: sales_user
label: 销售用户
field_permissions:
  custom_object.amount:
    readable: true
    editable: false
  custom_object.status:
    readable: true
    editable: true
```

## 触发器

### 对象触发器

```javascript
// triggers/custom_object.trigger.js
module.exports = {
  listenTo: 'custom_object',
  
  // 插入前触发
  beforeInsert: async function() {
    const { doc } = this;
    
    // 自动生成编号
    if (!doc.code) {
      doc.code = await generateCode('CO');
    }
    
    // 数据验证
    if (doc.amount < 0) {
      throw new Error('金额不能为负数');
    }
  },
  
  // 插入后触发
  afterInsert: async function() {
    const { doc, id } = this;
    
    // 发送通知
    await sendNotification({
      to: doc.owner,
      message: `新记录已创建: ${doc.name}`
    });
  },
  
  // 更新前触发
  beforeUpdate: async function() {
    const { doc, previousDoc } = this;
    
    // 状态变更验证
    if (doc.status !== previousDoc.status) {
      validateStatusChange(previousDoc.status, doc.status);
    }
  },
  
  // 更新后触发
  afterUpdate: async function() {
    const { doc, previousDoc, id } = this;
    
    // 同步相关数据
    if (doc.account !== previousDoc.account) {
      await syncRelatedRecords(id);
    }
  },
  
  // 删除前触发
  beforeDelete: async function() {
    const { id, previousDoc } = this;
    
    // 检查关联记录
    const relatedCount = await checkRelatedRecords(id);
    if (relatedCount > 0) {
      throw new Error('存在关联记录，无法删除');
    }
  },
  
  // 删除后触发
  afterDelete: async function() {
    const { previousDoc } = this;
    
    // 清理相关数据
    await cleanupRelatedData(previousDoc);
  }
};
```

## 自定义操作

### 记录操作

```yaml
# objects/custom_object/actions/approve.action.yml
name: approve
label: 批准
visible: true
on: record
todo: script
script: |-
  async function approve() {
    const recordId = this.record._id;
    await this.object.update(recordId, {
      status: 'approved',
      approved_by: this.userId,
      approved_at: new Date()
    });
    toastr.success('已批准');
  }
  approve();
```

### 列表操作

```yaml
# objects/custom_object/actions/batch_update.action.yml
name: batch_update
label: 批量更新
visible: true
on: list_item
todo: script
script: |-
  async function batchUpdate() {
    const selectedRecords = this.selectedRecords;
    for (const record of selectedRecords) {
      await this.object.update(record._id, {
        status: 'updated'
      });
    }
    toastr.success('批量更新完成');
  }
  batchUpdate();
```

## 自定义按钮

```yaml
# objects/custom_object/buttons/export.button.yml
name: export
label: 导出
is_enable: true
visible: true
on: list
todo: script
script: |-
  async function exportData() {
    const filters = this.filters;
    const records = await this.object.find({ filters });
    // 导出逻辑
    downloadCSV(records);
  }
  exportData();
```

## 关联关系

### Lookup 关系

```yaml
fields:
  account:
    type: lookup
    label: 客户
    reference_to: accounts
    required: true
  
  contacts:
    type: lookup
    label: 联系人
    reference_to: contacts
    multiple: true
    filters: [['account', '=', '{account}']]
```

### Master-Detail 关系

```yaml
fields:
  order:
    type: master_detail
    label: 订单
    reference_to: sales_orders
    required: true
```

### 查找过滤器

```yaml
fields:
  product:
    type: lookup
    label: 产品
    reference_to: products
    filters: [['category', '=', '{category}']]
    depend_on:
      - category
```

## 汇总字段

```yaml
fields:
  # 在主对象中定义汇总字段
  total_orders:
    type: summary
    label: 订单总数
    summary_object: sales_orders
    summary_type: count
    filters: [['account', '=', '{_id}']]
  
  total_revenue:
    type: summary
    label: 总收入
    summary_object: sales_orders
    summary_type: sum
    summary_field: amount
    filters: [
      ['account', '=', '{_id}'],
      ['status', '=', 'completed']
    ]
```

## 公式字段

```yaml
fields:
  # 文本公式
  full_name:
    type: formula
    label: 全名
    formula: "first_name + ' ' + last_name"
    data_type: text
  
  # 数值公式
  total_amount:
    type: formula
    label: 总金额
    formula: "quantity * unit_price * (1 - discount / 100)"
    data_type: currency
    scale: 2
  
  # 日期公式
  days_overdue:
    type: formula
    label: 逾期天数
    formula: "DATEDIF(due_date, TODAY(), 'D')"
    data_type: number
```

## 数据验证规则

```yaml
# 通过触发器实现
# triggers/custom_object_validation.trigger.js
module.exports = {
  listenTo: 'custom_object',
  
  beforeInsert: async function() {
    const { doc } = this;
    
    // 验证规则 1：金额范围
    if (doc.amount < 0 || doc.amount > 1000000) {
      throw new Error('金额必须在 0 到 1,000,000 之间');
    }
    
    // 验证规则 2：日期逻辑
    if (doc.end_date < doc.start_date) {
      throw new Error('结束日期不能早于开始日期');
    }
    
    // 验证规则 3：必填条件
    if (doc.status === 'approved' && !doc.approved_by) {
      throw new Error('批准状态必须指定批准人');
    }
  },
  
  beforeUpdate: async function() {
    // 更新时的验证规则
  }
};
```

## 对象继承

### 扩展标准对象

```yaml
# 基础包中的 accounts.object.yml
name: accounts
label: 客户
fields:
  name:
    type: text
    label: 名称
  phone:
    type: text
    label: 电话
```

```yaml
# 扩展包中的 accounts.object.yml
name: accounts
fields:
  # 添加新字段
  industry:
    type: select
    label: 行业
    options:
      - label: IT
        value: it
      - label: 制造
        value: manufacturing
  
  # 修改已有字段
  phone:
    required: true
    label: 联系电话
```

## 完整示例

```yaml
name: sales_order
label: 销售订单
icon: orders
description: 管理销售订单
enable_search: true
enable_files: true
enable_tasks: true
enable_api: true
enable_audit: true
version: 2

fields:
  # 自动编号
  order_number:
    type: autonumber
    label: 订单号
    formula: "SO-{YYYY}{MM}{DD}-{0000}"
    readonly: true
  
  # 查找关系
  account:
    type: lookup
    label: 客户
    reference_to: accounts
    required: true
  
  contact:
    type: lookup
    label: 联系人
    reference_to: contacts
    filters: [['account', '=', '{account}']]
    depend_on:
      - account
  
  # 日期
  order_date:
    type: date
    label: 订单日期
    required: true
    defaultValue: "{now}"
  
  # 选择
  status:
    type: select
    label: 状态
    options:
      - label: 草稿
        value: draft
      - label: 已提交
        value: submitted
      - label: 已批准
        value: approved
      - label: 已完成
        value: completed
    defaultValue: draft
  
  # 子表
  order_items:
    type: grid
    label: 订单明细
    is_wide: true
  
  # 货币
  subtotal:
    type: currency
    label: 小计
    scale: 2
  
  tax:
    type: currency
    label: 税额
    scale: 2
  
  # 公式
  total_amount:
    type: formula
    label: 总金额
    formula: "subtotal + tax"
    data_type: currency
    scale: 2

list_views:
  all:
    label: 所有订单
    columns:
      - order_number
      - account
      - order_date
      - status
      - total_amount
      - owner
    filter_scope: space
    filters: []
    sort: [["order_date", "desc"]]
  
  pending:
    label: 待处理
    columns:
      - order_number
      - account
      - order_date
      - total_amount
    filter_scope: space
    filters: [["status", "in", ["draft", "submitted"]]]
    sort: [["order_date", "asc"]]

permission_set:
  user:
    allowCreate: true
    allowRead: true
    allowEdit: true
    allowDelete: false
    viewAllRecords: false
    modifyAllRecords: false
  
  admin:
    allowCreate: true
    allowRead: true
    allowEdit: true
    allowDelete: true
    viewAllRecords: true
    modifyAllRecords: true
```

## 相关文档

- [元数据概述](./README.md)
- [字段类型参考](./field-types.md)
- [元数据继承规则](./inheritance-rules.md)
- [触发器开发](../triggers/)
- [ObjectQL 查询](../objectql/)
