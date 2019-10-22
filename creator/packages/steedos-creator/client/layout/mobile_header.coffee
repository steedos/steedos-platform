Template.creatorMobileHeader.helpers
	isInDetail: ()->
		if Session.get("record_id") || Session.get("showBackHeader")
			return true
		return false

	object: ()->
		return Creator.getObject()
	list_views: ()->
		Session.get("change_list_views")
		return Creator.getListViews()

	list_view_url: (list_view)->
		if list_view._id
			list_view_id = String(list_view._id)
		else
			list_view_id = String(list_view.name)

		app_id = Session.get("app_id")
		object_name = Session.get("object_name")
		return Creator.getListViewUrl(object_name, app_id, list_view_id)

	list_view: ()->
		Session.get("change_list_views")
		list_view = Creator.getListView(Session.get("object_name"), Session.get("list_view_id"))

		if Session.get("list_view_id") and Session.get("list_view_id") != list_view?._id
			return

		if !list_view
			return

		if list_view?.name != Session.get("list_view_id")
			if list_view?._id
				Session.set("list_view_id", list_view._id)
			else
				Session.set("list_view_id", list_view.name)
		return list_view

	list_view_label: (item)->
		if item
			return item.label || item.name
		else
			return ""

	allowCreate: ()->
		object_name = Template.instance().data.object_name
		return Creator.getPermissions(object_name)?.allowCreate
	headerTitle: ()->
		object = Creator.getObject()
		return Session.get("headerTitle") || object.label || object.name

Template.creatorMobileHeader.events
	'click .creator-add-object-record': (e, t)->
		objectName = Session.get("object_name")
		object = Creator.getObject(objectName)
		collection_name = object.label
		Session.set("action_fields", undefined)
		Session.set("action_collection", "Creator.Collections.#{objectName}")
		Session.set("action_collection_name", collection_name)
		Meteor.defer ()->
			$(".creator-add").click()
		return

	'click .sidebar-collapse': (e, t)->
		lastUrl = urlQuery[urlQuery.length - 2]
		urlQuery.pop()
		if lastUrl
			FlowRouter.go lastUrl
		else
			app_id = Session.get("app_id")
			object = Session.get("object_name")
			if app_id && object
				FlowRouter.go Creator.getObjectRouterUrl(object, undefined, app_id)
			else if app_id
				FlowRouter.go "/app/#{app_id}"
			else
				FlowRouter.go "/app"

#		if !Session.get("object_name")
#			FlowRouter.go('/app')
#		else
#			FlowRouter.go(/app/-/#{Session.get("object_name")})