checkUserSigned = (context, redirect) ->
	if !Meteor.userId()
		FlowRouter.go '/steedos/sign-in?redirect=' + context.path;

FlowRouter.route '/creator',
	triggersEnter: [ checkUserSigned ],
	action: (params, queryParams)->
		FlowRouter.go "/creator/crm/customers/list"


FlowRouter.route '/creator/:app_id',
	triggersEnter: [ checkUserSigned ],
	action: (params, queryParams)->
		Session.set("app_id", FlowRouter.getParam("app_id"))
		app = db.apps.findOne(Session.get("app_id"))
		object_name = app.objects?[0]
		FlowRouter.go "/creator/" + Session.get("app_id") + "/" + object_name + "/list"

FlowRouter.route '/creator/:app_id/:object_name/list',
	triggersEnter: [ checkUserSigned ],
	action: (params, queryParams)->
		Session.set("app_id", FlowRouter.getParam("app_id"))
		Session.set("object_name", FlowRouter.getParam("object_name"))
		BlazeLayout.render 'creatorLayout',
			main: "creator_list"

FlowRouter.route '/creator/:app_id/:object_name/view/:record_id',
	triggersEnter: [ checkUserSigned ],
	action: (params, queryParams)->
		Session.set("app_id", FlowRouter.getParam("app_id"))
		Session.set("object_name", FlowRouter.getParam("object_name"))
		Session.set("record_id", FlowRouter.getParam("record_id"))
		Session.set("cmDoc", Creator.getObjectRecord())
		BlazeLayout.render 'creatorLayout',
			main: "creator_view"
