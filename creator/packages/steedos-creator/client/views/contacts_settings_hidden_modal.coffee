Template.contacts_settings_hidden_modal.helpers
	users_schema: ()->
		fields =
			hidden_users:
				autoform:
					type: 'selectuser'
					multiple: true
					defaultValue: ()->
						setting = db.space_settings.findOne({space: Session.get("spaceId"), key: "contacts_hidden_users"})
						return setting?.values || []
				optional: false
				type: [ String ]
				label: ''

		return new SimpleSchema(fields)


Template.contacts_settings_hidden_modal.events
	'click #contacts_settings_hidden_modal_ok': (event, template)->
		Meteor.call("set_space_settings", Session.get("spaceId"), "contacts_hidden_users", AutoForm.getFieldValue("hidden_users","contacts_settings_hidden_users"), true, ()->
			Modal.hide(template);
			toastr.success(t("saved_successfully"))
		)