# publish some one space's avatar
Meteor.publish 'space_avatar', (spaceId)->
	unless spaceId
		return this.ready()

	return db.spaces.find({_id: spaceId}, {fields: {avatar: 1,name: 1,enable_register:1}});
