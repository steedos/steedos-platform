# Steedos Creator
华炎新一代云端软件开发平台，智能创建多租户的云端业务系统。


### Apps
Apps 表示功能模块，Apps下包含Objects
- name， app 名称
- label，app 显示名
- icon_slds，app 图标
- objects，此app包含的objects数组，会显示在app的主菜单上
- visible, 是否默认显示，不默认显示的App可以通过Permission Sets控制显示给部分用户

### Objects
Objects 是Creator的核心，Object对象中可以定义以下内容
- fields，Creatror根据object.fields生成schema
- list_views，列表视图，列表视图中可定义显示的列和列表过滤条件
- triggers，创建对象操作触发器，在服务端执行。例如"before.insert"
- indexes（计划中），创建数据库索引
- 系统初始化时自动生成Object对应的Collection，并绑定到Schema。

### baseObject
baseObject用于定义所有对象适用的基础fields, triggers, indexes. list_views 只能在对象中定义

### 自动生成页面
/app/:app_id/:object_name/
无需开发，Creator自动生成以下功能页面
- 列表视图，自动选中第一个列表视图，用户可以在多个列表视图中切换。列表视图中可定义显示的列和列表过滤条件
- 记录查看页面，为master_detail类型的字段，自动生成子表
- 增删改页面，根据Schema，自动生成对象新建、编辑、删除操作界面

### Object 支持的属性
- name: 唯一的object name
- label: 显示名
- icon：图标，参见 https://www.lightningdesignsystem.com/icons ， Standard Icons 部分
- enable_search: 启用全局搜索，只搜索name字段
- enable_files: 启用上传附件功能
- enable_chatter: 启用讨论功能
- enable_tasks: 启用任务功能
- enable_audit: 启用审计跟踪功能
- enable_api: 启用API接口

### fields支持的字段类型
- lookup: 相关表，联合reference_to字段，从关联表中选择记录
- master_detail: 子表，联合reference_to属性，表示当前记录是主表的子记录。系统会自动检测此类型的字段，在主表的记录显示页面中生成子表列表视图。
- text: 文本
- textarea: 文本域
- "[text]": 文本数组，也可以用来保存id数组
- date: 日期
- datetime: 日期时间
- select: 下拉框，联合options属性，生成下拉框的内容
- boolean：Checkbox
- number: 数值
- 实例：
	- 在archive_records对象里，字段archive_destroy_id类型为master_detail
		- archive_destroy_id:
				type:"master_detail"
				label:"销毁单"
				filters:[["destroy_state", "$eq", "未销毁"]]
				depend_on:["destroy_state"]
				reference_to:"archive_destroy"
				group:"销毁"
		- 备注：上述实例中，使用了filters字段级过滤，其中depend_on必须有，最终得到“archive_destroy”表中，destroy_state值为“未销毁”的记录。

### fields 属性
- name: 字段名
- label: 字段显示名。如果系统检测到翻译 "objectname_fieldname"，以翻译为准。
- defaultValue: 默认值，可配置默认值公式 {{userId}}, {{spaceId}} 等，#todo
- required: 必填
- inlineHelpText: 表单填写时显示的帮助文本
- sortable: 可排序，可排序字段系统会自动创建索引
- index: true/false，指定是否为此字段创建索引
- readonly: 只读，应该只显示在查看页面或列表页面上，新增和修改页面都不显示 #todo
- omit: 所有页面都不显示
- multiple: 表示数组字段，可以多选
- group：字段分组，在显示表单时自动按分组显示
- is_wide: 宽字段，显示时占满整行
- is_name: 表示此字段为标题字段，适用于标题字段并不是"name"时，在列表页生成链接
- readonly: 只读
- disabled: 禁用
- hidden: 隐藏，在列表和表单中都不显示
- blackbox: 告知schema忽略此字段的类型验证
- allowedValues: 可选项范围

### permissions 权限
Object权限分以下类型
- allowCreate: 可创建
- allowDelete: 可删除
- allowEdit: 可编辑
- allowRead: 可查看owner=自己的记录
- modifyAllRecords: 可修改所有人的记录
- viewAllRecords: 可查看所有人的记录
- actions [text]字段，用来控制显示哪些actions
- listviews [text]字段，用来控制显示哪些listviews
- related_objects 字段，用来控制相关列表中显示哪些内容
- fields [text] ，当前用户的可见字段，数据库中如果没有配置此属性，则表示不限制。
- readonly_fields [text] ，当前用户不能编辑的字段
备注：一个人可以属于多个权限集。如果多个权限集中定义了同一个object的权限，大部分属性取最大权限集合。除了以下属性：readonly_fields取最小权限集合。

API
- object权限：Creator.getPermissions(object_name)
- record权限：Creator.getRecordPermissions(object_name, record, userId)

### PermissionSet 权限集
管理员可以设定权限集，用于定义每一个用户对app, object, object field的访问权限。
- 每个对象可以预定义两个权限集 admin, user。工作区管理员享有admin权限。
- 自定义权限集时需要指定对应的用户。
- 多个权限集可以叠加，以相对较高权限为最终用户权限。
- 权限集中可以设定用户授权访问的Apps
- 可以为具体对象指定权限。
- 可以为具体字段指定权限。

### list_views 列表
用于定义Object的列表显示样式
- list_views.default.columns用于定义各列表中默认显示的列
- 可在objects中定义多个list_view
- 未来允许用户自己配置list_view，保存在数据库中
- 系统会自动计算，为master_detail类型的字段，在主表中自动生成子表的list_views, 使用默认列
- columns 用于定义指定list_view显示的列
- sort 用于定义指定list_view的排序方式，可以同时定义多种排序方式。sort属性为数组，暂时只支持按照一个字段排序，预留多个字段排序的功能。
- 实例:
	- list_views:
		- default:
			- columns: ["name", "customer_id", "amount", "company_signed_date", "company_signed_id"]
		- recent:
			- filter_scope: "space"
		- all:
			- filter_scope: "space"
			- columns: ["name", "description", "modified", "owner"]
			- sort: [["modified", "desc"]]
		- mine:
			- filter_scope: "mine"

- recent 最近查看视图
  - recent列表视图可查看用户最近点击的记录
  - list_view_id == "recent"时生效
  - 用户每次点击记录，系统都会自动保存点击信息。每个用户对每个对象最多保存10条记录。

### actions 按钮与操作

用于定义界面上的按钮与操作，
- action.todo 如果是函数，直接执行
- action.todo 如果是字符串，表示系统内置函数，Creator找到该内置函数并执行
- action.on:
  - "list" 为列表定义action，显示在列表右上角
  - "record" 为记录定义action，显示在记录查看页右上角
- action.todo 函数中可以使用以下变量
  - this.object_name
  - this.object
  - this.action
实例
- actions
  - "export":
    - visible: true
    - on: "list"
    - todo: ()->

### triggers 触发器
triggers 用于定义在服务端执行的触发器
- 同一个事件可以定义多个trigger，但不能重名
    - on: ["server", "client"]
    - when: 可选择以下事件
		- "before.insert"
		- "before.update"
		- "before.delete"
		- "after.insert"
		- "after.update"
		- "after.delete"
    - todo: 传入触发的函数
- trigger.todo 函数中可以使用以下变量
  - this.object_name
- trigger.todo 函数，如果return的是false，则中断操作，如在before.insert里return false,则不执行insert操作。


### SAAS 多租户
Creator支持多租户的环境，并自动生成多租户相关的代码。
- 用户必须先选择工作区才能开始操作，也就是Session.get("spaceId")不为空
- 新增记录时，自动加上space字段
- 查询列表时，自动加上space字段
