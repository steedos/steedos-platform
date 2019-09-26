lastFinishedApproveAggregate = (instanceid, userId, dataMap, callback)->
	operation = [{
		"$match": {
			"_id": instanceid
		}
	}, {"$project": {"name": 1, "_approve": "$traces.approves"}}, {"$unwind": "$_approve"}, {"$unwind": "$_approve"},
		{"$match": {"_approve.is_finished": true, $or:[{"_approve.handler": userId},{"_approve.user": userId}]}},
		{"$group": {"_id": "$_id", "finish_date": {"$last": "$_approve.finish_date"}}}
	]

	db.instances.rawCollection().aggregate(operation).toArray (err, data)->
		if err
			throw new Error(err)

		data.forEach (doc) ->
			dataMap.push doc

		if callback && _.isFunction(callback)
			callback()
		return

asyncLastFinishedApprove = Meteor.wrapAsync(lastFinishedApproveAggregate)

Meteor.publish "instance_tabular", (tableName, ids, fields)->
	unless this.userId
		return this.ready()

	check(tableName, String);

	check(ids, Array);

	check(fields, Match.Optional(Object))

	fields.cc_users = 1

	self = this;

	getMyLastFinishedApprove = (userId, instanceId)->
		data = []
		asyncLastFinishedApprove(instanceId, userId, data)
		if data.length > 0
			return data[0]


	getMyApprove = (userId, instanceId)->
		instance = db.instances.findOne({_id: instanceId}, {fields: {traces: 1}})
		myApprove = null

		if !instance
			return

		if !instance.traces || instance.traces.length < 1
			return

		notFinishedTraces = instance.traces.filterProperty("is_finished", false)

		if notFinishedTraces.length > 0
			approves = notFinishedTraces[0].approves.filterProperty("is_finished", false).filterProperty("handler", userId);

			if approves.length > 0
				approve = approves[0]
				myApprove = {
					id: approve._id,
					instance: approve.instance,
					trace: approve.trace,
					is_read: approve.is_read,
					start_date: approve.start_date
					agent: approve.agent
					user_name: approve.user_name
				}

		if !myApprove
			is_read = false
			instance.traces.forEach (trace) ->
				trace?.approves?.forEach (approve) ->
					if approve.type == 'cc' and approve.user == userId and approve.is_finished == false
						if approve.is_read
							is_read = true
						myApprove = {id: approve._id, is_read: is_read, start_date: approve.start_date, agent: approve.agent, user_name: approve.user_name}

		return myApprove

	getStepCurrentName = (instanceId) ->
		instance = db.instances.findOne({_id: instanceId}, {fields: {"traces.name": 1, "traces": {$slice: -1}}})
		if instance
			stepCurrentName = instance.traces?[0]?.name

		return stepCurrentName

	handle = db.instances.find({_id: {$in: ids}}, {fields: {traces: 0}}).observeChanges {
		changed: (id)->
			instance = db.instances.findOne({_id: id}, {fields: fields})
			return if not instance
			myApprove = getMyApprove(self.userId, id)
			myLastFinishedApprove = getMyLastFinishedApprove(self.userId, id)
			if myApprove
				instance.is_read = myApprove.is_read
				instance.start_date = myApprove.start_date
				if myApprove.agent
					instance.agent_user_name = myApprove.user_name
			else
				instance.is_read = true

			if myLastFinishedApprove
				instance.my_finish_date = myLastFinishedApprove.finish_date

			instance.is_cc = instance.cc_users?.includes(self.userId) || false
			instance.cc_count = instance.cc_users?.length || 0
			delete instance.cc_users
			self.changed("instances", id, instance);
		removed: (id)->
			self.removed("instances", id);
	}

	ids.forEach (id)->
		instance = db.instances.findOne({_id: id}, {fields: fields})
		return if not instance
		myApprove = getMyApprove(self.userId, id)
		myLastFinishedApprove = getMyLastFinishedApprove(self.userId, id)
		if myApprove
			instance.is_read = myApprove.is_read
			instance.start_date = myApprove.start_date
			if myApprove.agent
					instance.agent_user_name = myApprove.user_name
		else
			instance.is_read = true

		if myLastFinishedApprove
			instance.my_finish_date = myLastFinishedApprove.finish_date

		instance.is_cc = instance.cc_users?.includes(self.userId) || false
		instance.cc_count = instance.cc_users?.length || 0
		delete instance.cc_users
		self.added("instances", id, instance);

	self.ready();
	self.onStop ()->
		handle.stop()