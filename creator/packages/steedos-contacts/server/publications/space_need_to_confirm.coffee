if Meteor.isServer
	Meteor.publish 'space_need_to_confirm', ()->
		userId = this.userId
		return db.space_users.find({user: userId, invite_state: "pending"})