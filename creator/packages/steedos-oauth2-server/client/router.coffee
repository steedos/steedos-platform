FlowRouter.route '/steedos/meteor_oauth2',
	action: (params, queryParams)->
		urlParams = queryParams
		oAuth2Server.callMethod.authCodeGrant(
			urlParams?.client_id,
			urlParams?.redirect_uri,
			urlParams?.response_type,
			urlParams?.scope && urlParams?.scope?.split(' '),
			urlParams?.state,
			(err, result)->
				# 未获取到授权码，执行操作
				if err
					console.log err
				if result
					console.log result
					Session.set "authcode",result
		)

		BlazeLayout.render 'loginLayout',
			main: "loginAuthorize"