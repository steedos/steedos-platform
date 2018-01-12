Meteor.methods
	updateServerSession: (spaceId) ->
		check spaceId, String
		spaceName = db.spaces.findOne({_id: spaceId}, {fields: {name: 1}})?.name
		userId = this.userId
		userFullname = db.users.findOne({_id: userId}, {fields: {name: 1}})?.name


		ServerSession.set("space_id", spaceId)
		ServerSession.set("space_name", spaceName)
		ServerSession.set("user_id", userId)
		ServerSession.set("user_fullname", userFullname)

