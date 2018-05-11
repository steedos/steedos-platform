Fiber = Npm.require('fibers')

basicAuth = Npm.require('basic-auth')

JsonRoutes.Middleware.use '/api/odata/v4/', (req, res, next)->

	Fiber(()->
		if !req.userId
			isAuthed = false
			# oauth2验证
			if req?.query?.access_token
				console.log 'OAuth2: ', req.query.access_token
				access_token = db.OAuth2AccessTokens.findOne({'accessToken':req.query.access_token})
				# 有效期内使用token
				if access_token?.expires > new Date()
					user = Meteor.users.findOne({_id: access_token?.userId})
					if user
						isAuthed = true
			# basic验证
			if req.headers['authorization']
				console.log 'basicAuth: ', basicAuth.parse(req.headers['authorization'])
				auth = basicAuth.parse(req.headers['authorization'])
				if auth
					user = Meteor.users.findOne({username: auth.name})
					if user
						result = Accounts._checkPassword user, auth.pass
						if !result.error
							isAuthed = true
			if isAuthed
				req.headers['x-user-id'] = user._id
				token = null
				app_id = "creator"
				client_id = "pc"
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
					hashedToken.app_id = app_id
					hashedToken.client_id = client_id
					hashedToken.token = token
					Accounts._insertHashedLoginToken user._id, hashedToken

				if token
					req.headers['x-auth-token'] = token
		next()
	).run()
