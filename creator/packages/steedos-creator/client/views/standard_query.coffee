Template.standard_query_modal.helpers 
	schema: ()->
		object_name = Session.get("object_name")
		object = Creator.getObject(object_name)
			
		new_schema = new SimpleSchema(Creator.getObjectSchema(object))
		obj_schema = new_schema._schema
		object_fields = object.fields
		searchable_fields = []
		_.each object_fields, (field, key)->
			if field.searchable
				searchable_fields.push(key)
		schema = {}
		_.each searchable_fields, (field)->
			console.log field
			schema[field] = obj_schema[field]
			if ["lookup", "master_detail", "select", "checkbox"].includes(object_fields[field].type)
				schema[field].autoform.multiple = true
				schema[field].type = [String]

			if ["date", "datetime"].includes(object_fields[field.type])
				schema[field + "_endDate"] =  obj_schema[field]
				schema[field + "_endDate"].autoform.readonly = false
				schema[field + "_endDate"].autoform.disabled = false
				schema[field + "_endDate"].autoform.omit = false

			
			if schema[field].autoform
				schema[field].autoform.readonly = false
				schema[field].autoform.disabled = false
				schema[field].autoform.omit = false

		return new SimpleSchema(schema)

	fields: ()->
		object_name = Session.get("object_name")
		object = Creator.getObject(object_name)

		object_fields = object.fields
		searchable_fields = []
		_.each object_fields, (field, key)->
			if field.searchable
				if ["date", "datetime"].includes(field.type)
					searchable_fields.push([key, key + "_endDate"])
				else
					searchable_fields.push([key])

		return searchable_fields

	label: (name)->
		return AutoForm.getLabelForField(name)

Template.standard_query_modal.events
	'click .btn-confirm': (event, template)->
		query = AutoForm.getFormValues("standardQueryForm").insertDoc
		object_name = Session.get("object_name")

		Session.set 'standard_query', {object_name; object_name, query: query}
		Modal.hide(template)

