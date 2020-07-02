Meteor.methods
	getPendingSpaceInfo: (inviterId, spaceId)->
		inviterName = db.users.findOne({_id: inviterId}).name
		spaceName = db.spaces.findOne({_id: spaceId}).name

		return {inviter: inviterName, space: spaceName}

	refuseJoinSpace: (_id)->
		db.space_users.direct.update({_id: _id},{$set: {invite_state: "refused"}})

	acceptJoinSpace: (_id)->
		db.space_users.direct.update({_id: _id},{$set: {invite_state: "accepted", user_accepted: true}})

