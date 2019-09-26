Template.cancel_distribute_modal.helpers
	traces: () ->
		ins = WorkflowManager.getInstance()
		if not ins
			return

		traces = []
		userId = Meteor.userId()
		hasPermission = WorkflowManager.hasFlowAdminPermission(ins.flow, ins.space, userId)
		_.each ins.traces, (t) ->
			newt = { _id: t._id, name: t.name, distribute_approves: [] }
			if t.approves
				_.each t.approves, (a) ->
					if a.type is 'distribute' and (a.from_user is userId or hasPermission) and a.judge isnt 'terminated' and a.forward_instance
						f = db.instances.findOne(a.forward_instance)
						if f and f.state is 'draft'
							newt.distribute_approves.push(a)

			if not _.isEmpty(newt.distribute_approves)
				traces.push(newt)

		return traces

	dateFormat: (date) ->
		if Steedos.isMobile() && date?.getFullYear() == (new Date).getFullYear()
			return $.format.date new Date(date), "MM-dd HH:mm"
		else
			return $.format.date new Date(date), "yyyy-MM-dd HH:mm"


Template.cancel_distribute_modal.events
	'click .handler-name': (event, template) ->
		approveid = event.currentTarget.dataset.approveid
		if $("#" + approveid)
			$("#" + approveid).click()

	'click .cancel_distribute_modal_all_approve_toggle': (event, template) ->
		$("[name='#{event.currentTarget.id}']").prop('checked', event.currentTarget.checked)

	'click .btn-primary': (event, template) ->
		checked_ids = []
		_.each $('.for-cancel-checkbox'), (c) ->
			if c.checked and c.id
				checked_ids.push(c.id)

		if not _.isEmpty(checked_ids)
			$("body").addClass("loading")
			Meteor.call 'cancelDistribute', Session.get('instanceId'), checked_ids, (error, result) ->
				$("body").removeClass("loading")
				if error
					toastr.error TAPi18n.__(error.reason)
				if result == true
					toastr.success(TAPi18n.__("instance_approve_forward_remove_success"))
					Modal.hide(template)
					Modal.allowMultiple = false