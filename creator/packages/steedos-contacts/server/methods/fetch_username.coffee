Meteor.methods
	fetchUsername: (user_id)->
		check(user_id, String)
		userId = @userId
		unless userId
			return false

		user = db.users.findOne({'_id':user_id},{fields:{username:1}})
		if user
			return user.username
		else
			return ""


