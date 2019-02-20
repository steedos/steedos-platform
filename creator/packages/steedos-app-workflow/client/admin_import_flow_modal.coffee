fields = ['company_id']
Template.admin_import_flow_modal.helpers
	spaceId: ->
		return Session.get("spaceId");
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


Template.admin_import_flow_modal.events
	'click .btn-confirm': (event, template)->

		if !AutoForm.validateForm("importFlowForm")
			return ;

		company_id = AutoForm.getFormValues("importFlowForm")?.insertDoc?.company_id

		if $("#importFlowFile")[0].files.length == 0
			toastr.warning(t("workflow_import_flow_info"))
			return;
		if !Steedos.isLegalVersion('',"workflow.professional")
			Steedos.spaceUpgradedModal()
			return;
		formData = new FormData();

		url = "api/workflow/import/form?space=" + Session.get("spaceId")

		if company_id
			url = url + "&company_id=" + company_id

		formData.append('file-0', $("#importFlowFile")[0].files[0]);
		$.ajax
			type:"POST"
			url: Steedos.absoluteUrl(url)
			processData: false
			contentType: false
			data: formData
			dataType: 'json'
			success: (data)->
				console.log('data', data)
				toastr.success(t("workflow_import_flow_success"))
				Modal.hide(template)
				if _.isFunction(template.data.onSuccess)
					template.data.onSuccess(data.new_flows)
			error: (e)->
				toastr.error(t("workflow_import_flow_error"));
				console.log e

