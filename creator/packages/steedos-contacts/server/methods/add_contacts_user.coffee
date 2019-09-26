Meteor.methods
	addContactsUser: (doc) ->
		if !doc.name
			throw new Meteor.Error(400,"contact_needs_name")

		if !doc.organizations
			throw new Meteor.Error(400,"contact_needs_organizations")

		space_id = doc.space
		s = db.spaces.findOne({
			_id: space_id
		}, {
			fields: {
				is_paid: 1,
				user_limit: 1
			}
		})
		accepted_user_count = db.space_users.find({
			space: space_id,
			user_accepted: true
		}).count()
		if s.is_paid == true
			if (1 + accepted_user_count) > s.user_limit
				throw new Meteor.Error(400, "需要提升已购买用户数至#{s.user_limit + 1}(当前#{s.user_limit})" +", 请在企业信息模块中点击升级按钮购买")

		db.space_users.insert doc

		return "contact_invite_success"

	reInviteUser: (id) ->
		if id
			db.space_users.direct.update({_id: id}, {$set: {invite_state: "pending", user_accepted: false}})
			return id
		else
			throw new Meteor.Error(400, "id is required")
