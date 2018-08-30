JsonRoutes.add 'post', '/api/mini/vip/match/result', (req, res, next) ->
	try
		userId = Steedos.getUserIdFromAuthToken(req, res);

		if !userId
			throw new Meteor.Error(500, "No permission")

		body = req.body

		spaceId = req.query.space_id || body.space_id

		if !spaceId
			throw new Meteor.Error(500, "No spaceId")

		Meteor.call('caculateResult', spaceId, [userId])

		result = Creator.getCollection('love_result').findOne({ space: spaceId, owner: userId })

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
