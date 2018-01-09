Creator.Objects.tasks = 
	name: "tasks"
	label: "Tasks"
	icon: "task"
	fields:
		name: 
			type: "text"
			required: true
			is_wide: true
		description: 
			type: "textarea"
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
		related_to:
			type: "lookup"
			reference_to: ()->
				return _.keys(Creator.Objects) 

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