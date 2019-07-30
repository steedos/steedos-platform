---
title: 字段类型
---

Steedos支持以下基本字段类型。
- 文本(text)
- 多行文本(textarea)
- 日期(date) 
- 日期时间(datetime)
- 下拉(select): 界面生成下拉框，需配合options属性使用
- 布尔(boolean): 界面生成勾选框
- 数值(number): 只能输入数值内容，可以指定小数位数。
- 引用(lookup): 可以引用其他相关对象中的记录，联合reference_to字段，从关联表中选择记录。
- 网址(url): 在只读时， 点击会以窗口形式打开网址
- 邮件地址(email): 在只读时，点击会自动打开邮件客户端，并将字段值带入收件人中
- 主表/子表(master_detail): 主表子表字段类型是引用字段类型的一种扩展，将当前记录链接到主表成为子记录。


## 文本 text
```yaml
name:
  label: 问题标题
  type: text
  is_wide: true
  required: true
  searchable: true
  index: true
```
备注：
- 如果配置了多选(multiple)属性，自动升级为文本数组类型，以数组的形式保存在数据库中，用户界面上可以输入多个文本。
- 如果定义为文本且选择建立索引，则最多支持300个字符(不区分中英文)

## 多行文本 textarea
```yaml
description:
  label: 问题描述
  type: textarea
  is_wide: true
  rows: 4
```
参数rows代表编辑时文本框默认显示的行数。
多行文本类型不支持建立索引。
      
## 日期 date
日期类型的字段，用户输入时自动弹出日期选择框。
```yaml
deadline:
  label: '截止日期'
  type: 'date'
```
![日期类型字段](assets/field_date.png#bordered)

## 日期时间 datetime
日期时间类型的字段，用户输入时自动弹出日期时间选择框。
```yaml
starttime:
  label: '开始时间'
  type: 'datetime'
```
![日期时间类型字段](assets/field_datetime.png#bordered)

## 布尔 boolean
布尔类型的字段，界面生成勾选框。
```yaml
is_done:
  type: boolean
  label: 已完成
  defaultValue: false
```

## 数值 number
数值类型在界面上显示为数字输入框，并可配置显示的小数位数（默认为0）和数值最大长度（默认为18）。
```yaml
comment_count:
  label: 评论数
  type: number
  required: true
```

## 金额 currency
金额类型在界面上显示为数字输入框，并可配置显示的小数位数（默认为2）和数值最大长度（默认为18）。
```yaml
amount:
  label: 总金额
  type: currency
  required: true
```

## 网址 url
网址类型的字段编辑时可输入网址，在只读界面点击网址，弹出到对应的。
```yaml
website:
  type: "url"
  label: "网址"
```
      
## 邮件 email
邮件类型字段编辑时，字段内可输入邮件地址，系统会校验邮件格式是否合法。在只读界面，点击邮件会自动打开邮件客户端，进入写邮件界面。
```yaml
mail:
  type: "email"
  label: "邮件"
```

## 选择 select
选择类型的字段，用户输入时生成下拉框，需配合options属性使用。
```yaml
priority:
  type: select
  label: 优先级
  options: 高:high,中:normal,低:low
  defaultValue: normal
  filterable: true
```

### 可选项 options
可以用多种格式定义可选项(options)。
#### 完整格式
```yaml
  options:
    - label: 高
      value: high
    - label: 中
      value: normal
    - label: 低
      value: low
```
#### 简易格式 (区分显示值和储存值)
```yaml
  options: 高:high,中:normal,低:low
```
#### 简易格式 (不区分显示值和储存值)
```yaml
  options: high,normal,low
```

### 可选项脚本 optionsFunction
通过脚本生成可选项的内容

### 多选 multiple
如果使用Steedos标准MongoDB数据源，选择类型字段可以定义多选(multiple)属性，实现多选功能。
```yaml
tags:
  type: select
  label: 类别
  options: 客户,供应商,合作伙伴,其他
  filterable: true
  multiple: true
```
![select类型字段多选](assets/field_select_multiple.png#bordered)

### 数据存储格式
单选字段在数据库中保存为字符串，多选字段在MongoDB数据库中保存为数组。

#### 单选
```js
tags: "客户"
```
#### 多选
```js
tags: ["客户","合作伙伴"]
```
>因为数据格式不同，如果把一个字段的属性从单选改为多选，会造成已有记录的值丢失，需要执行脚本变更数据库。

## 引用 lookup
引用类型的字段，用户输入时生成下拉框，用户可以从相关表搜索并选中记录。引用类型的字段保存在数据库中的值是被选中记录的的id。当配置为多选时，可以一次选中多条记录。

例如可以为联系人表定义了一个单位字段，此字段在显示时从accounts表的数据中选择，并需符合条件 priority == "normal"。
```yaml
account_id:
  type:"lookup"
  label:"单位"
  reference_to:"accounts"
  filters: [["priority", "=", "normal"]]
```
![lookup类型字段](assets/field_lookup.png#bordered)

### 引用对象(reference_to)
编辑时，从关联表中选择记录，如果引用的对象上配置了enable_tree属性，则以tree形式列出关联表中记录供选择。

### 过滤器(filters)
在reference_to对象中筛选可选项时，指定[过滤条件](object_filter.md)，限定选择范围。

### 多选 multiple
如果使用Steedos标准MongoDB数据源，引用类型字段可以定义多选(multiple)属性，实现多选功能。
```yaml
contract_type:
  type: lookup
  label: 合同分类
  reference_to: contract_types
  required: true
  multiple: true
```
![lookup类型字段多选](assets/field_lookup_multiple.png#bordered)

多选字段在MongoDB数据库中保存为数组，值为选中记录的ID：
```js
contract_type: ["id-1111111","id-2222222"]
```

### 默认图标(defaultIcon)
下拉选项中显示的默认图标，如果配置了reference_to，则显示引用对象的图标

### 依赖字段(depend_on)
此字段的值需要依赖其他字段的值，当depend_on中的字段值发生变化时，会重新计算当前字段值/可选项。

## 主表/子表 master/detail
在引用字段的基础上，额外创建一个对象间的特殊父子关系，配置语法与lookup类型相同。当前表为子表，字段reference_to的表为主表。在显示主表记录时，系统会自动生成子表列表视图。

规则：
- 所有子表记录的关系字段必填。
- 子表记录的所有权和共享由主记录确定。
- 当用户删除主记录时，将删除所有子表记录。
- 您可以在主记录上创建累计汇总字段以汇总子表信息记录。
- 您最多可以有 3 个自定义子表等级。

例如，可以为联系人的表创建一个 master/detail 字段，指向单位表。点开单位记录时，可以查看此单位中的联系人清单。
```yaml
  account:
    label: 单位
    type: master_detail
    reference_to: accounts
    sortable: true
    name: account
    filterable: true
```
![master_detail类型字段多选](assets/field_master_detail_guide.png#bordered)

## 内嵌表格 grid
表格字段类型包含多个列字段，在界面上显示为一个表格。
- 列字段可以是任何基本的字段类型。
- 每个列字段显示为表格中的一列。
- 用户有了表格字段的填写权限，就可以增删改其中的行。
- 如果配置了某个列字段隐藏，表格中看不到此字段。
- 如果配置了某个列字段只读，表格中不可修改此字段。

表格字段配置步骤
- 新增一个字段，类型选择为表格
- 逐个新增除表格字段的其他类型字段的列字段，字段名规范："表格字段名.$.列字段名"

表格字段与子表不同，在数据库中不会生成一个新的表，而是作为一个对象数组字段保存在记录中。所以只适用于表格行数(小于100行)比较少的业务场景。

