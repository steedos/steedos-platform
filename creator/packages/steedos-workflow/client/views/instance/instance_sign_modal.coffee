Template.instanceSignModal.helpers
	modal_suggestion: ()->

		history_approve = Template.instance()?.history_approve.get()

		if history_approve && history_approve?.description
			return history_approve.description
		else
			description = Session.get("instance_my_approve_description") || InstanceManager.getCurrentApprove()?.description || InstanceSignText.helpers.getLastSignApprove()?.description || ""
			return description;

	show_suggestion_counts: ()->
		ins = WorkflowManager.getInstance()
		sign_approves = TracesManager.getHandlerSignShowApproves(ins, Meteor.userId()) || []
		count = 0
		sign_approves.forEach (approve) ->
			if approve.sign_show == true
				count++ 

		return count

	sign_type_add: ()->
		ins = WorkflowManager.getInstance()

		sign_approves = TracesManager.getHandlerSignShowApproves(ins, Meteor.userId(), false) || []

		if sign_approves.length == 0
			return true

	opinions: () ->
		opinions = []
		o = db.steedos_keyvalues.findOne({user: Meteor.userId(), key: 'flow_opinions', 'value.workflow': $exists: true})
		if o
			opinions = o.value.workflow
		return opinions.slice(0,3)

Template.instanceSignModal.events
	'click #instance_flow_opinions': (event, template)->
		Session.set('flow_comment', $("#modal_suggestion").val())
		Modal.allowMultiple = true
		Modal.show 'opinion_modal',{parentNode: $("#modal_suggestion")}

	'click #instance_sign_modal_ok': (event, template)->

		myApprove = InstanceManager.getCurrentApprove()

		Meteor.call 'update_approve_sign', myApprove.instance, myApprove.trace, myApprove._id, template.data.sign_field_code, $("#modal_suggestion").val(), $("#sign_type:checked")?.val() || "update", Template.instance()?.history_approve.get() || InstanceSignText.helpers.getLastSignApprove()

		$("#suggestion").val($("#modal_suggestion").val()).trigger("input").focus();

		Modal.allowMultiple = false

		Modal.hide(template)

	'click .instance-sign-opinion-btn': (event, template)->
		regText = ""
		$(".instance-sign-opinion-btn").each ->
			regText += "#{$(this).text()}|"

		regText = regText.substring(0,regText.length-1)

		reg = new RegExp(regText,"ig")

		currentText = event.target.text

		suggestion = $("#modal_suggestion").val() || ""
		
		if suggestion.match(reg) == null
			val = suggestion + currentText
		else
			val = suggestion.replace(reg,currentText)

		$("#modal_suggestion").val(val)

	'click .instance-sign-history': (event, template)->
		Modal.allowMultiple = true
		Modal.show 'history_sign_approve', {parent: template}

#	'shown.bs.modal .instance-sign-modal': ()->
#
#		if !Steedos.isMobile()
#			$modal_dialog = $(".instance-sign-modal").find('.modal-dialog');
#
#			m_top = ( $(window).height() - $modal_dialog.height() )/2;
#
#			$modal_dialog.css({'margin': m_top + 'px auto'})

Template.instanceSignModal.onCreated ->
	this.history_approve = new ReactiveVar()