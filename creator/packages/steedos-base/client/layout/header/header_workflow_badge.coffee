Template.headerWorkflowBadge.helpers
	workflowApp: ->
		return db.apps.findOne({_id:"workflow"})

	getBadgeForWorkflowApp: ->
		workflowApp = db.apps.findOne({_id:"workflow"})
		unless workflowApp
			return 0
		return Steedos.getBadge(workflowApp._id,null)
