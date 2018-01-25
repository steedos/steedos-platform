registeredAutoFormHooks = ['cmForm']
defaultFormId = 'cmForm'

cmOnSuccessCallback = null

AutoForm.addHooks 'cmForm',
	onSuccess: ->
		$('#afModal').modal('hide')

	onError: (operation,error) ->
		console.error error
		if error.reason
			toastr?.error?(t(error.reason))
		else if error.message
			toastr?.error?(t(error.message))
		else
			toastr?.error?(error)

collectionObj = (name) ->
	name.split('.').reduce (o, x) ->
		o[x]
	, window

getFieldsWithNoGroup = (schema)->
	fields = _.map(schema, (field, fieldName) ->
  		return (!field.autoform or !field.autoform.group) and fieldName
	)
	fields = _.compact(fields)
	return fields

getSortedFieldGroupNames = (schema)->
	names = _.map(schema, (field) ->
 		return field.autoform and field.autoform.group
	)
	names = _.compact(names)
	names = _.unique(names)
	return names

getFieldsForGroup = (schema, groupName) ->
  	fields = _.map(schema, (field, fieldName) ->
    	return field.autoform and field.autoform.group == groupName and fieldName
  	)
  	fields = _.compact(fields)
  	return fields

getFieldsWithoutOmit = (schema, keys) ->
	keys = _.map(keys, (key) ->
		field = _.pick(schema, key)
		if field[key].autoform?.omit
			return false
		else 
			return key
	)
	keys = _.compact(keys)
	return keys

getFieldsInFirstLevel = (firstLevelKeys, keys) ->
	keys = _.map(keys, (key) ->
		if _.indexOf(firstLevelKeys, key) > -1
			return key
		else
			return false
	)
	keys = _.compact(keys)
	return keys

getFieldsForReorder = (schema, keys) ->
	fields = []
	i = 0
	while i < keys.length
		sc_1 = _.pick(schema, keys[i])
		sc_2 = _.pick(schema, keys[i+1])

		is_wide_1 = false
		is_wide_2 = false

		_.each sc_1, (value) ->
			if value.autoform?.is_wide
				is_wide_1 = true

		_.each sc_2, (value) ->
			if value.autoform?.is_wide
				is_wide_2 = true

		if is_wide_1
			fields.push keys.slice(i, i+1)
			i += 1
		else if !is_wide_1 and is_wide_2
			childKeys = keys.slice(i, i+1)
			childKeys.push undefined
			fields.push childKeys
			i += 1
		else if !is_wide_1 and !is_wide_2
			childKeys = keys.slice(i, i+1)
			if keys[i+1]
				childKeys.push keys[i+1]
			else
				childKeys.push undefined
			fields.push childKeys
			i += 2
	
	return fields

Template.autoformModals.rendered = ->

	self = this;

	$('#afModal').modal(show: false)

	onEscKey = (e) ->
		if e.keyCode == 27
			$('#afModal').modal 'hide'

	$('#afModal').on 'show.bs.modal', ->
		self.shouldUpdateQuickForm.set(true)

		operation = Session.get 'cmOperation'
		if operation == 'update'
			AutoForm.resetForm(Session.get('cmFormId') or defaultFormId)


	$('#afModal').on 'shown.bs.modal', ->
		if Steedos?.setModalMaxHeight
			Steedos.setModalMaxHeight()
		$(window).bind 'keyup', onEscKey
		
		setTimeout ->
			$("#afModal .form-control:first").focus()
		, 100

	$('#afModal').on 'hidden.bs.modal', ->
		$(window).unbind 'keyup', onEscKey

		sessionKeys = [
			'cmCollection',
			'cmOperation',
			'cmDoc',
			'cmButtonHtml',
			'cmFields',
			'cmOmitFields',
			'cmButtonContent',
			'cmTitle',
			'cmButtonClasses',
			'cmPrompt',
			'cmTemplate',
			'cmLabelClass',
			'cmInputColClass',
			'cmPlaceholder',
			'cmFormId',
			'cmAutoformType',
			'cmMeteorMethod',
			'cmCloseButtonContent',
			'cmCloseButtonClasses',
			'cmShowRemoveButton',
			'cmIsMultipleUpdate',
			'cmTargetIds'
		]
		delete Session.keys[key] for key in sessionKeys

		Session.set("cmIsMultipleUpdate", false)

		self.shouldUpdateQuickForm.set(false)

		AutoForm.resetForm(Session.get('cmFormId') or defaultFormId)

		# 如果用户操作为保存并新建 再次触发一次点击事件 
		if Session.get 'cmShowAgain'
			keyPress = Session.get 'cmPressKey'
			keyPress = '.' + keyPress.replace(/\s+/ig, '.')
			$(keyPress).click()


Template.autoformModals.events

	'click button.btn-insert': (event,template) ->
		formId = Session.get('cmFormId') or defaultFormId
		$("#"+formId, "#afModal").submit()

	'click button.btn-update': (event,template)->
		isMultipleUpdate = Session.get('cmIsMultipleUpdate')
		targetIds = Session.get('cmTargetIds')
		isMultipleChecked = template.$(".ckb-multiple-update").is(":checked")
		formId = Session.get('cmFormId') or defaultFormId
		if isMultipleUpdate and isMultipleChecked and targetIds?.length > 1
			collection = Session.get 'cmCollection'
			target_ids = targetIds
			doc = AutoForm.getFormValues(formId).updateDoc
			object_name = Session.get("object_name")
			Meteor.call 'af_modal_multiple_update', { target_ids, doc, object_name}, (e)->
				if e
					console.error e
					if e.reason
						toastr?.error?(t(e.reason))
					else if e.message
						toastr?.error?(t(error.message))
					else
						toastr?.error?('Sorry, update failed.')
				else
					$('#afModal').modal('hide')
					cmOnSuccessCallback?()
		else
			$("#"+formId, "#afModal").submit()

	'click button.btn-remove': (event,template)->
		collection = Session.get 'cmCollection'
		operation = Session.get 'cmOperation'
		_id = Session.get('cmDoc')._id
		$("body").addClass("loading")
		collectionObj(collection).remove _id, (e)->
			$("body").removeClass("loading")
			if e
				console.error e
				if e.reason
					toastr?.error?(t(e.reason))
				else if e.message
					toastr?.error?(t(error.message))
				else
					toastr?.error?('Sorry, this could not be deleted.')
			else
				$('#afModal').modal('hide')
				cmOnSuccessCallback?()
				toastr?.success?(t("afModal_remove_suc"))

	'click button.btn-update-and-create': (event,template)->
		formId = Session.get('cmFormId') or defaultFormId
		$("#"+formId, "#afModal").submit()
		Session.set 'cmShowAgain', true

	'click button.btn-insert-and-create': (event,template)->
		formId = Session.get('cmFormId') or defaultFormId
		$("#"+formId, "#afModal").submit()
		Session.set 'cmShowAgain', true
	
	'click .group-section-control': (event, template) ->
		event.preventDefault()
		event.stopPropagation()
		$(event.currentTarget).closest('.group-section').toggleClass('slds-is-open')


helpers =
	cmCollection: () ->
		Session.get 'cmCollection'
	cmOperation: () ->
		Session.get 'cmOperation'
	cmDoc: () ->
		Session.get 'cmDoc'
	cmButtonHtml: () ->
		Session.get 'cmButtonHtml'
	cmFields: () ->
		Session.get 'cmFields'
	cmOmitFields: () ->
		Session.get 'cmOmitFields'
	cmButtonContent: () ->
		Session.get 'cmButtonContent'
	cmCloseButtonContent: () ->
		Session.get 'cmCloseButtonContent'
	cmTitle: () ->
		Session.get 'cmTitle'
	cmButtonClasses: () ->
		Session.get 'cmButtonClasses'
	cmCloseButtonClasses: () ->
		Session.get 'cmCloseButtonClasses'
	cmPrompt: () ->
		Session.get 'cmPrompt'
	cmTemplate: () ->
		Session.get('cmTemplate') || "bootstrap3-horizontal"
	cmLabelClass: () ->
		Session.get('cmLabelClass') || "col-sm-2"
	cmInputColClass: () ->
		Session.get('cmInputColClass') || "col-sm-10"
	cmPlaceholder: () ->
		Session.get 'cmPlaceholder'
	cmFormId: () ->
		Session.get('cmFormId') or defaultFormId
	cmAutoformType: () ->
		if Session.get 'cmMeteorMethod'
			'method'
		else
			Session.get 'cmOperation'
	cmModalDialogClass: () ->
		Session.get 'cmModalDialogClass'
	cmModalContentClass: () ->
		Session.get 'cmModalContentClass'
	cmMeteorMethod: () ->
		Session.get 'cmMeteorMethod'
	title: () ->
		StringTemplate.compile '{{{cmTitle}}}', helpers
	prompt: () ->
		StringTemplate.compile '{{{cmPrompt}}}', helpers
	buttonContent: () ->
		StringTemplate.compile '{{{cmButtonContent}}}', helpers
	closeButtonContent: () ->
		StringTemplate.compile '{{{cmCloseButtonContent}}}', helpers
	cmShowRemoveButton: () ->
		Session.get 'cmShowRemoveButton'

	shouldUpdateQuickForm: () ->
		return Template.instance()?.shouldUpdateQuickForm.get()

	cmSaveAndInsert: ()->
		Session.get 'cmSaveAndInsert'

	cmIsMultipleUpdate: ()->
		isMultiple = Session.get('cmIsMultipleUpdate') and Session.get('cmTargetIds')?.length > 1
		return isMultiple

	cmTargetIds: ()->
		Session.get('cmTargetIds')

	schemaFields: ()->
		cmCollection = Session.get 'cmCollection'
		keys = []
		if cmCollection
			schema = collectionObj(cmCollection).simpleSchema()._schema
			firstLevelKeys = collectionObj(cmCollection).simpleSchema()._firstLevelSchemaKeys
			object_name = cmCollection.replace(/Creator.Collections./, "")
			permission_fields = Creator.getFields(object_name)
			if Session.get 'cmFields'
				firstLevelKeys = [Session.get('cmFields')]
			if Session.get 'cmOmitFields'
				firstLevelKeys = _.difference firstLevelKeys, [Session.get('cmOmitFields')]
			
			_.each schema, (value, key) ->
				if (_.indexOf firstLevelKeys, key) > -1
					if !value.autoform?.omit
						keys.push key

			if keys.length == 1
				finalFields = 
					grouplessFields: [keys]
				return finalFields

			fieldGroups = []
			fieldsForGroup = []

			grouplessFields = []
			grouplessFields = getFieldsWithNoGroup(schema)
			grouplessFields = getFieldsInFirstLevel(firstLevelKeys, grouplessFields)
			if permission_fields
				grouplessFields = _.intersection(permission_fields, grouplessFields)
			grouplessFields = getFieldsWithoutOmit(schema, grouplessFields)
			grouplessFields = getFieldsForReorder(schema, grouplessFields)

			fieldGroupNames = getSortedFieldGroupNames(schema)
			_.each fieldGroupNames, (fieldGroupName) ->
				fieldsForGroup = getFieldsForGroup(schema, fieldGroupName)
				fieldsForGroup = getFieldsInFirstLevel(firstLevelKeys, fieldsForGroup)
				if permission_fields
					fieldsForGroup = _.intersection(permission_fields, fieldsForGroup)
				fieldsForGroup = getFieldsWithoutOmit(schema, fieldsForGroup)
				fieldsForGroup = getFieldsForReorder(schema, fieldsForGroup)
				fieldGroups.push
					name: fieldGroupName
					fields: fieldsForGroup

			finalFields = 
				grouplessFields: grouplessFields
				groupFields: fieldGroups

			return finalFields


Template.autoformModals.helpers helpers

Template.afModal.events
	'click *': (e, t) ->
		e.preventDefault()

		html = t.$('*').html()

		if t.data.collectionName
			if t.data.operation == "update"
				title = "编辑#{t.data.collectionName}"
			else if t.data.operation == "insert"
				title = "新建#{t.data.collectionName}"
			else if t.data.operation == "remove"
				title = "删除#{t.data.collectionName}"
		else
			title = html

		Session.set 'cmCollection', t.data.collection
		Session.set 'cmOperation', t.data.operation
		Session.set 'cmFields', t.data.fields
		Session.set 'cmOmitFields', t.data.omitFields
		Session.set 'cmButtonHtml', html
		Session.set 'cmTitle', t.data.title or title
		Session.set 'cmTemplate', t.data.template
		Session.set 'cmLabelClass', t.data.labelClass or t.data['label-class']
		Session.set 'cmInputColClass', t.data.inputColClass or t.data['input-col-class']
		Session.set 'cmPlaceholder', if t.data.placeholder is true then 'schemaLabel' else ''
		Session.set 'cmFormId', t.data.formId
		Session.set 'cmMeteorMethod', t.data.meteormethod
		Session.set 'cmModalDialogClass', t.data.dialogClass
		Session.set 'cmModalContentClass', t.data.contentClass
		Session.set 'cmShowRemoveButton', t.data.showRemoveButton or false
		Session.set 'cmSaveAndInsert', t.data.saveAndInsert
		cmOnSuccessCallback = t.data.onSuccess

		if not _.contains registeredAutoFormHooks, t.data.formId
			AutoForm.addHooks t.data.formId,
				onSuccess: ->
					$('#afModal').modal 'hide'
			registeredAutoFormHooks.push t.data.formId

		if t.data.doc
			Session.set 'cmDoc', collectionObj(t.data.collection).findOne _id: t.data.doc

		if t.data.showRemoveButton
			t.data.buttonContent = false

		if t.data.buttonContent or t.data.buttonContent is false
			Session.set 'cmButtonContent', t.data.buttonContent
		else if t.data.operation == 'insert'
			Session.set 'cmButtonContent', 'Create'
		else if t.data.operation == 'update'
			Session.set 'cmButtonContent', 'Update'
		else if t.data.operation == 'remove'
			Session.set 'cmButtonContent', 'Delete'

		if t.data.buttonClasses
			Session.set 'cmButtonClasses', t.data.buttonClasses
		else if t.data.operation == 'remove'
			Session.set 'cmButtonClasses', 'btn btn-danger'
		else
			Session.set 'cmButtonClasses', 'btn btn-primary'

		Session.set 'cmCloseButtonContent', t.data.closeButtonContent or ''
		Session.set 'cmCloseButtonClasses', t.data.closeButtonClasses or 'btn btn-danger'

		if t.data.prompt
			Session.set 'cmPrompt', t.data.prompt
		else if t.data.operation == 'remove'
			Session.set 'cmPrompt', 'Are you sure?'
		else
			Session.set 'cmPrompt', ''

		# 记录本次点击事件的className

		keyClassName = e.currentTarget.className
		Session.set 'cmPressKey', keyClassName

		# 上次的操作是保存并新建，清空 cmDoc，并设置 cmOperation为 insert

		if Session.get 'cmShowAgain'
			Session.set 'cmDoc', undefined
			Session.set 'cmOperation', 'insert'

		# 重置 cmShowAgain

		Session.set 'cmShowAgain', false

		$('#afModal').data('bs.modal').options.backdrop = t.data.backdrop or true
		$('#afModal').modal 'show'

Template.autoformModals.onCreated ->
	self = this;
	self.shouldUpdateQuickForm = new ReactiveVar(true);

Template.autoformModals.onDestroyed ->
	Session.set 'cmIsMultipleUpdate', false
	Session.set 'cmTargetIds', null