Creator.Objects.permission_objects = 
	name: "permission_objects"
	label: "Object Permissions"
	fields: 
		name:
			type: "text",
		permission_set_id: 
			type: "master_detail"
			reference_to: "permission_set"
		object_name: 
			type: "text"
		allowCreate: 
			type: "boolean"
		allowDelete: 
			type: "boolean"
		allowEdit: 
			type: "boolean"
		allowRead: 
			type: "boolean"
		modifyAllRecords: 
			type: "boolean"
		viewAllRecords: 
			type: "boolean" 
	list_views:
		default:
			columns: ["name", "permission_set_id", "object_name", "allowCreate", "allowDelete", "allowEdit", "allowRead", "modifyAllRecords", "viewAllRecords"]
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