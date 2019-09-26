Meteor.methods
	getInstanceValues: (insId)->
		if (!this.userId)
			return;
		return db.instances.findOne({_id: insId}, {fields: {values: 1}})?.values