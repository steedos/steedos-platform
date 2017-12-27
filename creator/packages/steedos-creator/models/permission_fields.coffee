Creator.Objects.permission_fields = 
	name: "permission_fields"
	label: "Field Permissions"
	fields: 
		name:
			type: "text",
		permission_set_id: 
			type: "master_detail"
			reference_to: "permission_set"
		object_name: 
			type: "text"
		field_name: 
			type: "text"
		allowEdit: 
			type: "boolean"
		allowRead: 
			type: "boolean"
	list_views:
		default:
			columns: ["name", "permission_set_id", "object_name", "allowEdit", "allowRead"]
		all:
			filter_scope: "space"

	permission_set:
		user:
			allowCreate: false
			allowDelete: false
			allowEdit: false
			allowRead: false
			modifyAllRecords: false
			viewAllRecords: false 
		admin:
			allowCreate: true
			allowDelete: true
			allowEdit: true
			allowRead: true
			modifyAllRecords: true
			viewAllRecords: true 