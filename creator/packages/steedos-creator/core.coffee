@Creator = {}

Creator.Collections = {}
Creator.TabularTables = {} 


Creator.objectClientInit = (collection_name, object)->
	if object and !Creator.Collections[collection_name]
		_simpleSchema = new SimpleSchema(JSON.parse(object.schema))
		Creator.Collections[collection_name] = new Meteor.Collection(collection_name)
		Creator.Collections[collection_name].attachSchema(_simpleSchema)
		Creator.TabularTables[collection_name] = new Tabular.Table
			name: "objects",
			collection: Creator.Collections[collection_name],
			columns: [
				{ data: "name" },
			]
			dom: "tp"
			extraFields: ["_id"]
			lengthChange: false
			ordering: false
			pageLength: 10
			info: false
			searching: true
			autoWidth: true
			
	return object

Creator.objectServerInit = (collection_name) ->
	object = Creator.Collections.objects.findOne({code: collection_name})
	if object and !Creator.Collections[collection_name]
		_simpleSchema = new SimpleSchema(JSON.parse(object.schema))
		Creator.Collections[collection_name] = new Meteor.Collection(collection_name)
		Creator.Collections[collection_name].attachSchema(_simpleSchema)
		Creator.TabularTables[collection_name] = new Tabular.Table
			name: "objects",
			collection: Creator.Collections[collection_name],
			columns: [
				{ data: "name" },
			]
			dom: "tp"
			extraFields: ["_id"]
			lengthChange: false
			ordering: false
			pageLength: 10
			info: false
			searching: true
			autoWidth: true
	return object