Template.steedos_contacts_org_user_list.helpers 
	showBooksList: ->
		if Session.get("contact_showBooks")
			return true
		return false;
	selector: ->
		unless Meteor.userId()
			return {_id:-1}
		spaceId = Steedos.spaceId()
		myContactsLimit = Steedos.my_contacts_limit
		query = {space: spaceId}
		# if FlowRouter.current().path != "/admin/organizations"
		# 	# 系统设置中组织架构以外的通讯录都需要限制隐藏用户显示
		# 	hidden_users = SteedosContacts.getHiddenUsers(spaceId)
		# 	query.user = {$nin: hidden_users}
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

		if !Session.get('contacts_is_org_admin')
			query.user_accepted = true

		# console.log query
		return query;

	books_selector: ->
		query = {owner: Meteor.userId()};
		if Session.get("contacts_groupId") != "parent"
			query.group = Session.get("contacts_groupId");
		return query;

	is_admin: ()->
		return Session.get('contacts_is_org_admin') && !Session.get("contact_list_search")
	
	canAddUser: ()->
		is_admin = Session.get('contacts_is_org_admin') && !Session.get("contact_list_search")
		if is_admin and Steedos.isSpaceAdmin()
			return true
		if Meteor.settings.public?.contacts?.disableAddUserForSubAdmin
			return false
		else
			return is_admin

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

Template.steedos_contacts_org_user_list.events
	'click #reverse': (event, template) ->
		$('input[name="contacts_ids"]', $("#contacts_list")).each ->
			$(this).prop('checked', event.target.checked).trigger('change')

	'change .contacts-list-checkbox': (event, template) ->

		target = event.target;

		values = ContactsManager.getContactModalValue();

		if target.checked == true
			if values.getProperty("email").indexOf(target.dataset.email) < 0
				values.push({id: target.value, name: target.dataset.name, email: target.dataset.email});
		else
			values.remove(values.getProperty("email").indexOf(target.dataset.email))

		ContactsManager.setContactModalValue(values);

		ContactsManager.handerContactModalValueLabel();

	'click #contact-list-search-btn': (event, template) ->
		if $("#contact-list-search-key").val()
			Session.set("contact_list_search", true)
		else
			Session.set("contact_list_search", false)
		dataTable = $(".datatable-steedos-contacts").DataTable();
		selector = $("#contact-list-search-key").val()
		dataTable.search(
			selector
		).draw();

	'keypress #contact-list-search-key': (event, template) ->
		if event.keyCode == 13
			if $("#contact-list-search-key").val()
				Session.set("contact_list_search", true)
			else
				Session.set("contact_list_search", false)
			dataTable = $(".datatable-steedos-contacts").DataTable();
			dataTable.search(
				$("#contact-list-search-key").val(),
			).draw();

	# 'click #steedos_contacts_org_user_list_edit_btn': (event, template) ->
	# 	event.stopPropagation()
	# 	AdminDashboard.modalEdit 'space_users', event.currentTarget.dataset.id

	# 'click #steedos_contacts_org_user_list_remove_btn': (event, template) ->
	# 	event.stopPropagation()
	# 	AdminDashboard.modalDelete 'space_users', event.currentTarget.dataset.id

	'click #steedos_contacts_add_users_btn': (event,template) ->
		Modal.show('steedos_contacts_add_user_modal')

	'click #steedos_contacts_invite_users_btn': (event, template) ->
		Modal.show('steedos_contacts_invite_users_modal')

	'click #steedos_contacts_show_orgs': (event, template)->
		listWrapper = $(".contacts-list-wrapper")
		if listWrapper.is(":hidden")
			listWrapper.show();
		else
			listWrapper.hide();

	'click .datatable-steedos-contacts tbody tr[data-id] td:not(:last-of-type)': (event, template)->
		targetId = $(event.currentTarget).closest("tr").data("id")
		Modal.show('steedos_contacts_space_user_info_modal', {targetId: targetId})

	'selectstart #contacts_list .drag-source': (event, template)->
		return false

	'dragstart #contacts_list .drag-source': (event, template)->
		event.originalEvent.dataTransfer.setData("Text","")
		draggingId = $(event.currentTarget).data("id")
		Session.set("dragging_contacts_org_user_id",draggingId)
		$(event.currentTarget).addClass("drag-source-moving")
		orgTree = $("#steedos_contacts_org_tree")
		orgTree.find(".jstree-node").addClass("drag-target")
		event.originalEvent.dataTransfer.effectAllowed = "move"
		cursorIcon = $('<img src="data:image/png;base64,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" />');
		event.originalEvent.dataTransfer.setDragImage?(cursorIcon[0], 16, 15)

	'dragend #contacts_list .drag-source': (event, template)->
		$(event.currentTarget).removeClass("drag-source-moving")
		return false


	'click #steedos_contacts_import_users_btn': (event, template)->
		if !Steedos.isPaidSpace()
			Steedos.spaceUpgradedModal()
			return;

		Modal.show("import_users_modal");

	'click #steedos_contacts_export_users_btn': (event, template)->

		spaceId = Session.get("spaceId")
		orgId = Session.get("contacts_orgId")
		if spaceId and orgId
			uobj = {}
			uobj["X-User-Id"] = Meteor.userId()
			uobj["X-Auth-Token"] = Accounts._storedLoginToken()
			uobj.space_id = spaceId
			uobj.org_id = orgId
			url = Steedos.absoluteUrl() + "api/contacts/export/space_users?" + $.param(uobj)
			window.open(url, '_parent', 'EnableViewPortScale=yes')

	'click .edit-person .contacts-tableau-modify-username': (event, template) ->
		space_id = Session.get("spaceId")
		username = ""
		user_id = event.currentTarget.dataset.user
		unless user_id
			return;
		Meteor.call 'fetchUsername', user_id, (error, result) ->
			if error
				toastr.error TAPi18n.__(error.reason)
			else
				username = result
				swal {
					title: t('contacts_tableau_modify_username')
					type: "input"
					inputValue: username || ""
					showCancelButton: true
					closeOnConfirm: false
					confirmButtonText: t('OK')
					cancelButtonText: t('Cancel')
					showLoaderOnConfirm: false
				}, (inputValue)->
					if inputValue is false
						return false
					if inputValue?.trim() == username?.trim()
						swal.close()
						return false;
					Meteor.call "setUsername", space_id, inputValue?.trim(), user_id, (error, results)->
						if results
							toastr.success t('Change username successfully')
							swal.close()
						if error
							toastr.error(TAPi18n.__(error.error))


	'click .edit-person .contacts-tableau-modify-password': (event, template) ->
		user_id = event.currentTarget.dataset.user
		swal {
			title: t('contacts_tableau_modify_password')
			type: "input"
			inputType: "password"
			inputValue: ""
			showCancelButton: true
			closeOnConfirm: false
			confirmButtonText: t('OK')
			cancelButtonText: t('Cancel')
			showLoaderOnConfirm: false
		}, (inputValue)->
			if inputValue is false
				return false
			
			result = Steedos.validatePassword inputValue
			space_id = Steedos.spaceId()
			if result.error
				return toastr.error result.error.reason

			Meteor.call "setUserPassword", user_id, space_id, inputValue, (error, result) ->
				if error
					toastr.error error.reason
				else
					swal.close()
					toastr.success t("Change password successfully")

	'click .edit-person .contacts-tableau-edit-user': (event, template) ->
		id = event.currentTarget.dataset.id
		AdminDashboard.modalEdit 'space_users', id, ->
			$("body").off("click",".admin-dashboard-body input[name=mobile]")


	'click .edit-person .contacts-tableau-delete-user': (event, template) ->
		id = event.currentTarget.dataset.id
		AdminDashboard.modalDelete 'space_users', id, ->
				$("#steedos_contacts_space_user_info_modal .close").trigger("click")


Template.steedos_contacts_org_user_list.onRendered ->
	$('[data-toggle="tooltip"]').tooltip()
	
	TabularTables.steedosContactsOrganizations.customData = @data
	TabularTables.steedosContactsBooks.customData = @data
	
	ContactsManager.setContactModalValue(@data.defaultValues);

	ContactsManager.handerContactModalValueLabel();
	$("#contact_list_load").hide();
