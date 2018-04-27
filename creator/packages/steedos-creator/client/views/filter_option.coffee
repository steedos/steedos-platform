Template.filter_option.helpers Creator.helpers

Template.filter_option.helpers 
	schema:() -> 
		object_name = Template.instance().data?.object_name
		unless object_name
			object_name = Session.get("object_name")
		template = Template.instance()

		schema_key = template.schema_key.get()
		object_fields = Creator.getObject(object_name).fields

		schema= 
			field:
				type: String
				label: "field"
				autoform:
					type: "select"
					defaultValue: ()->
						return "name"
					firstOption: ""
					options: ()->
						keys = Creator.getSchema(object_name)._firstLevelSchemaKeys
						permission_fields = Creator.getFields(object_name)
						schema = Creator.getSchema(object_name)._schema
						keys = _.map keys, (key) ->
							# hidden,grid 类型的字段，不需要过滤
							if object_fields[key].hidden or object_fields[key].type == "grid"
								return undefined
							if _.indexOf(permission_fields, key) > -1
								obj = _.pick(schema, key)
								label = obj[key].label || TAPi18n.__(Creator.getObject(object_name).schema.label(key))
								return {label: label, value: key}
						keys = _.compact(keys)
						return keys
			operation:
				type: String
				label: "operation"
				autoform:
					type: "select"
					defaultValue: ()->
						return "="
					firstOption: ""
					options: ()->
						if object_fields[schema_key]
							console.log "schema_key is:", schema_key
							return Creator.getFieldOperation(object_fields[schema_key].type)
						else
							return Creator.getFieldOperation("text")
			value:
				type: ->
					return template.schema_obj.get()?.type || String
				label: "value"
				autoform:
					type: "text"

		if schema_key
			new_schema = new SimpleSchema(Creator.getObjectSchema(Creator.getObject(object_name)))
			obj_schema = new_schema._schema
			schema.value = obj_schema[schema_key]
			if ["lookup", "master_detail", "select", "checkbox"].includes(object_fields[schema_key].type)
				schema.value.autoform.multiple = true
				schema.value.type = [String]

				if object_fields[schema_key].type == "select"
					schema.value.autoform.type = "steedosLookups"
					schema.value.autoform.showIcon = false

			if schema.value.autoform
				schema.value.autoform.readonly = false
				schema.value.autoform.disabled = false
				schema.value.autoform.omit = false

		new SimpleSchema(schema)

	filter_item: ()->
		# filter_item = Template.instance().data?.filter_item
		filter_item = Template.instance().filter_item?.get()
		console.log filter_item
		return filter_item

	is_show_form: ()->
		filter_item = Template.instance().filter_item?.get()
		schema_key = Template.instance().schema_key?.get()
		# console.log "filter_item", filter_item
		if !filter_item.field
			return true
		else
			if schema_key
				return true
			else
				return false

	show_form: ()->
		return Template.instance().show_form.get()

	object_label: ()->
		object_name = Template.instance().data?.object_name
		unless object_name
			object_name = Session.get("object_name")
		return Creator.getObject(object_name).label

	is_scope_selected: (scope)->
		if scope == Session.get("filter_scope")
			return "checked"

Template.filter_option.events 
	'click .save-filter': (event, template) ->
		filter = AutoForm.getFormValues("filter-option").insertDoc
		# console.log filter
		index = this.index
		filter_items = Session.get("filter_items")
		filter_items[index] = filter

		Session.set("filter_items", filter_items)
		Meteor.defer ->
			Blaze.remove(template.view)

	'click .save-scope': (event, template) ->
		filter_scope = $("input[name='choose-filter-scope']:checked").val()
		Session.set("filter_scope", filter_scope)
		Meteor.defer ->
			Blaze.remove(template.view)

	'change select[name="field"]': (event, template) ->
		object_name = template.data?.object_name
		filter_item = template.filter_item.get()
		unless object_name
			object_name = Session.get("object_name")
		field = $(event.currentTarget).val()
		if field != filter_item?.field
			filter_item.value = ""
			template.filter_item.set(filter_item)
		_schema = Creator.getSchema(object_name)._schema
		template.show_form.set(false)
		template.schema_key.set(field)
		template.schema_obj.set(_schema[field])
		Meteor.defer ->
			template.show_form.set(true)

Template.filter_option.onCreated ->
	is_edit_scope = this.data.is_edit_scope
	unless is_edit_scope
		filter_item = this.data.filter_item
		object_name = this.data.object_name
		unless object_name
			object_name = Session.get("object_name")

		key = filter_item.field
		key_obj = Creator.getSchema(object_name)._schema[key]

		this.schema_key = new ReactiveVar(key)
		this.schema_obj = new ReactiveVar(key_obj)
		this.filter_item = new ReactiveVar(filter_item)

		this.show_form = new ReactiveVar(true)