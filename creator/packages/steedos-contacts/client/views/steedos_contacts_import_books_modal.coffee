Template.steedos_contacts_import_modal.helpers
	contactsFields: ->

		# hidden_users = SteedosContacts.getHiddenUsers(Session.get("spaceId"))

		data = {
			name: 'books_contacts',
			atts: {
				name: 'books_contacts',
				id: 'books_contacts',
				class: 'selectUser form-control',
				# style: 'padding:6px 12px;width:140px;display:inline',
				multiple: true
				# unselectable_users: hidden_users
			}
		}
		return data;


Template.steedos_contacts_import_modal.events
	'click #steedos_contacts_confirm': (event, template) ->
		users = []
		if $("input[name='books_contacts']")[0].dataset.values
			users = $("input[name='books_contacts']")[0].dataset.values.split(",")
		
		groupId = Session.get("contacts_groupId")
		spaceId = Session.get("spaceId")

		if users.length > 0
			Meteor.call('import_users_from_contacts', users, groupId, spaceId, (error, result) ->
				$(document.body).removeClass('loading')
				if error
					if error.error
						toastr.error TAPi18n.__ error.reason
					else
						toastr.error error.message

				if result
					Modal.hide(template)
					toastr.success(TAPi18n.__('steedos_contacts_import_success'))
			)
		
