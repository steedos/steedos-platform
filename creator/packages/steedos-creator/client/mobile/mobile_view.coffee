Template.mobileView.onRendered ->
	this.$(".mobile-view").removeClass "hidden"
	this.$(".mobile-view").animateCss "fadeInRight"

	this.autorun ->
		object_name = Template.instance().data.object_name
		record_id = Template.instance().data.record_id
		if object_name and record_id
			Creator.subs["Creator"].subscribe "steedos_object_tabular", "creator_" + object_name, [record_id], {}

Template.mobileView.helpers
	record_id: ()->
		return Template.instance().data.record_id

	showForm: ()->
		object_name = Template.instance().data.object_name
		record_id = Template.instance().data.record_id
		if Creator.getObjectRecord(object_name, record_id)
			return true

	collection: ()->
		object_name = Template.instance().data.object_name
		return "Creator.Collections." + object_name

	record: ()->
		object_name = Template.instance().data.object_name
		record_id = Template.instance().data.record_id
		return Creator.getObjectRecord(object_name, record_id)

	schema: ()->
		object_name = Template.instance().data.object_name
		return Creator.getSchema(object_name)
	
	schemaFields: ()->
		object_name = Template.instance().data.object_name
		schema = Creator.getSchema(object_name)._schema
		firstLevelKeys = Creator.getSchema(object_name)._firstLevelSchemaKeys
		permission_fields = Creator.getFields(object_name)
		
		fieldGroups = []
		fieldsForGroup = []

		grouplessFields = []
		grouplessFields = Creator.getFieldsWithNoGroup(schema)
		grouplessFields = Creator.getFieldsInFirstLevel(firstLevelKeys, grouplessFields)
		if permission_fields
			grouplessFields = _.intersection(permission_fields, grouplessFields)
		grouplessFields = Creator.getFieldsWithoutOmit(schema, grouplessFields)
		grouplessFields = Creator.getFieldsForReorder(schema, grouplessFields)

		fieldGroupNames = Creator.getSortedFieldGroupNames(schema)
		_.each fieldGroupNames, (fieldGroupName) ->
			fieldsForGroup = Creator.getFieldsForGroup(schema, fieldGroupName)
			fieldsForGroup = Creator.getFieldsInFirstLevel(firstLevelKeys, fieldsForGroup)
			if permission_fields
				fieldsForGroup = _.intersection(permission_fields, fieldsForGroup)
			fieldsForGroup = Creator.getFieldsWithoutOmit(schema, fieldsForGroup)
			fieldsForGroup = Creator.getFieldsForReorder(schema, fieldsForGroup)
			fieldGroups.push
				name: fieldGroupName
				fields: fieldsForGroup

		finalFields = 
			grouplessFields: grouplessFields
			groupFields: fieldGroups

		return finalFields
	
	label: (key) ->
		return AutoForm.getLabelForField(key)

	keyValue: (key) ->
		object_name = Template.instance().data.object_name
		record_id = Template.instance().data.record_id
		record = Creator.getObjectRecord(object_name, record_id)
		return record[key]

	keyField: (key) ->
		object_name = Template.instance().data.object_name
		fields = Creator.getObject(object_name).fields
		return fields[key]

	object_name: ()->
		return Template.instance().data.object_name

Template.mobileView.events
	'click .mobile-view-back': (event, template)->
		lastUrl = urlQuery[urlQuery.length - 2]
		template.$(".mobile-view").animateCss "fadeOutRight", ->
			Blaze.remove(template.view)         
			urlQuery.pop()
			if lastUrl
				FlowRouter.go lastUrl
			else
				FlowRouter.go '/app/menu'

	'click .select-detail': (event, template)->
		template.$(".select-related").removeClass("selected")
		$(event.currentTarget).addClass("selected")
		template.$(".indicator-bar").css({"transform": "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)"})
		template.$(".record-detail-card").css({"transform": "translate3d(0px, 0px, 0px)"})

	'click .select-related': (event, template)->
		template.$(".select-detail").removeClass("selected")
		$(event.currentTarget).addClass("selected")
		width = template.$(".indicator-bar").width()
		template.$(".indicator-bar").css({"transform": "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, #{width}, 0, 0, 1)"})
		template.$(".record-detail-card").css({"transform": "translate3d(-100%, 0px, 0px)"})
