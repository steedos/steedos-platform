Meteor.publish 'related_instaces', (instanceId, related_instances)->
	unless this.userId
		return this.ready()

	unless instanceId
		return this.ready()

	related_instance_ids = db.instances.findOne(instanceId,{fields: {related_instances: 1}})?.related_instances

	if related_instance_ids && _.isArray(related_instance_ids)
		return db.instances.find({_id: {$in : related_instance_ids}}, {fields: {_id: 1, name: 1, space: 1}})
	else
		return this.ready()