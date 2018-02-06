Template.mobileView.onRendered ->
	self = this

	self.$(".mobile-view").removeClass "hidden"
	self.$(".mobile-view").animateCss "fadeInRight"

	self.autorun ->
		object_name = Template.instance().data.object_name
		record_id = Template.instance().data.record_id
		if object_name and record_id
			Creator.subs["Creator"].subscribe "steedos_object_tabular", "creator_" + object_name, [record_id], {}


	# 此处不使用method而是使用订阅去获取相关object的record，避免添加数据之后，前台获取的数据条数没有发生变化
	self.autorun ->
		object_name = Template.instance().data.object_name
		record_id = Template.instance().data.record_id
		spaceId = Steedos.spaceId()
		if object_name and record_id and spaceId
			related_objects = Creator.getRelatedList(object_name, record_id)
			_.each related_objects, (obj) ->
				Creator.subs["Creator"].subscribe "related_objects_records", object_name, obj.object_name, obj.related_field_name, record_id, spaceId

Template.mobileView.helpers
	record_id: ()->
		return Template.instance().data.record_id

	record_name: ()->
		object_name = Template.instance().data.object_name
		record_id = Template.instance().data.record_id
		record = Creator.getObjectRecord(object_name, record_id)
		name_field_key = Creator.getObject(object_name).NAME_FIELD_KEY
		if record and name_field_key
			return record[name_field_key]

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
	
	object_icon: (object_name)->
		unless object_name
			object_name = Template.instance().data.object_name
		
		return Creator.getObject(object_name).icon

	object_label: (object_name)->
		unless object_name
			object_name = Template.instance().data.object_name

		return Creator.getObject(object_name).label

	related_objects: ()->
		object_name = Template.instance().data.object_name
		record_id = Template.instance().data.record_id
		return Creator.getRelatedList(object_name, record_id)

	related_records_counts: (related_object_name, related_field_name)->
		object_name = Template.instance().data.object_name
		record_id = Template.instance().data.record_id
		spaceId = Steedos.spaceId()
		userId = Meteor.userId()
		if related_object_name == "cfs.files.filerecord"
			selector = {"metadata.space": spaceId}
		else
			selector = {space: spaceId}
		
		if related_object_name == "cms_files"
			# 附件的关联搜索条件是定死的
			selector["parent.o"] = object_name
			selector["parent.ids"] = [record_id]
		else
			selector[related_field_name] = record_id

		permissions = Creator.getPermissions(related_object_name, spaceId, userId)
		if !permissions.viewAllRecords and permissions.allowRead
			selector.owner = userId

		return Creator.Collections[related_object_name].find(selector).count()

	related_object_url: (related_object_name)->
		app_id = Template.instance().data.app_id
		object_name = Template.instance().data.object_name
		record_id = Template.instance().data.record_id
		Creator.getRelatedObjectUrl(object_name, app_id, record_id, related_object_name)

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
		template.$(".scroller").css({"transform": "translate3d(0px, 0px, 0px)"})

	'click .select-related': (event, template)->
		template.$(".select-detail").removeClass("selected")
		$(event.currentTarget).addClass("selected")
		width = template.$(".indicator-bar").width()
		template.$(".indicator-bar").css({"transform": "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, #{width}, 0, 0, 1)"})
		template.$(".scroller").css({"transform": "translate3d(-50%, 0px, 0px)"})
