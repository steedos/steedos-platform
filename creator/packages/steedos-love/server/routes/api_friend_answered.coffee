JsonRoutes.add 'post', '/api/mini/vip/friend/answered', (req, res, next) ->
	try
		userId = Steedos.getUserIdFromAuthToken(req, res);

		if !userId
			throw new Meteor.Error('Love', "No permission")

		body = req.body

		spaceId = req.query.space_id || body.space_id

		if !spaceId
			throw new Meteor.Error('Love', "No spaceId")

		rest = req.query.rest || body.rest

		objectName = req.query.object_name || body.object_name || 'love_answer'

		LoveManager.caculateFriendsScore objectName, userId, spaceId, rest

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
