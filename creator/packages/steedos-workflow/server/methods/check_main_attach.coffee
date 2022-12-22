{ workflowMethods } = require('@steedos/workflow')
Meteor.methods
	check_main_attach: (ins_id, name)->
		return workflowMethods.check_main_attach.apply(this, arguments)
