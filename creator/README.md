# Steedos Creator
Creator是企业级的应用软件开发平台，帮助客户快速开发功能丰富，权限细致的企业级应用系统。

[点击这里查看Steedos Creator功能介绍](https://github.com/steedos/help/tree/master/zh-cn/creator)

### Objects
用于定义Steedos中的对象。 [关于对象的详细说明，请参考此文档。](https://github.com/steedos/help/blob/master/zh-cn/creator/object.md)

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
用于定义Object的列表显示样式
- all view的columns、filter_scope、sort、extra_columns作为其他视图的属性默认值
- 可在objects中定义多个list_view
- 未来允许用户自己配置list_view，保存在数据库中
- 系统会自动计算，为master_detail类型的字段，在主表中自动生成子表的list_views, 使用默认列
- columns 用于定义指定list_view显示的列
- sort 用于定义指定list_view的排序方式，可以同时定义多种排序方式。sort属性为数组，暂时只支持按照一个字段排序，预留多个字段排序的功能。
- 实例:
	- list_views:
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


### SAAS 多租户
Creator支持多租户的环境，并自动生成多租户相关的代码。
- 用户必须先选择工作区才能开始操作，也就是Session.get("spaceId")不为空
- 新增记录时，自动加上space字段
- 查询列表时，自动加上space字段

Creator自定义object独立数据库
配置环境变量：
- MONGO_URL_CREATOR：数据库地址
- MONGO_OPLOG_URL_CREATOR：oplog地址
