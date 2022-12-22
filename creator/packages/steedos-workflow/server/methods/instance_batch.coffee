{ workflowMethods } = require('@steedos/workflow')
Meteor.methods
	'get_batch_instances': (space, categoryId, flowIds)->
		return workflowMethods.get_batch_instances.apply(this, arguments)

	'get_batch_instances_count': (space, categoryId, flowIds)->
		return workflowMethods.get_batch_instances_count.apply(this, arguments)

	'get_my_approves': (instanceIds)->
		return workflowMethods.get_my_approves.apply(this, arguments)











