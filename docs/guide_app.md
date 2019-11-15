---
title: 配置应用
---

将一组业务对象放在一起即构成一个应用。应用描述文件必须以 .app.yml 结尾。

管理员可以针对应用进行授权，授权给具体的业务人员或是部门使用。

![电脑、手机界面展示](assets/mac_mobile_list.png)

模板项目内置了一个 [应用](./app.md) 描述文件 src/crm.app.yml ，您可以尝试修改此文件。

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
  - reports
mobile_objects:
  - accounts
  - contacts
  - tasks
  - events  
  - reports
```

示例应用中引用了以下业务对象：

- accounts
- contacts
- tasks
- events  
- reports

其中，tasks, events, reports 属于 steedos 内置的[标准业务对象](./standard_objects.md)，无需在项目中定义即可使用。

修改应用描述文件之后，只需重新启动服务，即可生效。
