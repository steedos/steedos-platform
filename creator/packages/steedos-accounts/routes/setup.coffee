Cookies = require("cookies")
bcrypt = NpmModuleBcrypt;
bcryptHash = Meteor.wrapAsync(bcrypt.hash);
bcryptCompare = Meteor.wrapAsync(bcrypt.compare);
SHA256 = require("sha256")
steedosAuth = require("@steedos/auth");


Setup.clearAuthCookies = (req, res) ->
	cookies = new Cookies( req, res );
	cookies.set("X-User-Id")
	cookies.set("X-Auth-Token")

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

Setup.setAuthCookies = (req, res, userId, authToken) ->
	cookies = new Cookies( req, res );
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



JsonRoutes.add "post", "/api/setup/validate", (req, res, next) ->
	cookies = new Cookies( req, res );

	# first check request body
	if req.body
		authToken = req.body["X-Auth-Token"]

	# then check cookie
	if !authToken
		authToken = cookies.get("X-Auth-Token")

	if authToken

		user = Meteor.wrapAsync((authToken, cb)->
			steedosAuth.getSession(authToken).then (resolve, reject)->
				cb(reject, resolve)
		)(authToken)

		if user
			Setup.setAuthCookies(req, res, user.userId, authToken)

			JsonRoutes.sendResult res,
				data:
					userId: user.userId
					authToken: authToken
					apps: []
					dsInfo:
						dsid: user.userId
						steedosId: user.steedos_id
						name: user.name
						primaryEmail: user.email
						statusCode: 2
					instance: "1329598861"
					isExtendedLogin: true
					requestInfo:
						country: "CN"
						region: "SH"
						timezone: "GMT+8"
					webservices:
						Steedos.settings.webservices
			return


	JsonRoutes.sendResult res,
		code: 401,
		data:
			"error": "Validate Request -- Missing X-Auth-Token",
			"instance": "1329598861",
			"success": false


JsonRoutes.add "post", "/api/setup/logout", (req, res, next) ->

	Setup.clearAuthCookies(req, res)

	res.end();


JsonRoutes.add "post", "/api/setup/login", (req, res, next) ->

	cookies = new Cookies( req, res );

	username = req.body["username"]
	password = req.body["password"]
	extended_login = req.body["extended_login"]
	app_id = req.body["app_id"]
	client_id = req.body["client_id"]

	bcryptPassword = SHA256(password);

	user = Meteor.users.findOne
		"emails.address": username

	if !user
		res.statusCode = 401;
		res.end();
		return

	if (!bcryptCompare(bcryptPassword, user.services.password.bcrypt))
		res.statusCode = 401;
		res.end();
		return

	token = null
	if app_id and client_id
		loginTokens = user.services?.resume?.loginTokens
		if loginTokens
			app_login_token = _.find(loginTokens, (t)->
				return t.app_id is app_id and t.client_id is client_id
			)
			token = app_login_token.token if app_login_token

	if not token
		authToken = Accounts._generateStampedLoginToken()
		token = authToken.token
		hashedToken = Accounts._hashStampedToken authToken
		if app_id and client_id
			hashedToken.app_id = app_id
			hashedToken.client_id = client_id
			hashedToken.token = token
		Accounts._insertHashedLoginToken user._id, hashedToken

	# set cookie to response
	# maxAge 3 month
	Setup.setAuthCookies(req, res, user._id, token)

	JsonRoutes.sendResult res,
		data:
			userId: user._id
			authToken: token
			apps: []
			dsInfo:
				dsid: user._id
				steedosId: user.steedos_id
				name: user.name
				primaryEmail: user.email
				statusCode: 2
			instance: "1329598861"
			isExtendedLogin: true
			requestInfo:
				country: "CN"
				region: "SH"
				timezone: "GMT+8"
			webservices:
				Steedos.settings.webservices

