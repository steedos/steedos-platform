Cookies = Npm.require("cookies")

JsonRoutes.Middleware.use(
	'/oauth2/sso',
	oAuth2Server.oauthserver.authorise()
)

JsonRoutes.add 'get', '/oauth2/sso', (req, res, next)->

	redirectUrl = req?.params?.redirect_url || req?.query?.redirect_url || '/'
	
	accessTokenStr = req?.params?.access_token || req?.query?.access_token
	
	accessToken = oAuth2Server.collections.accessToken.findOne(
		{accessToken: accessTokenStr}
	)
	
	cookies = new Cookies( req, res );
	userId = cookies.get("X-User-Id")
	authToken = cookies.get("X-Auth-Token")

	# 如果本地已经有cookies
	if userId and authToken
		# 比较本地数据和当前用户是否一致
		if accessToken.userId!=userId
			# 不一致，清除信息
			Setup.clearAuthCookies(req, res)
			hashedToken = Accounts._hashLoginToken(authToken)
			Accounts.destroyToken(userId, hashedToken)
		else
			res.writeHead 301, {'Location': redirectUrl }
			return res.end ''
	# 验证成功，登录
	authToken = Accounts._generateStampedLoginToken()
	hashedToken = Accounts._hashStampedToken authToken
	Accounts._insertHashedLoginToken accessToken.userId,hashedToken
	Setup.setAuthCookies req,res,accessToken.userId,authToken.token
	res.writeHead 301, {'Location': redirectUrl }
	return res.end ''



