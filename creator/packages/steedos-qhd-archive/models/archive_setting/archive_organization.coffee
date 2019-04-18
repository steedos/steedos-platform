Creator.Objects.archive_organization = 
	name: "archive_organization"
	icon: "flow"
	label: "机构"
	enable_search: false
	fields:
		name:
			type:"text"
			label:"机构名称"
			is_name:true
			is_wide:true
			required:true
		code:
			type:"text"
			label:"机构代码"
			is_wide:true
			required:true
	list_views:
		all:
			columns:["name","code"]
			filter_scope: "space"
			label:"全部"
	permission_set:
		user:
			allowCreate: false
			allowDelete: false
			allowEdit: false
			allowRead: false
			modifyAllRecords: false
			viewAllRecords: false 
		admin:
			allowCreate: true
			allowDelete: true
			allowEdit: true
			allowRead: true
			modifyAllRecords: true
			viewAllRecords: true 