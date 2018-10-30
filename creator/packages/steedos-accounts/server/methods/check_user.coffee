Meteor.methods checkUser: (options) ->
	check options, Object
	{ company,name,email,password,profile } = options
	check company, String
	check name, String
	check email, String
	check password, Object
	check profile, Object

	unless company
		throw new Meteor.Error(403, "accounts_register_company_empty")
		return false
	unless name
		throw new Meteor.Error(403, "accounts_register_name_empty")
		return false
	unless email
		throw new Meteor.Error(403, "accounts_register_email_empty")
		return false
	unless password
		throw new Meteor.Error(403, "accounts_register_password_empty")
		return false

	email = email.toLowerCase().replace(/\s+/gm, '')
	user = db.users.findOne({'emails.address': email})
	if user
		throw new Meteor.Error(403, "accounts_register_email_exist")
		return false

	return true
