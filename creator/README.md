# Steedos Creator
华炎新一代云端软件开发平台，智能创建多租户的云端业务系统。

### Objects
Objects 是Creator的核心，Object对象中可以定义以下内容
- fields，Creatror根据object.fields生成schema
- list_views，列表视图，列表视图中可定义显示的列和列表过滤条件
- triggers，创建对象操作触发器，在服务端执行。例如"before.insert"
- indexes（计划中），创建数据库索引
- 系统初始化时自动生成Object对应的Collection，并绑定到Schema。

### baseObject
baseObject用于定义所有对象适用的基础fields, triggers, list_views, indexes

### 自动生成页面
/app/:app_id/:object_name/
无需开发，Creator自动生成以下功能页面
- 列表视图，自动选中第一个列表视图，用户可以在多个列表视图中切换。列表视图中可定义显示的列和列表过滤条件
- 记录查看页面，为master_detail类型的字段，自动生成子表
- 增删改页面，根据Schema，自动生成对象新建、编辑、删除操作界面

### fields支持的字段类型
- lookup: 相关表，联合reference_to字段，从关联表中选择记录
- master_detail: 子表，联合reference_to属性，表示当前记录是主表的子记录。系统会自动检测此类型的字段，在主表的记录显示页面中生成子表列表视图。
- text: 文本
- "[text]": 文本数组，也可以用来保存id数组
- date: 日期
- datetime: 日期时间
- select: 下拉框，联合options属性，生成下拉框的内容
- boolean：Checkbox
- currency: 金额

### permissions 权限
Object权限分以下类型
- allowCreate: 可创建
- allowDelete: 可删除
- allowEdit: 可编辑
- allowRead: 可查看owner=自己的记录
- modifyAllRecords: 可修改所有人的记录
- viewAllRecords: 可查看所有人的记录
API
- object权限：Creator.getPermissions(object_name)
- record权限：Creator.getRecordPermissions(object_name, record, userId)

### list_views 列表
用于定义Object的列表显示样式
- list_views.default.columns用于定义各列表中默认显示的列
- 可在objects中定义多个list_view
- 未来允许用户自己配置list_view，保存在数据库中
- 系统会自动计算，为master_detail类型的字段，在主表中自动生成子表的list_views, 使用默认列
- 实例:
	- list_views:
		- default:
			- columns: ["name", "customer_id", "amount", "company_signed_date", "company_signed_id"]
		- recent:
			- filter_scope: "space"
		- all:
			- filter_scope: "space"
			- columns: ["name", "description", "modified", "owner"]
		- mine:
			- filter_scope: "mine"

### recent 最近查看视图
- recent列表视图可查看用户最近点击的记录
- list_view_id == "recent"时生效
- 用户每次点击记录，系统都会自动保存点击信息。每个用户对每个对象最多保存10条记录。


### actions 按钮与操作
用于定义界面上的按钮与操作，例如
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


### SAAS 多租户
Creator支持多租户的环境，并自动生成多租户相关的代码。
- 用户必须先选择工作区才能开始操作，也就是Session.get("spaceId")不为空
- 新增记录时，自动加上space字段
- 查询列表时，自动加上space字段
