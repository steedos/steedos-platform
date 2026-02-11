---
name: objectql-modeling
description: "Steedos 数据建模 - ObjectQL 开发指南 / ObjectQL Data Modeling Guide"
---

# Steedos 数据建模 - ObjectQL 开发指南 / ObjectQL Data Modeling Guide

[中文指南 | Chinese Guide Below]

## Role | 角色
You are a data architect using Steedos ObjectQL to design enterprise data models. You understand database design, relationships, and business requirements.

你是使用 Steedos ObjectQL 设计企业数据模型的数据架构师。你理解数据库设计、关系模型和业务需求。

---

## 中文指南

### ObjectQL 简介

ObjectQL 是 Steedos 的核心数据定义语言,类似于:
- Salesforce 的对象模型
- 传统数据库的 DDL
- GraphQL 的 Schema

通过 ObjectQL 定义的数据模型会自动:
- 创建数据库表
- 生成 CRUD API (REST + GraphQL)
- 生成标准 UI 界面
- 支持权限控制

### 字段类型完整指南

#### 1. 文本类型

```yaml
# 短文本 (适用于:姓名、标题、编号)
name:
  type: text
  label: 姓名
  maxlength: 100
  searchable: true    # 支持全文检索
  index: true         # 创建索引
  
# 长文本 (适用于:备注、描述)
description:
  type: textarea
  label: 描述
  rows: 4
  
# 富文本 (适用于:文章内容、公告)
content:
  type: html
  label: 内容
  
# URL
website:
  type: url
  label: 网站
  
# Email
email:
  type: email
  label: 邮箱
  unique: true
```

#### 2. 数值类型

```yaml
# 整数
quantity:
  type: number
  label: 数量
  scale: 0           # 小数位数为0
  min: 0             # 最小值
  max: 9999          # 最大值
  
# 小数
price:
  type: number
  label: 价格
  scale: 2           # 保留2位小数
  
# 货币
amount:
  type: currency
  label: 金额
  scale: 2
  
# 百分比
discount_rate:
  type: percent
  label: 折扣率
  scale: 2
```

#### 3. 日期时间类型

```yaml
# 日期
birth_date:
  type: date
  label: 出生日期
  
# 日期时间
created_at:
  type: datetime
  label: 创建时间
  defaultValue: '{now}'   # 默认当前时间
  readonly: true
  
# 时间
work_time:
  type: time
  label: 工作时间
```

#### 4. 选择类型

```yaml
# 单选 - 方式1(数组格式)
status:
  type: select
  label: 状态
  options:
    - label: 草稿
      value: draft
    - label: 已发布
      value: published
    - label: 已归档
      value: archived
  default_value: draft
  
# 单选 - 方式2(字符串格式,简洁)
priority:
  type: select
  label: 优先级
  options: 低:low,中:medium,高:high,紧急:urgent
  default_value: medium
  
# 多选
tags:
  type: select
  label: 标签
  multiple: true
  options: 技术:tech,销售:sales,市场:marketing,财务:finance
```

#### 5. 布尔类型

```yaml
is_active:
  type: boolean
  label: 是否启用
  default_value: true
  
# 复选框(单个)
agree_terms:
  type: checkbox
  label: 同意服务条款
```

#### 6. 关系类型

```yaml
# 查找关系 (多对一)
# 示例:多个任务属于同一个用户
assigned_user:
  type: lookup
  label: 指派用户
  reference_to: users          # 关联到 users 对象
  optionsFunction: !!js/function |
    function() {
      return Creator.getSelectOptions('users');
    }
  
# 主从关系 (父子关系,级联删除)
# 示例:订单明细属于订单,删除订单时明细也删除
order:
  type: master_detail
  label: 订单
  reference_to: orders
  required: true
  
# 多对多关系 (通过中间对象实现)
# 示例:学生选课
# 需要创建中间对象 student_courses
student:
  type: master_detail
  reference_to: students
course:
  type: master_detail
  reference_to: courses
```

#### 7. 特殊类型

```yaml
# 文件上传
attachment:
  type: file
  label: 附件
  
# 图片上传
avatar:
  type: image
  label: 头像
  
# 自动编号
serial_number:
  type: autonumber
  label: 流水号
  formula: 'ORD-{0000}'
  
# 公式字段 (只读,计算得出)
total_amount:
  type: formula
  label: 总金额
  formula: !!js/function |
    function() {
      return (this.quantity || 0) * (this.price || 0);
    }
  data_type: number
  scale: 2
  
# 汇总字段 (统计子记录)
total_items:
  type: summary
  label: 订单项总数
  summary_object: order_items    # 子对象
  summary_type: count            # count, sum, avg, min, max
  summary_field: order           # 关联字段
  
# 定位
location:
  type: geolocation
  label: 位置
  
# 密码 (加密存储)
password:
  type: password
  label: 密码
  
# JSON 对象
metadata:
  type: object
  label: 元数据
  blackbox: true
```

### 关系设计模式

#### 1. 一对多 (Lookup)

**场景**: 多个任务属于一个项目

```yaml
# projects.object.yml
name: projects
label: 项目

# tasks.object.yml  
name: tasks
label: 任务
fields:
  project:
    type: lookup
    label: 项目
    reference_to: projects
    
  # 在 projects 对象中可以看到相关任务
  # 通过 related list 自动显示
```

#### 2. 主从关系 (Master-Detail)

**场景**: 订单和订单明细

```yaml
# orders.object.yml
name: orders
label: 订单
fields:
  order_number:
    type: text
    label: 订单号

# order_items.object.yml
name: order_items
label: 订单明细
fields:
  order:
    type: master_detail         # 主从关系
    label: 订单
    reference_to: orders
    required: true              # 必须关联父记录
  
  product:
    type: lookup
    label: 产品
    reference_to: products
  
  quantity:
    type: number
    label: 数量
    scale: 0
  
  unit_price:
    type: currency
    label: 单价

# 在父对象中添加汇总
# orders.object.yml 添加:
fields:
  total_items:
    type: summary
    summary_object: order_items
    summary_type: count
    summary_field: order
  
  total_amount:
    type: summary
    summary_object: order_items
    summary_type: sum
    summary_field: subtotal      # 假设 order_items 有 subtotal 字段
```

#### 3. 多对多关系

**场景**: 学生选课

```yaml
# students.object.yml
name: students
label: 学生

# courses.object.yml
name: courses
label: 课程

# student_courses.object.yml (中间表)
name: student_courses
label: 选课记录
fields:
  student:
    type: master_detail
    label: 学生
    reference_to: students
    required: true
  
  course:
    type: master_detail
    label: 课程
    reference_to: courses
    required: true
  
  score:
    type: number
    label: 成绩
    scale: 1
  
  semester:
    type: text
    label: 学期
```

#### 4. 层次关系 (自关联)

**场景**: 部门树形结构

```yaml
name: departments
label: 部门
fields:
  name:
    type: text
    label: 部门名称
    required: true
  
  parent:
    type: lookup
    label: 上级部门
    reference_to: departments    # 自关联
    
  level:
    type: number
    label: 层级
    scale: 0
```

### 索引和性能优化

```yaml
fields:
  # 1. 单字段索引
  email:
    type: email
    label: 邮箱
    index: true        # 创建索引
    unique: true       # 唯一索引
  
  # 2. 经常用于查询的字段添加索引
  status:
    type: select
    label: 状态
    options: active:活跃,inactive:停用
    index: true
  
  created_date:
    type: datetime
    label: 创建日期
    index: true        # 方便按日期查询
```

### 数据验证

#### 在对象定义中验证

```yaml
fields:
  age:
    type: number
    label: 年龄
    scale: 0
    min: 0
    max: 150
  
  phone:
    type: text
    label: 电话
    pattern: '^1[3-9]\d{9}$'    # 正则验证
    error_message: '请输入有效的手机号码'
```

#### 在触发器中验证

```javascript
// objects/users/users.trigger.js
module.exports = {
  listenTo: 'users',
  
  beforeInsert: async function() {
    const { doc } = this;
    
    // 验证邮箱唯一性
    const existing = await this.getObject('users').findOne({
      filters: [['email', '=', doc.email]]
    });
    
    if (existing) {
      throw new Error('该邮箱已被注册');
    }
    
    // 验证年龄范围
    if (doc.age && (doc.age < 18 || doc.age > 65)) {
      throw new Error('年龄必须在 18-65 之间');
    }
  }
};
```

### 默认值和自动填充

```yaml
fields:
  # 静态默认值
  status:
    type: select
    label: 状态
    options: draft:草稿,published:已发布
    default_value: draft
  
  # 动态默认值
  created_date:
    type: datetime
    label: 创建日期
    defaultValue: '{now}'    # 当前时间
  
  created_by:
    type: lookup
    label: 创建人
    reference_to: users
    defaultValue: '{userId}'  # 当前用户
  
  # 在触发器中自动填充
  # 见 trigger 示例
```

### 字段级权限

```yaml
fields:
  salary:
    type: currency
    label: 薪资
    # 字段权限设置
    
permission_set:
  user:
    allowRead: true
    allowEdit: true
    modifyAllRecords: false
    field_permissions:
      salary:
        readable: false    # 普通用户不可见
        editable: false
  
  hr:
    allowRead: true
    allowEdit: true
    field_permissions:
      salary:
        readable: true     # HR 可见
        editable: true     # HR 可编辑
```

### 完整示例: CRM 客户对象

```yaml
name: customers
label: 客户
icon: account
enable_search: true
enable_files: true
enable_api: true
version: 2

fields:
  # 基本信息
  name:
    type: text
    label: 客户名称
    required: true
    searchable: true
    index: true
    sort_no: 100
  
  code:
    type: text
    label: 客户编号
    unique: true
    index: true
    sort_no: 110
  
  type:
    type: select
    label: 客户类型
    options: 个人:individual,企业:company
    default_value: company
    sort_no: 120
  
  industry:
    type: select
    label: 行业
    options: 制造业:manufacturing,IT:it,金融:finance,教育:education
    sort_no: 130
  
  # 联系信息
  phone:
    type: text
    label: 电话
    sort_no: 200
  
  email:
    type: email
    label: 邮箱
    sort_no: 210
  
  website:
    type: url
    label: 网站
    sort_no: 220
  
  # 地址
  address:
    type: textarea
    label: 地址
    rows: 3
    sort_no: 300
  
  # 业务信息
  status:
    type: select
    label: 状态
    options: 潜在客户:lead,正式客户:customer,流失:lost
    default_value: lead
    index: true
    sort_no: 400
  
  rating:
    type: select
    label: 评级
    options: A:a,B:b,C:c
    sort_no: 410
  
  assigned_to:
    type: lookup
    label: 负责人
    reference_to: users
    sort_no: 420
  
  # 财务信息
  credit_limit:
    type: currency
    label: 信用额度
    scale: 2
    sort_no: 500
  
  total_purchases:
    type: summary
    label: 累计采购额
    summary_object: orders
    summary_type: sum
    summary_field: total_amount
    sort_no: 510
  
  # 系统字段
  created:
    omit: true
  created_by:
    omit: true
  modified:
    omit: true
  modified_by:
    omit: true

# 列表视图
list_views:
  all:
    label: 所有客户
    columns:
      - name
      - code
      - type
      - status
      - assigned_to
      - phone
    filter_fields:
      - status
      - type
      - industry
    sort:
      - field_name: created
        order: desc
  
  my_customers:
    label: 我的客户
    filters: [["assigned_to", "=", "{userId}"]]
    columns:
      - name
      - status
      - phone
      - email
  
  hot_leads:
    label: 热门线索
    filters: 
      - ["status", "=", "lead"]
      - ["rating", "=", "a"]
    columns:
      - name
      - phone
      - assigned_to

# 权限
permission_set:
  user:
    allowCreate: true
    allowDelete: false
    allowEdit: true
    allowRead: true
    modifyAllRecords: false
    viewAllRecords: false
  
  admin:
    allowCreate: true
    allowDelete: true
    allowEdit: true
    allowRead: true
    modifyAllRecords: true
    viewAllRecords: true
```

---

## English Guide

### ObjectQL Overview

ObjectQL is Steedos's core data definition language. Data models defined through ObjectQL automatically:
- Create database tables
- Generate CRUD APIs (REST + GraphQL)
- Generate standard UI
- Support permission control

### Field Types Reference

#### Text Types
- `text`: Short text
- `textarea`: Long text
- `html`: Rich text
- `url`: URL
- `email`: Email

#### Numeric Types
- `number`: Number (with scale for decimals)
- `currency`: Currency
- `percent`: Percentage

#### Date/Time Types
- `date`: Date only
- `datetime`: Date and time
- `time`: Time only

#### Selection Types
- `select`: Single/multiple choice
- `boolean`: True/false
- `checkbox`: Checkbox

#### Relationship Types
- `lookup`: Many-to-one
- `master_detail`: Parent-child (cascade delete)

#### Special Types
- `file`: File upload
- `image`: Image upload
- `formula`: Calculated field
- `summary`: Rollup summary
- `autonumber`: Auto-number

### Relationship Patterns

1. **One-to-Many**: Use `lookup`
2. **Master-Detail**: Use `master_detail`
3. **Many-to-Many**: Create junction object
4. **Hierarchical**: Self-referencing `lookup`

### Best Practices

1. **Naming**: Use `snake_case` for field names
2. **Indexing**: Add indexes to frequently queried fields
3. **Validation**: Implement in both metadata and triggers
4. **Performance**: Use summary fields instead of counting in code
5. **Security**: Set appropriate field-level permissions

### Resources

- ObjectQL Spec: `/docs/objectql.md`
- Example Objects: `services/*/main/default/objects/`

---

## AI 提示词建议 | AI Prompt Suggestions

### 中文提示词

- "设计一个电商订单管理系统的数据模型,包括订单、订单明细、产品、客户等对象"
- "为客户对象添加汇总字段,统计该客户的总订单金额和订单数量"
- "创建一个项目管理对象,支持任务分配、进度跟踪和时间记录"
- "设计一个多对多关系,让学生可以选择多门课程,课程也可以有多个学生"

### English Prompts

- "Design a data model for an e-commerce order management system with orders, order items, products, and customers"
- "Add rollup summary fields to the customer object to calculate total order amount and count"
- "Create a project management object with task assignment, progress tracking, and time logging"
- "Design a many-to-many relationship allowing students to enroll in multiple courses"

Remember: Good data modeling is the foundation of a successful application. Plan your relationships carefully!
