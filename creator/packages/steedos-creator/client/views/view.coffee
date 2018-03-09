Template.creator_view.onCreated ->

Template.creator_view.onRendered ->
	this.autorun ->
		record_id = Session.get("record_id")
		if record_id
			$(".creator-view-tabs-link").closest(".slds-tabs_default__item").removeClass("slds-is-active")
			$(".creator-view-tabs-link").attr("aria-selected", false)

			$(".creator-view-tabs-link[data-tab='creator-quick-form']").closest(".slds-tabs_default__item").addClass("slds-is-active")
			$(".creator-view-tabs-link[data-tab='creator-quick-form']").attr("aria-selected", false)

			$(".creator-view-tabs-content").removeClass("slds-show").addClass("slds-hide")
			$("#creator-quick-form").addClass("slds-show")

	this.autorun ->
		object_name = Session.get "object_name"
		record_id = Session.get "record_id"
		if object_name and record_id
			Creator.subs["Creator"].subscribe "steedos_object_tabular", "creator_" + object_name, [record_id], {}

Template.creator_view.helpers Creator.helpers

Template.creator_view.helpers

	collection: ()->
		return "Creator.Collections." + Session.get("object_name")

	schema: ()->
		return Creator.getSchema(Session.get("object_name"))

	schemaFields: ()->
		schema = Creator.getSchema(Session.get("object_name"))._schema
		firstLevelKeys = Creator.getSchema(Session.get("object_name"))._firstLevelSchemaKeys
		permission_fields = Creator.getFields()
		
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

	keyValue: (key) ->
		record = Creator.getObjectRecord()
		return record[key]

	keyField: (key) ->
		fields = Creator.getObject().fields
		return fields[key]

	label: (key) ->
		return AutoForm.getLabelForField(key)

	hasPermission: (permissionName)->
		permissions = Creator.getObject()?.permissions?.default
		if permissions
			return permissions[permissionName]

	record: ()->
		return Creator.getObjectRecord()

	record_name: ()->
		record = Creator.getObjectRecord()
		name_field_key = Creator.getObject()?.NAME_FIELD_KEY
		if record and name_field_key
			return record[name_field_key]

	backUrl: ()->
		return Creator.getObjectUrl(Session.get("object_name"), null)

	showForm: ()->
		if Creator.getObjectRecord()
			return true

	hasPermission: (permissionName)->
		permissions = Creator.getPermissions()
		if permissions
			return permissions[permissionName]

	recordPerminssion: (permissionName)->
		object_name = Session.get "object_name"
		record_id = Session.get "record_id"
		record = Creator.Collections[object_name].findOne record_id
		recordPerminssion = Creator.getRecordPermissions object_name, record, Meteor.userId()
		if recordPerminssion
			return recordPerminssion[permissionName]


	object: ()->
		return Creator.getObject()

	object_name: ()->
		return Session.get "object_name"

	related_list: ()->
		return Creator.getRelatedList(Session.get("object_name"), Session.get("record_id"))

	related_list_count: ()->
		info = Tabular.tableRecords.findOne("creator_" + this.object_name)
		return info?.recordsTotal

	related_selector: ()->
		object_name = this.object_name
		related_field_name = this.related_field_name
		record_id = Session.get "record_id"
		if object_name and related_field_name and Session.get("spaceId")
			if object_name == "cfs.files.filerecord"
				selector = {"metadata.space": Session.get("spaceId")}
			else
				selector = {space: Session.get("spaceId")}
			if object_name == "cms_files" || object_name == "tasks" || object_name == "notes"
				# 附件的关联搜索条件是定死的
				selector["#{related_field_name}.o"] = Session.get "object_name"
				selector["#{related_field_name}.ids"] = [record_id]
			else
				selector[related_field_name] = record_id
			permissions = Creator.getPermissions(object_name)
			if permissions.viewAllRecords
				return selector
			else if permissions.allowRead and Meteor.userId()
				selector.owner = Meteor.userId()
				return selector
		return {_id: "nothing to return"}

	appName: ()->
		app = Creator.getApp()
		return app?.name

	related_object: ()->
		return Creator.getObject(this.object_name)

	allowCreate: ()->
		return Creator.getPermissions(this.object_name).allowCreate

	detail_info_visible: ()->
		return Session.get("detail_info_visible")

	actions: ()->
		actions = Creator.getActions()
		permissions = Creator.getPermissions()
		object_name = Session.get "object_name"
		record_id = Session.get "record_id"

		if !actions
			return

		if permissions.actions
			return actions
		else	
			actions = _.filter actions, (action)->
				if action.on == "record"
					if action.only_list_item
						return false
					if typeof action.visible == "function"
						return action.visible(object_name, record_id, permissions)
					else
						return action.visible
				else
					return false
			return actions

	moreActions: ()->
		actions = Creator.getActions()
		permissions = Creator.getPermissions()
		object_name = Session.get "object_name"
		record_id = Session.get "record_id"

		actions = _.filter actions, (action)->
			if action.on == "record_more"
				if action.only_list_item
					return false
				if typeof action.visible == "function"
					return action.visible(object_name, record_id, permissions)
				else
					return action.visible
			else
				return false
		return actions
	
	isFileDetail: ()->
		return "cms_files" == Session.get "object_name"

	related_object_url: ()->
		object_name = Session.get "object_name"
		record_id = Session.get "record_id"
		app_id = Session.get "app_id"
		related_object_name = this.object_name
		return Creator.getRelatedObjectUrl(object_name, app_id, record_id, related_object_name)


Template.creator_view.events

	'click .record-action-custom': (event, template) ->
		id = Creator.getObjectRecord()._id
		objectName = Session.get("object_name")
		object = Creator.getObject(objectName)
		collection_name = object.label
		Session.set("action_fields", undefined)
		Session.set("action_collection", "Creator.Collections.#{objectName}")
		Session.set("action_collection_name", collection_name)
		Session.set("action_save_and_insert", true)
		Creator.executeAction objectName, this, id

	'click .creator-view-tabs-link': (event) ->
		$(".creator-view-tabs-link").closest(".slds-tabs_default__item").removeClass("slds-is-active")
		$(".creator-view-tabs-link").attr("aria-selected", false)

		$(event.currentTarget).closest(".slds-tabs_default__item").addClass("slds-is-active")
		$(event.currentTarget).attr("aria-selected", true)

		tab = "#" + event.currentTarget.dataset.tab
		$(".creator-view-tabs-content").removeClass("slds-show").addClass("slds-hide")
		$(tab).removeClass("slds-hide").addClass("slds-show")


	'click .slds-truncate > a': (event) ->
		Session.set("detail_info_visible", false)
		Tracker.afterFlush ()->
			Session.set("detail_info_visible", true)

	'dblclick .slds-table td': (event) ->
		$(".table-cell-edit", event.currentTarget).click();

	'dblclick #creator-quick-form .slds-form-element': (event) ->
		$(".table-cell-edit", event.currentTarget).click();

	'click #creator-tabular .table-cell-edit': (event, template) ->
		field = this.field_name
		if this.field.depend_on && _.isArray(this.field.depend_on)
			field = _.clone(this.field.depend_on)
			field.push(this.field_name)
			field = field.join(",")

		object_name = this.object_name
		collection_name = Creator.getObject(object_name).label

		dataTable = $(event.currentTarget).closest('table').DataTable()
		tr = $(event.currentTarget).closest("tr")
		rowData = dataTable.row(tr).data()

		if rowData
			Session.set("action_fields", field)
			Session.set("action_collection", "Creator.Collections.#{object_name}")
			Session.set("action_collection_name", collection_name)
			Session.set("action_save_and_insert", false)
			Session.set 'cmDoc', rowData

			Meteor.defer ()->
				$(".btn.creator-cell-edit").click()

	'click .group-section-control': (event, template) ->
		$(event.currentTarget).closest('.group-section').toggleClass('slds-is-open')

	'click .add-related-object-record': (event, template) ->
		object_name = event.currentTarget.dataset.objectName
		collection_name = Creator.getObject(object_name).label
		collection = "Creator.Collections.#{object_name}"

		relatedKey = ""
		relatedValue = Session.get("record_id")
		Creator.getRelatedList(Session.get("object_name"), Session.get("record_id")).forEach (related_obj) ->
			if object_name == related_obj.object_name
				relatedKey = related_obj.related_field_name

		if relatedKey
			Session.set 'cmDoc', {"#{relatedKey}": {o: Session.get("object_name"), ids: [relatedValue]}}

		Session.set("action_fields", undefined)
		Session.set("action_collection", collection)
		Session.set("action_collection_name", collection_name)
		Session.set("action_save_and_insert", true)
		Meteor.defer ()->
			$(".creator-add").click()
		return 

	'click .list-item-action': (event, template) ->
		actionKey = event.currentTarget.dataset.actionKey
		objectName = event.currentTarget.dataset.objectName
		recordId = event.currentTarget.dataset.recordId
		object = Creator.getObject(objectName)
		action = object.actions[actionKey]
		collection_name = object.label
		Session.set("action_fields", undefined)
		Session.set("action_collection", "Creator.Collections.#{objectName}")
		Session.set("action_collection_name", collection_name)
		Session.set("action_save_and_insert", true)
		Creator.executeAction objectName, action, recordId

	'click .slds-table td': (event)->
		$(".slds-table td").removeClass("slds-has-focus")
		$(event.currentTarget).addClass("slds-has-focus")

	'click #creator-quick-form .table-cell-edit': (event, template)->
		# $(".creator-record-edit").click()
		field = this.field_name
		if this.field.depend_on && _.isArray(this.field.depend_on)
			field = _.clone(this.field.depend_on)
			field.push(this.field_name)
			field = field.join(",")
		object_name = this.object_name
		collection_name = Creator.getObject(object_name).label
		doc = this.doc

		if doc
			Session.set("action_fields", field)
			Session.set("action_collection", "Creator.Collections.#{object_name}")
			Session.set("action_collection_name", collection_name)
			Session.set("action_save_and_insert", false)
			Session.set 'cmDoc', doc

			Meteor.defer ()->
				$(".btn.creator-edit").click()

	'change .input-file-upload': (event, template)->
		parent = event.currentTarget.dataset?.parent
		files = event.currentTarget.files
		i = 0
		record_id = Session.get("record_id")
		object_name = Session.get("object_name")
		spaceId = Session.get("spaceId")
		while i < files.length
			file = files[i]
			if !file.name
				continue
			fileName = file.name
			if [
					'image.jpg'
					'image.gif'
					'image.jpeg'
					'image.png'
				].includes(fileName.toLowerCase())
				fileName = 'image-' + moment(new Date).format('YYYYMMDDHHmmss') + '.' + fileName.split('.').pop()
			# Session.set 'filename', fileName
			# $('.loading-text').text TAPi18n.__('workflow_attachment_uploading') + fileName + '...'
			fd = new FormData
			fd.append 'Content-Type', cfs.getContentType(fileName)
			fd.append 'file', file
			fd.append 'record_id', record_id
			fd.append 'object_name', object_name
			fd.append 'space', spaceId
			fd.append 'owner', Meteor.userId()
			fd.append 'owner_name', Meteor.user().name
			if parent
				fd.append 'parent', parent
			$(document.body).addClass 'loading'
			$.ajax
				url: Steedos.absoluteUrl('s3/')
				type: 'POST'
				async: true
				data: fd
				dataType: 'json'
				processData: false
				contentType: false
				success: (responseText, status) ->
					fileObj = undefined
					$(document.body).removeClass 'loading'
					# $('.loading-text').text ''
					if responseText.errors
						responseText.errors.forEach (e) ->
							toastr.error e.errorMessage
							return
						return
					toastr.success TAPi18n.__('Attachment was added successfully')
					return
				error: (xhr, msg, ex) ->
					$(document.body).removeClass 'loading'
					# $('.loading-text').text ''
					toastr.error msg
					return
			i++

