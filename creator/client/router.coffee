FlowRouter.route '/',
	action: (params, queryParams)->
		if !Meteor.userId()
			FlowRouter.go '/steedos/sign-in?redirect=' + context.path;
		else
			FlowRouter.go '/creator'


Meteor.startup ->
	Session.set("apps", ["creator"]);
	Session.set("app_objects", ["customers", "contacts", "flow_roles"]); 