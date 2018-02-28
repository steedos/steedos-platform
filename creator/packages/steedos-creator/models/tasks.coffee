Creator.Objects.tasks = 
	label: "任务"
	name: "tasks"
	label: "Tasks"
	icon: "task"
	fields:
		name: 
			label: "主题"
			type: "text"
			required: true
			is_wide: true
			searchable:true
			index:true
		assigned_to:
			label: "被分配人"
			type: "lookup"
			reference_to: "users"
			multiple: true
		start_date:
			label: "开始时间"
			type: "datetime"
			omit: true
		end_date: 
			label: "到期时间"
			type: "datetime"
		#暂时注释掉的，因为信息上报发包要creator
		# contact:
		# 	type: "lookup"
		# 	reference_to: "contacts"
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
			required: true
			is_wide: true

	list_views:
		default:
			columns: ["name", "assigned_to", "end_date"]
		recent:
			label: "最近查看"
			filter_scope: "space"
		my_tasks:
			label: "我的任务"
			filter_scope: "space"
			filters: [["assigned_to", "=", "{userId}"]]
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