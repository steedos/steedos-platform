---
title: 标准业务对象
---

为了支撑 Steedos 的内核的业务功能，Steedos预定义了一些标准对象。所有标准对象保存在 [默认数据源](datasource.md#默认数据源) 中，暂时不支持保存到第三方数据源。

## 组织与人员

### 用户 users
用于保存系统中的注册用户和用户的基本参数。

[源码](https://github.com/steedos/object-server/blob/master/packages/standard-objects/users.object.yml)

### 工作区 spaces
Steedos SAAS 版本可以把用户划分为不同的工作区（企业），每个工作区可以配置独立的组织机构和权限控制。业务人员录入的每一条业务数据都会自动加入 space 属性，用于标记所属的工作区。

[源码](https://github.com/steedos/object-server/blob/master/packages/standard-objects/spaces.object.yml)

### 员工 space_users
用于标记用户属于哪个工作区，以及在对应工作区的参数设置。每个用户可以属于多个工作区。

[源码](https://github.com/steedos/object-server/blob/master/packages/standard-objects/space_users.object.yml)

### 组织机构 organizations
用于在工作区内，定义单位的组织机构。每个员工可以属于多个组织机构。

[源码](https://github.com/steedos/object-server/blob/master/packages/standard-objects/organizations.object.yml)

## 功能

### 报表 reports
业务人员可以自定义报表。

### 任务 tasks
用于统一管理对象的相关任务，业务人员可以在同一个列表中可以查看关联到各业务对象的工作任务。

### 日程 events
用于统一管理对象的相关日程，业务人员可以在同一个列表中可以查看关联到各业务对象的日程。

### 备忘 notes
用于统一管理对象的相关备忘，业务人员可以在同一个列表中可以查看关联到各业务对象的备忘。

### 附件 cms_files
用于统一管理对象的相关附件，业务人员可以在同一个列表中可以查看关联到各业务对象的备忘。

[源码](https://github.com/steedos/object-server/blob/master/packages/standard-objects/cms_files.object.js)

## 权限

### 权限组 permission_set
权限组是授予用户对各种对象和功能的访问权限的设置和权限集合，系统内置三个权限集 admin, user, guest。每个用户可以属于多个权限集，用户的实际权限为各权限集赋予的权限叠加。

[源码](https://github.com/steedos/object-server/blob/master/packages/standard-objects/permission_set.object.yml)

### 对象权限 permission_objects
管理员可以在数据库中为权限组设定对象级别的权限。数据库中配置的权限可以覆盖代码中定义的权限。

[源码](https://github.com/steedos/object-server/blob/master/packages/standard-objects/permission_objects.object.yml)

### 记录级权限 permission_shares
在对象级权限的基础上，通过配置共享规则，可以实现记录级权限。

[源码](https://github.com/steedos/object-server/blob/master/packages/standard-objects/permission_shares.object.js)

## 审批

### 审批单 forms
用于保存审批单，用户可以使用Steedos表单设计工具来设计审批单。

### 审批流程 flows
用于保存审批流程，用户可以使用Steedos流程设计工具来设计流程。每个流程对应一个审批单。

### 流程分类 categories
用于分类显示业务流程。每个流程只能属于一个分类。

### 审批岗位 flow_roles
用于配置公司的审批岗位。建议流程步骤处理人绑定到岗位而不是具体人员。当人员调动时，只需要修改岗位成员。

### 岗位成员 flow_positions
用于配置每个岗位对应的员工。

### 申请单 instances
用于保存业务人员填写的申请单和签核历程。