Template.steedos_contacts_user_list.helpers
	showBooksList: ->
		if Session.get("contact_showBooks")
			return true
		return false;
	selector: ->
		unless Meteor.userId()
			return {_id:-1}
		spaceId = Steedos.spaceId()
		myContactsLimit = Steedos.my_contacts_limit
		# hidden_users = SteedosContacts.getHiddenUsers(spaceId)
		# query = {space: spaceId, user: {$nin: hidden_users}}
		query = {space: spaceId}
		if !Session.get("contact_list_search")
			orgId = Session.get("contacts_orgId");
			query.organizations = {$in: [orgId]};
		else
			if Session.get("contacts_orgId")
				orgs = [Session.get("contacts_orgId")]
			else if myContactsLimit?.isLimit
				orgs = db.organizations.find().fetch().getProperty("_id")
				outsideOrganizations = myContactsLimit.outside_organizations
				if outsideOrganizations?.length
					orgs = _.union(orgs, outsideOrganizations)
			orgs_childs = SteedosDataManager.organizationRemote.find({parents: {$in: orgs}}, {
				fields: {
					_id: 1
				}
			});
			orgs = _.union(orgs, orgs_childs.getProperty("_id"))
			query.organizations = {$in: orgs};

		query.user_accepted = true
		return query;

	books_selector: ->
		query = {owner: Meteor.userId()};
		if Session.get("contacts_groupId") != "parent"
			query.group = Session.get("contacts_groupId");
		return query;

	is_admin: ()->
		return Session.get('contacts_is_org_admin') && !Session.get("contact_list_search")

	isMobile: ()->
		return Steedos.isMobile();

	canImportUsers: ()->
		if Steedos.isMobile()
			return false
		return true

	is_nwjs: ()->
		return Steedos.isNode();

	getOrgName: ()->
		return SteedosDataManager.organizationRemote.findOne({_id:Session.get("contacts_orgId")},{fields:{name: 1}})?.name;

	isSpaceAdmin: ()->
		return Steedos.isSpaceAdmin(Session.get("spaceId"));

Template.steedos_contacts_user_list.events

	'click #contact-list-search-btn': (event, template) ->
		if $("#contact-list-search-key").val()
			Session.set("contact_list_search", true)
		else
			Session.set("contact_list_search", false)
		dataTable = $(".datatable-steedos-contacts").DataTable();
		dataTable.search(
			$("#contact-list-search-key").val(),
		).draw();

	'click #steedos_contacts_show_orgs': (event, template)->
		listWrapper = $(".contacts-list-wrapper")
		if listWrapper.is(":hidden")
			listWrapper.show();
		else
			listWrapper.hide();

	'click .datatable-steedos-contacts tbody tr[data-id]': (event, template)->
		Modal.show('steedos_contacts_space_user_info_modal', {targetId: event.currentTarget.dataset.id, isEditable: false})

	'selectstart #contacts_list .drag-source': (event, template)->
		return false

	'dragstart #contacts_list .drag-source': (event, template)->
		event.preventDefault()
		return false

Template.steedos_contacts_user_list.onRendered ->
	$('[data-toggle="tooltip"]').tooltip()
	
	TabularTables.steedosContactsOrganizations.customData = @data
	TabularTables.steedosContactsBooks.customData = @data
	
	ContactsManager.setContactModalValue(@data.defaultValues);

	ContactsManager.handerContactModalValueLabel();
	$("#contact_list_load").hide();
