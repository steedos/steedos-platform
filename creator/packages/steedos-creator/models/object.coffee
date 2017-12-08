@Objects = new Mongo.Collection('calendar_objects');

Objects._simpleSchema = new SimpleSchema
	title:
		type: String
		max: 50
		optional: true
