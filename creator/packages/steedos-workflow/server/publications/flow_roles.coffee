

	Meteor.publish 'flow_roles', (spaceId)->
		
		unless this.userId
			return this.ready()
		
		unless spaceId
			return this.ready()


		return db.flow_roles.find({space: spaceId}, {fields: {name:1}});
