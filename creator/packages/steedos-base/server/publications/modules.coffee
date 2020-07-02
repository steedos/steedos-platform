Meteor.publish 'modules', ()->
	unless this.userId
		return this.ready()

	return db.modules.find();