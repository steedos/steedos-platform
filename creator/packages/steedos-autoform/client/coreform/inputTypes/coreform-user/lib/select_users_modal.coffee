Template.select_users_modal.helpers
	footer_display: (multiple)->
		if !multiple
			return "display:none";
		return "";

	modalStyle: (showOrg) ->
		if !Steedos.isMobile()
			return "modal-lg";
		return "";

	isMobile: ()->
		return Steedos.isMobile();

	orgName: ()->
		orgId = Session.get("cf_selectOrgId");

		spaceId = Session.get("cf_space")

		if orgId == '#'
			org = SteedosDataManager.organizationRemote.findOne({space: spaceId, parent: null}, {fields: {name: 1}});
		else
			org = SteedosDataManager.organizationRemote.findOne({_id: orgId, space: spaceId}, {fields: {name: 1}});

		return org?.name;

	data: ()->
		Template.instance().data
	bodyId: ()->
		Template.instance().bodyId
Template.select_users_modal.onCreated ()->
	this.bodyId = 'select_users_modal_body_' + new Date().getTime()

Template.select_users_modal.events
	'click #confirm': (event, template) ->
		Steedos.Page.Blaze.selectUserModalBody.onConfirm(event, template)
		

	'click #remove': (event, template) ->
		Steedos.Page.Blaze.selectUserModalBody.onRemove(event, template)
		
	'hide.bs.modal #cf_contact_modal': (event, template) ->
		Modal.allowMultiple = false;
		return true;
Template.select_users_modal.onRendered ->
	Steedos.Page.Blaze.selectUserModalBody.render(this)

