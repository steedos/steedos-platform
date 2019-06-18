Template.app_list_box_modal.helpers
	apps: ()->
		return Steedos.getSpaceApps()
	appBadge: (appId)->
		workflow_categories = _.pluck(db.categories.find({app: appId}).fetch(), '_id')
		appUrl = db.apps.findOne(appId).url
		if appId == "workflow" || /^\/?workflow\b/.test(appUrl)
			if workflow_categories.length > 0
				return Steedos.getWorkflowCategoriesBadge(workflow_categories, Steedos.getSpaceId())
			return Steedos.getBadge("workflow", null)
		else
			Steedos.getBadge(appId, null)

Template.app_list_box_modal.onRendered ->
	$(".app-list-box-modal-body").css("max-height", ($(window).height()-140) + "px");

Template.app_list_box_modal.events

	'click .weui_grids .weui_grid': (event)->
		Steedos.openApp event.currentTarget.dataset.appid
		Modal.hide('app_list_box_modal'); 