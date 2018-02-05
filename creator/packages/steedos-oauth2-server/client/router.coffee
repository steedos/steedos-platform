FlowRouter.route '/steedos/meteor_oauth2',
	action: (params, queryParams)->
		BlazeLayout.render 'loginLayout',
			main: "loginAuthorize"