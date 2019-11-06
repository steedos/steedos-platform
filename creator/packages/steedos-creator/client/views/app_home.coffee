Template.creator_app_home.onRendered ()->
	this.autorun ->
		appId = Session.get('app_id')
		if appId
			app = Creator.getApp()
			if app?.dashboard
				FlowRouter.go "/app/#{appId}/home"
			else
				first_app_obj = _.first(Creator.getAppObjectNames(appId))
				if first_app_obj
					objectHomeComponent = Session.get("object_home_component")
					if objectHomeComponent
						FlowRouter.go "/app/" + appId + "/" + first_app_obj
					else
						list_view = Creator.getListView(first_app_obj, null)
						list_view_id = list_view?._id
						FlowRouter.go Creator.getListViewRelativeUrl(first_app_obj, appId, list_view_id)