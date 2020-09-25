Cookies = Npm.require("cookies")

Setup = {}

Setup.clearAuthCookies = (req, res) ->
	cookies = new Cookies( req, res )
	cookies.set("X-User-Id")
	cookies.set("X-Auth-Token")
	cookies.set("X-Space-Id")
	cookies.set("X-Space-Token")

	# 额外清除老的domain下的cookie
	if req.headers.origin
		uri = new URI(req.headers.origin)
	else if req.headers.referer
		uri = new URI(req.headers.referer)

	cookies.set "X-User-Id", "",
		domain: uri?.domain(),
		overwrite: true
	cookies.set "X-Auth-Token", "",
		domain: uri?.domain(),
		overwrite: true
	cookies.set "X-Space-Id", "",
		domain: uri?.domain(),
		overwrite: true
	cookies.set "X-Space-Token", "",
		domain: uri?.domain(),
		overwrite: true

Setup.setAuthCookies = (req, res, userId, authToken) ->
	cookies = new Cookies( req, res )
	# set cookie to response
	# maxAge 3 month
	# uri = new URI(req.headers.origin);
	cookies.set "X-User-Id", userId,
		# domain: uri.domain(),
		maxAge: 90*60*60*24*1000,
		httpOnly: false
		overwrite: true
	cookies.set "X-Auth-Token", authToken,
		# domain: uri.domain(),
		maxAge: 90*60*60*24*1000,
		httpOnly: false
		overwrite: true

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



