{ workflowMethods } = require('@steedos/workflow')
Meteor.methods
	set_instance_step_approve: (ins_id, step_approve, stepsApprovesOptions)->
		return workflowMethods.set_instance_step_approve.apply(this, arguments)
	set_instance_skip_steps: (ins_id, stepId, action)->
		return workflowMethods.set_instance_skip_steps.apply(this, arguments)