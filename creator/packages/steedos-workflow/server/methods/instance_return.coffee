{ workflowMethods } = require('@steedos/workflow')
Meteor.methods
	instance_return: (approve, reason)->
		return workflowMethods.instance_return.apply(this, arguments)