RelatedRecords.helpers =
	showRelatedRecords: ()->
		if Meteor.isClient
			ins = WorkflowManager.getInstance();
		else
			ins = this.instance
		if !ins
			return false
		return !_.isEmpty(ins.record_ids)
	relatedRecordUrl: ()->
		if Meteor.isClient && (Steedos.isMobile() || Steedos.isCordova())
			return ''

		absolute = false
		
		if Meteor.isServer
			ins = this.instance
			absolute = this.absolute
		else
			ins = WorkflowManager.getInstance();
	
		objcetName = ins.record_ids[0].o
		id = ins.record_ids[0].ids[0]

		if absolute
			return Meteor.absoluteUrl("app/-/#{objcetName}/view/#{id}")
		else
			return Steedos.absoluteUrl("app/-/#{objcetName}/view/#{id}")