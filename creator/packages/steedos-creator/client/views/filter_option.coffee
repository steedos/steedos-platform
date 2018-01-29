Template.filter_option.helpers 
	schema:() -> 
		object_name = Template.instance().data?.object_name
		unless object_name
			object_name = Session.get("object_name")
		template = Template.instance()
		schema= 
			field:
				type: String
				label: "field"
				autoform:
					type: "select"
					defaultValue: ()->
						return "name"
					options: ()->
						keys = Creator.getSchema(object_name)._firstLevelSchemaKeys
						schema = Creator.getSchema(object_name)._schema
						keys = _.map keys, (key) ->
							obj = _.pick(schema, key)
							label = obj[key].label
							return {label: label, value: key}
						return keys
			operation:
				type: String
				label: "operation"
				autoform:
					type: "select"
					defaultValue: ()->
						return "EQUALS"
					options: ()->
						options = [
							{label: "equals", value: "EQUALS"},
							{label: "not equal to", value: "NOT_EQUAL"},
							{label: "less than", value: "LESS_THAN"},
							{label: "greater than", value: "GREATER_THAN"},
							{label: "less or equal", value: "LESS_OR_EQUAL"},
							{label: "greater or equal", value: "GREATER_OR_EQUAL"},
							{label: "contains", value: "CONTAINS"},
							{label: "does not contain", value: "NOT_CONTAIN"},
							{label: "starts with", value: "STARTS_WITH"},
						]
			value:
				type: String
				label: "value"
				autoform:
					type:()->
						return template.schema_type.get()
					options: ()->
						field = template.schema_field.get()
						schema_type = template.schema_type.get()
						if field and schema_type == "select"
							schema = Creator.getSchema(object_name)._schema
							obj = _.pick(schema, field)
							options = obj[field].autoform?.options
							return options

		new SimpleSchema(schema)

	filter_item: ()->
		object_name = Template.instance().data?.object_name
		unless object_name
			object_name = Session.get("object_name")
		filter_item = Template.instance().data?.filter_item
		schema_type = ""
		if filter_item and filter_item.field
			Template.instance().schema_field.set(filter_item.field)
			_schema = Creator.getSchema(object_name)._schema
			_.each _schema, (obj, key)->
				if key == filter_item.field
					schema_type = obj.autoform.type || "text"
		
		Template.instance().schema_type.set(schema_type)
		return filter_item

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
		index = this.index
		filter_items = Session.get("filter_items")
		filter_items[index] = filter

		Session.set("filter_items", filter_items)
		# template.$(".uiPanel--default").remove()
		Meteor.defer ->
			Blaze.remove(template.view)

	'click .save-scope': (event, template) ->
		filter_scope = $("input[name='choose-filter-scope']:checked").val()
		Session.set("filter_scope", filter_scope)
		Meteor.defer ->
			Blaze.remove(template.view)

	'change select[name="field"]': (event, template) ->
		object_name = template.data?.object_name
		unless object_name
			object_name = Session.get("object_name")
		field = $(event.currentTarget).val()
		_schema = Creator.getSchema(object_name)._schema
		type = ""
		_.each _schema, (obj, key)->
			if key == field
				type = obj.autoform.type || "text"
		template.schema_field.set(field)
		template.schema_type.set(type)

Template.filter_option.onCreated ->
	this.schema_field = new ReactiveVar()
	this.schema_type = new ReactiveVar()