Creator.Collections.objects = new Mongo.Collection('objects');

Creator.Collections.objects._simpleSchema = new SimpleSchema
	name:
		type: String
		max: 50
	code:
		type: String
		max: 50
	description:
		type: String
		optional: true
		max: 50
		autoform:
			rows: 2
	schema: 
		type: String
		optional: true
		autoform:
			rows: 10
	created:
		type: Date,
		optional: true
		autoform: 
			omit: true
	created_by:
		type: String,
		optional: true
		autoform: 
			omit: true
	modified:
		type: Date,
		optional: true
		autoform: 
			omit: true
	modified_by:
		type: String,
		optional: true
		autoform: 
			omit: true

Creator.Collections.objects.attachSchema(Creator.Collections.objects._simpleSchema);


if Meteor.isServer
	Creator.Collections.objects.allow 
		insert: (userId, doc) ->
			# if (!Steedos.isSpaceAdmin(doc.space, userId))
			# 	return false
			# else
				return true

		update: (userId, doc) ->
			# if (!Steedos.isSpaceAdmin(doc.space, userId))
			# 	return false
			# else
				return true

		remove: (userId, doc) ->
			# if (!Steedos.isSpaceAdmin(doc.space, userId))
			# 	return false
			# else
				return true

Creator.TabularTables["objects"] = new Tabular.Table
	name: "objects",
	collection: Creator.Collections.objects,
	columns: [
		{ data: "name" },
		{ data: "code" },
		{ data: "description" },
		{ data: "modified" }
	]
	dom: "tp"
	extraFields: ["_id", "space", "schema"]
	lengthChange: false
	ordering: false
	pageLength: 10
	info: false
	searching: true
	autoWidth: true
