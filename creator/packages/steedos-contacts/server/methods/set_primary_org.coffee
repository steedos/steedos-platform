Meteor.methods
	set_primary_org: (org_id, space_user_id)->
		check(org_id, String)
		check(space_user_id, String)

		userId = @userId
		unless userId
			return true
		space_user = db.space_users.findOne(space_user_id, {fields: {organization: 1}})
		if space_user
			if space_user.organization != org_id
				db.space_users.update({_id: space_user_id}, {$set: {organization: org_id}})
			return true
		else
			throw new Meteor.Error(400, "steedos_contacts_error_space_user_not_found");


