FlowRouter.route '/oauth2',
	triggersEnter: [ ()->
		falg = false
		if falg && Meteor.userId()
			OAuth2.getOAuth2Code()
	],
	action: (params, queryParams)->
		if !Meteor.userId()
			BlazeLayout.render 'loginLayout',
				main: "atForm"
		else
			BlazeLayout.render 'loginAuthorize',
				main: "loginAuthorize"