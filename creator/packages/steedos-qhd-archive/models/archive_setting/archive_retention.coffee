Creator.Objects.archive_retention = 
	name: "archive_retention"
	icon: "timeslot"
	label: "保管期限"
	enable_search: false
	fields:
		name:
			type:"text"
			label:"名称"
			is_name:true
			is_wide:true
			required:true
			searchable:true
			index:true
		code:
			type:"text"
			label:"编码"
			required:true
		years:
			type:"number"
			label:"对应年限"
			required:true
		is_default:
			type: "boolean"
			label: "是否默认"
			required: true
			defaultValue: false
	list_views:
		all:
			label:"全部"
			filter_scope: "space"
			columns:["name","code","years","is_default"]
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