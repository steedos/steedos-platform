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

Template.autoformModals.rendered = ->

	self = this;

	$('#afModal').modal(show: false)

	onEscKey = (e) ->
		if e.keyCode == 27
			$('#afModal').modal 'hide'

	$('#afModal').on 'show.bs.modal', ->
		self.shouldUpdateQuickForm.set(true)


	$('#afModal').on 'shown.bs.modal', ->
		if Steedos?.setModalMaxHeight
			Steedos.setModalMaxHeight()
		$(window).bind 'keyup', onEscKey
		
		operation = Session.get 'cmOperation'
		if operation == 'update'
			AutoForm.resetForm(Session.get('cmFormId') or defaultFormId)

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
			'cmShowRemoveButton'
		]
		delete Session.keys[key] for key in sessionKeys

		self.shouldUpdateQuickForm.set(false)

		AutoForm.resetForm(Session.get('cmFormId') or defaultFormId)

		# 如果用户操作为保存并新建 再次触发一次点击事件 
		if Session.get 'cmShowAgain'
			keyPress = Session.get 'cmPressKey'
			keyPress = '.' + keyPress.replace(/\s+/ig, '.')
			$(keyPress).click()


Template.autoformModals.events

	'click button.btn-insert': () ->
		$("#afModal #cmForm").submit()

	'click button.btn-update': ()->
		$("#afModal #cmForm").submit()

	'click button.btn-remove': ()->
		collection = Session.get 'cmCollection'
		operation = Session.get 'cmOperation'
		_id = Session.get('cmDoc')._id
		collectionObj(collection).remove _id, (e)->
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

	'click button.btn-update-and-create': ()->
		$("#afModal #cmForm").submit()
		Session.set 'cmShowAgain', true

	'click button.btn-insert-and-create': ()->
		$("#afModal #cmForm").submit()
		Session.set 'cmShowAgain', true


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

Template.autoformModals.helpers helpers

Template.afModal.events
	'click *': (e, t) ->
		e.preventDefault()

		html = t.$('*').html()

		Session.set 'cmCollection', t.data.collection
		Session.set 'cmOperation', t.data.operation
		Session.set 'cmFields', t.data.fields
		Session.set 'cmOmitFields', t.data.omitFields
		Session.set 'cmButtonHtml', html
		Session.set 'cmTitle', t.data.title or html
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