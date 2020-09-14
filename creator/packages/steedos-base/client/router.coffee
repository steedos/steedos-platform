checkUserSigned = (context, redirect) ->
	# if !Meteor.userId()
	# 	Setup.validate();

FlowRouter.triggers.enter (context, redirect, stop)->
	if context?.queryParams?.app_id
		Session.set('current_app_id', context.queryParams.app_id)

FlowRouter.route '/steedos/sign-in',
	triggersEnter: [ (context, redirect)->
		Steedos.redirectToSignIn()
	]

FlowRouter.route '/select-users',
	action: (params, queryParams)->
		BlazeLayout.render 'selectUsersLayout',
			main: "reactSelectUsers"

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
