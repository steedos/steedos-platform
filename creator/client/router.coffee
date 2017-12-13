FlowRouter.route '/',
	action: (params, queryParams)->
		if !Meteor.userId()
			FlowRouter.go '/steedos/sign-in?redirect=' + context.path;
		else
			FlowRouter.go '/creator'


Meteor.startup ->
	db.apps.INTERNAL_APPS = ["/crm", "/creator"]
	Session.set("apps", ["crm", "hr"]);
	Session.set("app_objects", ["customers", "contacts", "flow_roles"]); 