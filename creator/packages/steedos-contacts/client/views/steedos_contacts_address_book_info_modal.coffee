Template.steedos_contacts_address_book_info_modal.helpers
	addressBook: ->
		return db.address_books.findOne Template.instance().data.targetId

	addressGroupName: (id)->
		address_group = db.address_groups.findOne id
		if address_group
			return address_group.name
		else
			return ""

Template.steedos_contacts_address_book_info_modal.events
	'click .steedos-info-close': (event,template) ->
		$("#steedos_contacts_address_book_info_modal .close").trigger("click")

	'click .steedos-info-edit': (event, template) ->
		Modal.allowMultiple = true
		AdminDashboard.modalEdit 'address_books', event.currentTarget.dataset.id

	'click .steedos-info-delete': (event, template) ->
		AdminDashboard.modalDelete 'address_books', event.currentTarget.dataset.id, ->
			$("#steedos_contacts_address_book_info_modal .close").trigger("click")


Template.steedos_contacts_address_book_info_modal.onRendered ()->


Template.steedos_contacts_address_book_info_modal.onDestroyed ->
	Modal.allowMultiple = false