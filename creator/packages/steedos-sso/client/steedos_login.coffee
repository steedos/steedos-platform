# @SteedosSSO = {}

# getCookie = (name)->
# 	pattern = RegExp(name + "=.[^;]*")
# 	matched = document.cookie.match(pattern)
# 	if(matched)
# 		cookie = matched[0].split('=')
# 		return cookie[1]
# 	return false

# loginWithToken = (userId, authToken, onSuccess)->
# 	if userId and authToken
# 		if Meteor.userId() != userId
# 			Accounts.connection.setUserId(userId);
# 			Accounts.loginWithToken authToken, (err) ->
# 				if (err)
# 					Meteor._debug("Error logging in with token: " + err);

# 					Accounts.makeClientLoggedOut();

# 					Cookie.remove('X-User-Id')

# 					Cookie.remove('X-Auth-Token')

# 					Steedos.redirectToSignIn()

# 				else if onSuccess
# 					onSuccess();

# _cookies_login = (onSuccess)->
# 	userId = getCookie("X-User-Id")
# 	authToken = getCookie("X-Auth-Token")
# 	console.log "login with cookies. userId: #{userId}; authToken: #{authToken}"
# 	if (userId && authToken)
# 		loginWithToken userId, authToken, onSuccess

# _params_login = (userId, authToken, onSuccess)->
# 	console.log "login with params. userId: #{userId}"
# 	loginWithToken userId, authToken, onSuccess


# SteedosSSO.login = (context)->

# 	onSuccess = ()->
# 		console.log "login success. user is", Meteor.user()
# 		FlowRouter.go context.path

# 	userId = context.queryParams?["X-User-Id"]

# 	authToken = context.queryParams?["X-Auth-Token"]

# 	if context.path.indexOf('/steedos/sign-in') < 0
# 		if userId && authToken
# 			_params_login userId, authToken, onSuccess
# 		else
# 			_cookies_login onSuccess