const { workflowMethods } = require('@steedos/workflow')
Meteor.methods({

	draft_save_instance: function (ins) {
		return workflowMethods.draft_save_instance.apply(this, arguments)
	},

	inbox_save_instance: function (approve) {
		return workflowMethods.inbox_save_instance.apply(this, arguments)
	}

})