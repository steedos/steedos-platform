@SteedosContacts = {}

SteedosContacts.getHiddenUsers = (space)->
	hidden_users = Meteor.settings.public?.contacts?.hidden_users || []

	setting = db.space_settings.findOne({space: space, key: "contacts_hidden_users"})

	setting_hidden_users = setting?.values || []

	hidden_users = hidden_users.concat(setting_hidden_users)

	return hidden_users;