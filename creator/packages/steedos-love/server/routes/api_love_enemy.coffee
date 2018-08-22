JsonRoutes.add 'post', '/api/mini/vip/love/enemy', (req, res, next) ->
	try
		userId = Steedos.getUserIdFromAuthToken(req, res);

		if !userId
			throw new Meteor.Error('Love', "No permission")

		body = req.body

		spaceId = req.query.space_id || body.space_id

		if !spaceId
			throw new Meteor.Error('Love', "No spaceId")

		friendId = req.query.friend_id || body.friend_id

		if !friendId
			throw new Meteor.Error('Love', "No friendId")

		r = LoveManager.caculateLoveEnemyScore userId, friendId, spaceId

		JsonRoutes.sendResult res, {
			code: 200,
			data: r || 0
		}
		return
	catch e
		console.error e.stack
		JsonRoutes.sendResult res, {
			code: e.error
			data: { errors: e.reason || e.message }
		}
