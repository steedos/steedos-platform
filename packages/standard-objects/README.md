# 华炎魔方内置元数据

## 基础对象

[base](/packages/standard-objects/base.object.yml)对象是所有对象的基础对象，这意味着华炎魔方中所有的对象都是继承自该对象。

该对象中配置了一些基础的字段，比如创建人、创建时间、所有者、所属分部等，可以在继承自该对象的对象中改写或扩展这些字段的属性。

该对象中配置了一些基础的操作按钮，比如新建、编辑、删除等，可以在继承自该对象的对象中改写这些按钮的属性或者添加新的按钮。

该对象中配置了普通用户和管理员简档的对象权限，比如普通用户只能修改、删除属于自己的记录，而管理员可以修改、删除所有记录。

## 内置标准对象

### 组织与人员

- 用户 [users](/packages/standard-objects/users.object.yml)：用于保存系统中的注册用户和用户的基本参数。

- 工作区 [spaces](/packages/standard-objects/spaces.object.yml)：Steedos SAAS 版本可以把用户划分为不同的工作区（企业），每个工作区可以配置独立的组织机构和权限控制。业务人员录入的每一条业务数据都会自动加入 space 属性，用于标记所属的工作区。

- 员工 [space_users](/packages/standard-objects/space_users.object.yml)：用于标记用户属于哪个工作区，以及在对应工作区的参数设置。每个用户可以属于多个工作区。

- 组织机构 [organizations](/packages/standard-objects/organizations.object.yml)：用于在工作区内，定义公司的组织机构。每个员工可以属于多个组织机构。

- 分部 [company](/packages/standard-objects/company.object.yml)：分部，可以理解为集团分公司，每个员工可以属于多个分部，一般用于实现分部级权限。

### 功能

- 报表 [reports](/packages/standard-objects/reports.object.yml)：业务人员可以自定义报表来分析业务数据，请参阅文档 [分析您的数据](https://www.steedos.cn/docs/admin/record_report#%E6%8A%A5%E8%A1%A8)。

- 任务 [tasks](/packages/standard-objects/tasks.object.yml)：用于日常任务管理，也可以用于管理对象的相关任务，当在对象上勾选了 ”[允许添加任务](https://www.steedos.cn/docs/admin/create_object#关于对象功能开关)“ 开关后，业务人员就可以在该对象记录详细界面看到该记录相关的任务子表。任务被创建后，其被分派人可以收到推送通知。

- 日程 [events](/packages/standard-objects/events.object.yml)：用于日常日程管理，也可以用于管理对象的相关日程，当在对象勾选了”[允许添加日程](https://www.steedos.cn/docs/admin/create_object#关于对象功能开关)“开关后，业务人员就可以在该对象记录详细界面看到该记录相关的日程子表。日程被创建后，其被分派人可以收到推送通知。

- 备忘 [notes](/packages/standard-objects/notes.object.yml)：用于日常备忘管理，也可以用于管理对象的相关备忘，当在对象勾选了”[允许添加备注](https://www.steedos.cn/docs/admin/create_object#关于对象功能开关)“开关后，业务人员就可以在该对象记录详细界面看到该记录相关的备忘子表。

- 公告 [announcements](/packages/standard-objects/announcements.object.yml)：用于发布公告，可以选择要发布到哪些人员，相关人员可以收到公告通知。

- 通知 [notifications](/packages/standard-objects/notifications.object.yml)：用于发送通知给指定人员，只要创建通知记录并关联到相关人员即可，相关人员也可以收到APP推送通知。

- 附件 [cms_files](/packages/standard-objects/cms_files.object.yml)：以用于管理对象的相关附件，当在对象勾选了”[允许添加附件](https://www.steedos.cn/docs/admin/create_object#关于对象功能开关)“开关后，业务人员就可以在该对象记录详细界面看到该记录相关的附件子表。

- 附件版本 [cfs_files_filerecord](/packages/standard-objects/cfs_files_filerecord.object.yml)：用于存放附件的各个版本，可以在附件详情页查看附件各个版本。

- 订单 [billing_pay_records](/packages/standard-objects/billing_pay_records.object.yml)：已作废。

- 数据导入 [queue_import](/packages/standard-objects/queue_import.object.yml)：用于导入Excel文件中的数据到华炎魔方。

- 数据导入历史 [queue_import_history](/packages/standard-objects/queue_import_history.object.yml)：用于查看数据导入的历史记录。

- 登录日志 [audit_login](/packages/standard-objects/audit_login.object.yml)：用于查看每次登陆系统的时间等信息

- 自动编号 [autonumber](/packages/standard-objects/autonumber.object.yml)：用于查看含有自动编号字段的对象和修改自动编号字段的当前编号值。

- 节假日 [holidays](/packages/standard-objects/holidays.object.yml)：用于自定义节假日。

- 工作时间 [business_hours](/packages/standard-objects/business_hours.object.yml)：用于自定义工作时间。

- 外部应用 [connected_apps](/packages/standard-objects/connected_apps.object.yml)：用于系统引用外部应用。

- 自定义主页 [dashboard](/packages/standard-objects/dashboard.object.yml)：用于定义应用的主页。

- 我的收藏夹 [favorites](/packages/standard-objects/favorites.object.yml)：用于保存每个用户收藏的记录。

- 关注 [follows](/packages/standard-objects/follows.object.yml)：用于保存用户关注的对象

- 激活华炎魔方时的Token [license_auth_token](/packages/standard-objects/license_auth_token.object.yml)：已作废

- 许可证 [license](/packages/standard-objects/license.object.yml)：华炎魔方平台私有部署版完全免费，云服务需要购买相关的许可证。

- OAuth2应用 [OAuth2Clients](/packages/standard-objects/OAuth2Clients.object.yml)：存储oauth2 client 信息 或 jwt 的client secret

- 最近查看 [object_recent_viewed](/packages/standard-objects/object_recent_viewed.object.yml)：该对象记录每个用户最近查看日志。

- WebHooks [object_webhooks](/packages/standard-objects/object_webhooks.object.yml)：用于订阅对象记录增、删、改事件，当相关事件触发时会自动回调指定的url。

- 字段权限 [permission_fields](/packages/standard-objects/permission_fields.object.yml)：用于设置字段权限。

- 选项列表值 [picklist_options](/packages/standard-objects/picklist_options.object.yml)：已作废。

- 下拉框列表 [picklists](/packages/standard-objects/picklists.object.yml)：已作废。

- 限制规则 [restriction_rules](/packages/standard-objects/restriction_rules.object.yml)：用于缩小某些指定用户对某个对象的记录访问权限，该对象记录中保存着相关限制规则。

- 共享规则 [share_rules](/packages/standard-objects/share_rules.object.yml)：用于放大某些指定用户对某个对象的记录访问权限，该对象记录中保存着相关共享规则。

- 登录会话 [sessions](/packages/standard-objects/sessions.object.yml)：用于保存登录的用户、ip地址、登录时间等信息。

- 设置 [settings](/packages/standard-objects/settings.object.yml)：配置表。

- 选项卡 [tabs](/packages/standard-objects/tabs.object.yml)：用于在应用中配置顶部导航的选项卡，使用说明请参考文档 [选项卡](https://www.steedos.cn/docs/admin/create_object#%E9%80%89%E9%A1%B9%E5%8D%A1)。

- 验证码 [users_verify_code](/packages/standard-objects/users_verify_code.object.yml)：用于手机号或邮箱注册/登录等需要发送验证码的场景下保存验证码。

- 在线表单 [web_forms](/packages/standard-objects/web_forms.object.yml)：在线表单（匿名提交数据），用于潜在客户注册、合作伙伴申请表、在线故障申报之类的需求。

- 应用程序 [apps](/packages/standard-objects/apps.object.yml)：用于保存应用程序配置，比如配置顶部导航选项卡，是否新窗口中打开等，启用的应用会显示在应用程序启动器九宫格中。

- API Key [api_keys](/packages/standard-objects/api_keys-app/main/default/objects/api_keys/api_keys.object.yml)：用于保存用户创建的API Key记录，启用状态的API Key通常被用于各种接口中身份验证。在 [激活华炎魔方私有部署项目](https://www.steedos.cn/docs/deploy/deploy-activate) 时也是使用API Key来作身份验证的。

- 消息 [chat_messages](/packages/standard-objects/chatter/chat_messages.object.yml)：基础模块：记录留言。

- 房间 [chat_rooms](/packages/standard-objects/chatter/chat_rooms.object.yml)：基础模块：记录留言。

- 订阅 [chat_subscriptions](/packages/standard-objects/chatter/chat_subscriptions.object.yml)：基础模块：记录留言。

- 业务伙伴 [accounts](/packages/standard-objects/community-users/accounts.object.yml)：用于保存业务伙伴相关信息。

- 联系人 [contacts](/packages/standard-objects/community-users/contacts.object.yml)：用于保存联系人相关信息。

- 邀请用户 [space_users_invite](/packages/standard-objects/invite/space_users_invite.object.yml)：记录邀请信息

- [_object_reload_logs](/packages/standard-objects/object-database/_object_reload_logs.object.yml)：用于解决objects 、fields 变化时，自动加载

- 外部数据源 [datasources](/packages/standard-objects/object-database/datasources.object.yml)：对于定义外部数据源，可以连接MongoDB，SQL Server，PostgreSQL，Oracle，MySQL等数据库。

- 对象 [objects](/packages/standard-objects/object-database/objects.object.yml)：用于描述业务对象属性，它是一个映射到数据库表（或使用 MongoDB 时的集合）的配置文件。

- 操作按钮 [object_actions](/packages/standard-objects/object-database/object_actions.object.yml)：可以为对象配置操作按钮，这些按钮将显示在对象列表或对象记录详细界面上，点击这些按钮会执行按钮上配置的执行脚本。

- 对象字段 [object_fields](/packages/standard-objects/object-database/object_fields.object.yml)：用于保存对象上的字段信息，每个字段都会映射到数据库表中的字段。

- 页面布局 [object_layouts](/packages/standard-objects/object-database/object_layouts.object.yml)：用于定义对象记录详细页面的页面布局。

- 列表视图 [object_listviews](/packages/standard-objects/object-database/object_listviews.object.yml)：列表视图是对象的主界面，使用列表的方式浏览对象中的数据，可以配置列表上要显示哪些列以及列表数据过滤条件。

- 相关子表 [object_related_list](/packages/standard-objects/object-database/object_related_list.object.yml)：已作废，相关功能已被页面布局代替实现了。

- 对象触发器 [object_triggers](/packages/standard-objects/object-database/object_triggers.object.yml)：用于保存在对象上配置的新建、修改、删除记录时要触发的事件。

- 对象验证规则 [object_validation_rules](/packages/standard-objects/object-database/object_validation_rules.object.yml)：用于保存在对象上配置的验证规则，验证规则主要用于验证该对象的数据是否符合特定的规则。当用户对于对象的某个字段的更改不符合用户创建的验证规则时，用户输入的信息无法提交保存。

- webhooks队列[object_webhooks_queue](/packages/standard-objects/queue/object_webhooks_queue.object.yml)：用于保存待执行的Webhooks队列。

- 字段更新 [action_field_updates](/packages/standard-objects/workflow-actions/action_field_updates.object.yml)：用于保存管理员在流程自动化配置中配置的字段更新信息，详细请参考文档 [字段更新](https://www.steedos.cn/docs/admin/auto_process#%E5%AD%97%E6%AE%B5%E6%9B%B4%E6%96%B0)。

- 消息提醒 [workflow_notifications](/packages/standard-objects/workflow-actions/workflow_notifications.object.yml)：用于保存管理员在流程自动化配置中配置的工作流通知信息，详细请参考文档 [消息提醒](https://www.steedos.cn/docs/admin/auto_process#%E5%B7%A5%E4%BD%9C%E6%B5%81%E9%80%9A%E7%9F%A5)。

- 工作流规则 [workflow_rule](/packages/standard-objects/workflow-actions/workflow_rule.object.yml)：用于保存管理员在流程自动化配置中配置的工作流规则，详细请参考文档 [工作流规则](https://www.steedos.cn/docs/admin/auto_process#%E5%B7%A5%E4%BD%9C%E6%B5%81%E8%A7%84%E5%88%99)。

### 权限

- 权限集 [permission_set](/packages/standard-objects/permission_set.object.yml)：用于保存管理员在设置应用中配置的权限集，详细请参考文档 [权限集](https://www.steedos.cn/docs/admin/permission_set#%E6%9D%83%E9%99%90%E9%9B%86)。

- 对象权限 [permission_objects](/packages/standard-objects/permission_objects.object.yml)：用于保存管理员在设置应用中配置的对象权限，详细请参考文档 [对象权限](https://www.steedos.cn/docs/admin/permission_set#%E5%AF%B9%E8%B1%A1%E6%9D%83%E9%99%90)。

- 共享规则 [permission_shares](/packages/standard-objects/permission_shares.object.yml)：用于保存管理员在设置应用中配置的共享规则，详细请参考文档 [共享规则](https://www.steedos.cn/docs/admin/permission_set#%E5%85%B1%E4%BA%AB%E8%A7%84%E5%88%99)。

### 审批

- 角色 [roles](/packages/standard-objects/roles.object.yml)：用于保存管理员在设置应用中为审批王应用配置的角色配置。

- 表单 [forms](/packages/standard-objects/workflow/forms.object.yml)：用于保存管理员用审批王应用的表单设计器设计的表单。

- 流程 [flows](/packages/standard-objects/workflow/flows.object.yml)：用于保存管理员用审批王应用的流程设计器设计的流程。

- 流程分类 [categories](/packages/standard-objects/workflow/categories.object.yml)：用于保存管理员在设置应用中为审批王应用配置的流程分类。

- 审批岗位 [flow_roles](/packages/standard-objects/workflow/flow_roles.object.yml)：用于保存管理员在设置应用中为审批王应用配置的岗位。

- 审批岗位成员 [flow_positions](/packages/standard-objects/workflow/flow_positions.object.yml)：用于保存管理员在设置应用中为审批王应用配置的岗位成员。

- 审批（申请单） [instances](/packages/standard-objects/workflow/instances.object.yml)：用于保存业务人员填写的申请单和签核历程。

- 对象流程映射 [object_workflows](/packages/standard-objects/object_workflows.object.yml)：用于保存管理员在设置应用中为审批王应用配置的对象流程映射关系。

- 历史步骤 [approvals](/packages/standard-objects/workflow/approvals.object.yml)：用于记录审批流程流转过程中在各个步骤执行时相关人员填写的审批信息。

- 流程编号 [instance_number_rules](/packages/standard-objects/workflow/instance_number_rules.object.yml)：用于保存管理员在设置应用中为审批王应用配置的流程编号规则。

- 效率统计 [instances_statistic](/packages/standard-objects/workflow/instances_statistic.object.yml)：审批王效率统计。

- 流程委托 [process_delegation_rules](/packages/standard-objects/workflow/process_delegation_rules.object.yml)：用于保存管理员在设置应用中为审批王应用配置的流程委托规则。

- 图片签名 [space_user_signs](/packages/standard-objects/workflow/space_user_signs.object.yml)：用于保存管理员在设置应用中为审批王应用配置的图片签名。

- 流程触发器 [webhooks](/packages/standard-objects/workflow/webhooks.object.yml)：用于保存管理员在设置应用中为审批王应用配置的流程触发器，当审批流程到达特定环节时会触发指定事件。

## 内置标准权限集

- 流程管理员 [workflow_admin](/packages/standard-objects/permissionsets/workflow_admin.permissionset.yml)：该权限集可用于配置分管各个流程的管理员。

- 分部管理员 [organization_admin](/packages/standard-objects/permissionsets/organization_admin.permissionset.yml)：该权限集可用于配置分管各个分部的管理员。

## 内置标准应用

### 设置应用 admin

该应用是系统设置应用，管理员可以在该应用中配置各种参数。

### cms 知识

- 栏目 [cms_categories](/packages/standard-objects/cms/cms_categories.object.yml)：用于保存知识文章的分类。

- 知识 [cms_posts](/packages/standard-objects/cms/cms_posts.object.yml)：用于保存知识文章。

- 站点 [cms_sites](/packages/standard-objects/cms/cms_sites.object.yml)：用于保存知识应用中的站点，每篇文章都必须属于某个站点。

### packages-app

- 软件包 [package](/packages/standard-objects/packages-app/main/default/objects/package/package.object.yml)：用于保存软件包信息，软件包中包含元数据及相关源代码。

- 已安装的软件包 [imported_package](/packages/standard-objects/packages-app/main/default/objects/imported_package/imported_package.object.yml)：用于保存当前华炎魔方项目已经安装的软件包信息。

- 软件包组件 [package_type_members](/packages/standard-objects/packages-app/main/default/objects/package_type_members/package_type_members.object.yml)：用于保存每个软件包中包含哪些元数据。

- 软件包版本 [package_version](/packages/standard-objects/packages-app/main/default/objects/package_version/package_version.object.yml)：用于保存软件包的每个版本信息，华炎魔方项目中安装的软件包实际上安装的是这里保存的某个版本中的包。

### 批准过程 process

- 批准过程 [process_definition](/packages/standard-objects/process/approval/process_definition.object.yml)：用于保存管理员在设置应用中配置的批准过程信息。

- 批准步骤 [process_node](/packages/standard-objects/process/approval/process_node.object.yml)：用于保存管理员在设置应用中为每个批准过程配置的批准步骤信息。

- 批准流程 [process_flows](/packages/standard-objects/process/flows/process_flows.object.yml)：自动化流程, 还未实现

- [process_flows_criteria](/packages/standard-objects/process/flows/process_flows_criteria.object.yml)：自动化流程, 还未实现

- [process_flows_criteria_action](/packages/standard-objects/process/flows/process_flows_criteria_action.object.yml)：自动化流程, 还未实现

- [process_instance](/packages/standard-objects/process/process_instance/process_instance.object.yml)：批准过程实例

- [process_instance_node](/packages/standard-objects/process/process_instance/process_instance_node.object.yml)：批准过程步骤实例

- 批准历史 [process_instance_history](/packages/standard-objects/process/process_instance/process_instance_history.object.yml)：用于记录批准过程流转过程中在各个步骤执行时相关人员填写的审批信息。
