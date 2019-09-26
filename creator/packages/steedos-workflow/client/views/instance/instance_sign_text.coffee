Template.instanceSignText.helpers InstanceSignText.helpers

Template.instanceSignText.events
	'click .instance-sign-text-btn': (event, template)->

		instance = WorkflowManager.getInstance();

		if instance.state == 'completed'
			toastr.warning(t("workflow_sign_opinion_to_completed_instance"))

		form_version = WorkflowManager.getInstanceFormVersion();
		fields = form_version?.fields

		modal_title = fields?.findPropertyByPK("code", template.data.name)?.name || template.data.name

		Modal.show("instanceSignModal", {modal_title: modal_title, sign_field_code: template.data.name})
		
Template.instanceSignText.onDestroyed ->
	Session.set("instance_my_approve_description", null)

Template.instanceSignText.onCreated ()->
	self = this
	myApprove = InstanceManager.getCurrentApprove()
	self.myApprove = new ReactiveVar(myApprove)

	self.autorun ->
		myApprove = InstanceManager.getCurrentApprove()
		self.myApprove.set(myApprove)