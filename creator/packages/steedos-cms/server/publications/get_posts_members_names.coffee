Meteor.publish "posts_organizations_name", (organizationIds) ->
	unless this.userId
		return this.ready()

	unless organizationIds
		return this.ready()

	return db.organizations.find({_id: {$in: organizationIds}},{fields: {name: 1}})


Meteor.publish "posts_users_name", (userIds) ->
	unless this.userId
		return this.ready()

	unless userIds
		return this.ready()

	return db.users.find({_id: {$in: userIds}},{fields: {name: 1}})
