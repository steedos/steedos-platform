Creator.Objects.tasks = 
	name: "tasks"
	label: "Tasks"
	icon: "task"
	fields:
		name: 
			type: "text"
			required: true
			is_wide: true
		assigned_to:
			type: "lookup"
			reference_to: "users"
			multiple: true
		start_date:
			type: "datetime"
			omit: true
		end_date: 
			type: "datetime"
		contact:
			type: "lookup"
			reference_to: "contacts"
		related_to:
			type: "lookup"
			reference_to: ()->
				o = []
				_.each Creator.Objects, (object, object_name)->
					if object.enable_tasks
						o.push object_name
				return o 

		description: 
			type: "textarea"
			required: true
			is_wide: true

	list_views:
		default:
			columns: ["name"]
		my_tasks:
			filter_scope: "space"
			filters: [["assigned_to", "$eq", "{userId}"]]
		all:
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