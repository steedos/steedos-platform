Meteor.publish 'categories', (spaceId) ->
	check spaceId, String

	unless this.userId
		return this.ready()

	unless spaceId
		return this.ready()


	return db.categories.find({ space: spaceId }, { fields: { name: 1, space: 1, sort_no: 1, app: 1 } })