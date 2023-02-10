{ workflowMethods } = require('@steedos/workflow')
Meteor.methods
	get_distribute_flows: (options) ->
		return workflowMethods.get_distribute_flows.apply(this, arguments)

	update_distribute_settings: (flow_id, distribute_optional_users_id, step_flows, distribute_to_self, distribute_end_notification, upload_after_being_distributed) ->
		return workflowMethods.update_distribute_settings.apply(this, arguments)
