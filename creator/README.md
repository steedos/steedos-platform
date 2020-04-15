# 华炎魔方服务端

华炎魔方是一款随需应变的管理软件开发工具，旨在通过其强大的敏捷性、灵活性和开放性帮助企业创新、扩展和集成企业业务系统。基于该平台，您可以快速创建智能化、移动化的企业应用。

比如你可以这样定义对象 account.object.yml
```yaml
name: Account
label: 单位
description: 统一保存客户、合作伙伴、供应商数据
fields:
  name: 
    type: String
    label: 标题 
  priority:
    type: String
    label: 优先级
  owner:
    label: 所有人
    type: lookup
    reference_to: User
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
    filters: ["priority", "=", "high"]
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

# 数据建模

创新的使用配置文件描述业务模型和业务功能，开发人员只需要编写简单的配置文件就可以构建企业级应用程序，包括可自定义的列表界面、根据业务对象配置文件自动生成的记录查看与编辑界面、查找与筛选界面、统计分析界面等。

一方面可以降低企业应用开发人力成本，另一方面可以将原有数月甚至数年的开发时间成倍缩短，从而帮助企业实现降本增效的价值。

# 数据管理

对数据进行集中数字化管理，包括主表的基本信息，以及附件、任务、审批单及其他自定义子表等详细信息。可以通过授权，来限定不同层级的人员能查看、维护全部或是部分内容。也可以通过关键字，来模糊检索数据记录。

同时，针对苹果和安卓手机用户，自动生成在小屏幕设备上易于查看与操作的手机版界面，用户即使不在办公室，也能随时登录业务系统，进行业务操作。

# 流程审批

对于需要审批的业务数据，例如合同、付款、请假等，系统管理员可通过图形化的工具来配置审批流程，并与业务数据实现互通。华炎魔方提供图形化的表单与流程设计界面，所见即所得。您可以设计条件判断，支持处理数百个节点的复杂流程，即使是数万人的大型集团企业，也能轻松设计出符合需求的业务流程。

华炎魔方的流程审批引擎十分强劲，可以将审批中的流程表单及正文附件实时同步为业务对象记录，实现业务数据的统一管理。

# 统计分析

华炎魔方内置功能强大的报表统计与分析功能，业务人员可通过简单设定，配置出列表、分组报表、二维表进行统计分析，并可自动生成图形化报表。

在报表顶部用图形化方式显示统计数据，可以显示为柱状图、折线图、饼图。设置时，还可以对特定的字段进行计数、小计、合计等统计处理。通过设定报表的查询条件，可以将统计范围缩小，提高报表的运行速度。例如可以设定只统计某个时间段的数据。平台会自动根据后台配置的用户权限，只对用户权限范围内的数据进行汇总统计。

# 了解更多

## 访问官网

[华炎魔方官网](https://www.steedos.com/platform/)

## 查看培训教程

本教程以合同管理为例，指导你如何使用华炎魔方创建项目，配置业务对象，编程脚本，处理业务部门的各种个性化需求。您开发的新业务系统可以部署在本地运行。

[如何使用华炎魔方，快速开发随需定制的管理系统？](https://www.steedos.com/developer/)

## 项目效果演示

华炎办公是使用华炎魔方开发的SaaS版本办公平台，内置审批、公告、知识、任务、日程等常用办公管理功能，并嵌入了合同管理、CRM等标准模块。

- 注册华炎云账户，在线试用[华炎办公](https://cn.steedos.com/)
- 下载并运行[项目源码](https://github.com/steedos/steedos-project-saas)。
- 查看[系统帮助](https://www.steedos.com//help/)

## 项目源码

华炎魔方是[开源低代码开发平台](https://github.com/steedos/)，我们将所有源码开源，与合作伙伴一起共建低代码开发平台生态体系。

- [华炎魔方内核源码](https://github.com/steedos/object-server)
- [合同管理系统源码](https://github.com/steedos/steedos-contracts-app)
- [费控管理系统源码](https://github.com/steedos/steedos-project-dzug)
