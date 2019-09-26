Meteor.publish 'distributed_instances_state_by_ids', (instance_ids)->
	check(instance_ids, Array)

	unless this.userId
		return this.ready()
	
	unless instance_ids
		return this.ready()

	if _.isEmpty(instance_ids)
		return this.ready()

	self = this

	handle = db.instances.find({_id: {$in: instance_ids}}, {fields: {state: 1, traces:{$slice: 1} } }).observeChanges {
		added: (id, fields)->
			self.added('instances', id, {state: fields.state, is_read: fields.traces[0].approves[0].is_read})

		changed: (id, fields)->
			if fields.state
				self.changed('instances', id, {state: fields.state})
			if fields.traces
				self.changed('instances', id, {is_read: fields.traces[0].approves[0].is_read})
	}

	this.ready()
	this.onStop ()->
		handle.stop()
