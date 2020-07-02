Cookies = Npm.require("cookies")

payManager = {}

payManager.check_authorization = (req, res) ->
	query = req.query
	userId = query["X-User-Id"]
	authToken = query["X-Auth-Token"]

	# then check cookie
	if !userId or !authToken
		cookies = new Cookies( req, res )
		userId = cookies.get("X-User-Id")
		authToken = cookies.get("X-Auth-Token")

	# then headers
	if req.headers
		userId = req.headers["x-user-id"]
		authToken = req.headers["x-auth-token"]

	if not userId or not authToken
		throw new Meteor.Error 401, 'Unauthorized'

	hashedToken = Accounts._hashLoginToken(authToken)
	user = Meteor.users.findOne
		_id: userId,
		"services.resume.loginTokens.hashedToken": hashedToken

	if not user
		throw new Meteor.Error 401, 'Unauthorized'

	return user