@FormManager = {}

#注册验证错误类型：formValidate
SimpleSchema.messages({formValidate: "[value]"})

FormManager.getRelatedInitialValues = (main_object_name, main_record_id, related_object_name)=>

	if !_.isString(main_record_id)
		throw new Meteor.Error('main_record_id must be String');

	defaultValue = {}

	relatedKey = ""
	Creator.getRelatedList(main_object_name, main_record_id).forEach (related_obj) ->
		if related_object_name == related_obj.object_name
			relatedKey = related_obj.related_field_name

	main_record = Creator.odata.get(main_object_name, main_record_id, 'company_id')
#
#	related_object = Creator.getObject(related_object_name);
#
#	_.each related_object?.fields, (field)->
#		if main_record[field.name]
#			defaultValue[field.name] = main_record[field.name]

	defaultValue = FormManager.getInitialValues(related_object_name)

	if relatedKey
		if main_object_name == "objects"
			defaultValue[relatedKey] = Creator.getObjectRecord().name
		else
			defaultValue[relatedKey] = {o: main_object_name, ids: [main_record_id]}
	if !_.has(defaultValue, "company_id") && main_record?.company_id
		defaultValue['company_id'] = main_record.company_id

	return defaultValue;


FormManager.getInitialValues = (object_name)->
	object = Creator.getObject(object_name);
	objectFormInitialValuesFun = object?.form?.initialValues
	if _.isFunction(objectFormInitialValuesFun)
		return objectFormInitialValuesFun.apply({})
	else
		return {}

FormManager.validate = (object_name, formId)->
	object = Creator.getObject(object_name);
	objectFormInitialValidateFun = object?.form?.validate
	if _.isFunction(objectFormInitialValidateFun)
		try
			validateMsg = objectFormInitialValidateFun.apply({}, [AutoForm.getFormValues(formId)?.insertDoc])
			if _.isBoolean(validateMsg) && validateMsg == false
				return false
			if !_.isEmpty(validateMsg) && _.isObject(validateMsg)
				_.each validateMsg, (val, key)->
					AutoForm.addStickyValidationError(formId, key, 'formValidate', val)
					toastr.error(val);
				return false;
		catch e
			console.error(e);
			toastr.error(e.message);
			return false;
	return true

FormManager.onSubmit = (object_name, formId)->
	object = Creator.getObject(object_name);
	objectFormInitialOnSubmitFun = object?.form?.onSubmit
	if _.isFunction(objectFormInitialOnSubmitFun)
		onSubmitMsg = objectFormInitialOnSubmitFun.apply({}, [AutoForm.getFormValues(formId)?.insertDoc])
		if !_.isEmpty(onSubmitMsg) && _.isObject(onSubmitMsg)
			_.each onSubmitMsg, (val, key)->
				AutoForm.addStickyValidationError(formId, key, 'formValidate', val)
				toastr.error(val);
			return false;
	return true

getContext = (object_name, hookName, options)->
	context = {userId: Meteor.userId(), spaceId: Session.get("spaceId"), object_name: object_name}
	if _.has(options, 'previousDoc')
		context.previousDoc = options.previousDoc
	if hookName.endsWith('Delete')
		context.id = options._id
		context.doc = Creator.odata.get(object_name, options._id)
		if hookName.startsWith("error")
			context.error = options.error
	else
		if hookName.startsWith("after")
			context.id = options.dbDoc?._id
			context.doc = options.dbDoc
		else if hookName.startsWith("before")
			if !hookName.endsWith('Insert')
				context.id = options._id
			if hookName.endsWith('Update')
				context.doc = options.doc?.$set
			else
				context.doc = options.doc
		else if hookName.startsWith("error")
			context.id = options._id
			context.doc = options.doc
			context.error = options.error
	return context

FormManager.getPreviousDoc = (object_name, _id, method)->
	if method == 'update' || method == 'delete'
		_when = 'after'
		hookName = "#{_when}#{method.charAt(0).toLocaleUpperCase()}#{_.rest(method.split('')).join('')}"
		object = Creator.getObject(object_name);
		objectFormHookFun = object?.form?[hookName]
		if _.isFunction(objectFormHookFun)
			return Creator.odata.get(object_name, _id)

# beforeInsert、 beforeUpdate、beforeDelete、afterInsert、 afterUpdate、afterDelete、 errorInsert、 errorUpdate、errorDelete
FormManager.runHook = (object_name, method, _when, options)->
	hookName = "#{_when}#{method.charAt(0).toLocaleUpperCase()}#{_.rest(method.split('')).join('')}"
	if method == 'view' || method == 'edit'
		FormManager.runViewEditHook(object_name, hookName, options.schema, options.record, options.doc)
	else
		formId = options.formId
		object = Creator.getObject(object_name);
		objectFormHookFun = object?.form?[hookName]
		if _.isFunction(objectFormHookFun)
			try
				context = getContext(object_name, hookName, options)
				hookMsg = objectFormHookFun.apply(context)
				if _.isBoolean(hookMsg) && hookMsg == false
					return false
				if formId && _when == 'before'
					if !_.isEmpty(hookMsg) && _.isObject(hookMsg)
						_.each hookMsg, (val, key)->
							AutoForm.addStickyValidationError(formId, key, 'formValidate', val)
							toastr.error(val);
						return false;
			catch e
				console.error(e);
				toastr.error(e.message);
				return false;
		return true;


FormManager.runViewEditHook = (object_name, hookName, schema, record, doc)->
	object = Creator.getObject(object_name);
	fun = object?.form?[hookName]
	if _.isFunction(fun)
		_schema = schema.get()
		_record = doc || record.get()
		context = {
			id: _record._id,
			userId: Meteor.userId(),
			spaceId: Session.get("spaceId"),
			object_name: object_name
			doc: _record,
			schema: _schema
		}
		_goOn = fun.apply(context);
		if _goOn != false
			schema.set(_schema)
			record.set(_record)

#FormManager.afterView = (object_name, schema, record)->
#	object = Creator.getObject(object_name);
#	fun = object?.form?.afterView
#	if _.isFunction(fun)
#		nonreactiveHidden = (fieldName)->
#			hidden = ()->
#				_schema = schema.get();
#				console.log('fieldName', fieldName);
#				_schema._firstLevelSchemaKeys = _.difference(_schema._firstLevelSchemaKeys, [fieldName]);
#				delete _schema._schema[fieldName]
#				_schema._schemaKeys = _.difference(_schema._schemaKeys, [fieldName]);
#				schema.set(_schema)
#			Tracker.nonreactive(hidden)
#		return fun.apply({hidden: nonreactiveHidden}, [schema.get(), record.get()])
## 编辑时执行：控制字段隐藏、字段值
#FormManager.beforeEdit = (object_name, schema, record)->
#	object = Creator.getObject(object_name);
#	fun = object?.form?.beforeEdit
#	if _.isFunction(fun)
#		nonreactiveHidden = (fieldName)->
#			hidden = ()->
#				_schema = schema.get();
#				console.log('fieldName', fieldName);
#				_schema._firstLevelSchemaKeys = _.difference(_schema._firstLevelSchemaKeys, [fieldName]);
#				delete _schema._schema[fieldName]
#				_schema._schemaKeys = _.difference(_schema._schemaKeys, [fieldName]);
#				schema.set(_schema)
#			Tracker.nonreactive(hidden)
#		_schema = schema.get()
#		_record = record.get()
#		fun.apply({hidden: nonreactiveHidden}, [_schema, _record])
#		schema.set(_schema)
#		record.set(_record)
#FormManager.afterEdit = (object_name, schema, record)->
#	object = Creator.getObject(object_name);
#	fun = object?.form?.afterEdit
#	if _.isFunction(fun)
#		nonreactiveHidden = (fieldName)->
#			hidden = ()->
#				_schema = schema.get();
#				console.log('fieldName', fieldName);
#				_schema._firstLevelSchemaKeys = _.difference(_schema._firstLevelSchemaKeys, [fieldName]);
#				delete _schema._schema[fieldName]
#				_schema._schemaKeys = _.difference(_schema._schemaKeys, [fieldName]);
#				schema.set(_schema)
#			Tracker.nonreactive(hidden)
#		_schema = schema.get()
#		_record = record.get()
#		fun.apply({hidden: nonreactiveHidden}, [_schema, _record])
#		schema.set(_schema)
#		record.set(_record)
#
