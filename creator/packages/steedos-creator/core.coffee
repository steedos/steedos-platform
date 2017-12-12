@Creator = {}

Creator.Objects = {}
Creator.Collections = {}
Creator.TabularTables = {}

Creator.baseSchema = 
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
		type: Date,
		optional: true
		autoform: 
			omit: true
	modified_by:
		type: String,
		optional: true
		autoform: 
			omit: true


Meteor.startup ->
	_.each Creator.Objects, (obj, collection_name)->
		if !Creator.Collections[collection_name]
			schema = Creator.getObjectSchema(obj)
			_simpleSchema = new SimpleSchema(schema)
			Creator.Collections[collection_name] = new Meteor.Collection(collection_name)
			Creator.Collections[collection_name].attachSchema(_simpleSchema)
			Creator.TabularTables[collection_name] = new Tabular.Table
				name: collection_name,
				collection: Creator.Collections[collection_name],
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
				Creator.Collections[collection_name].allow
					insert: (userId, doc) ->
						return true
					update: (userId, doc) ->
						return true
					remove: (userId, doc) ->
						return true

				Creator.Collections[collection_name].before.insert (userId, doc)->
					doc.owner = userId
					doc.created_by = userId;
					doc.created = new Date();
					doc.modified_by = userId;
					doc.modified = new Date();

				Creator.Collections[collection_name].before.update (userId, doc, fieldNames, modifier, options)->
					modifier.$set = modifier.$set || {};
					modifier.$set.modified_by = userId
					modifier.$set.modified = new Date();


Creator.getObjectSchema = (obj) ->
	if obj?.schema
		schema = JSON.parse(JSON.stringify(obj.schema))
		_.extend(schema, Creator.baseSchema)
		return schema

Creator.getObjectColumns = (obj, list_view) ->
	cols = []
	_.each obj.list_views?[list_view]?.columns, (column_name)->
		col = {}
		col.data = column_name
		col.title = obj.schema[column_name]?.label
		cols.push(col)
	return cols
