JsonRoutes.add 'post', '/api/mini/vip/friend/answered', (req, res, next) ->
	try
		userId = Steedos.getUserIdFromAuthToken(req, res);

		if !userId
			throw new Meteor.Error('Love', "No permission")

		spaceId = req.query.space_id

		if !spaceId
			throw new Meteor.Error('Love', "No spaceId")

		LoveManager.caculateFriendsScore 'love_answer', userId, spaceId

		JsonRoutes.sendResult res, {
			code: 200,
			data: 'ok'
		}
		return
	catch e
		console.error e.stack
		JsonRoutes.sendResult res, {
			code: e.error
			data: { errors: e.reason || e.message }
		}
