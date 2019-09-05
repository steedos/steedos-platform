_expandFields = (object_name, columns)->
	expand_fields = []
	fields = Creator.getObject(object_name).fields
	_.each columns, (n)->
		if fields[n]?.type == "master_detail" || fields[n]?.type == "lookup"
			if fields[n].reference_to
				ref = fields[n].reference_to
				if _.isFunction(ref)
					ref = ref()
			else
				ref = fields[n].optionsFunction({}).getProperty("value")

			if !_.isArray(ref)
				ref = [ref]

			ref = _.map ref, (o)->
				key = Creator.getObject(o)?.NAME_FIELD_KEY || "name"
				return key

			ref = _.compact(ref)

			ref = _.uniq(ref)

			ref = ref.join(",")
			if ref && n.indexOf("$") < 0
				if n.indexOf(".") < 0
					expand_fields.push(n)
				else
					expand_fields.push(n.replace('.', '/'))
#		else if fields[n].type == 'grid'
#			expand_fields.push(n)
	return expand_fields

loadRecordFromOdata = (template, object_name, record_id)->
	object = Creator.getObject(object_name)

	_fields = object.fields

	_keys = _.keys(_fields)
	_keys = _keys.filter (k)->
		if k.indexOf(".") < 0
			return true
		else
			return false
	expand = _expandFields(object_name, _.keys(_fields))
	record = Creator.odata.get(object_name, record_id, _keys.join(","), expand.join(","))
	template.record.set(record)


Template.creator_view.onCreated ->
	this.recordsTotal = new ReactiveVar({})
	this.recordLoad = new ReactiveVar(false)
	this.record = new ReactiveVar()
	this.agreement = new ReactiveVar()
	object_name = Session.get "object_name"
	object = Creator.getObject(object_name)
	template = Template.instance()
	this.onEditSuccess = onEditSuccess = (formType,result)->
		loadRecordFromOdata(template, Session.get("object_name"), Session.get("record_id"))
		$('#afModal').modal('hide')
	this.agreement.set('odata')
	AutoForm.hooks creatorEditForm:
		onSuccess: onEditSuccess
	,false
#	if object.database_name && object.database_name != 'meteor-mongo'
#		this.agreement.set('odata')
#		AutoForm.hooks creatorEditForm:
#			onSuccess: onEditSuccess
#		,false
#	else
#		this.agreement.set('subscribe')

loadRecord = ()->
	object_name = Session.get "object_name"
	record_id = Session.get "record_id"
	object = Creator.getObject(object_name)
	object_fields = object.fields
#	if object_name and record_id
#		if !object.database_name || !object.database_name == 'meteor-mongo'
#			fields = Creator.getFields(object_name)
#			ref_fields = {}
#			_.each fields, (f)->
#				if f.indexOf(".")  < 0
#					ref_fields[f] = 1
#			Creator.subs["Creator"].subscribe "steedos_object_tabular", "creator_" + object_name, [record_id], ref_fields, Session.get("spaceId")
#		else
#			loadRecordFromOdata(Template.instance(), object_name, record_id)
	if object_name and record_id
		loadRecordFromOdata(Template.instance(), object_name, record_id)

addFieldInfo = (element)->
	element.$(".has-inline-text").each ->
		id = "info_" + $(this).attr("for").replace(".", "_")
		html = """
						<span class="help-info" id="#{id}">
							<i class="ion ion-information-circled"></i>
						</span>
					"""
		$(".slds-form-element__label", $(this)).append(html)

	element.$(".info-popover").each ->
		_id = $("~ .slds-form-element .help-info", $(this)).attr("id");
		$(this).dxPopover
			target: "#" + _id,
			showEvent: "mouseenter",
			hideEvent: "mouseleave",
			position: "top",
			width: 300,
			animation: {
				show: {
					type: "pop",
					from: {
						scale: 0
					},
					to: {
						scale: 1
					}
				},
				hide: {
					type: "fade",
					from: 1,
					to: 0
				}
			}

Template.creator_view.onRendered ->
	self = this
	this.autorun ->
		record_id = Session.get("record_id")
		if record_id
			$(".creator-view-tabs-link").closest(".slds-tabs_default__item").removeClass("slds-is-active")
			$(".creator-view-tabs-link").attr("aria-selected", false)

			$(".creator-view-tabs-link[data-tab='creator-quick-form']").closest(".slds-tabs_default__item").addClass("slds-is-active")
			$(".creator-view-tabs-link[data-tab='creator-quick-form']").attr("aria-selected", false)

			$(".creator-view-tabs-content").removeClass("slds-show").addClass("slds-hide")
			$("#creator-quick-form").addClass("slds-show")

	if Steedos.isMobile()
		this.autorun ->
			loadRecord()
	else
		this.autorun ->
			if Session.get("record_id")
				Tracker.nonreactive(loadRecord)

	this.autorun ->
		if Creator.subs["Creator"].ready()
			Template.instance().recordLoad.set(true)

	Meteor.defer ()->
		addFieldInfo(self)

Template.creator_view.helpers Creator.helpers

Template.creator_view.helpers
	form_horizontal: ()->
		if Session.get("app_id") == "admin"
			return window.innerWidth > (767 + 250)
		else
			return window.innerWidth > 767

	hasUnObjectField: (t)->
		r = false;

		if t && t.length > 0
			_object = Creator.getObject(Session.get("object_name"))
			_.find t, (fieldKey)->
				if !fieldKey
					return
				field = _object.fields[fieldKey]
				if field
					if _object.schema._schema[fieldKey]?.type.name != 'Object'
						r = true;
					if field.type == 'lookup' || field.type == 'master_detail'
						reference_to = field.reference_to
						if _.isFunction(reference_to)
							reference_to = reference_to()
						if _.isArray(reference_to)
							r = true;
					return r;
		return r;

	isObjectField: (fieldKey)->
		if !fieldKey
			return
		_object = Creator.getObject(Session.get("object_name"))
		return _object.schema._schema[fieldKey]?.type.name == 'Object' && _object.fields[fieldKey].type != 'lookup' && _object.fields[fieldKey].type != 'master_detail'

	objectField: (fieldKey)->
		schema = Creator.getObject(Session.get("object_name")).schema
		name = schema._schema[fieldKey].label
		schemaFieldKeys = _.map(schema._objectKeys[fieldKey + '.'], (k)->
			return fieldKey + '.' + k
		)
		schemaFieldKeys = schemaFieldKeys.filter (key)->
			# 子表字段不应该显示hidden字段
			schemaFieldItem = schema._schema[key]
			if schemaFieldItem
				return !(schemaFieldItem.autoform?.type == "hidden")
			else
				return false

		fields = Creator.getFieldsForReorder(schema, schemaFieldKeys)
		return {
			name: name
			fields: fields
		}

	collection: ()->
		return "Creator.Collections." + Creator.getObject(Session.get("object_name"))._collection_name

	schema: ()->
		schema = new SimpleSchema(Creator.getObjectSchema(Creator.getObject(Session.get("object_name"))))
		#在只读页面将omit字段设置为false
		_.forEach schema._schema, (f, key)->
			if f.autoform?.omit
				f.autoform.omit = false
		return schema

	schemaFields: ()->
		object = Creator.getObject(Session.get("object_name"))
		simpleSchema = new SimpleSchema(Creator.getObjectSchema(object))
		schema = simpleSchema._schema
		# 不显示created/modified，因为它们显示在created_by/modified_by字段后面
		firstLevelKeys = _.without simpleSchema._firstLevelSchemaKeys, "created", "modified"
		permission_fields = Creator.getFields()

#		_.forEach schema, (field, name)->
#			if field.type == Object && field.autoform
#				field.autoform.type = 'hidden'

		fieldGroups = []
		fieldsForGroup = []

		grouplessFields = []
		grouplessFields = Creator.getFieldsWithNoGroup(schema)
		grouplessFields = Creator.getFieldsInFirstLevel(firstLevelKeys, grouplessFields)
		if permission_fields
			grouplessFields = _.intersection(permission_fields, grouplessFields)
#		grouplessFields = Creator.getFieldsWithoutOmit(schema, grouplessFields)
		grouplessFields = Creator.getFieldsForReorder(schema, grouplessFields)

		fieldGroupNames = Creator.getSortedFieldGroupNames(schema)
		_.each fieldGroupNames, (fieldGroupName) ->
			fieldsForGroup = Creator.getFieldsForGroup(schema, fieldGroupName)
			fieldsForGroup = Creator.getFieldsInFirstLevel(firstLevelKeys, fieldsForGroup)
			if permission_fields
				fieldsForGroup = _.intersection(permission_fields, fieldsForGroup)
#			fieldsForGroup = Creator.getFieldsWithoutOmit(schema, fieldsForGroup)
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
#		return record[key]
		key.split('.').reduce (o, x) ->
				o?[x]
		, record

	keyField: (key) ->
		fields = Creator.getObject().fields
		return fields[key]

	is_wide: (key) ->
		fields = Creator.getObject().fields
		return fields[key]?.is_wide

	full_screen: (key) ->
		fields = Creator.getObject().fields
		if fields[key]?.type is "markdown"
			return true
		else
			return false

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
			return record.label || record[name_field_key]

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
		record = Creator.getCollection(object_name).findOne record_id
		recordPerminssion = Creator.getRecordPermissions object_name, record, Meteor.userId()
		if recordPerminssion
			return recordPerminssion[permissionName]


	object: ()->
		return Creator.getObject()

	object_name: ()->
		return Session.get "object_name"

	related_list: ()->
		return Creator.getRelatedList(Session.get("object_name"), Session.get("record_id"))

	related_list_count: (obj)->
		if obj
			object_name = obj.object_name
			recordsTotal = Template.instance().recordsTotal.get()
			if !_.isEmpty(recordsTotal) and object_name
				return recordsTotal[object_name]

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
			else if object_name == "instances"
				instances = Creator.getObjectRecord()?.instances || []
				selector["_id"] = { $in: _.pluck(instances, "_id") }
			else if Session.get("object_name") == "objects"
				recordObjectName = Creator.getObjectRecord()?.name
				selector[related_field_name] = recordObjectName
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

	isUnlocked: ()->
		if Creator.getPermissions(Session.get('object_name')).modifyAllRecords
			return true
		record = Creator.getObjectRecord()
		return !record?.locked

	detail_info_visible: ()->
		return Session.get("detail_info_visible")

	actions: ()->
		actions = Creator.getActions()
		object_name = Session.get "object_name"
		record_id = Session.get "record_id"
		record = Creator.getCollection(object_name).findOne(record_id)
		userId = Meteor.userId()
		record_permissions = Creator.getRecordPermissions object_name, record, userId
		actions = _.filter actions, (action)->
			if action.on == "record" or action.on == "record_only"
				if typeof action.visible == "function"
					return action.visible(object_name, record_id, record_permissions)
				else
					return action.visible
			else
				return false
		return actions

	moreActions: ()->
		actions = Creator.getActions()
		object_name = Session.get "object_name"
		record_id = Session.get "record_id"
		record = Creator.getCollection(object_name).findOne(record_id)
		userId = Meteor.userId()
		record_permissions = Creator.getRecordPermissions object_name, record, userId
		actions = _.filter actions, (action)->
			if action.on == "record_more"
				if typeof action.visible == "function"
					return action.visible(object_name, record_id, record_permissions)
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

	cell_data: (key)->
		record = Creator.getObjectRecord()
		data = {}
		data._id = record._id
		data.val = record[key]
		data.doc = record
		data.field = Creator.getObject().fields[key]
		data.field_name = key
		data.object_name = Session.get("object_name")
		data.disabled = true
		data.parent_view = "record_details"
		return data

	list_data: (obj) ->
		object_name = Session.get "object_name"
		related_object_name = obj.object_name
		return {related_object_name: related_object_name, object_name: object_name, recordsTotal: Template.instance().recordsTotal, is_related: true}

	enable_chatter: ()->
		return Creator.getObject(Session.get("object_name"))?.enable_chatter

	show_chatter: ()->
		return Template.instance().recordLoad.get() && Creator.getObjectRecord()

	agreement: ()->
		return Template.instance().agreement.get()

	showEditIcon: ()->
		return Steedos.isMobile() && this.name == 'standard_edit'

	hasInlineHelpText: (key)->
		object_name = Session.get "object_name"
		fields = Creator.getObject(object_name).fields
		return fields[key]?.inlineHelpText

Template.creator_view.events

	'click .record-action-custom': (event, template) ->
		console.log('click action');
		record = Creator.getObjectRecord()
		objectName = Session.get("object_name")
		object = Creator.getObject(objectName)
		recordId = record._id
		collection_name = object.label
		Session.set("action_fields", undefined)
		Session.set("action_collection", "Creator.Collections.#{object._collection_name}")
		Session.set("action_collection_name", collection_name)
		Session.set("action_save_and_insert", true)
		if this.todo == "standard_delete"
			action_record_title = record[object.NAME_FIELD_KEY]
			Creator.executeAction objectName, this, recordId, action_record_title, Session.get("list_view_id")
		else
			Creator.executeAction objectName, this, recordId, $(event.currentTarget)

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

#	'click #creator-tabular .table-cell-edit': (event, template) ->
#		field = this.field_name
#		if this.field.depend_on && _.isArray(this.field.depend_on)
#			field = _.clone(this.field.depend_on)
#			field.push(this.field_name)
#			field = field.join(",")
#
#		object_name = this.object_name
#		collection_name = Creator.getObject(object_name).label
#
#		dataTable = $(event.currentTarget).closest('table').DataTable()
#		tr = $(event.currentTarget).closest("tr")
#		rowData = dataTable.row(tr).data()
#
#		if rowData
#			Session.set("action_fields", field)
#			Session.set("action_collection", "Creator.Collections.#{object_name}")
#			Session.set("action_collection_name", collection_name)
#			Session.set("action_save_and_insert", false)
#			Session.set 'cmDoc', rowData
#
#			Meteor.defer ()->
#				$(".btn.creator-cell-edit").click()

	'click .group-section-control': (event, template) ->
		$(event.currentTarget).closest('.group-section').toggleClass('slds-is-open')

	'click .add-related-object-record': (event, template) ->
		object_name = event.currentTarget.dataset.objectName
		collection_name = Creator.getObject(object_name).label
		collection = "Creator.Collections.#{Creator.getObject(object_name)._collection_name}"
		current_object_name = Session.get("object_name")

		relatedKey = ""
		relatedValue = Session.get("record_id")
		Creator.getRelatedList(current_object_name, relatedValue).forEach (related_obj) ->
			if object_name == related_obj.object_name
				relatedKey = related_obj.related_field_name
		
		ids = Creator.TabularSelectedIds[object_name]
		if ids?.length
			# 列表有选中项时，取第一个选中项，复制其内容到新建窗口中
			# 这的第一个指的是第一次勾选的选中项，而不是列表中已勾选的第一项
			record_id = ids[0]
			doc = Creator.odata.get(object_name, record_id)
			Session.set 'cmDoc', doc
			# “保存并新建”操作中自动打开的新窗口中需要再次复制最新的doc内容到新窗口中
			Session.set 'cmShowAgainDuplicated', true
		else if current_object_name == "objects"
			recordObjectName = Creator.getObjectRecord().name
			Session.set 'cmDoc', {"#{relatedKey}": recordObjectName}
		else if relatedKey
			Session.set 'cmDoc', {"#{relatedKey}": {o: current_object_name, ids: [relatedValue]}}

		Session.set("action_fields", undefined)
		Session.set("action_collection", collection)
		Session.set("action_collection_name", collection_name)
		Session.set("action_save_and_insert", true)
		Meteor.defer ()->
			$(".creator-add-related").click()
		return

	'click .list-item-action': (event, template) ->
		actionKey = event.currentTarget.dataset.actionKey
		objectName = event.currentTarget.dataset.objectName
		recordId = event.currentTarget.dataset.recordId
		object = Creator.getObject(objectName)
		action = object.actions[actionKey]
		collection_name = object.label
		Session.set("action_fields", undefined)
		Session.set("action_collection", "Creator.Collections.#{object._collection_name}")
		Session.set("action_collection_name", collection_name)
		Session.set("action_save_and_insert", true)
		Creator.executeAction objectName, action, recordId

	'click .slds-table td': (event)->
		$(".slds-table td").removeClass("slds-has-focus")
		$(event.currentTarget).addClass("slds-has-focus")

	'click #creator-quick-form .table-cell-edit': (event, template)->
		# $(".creator-record-edit").click()
		full_screen = this.full_screen
		field = this.field_name
		_fs = field.split('.')
		if _fs.length > 1
			schema = Creator.getObject(Session.get("object_name")).schema
			_obj_fields = _.map(schema._objectKeys[_fs[0] + '.'], (k)->
				return _fs[0] + '.' + k
			)
			field = _fs[0] + ',' + _obj_fields.join(',')

		if this.field.depend_on && _.isArray(this.field.depend_on)
			field = _.clone(this.field.depend_on)
			field.push(this.field_name)
			field = field.join(",")
		object_name = this.object_name
		collection_name = Creator.getObject(object_name).label
		doc = Creator.odata.get(object_name, Session.get("record_id"))
		if doc
			Session.set("cmFullScreen", full_screen)
			Session.set("action_fields", field)
			Session.set("action_collection", "Creator.Collections.#{Creator.getObject(object_name)._collection_name}")
			Session.set("action_collection_name", collection_name)
			Session.set("action_save_and_insert", false)
#			cmDoc = {}
#			objectFields = Creator.getObject(object_name).fields
#			_.each doc, (v, k)->
#				if template.agreement.get() == 'subscribe'
#					cmDoc[k] =v
#				else
#					if (objectFields[k]?.type == 'lookup' || objectFields[k]?.type == 'master_detail') && objectFields[k]?.reference_to
#						if objectFields[k].multiple
#							cmDoc[k] =  _.pluck(doc[k], "_id")
#						else
#							cmDoc[k] = doc[k]?._id
#					else if( v && _.keys(v).length > 0 && !_.isArray(v) && _.isObject(v))
#						cmDoc[k] = {}
#						_.each _.keys(v), (_sk)->
#							cmDoc[k][_sk] = _.pluck(doc[k][_sk], "_id")
#					else
#						cmDoc[k] =v
#			Session.set 'cmDoc', cmDoc
			Session.set 'cmDoc', doc
			Meteor.defer ()->
				$(".btn.creator-edit").click()

	'change .input-file-upload': (event, template)->
		dataset = event.currentTarget.dataset
		parent = dataset?.parent
		targetObjectName = dataset?.targetObjectName
		files = event.currentTarget.files
		i = 0
		record_id = Session.get("record_id")
		object_name = Session.get("object_name")
		spaceId = Session.get("spaceId")
		dxDataGridInstance = $(".related-object-tabular").find(".gridContainer.#{targetObjectName}").dxDataGrid().dxDataGrid('instance')
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
					if responseText.errors
						responseText.errors.forEach (e) ->
							toastr.error e.errorMessage
							return
						return
					toastr.success TAPi18n.__('Attachment was added successfully')
					Template.creator_grid.refresh dxDataGridInstance
					return
				error: (xhr, msg, ex) ->
					$(document.body).removeClass 'loading'
					if ex
						msg = ex
					if msg == "Request Entity Too Large"
						msg = "creator_request_oversized"
					toastr.error t(msg)
					return
			i++
		$(event.target).val("")

Template.creator_view.onDestroyed ()->
	self = this
	_.each(AutoForm._hooks.creatorEditForm.onSuccess, (fn, index)->
		if fn == self.onEditSuccess
			delete AutoForm._hooks.creatorEditForm.onSuccess[index]
	)