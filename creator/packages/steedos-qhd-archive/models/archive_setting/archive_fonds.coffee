Creator.Objects.archive_fonds = 
	name: "archive_fonds"
	icon: "flow"
	label: "全宗"
	enable_search: false
	fields:
		name:
			type:"text"
			label:"单位名称"
			is_name:true
			is_wide:true
			required:true

		code:
			type:"text"
			label:"全宗号"
			is_wide:true
			# required:true

		company:
			label: "对应组织"
			type: "lookup"
			reference_to: "organizations"

	list_views:
		all:
			columns:["name","code","company"]
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