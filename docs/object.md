---
title: 业务对象
---

## 业务对象配置
Steedos 使用yaml文件描述业务对象，每个文件对应一个业务对象。与传统的ORM标准不同，Steedos 不仅可以定义字段、校验、关系，还可以为后端定义触发器、权限，为前端定义视图、报表、过滤等内容。

业务对象描述文件以 .object.yml 结尾，通常放在 src/ 文件夹中，系统启动时会自动加载。

比如你可以定义如下对象 src/accounts.object.yml
```yaml
name: accounts
label: 单位
icon: person_account
description: 统一保存客户、合作伙伴、供应商数据
enable_files: true
enable_search: true
enable_tasks: true
enable_notes: false
enable_api: true
enable_share: true
enable_chatter: true
fields:
  name: 
    type: text
    label: 标题 
  priority:
    type: text
    label: 优先级
    options:
      - label: 高
        value: high
      - label: 中
        value: normal
      - label: 低
        value: low
  owner:
    label: 所有人
    type: lookup
    reference_to: users
list_views:
  recent:
    label: 最近查看
  all:
    label: 所有单位
    columns:
      - name
      - priority
      - owner
      - modified
    filter_fields:
      - priority
  high_priority:
    label: 重点关注
    filters: [["priority", "=", "high"]]
permission_set:
  user:
    allowCreate: true
    allowDelete: true
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
> 使用 [Visual Studio Code](https://code.visualstudio.com/) 编辑对象文件，并按照提示安装插件[redhat.vscode-yaml](https://marketplace.visualstudio.com/items?itemName=redhat.vscode-yaml)，Steedos 会自动校验用户编写的yml文件格式是否符合规范。

### 对象显示效果
![对象显示效果](assets/object_guide.png)

### 对象属性
定义对象时，可以使用以下属性：
- 对象名(object_name)： 必填，是对象的唯一名称，也是对象保存在数据库中的数据表名称。只能是英文、下划线和数字组成，不可重复。通过代码、API接口调用对象时，也需要使用此名称。
- 显示名称(label)： 必填，在界面上的显示名称，最终用户看到的是此名称。
- 图标(icon)： 必填，对象的显示图标名称，对应 [LIGHTNING DESIGN SYSTEM 中的Standard Icons图标](https://www.lightningdesignsystem.com/icons/#standard)
- 已启用(is_enable): 此对象已生效，显示在最终用户界面中。
- 启用搜索功能(enable_search): 此对象可以通过全局检索查询。
- 启用附件功能(enable_files): 此对象中的业务数据，可以上传附件。
- 启用任务功能(enable_tasks): 此对象中的业务数据，可以添加任务。
- 启用备忘功能(enable_notes): 此对象中的业务数据，可以添加备忘。
- 跟踪字段历史(enable_audit): 跟踪字段的修改历史，此功能会消耗更多服务器资源，只有必要的对象才应该配置此属性。
- 启用API接口(enable_api): 是否允许通过API接口访问对象，默认开启。 
- 启用数据校验(enable_schema): 在数据保存时，是否按照定义的字段属性进行数据校验。默认开启。
- 启用树状结构显示记录(enable_tree): 如果定义此属性，使用树状结构来展现对象。必须定义parent字段才能启用此属性。
- 自定义帮助(help_url)：如果设置了此字段的内容，最终用户在点击帮助时，跳转到此页面。否则跳转到默认帮助页面。
- 描述(description): 此对象的描述

  
### 对象字段
开发人员可以配置对象的[字段](object_field.md)。Creator支持常见的字段类型：
  - 文本型；
  - 日期型；
  - 布尔型；
  - 数值型；
  - 选择型（单选、多选）；
  - 关联到相关表（单选、多选）。
  
```yaml
fields:
  priority:
    type: String
    label: 优先级
    options:
      - label: 高
        value: high
      - label: 中
        value: normal
      - label: 低
        value: low
```

开发人员可以设定字段的显示名称、描述、可选项、是否必填、分组显示等参数。
开发人员可以将字段关联到另一个对象，两个对象之间会自动创建关联关系，在查看主表记录时，自动显示相关的子表记录。 

> [了解如何配置字段](object_field.md)

### 列表视图
开发人员可以配置对象的[列表视图](object_listview.md)，一个对象可以由一个或多个列表视图组成。业务人员在前台操作时，可以很方便的切换列表视图，也可以自定义列表视图。

```yaml
list_views:
  all:
    label: 所有单位
    columns:
      - name
      - priority
      - owner
      - modified
    filter_fields:
      - priority
```
列表视图可以配置以下参数：
  - 选择列表显示的字段；
  - 设定排序规则；
  - 设定列表过滤条件；
  - 设定快捷过滤字段。

> [了解如何配置列表视图](object_listview.md)

### 访问权限
开发人员可以配置对象的默认访问权限，系统上线后，系统管理员也可以在设置界面中设置对象权限。

```yaml
permission_set:
  user:
    allowCreate: true
    allowDelete: true
    allowEdit: true
    allowRead: true
    modifyAllRecords: false
    viewAllRecords: false
```

对象可以配置以下权限：
  - 允许创建；
  - 允许修改；
  - 允许删除；
  - 允许查看所有记录；
  - 允许修改所有记录；
高级权限配置：
  - 对于集团企业，可以设定只能查看、修改本单位的数据；
  - 对于敏感的业务数据，可以设定只能查看、修改部分字段。

> [了解如何配置访问权限](object_permission.md)

### 参考
- [Steedos 标准对象](https://github.com/steedos/object-server/tree/develop/packages/standard-objects)。
