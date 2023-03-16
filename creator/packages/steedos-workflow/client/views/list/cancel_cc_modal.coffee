Template.cancel_cc_modal.helpers
	traces: () ->
		ins = WorkflowManager.getInstance()
		if not ins
			return

		traces = []
		userId = Meteor.userId()
		ins_traces = db.instance_traces.find().fetch()
		_.each ins_traces, (ins_t) ->
			if ins_t._id == ins._id
				_.each ins_t.traces, (t) ->
					newt = { _id: t._id, name: t.name, cc_approves: [] }
					if t.approves
						_.each t.approves, (a) ->
							if a.type is 'cc' and (a.from_user is userId) and !a.is_finished
								newt.cc_approves.push(a)

					if not _.isEmpty(newt.cc_approves)
						traces.push(newt)

		return traces

	dateFormat: (date) ->
		if Steedos.isMobile() && date?.getFullYear() == (new Date).getFullYear()
			return $.format.date new Date(date), "MM-dd HH:mm"
		else
			return $.format.date new Date(date), "yyyy-MM-dd HH:mm"


Template.cancel_cc_modal.events
	'click .handler-name': (event, template) ->
		approveid = event.currentTarget.dataset.approveid
		if $("#" + approveid)
			$("#" + approveid).click()

	'click .cancel_cc_modal_all_approve_toggle': (event, template) ->
		$("[name='#{event.currentTarget.id}']").prop('checked', event.currentTarget.checked)

	'click .btn-primary': (event, template) ->
		checked_ids = []
		_.each $('.for-cancel-checkbox'), (c) ->
			if c.checked and c.id
				checked_ids.push(c.id)

		if not _.isEmpty(checked_ids)
			$("body").addClass("loading")
			Meteor.call 'batch_cancel_cc', Session.get('instanceId'), checked_ids, (error, result) ->
				$("body").removeClass("loading")
				if error
					toastr.error TAPi18n.__(error.reason)
				if result == true
					toastr.success(TAPi18n.__("instance_approve_forward_remove_success"))
					Modal.hide(template)
					Modal.allowMultiple = false

Template.cancel_cc_modal.onCreated ->

	$("body").addClass("loading")

	Steedos.subs["instance_traces"].subscribe("instance_traces", Session.get("instanceId"))

	Tracker.autorun () ->
		if Steedos.subs["instance_traces"].ready()
			$("body").removeClass("loading")

Template.cancel_cc_modal.onRendered ->

	Modal.allowMultiple = true

Template.cancel_cc_modal.onDestroyed ->
	console.log("Template.cancel_cc_modal.onDestroyed...")
	Modal.allowMultiple = false
	Steedos.subs["instance_traces"].clear()