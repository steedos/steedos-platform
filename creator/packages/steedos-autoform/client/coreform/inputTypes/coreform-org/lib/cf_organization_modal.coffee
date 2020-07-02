Template.cf_organization_modal.helpers
	footer_display: (multiple)->
		if !multiple
			return "display:none";
		return "";

	modalStyle: (showOrg) ->
		if showOrg && !Steedos.isMobile()
			return "modal-lg";
		return "";

	isMobile: ()->
		return Steedos.isMobile();


	orgName: ()->
		orgId = Session.get("cf_selectOrgId");
		org = SteedosDataManager.organizationRemote.findOne({_id: orgId},{fields:{name:1}});

		return org.name;

	data: ()->
		Template.instance().data

Template.cf_organization_modal.events
	'click #confirm': (event, template) ->

		target = template.data.target
#		target = $("#"+template.data.targetId)

		values = CFDataManager.getOrganizationModalValue();

		target.dataset.values = values.getProperty("id").toString();

		$(target).val(values.getProperty("fullname").toString()).trigger('change');

		Modal.hide("cf_organization_modal");

		Modal.allowMultiple = false;

	'click #remove': (event, template) ->
#		target = $("#"+template.data.targetId)
		target = template.data.target
		target.dataset.values = "";

		$(target).val("").trigger('change');

		Modal.hide("cf_organization_modal");

		Modal.allowMultiple = false;

	'hide.bs.modal #cf_organization_modal': (event, template) ->
		Modal.allowMultiple = false;
		return true;

Template.cf_organization_modal.onRendered ->
	CFDataManager.handerOrganizationModalValueLabel();
