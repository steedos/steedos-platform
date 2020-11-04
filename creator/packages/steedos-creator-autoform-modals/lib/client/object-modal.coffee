oDataOperation = (type, url, data, object_name, operation)->
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
			if operation == "insert"
				value = data.value[0]
			else if operation == "update"
				value = data
			result = {_id: value._id}
			result.type = type
			result.object_name = object_name
			result.value = value
			self.done(null, result)
		error: (jqXHR, textStatus, errorThrown) ->
			self.done(jqXHR.responseJSON.error)

getObjectName = (collectionName)->
	return collectionName.replace(/Creator.Collections./, "")

getSimpleSchema = (collectionName)->
	if collectionName
		object_name = getObjectName collectionName
		object_fields = Creator.getObject(object_name).fields
		_fields = Creator.getFields(object_name)
		schema = Creator.getRecordSafeObjectSchema({}, object_name)
		final_schema = schema

		if true
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
						return object_name

	return new SimpleSchema(final_schema)

Template.CreatorObjectModal.onCreated ()->
	if !@data.formId
		throw new Meteor.Error("500", "缺少参数formId")

	if !@data.collection
		throw new Meteor.Error("500", "缺少参数collection")

	if !@data.object_name
		throw new Meteor.Error("500", "缺少参数object_name")

	if !@data.operation
		throw new Meteor.Error("500", "缺少参数operation")
	collection = Template.instance().data.collection
	this.__schema = new ReactiveVar(getSimpleSchema(collection))
	this.__record = new ReactiveVar(this.doc || {});
	FormManager.runHook(@data.object_name, 'edit', 'before', {schema: this.__schema, record: this.__record});

Template.CreatorObjectModal.onRendered ()->
	template = @
	formId = @data.formId
	collection = @data.collection
	object_name = @data.object_name
	operation = @data.operation || "insert"
	onSuccess = @data.onSuccess
	onError = @data.onError
	#清理hooks，否则会多次执行
	delete AutoForm._hooks[formId]

	onEscKey = (e) ->
		if e.keyCode == 27
			$('#creatorObjectModal').modal 'hide'

	$('#creatorObjectModal').on 'shown.bs.modal', ->
		$(window).bind 'keyup', onEscKey

	$('#creatorObjectModal').on 'hidden.bs.modal', ->
		$(window).unbind 'keyup', onEscKey

	#添加当前form的hooks
	AutoForm.addHooks formId,
		before:
			method: (doc)->
				userId = Meteor.userId()
				triggers = Creator.getObject(object_name).triggers
				if triggers
					if operation == "insert"
						_.each triggers, (trigger, key)->
							if trigger.on == "client" and trigger.when == "before.insert"
								trigger.todo.apply({object_name: object_name},[userId, doc])
					else if operation == "update"
						_.each triggers, (trigger, key)->
							if trigger.on == "client" and trigger.when == "before.update"
								trigger.todo.apply({object_name: object_name},[userId, doc])
				return doc
		after:
			method: (error, result)->
				userId = Meteor.userId()
				triggers = Creator.getObject(object_name).triggers
				if triggers
					if operation == "insert"
						_.each triggers, (trigger, key)->
							if trigger.on == "client" and trigger.when == "after.insert"
								trigger.todo.apply({object_name: object_name},[userId, result])
					else if operation == "update"
						_.each triggers, (trigger, key)->
							if trigger.on == "client" and trigger.when == "after.update"
								trigger.todo.apply({object_name: object_name},[userId, result])
				return result
		onSubmit: (insertDoc, updateDoc, currentDoc)->
			userId = Meteor.userId()
			triggers = Creator.getObject(object_name).triggers

			self = this
			urls = []

			if operation == "insert"
				data = insertDoc
				type = "post"
				urls.push Steedos.absoluteUrl("/api/v4/#{object_name}")
				delete data._object_name
			if operation == "update"
				if Session.get("cmMeteorMethod")
					if updateDoc["$set"]
						_id = updateDoc["$set"]._ids || Session.get("cmDoc")._id
					else
						_id = Session.get("cmDoc")._id

				else
					_id = Session.get("cmDoc")._id

				if updateDoc["$set"]
					delete updateDoc["$set"]._ids
					delete updateDoc["$set"]._object_name

				if updateDoc["$unset"]
					delete updateDoc["$unset"]._ids
					delete updateDoc["$unset"]._object_name

				# insertDoc里面的值是最全最精确的
				updateDoc["$set"] = insertDoc

				_ids = _id.split(",")
				_.each _ids, (id)->
					urls.push Steedos.absoluteUrl("/api/v4/#{object_name}/#{id}")
				data = updateDoc
				type = "put"

			if triggers
				if operation == "insert"
					_.each triggers, (trigger, key)->
						if trigger.on == "client" and (trigger.when == "before.insert" or trigger.when == "after.insert")
							trigger.todo.apply({object_name: object_name},[userId, data])
				if operation == "update"
					_.each triggers, (trigger, key)->
						if trigger.on == "client" and (trigger.when == "before.update" or trigger.when == "after.update")
							trigger.todo.apply({object_name: object_name},[userId, data])


			_.each urls, (url)->
				oDataOperation.call(self, type, url, data, object_name, operation)

			return false

		onSuccess: (operation,result)->
			if _.isFunction(onSuccess)
				onSuccess(operation, result)
#			$('#creatorObjectModal').modal 'hide'
			Modal.hide(template)

		onError: (operation,error) ->
			if _.isFunction(onError)
				onError(operation,error)
			console.error error
			if error.reason
				toastr?.error?(TAPi18n.__(error.reason))
			else if error.message
				toastr?.error?(TAPi18n.__(error.message))
			else
				toastr?.error?(error)


Template.CreatorObjectModal.helpers
	doc: ()->
		return Template.instance().__record.get();
	schema: ()->
		return Template.instance().__schema.get()
	title: ()->
		data_title = Template.instance().data.title
		if data_title
			return data_title
		else
			object_label = Creator.getObject(Template.instance().data.object_name)?.label
			if Template.instance().data.operation == "update"
				title = "#{t('Edit')} #{object_label}"
			else if Template.instance().data.operation == "insert"
				title = "#{t('New')} #{object_label}"
			else if Template.instance().data.operation == "remove"
				title = "#{t('Delete')} #{object_label}"
			return title
	fields: ()->
		object_name = Template.instance().data.object_name
		return Creator.getObject(object_name).fields
	objectSchema: ()->
		cmCollection = Template.instance().data.collection
		cmOperation = Template.instance().data.operation
		object_name = Template.instance().data.object_name
		keys = []
		if cmCollection
			schemaInstance = Template.instance().__schema.get()
			schema = schemaInstance._schema

			firstLevelKeys = schemaInstance._firstLevelSchemaKeys

			_permission_fields = _.clone(Creator.getRecordSafeFields({}, object_name))
			permission_fields = []
			_.each _permission_fields, (_sf, k)->
				if !_sf.disabled
					permission_fields.push(k)
			unless permission_fields
				permission_fields = []

			if true
				permission_fields.push "_ids"
				permission_fields.push "_object_name"

			if cmOperation == "insert"
				# 新建记录时，把autonumber、formula、summary类型字段视为omit字段
				# 修改记录时不用处理，由schema中设定的readonly属性控制
				fields = Creator.getObject(object_name).fields
				firstLevelKeys = _.filter firstLevelKeys, (firstLevelKey)->
					return ["autonumber", "formula", "summary"].indexOf(fields[firstLevelKey]?.type) < 0

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
			isSingle = false

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

Template.CreatorObjectModal.events
	'click .group-section-control': (event, template) ->
		event.preventDefault()
		event.stopPropagation()
		$(event.currentTarget).closest('.group-section').toggleClass('slds-is-open')
	'click button.btn-insert': (event,template) ->
		$("#"+template.data.formId, "#creatorObjectModal").submit()
	'change form': (event, template)->
		object_name = template.data.object_name
		formId = template.data.formId
		validate = FormManager.validate(object_name, formId);
		if(!validate)
			event.preventDefault()
			event.stopPropagation()
		else
			_doc = AutoForm.getFormValues(formId)?.insertDoc
			FormManager.runHook(object_name, 'edit', 'after', {schema: template.__schema, record: template.__record, doc: _doc});

Template.CreatorObjectFields.helpers
	isDisabled :(key)->
		fields = Template.instance().data.fields
		return fields[key].disabled
	getLabel: (key)->
		return AutoForm.getLabelForField(key)
	disabledFieldsValue: (key)->
		cmCollection = Template.instance().data.collection
		object_name = Template.instance().data.object_name
		if cmCollection
			fields = Creator.getObject(object_name).fields
			defaultValue = fields[key].defaultValue
			if _.isFunction(defaultValue)
				defaultValue = defaultValue()
			return defaultValue