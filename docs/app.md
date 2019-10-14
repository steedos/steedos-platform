---
title: 应用
---

应用可以把业务对象按功能、按业务类型进行分类。例如Salesforce定义了以下应用：销售、市场、服务、内容、社区等。

业务人员可以从左上角的开始菜单选择需要访问的应用。选中应用后，默认进入应用配置的第一个业务对象的列表视图。

点击界面顶端的业务对象导航菜单，可以切换到其他业务对象。

系统预定义了一个“设置”应用。普通用户可以设置用户参数，管理员可以修改系统参数。

![电脑、手机界面展示](assets/mac_mobile_list.png)

管理员可以在权限集中配置应用的访问权限，如果一个用户属于多个权限集，则最终可访问的应用为个权限集的叠加。

## 应用

```yaml
_id: crm
name: 客户
description: 管理客户，以及相关的联系人、任务和日程。
icon_slds: folder
is_creator: true
objects:
  - accounts
  - contacts
  - tasks
  - events  
mobile_objects:
  - accounts
  - contacts
```

### _id

应用的API名称，必须符合变量的命名规范。

### 应用名称 name

应用在界面上的显示名称，可以使用中文名称。

### 应用图标 icon_slds

必须配置。对应 [LIGHTNING DESIGN SYSTEM 中的Standard Icons图标](https://www.lightningdesignsystem.com/icons/#standard) 中的图标名称。

### 可见 visible

如果配置为false，可将应用隐藏。

### 排序号

控制应用在开始菜单中显示的先后顺序。

### 电脑端菜单 objects

使用数组格式定义此应用中显示的对象清单，系统按照定义的先后顺序显示为业务对象Tab。点击业务对象名称，进入业务对象列表界面。

除了可以配置当前项目中的业务对象，也可以配置系统内置的[标准业务对象](standard_objects.md)。

## 手机端菜单 mobile_objects

使用数组格式定义在手机端主菜单中显示的对象清单，系统按照定义的先后顺序显示为业务对象菜单。

## 门户 dashboard

如果配置了此参数，在电脑端会自动加上“首页”Tab，按照配置自动生成应用首页。

```yml
dashboard:
  pending_tasks:
    label: 待办任务
    position: LEFT
    type: odata
    object_name: tasks
    filters: [['assignees', '=', '{userId}'], ['state', '<>', 'complete']]
    columns:
      - field: name
        width: 70%
        wrap: true
        href: true
      - field: priority
        width: 30%
        wrap: false
```

### 标题 label

显示在 widget 左上角。

### 类型 type

内置 widget 类型。目前支持以下类型：

- object_grid: 以表格的形式显示对象的列表数据。
- apps: 显示 apps 清单，点击可以跳转到对应的应用。
- html: 显示静态的html内容，可嵌入 javascript。
- email: 显示当前用户的未读邮件。

### 对象 object_name

查询的对象。

### 筛选条件 filters

在 widget 中只显示符合筛选条件的数据。

### 列 columns

设定显示的列，以及列的属性。

### 位置 position

显示 widget 的位置，可选项：

- LEFT: 显示在左侧
- CENTER_TOP: 显示在中间栏顶部
- CENTER_BOTTOM_LEFT: 显示在中间栏底部左侧
- CENTER_BOTTOM_RIGHT: 显示在中间栏底部右侧
- RIGHT: 显示在右侧
