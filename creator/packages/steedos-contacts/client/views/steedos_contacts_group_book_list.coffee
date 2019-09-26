Template.steedos_contacts_group_book_list.helpers
	showBooksList: ->
		if Session.get("contact_showBooks")
			return true
		return false;
	selector: ->
		query = {space: Session.get("spaceId"), user_accepted: true};

		orgId = Session.get("contacts_orgId");

		childrens = ContactsManager.getOrgAndChild(orgId);

		query.organizations = {$in: childrens};

		return query;

	books_selector: ->
		query = {owner: Meteor.userId()};
		if Session.get("contacts_groupId") != "root"
			query.group = Session.get("contacts_groupId");
		return query;

	getOrgName: ->

		if(Session.get("contacts_groupId") == "root")
			return TAPi18n.__("contacts_personal_contacts")

		return db.address_groups.findOne({_id:Session.get("contacts_groupId")},{fields:{name: 1}})?.name;

	is_disabled: ->
		return !Session.get("contacts_groupId") || Session.get("contacts_groupId")=='root'

	isSearchNeeded: ->
		unless Steedos.isMobile()
			return true
		return Steedos.isZoomNormal()

Template.steedos_contacts_group_book_list.events
	'click #reverse': (event, template) ->
		$('input[name="contacts_ids"]', $("#contacts_list")).each ->
			$(this).prop('checked', event.target.checked).trigger('change')

	'click .contacts-list-checkbox': (event, template) ->
		event.stopPropagation()

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
		dataTable = $(".datatable-steedos-contacts").DataTable();
		dataTable.search(
			$("#contact-list-search-key").val(),
		).draw();

	'click #steedos_contacts_group_book_list_add_btn': (event, template) ->
		AdminDashboard.modalNew 'address_books', { group: Session.get('contacts_groupId')}

	'click #steedos_contacts_group_book_list_import_btn': (event, template) ->
		Modal.show "steedos_contacts_import_modal", event.currentTarget.dataset.id

	'click #steedos_contacts_group_book_list_edit_btn': (event, template) ->
		AdminDashboard.modalEdit 'address_books', event.currentTarget.dataset.id

	'click #steedos_contacts_group_book_list_remove_btn': (event, template) ->
		AdminDashboard.modalDelete 'address_books', event.currentTarget.dataset.id

	'click #steedos_contacts_show_orgs': (event, template)->
		listWrapper = $(".contacts-list-wrapper")
		if listWrapper.is(":hidden")
			listWrapper.show();
		else
			listWrapper.hide();
	'click #steedos_contacts_group_book_list_export_btn': (event, template) ->

		ids = new Array();

		$('input[name="contacts_ids"]:checked').each ()->
			ids.push($(this).val())

		if ids.length < 1
			toastr.warning(t("steedos_contacts__books_export_error"));
			event.preventDefault();

		$("#steedos_contacts_group_book_list_export_btn").prop("href", Meteor.absoluteUrl() + "/contacts/books/export/cvf?ids=" + ids.toString())

	'click .datatable-steedos-contacts tbody tr[data-id]': (event, template)->
		Modal.show('steedos_contacts_address_book_info_modal', {targetId: event.currentTarget.dataset.id})

Template.steedos_contacts_group_book_list.onRendered ->
	$('[data-toggle="tooltip"]').tooltip()
	TabularTables.steedosContactsOrganizations.customData = @data
	TabularTables.steedosContactsBooks.customData = @data

	ContactsManager.setContactModalValue(@data.defaultValues);

	ContactsManager.handerContactModalValueLabel();
	$("#contact_list_load").hide();

	$(".datatable-steedos-contacts").wrap("<div class = 'table-responsive'></div>")