Template.creator_app_home.onRendered ()->
	if Session.get("app_id")
		first_app_obj = _.first(Creator.getAppObjectNames(Session.get("app_id")))
		if first_app_obj
			list_view = Creator.getListView(first_app_obj, null)
			list_view_id = list_view?._id
			FlowRouter.go Creator.getListViewRelativeUrl(first_app_obj, Session.get("app_id"), list_view_id)