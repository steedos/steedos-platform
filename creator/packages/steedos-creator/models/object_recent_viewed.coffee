Creator.Objects.object_recent_viewed = 
	name: "object_recent_viewed"
	label: "最近查看"
	icon: "forecasts"
	fields: 
		record_id:
			type: "text"
		object_name: 
			type: "text"
			searchable:true
			index:true
		space:
			type: "text",
			omit: true
	permission_set:
		user:
			allowCreate: false
			allowDelete: false
			allowEdit: false
			allowRead: false
			modifyAllRecords: false
			viewAllRecords: false 
		admin:
			allowCreate: false
			allowDelete: false
			allowEdit: false
			allowRead: false
			modifyAllRecords: false
			viewAllRecords: false 

if Meteor.isServer
	Meteor.publish "object_recent_viewed", (object_name)->
		collection = Creator.Collections["object_recent_viewed"]
		return collection.find({object_name: object_name, created_by: this.userId}, {fields: {record_id: 1, object_name: 1}, sort: {modified: -1}, limit: 20})

