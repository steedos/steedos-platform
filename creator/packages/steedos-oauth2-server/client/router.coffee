FlowRouter.route '/oauth2',
	triggersEnter: [ ()->
		# 用户之前在session里面授权过
		isAuthorized = false
		authorizedClients = Session.get("authorizedClients")
		if authorizedClients
			isAuthorized = true
		if isAuthorized && Meteor.userId()
			OAuth2.getOAuth2Code()
	],
	action: (params, queryParams)->
		if !Meteor.userId()
			BlazeLayout.render 'loginLayout',
				main: "atForm"
		else
			BlazeLayout.render 'loginLayout',
				main: "loginAuthorize"