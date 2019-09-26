Template.admin_flows_roles_detail_modal.onRendered ->
	Modal.allowMultiple = false

Template.admin_flows_roles_detail_modal.helpers
	doc: ()->
		data = Template.instance().data
		return data

	isAdd: ()->
		action = Session.get 'position-action'
		if action == 'add'
			return true
		return false


Template.admin_flows_roles_detail_modal.events
	'click .add-positions': (event,template) ->
		Template.instance().data
		data = 
			role: Template.instance().data?.role
			users: AutoForm.getFieldValue("users","flowPositions")
			org: AutoForm.getFieldValue("org","flowPositions")
			space: AutoForm.getFieldValue("space","flowPositions")

		a = db.flow_positions.insert(data)
		if a
			toastr.success t("flow_positions_add_suceess")
		else
			toastr.error t("flow_positions_add_failed")

		Modal.hide(template)

	'click .save-positions': (event,template) ->
		data = Template.instance().data
		data.users = AutoForm.getFieldValue("users","flowPositions")
		data.org = AutoForm.getFieldValue("org","flowPositions")
		a = db.flow_positions.update { _id: data._id }, $set:
			role: data.role
			users: data.users
			org: data.org
		if a
			toastr.success t("flow_positions_update_suceess")
		else
			toastr.error t("flow_positions_update_failed")
		
		Modal.hide(template)

	'click .remove-positions': (event,template) ->
		data = Template.instance().data
		db.flow_positions.remove {_id:data._id},(error,result) ->
			if result
				toastr.success t("flow_positions_delete_suceess")
			else
				toastr.error t(error.reason)
		Modal.hide(template)