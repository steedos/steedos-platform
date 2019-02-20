Template.cf_space_user_list.onCreated ->
	self = this;

	orgs = []

	if !Steedos.isSpaceAdmin()

		spaceId = Template.instance().data.spaceId || Session.get("cf_space")

		childrens = SteedosDataManager.organizationRemote.find({space: spaceId, hidden: {$ne: true}}, {
			fields: {
				_id: 1
			}
		})

		orgs = childrens.getProperty("_id")


	self.unhidden_orgs = new ReactiveVar(orgs);

	Session.set("cf_contact_list_search", false)

Template.cf_space_user_list.onDestroyed ->
	Session.set("cf_contact_list_search", false)

Template.cf_space_user_list.helpers
	selector: (userOptions, filters)->
		spaceId = Template.instance().data.spaceId || Session.get("cf_space")
		myContactsLimit = Steedos.my_contacts_limit
		rootOrg = Template.instance().data.rootOrg

		query = {space: spaceId, user_accepted: true};

		if filters
			filtersQuerys = CFDataManager.formatFiltersToMongo(filters)

			_.forEach(filtersQuerys, (q)->
				_.extend(query, q)
			)
		else
			_.extend(query, {profile: {$ne: 'member'}})

		unselectable_users = Template.instance().data.unselectable_users

		if _.isArray(unselectable_users)
			query.user = {$nin: unselectable_users}

		if userOptions != undefined && userOptions != null
			if !query.user
				query.user = {$in: userOptions.split(",")};
			else
				query.user.$in = userOptions.split(",");
		else
			if !Session.get("cf_contact_list_search")
				orgAndChild = Session.get("cf_orgAndChild");
				query.organizations = {$in: orgAndChild};
			else
				if rootOrg
					query.organizations = {$in: Session.get("cf_orgAndChild")};
				else if myContactsLimit?.isLimit
					orgs = db.organizations.find().fetch().getProperty("_id")
					outsideOrganizations = myContactsLimit.outside_organizations
					if outsideOrganizations.length
						orgs = _.union(orgs, outsideOrganizations)
					orgs_childs = SteedosDataManager.organizationRemote.find({parents: {$in: orgs}}, {
						fields: {
							_id: 1
						}
					});
					orgs = orgs.concat(orgs_childs.getProperty("_id"))
					query.organizations = {$in: orgs};
				else
					if Template.instance().data.spaceId != false && Session.get("spaceId")
						spaceIds = [Session.get("spaceId")]
					else
						spaceIds = db.spaces.find().fetch().getProperty("_id")

					if !Steedos.isSpaceAdmin()
						query.organizations = {$in: Template.instance().unhidden_orgs.get()}

					query.space = {$in: spaceIds}
		return query;


Template.cf_space_user_list.events
	'click #cf_reverse': (event, template) ->
		$('input[name="cf_contacts_ids"]', $(".cf_space_user_list_table")).each ->
			$(this).prop('checked', event.target.checked).trigger('change')
	'click .for-input': (event, template) ->
		values = CFDataManager.getContactModalValue();
		userId = event.currentTarget.dataset.user
		if values.getProperty("id").indexOf(userId) < 0
			$("#"+userId).prop('checked', true).trigger('change')
		else
			$("#"+userId).prop('checked', false).trigger('change')

	'change .list_checkbox': (event, template) ->

		target = event.target;

		if !template.data.multiple
			CFDataManager.setContactModalValue([{id: target.value, name: target.dataset.name}]);
			$("#confirm", $("#cf_contact_modal")).click();
			return;

		values = CFDataManager.getContactModalValue();

		if target.checked == true
			if values.getProperty("id").indexOf(target.value) < 0
				values.push({id: target.value, name: target.dataset.name});
		else
			values.remove(values.getProperty("id").indexOf(target.value))

		CFDataManager.setContactModalValue(values);

		CFDataManager.handerContactModalValueLabel();

	'input #cf-contact-list-search-key': (event, template) ->
		if $("#cf-contact-list-search-key").val().length == 0 && Session.get("cf_contact_list_search")
			Session.set("cf_contact_list_search", false)
			dataTable = $(".cf_space_user_list_table").DataTable();
			dataTable.search(
				$("#cf-contact-list-search-key").val(),
			).draw();
#		if $("#cf-contact-list-search-key").val() && $("#cf-contact-list-search-key").val().length > 0
#			Session.set("cf_contact_list_search", true)
#		else if Session.get("cf_contact_list_search")
#			Session.set("cf_contact_list_search", false)
#		else
#			return ;
#		dataTable = $(".cf_space_user_list_table").DataTable();
#		dataTable.search(
#			$("#cf-contact-list-search-key").val(),
#		).draw();

	'keypress #cf-contact-list-search-key': (event, template) ->
		if event.keyCode == 13
			if $("#cf-contact-list-search-key").val() && $("#cf-contact-list-search-key").val().length > 0
				Session.set("cf_contact_list_search", true)
			else if Session.get("cf_contact_list_search")
				Session.set("cf_contact_list_search", false)
			else
				return ;
			dataTable = $(".cf_space_user_list_table").DataTable();
			dataTable.search(
				$("#cf-contact-list-search-key").val(),
			).draw();

	'click #cf-contact-list-search_button': (event, template) ->
		if $("#cf-contact-list-search-key").val() && $("#cf-contact-list-search-key").val().length > 0
			Session.set("cf_contact_list_search", true)
		else if Session.get("cf_contact_list_search")
			Session.set("cf_contact_list_search", false)
		else
			return ;
		dataTable = $(".cf_space_user_list_table").DataTable();
		dataTable.search(
			$("#cf-contact-list-search-key").val(),
		).draw();

Template.cf_space_user_list.onRendered ->
	TabularTables.cf_tabular_space_user.customData = @data

	if !@data.multiple
		$("#cf_reverse").hide();

# CFDataManager.setContactModalValue(@data.defaultValues);
# $("#contact_list_load").hide();