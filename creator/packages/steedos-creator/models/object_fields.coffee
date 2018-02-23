Creator.Objects.object_fields = 
	name: "object_fields"
	label: "字段"
	icon: "orders"
	enable_api: true
	fields:
		object:
			type: "master_detail"
			reference_to: "objects"
		name: 
			type: "text"
			searchable:true
			index:true
		description: 
			label: "Description"
			type: "text"
		type: 
			type: "select"
			allowedValues: ["text", "number", "boolean"]

	list_views:
		default:
			columns: ["name", "description", "modified"]

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