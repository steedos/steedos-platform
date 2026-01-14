# 字段类型完整参考

## 概述

Steedos 平台支持丰富的字段类型，用于定义对象的属性和数据结构。每种字段类型都有特定的用途和配置选项。

## 基础字段类型

### text (文本)

单行文本字段，用于存储短文本。

**属性**:
```yaml
field_name:
  type: text
  label: 字段标签
  required: false          # 是否必填
  searchable: true         # 是否可搜索
  defaultValue: ""         # 默认值
  maxlength: 255          # 最大长度
  is_wide: false          # 是否宽字段
  readonly: false         # 是否只读
  hidden: false           # 是否隐藏
```

**示例**:
```yaml
name:
  type: text
  label: 名称
  required: true
  searchable: true
  maxlength: 100
```

### textarea (多行文本)

多行文本字段，用于存储较长的文本内容。

**属性**:
```yaml
field_name:
  type: textarea
  label: 字段标签
  required: false
  rows: 3               # 显示行数
  is_wide: true         # 默认宽字段
```

**示例**:
```yaml
description:
  type: textarea
  label: 描述
  rows: 5
  is_wide: true
```

### html (富文本)

HTML 富文本编辑器字段。

**属性**:
```yaml
field_name:
  type: html
  label: 字段标签
  required: false
  is_wide: true
```

**示例**:
```yaml
content:
  type: html
  label: 内容
  is_wide: true
```

## 数值字段类型

### number (数字)

数值字段，支持整数和小数。

**属性**:
```yaml
field_name:
  type: number
  label: 字段标签
  required: false
  scale: 2              # 小数位数
  precision: 18         # 总位数
  min: 0               # 最小值
  max: 999999          # 最大值
  defaultValue: 0
```

**示例**:
```yaml
quantity:
  type: number
  label: 数量
  scale: 0
  min: 0
  defaultValue: 1

score:
  type: number
  label: 评分
  scale: 2
  min: 0
  max: 100
```

### currency (货币)

货币字段，带有货币符号。

**属性**:
```yaml
field_name:
  type: currency
  label: 字段标签
  required: false
  scale: 2              # 小数位数，默认 2
  precision: 18         # 总位数
  defaultValue: 0
```

**示例**:
```yaml
amount:
  type: currency
  label: 金额
  scale: 2
  defaultValue: 0

total:
  type: currency
  label: 总计
  scale: 2
  summary_type: sum    # 汇总类型
```

### percent (百分比)

百分比字段。

**属性**:
```yaml
field_name:
  type: percent
  label: 字段标签
  required: false
  scale: 2
  min: 0
  max: 100
```

**示例**:
```yaml
discount:
  type: percent
  label: 折扣
  scale: 2
  min: 0
  max: 100
```

## 日期时间字段类型

### date (日期)

日期字段，只包含日期不包含时间。

**属性**:
```yaml
field_name:
  type: date
  label: 字段标签
  required: false
  defaultValue: null    # 可以是日期字符串或特殊值如 "now"
```

**示例**:
```yaml
birth_date:
  type: date
  label: 出生日期

contract_date:
  type: date
  label: 合同日期
  required: true
```

### datetime (日期时间)

日期时间字段，包含日期和时间。

**属性**:
```yaml
field_name:
  type: datetime
  label: 字段标签
  required: false
  defaultValue: null
```

**示例**:
```yaml
meeting_time:
  type: datetime
  label: 会议时间
  required: true

last_contact:
  type: datetime
  label: 最后联系时间
```

### time (时间)

时间字段，只包含时间不包含日期。

**属性**:
```yaml
field_name:
  type: time
  label: 字段标签
  required: false
```

**示例**:
```yaml
start_time:
  type: time
  label: 开始时间
```

## 选择字段类型

### boolean (布尔)

布尔字段，true/false 值。

**属性**:
```yaml
field_name:
  type: boolean
  label: 字段标签
  required: false
  defaultValue: false
```

**示例**:
```yaml
is_active:
  type: boolean
  label: 是否启用
  defaultValue: true

is_vip:
  type: boolean
  label: VIP客户
  defaultValue: false
```

### select (下拉选择)

单选下拉字段。

**属性**:
```yaml
field_name:
  type: select
  label: 字段标签
  required: false
  options:              # 选项列表
    - label: 显示文本
      value: 值
  defaultValue: null
  multiple: false      # 是否多选
```

**示例**:
```yaml
status:
  type: select
  label: 状态
  options:
    - label: 草稿
      value: draft
    - label: 进行中
      value: in_progress
    - label: 已完成
      value: completed
    - label: 已取消
      value: cancelled
  defaultValue: draft
  required: true

tags:
  type: select
  label: 标签
  multiple: true       # 多选
  options:
    - label: 重要
      value: important
    - label: 紧急
      value: urgent
    - label: 待处理
      value: pending
```

### picklist (选择列表)

与 select 类似，但使用不同的 UI 控件。

**示例**:
```yaml
category:
  type: picklist
  label: 类别
  options:
    - label: 类别A
      value: a
    - label: 类别B
      value: b
```

## 关系字段类型

### lookup (查找关系)

查找关系字段，关联到另一个对象。

**属性**:
```yaml
field_name:
  type: lookup
  label: 字段标签
  required: false
  reference_to: target_object    # 目标对象名称
  reference_to_field: _id       # 目标字段，默认 _id
  multiple: false               # 是否多选
  filters: []                   # 过滤条件
  depend_on: []                # 依赖字段
```

**示例**:
```yaml
account:
  type: lookup
  label: 客户
  reference_to: accounts
  required: true

owner:
  type: lookup
  label: 负责人
  reference_to: users
  defaultValue: "{userId}"

contacts:
  type: lookup
  label: 联系人
  reference_to: contacts
  multiple: true
  filters: [['account', '=', '{account}']]
```

### master_detail (主从关系)

主从关系字段，比 lookup 更紧密的关联关系。

**特点**:
- 从记录必须有主记录
- 删除主记录时级联删除从记录
- 从记录继承主记录的共享设置

**属性**:
```yaml
field_name:
  type: master_detail
  label: 字段标签
  required: true        # 必填
  reference_to: target_object
```

**示例**:
```yaml
order:
  type: master_detail
  label: 订单
  reference_to: sales_orders
  required: true
```

## 特殊字段类型

### autonumber (自动编号)

自动编号字段，按规则自动生成唯一编号。

**属性**:
```yaml
field_name:
  type: autonumber
  label: 字段标签
  formula: "PRE-{0000}"    # 编号格式
  readonly: true
```

**示例**:
```yaml
order_number:
  type: autonumber
  label: 订单号
  formula: "SO-{YYYY}{MM}{DD}-{0000}"

contract_no:
  type: autonumber
  label: 合同编号
  formula: "CT-{0000}"
```

### formula (公式)

公式字段，根据其他字段自动计算。

**属性**:
```yaml
field_name:
  type: formula
  label: 字段标签
  formula: "field1 + field2"     # 公式表达式
  data_type: number              # 返回值类型
  scale: 2                       # 数值精度
```

**示例**:
```yaml
total_amount:
  type: formula
  label: 总金额
  formula: "quantity * unit_price"
  data_type: currency
  scale: 2

full_name:
  type: formula
  label: 全名
  formula: "first_name + ' ' + last_name"
  data_type: text

age:
  type: formula
  label: 年龄
  formula: "YEAR(TODAY()) - YEAR(birth_date)"
  data_type: number
```

### summary (汇总)

汇总字段，汇总相关对象的数据。

**属性**:
```yaml
field_name:
  type: summary
  label: 字段标签
  summary_object: related_object   # 相关对象
  summary_type: count              # 汇总类型
  summary_field: field_name        # 汇总字段
  filters: []                      # 过滤条件
```

**汇总类型**:
- `count` - 计数
- `sum` - 求和
- `min` - 最小值
- `max` - 最大值
- `avg` - 平均值

**示例**:
```yaml
order_count:
  type: summary
  label: 订单数量
  summary_object: sales_orders
  summary_type: count

total_revenue:
  type: summary
  label: 总收入
  summary_object: sales_orders
  summary_type: sum
  summary_field: amount
  filters: [['status', '=', 'completed']]
```

### grid (子表)

子表字段，在主表中嵌入子表。

**属性**:
```yaml
field_name:
  type: grid
  label: 字段标签
  is_wide: true
```

**示例**:
```yaml
order_items:
  type: grid
  label: 订单明细
  is_wide: true
```

## 文件字段类型

### file (文件)

文件上传字段。

**属性**:
```yaml
field_name:
  type: file
  label: 字段标签
  multiple: false      # 是否支持多文件
```

**示例**:
```yaml
attachment:
  type: file
  label: 附件
  multiple: true

contract:
  type: file
  label: 合同文件
  multiple: false
```

### image (图片)

图片上传字段。

**属性**:
```yaml
field_name:
  type: image
  label: 字段标签
  multiple: false
```

**示例**:
```yaml
avatar:
  type: image
  label: 头像
  multiple: false

photos:
  type: image
  label: 照片
  multiple: true
```

## 地址和位置字段

### url (URL)

URL 地址字段。

**属性**:
```yaml
field_name:
  type: url
  label: 字段标签
  required: false
```

**示例**:
```yaml
website:
  type: url
  label: 网站
```

### email (邮箱)

邮箱地址字段，自动验证格式。

**属性**:
```yaml
field_name:
  type: email
  label: 字段标签
  required: false
  multiple: false     # 是否支持多个邮箱
```

**示例**:
```yaml
email:
  type: email
  label: 邮箱地址
  required: true

cc_emails:
  type: email
  label: 抄送邮箱
  multiple: true
```

### location (地理位置)

地理位置字段，存储经纬度。

**属性**:
```yaml
field_name:
  type: location
  label: 字段标签
```

**示例**:
```yaml
office_location:
  type: location
  label: 办公地点
```

## 系统字段

以下字段由系统自动维护，不需要在元数据中定义：

| 字段名 | 类型 | 说明 |
|--------|------|------|
| _id | String | 记录唯一标识符 |
| name | Text | 记录名称（主字段） |
| owner | Lookup | 记录所有者 |
| space | String | 工作区 |
| created | Datetime | 创建时间 |
| created_by | Lookup | 创建人 |
| modified | Datetime | 修改时间 |
| modified_by | Lookup | 修改人 |
| locked | Boolean | 是否锁定 |
| company_id | String | 分部 ID |
| company_ids | Array | 所属分部列表 |

## 字段通用属性

所有字段类型都支持以下通用属性：

```yaml
field_name:
  type: field_type
  label: 字段标签          # 显示名称
  name: field_name         # API 名称
  required: false         # 是否必填
  readonly: false         # 是否只读
  hidden: false           # 是否隐藏
  omit: false            # 是否排除
  visible_on: null       # 字段可见性控制表达式
  group: "分组名"          # 字段分组
  sortable: true         # 是否可排序
  searchable: true       # 是否可搜索
  filterable: true       # 是否可过滤
  inlineHelpText: ""     # 帮助文本
  description: ""        # 字段描述
  defaultValue: null     # 默认值
```

### 字段可见性控制

字段的显示和隐藏主要通过 `visible_on` 属性控制：

```yaml
# 始终显示字段
field_name:
  type: text
  label: 字段名
  visible_on: '{{true}}'

# 条件显示字段（根据其他字段值）
conditional_field:
  type: text
  label: 条件字段
  visible_on: '{{formData.status === "active"}}'

# 隐藏字段
hidden_field:
  type: text
  label: 隐藏字段
  visible_on: '{{false}}'
```

**重要**: 如果需要将隐藏的字段调整为显示状态，应添加 `visible_on: '{{true}}'`，除非已有其他 `visible_on` 配置。

## 字段命名规范

1. **使用小写字母和下划线**
   - 正确: `customer_name`, `order_date`
   - 错误: `CustomerName`, `orderDate`

2. **避免使用保留字**
   - 不要使用: `id`, `name`, `owner`, `created` 等系统字段名

3. **使用描述性名称**
   - 正确: `annual_revenue`, `contact_phone`
   - 错误: `ar`, `cp`

4. **保持一致性**
   - 统一使用 `_date` 或 `_time` 后缀表示日期时间字段
   - 统一使用 `is_` 前缀表示布尔字段

## 字段最佳实践

1. **合理设置必填字段**
   - 只将真正必须的字段设为 required
   - 考虑用户体验，避免过多必填字段

2. **使用合适的字段类型**
   - 根据数据特点选择最合适的类型
   - 邮箱使用 email 类型而不是 text

3. **设置合理的默认值**
   - 为常用字段设置合理的默认值
   - 减少用户输入工作量

4. **使用公式字段减少冗余**
   - 可以计算的字段使用 formula
   - 保持数据一致性

5. **合理使用关系字段**
   - lookup 用于松散关联
   - master_detail 用于紧密关联

## 相关文档

- [对象元数据](./object-metadata.md)
- [元数据类型](./metadata-types.md)
- [元数据继承规则](./inheritance-rules.md)
- [ObjectQL 查询](../objectql/)
