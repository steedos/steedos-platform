Creator.Objects.object_permissions = 
	name: "object_permissions"
	label: "Permissions"
	fields: 
		name:
			type: "text",
		object_name: 
			type: "master_detail"
			reference_to: "objects"
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
		organizations: 
			type: "lookup",
			reference_to: "organizations"
	list_views:
		default:
			columns: ["name", "object_name", "allowCreate", "allowDelete", "allowEdit", "allowRead", "modifyAllRecords", "viewAllRecords"]
		all:
			filter_scope: "spacex"

if Meteor.isServer
	Meteor.publish "object_permissions", (object_name)->
		collection = Creator.Collections["object_permissions"]
		return collection.find({object_name: object_name}, {fields: {record_id: 1, object_name: 1}, sort: {modified: -1}, limit: 10})

