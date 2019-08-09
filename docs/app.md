---
title: 应用
---

应用可以把业务对象按功能、按业务类型进行分类。例如Salesforce定义了以下应用：销售、市场、服务、内容、社区等。

业务人员可以从左上角的开始菜单选择需要访问的应用。选中应用后，默认进入应用配置的第一个业务对象的列表视图。

点击界面顶端的业务对象导航菜单，可以切换到其他业务对象。

系统预定义了一个“设置”应用。普通用户可以设置用户参数，管理员可以修改系统参数。

![电脑、手机界面展示](assets/mac_mobile_list.png)

## 应用属性
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
```
### _id
应用的API名称，必须符合变量的命名规范。

### 应用名称 name
应用在界面上的显示名称，可以使用中文名称。

### 应用图标 icon_slds
必须配置。对应 [LIGHTNING DESIGN SYSTEM 中的Standard Icons图标](https://www.lightningdesignsystem.com/icons/#standard) 中的图标名称。

### 对象 objects
使用数组格式定义此应用中显示的对象清单，系统按照定义的先后顺序显示为业务对象Tab。点击业务对象名称，进入业务对象列表界面。

除了可以配置当前项目中的业务对象，也可以配置系统内置的[标准业务对象](standard_objects.md)。

### 可见 visible
如果配置为false，可将应用隐藏。

### 排序号
控制应用在开始菜单中显示的先后顺序。

## 应用权限
管理员可以在权限集中配置应用的访问权限，如果一个用户属于多个权限集，则最终可访问的应用为个权限集的叠加。
