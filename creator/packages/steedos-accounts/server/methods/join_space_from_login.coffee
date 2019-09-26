Phone = require('phone')

Meteor.methods joinSpaceFromLogin: (options) ->
	check options, Object
	{ space_logined } = options
	check space_logined, String

	currentUserId = @userId
	unless currentUserId
		return true

	space = db.spaces.findOne(space_logined)
	unless space
		throw new Meteor.Error(400, "space_users_error_space_not_found")
		return false

	currentUser = Accounts.user()
	space_user = db.space_users.findOne({space: space_logined, user: currentUser._id})
	if space_user
		return true

	user_email = currentUser.emails[0].address
	rootOrg = db.organizations.findOne({space:space_logined, parent: null},{fields: {_id:1}})
	db.space_users.insert
		email: user_email
		user: currentUser._id
		name: currentUser.name
		organizations: [rootOrg._id]
		space: space_logined
		user_accepted: true
		is_logined_from_space: true

	return true


