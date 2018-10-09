Meteor.startup ->
	JsonRoutes.add 'get', '/api/access/check', (req, res, next) ->

		access_token = req.query?.access_token

		if Steedos.getUserIdFromAccessToken(access_token)
			res.writeHead 200
			res.end()
			return
		else
			res.writeHead 401
			res.end()
			return




