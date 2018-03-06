# Steedos Creator
企业级的应用软件开发平台，帮助客户快速开发功能丰富，权限细致的企业级应用系统。

例如，如果业务部门提出需求要开发一套合同管理系统，IT部门只需要做如下操作：
- 设定合同表及相关字段；
- 设定合同付款信息表及相关字段。

您将获得一套功能完整的合同管理系统，功能包括：
- 电脑、平板、手机三合一的用户界面；
- 授权用户可以方便的检索数据并保存过滤条件；
- 完善的权限控制，可以精确控制不同用户对不同字段的访问权限；
- 用户可创建自定义报表、二维表、图表进行统计分析；
- 与Excel建立数据连接，利用Excel进行实时统计分析；
- 系统内置组织结构、人员管理、应用管理、权限管理等用户管理功能；
- 系统内置审批功能，可以针对具体的合同或者付款情况进行审批；
- 系统内置任务管理功能，可以针对具体的合同或者付款情况创建待办任务；
- 系统内置讨论功能，可以针对具体的合同或者付款情况进行讨论和回复；
- 系统内置修改痕迹追踪功能，可追踪具体用户对具体字段的变更情况；
- 提供回收站功能，对于误删除的记录可以恢复；
- 可以从Excel导入数据；
- 可以批量修改记录；
- 字段可以随时按照业务部门的需求进行调整；
- 对于选择型字段，管理员可以随时配置可选项；
- 系统自动生成基于ODATA协议的API，方便与第三方系统集成；
- 我们的团队还在持续开发许多创新的新功能，敬请期待。

如果您的业务部门还提出了更多细节的功能要求，我们还提供进一步的脚本配置功能
- triggers，定义当数据增、删、改时自动触发执行对应的脚本；
- actions，定义用户界面上显示的操作按钮以及触发的脚本。

### Objects
用于定义Steedos中的对象。 点击了解更多 [Steedos Object](/packages/steedos-objects/README.md)

### Apps
Apps 表示功能模块，Apps下包含Objects
- name， app 名称
- label，app 显示名
- icon_slds，app 图标
- objects，此app包含的objects数组，会显示在app的主菜单上
- visible, 是否默认显示，不默认显示的App可以通过Permission Sets控制显示给部分用户

### 自动生成页面
/app/:app_id/:object_name/
无需开发，Creator自动生成以下功能页面
- 列表视图，自动选中第一个列表视图，用户可以在多个列表视图中切换。列表视图中可定义显示的列和列表过滤条件
- 记录查看页面，为master_detail类型的字段，自动生成子表
- 增删改页面，根据Schema，自动生成对象新建、编辑、删除操作界面

### list_views 列表
用于定义Object的列表显示样式，至少包含一个除default之外的视图
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
- action.sort 排序号，显示时，按照从小到达顺序排列。编辑action的sort默认为0
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
		- "before.remove"
		- "after.insert"
		- "after.update"
		- "after.remove"
    - todo: 传入触发的函数
- trigger.todo 函数中可以使用以下变量
  - this.object_name
- trigger.todo 函数，如果return的是false，则中断操作，如在before.insert里return false,则不执行insert操作。


### SAAS 多租户
Creator支持多租户的环境，并自动生成多租户相关的代码。
- 用户必须先选择工作区才能开始操作，也就是Session.get("spaceId")不为空
- 新增记录时，自动加上space字段
- 查询列表时，自动加上space字段


### filters 过滤器
flters 用于配置视图的默认过滤条件
- 支持的操作符
	- "=": 等于
	- "<>": 不等于
	- ">": 大于
	- ">=": 大于等于
	- "<": 小于
	- "<=": 小于等于
	- "startswith": 以...开始
	- "contains": 包含...
	- "notcontains": 不包含...

- 实例
	[["is_received", "=", true],["destroy_date","<=",new Date()],["is_destroyed", "=", false]]