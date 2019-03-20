---
title: 简介
---

Steedos Object Schema 是一套跨平台、跨语言的对象描述语法。与传统的ORM标准不同，Steedos 不仅可以定义字段、校验、关系，还可以为后端定义触发器、权限，为前端定义视图、报表、过滤等内容。

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
```

Steedos Object Server 是一套Steedos Object运行环境。Steedos Object Server 设计的目的是为了连接到任何数据源，包括SQL或MongoDB数据库，也可以是类似Salesforce、SAP等API接口。目前我们已发布的 Steedos Object Server 1.0 可以连接到 MongoDB 数据库，连接SQL数据库的版本也正在紧锣密鼓的开发中。

![电脑、手机界面展示](assets/mac_ipad_iphone_home.png)

Steedos Object Server 包含以下内容：
- ODATA API
- [GraphQL API](http://graphql.org)
- 数据浏览与操作界面，可以进行增删改查的操作；
- 统计分析界面，展示用户定义的报表；
- 管理界面，可以设定组织结构、用户、已经用户对对象的访问权限；

Steedos Object Schema 的创意来自 Salesforce Lightning Platform，很多设计标准遵循了 Salesforce 的规范。
