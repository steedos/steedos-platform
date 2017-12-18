checkUserSigned = (context, redirect) ->
	if !Meteor.userId()
		FlowRouter.go '/steedos/sign-in?redirect=' + context.path;

FlowRouter.route '/app',
	triggersEnter: [ checkUserSigned ],
	action: (params, queryParams)->
		app_id = Session.get("app_id")
		if !app_id
			app_id = "creator"
		object_name = Session.get("object_name")
		if object_name
			FlowRouter.go "/app/" + app_id + "/" + object_name + "/list"
		else
			FlowRouter.go "/app/" + app_id

FlowRouter.route '/app/:app_id',
	triggersEnter: [ checkUserSigned ],
	action: (params, queryParams)->
		Session.set("app_id", FlowRouter.getParam("app_id"))
		BlazeLayout.render 'creatorLayout',
			main: "creator_app_home"

FlowRouter.route '/app/:app_id/:object_name/list',
	triggersEnter: [ checkUserSigned ],
	action: (params, queryParams)->
		Session.set("app_id", FlowRouter.getParam("app_id"))
		Session.set("object_name", FlowRouter.getParam("object_name"))
		Session.set("list_view_id", null)
		Session.set("list_view_visible", true)
		BlazeLayout.render 'creatorLayout',
			main: "creator_list"

FlowRouter.route '/app/:app_id/:object_name/view/:record_id',
	triggersEnter: [ checkUserSigned ],
	action: (params, queryParams)->
		Session.set("app_id", FlowRouter.getParam("app_id"))
		Session.set("object_name", FlowRouter.getParam("object_name"))
		Session.set("record_id", FlowRouter.getParam("record_id"))
		Session.set("cmDoc", Creator.getObjectRecord())
		Meteor.call "object_recent_viewed", FlowRouter.getParam("object_name"), FlowRouter.getParam("record_id")
		BlazeLayout.render 'creatorLayout',
			main: "creator_view"
