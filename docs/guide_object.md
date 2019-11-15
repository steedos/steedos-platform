---
title: 配置业务对象
---

模板项目内置了几个 [业务对象](object.md) 描述文件，以 .object.yml 结尾。

Steedos 的神奇之处正在于此，你只需要修改业务对象配置文件并重新启动服务，整个系统的功能都会自动随之变化。

如果你不需要相关的业务对象，直接删除即可。

## accounts.object.yml

```yaml
name: accounts
label: 单位
icon: account
enable_files: true
enable_search: true
enable_tasks: true
enable_notes: false
enable_api: true
enable_share: true
enable_chatter: true
fields:
  name:
    label: 名称
    type: text
    defaultValue: ''
    description: ''
    inlineHelpText: ''
    searchable: true
    required: true
    sortable: true
  credit_code:
    type: text
    label: 统一社会信用代码
    inlineHelpText: '系统按照此字段校验重复，避免重复录入单位信息。'
    required: true
  owner:
    label: 责任人
    omit: false
    readonly: false
    hidden: false
    type: lookup
    reference_to: users
  priority:
    label: 优先级
    type: select
    sortable: true
    options:
      - label: 高
        value: high
      - label: 中
        value: normal
      - label: 低
        value: low
    filterable: true
  registered_capital:
    type: currency
    label: 注册资金
    scale: 2
  website:
    type: url
    label: 网址
  phone:
    type: text
    label: 电话
    defaultValue: ''
  email:
    type: text
    label: 邮箱
  description:
    label: 备注
    type: textarea
    is_wide: true
    name: description
list_views:
  all:
    label: 所有单位
    columns:
      - name
      - priority
      - owner
      - modified
    filter_scope: space
  recent:
    label: 最近查看
    columns:
      - name
      - priority
      - owner
      - modified
    filter_scope: space
  mine:
    label: 我的单位
    columns:
      - name
      - priority
      - owner
      - modified
    filter_scope: mine
permission_set:
  user:
    allowCreate: false
    allowDelete: false
    allowEdit: false
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
