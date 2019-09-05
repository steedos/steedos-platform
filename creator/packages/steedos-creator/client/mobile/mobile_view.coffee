Template.mobileView.onCreated ->
	this.action_collection = new ReactiveVar()
	this.action_collection_name = new ReactiveVar()
	this.action_fields = new ReactiveVar()
	this.recordsTotal = new ReactiveVar({})

Template.mobileView.onRendered ->
	self = this

	self.$(".mobile-view").removeClass "hidden"
	self.$(".mobile-view").animateCss "fadeInRight", ->

	self.autorun ->
		object_name = self.data.object_name
		record_id = self.data.record_id
		if object_name and record_id
			relatedList = Creator.getRelatedList(object_name, record_id)
			relatedList.forEach (relatedObject)->
				filters = Creator.getODataRelatedFilter(object_name, relatedObject.object_name, record_id)
				options =
					filter: filters
				Creator.odata.queryCount relatedObject.object_name, options, (count, error)->
					if !error and count != false
						recordsTotal = self.recordsTotal.get()
						recordsTotal[relatedObject.object_name] = count
						self.recordsTotal.set recordsTotal


	# 此处不使用method而是使用订阅去获取相关object的record，避免添加数据之后，前台获取的数据条数没有发生变化
	self.autorun ->
		object_name = Template.instance().data.object_name
		record_id = Template.instance().data.record_id
		spaceId = Steedos.spaceId()
		if object_name and record_id and spaceId
			related_objects = Creator.getRelatedList(object_name, record_id)
			_.each related_objects, (obj) ->
				Creator.subs["Creator"].subscribe "related_objects_records", object_name, obj.object_name, obj.related_field_name, record_id, spaceId

Template.mobileView.helpers Creator.helpers

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

	allowCreate: (object_name)->
		unless object_name
			object_name = Template.instance().data.object_name

		if object_name == "cms_files"
			return false
		return Creator.getPermissions(object_name).allowCreate

	object_label: (object_name)->
		unless object_name
			object_name = Template.instance().data.object_name

		return Creator.getObject(object_name).label

	related_lists: ()->
		object_name = Template.instance().data.object_name
		record_id = Template.instance().data.record_id
		return Creator.getRelatedList(object_name, record_id)

	related_records_counts: (related_object_name, related_field_name)->
		if related_object_name
			recordsTotal = Template.instance().recordsTotal.get()
			if !_.isEmpty(recordsTotal) and related_object_name
				return recordsTotal[related_object_name]

	related_object_url: (related_object_name)->
		app_id = Template.instance().data.app_id
		object_name = Template.instance().data.object_name
		record_id = Template.instance().data.record_id
		Creator.getRelatedObjectUrl(object_name, app_id, record_id, related_object_name)

	collection: ()->
		return Template.instance()?.action_collection.get()
		# object_name = Template.instance().data.object_name
		# return "Creator.Collections." + object_name

	collectionName: ()->
		return Template.instance()?.action_collection_name.get()

	fields: ()->
		return Template.instance().action_fields.get()

	actions: ()->
		record_id = Template.instance().data.record_id
		object_name = Template.instance().data.object_name
		actions = Creator.getActions(object_name)
		permissions = Creator.getPermissions(object_name)

		actions = _.filter actions, (action)->
			if action.on == "record" or action.on == "record_more" or action.on == "record_only"
				if typeof action.visible == "function"
					return action.visible(object_name, record_id, permissions)
				else
					return action.visible
			else
				return false
		return actions

Template.mobileView.events
	'click .mobile-view-back': (event, template)->
		lastUrl = urlQuery[urlQuery.length - 2]
		urlQuery.pop()
		template.$(".mobile-view").animateCss "fadeOutRight", ->
			Blaze.remove(template.view)         
			if lastUrl
				FlowRouter.go lastUrl
			else
				FlowRouter.go '/app'

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

	'click .action-manage': (event, template)->
		template.$(".view-action-mask").css({"opacity": "1", "display": "block"})
		template.$(".view-action-actionsheet").css({"opacity": "1", "display": "block"})
		template.$(".view-action-actionsheet").addClass("weui-actionsheet_toggle")

	'click .weui-actionsheet__cell': (event, template)->
		template.$(".view-action-mask").css({"opacity": "0", "display": "none"})
		template.$(".view-action-actionsheet").css({"opacity": "0", "display": "none"})
		template.$(".view-action-actionsheet").removeClass("weui-actionsheet_toggle")

	'click .view-action-mask': (event, template)->
		template.$(".view-action-mask").css({"opacity": "0", "display": "none"})
		template.$(".view-action-actionsheet").css({"opacity": "0", "display": "none"})
		template.$(".view-action-actionsheet").removeClass("weui-actionsheet_toggle")

	'click .add-related-record': (event, template)->
		record_id = Template.instance().data.record_id
		object_name = Template.instance().data.object_name
		related_object_name = this.object_name
		related_object_label = Creator.getObject(related_object_name).label
		related_lists = Creator.getRelatedList(object_name, record_id)
		related_field_name = _.findWhere(related_lists, {object_name: related_object_name}).related_field_name
		template.action_collection.set("Creator.Collections." + related_object_name)
		template.action_collection_name.set(related_object_label)
		Session.set 'cmDoc', {"#{related_field_name}": record_id}
		Meteor.defer ->
			$(".btn-add-related-record").click()

	'click .view-action': (event, template)->
		record_id = Template.instance().data.record_id
		object_name = Template.instance().data.object_name
		object = Creator.getObject(object_name)
		template.action_collection.set("Creator.Collections." + object_name)
		template.action_collection_name.set(object.label)
		if this.name == "standard_delete"
			Session.set "reload_dxlist", false
			Creator.executeAction object_name, this, record_id, null, ()->
				Session.set "reload_dxlist", true
				template.$(".mobile-view-back").click()
		else
			Creator.executeAction object_name, this, record_id, $(event.currentTarget)

	'click .group-section-control': (event, template)->
		$(event.currentTarget).closest('.group-section').toggleClass('slds-is-open')

	'click .view-page-block-item': (event, template)->
		field = this.toString()
		record_id = Template.instance().data.record_id
		object_name = Template.instance().data.object_name
		object = Creator.getObject(object_name)
		record = Creator.getObjectRecord(object_name, record_id)
		template.action_collection.set("Creator.Collections." + object_name)
		template.action_collection_name.set(object.label)
		template.action_fields.set(field)
		Session.set "cmDoc", record
		Meteor.defer ->
			$(".btn-edit-cellrecord").click()

AutoForm.hooks addRelatedRecord:
	onSuccess: (formType, result)->
		Session.set("reload_dxlist", true)

AutoForm.hooks editRecord:
	onSuccess: (formType, result)->
		Session.set("reload_dxlist", true)