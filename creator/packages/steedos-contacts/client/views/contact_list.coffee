Template.contacts_list.helpers 
    showBooksList: ->
        if Session.get("contact_showBooks")
            return true
        return false;
    selector: ->
        query = {space: Session.get("spaceId"), user_accepted: true};

        orgId = Session.get("contacts_orgId");

        query.organizations_parents = orgId
        
        return query;

    books_selector: ->
        query = {owner: Meteor.userId()};
        if Session.get("contacts_groupId") != "root"
            query.group = Session.get("contacts_groupId");
        return query;

Template.contacts_list.events
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
        dataTable = $(".datatable-steedos-contacts").DataTable();
        dataTable.search(
            $("#contact-list-search-key").val(),
        ).draw();

    'click .contacts-info': (event, template)->
        Modal.allowMultiple = true;
        Modal.show('steedos_contacts_space_user_info_modal', {targetId: event.currentTarget.dataset.id})

Template.contacts_list.onRendered ->
    TabularTables.contacts.customData = @data
    TabularTables.contactsBooks.customData = @data
    
    ContactsManager.setContactModalValue(@data.defaultValues);

    ContactsManager.handerContactModalValueLabel();
    $("#contact_list_load").hide();

    # $(".datatable-steedos-contacts").wrap("<div class = 'table-responsive'></div>")