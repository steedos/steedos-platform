Creator.Objects.archive_fonds = 
	name: "archive_fonds"
	icon: "flow"
	label: "全宗管理"
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
			required:true
	list_views:
		default:
			columns:["name","code"]
		all:
			label:"所有全宗"