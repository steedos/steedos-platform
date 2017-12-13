@Creator = {}

Creator.Objects = {}
Creator.Collections = {}
Creator.TabularTables = {}



Meteor.startup ->
	_.each Creator.Objects, (obj, object_name)->
		if !Creator.Collections[object_name]
			schema = Creator.getObjectSchema(obj)
			_simpleSchema = new SimpleSchema(schema)
			Creator.Collections[object_name] = new Meteor.Collection(object_name)
			Creator.Collections[object_name].attachSchema(_simpleSchema)
			Creator.TabularTables[object_name] = new Tabular.Table
				name: object_name,
				collection: Creator.Collections[object_name],
				columns: Creator.getObjectColumns(obj, "default")
				dom: "tp"
				extraFields: ["_id"]
				lengthChange: false
				ordering: false
				pageLength: 10
				info: false
				searching: true
				autoWidth: true
				
			if Meteor.isServer
				Creator.Collections[object_name].allow
					insert: (userId, doc) ->
						return true
					update: (userId, doc) ->
						return true
					remove: (userId, doc) ->
						return true

				Creator.Collections[object_name].before.insert (userId, doc)->
					doc.owner = userId
					doc.created_by = userId;
					doc.created = new Date();
					doc.modified_by = userId;
					doc.modified = new Date();

				Creator.Collections[object_name].before.update (userId, doc, fieldNames, modifier, options)->
					modifier.$set = modifier.$set || {};
					modifier.$set.modified_by = userId
					modifier.$set.modified = new Date();


Creator.getObjectSchema = (obj) ->

	baseSchema = 
		owner:
			type: String,
			optional: true
			autoform: 
				omit: true
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
			type: "Date",
			optional: true
			autoform: 
				omit: true
		modified_by:
			type: String,
			optional: true
			autoform: 
				omit: true

		last_activity: 
			type: Date,
			optional: true
			autoform: 
				omit: true
		last_viewed: 
			type: Date,
			optional: true
			autoform: 
				omit: true
		last_referenced: 
			type: Date,
			optional: true
			autoform: 
				omit: true

	schema = {}
	_.each obj.fields, (field, field_name)->

		fs = {}
		fs.autoform = {}
		fs.label = field.label
		if field.type == "text"
			fs.type = "String"
		else if field.type == "textarea"
			fs.type = "String"
			fs.autoform.type = "textarea"
			fs.autoform.rows = 3
		else if field.type == "date"
			fs.type = "Date"
		else if field.type == "datetime"
			fs.type = "Date"

		if !field.required
			fs.optional = true

		schema[field_name] = fs

	_.extend(schema, baseSchema)

	return schema

Creator.getObjectColumns = (obj, list_view) ->
	cols = []
	_.each obj.list_views?[list_view]?.columns, (column_name)->
		if obj.fields[column_name]?.type
			col = {}
			col.title = obj.fields[column_name]?.label
			col.data = column_name
			col.render =  (val, type, doc) ->
				if (val instanceof Date) 
					return moment(val).format('YYYY-MM-DD H:mm')
				else if (val == null)
					return ""
				else
					return val;
			cols.push(col)
	return cols
