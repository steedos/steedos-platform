{ workflowMethods } = require('@steedos/workflow')
Meteor.methods

	hide_instance: (insId, is_hidden) ->
		return workflowMethods.hide_instance.apply(this, arguments)
