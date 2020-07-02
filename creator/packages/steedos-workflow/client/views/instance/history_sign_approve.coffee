Template.history_sign_approve.helpers
	sign_approves: ()->
		ins = WorkflowManager.getInstance()

		sign_approves = TracesManager.getHandlerSignShowApproves(ins, Meteor.userId()) || []
		# sign_approves = TracesManager.getHandlerSignShowApproves(ins, Meteor.userId(), true) || []
		# if InstanceManager.getCurrentApprove().description
		# 	sign_approves.push(InstanceManager.getCurrentApprove())
		return sign_approves.reverse()

	format: (time) ->
		return moment(time).format("YYYY-MM-DD HH:mm")


Template.history_sign_approve.events
	'hide.bs.modal #history-sign-approve': (event, template) ->
		Modal.allowMultiple = false;
		return true;

	'click .history-sign-approve .use-suggestion': (event, template) ->
		template.data.parent.history_approve.set(this)
		Modal.hide(template)

	'click .confirm-select-suggestion': (event, template) ->
		$("body").addClass("loading")
		targetObjs = []
		ins = WorkflowManager.getInstance()
		sign_approves = TracesManager.getHandlerSignShowApproves(ins, Meteor.userId()) || []
		$('.select-suggestion input.weui-switch').each ->
			currentApproveId = $(this).val()
			sign_show = $(this).is(":checked")
			sign_approves.forEach (approve) ->
				if approve._id == currentApproveId
					targetObj = approve
					targetObj.sign_show = sign_show
					targetObjs.push targetObj

		myApprove = InstanceManager.getCurrentApprove()

		Meteor.call('update_sign_show', targetObjs, myApprove?._id
			(error, result) ->
				if error
					console.log error
				else
					$("body").removeClass("loading")
					Modal.hide(template)
		)
