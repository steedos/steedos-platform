defFormId = 'quickForm';
Template.quickFormModal.helpers
	title: ()->
		return this.title;
	confirmBtnText: ()->
		return this.confirmBtnText;
	schema: ()->
		return new SimpleSchema this.schema;
	doc: ()->
		return this.doc || {};
	template: ()->
		return this.template || "slds";
	formId: ()->
		return this.formId || defFormId
	autoExpandGroup: ()->
		return this.autoExpandGroup || false
Template.quickFormModal.events
	'click button.btn-confirm': (event,template) ->
		formId = template.data.formId || defFormId
		if AutoForm.validateForm(formId)
			if _.isFunction(template.data.onConfirm)
				template.data.onConfirm(AutoForm.getFormValues(formId), event, template);
			else
				console.error('Please pass in the parameter onConfirm and it must be function.')