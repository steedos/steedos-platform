Template.quickForm_slds.helpers
	isDisabled: (key)->
		object_name = Template.instance().data.atts.object_name
		fields = Creator.getObject(object_name)?.fields
		return fields[key]?.disabled
	hasInlineHelpText: (key)->
		object_name = Template.instance().data.atts.object_name
		fields = Creator.getObject(object_name)?.fields
		return fields[key]?.inlineHelpText

	is_range: (key)->
		return Template.instance()?.data?.qfAutoFormContext.schema._schema[key]?.autoform?.is_range

	schemaFields: ()->
		object_name = this.atts.object_name
		object = Creator.getObject(object_name)
		keys = []
		if object
			schemaInstance = this.qfAutoFormContext.schema
			schema = schemaInstance._schema

			firstLevelKeys = schemaInstance._firstLevelSchemaKeys
			permission_fields = this.qfAutoFormContext.fields || firstLevelKeys

			unless permission_fields
				permission_fields = []

			_.each schema, (value, key) ->
				if (_.indexOf firstLevelKeys, key) > -1
					if !value.autoform?.omit
						keys.push key

			if keys.length == 1
				finalFields =
					grouplessFields: [keys]
				return finalFields

			hiddenFields = Creator.getHiddenFields(schema)
			disabledFields = Creator.getDisabledFields(schema)

			fieldGroups = []
			fieldsForGroup = []
			isSingle = Session.get "cmEditSingleField"

			grouplessFields = []
			grouplessFields = Creator.getFieldsWithNoGroup(schema)
			grouplessFields = Creator.getFieldsInFirstLevel(firstLevelKeys, grouplessFields)
			if permission_fields
				grouplessFields = _.intersection(permission_fields, grouplessFields)
			grouplessFields = Creator.getFieldsWithoutOmit(schema, grouplessFields)
			grouplessFields = Creator.getFieldsForReorder(schema, grouplessFields, isSingle)

			fieldGroupNames = Creator.getSortedFieldGroupNames(schema)
			_.each fieldGroupNames, (fieldGroupName) ->
				fieldsForGroup = Creator.getFieldsForGroup(schema, fieldGroupName)
				fieldsForGroup = Creator.getFieldsInFirstLevel(firstLevelKeys, fieldsForGroup)
				if permission_fields
					fieldsForGroup = _.intersection(permission_fields, fieldsForGroup)
				fieldsForGroup = Creator.getFieldsWithoutOmit(schema, fieldsForGroup)
				fieldsForGroup = Creator.getFieldsForReorder(schema, fieldsForGroup, isSingle)
				fieldGroups.push
					name: fieldGroupName
					fields: fieldsForGroup

			finalFields =
				grouplessFields: grouplessFields
				groupFields: fieldGroups
				hiddenFields: hiddenFields
				disabledFields: disabledFields
			return finalFields

	horizontal: ()->
		return Template.instance().data.atts.horizontal

	is_range_fields: (fields)->
		if fields?.length > 0 && fields[0]
			return Template.instance()?.data?.qfAutoFormContext.schema._schema[fields[0]]?.autoform?.is_range

	has_wide_field: (fields)->
		if fields?.length > 0 && fields[0]
			return Template.instance()?.data?.qfAutoFormContext.schema._schema[fields[0]]?.autoform?.is_wide

Template.quickForm_slds.events
	'click .group-section-control': (event, template) ->
		event.preventDefault()
		event.stopPropagation()
		$(event.currentTarget).closest('.group-section').toggleClass('slds-is-open')