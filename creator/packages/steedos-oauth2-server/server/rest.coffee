JsonRoutes.Middleware.use(
	'steedos/oauth2/api/*',
	oAuth2Server.oauthserver.authorise()
)

JsonRoutes.add('get', 'steedos/oauth2/api/getUserId', (req, res, next)->
	
	accessTokenStr = req?.params?.access_token || req?.query?.access_token
	
	accessToken = oAuth2Server.collections.accessToken.findOne(
		{accessToken: accessTokenStr}
	)
	
	JsonRoutes.sendResult(res, {
		data: accessToken.userId
	})
)
