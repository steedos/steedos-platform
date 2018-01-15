Meteor.methods
	archive_Newaudit: (selectedIds,business_activity,description) ->		
		auditdoc = {}
		auditdoc.business_status = "历史行为"
		auditdoc.business_activity = business_activity
		auditdoc.action_time = new Date()
		auditdoc.action_user = Meteor.userId()
		auditdoc.action_description = description
		selectedIds.forEach (selectedId)->
			auditdoc.action_administrative_records_id = selectedId
			Creator.Collections["archive_audit"].insert auditdoc
