# 华炎魔方内置元数据

## 基础对象
### 基础 base

base对象中配置了一些基础的字段、操作按钮、权限, 创建新对象时无需新增base对象中含有的字段、操作按钮、权限。

## 内置标准对象

### 组织与人员
#### 用户 users

用于保存系统中的注册用户和用户的基本参数。

#### 工作区 spaces

Steedos SAAS 版本可以把用户划分为不同的工作区（企业），每个工作区可以配置独立的组织机构和权限控制。业务人员录入的每一条业务数据都会自动加入 space 属性，用于标记所属的工作区。

#### 员工 space_users

用于标记用户属于哪个工作区，以及在对应工作区的参数设置。每个用户可以属于多个工作区。

#### 组织机构 organizations

用于在工作区内，定义公司的组织机构。每个员工可以属于多个组织机构。

#### 分部 company

用于在工作区内，每个员工可以属于多个分部。

### 功能

#### 报表 reports

业务人员可以自定义报表。

#### 任务 tasks

用于统一管理对象的相关任务，当A对象配置了”[允许添加任务](https://www.steedos.com/docs/admin/create_object#关于对象功能开关)“，业务人员可以在A对象详细记录中查看关联的工作任务。

#### 日程 events

用于统一管理对象的相关日程，当A对象配置了”[允许添加事件](https://www.steedos.com/docs/admin/create_object#关于对象功能开关)“，业务人员可以在A对象详细记录中查看关联的日程。

#### 备忘 notes

用于统一管理对象的相关备忘，当A对象配置了”[允许添加备注](https://www.steedos.com/docs/admin/create_object#关于对象功能开关)“，业务人员可以在A对象详细记录中查看关联的备注。

#### 公告 announcements

用于发布给指定人员的告示。

#### 知识 cms_posts

？？？

#### 通知 notifications

作废？

#### 附件 cms_files

用于统一管理对象的相关附件，当A对象配置了”[允许上传附件](https://www.steedos.com/docs/admin/create_object#关于对象功能开关)“，业务人员可以在A对象详细记录中查看关联的附件。

#### 附件版本 cfs_files_filerecord

用于存放附件的各个版本，可以在附件详情页查看附件各个版本。

#### 订单 billing_pay_records

作废？

#### 数据导入 queue_import

用于外部数据导入系统。

#### 数据导入历史 queue_import_history

用于查看数据导入的历史记录。

#### 登录日志 audit_login

用于查看每次登陆系统的时间等信息

#### 自动编号 autonumber

用于查看含有自动编号字段的对象和修改自动编号字段的当前编号值。

#### 节假日 holidays

用于设置自定义节假日。

#### 工作时间 business_hours

用于设置自定义工作时间。

#### 外部应用 connected_apps

作废？
#### core core

作废？
#### 自定义主页 dashboard

用于定义应用的主页。

#### 我的收藏夹 favorites

作废？
#### 关注 follows

作废？
#### license_auth_token license_auth_token

作废？

#### 许可证 license

【不懂怎么解释】 ？

#### OAuth2应用 OAuth2Clients

作废？

#### 最近查看 object_recent_viewed

【不懂怎么解释】 ？
#### WebHooks object_webhooks

【不懂怎么解释】 ？

#### 字段权限 permission_fields

用于设置字段权限的配置。
#### 选项列表值 picklist_options

【不懂怎么解释】 ？
#### 下拉框列表 picklists

【不懂怎么解释】 ？
#### 限制规则 restriction_rules

【不懂怎么解释】 ？
#### 登录会话 sessions

【不懂怎么解释】 ？
#### 设置 settings

【不懂怎么解释】 ？
#### 共享规则 share_rules

用于给授权组织、用户共享指定对象的规则。

#### 选项卡 tabs

用于接收对象显示在应用中。
#### 验证码 users_verify_code

【不懂怎么解释】 ？

#### 在线表单 web_forms

【不懂怎么解释】 ？
#### 应用程序 apps

【不懂怎么解释】 ？

#### API Key ： api_keys

【不懂怎么解释】 ？


### 权限

#### 权限集 permission_set

权限集是授予用户对各种对象和功能的访问权限的设置和权限集合，系统内置三个权限集 admin, user, customer。每个用户可以属于多个权限集，用户的实际权限为各权限集赋予的权限叠加。

#### 对象权限 permission_objects

管理员可以在数据库中为权限集设定对象级别的权限。数据库中配置的权限可以覆盖代码中定义的权限。

#### 记录级权限 permission_shares

在对象级权限的基础上，通过配置共享规则，可以实现记录级权限。

### 审批

#### 角色 roles

用于审批时，指定审批角色。

#### 审批单 forms

用于保存审批单，用户可以使用Steedos表单设计工具来设计审批单。

#### 审批流程 flows

用于保存审批流程，用户可以使用Steedos流程设计工具来设计流程。每个流程对应一个审批单。

#### 流程分类 categories

用于分类显示业务流程。每个流程只能属于一个分类。

#### 审批岗位 flow_roles

用于配置公司的审批岗位。建议流程步骤处理人绑定到岗位而不是具体人员。当人员调动时，只需要修改岗位成员。

#### 岗位成员 flow_positions

用于配置每个岗位对应的员工。

#### 申请单 instances

用于保存业务人员填写的申请单和签核历程。

#### 对象流程映射 object_workflows

？？？

## 内置标准权限集

### 流程管理员 workflow_admin

？？？

### 分部管理员 organization_admin

？？？

## 内置标准应用

### 设置应用 admin

【不懂怎么解释】 ？
### chatter
作废？
#### 消息 chat_messages

【不懂怎么解释】 ？

#### 房间 chat_rooms

【不懂怎么解释】 ？

#### 订阅 chat_subscriptions

【不懂怎么解释】 ？
### cms

作废？
#### 栏目 cms_categories

【不懂怎么解释】 ？

#### 知识 cms_posts

【不懂怎么解释】 ？

#### 站点 cms_sites

【不懂怎么解释】 ？

### community-users

#### 业务伙伴 accounts

用于保存公司合作的业务伙伴信息。

#### 联系人 contacts

用于保存业务伙伴联系人信息。

### invite
#### 邀请用户 space_users_invite

用于邀请新用户注册账号。

### object-database

#### _object_reload_logs
作废？

#### 外部数据源 datasources

用于定义对象使用外部数据源。

#### 对象 objects

用于创建对象。

#### 操作按钮 object_actions

用于对象定义操作按钮显示的位置、是否启用等配置信息。

#### 对象字段 object_fields

用于创建字段时的配置信息。

#### 页面布局 object_layouts

用于对象详细页显示的字段内容。

#### 列表视图 object_listviews

用于对象记录在列表页显示的内容。

#### 相关子表 object_related_list

用于对象详细页携带相关子表内容。

#### 对象触发器 object_triggers

用于对象创建、修改、删除时触发某些事件。

#### 对象验证规则 object_validation_rules

【】？

### packages-app

#### 软件包 package

 ？？？

#### 软件包组件 package_type_members

？？？ 
#### 软件包版本 package_version

【不懂】？

### process

#### 批准过程 process_definition

定义批准过程。

#### 批准步骤 process_node

定义批准步骤。

#### 批准流程 process_flows

定义批准流程。
#### process_flows_criteria

作废 ？

#### process_flows_criteria_action

作废 ？

#### process_instance

作废 ？
#### process_instance_node

作废 ？
#### 批准历史 process_instance_history

查看批准记录的历史记录。

#### object_webhooks_queue

作废吧？ 

### workflow

#### 历史步骤 approvals 

#### 流程分类 categories

#### 岗位成员 flow_positions

#### 岗位 flow_roles

#### 审批流程 flows

#### 表单 forms

#### 流程编号 instance_number_rules

#### 效率统计 instances_statistic

#### 审批 instances

#### 流程委托 process_delegation_rules

#### 图片签名 space_user_signs

#### 流程触发器 webhooks

### workflow-actions

#### 字段更新 action_field_updates

#### 工作流通知 workflow_notifications

#### 工作流规则 workflow_rule