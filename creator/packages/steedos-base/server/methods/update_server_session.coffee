Meteor.methods
	updateServerSession: (spaceId) ->
		check spaceId, String

		if !spaceId
			return
		space = db.spaces.findOne({_id: spaceId}, {fields: {name: 1}})
		if !space
			return

		user = db.users.findOne({_id: this.userId}, {fields: {name: 1}})

		if !user
			return

		ServerSession.set("space_id", spaceId)
		ServerSession.set("space_name", space.name)
		ServerSession.set("user_id", this.userId)
		ServerSession.set("user_fullname", user.name)

