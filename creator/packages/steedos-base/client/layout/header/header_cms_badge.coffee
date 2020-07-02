Template.headerCmsBadge.helpers
	cmsApp: ->
		return db.apps.findOne({_id:"cms"})

	getBadgeForCmsApp: ->
		cmsApp = db.apps.findOne({_id:"cms"})
		unless cmsApp
			return 0
		return Steedos.getBadge(cmsApp._id,null)
