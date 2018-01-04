Creator.Objects.archives_business = 
	name: "archives_business"
	icon: "campaign"
	label: "业务行为"
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
		action_mandate:
			type: "textarea"
			label:"行为依据"
			is_wide:true
			sortable:true
		action_description:
			type: "textarea"
			label:"行为描述"
			is_wide:true
		administrative_records_id:
			label: "文书档案"
			type: "master_detail"
			reference_to: "archives_administrative_records"
	list_views:
		default:
			columns: ["business_status", "business_activity","action_time","action_mandate",
						"action_description"]
		recent:
			label: "最近查看"
			filter_scope: "space"
		all:
			label: "全部业务"
			filter_scope: "space"

	permissions:
		user:
			allowCreate: true
			allowDelete: true
			allowEdit: true
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: false 
		admin:
			allowCreate: true
			allowDelete: true
			allowEdit: true
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: true 


