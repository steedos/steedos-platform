---
title: 字段
---

字段用于定义业务对象的属性。包括前台用户的填写界面和后台数据库的保存格式。

Steedos支持以下字段类型。

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

![表单编辑效果](assets/field_guide.png)

例如以下例子定义了一个owner字段:

```yaml
owner:
  label: 责任人
  type: lookup
  reference_to: users
  defaultValue:
  required: true
  inlineHelpText: 请选择此任务的责任人，相关人员会收到待办提醒。
  is_wide: false
  searchable: true
  index: true
  omit: false
  hidden: false
```

## 字段基本属性

### 字段名 name

字段在数据库中保存的名称，区分大小写，建议全部使用小写字母。

当使用OData或GraphQL API查询和更新对象数据时，也使用字段名。

### 显示名 label

字段在最终用户界面上的显示名称。显示名称支持国际化，如果系统检测到i18n文件中包含 "{objectname}_{fieldname}"，以翻译为准。

### 默认值 defaultValue

设定字段的默认值，可以是固定值，也可以可配置默认值[公式](object_field_formula.md)，例如 {userId}, {spaceId} 等

```yaml
owner:
  defaultValue: {userId}
```

### 必填 required

设定当前字段必填，在新增和修改界面如果当前字段未填写则不能报错。当调用OData接口操作数据时，必填字段也必须传入。

### 帮助文本 inlineHelpText

可配置表单填写时显示的一段描述，帮助业务人员理解该字段的作用。

在表单填写时，在字段名右侧显示为一个Info图标，业务人员点击此图标可以看到帮助文本。

### 宽字段 is_wide

对于宽屏幕，Steedo显示表单时会显示为两列。宽字段始终占两列宽度，窄字段占一列宽度。

### 分组 group

在记录的显示页面和编辑页面，将字段分组显示。

group值相同的字段被分到同一组，分组标题为group的值，分组内的字段顺序为字段在表单上定义时的先后顺序。

### 多选 multiple

文本、选择类、lookup、master/detail 型字段添加此属性，可以实现多选功能，数据库中保存也是对应的数组类型。

### 可搜索 seachable

系统进行快捷搜索时，默认只搜索name字段的内容。如果配置了此属性，当用户在此对象中执行搜索时，会同时搜索此字段的内容。

注意，对lookup类型的字段如果配置了 searchable，不能同时搜索相关表中的name属性。

### 可排序 sortable

考虑到数据库的性能，只有设定了可排序的字段，在列表视图中才能按照此字段进行排序。
可排序字段系统会自动创建索引。默认为不可排序

### 索引 index

配置是否在数据库中为此字段创建索引，默认为不创建索引。对于大多数数据库引擎，索引字段配置的太多会导致数据库性能下降。

通常建议为以下类型的字段配置索引：

- 需要搜索的字段
- 在列表视图或报表中需要过滤的字段
- 相关表的字段

### 唯一 unique

为此字段创建唯一索引，字段值在数据库中不得重复。

### 只读 readonly

此字段只显示在查看页面或列表页面上，新增和修改页面都不显示。（此属性即将作废，不建议使用。）

### 隐藏 hidden

对于一些后台计算用的字段，可以设置为隐藏。隐藏字段在列表、查看、编辑、过滤界面等都不显示，但是可以通过脚本操作，也可以配置在过滤条件中。

### 编辑时忽略 omit

只是新建和编辑表单中不显示，列表、表单详细界面等可能显示。

### 标题字段 is_name

系统默认字段名为name的字段为标题字段，在列表显示时，标题字段会自动加上链接，点击进入记录查看界面。

如果当前表没有name字段，需要指定其他字段为标题字段，可以设置此属性。

### 禁用 disabled

在编辑时禁用此字段。（此属性即将作废，不建议使用。）

### 黑箱字段 blackbox

如果配置了此属性，Steedos在验证数据格式时，忽略此字段的内容。

### 值范围 allowedValues

使用数组格式定义此字段的的可选项范围。如果配置了此属性，不仅在表单上填写数据会校验，通过API接口操作数据，或是编写触发器操作数据时，也会做校验。

```yaml
priority:
  allowedValues:
    - high
    - normal
    - low
```

### 主键 primary

默认数据源使用mongodb数据库，默认使用_id作为主键。如使用第三方SQL数据源，需要手工指定主键字段。

## 基本类型字段

### 文本 text

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

### 多行文本 textarea

```yaml

description:
  label: 问题描述
  type: textarea
  is_wide: true
  rows: 4
```

参数rows代表编辑时文本框默认显示的行数。
多行文本类型不支持建立索引。

### 日期 date

日期类型的字段，用户输入时自动弹出日期选择框。

```yaml
deadline:
  label: '截止日期'
  type: 'date'
```

![日期类型字段](assets/field_date.png#bordered)

### 日期时间 datetime

日期时间类型的字段，用户输入时自动弹出日期时间选择框。

```yaml
starttime:
  label: '开始时间'
  type: 'datetime'
```

![日期时间类型字段](assets/field_datetime.png#bordered)

### 布尔 boolean

布尔类型的字段，界面生成勾选框。

```yaml
is_done:
  type: boolean
  label: 已完成
  defaultValue: false
```

### 数值 number

数值类型在界面上显示为数字输入框，并可使用scale属性来配置显示的小数位数（默认为0）

```yaml
comment_count:
  label: 评论数
  type: number
  scale: 2
  required: true
```

### 金额 currency

金额类型在界面上显示为数字输入框，并可使用scale属性来配置显示的小数位数（默认为2）

```yaml
amount:
  label: 总金额
  type: currency
  scale: 4
  required: true
```

### 网址 url

网址类型的字段编辑时可输入网址，在只读界面点击网址，弹出到对应的。

```yaml
website:
  type: "url"
  label: "网址"
```

### 邮件 email

邮件类型字段编辑时，字段内可输入邮件地址，系统会校验邮件格式是否合法。在只读界面，点击邮件会自动打开邮件客户端，进入写邮件界面。

```yaml
mail:
  type: "email"
  label: "邮件"
```

## 选择类型字段 select

选择类型的字段，用户输入时生成下拉框，需配合options属性使用。

```yaml
priority:
  type: select
  label: 优先级
  options: 高:high,中:normal,低:low
  defaultValue: normal
  filterable: true
```

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

通过脚本生成可选项的内容。函数需返回以下格式的数组：

```js
[{label: "Label A", value: "A", icon: "icon-a"}]
```

示例

```yaml
objects:
  label: 对象
  type: lookup
  required: true
  multiple: true
  optionsFunction: !!js/function |
    function () {
      var _options = [];
      _.forEach(Creator.objectsByName, function (o, object_name) {
        return _options.push({
          label: o.label,
          value: o.name,
          icon: o.icon
        });
      });

      return _options;
    }
  filterable: true
```

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

## 引用类型字段 lookup

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

## 主表/子表类型字段 master/detail

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

## 表格类型字段 grid

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

## 系统内置字段

如果使用Steedos默认数据源，每个Steedos对象都会自动创建一些系统字段。

### 所属工作区 space

Steedos可以分工作区保存用户数据，每个用户可以属于多个工作区。
space字段值在记录创建时生成，默认为当前选中的工作区。
当在视图中定义了 filter_scope: space 时，自动按照此字段过滤。

### 所属责任人 owner

owner字段用于保存当前记录的责任人，例如合同的经办人，客户的负责人等。
当在视图中定义了 filter_scope: mine 时，自动按照此字段过滤。
字段值记录创建时自动生成，默认为当前用户。如果需要让用户自主选择，可以在代码中增加配置。

```yaml
  owner: 
    label: 责任人
    omit: false
    hidden: false
```

### 主单位 company_id

Steedos可以控制单位级别权限，授权默写用户只能查看/修改本单位的数据。

company_id字段用于标记记录责任人的主单位，此字段不可由用户修改。系统自动获取所属单位的第一个为主单位。

### 所属单位 company_ids

company_id字段用于标记记录责任人的所属单位，默认为隐藏(hidden)自动赋值。
所属单位可以有多个，其中第一个所属单位会自动赋值为主单位。
如果需要由用户在界面上选择，可以增加如下配置覆盖此字段属性。

```yaml
  company_ids:
    label: 所属单位
    omit: false
    hidden: false
```

### 已锁定 locked

字段类型为布尔(boolean)，默认为隐藏(hidden)、编辑时忽略(omit)

- locked 状态下，普通用户记录不能修改/删除。
- locked 状态下，普通用户禁止上传/删除附件。
- locked 状态下，高级权限用户可以执行以上操作。（指定对象的“修改所有”对象级别权限）


### 创建日期 created

记录创建时生成，默认为当前时间

### 创建人 created_by

记录创建时生成，默认为当前用户

### 修改日期 modified

记录修改时生成，默认为当前时间

### 修改人 modified_by

记录修改时生成，默认为当前用户

### 已删除 is_deleted

当对象启用回收站功能时，删除记录只会将已删除标记为true，并不会真实的从数据库中删除对应的记录。此字段隐藏，界面上不可见。

### 删除日期 deleted

记录用户删除此记录的时间。

### 删除人 deleted_by

记录删除此记录的操作人员。

### 相关审批单 instances

当此记录从审批王归档来时，记录对应的申请单Id。
