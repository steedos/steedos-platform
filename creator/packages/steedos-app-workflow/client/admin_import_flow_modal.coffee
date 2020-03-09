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

	isUpgrade: ()->
		if this.flowId
			return true
		return false


showSuccessElement = (successData, template)->
	successElement = []
	_.each _.keys(successData), (k)->
		new_flows = successData[k].new_flows
		newFlowsElement = []
		_.each new_flows, (fid)->
			newFlowsElement.push("<a href='/app/admin/flows/view/#{fid}' target='_blank'>查看流程</a>")
		successElement.push("<p>#{k}: #{newFlowsElement.join('')}</p>")
	if successElement.length > 0
		$('.help-block', template.find(".import-files")).append("<div class='callout callout-info'><h4>导入成功的文件(#{successElement.length}条)：</h4>#{successElement.join('')}</div>")



Template.admin_import_flow_modal.events
	'change #importFlowFile,#importFlowForm': (event, template)->
		$(template.find('.btn-confirm')).prop("disabled", false)

	'click .btn-confirm': (event, template)->
		form = AutoForm.getCurrentDataForForm("importFlowForm")
		if form
			if !AutoForm.validateForm("importFlowForm")
				return ;

		company_id = AutoForm.getFormValues("importFlowForm")?.insertDoc?.company_id
		files = $("#importFlowFile")[0].files
		filesLength = files.length
		if filesLength == 0
			toastr.warning(t("workflow_import_flow_info"))
			return;
#		if !Steedos.isLegalVersion('',"workflow.professional")
#			Steedos.spaceUpgradedModal()
#			return;
		formData = new FormData();

		url = "api/workflow/import/form?space=" + Session.get("spaceId")

		if company_id
			url = url + "&company_id=" + company_id
		if template.data.flowId
			url = url + "&flowId=" + template.data.flowId
		$(template.find('.btn-confirm')).prop("disabled", true)
		(formData.append('file-' + x, files[x])) for x in [0..(filesLength-1)]
		$('.help-block', template.find(".import-files")).html('');
		$.ajax
			type:"POST"
			url: Steedos.absoluteUrl(url)
			processData: false
			contentType: false
			data: formData
			dataType: 'json'
			success: (data)->
				console.log('data', data)
				multiple = data.multiple
				successData = data.success
				if !template.data.flowId
					toastr.success(t("workflow_import_flow_success"))
				if multiple
					showSuccessElement(successData, template);
				else
					Modal.hide(template)
					if _.isFunction(template.data.onSuccess)
						new_flows = successData[_.keys(successData)[0]]?.new_flows
						template.data.onSuccess(new_flows)
			error: (e)->
				multiple = e.responseJSON.multiple
				if multiple
					fail = e.responseJSON.fail
					success = e.responseJSON.success
					showSuccessElement(success, template);
					failElement = []
					_.each _.keys(fail), (k)->
						failElement.push("<p>#{k}: #{fail[k]}</p>")
					$('.help-block', template.find(".import-files")).append("<div class='callout callout-danger'><h4>导入失败的文件(#{failElement.length}条)：</h4>#{failElement.join('')}</div>")
				toastr.error(t("workflow_import_flow_error"));
				console.error e

