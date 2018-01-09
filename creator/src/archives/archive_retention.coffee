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