Meteor.methods
	'get_batch_instances': (space, categoryId, flowIds)->
		if !this.userId
			return

		if !space
			return

		_batch_instances = InstanceManager.getBatchInstances(space, categoryId, flowIds, this.userId)

		return _batch_instances

	'get_batch_instances_count': (space, categoryId, flowIds)->
		if !this.userId
			return

		if !space
			return

		_batch_instances = InstanceManager.getBatchInstances(space, categoryId, flowIds, this.userId)

		return _batch_instances?.length || 0

	'get_my_approves': (instanceIds)->

		that = this

		if !that.userId
			return

		myApproves = new Array()

		instanceIds.forEach (insId)->
			my_approve = InstanceManager.getMyApprove(insId, that.userId)
			if my_approve
				myApproves.push(my_approve)

		return myApproves











