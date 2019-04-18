Creator.Objects.archive_audit = 
	name: "archive_audit"
	icon: "note"
	label: "日志记录"
	enable_search: false
	fields:
		business_status:
			type: "select"
			label:"业务状态"
			options:[
				{label:"历史行为",value:"历史行为"},
				{label:"计划任务",value:"计划任务"}
			]
			is_wide:true
			sortable:true
		business_activity:
			type: "text"
			label:"业务行为"
			is_name:true
			sortable:true
		action_time:
			type: "datetime"
			label:"行为时间"
			sortable:true
		action_user:
			type:"lookup"
			label:"行为人员"
			reference_to:"users"
		action_mandate:
			type: "textarea"
			label:"行为依据"
			is_wide:true
			sortable:true
		action_description:
			type: "textarea"
			label:"行为描述"
			searchable:true
			index:true
			is_wide:true
		action_administrative_records_id:
			label: "行为对象"
			type: "master_detail"
			reference_to: "archive_wenshu"
		instace_id:
			label:"表单"
			type:"text"
	list_views:
		all:
			label: "全部"
			filter_scope: "space"
			columns: ["business_status", "business_activity","action_user","action_time","action_description"]
	permission_set:
		user:
			allowCreate: false
			allowDelete: false
			allowEdit: false
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: true 
		admin:
			allowCreate: false
			allowDelete: false
			allowEdit: true
			allowRead: true
			modifyAllRecords: true
			viewAllRecords: true 

	triggers:
		"before.insert.server.default": 
			on: "server"
			when: "before.insert"
			todo: (userId, doc)->
				doc.created_by = userId;
				doc.created = new Date()
				doc.owner = userId
				return true
