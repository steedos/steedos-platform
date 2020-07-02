JsonRoutes.add 'post', '/api/mini/vip/single/match', (req, res, next) ->
	try
		userId = Steedos.getUserIdFromAuthToken(req, res);

		if !userId
			throw new Meteor.Error(500, "No permission")

		body = req.body

		spaceId = req.query.space_id || body.space_id

		if !spaceId
			throw new Meteor.Error(500, "No spaceId")

		userB = req.query.user_id || body.user_id

		if !userB
			throw new Meteor.Error(500, "No user_id")

		result = LoveManager.caculateOneToOneScore(userId, userB, spaceId)

		JsonRoutes.sendResult res, {
			code: 200,
			data: result
		}
		return
	catch e
		console.error e.stack
		JsonRoutes.sendResult res, {
			code: e.error
			data: { errors: e.reason || e.message }
		}
