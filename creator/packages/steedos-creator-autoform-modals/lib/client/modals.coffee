registeredAutoFormHooks = ['cmForm']
defaultFormId = 'cmForm'

cmOnSuccessCallback = null

AutoForm.addHooks 'cmForm',
	onSuccess: ->
		$('#afModal').modal('hide')

	onError: (operation,error) ->
		console.error error
		if error.reason
			toastr?.error?(TAPi18n.__(error.reason))
		else if error.message
			toastr?.error?(TAPi18n.__(error.message))
		else
			toastr?.error?(error)

collectionObj = (name) ->
	name.split('.').reduce (o, x) ->
		o[x]
	, window

getObjectName = (collectionName)->
	return collectionName.replace(/Creator.Collections./, "")

getSimpleSchema = (collectionName)->
	if collectionName
		schema = collectionObj(collectionName).simpleSchema()._schema
		fields = Session.get("cmFields")

		final_schema = {}
		if fields
			fields = fields.replace(/\ /g, "").split(",")
			_.each fields, (field)->
				obj = _.pick(schema, field, field + ".$")
				_.extend(final_schema, obj)
		else
			final_schema = schema

		#新增_ids虚拟字段，以实现条记录同时更新
		final_schema._ids = 
			type: String
			optional: true
			autoform:
				type: "hidden"
		#新增_object_name虚拟字段，以让后台method知道更新哪个表
		final_schema._object_name = 
			type: String
			optional: true
			autoform:
				type: "hidden"
				defaultValue: ->
					return getObjectName collectionName
	return new SimpleSchema(final_schema)


Template.CreatorAutoformModals.rendered = ->

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


Template.CreatorAutoformModals.events

	'click button.btn-insert': (event,template) ->
		formId = Session.get('cmFormId') or defaultFormId
		$("#"+formId, "#afModal").submit()

	'click button.btn-update': (event,template)->
		isMultipleUpdate = Session.get('cmIsMultipleUpdate')
		targetIds = Session.get('cmTargetIds')
		isMultipleChecked = template.$(".ckb-multiple-update").is(":checked")
		formId = Session.get('cmFormId') or defaultFormId
		if isMultipleUpdate and isMultipleChecked and targetIds?.length > 1
			template.$("[name=_ids]").val(targetIds.join(","))
		else
			template.$("[name=_ids]").val(Session.get("cmDoc")._id)
		template.$("##{formId}").submit()

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
		# cmAutoformType会影响传递给method的参数
		if Session.get 'cmMeteorMethod'
			if Session.get("cmOperation") == "insert"
				return 'method'
			if Session.get('cmOperation') == "update"
				return 'method-update'
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

	isUseMethod: ()->
		if Session.get 'cmMeteorMethod'
			return true
		else
			return false

	cmTargetIds: ()->
		Session.get('cmTargetIds')
	
	schema: ()->
		cmCollection = Session.get 'cmCollection'
		return getSimpleSchema cmCollection

	schemaFields: ()->
		cmCollection = Session.get 'cmCollection'
		keys = []
		if cmCollection
			schemaInstance = getSimpleSchema(cmCollection)
			schema = schemaInstance._schema
			
			firstLevelKeys = schemaInstance._firstLevelSchemaKeys
			object_name = getObjectName cmCollection
			permission_fields = _.clone(Creator.getFields(object_name))
			unless permission_fields
				permission_fields = []
			
			if Session.get 'cmMeteorMethod'
				permission_fields.push "_ids"
				permission_fields.push "_object_name"

			if Session.get 'cmFields'
				firstLevelKeys = Session.get('cmFields').replace(/\ /g, "")
				firstLevelKeys = firstLevelKeys.split(",")
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

	isMobile: ()->
		if $(window).width() < 767
			return true
		else
			return false
	
Template.CreatorAutoformModals.helpers helpers

Template.CreatorFormField.helpers helpers

Template.CreatorAfModal.events
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

		#新增_ids虚拟字段，以实现条记录同时更新
		fields = t.data.fields
		if fields and fields.length
			fields = _.union(fields.split(","),"_ids","_object_name").join(",")

		Session.set 'cmCollection', t.data.collection
		Session.set 'cmOperation', t.data.operation
		Session.set 'cmFields', fields
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
			userId = Meteor.userId()
			cmCollection = Session.get 'cmCollection'
			object_name = getObjectName(cmCollection)
			triggers = Creator.getObject(object_name).triggers
			AutoForm.addHooks t.data.formId,
				before:
					method: (doc)->
						if triggers
							if Session.get("cmOperation") == "insert"
								_.each triggers, (trigger, key)->
									if trigger.on == "client" and trigger.when == "before.insert"
										trigger.todo.apply({object_name: object_name},[userId, doc])
							else if Session.get("cmOperation") == "update"
								_.each triggers, (trigger, key)->
									if trigger.on == "client" and trigger.when == "before.update"
										trigger.todo.apply({object_name: object_name},[userId, doc])
						return doc
				after:
					method: (error, result)->
						if triggers
							if Session.get("cmOperation") == "insert"
								_.each triggers, (trigger, key)->
									if trigger.on == "client" and trigger.when == "after.insert"
										trigger.todo.apply({object_name: object_name},[userId, result])
							else if Session.get("cmOperation") == "update"
								_.each triggers, (trigger, key)->
									if trigger.on == "client" and trigger.when == "after.update"
										trigger.todo.apply({object_name: object_name},[userId, result])
						return result
				# onSubmit: (insertDoc, updateDoc, currentDoc)->
				# 	console.log 'insertDoc', insertDoc
				# 	console.log 'updateDoc', updateDoc
				# 	console.log 'currentDoc', currentDoc
				# 	console.log 'onSubmit.....'
				# 	this.done();
				# 	return false
				onSuccess: ->
					$('#afModal').modal 'hide'
				
				onError: (operation,error) ->
					console.error error
					if error.reason
						toastr?.error?(TAPi18n.__(error.reason))
					else if error.message
						toastr?.error?(TAPi18n.__(error.message))
					else
						toastr?.error?(error)

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

Template.CreatorAutoformModals.onCreated ->
	self = this;
	self.shouldUpdateQuickForm = new ReactiveVar(true);

Template.CreatorAutoformModals.onDestroyed ->
	Session.set 'cmIsMultipleUpdate', false
	Session.set 'cmTargetIds', null

