RelatedRecords.helpers =
	showRelatedRecords: ()->
		if Meteor.isClient
			ins = WorkflowManager.getInstance();
		else
			ins = this.instance
		if !ins
			return false
		return !_.isEmpty(ins.record_ids)