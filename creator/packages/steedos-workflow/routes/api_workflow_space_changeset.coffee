JsonRoutes.add 'get', '/uf/space/changeset', (req, res, next) ->
	try
		query = req.query
		auth_token = db.auth_tokens.findOne({auth_token: query.auth_token})

		if (not auth_token) or (not auth_token.enabled)
			throw new Meteor.Error 401, 'Unauthorized'

		sync_token = query["sync_token"]
		formids = query["formids"] # 逗号隔开字符串
		is_admin = query["is_admin"]

		data = uuflowManager.get_SpaceChangeSet(formids, is_admin, sync_token)

		JsonRoutes.sendResult res,
				code: 200
				data: data
	catch e
		console.error e.stack
		JsonRoutes.sendResult res,
			code: 200
			data: { errors: [{errorMessage: e.message}] }