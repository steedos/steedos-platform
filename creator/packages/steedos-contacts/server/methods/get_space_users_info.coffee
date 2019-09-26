Meteor.methods
	getSpaceUsersInfo: (inviterId, spaceId)->
		inviterName = db.users.findOne({_id: inviterId}).name
		spaceName = db.spaces.findOne({_id: spaceId}).name

		return {inviter: inviterName, space: spaceName}

	refuseJoinWorkflow: (_id)->
		db.space_users.direct.update({_id: _id},{$set: {invite_state: "refused"}})

	acceptJoinWorkflow: (_id)->
		db.space_users.direct.update({_id: _id},{$set: {invite_state: "accepted", user_accepted: true}})

