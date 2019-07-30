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
			required: true

		related_to:
			label: "相关项"
			type: "lookup"
			index: true
			reference_to: ()->
				o = []
				_.each Creator.Objects, (object, object_name)->
					if object.enable_tasks
						o.push object.name
				return o

		description:
			label: "描述"
			type: "textarea"
			is_wide: true

		company_id:
			required: true
			omit: false
			hidden: false

		# tags:
		# 	label: "标签"
		# 	type: "text"
		# 	multiple: true

		# is_closed:
		# 	label: "已完成"
		# 	type: "boolean"

	list_views:
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
			columns: ["name", "due_date", "state", "assignees", "related_to"]
			filter_scope: "space"

		calendar_view: {
			type: 'calendar',
			label: '日历视图',
			filter_scope: "space",
#			filters: [["is_deleted", "=", false], ["state", "=", "enabled"]],
			options: {
				startDateExpr: 'created',
				endDateExpr: 'due_date',
				textExpr: 'name',
				title: ['name', 'due_date', 'assignees', 'state'],
				currentView: 'month'
				groups: ['state']
				resources: [{
					fieldExpr: "state"
					dataSource: [{
						text : "未开始",
						id: 'not_started',
						color: "rgb(118, 118, 118)"
					},{
						text : "进行中",
						id: 'in_progress',
						color: "rgb(29, 186, 174)"
					},{
						text : "已完成",
						id: 'completed',
						color: "rgb(32, 194, 46)"
					},{
						text : "暂停",
						id: 'paused',
						color: "rgb(118, 118, 118)"
					}]
				}]
			}
		}

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