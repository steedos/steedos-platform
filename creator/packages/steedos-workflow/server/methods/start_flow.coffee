{ workflowMethods } = require('@steedos/workflow')
Meteor.methods
	start_flow: (space, flowId, start) ->

		return workflowMethods.start_flow.apply(this, arguments)

