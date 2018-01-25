Creator.Objects.archive_rules = 
	name: "archive_rules"
	icon: "timeslot"
	label: "规则"
	enable_search: false
	fields:
		fieldname:
			type:"select"
			label:"匹配字段"
			options: [
				{label:"标题",value:"title"},
				{label:"归档部门",value:"dept"}
			]
			defaultValue:"title"
		keywords:
			type:"[text]"
			label:"关键词"
			is_wide:true
			required:true
		classification:
			type:"master_detail"
			label:"设置为分类"
			reference_to:"archive_classification"
		retention:
			type:"master_detail"
			label:"设置为保管期限"
			reference_to:"archive_retention"
		
	permission_set:
		user:
			allowCreate: true
			allowDelete: true
			allowEdit: true
			allowRead: true
			modifyAllRecords: true
			viewAllRecords: true 
		admin:
			allowCreate: true
			allowDelete: true
			allowEdit: true
			allowRead: true
			modifyAllRecords: true
			viewAllRecords: true 
	list_views:
		default:
			columns:["fieldname","classification","keywords","retention"]
		all:
			label:"全部分类规则"

