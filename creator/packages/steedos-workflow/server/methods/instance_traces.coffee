{ workflowMethods } = require('@steedos/workflow')
Meteor.methods
	get_instance_traces: (ins_id)->
		return workflowMethods.get_instance_traces.apply(this, arguments)