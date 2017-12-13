checkUserSigned = (context, redirect) ->
	if !Meteor.userId()
		FlowRouter.go '/steedos/sign-in?redirect=' + context.path;

FlowRouter.route '/creator',
	triggersEnter: [ checkUserSigned ],
	action: (params, queryParams)->
		FlowRouter.go "/creator/app/customers/list"


FlowRouter.route '/creator/app/:object_name/list',
	triggersEnter: [ checkUserSigned ],
	action: (params, queryParams)->
		Session.set("object_name", FlowRouter.getParam("object_name"))
		BlazeLayout.render 'creatorLayout',
			main: "creator_list"

FlowRouter.route '/creator/app/:object_name/view/:object_id',
	triggersEnter: [ checkUserSigned ],
	action: (params, queryParams)->
		Session.set("object_name", FlowRouter.getParam("object_name"))
		Session.set("object_id", FlowRouter.getParam("object_id"))
		Session.set("cmDoc", Creator.getObjectRecord())
		BlazeLayout.render 'creatorLayout',
			main: "creator_view"
