Meteor.methods
	import_users_from_contacts: (users, groupId, spaceId) ->
		check(users, Array);
		check(groupId, String);
		check(spaceId, String);

		# hidden_users = SteedosContacts.getHiddenUsers(spaceId)
		
		# 将每个人员导入到选中的分组中
		users.forEach (user) ->
			sUser = db.space_users.findOne({space: spaceId, user: user});
			# if sUser && hidden_users.indexOf(user) < 0
			if sUser
				bUser = db.address_books.find({group: groupId, email: sUser.email})

				db.address_books.insert({
					owner: Meteor.userId(),
					group: groupId,
					name: sUser.name,
					email: sUser.email,
					mobile: sUser.mobile,
					company: sUser.company,
					user: sUser.user
				})

		return true;