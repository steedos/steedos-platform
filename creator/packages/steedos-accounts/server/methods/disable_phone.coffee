Meteor.methods disablePhoneWithoutExpiredDays: (expiredDays) ->
	check expiredDays, Number

	currentUserId = @userId
	unless currentUserId
		return true

	currentUser = Accounts.user()
	verified = currentUser.phone?.verified
	modified = currentUser.phone?.modified
	unless verified or modified
		return true

	now = new Date()
	outDays = Math.floor((now.getTime()-modified.getTime())/(24 * 60 * 60 * 1000))
	if outDays >= expiredDays
		db.users.update {
			_id: currentUserId
		}, $set: "phone.verified": false

	return true
