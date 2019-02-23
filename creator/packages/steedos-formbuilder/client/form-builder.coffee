Template.formBuilder.onRendered ()->
#	formId = this.data.form
#	console.log('formBuilder onRendered', formId);
#	form = Creator.odata.get("forms", formId)
	form = this.data.form
	formFields = form.current.fields
	fields = Creator.formBuilder.transformFormFieldsIn(formFields)
	options = Creator.formBuilder.optionsForFormFields()
	module.dynamicImport('formBuilder').then ()->
		fb = $("#fb-editor").formBuilder(options)
		fb.promise.then (formBuilder)->
			formBuilder.actions.setData(fields)
			# fix bug: 第一个字段的typeUserAttrs不生效
			Meteor.setTimeout ()->
				formBuilder.actions.setData(fields)
			, 100
		window.fb = fb
		config = {}
		Meteor.defer ()->
			Creator.formBuilder.stickyControls()

Template.formBuilder.events
	'click .fb-table .fld-required,.fb-section .fld-required': (e, t)->
		e.preventDefault()
		e.stopPropagation()
		Meteor.defer ()->
			$(e.target).prop("checked", !e.target.checked)
			if e.target.checked
				$('#'+e.target.id.replace("required-",'') + ' .required-asterisk').css('display','inline')
			else
				$('#'+e.target.id.replace("required-",'') + ' .required-asterisk').css('display','none')

	'change .prev-holder .form-control': (e, t)->
		if $(e.target.parentElement.parentElement).hasClass('prev-holder')
			$("[name='default_value']", e.target.parentElement.parentElement.parentElement).val(e.target.value)


