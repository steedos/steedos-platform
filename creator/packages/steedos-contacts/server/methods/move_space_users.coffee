Meteor.methods
	move_space_users: (from_org_id, to_org_id, space_user_id)->
		check(from_org_id, String)
		check(to_org_id, String)
		check(space_user_id, String)
		if from_org_id == to_org_id
			return true

		userId = @userId
		unless userId
			return true
		space_user = db.space_users.findOne(space_user_id)
		if space_user
			space = db.spaces.findOne({_id: space_user.space}, {fields: {admins: 1}})

			org_ids = space_user.organizations

			if org_ids && org_ids instanceof Array
				org_ids.remove(org_ids.indexOf(from_org_id))
				org_ids.push(to_org_id)

#			i = 0
#			while i < org_ids.length
#				if org_ids[i] is from_org_id
#					org_ids[i] = to_org_id
#
#				i++

			db.space_users.update({_id: space_user_id}, {$set: {organizations: _.uniq(org_ids)}})

			return true
		else
            throw new Meteor.Error(400, "steedos_contacts_error_space_user_not_found");


