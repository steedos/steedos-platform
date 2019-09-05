checkUserSigned = (context, redirect) ->
	if !Meteor.userId()
		Setup.validate();

FlowRouter.triggers.enter (context, redirect, stop)->
	if context?.queryParams?.app_id
		Session.set('current_app_id', context.queryParams.app_id)


FlowRouter.route '/apps/iframe/:app_id',
	triggersEnter: [ checkUserSigned ],
	action: (params, queryParams)->
		authToken = {};
		authToken["spaceId"] = Steedos.getSpaceId()
		authToken["X-User-Id"] = Meteor.userId()
		authToken["X-Auth-Token"] = Accounts._storedLoginToken()
		url = Meteor.absoluteUrl("api/setup/sso/" + params.app_id + "?" + $.param(authToken))

		BlazeLayout.render 'iframeLayout',
			url: url


FlowRouter.route '/steedos/springboard',
	triggersEnter: [ ->
		FlowRouter.go "/"
	]

FlowRouter.route '/springboard', 
	triggersEnter: [ checkUserSigned ],
	action: (params, queryParams)->
		if !Meteor.userId()
			Steedos.redirectToSignIn()
			return true

		NavigationController.reset();
		
		BlazeLayout.render 'masterLayout',
			main: "springboard"

		if Steedos.isMobile()
			$("body").removeClass("sidebar-open")

workbenchRoutes = FlowRouter.group
	prefix: '/workbench',
	name: 'workbenchRoutes',
	triggersEnter: [ checkUserSigned ],

workbenchRoutes.route '/', 
	action: (params, queryParams)->
		if !Meteor.userId()
			Steedos.redirectToSignIn()
			return true

		NavigationController.reset();
		
		BlazeLayout.render 'masterLayout',
			main: "workbench"

		if Steedos.isMobile()
			$("body").removeClass("sidebar-open")

workbenchRoutes.route '/manage', 
	action: (params, queryParams)->
		BlazeLayout.render 'masterLayout',
			main: "manageBusiness"

		if Steedos.isMobile()
			$("body").removeClass("sidebar-open")