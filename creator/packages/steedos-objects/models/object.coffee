Creator.Objects.objects = 
	name: "objects"
	label: "对象"
	icon: "orders"
	fields:
		name: 
			label: "Name"
			type: "text"
			searchable:true
			index:true
		icon: 
			label: "Icon"
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
