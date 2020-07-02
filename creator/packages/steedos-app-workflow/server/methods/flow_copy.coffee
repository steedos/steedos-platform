Meteor.methods
	flow_copy: (spaceId, flowId, options)->
		if (!this.userId)
			return;

		if !WorkflowCore.checkCreatePermissions(spaceId, this.userId, options?.company_id)
			throw  Meteor.Error("No permission");

		db.flows.copy(this.userId, spaceId, flowId, options, false)