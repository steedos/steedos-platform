Creator.Objects.archive_retention = 
	name: "archive_retention"
	icon: "timeslot"
	label: "保管期限"
	enable_search: false
	fields:
		name:
			type:"text"
			label:"保管期限"
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
	list_views:
		default:
			columns:["name","code","years"]
		all:
			label:"所有"
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