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

#	main_record = Creator.odata.get(main_object_name, main_record_id)
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
		validateMsg = objectFormInitialValidateFun.apply({}, [AutoForm.getFormValues(formId)?.insertDoc])
		if !_.isEmpty(validateMsg) && _.isObject(validateMsg)
			_.each validateMsg, (val, key)->
				AutoForm.addStickyValidationError(formId, key, 'formValidate', val)
				toastr.error(val);
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