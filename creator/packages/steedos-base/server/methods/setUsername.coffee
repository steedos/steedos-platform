Meteor.methods
	setUsername: (space_id, username, user_id) ->
		check(space_id, String);
		check(username, String);

		if !Steedos.isSpaceAdmin(space_id, Meteor.userId()) and user_id
			throw new Meteor.Error(400, 'contact_space_user_needed')

		if not Meteor.userId()
			throw new Meteor.Error(400,'error-invalid-user')

		unless user_id
			user_id = Meteor.user()._id

		spaceUser = db.space_users.findOne({user: user_id, space: space_id})

		if spaceUser.invite_state == "pending" or spaceUser.invite_state == "refused"
			throw new Meteor.Error(400, "该用户尚未同意加入该工作区，无法修改用户名")

		db.users.update({_id: user_id}, {$set: {username: username}})

		return username
