{ workflowMethods } = require('@steedos/workflow')
Meteor.methods
	change_flow_state: (flows) ->
		return workflowMethods.change_flow_state.apply(this, arguments)




