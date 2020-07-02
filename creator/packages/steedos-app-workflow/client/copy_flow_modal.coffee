fields = ['name', 'company_id']
formId = "copyFlowForm"
Template.copy_flow_modal.helpers
	formId: ()->
		return formId
	schema: ()->
		schema = {}
		object = Creator.getObject('flows')
		new_schema = new SimpleSchema(Creator.getObjectSchema(object))
		obj_schema = new_schema._schema
		_.each fields, (field)->
			schema[field] = obj_schema[field]
			if schema[field].autoform
				schema[field].autoform.readonly = false
				schema[field].autoform.disabled = false
		return new SimpleSchema(schema)

	fields: ()->
		return fields


Template.copy_flow_modal.events
	'click .btn-confirm': (event, template)->
		event.currentTarget.disabled = true;
		if !AutoForm.validateField(formId)
			event.currentTarget.disabled = false;
			return false;

		doc = AutoForm.getFormValues(formId).insertDoc

		record_id = template.data.record_id

		Meteor.call "flow_copy", Steedos.spaceId(), record_id, doc, (error, result)->
			if error
				toastr.error 'error'
			else
				toastr.success t('workflow_copy_flow_success')
				Modal.hide(template)
				if _.isFunction(template.data.onSuccess)
					template.data.onSuccess(result)

