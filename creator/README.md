# Steedos Creator
Have your own Salesforce like cloud based development platform, built with Steedos. 


### Listviews 用于定义Object的列表显示样式
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
