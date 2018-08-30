JsonRoutes.add 'post', '/api/mini/vip/friend/answered', (req, res, next) ->
	try
		userId = Steedos.getUserIdFromAuthToken(req, res);

		if !userId
			throw new Meteor.Error(500, "No permission")

		body = req.body

		spaceId = req.query.space_id || body.space_id

		if !spaceId
			throw new Meteor.Error(500, "No spaceId")

		objectName = req.query.object_name || body.object_name

		if ['love_about_me'].includes(objectName)
			JsonRoutes.sendResult res, {
				code: 200,
				data: 'ok'
			}
			return

		rest = req.query.rest || body.rest

		matching_filter_enable = req.query.matching_filter_enable || body.matching_filter_enable

		LoveManager.caculateFriendsScore userId, spaceId, rest, matching_filter_enable

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
