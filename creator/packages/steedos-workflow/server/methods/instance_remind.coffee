{ workflowMethods } = require('@steedos/workflow')
Meteor.methods
	instance_remind: (remind_users, remind_count, remind_deadline, instance_id, action_types, trace_id)->
		return workflowMethods.instance_remind.apply(this, arguments)
