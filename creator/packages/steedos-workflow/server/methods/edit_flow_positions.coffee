{ workflowMethods } = require('@steedos/workflow')
Meteor.methods
	updateFlowPosition: (data) ->
		return workflowMethods.updateFlowPosition.apply(this, arguments)

	updateFlowRole: (data) ->
		return workflowMethods.updateFlowRole.apply(this, arguments)