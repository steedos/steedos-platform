Template.admin_flow_modal.helpers
	doc: ->
		return Template.instance().data.flow

	flow_schema: ->
		return new SimpleSchema(Template.instance().data._fields)


Template.admin_flow_modal.onRendered ->

Template.admin_flow_modal.events
	'click .save-flow': (event, template)->
		data = template.data.flow

		form_value = AutoForm.getFormValues("admin_flow");

		print_template = form_value.insertDoc.print_template

		instance_template = form_value.insertDoc.instance_template

		events = form_value.insertDoc.events

		field_map = form_value.insertDoc.field_map

		db.flows.update {_id: data._id}, form_value.updateDoc, (error,result) ->
			if !error
				toastr.success t("flow_roles_update_success")
			else
				toastr.error t(error)

		Modal.hide(template)

	'click .export-table-template': (event, template)->
		data = template.data.flow
		window.open("/api/workflow/export/talbe_template?flow=#{data._id}")

