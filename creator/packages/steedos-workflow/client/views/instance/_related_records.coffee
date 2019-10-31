RelatedRecords.helpers =
	showRelatedRecords: ()->
		ins = WorkflowManager.getInstance()
		if !ins
			return false
		return !_.isEmpty(ins.record_ids)