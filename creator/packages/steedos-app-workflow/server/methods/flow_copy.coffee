{ workflowMethods } = require('@steedos/workflow')
Meteor.methods
	flow_copy: (spaceId, flowId, options)->
		return workflowMethods.flow_copy.apply(this, arguments)