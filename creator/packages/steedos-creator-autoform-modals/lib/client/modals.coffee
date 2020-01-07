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

oDataOperation = (type, url, data, object_name)->
	self = this
	$.ajax
		type: type
		url: url
		data: JSON.stringify(data)
		dataType: 'json'
		contentType: "application/json"
		processData: false
		beforeSend: (request) ->
			request.setRequestHeader 'X-User-Id', Meteor.userId()
			request.setRequestHeader 'X-Auth-Token', Accounts._storedLoginToken()
			request.setRequestHeader 'X-Space-Id', Steedos.spaceId()
		success: (data) ->
			console.log('oDataOperation success');
			if Session.get("cmOperation") == "insert"
				_id = data.value[0]._id
			else if Session.get("cmOperation") == "update"
				_id = data._id
			# console.log _id
			data = {_id: _id}
			data.type = type
			data.object_name = object_name
			self.done(null, data)
		error: (jqXHR, textStatus, errorThrown) ->
			# console.log(errorThrown);
			console.log('oDataOperation error');
			self.done(jqXHR.responseJSON.error)

getObjectName = (collectionName)->
	return collectionName.replace(/Creator.Collections./, "")

getSimpleSchema = (collectionName)->
	if collectionName
		object_name = getObjectName collectionName
		object_fields = Creator.getObject(object_name).fields
		_fields = Creator.getFields(object_name)
		#schema = collectionObj("Creator.Collections."+Creator.getObject(object_name)._collection_name).simpleSchema()._schema
		schema = Creator.Collections[Creator.getObject(object_name)._collection_name].simpleSchema()._schema
		fields = Session.get("cmFields")

		final_schema = {}
		if fields
			fields = fields.replace(/\ /g, "").split(",")
			_.each fields, (field)->
				if object_fields[field]?.type == "grid"
					table_fields = _.filter _fields, (f)->
						reg = new RegExp("^(" + field + ")(\\.\\$\\.){1}\\w+")
						return reg.test(f)
					_.each table_fields, (f)->
						_.extend(final_schema, _.pick(schema, f))
				obj = _.pick(schema, field, field + ".$")
				_.extend(final_schema, obj)
		else
			final_schema = schema

		if Session.get 'cmMeteorMethod'
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
		if e.keyCode == 27 && $('#creatorObjectModal').length < 1
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
		Session.set("cmSaving", false)
		$(window).unbind 'keyup', onEscKey

		doc = Session.get 'cmDoc'
		# “保存并新建”操作中自动打开的新窗口中需要用到的doc
		cmShowAgainDoc = Session.get 'cmShowAgainDoc'

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
			'cmTargetIds',
			'cmEditSingleField',
			'cmFullScreen',
			'cmShowAgainDoc'
		]
		delete Session.keys[key] for key in sessionKeys

		Session.set("cmIsMultipleUpdate", false)

		self.shouldUpdateQuickForm.set(false)

		AutoForm.resetForm(Session.get('cmFormId') or defaultFormId)

		# 如果用户操作为保存并新建 再次触发一次点击事件
		if Session.get 'cmShowAgain'
			keyPress = Session.get 'cmPressKey'
			keyPress = '.' + keyPress.replace(/\s+/ig, '.')
			Meteor.defer ()->
				# cmShowAgain的新窗口中如果有cmShowAgainDuplicated为true时复制过来的doc则用之，反之保持原来的doc不变
				if cmShowAgainDoc
					Session.set 'cmDoc', cmShowAgainDoc
				else
					# 增加cmShowAgainDuplicated逻辑前的代码，可以保持新建窗口时的默认值不变，而不是被清空
					Session.set 'cmDoc', doc
				$(keyPress).click()
		else
			# 窗口关闭时，如果不要求再次打开，则应该重置再次打开窗口时的相关参数
			Session.set "cmShowAgainDoc", null
			Session.set "cmShowAgainDuplicated", false


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
		object_name = getObjectName(collection)
		
		_id = Session.get('cmDoc')._id
		url = Steedos.absoluteUrl "/api/v4/#{object_name}/#{_id}"

		$.ajax
			type: "delete"
			url: url
			dataType: "json"
			contentType: "application/json"
			beforeSend: (request) ->
				request.setRequestHeader('X-User-Id', Meteor.userId())
				request.setRequestHeader('X-Auth-Token', Accounts._storedLoginToken())
				request.setRequestHeader('X-Space-Id', Steedos.spaceId())

			success: (data) ->
				$('#afModal').modal 'hide'
				cmOnSuccessCallback?()
				toastr?.success?(t("afModal_remove_suc"))

			error: (jqXHR, textStatus, errorThrown) ->
				console.log(errorThrown)

	'click button.btn-update-and-create': (event,template)->
		formId = Session.get('cmFormId') or defaultFormId
		$("#"+formId, "#afModal").submit()
		Session.set 'cmShowAgain', true

	'click button.btn-insert-and-create': (event,template)->
		formId = Session.get('cmFormId') or defaultFormId
		$("#"+formId, "#afModal").submit()
		Session.set 'cmShowAgain', true
		# 是否需要在打开新窗口时复制当前窗口doc内容到下次自动打开的窗口中
		showAgainDuplicated = Session.get "cmShowAgainDuplicated"
		if showAgainDuplicated
			insertDoc = AutoForm.getFormValues(formId).insertDoc
			# 把当前doc内容设置到自动打开的新窗口中需要用到的doc
			Session.set("cmShowAgainDoc", insertDoc)
	
	'click .group-section-control': (event, template) ->
		event.preventDefault()
		event.stopPropagation()
		$(event.currentTarget).closest('.group-section').toggleClass('slds-is-open')

	'change form': (event, template)->
		collection = Session.get 'cmCollection'
		object_name = getObjectName(collection)
		validate = FormManager.validate(object_name, Session.get('cmFormId') or defaultFormId);
		if(!validate)
			event.preventDefault()
			event.stopPropagation()


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
		if Session.get 'cmUseOdataApi'
			return undefined
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

	cmSaving: ()->
		Session.get 'cmSaving'

	isUseMethod: ()->
		if Session.get 'cmMeteorMethod'
			return true
		else
			return false

	cmTargetIds: ()->
		Session.get('cmTargetIds')

	schema: ()->
		cmCollection = Session.get 'cmCollection'
		return getSimpleSchema(cmCollection)

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
				cmFields = Session.get('cmFields').replace(/\ /g, "")
				cmFields = cmFields.split(",")
				firstLevelKeys = _.intersection(firstLevelKeys, cmFields)
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

#			console.log finalFields

			return finalFields

	isMobile: ()->
		if $(window).width() < 767
			return true
		else
			return false

	isDisabled: (key)->
		cmCollection = Session.get 'cmCollection'
		if cmCollection
			object_name = getObjectName(cmCollection)
			fields = Creator.getObject(object_name).fields
			return fields[key].disabled

	disabledFieldsValue: (key)->
		cmCollection = Session.get 'cmCollection'
		if cmCollection
			object_name = getObjectName(cmCollection)
			fields = Creator.getObject(object_name).fields
			defaultValue = fields[key].defaultValue
			if _.isFunction(defaultValue)
				defaultValue = defaultValue()
			return defaultValue

	getLabel: (key)->
		return AutoForm.getLabelForField(key)

	isSingle: ()->
		return Session.get("cmEditSingleField")

	isOverflowVisible: ()->
		return Session.get("cmContentOverflowVisible")

	isFullScreen: ()->
		return Session.get("cmFullScreen")

	hasInlineHelpText: (key)->
		cmCollection = Session.get 'cmCollection'
		if cmCollection
			object_name = getObjectName(cmCollection)
			fields = Creator.getObject(object_name).fields
			return fields[key]?.inlineHelpText

Template.CreatorAutoformModals.helpers helpers

Template.CreatorFormField.helpers helpers

Template.CreatorFormField.onRendered ->
	self = this
	self.$(".has-inline-text").each ->
		id = "info_" + $(".control-label", $(this)).attr("for")
		html = """
			<span class="help-info" id="#{id}">
				<i class="ion ion-information-circled"></i>
			</span>
		"""
		$(".control-label", $(this)).after(html)


	self.$(".info-popover").each ->
		_id = $("~ .form-group .help-info", $(this)).attr("id");
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

		object_name = getObjectName t.data.collection
		object_fields = Creator.getObject(object_name).fields

		#新增_ids虚拟字段，以实现条记录同时更新
		fields = t.data.fields
		if fields and fields.length
			if fields.split(",").length == 1
				Session.set "cmEditSingleField", true

				if object_fields[fields.split(",")[0]].type != 'code' && object_fields[fields.split(",")[0]].type != 'textarea' && object_fields[fields.split(",")[0]].type != 'autosizearea'
					Session.set "cmContentOverflowVisible", true
				else
					Session.set "cmContentOverflowVisible", false

			fields = _.union(fields.split(","),"_ids","_object_name").join(",")
		else
			Session.set "cmEditSingleField", false
			Session.set "cmContentOverflowVisible", false

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
		Session.set 'cmUseOdataApi', t.data.useOdataApi
		cmOnSuccessCallback = t.data.onSuccess

		if not _.contains registeredAutoFormHooks, t.data.formId
			# userId = Meteor.userId()
			# cmCollection = Session.get 'cmCollection'
			# object_name = getObjectName(cmCollection)
			# console.log "afModal-object_name", object_name
			# triggers = Creator.getObject(object_name).triggers
			AutoForm.addHooks t.data.formId,
				before:
					method: (doc)->
						userId = Meteor.userId()
						cmCollection = Session.get 'cmCollection'
						object_name = getObjectName(cmCollection)
						triggers = Creator.getObject(object_name).triggers
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
						userId = Meteor.userId()
						cmCollection = Session.get 'cmCollection'
						object_name = getObjectName(cmCollection)
						triggers = Creator.getObject(object_name).triggers
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
				onSubmit: (insertDoc, updateDoc, currentDoc)->
					if Session.get 'cmSaving'
						return false

					Session.set 'cmSaving', true

					userId = Meteor.userId()
					cmCollection = Session.get 'cmCollection'
					object_name = getObjectName(cmCollection)
					object = Creator.getObject(object_name)
					triggers = object.triggers

					self = this
					urls = []


					validate = FormManager.validate(object_name, t.data.formId);
					if !validate
						return false;

					onSubmit = FormManager.onSubmit(object_name, t.data.formId);
					if !onSubmit
						return false;

					cmCollection = Session.get 'cmCollection'
					if cmCollection
						schemaInstance = getSimpleSchema(cmCollection)
						schema = schemaInstance._schema
						disabledFields = Creator.getDisabledFields(schema)
						_.each disabledFields, (disabledField)->
							delete insertDoc[disabledField]

					if Session.get("cmOperation") == "insert"
						data = insertDoc
						type = "post"
						urls.push Steedos.absoluteUrl("/api/v4/#{object_name}")
						delete data._object_name
					if Session.get("cmOperation") == "update"
						if Session.get("cmMeteorMethod")
							if updateDoc["$set"]
								_id = updateDoc["$set"]._ids || Session.get("cmDoc")._id
							else
								_id = Session.get("cmDoc")._id

						else
							_id = Session.get("cmDoc")._id

						# insertDoc里面的值是最全最精确的
						updateDoc["$set"] = insertDoc

						if updateDoc["$set"]
							delete updateDoc["$set"]._ids
							delete updateDoc["$set"]._object_name

						if updateDoc["$unset"]
							delete updateDoc["$unset"]._ids
							delete updateDoc["$unset"]._object_name

						if updateDoc.$unset
							_.each updateDoc.$unset, (v, k)->
								foo = k.split(".")
								if foo.length > 1 && _.has(insertDoc, foo[0])
									delete updateDoc.$unset[k]

							if _.keys(updateDoc.$unset).length == 0
								delete updateDoc.$unset

						_ids = _id.split(",")
						_.each _ids, (id)->
							urls.push Steedos.absoluteUrl("/api/v4/#{object_name}/#{id}")
						data = updateDoc
						type = "put"

					console.log "begin......", data
					if triggers
						if Session.get("cmOperation") == "insert"
							_.each triggers, (trigger, key)->
								if trigger.on == "client" and (trigger.when == "before.insert" or trigger.when == "after.insert")
									trigger.todo.apply({object_name: object_name},[userId, data])
						if Session.get("cmOperation") == "update"
							_.each triggers, (trigger, key)->
								if trigger.on == "client" and (trigger.when == "before.update" or trigger.when == "after.update")
									trigger.todo.apply({object_name: object_name},[userId, data])


					_.each urls, (url)->
						oDataOperation.call(self, type, url, data, object_name)

					return false

				onSuccess: (operation,result)->
					Session.set 'cmSaving', false
					console.log('onSuccess hide......');
					$('#afModal').modal 'hide'
					# if result.type == "post"
					# 	app_id = Session.get("app_id")
					# 	object_name = result.object_name
					# 	record_id = result._id
					# 	url = "/app/#{app_id}/#{object_name}/view/#{record_id}"
					# 	FlowRouter.go url

				onError: (operation,error) ->
					Session.set 'cmSaving', false
					console.log('onError......');
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
			console.log "t.data.operation", t.data.operation
			if t.data.operation == 'update'
				Session.set 'cmDoc', undefined
			Session.set 'cmOperation', 'insert'

		# 重置 cmShowAgain

		Session.set 'cmShowAgain', false

		$('#afModal').data('bs.modal').options.backdrop = t.data.backdrop or 'static'
		$('#afModal').modal 'show'

Template.CreatorAutoformModals.onCreated ->
	self = this;
	self.shouldUpdateQuickForm = new ReactiveVar(true);

Template.CreatorAutoformModals.onDestroyed ->
	Session.set 'cmIsMultipleUpdate', false
	Session.set 'cmTargetIds', null

