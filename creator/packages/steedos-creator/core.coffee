@Creator = {}

Creator.Objects = {}
Creator.Collections = {}
Creator.TabularTables = {}


Meteor.startup ->
	_.each Creator.Objects, (obj, collection_name)->
		if !Creator.Collections[collection_name]
			_simpleSchema = new SimpleSchema(obj.schema)
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

Creator.getObjectColumns = (obj, list_view) ->
	cols = []
	_.each obj.list_views?[list_view]?.columns, (column_name)->
		col = {}
		col.data = column_name
		col.title = obj.schema[column_name]?.label
		cols.push(col)
	return cols
