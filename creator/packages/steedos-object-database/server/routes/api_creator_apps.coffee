JsonRoutes.add 'get', '/api/creator/:space/apps/:_id', (req, res, next) ->
	try
		_id = req.params._id
		spaceId = req.params.space
		userId = req.headers["x-user-id"]

		if !userId
			JsonRoutes.sendResult res,
				code: 403,
				data: null
			return

		app = Creator.getCollection('apps').findOne({_id: _id, space: space_id, is_creator: true}, {
			fields: {
				created: 0,
				created_by: 0,
				modified: 0,
				modified_by: 0
			}
		}) || {}

		JsonRoutes.sendResult res, {
			code: 200
			data: app
		}
	catch e
		console.error e.stack
		JsonRoutes.sendResult res, {
			code: 200
			data: {errors: [{errorMessage: e.reason || e.message}]}
		}
