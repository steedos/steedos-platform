Template.standard_query_modal.onCreated ->
	this.modalValue = new ReactiveVar()

Template.standard_query_modal.onRendered ->
	standard_query = Session.get("standard_query")
	if standard_query and standard_query.object_name == Session.get("object_name")
		this.modalValue.set(standard_query.query)

Template.standard_query_modal.helpers
	value: ()->
		return Template.instance().modalValue?.get()

	schema: ()->
		object_name = Session.get("object_name")
		object = Creator.getObject(object_name)
			
		new_schema = new SimpleSchema(Creator.getObjectSchema(object))
		obj_schema = new_schema._schema
		first_level_keys = new_schema._firstLevelSchemaKeys
		object_fields = object.fields
		searchable_fields = []
		_.each object_fields, (field, key)->
			if !field.hidden and field.type != "grid"
				searchable_fields.push(key)
		schema = {}
		searchable_fields = _.intersection(first_level_keys, searchable_fields)
		_.each searchable_fields, (field)->
			console.log field
			schema[field] = obj_schema[field]
			if ["lookup", "master_detail", "select", "checkbox"].includes(object_fields[field].type)
				schema[field].autoform.multiple = true
				schema[field].type = [String]

			if ["date", "datetime"].includes(object_fields[field].type)
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
		first_level_keys = Creator.getSchema(object_name)._firstLevelSchemaKeys

		object_fields = object.fields
		searchable_fields = []
		_.each object_fields, (field, key)->
			if !field.hidden and field.type != "grid" and first_level_keys.includes(key)
				if ["date", "datetime"].includes(field.type)
					searchable_fields.push([key, key + "_endDate"])
				else
					searchable_fields.push(key)

		return searchable_fields

	label: (name)->
		return AutoForm.getLabelForField(name)

	isArray: (val)->
		return _.isArray(val)

	isContainerVis: (fields)->
		console.log "isContainerVis", fields
		# 为了时间控件能够正常显示
		if fields.length < 4
			return true

Template.standard_query_modal.events
	'click .btn-reset': (event, template)->
		template.modalValue.set()
		AutoForm.resetForm("standardQueryForm")

	'click .btn-confirm': (event, template)->
		query = AutoForm.getFormValues("standardQueryForm").insertDoc
		object_name = Session.get("object_name")

		Session.set 'standard_query', {object_name: object_name, query: query}
		Modal.hide(template)

