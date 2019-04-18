Creator.Objects.archive_rules = 
	name: "archive_rules"
	icon: "timeslot"
	label: "规则"
	enable_search: false
	fields:
		fieldname:
			label:"匹配字段"
			type:"lookup"
			optionsFunction: (values)->
				return Creator.getObjectLookupFieldOptions "archive_wenshu", true
			defaultValue:"title"
		keywords:
			type:"[text]"
			label:"关键词"
			is_wide:true
		retention:
			type:"master_detail"
			label:"保管期限"
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
		all:
			label:"全部"
			filter_scope: "space"
			columns:["fieldname","keywords","retention"]

