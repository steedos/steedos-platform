Meteor.methods
	calculateBox: (instanceId) ->
		check instanceId, String
		userId = this.userId
		instance = db.instances.findOne({_id: instanceId},{fields: {inbox_users: 1, cc_users: 1}})
		inbox_users = instance.inbox_users
		cc_users = instance.cc_users

		box = ""

		if _.indexOf(inbox_users, userId) >= 0 || _.indexOf(cc_users, userId) >= 0
			box = "inbox"
		else
			box = "outbox"

		return box