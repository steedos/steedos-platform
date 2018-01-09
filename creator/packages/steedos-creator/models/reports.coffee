Creator.Objects.reports = 
	name: "reports"
	label: "reports"
	icon: "report"
	fields:
		name: 
			type: "text"
			required: true
		object_name: 
			type: "text"
			required: true
		description: 
			type: "textarea"
			is_wide: true
		template:
			type: "textarea"
			is_wide: true

	list_views:
		default:
			columns: ["name"]
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