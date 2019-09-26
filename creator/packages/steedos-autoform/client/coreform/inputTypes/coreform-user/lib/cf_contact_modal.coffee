Template.cf_contact_modal.helpers
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

Template.cf_contact_modal.events
	'click #confirm': (event, template) ->
		target = template.data.target

#		target = $("#" + template.data.targetId)
		values = CFDataManager.getContactModalValue();

		target.dataset.values = values.getProperty("id").toString();

		$(target).val(values.getProperty("name").toString()).trigger('change');

		Modal.hide("cf_contact_modal");

		Modal.allowMultiple = false;

	'click #remove': (event, template) ->
		target = template.data.target
#		target = $("#" + template.data.targetId)
		target.dataset.values = "";
		$(target).val("").trigger('change');
		Modal.hide("cf_contact_modal");
		Modal.allowMultiple = false;

	'click .organization-active': (event, template) ->
		# Modal.show("cf_users_organization_modal");
		$('#cf_users_organization_modal_div').show()
		cssHeightKey = "max-height"
		if Steedos.isMobile()
			cssHeightKey = "height"

		Steedos.setModalMaxHeight()


	'hide.bs.modal #cf_contact_modal': (event, template) ->
		Modal.allowMultiple = false;
		return true;

#	'click .value-label-remove': (event, tem) ->
#		debugger;

Template.cf_contact_modal.onRendered ->
	CFDataManager.setContactModalValue(CFDataManager.getFormulaSpaceUsers(@data.defaultValues, @data.spaceId));
	CFDataManager.handerContactModalValueLabel();

