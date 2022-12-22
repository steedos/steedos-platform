{ workflowMethods } = require('@steedos/workflow')
Meteor.methods
	next_step_users_not_found: (deal_type, step_name, params) ->
		return workflowMethods.next_step_users_not_found.apply(this, arguments)
