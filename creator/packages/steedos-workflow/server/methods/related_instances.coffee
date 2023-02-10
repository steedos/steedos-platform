{ workflowMethods } = require('@steedos/workflow')
Meteor.methods
	remove_related: (ins_id, re_ins_id)->
		return workflowMethods.remove_related.apply(this, arguments)

	update_instance_related: (ins_id, related_instances)->
		return workflowMethods.update_instance_related.apply(this, arguments)
