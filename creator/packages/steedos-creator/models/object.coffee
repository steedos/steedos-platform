db.objects = new Mongo.Collection('objects');

db.objects._simpleSchema = new SimpleSchema
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

db.objects.attachSchema(db.objects._simpleSchema);


TabularTables["objects"] = new Tabular.Table
	name: "objects",
	collection: db.objects,
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
