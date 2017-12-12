FlowRouter.route '/',
	action: (params, queryParams)->
		if !Meteor.userId()
			FlowRouter.go '/steedos/sign-in?redirect=' + context.path;
		else
			Session.set("apps", ["creator"]);
			FlowRouter.go '/creator'

