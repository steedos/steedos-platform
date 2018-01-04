Creator.Objects.archives_business = 
	name: "archives_business"
	icon: ""
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
		business_activity:
			type: "text"
			label:"业务行为"
		action_time:
			type: "datetime"
			label:"行为时间"
		action_mandate:
			type: "textarea"
			label:"行为依据"
			is_wide:true
		action_description:
			type: "textarea"
			label:"行为描述"
			is_wide:true



