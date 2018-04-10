Creator.Objects.tasks = 
	name: "tasks"
	label: "任务"
	icon: "task"
	fields:
		name: 
			label: "主题"
			type: "text"
			required: true
			is_wide: true
			searchable:true
			index:true

		assignees:
			label: "分派给"
			type: "lookup"
			reference_to: "users"
			multiple: true

		due_date: 
			label: "截止时间"
			type: "datetime"
			sortable: true

		# start_date:
		# 	label: "开始时间"
		# 	type: "datetime"
		# 	hidden: true

		# end_date: 
		# 	label: "完成时间"
		# 	type: "datetime"
		# 	hidden: true

		state: 
			label: "状态"
			type: "select"
			options: [
				{label:"未开始", value:"not_started"}, 
				{label:"进行中", value:"in_progress"}, 
				{label: "已完成", value:"completed"}
				{label:"暂停", value:"paused"}, 
			]
			sortable: true

		related_to:
			label: "相关项"
			type: "lookup"
			reference_to: ()->
				o = []
				_.each Creator.Objects, (object, object_name)->
					if object.enable_tasks
						o.push object_name
				return o 

		description: 
			label: "描述"
			type: "textarea"
			is_wide: true

		tags:
			label: "标签"
			type: "text"
			multiple: true

		# is_closed:
		# 	label: "已完成"
		# 	type: "boolean"

	list_views:
		default:
			columns: ["name", "due_date", "state", "assignees", "related_to"]
		# recent:
		# 	label: "最近查看"
		# 	filter_scope: "space"
		my_open_tasks:
			label: "待办任务"
			filter_scope: "space"
			filters: [["assignees", "=", "{userId}"], ["state", "<>", "completed"]]
		my_closed_tasks:
			label: "已办任务"
			filter_scope: "space"
			filters: [["assignees", "=", "{userId}"], ["state", "=", "completed"]]
		created_tasks:
			label: "交办任务"
			filter_scope: "space"
			filters: [["owner", "=", "{userId}"]]
		all:
			label: "所有任务"
			filter_scope: "space"

	permission_set:
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
			modifyAllRecords: true
			viewAllRecords: true 