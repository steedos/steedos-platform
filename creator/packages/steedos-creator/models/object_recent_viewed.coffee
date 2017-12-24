Creator.Objects.object_recent_viewed = 
	name: "object_recent_viewed"
	label: "Object Recent Viewed"
	fields: 
		record_ids:
			type: "[text]"
		object_name: 
			type: "text"
		space:
			type: "text",
			omit: true

if Meteor.isServer
	Meteor.publish "object_recent_viewed", (object_name)->
		collection = Creator.Collections["object_recent_viewed"]
		return collection.find({object_name: object_name, created_by: this.userId}, {fields: {record_ids: 1, object_name: 1}, sort: {modified: -1}, limit: 1})

