{ workflowMethods } = require('@steedos/workflow')
Meteor.methods
	getInstanceValues: (insId)->
		return workflowMethods.getInstanceValues.apply(this, arguments)