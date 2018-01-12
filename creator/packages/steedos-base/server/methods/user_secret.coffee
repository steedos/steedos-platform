Meteor.methods
	create_secret: (name)->
		if !this.userId
			return false;

		db.users.create_secret this.userId, name

	remove_secret: (token)->
		if !this.userId || !token
			return false;

		hashedToken = Accounts._hashLoginToken(token)

		console.log("token", token)

		db.users.update({_id: this.userId}, {$pull: {"secrets": {hashedToken: hashedToken}}})
