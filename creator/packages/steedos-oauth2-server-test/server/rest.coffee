JsonRoutes.Middleware.use(
	'/api/*',
	oAuth2Server.oauthserver.authorise()
	)

JsonRoutes.add "get", "/api/getUserId", (req, res, next)->
	accessTokenStr = req?.params?.access_token || req?.query?.access_token

	accessToken = oAuth2Server.collections.accessToken.findOne({accessToken: accessTokenStr})

    JsonRoutes.sendResult(res, {
        data: accessToken.userId
    })
