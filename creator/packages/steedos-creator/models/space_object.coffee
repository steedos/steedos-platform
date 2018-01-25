Creator.Objects.space_objects = 
	name: "space_objects"
	label: "自定义对象"
	icon: "orders"
	fields:
		name: 
			label: "Name"
			type: "text"
		icon: 
			label: "Name"
			type: "text"
		description: 
			label: "Description"
			type: "text"
		"fields.$.name":
			type: "text"
		"fields.$.type":
			type: "select"
			allowedValues: ["text", "number", "boolean"]


	list_views:
		default:
			columns: ["name", "description", "modified"]
		all:
			filter_scope: "space"

	permission_set:
		user:
			allowCreate: true
			allowDelete: true
			allowEdit: true
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: true 
		admin:
			allowCreate: true
			allowDelete: true
			allowEdit: true
			allowRead: true
			modifyAllRecords: true
			viewAllRecords: true 
