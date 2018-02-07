FlowRouter.route '/oauth2',
	action: (params, queryParams)->
		if !Meteor.userId()
			BlazeLayout.render 'loginLayout',
				main: "atForm"
		else
			BlazeLayout.render 'loginLayout',
				main: "loginAuthorize"
	