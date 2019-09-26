Meteor.methods
	check_org_admin: (org_id)->
		check(org_id, String)

		userId = @userId
		unless userId
			return false

		currentOrg = db.organizations.findOne(org_id, {fields: {admins: 1,parent: 1,parents: 1}})
		unless currentOrg
			return false
		if currentOrg?.admins?.includes(userId)
			return true
		else
			if currentOrg?.parent and db.organizations.findOne({_id:{$in:currentOrg.parents}, admins:{$in:[userId]}})
				return true
			else
				return false



