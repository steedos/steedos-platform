Template.cf_users_organization_modal.events
	'click #cf-users-organization-modal-close,#cf-users-organization-modal-confirm': (event, template) ->
		$('#cf_users_organization_modal_div').hide();
		$('.modal-backdrop').hide()

Template.cf_contact_modal.onRendered ->
	$('#cf_users_organization_modal_div').hide();
	$('.modal-backdrop').hide()