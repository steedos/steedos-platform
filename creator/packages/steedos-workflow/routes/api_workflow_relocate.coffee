JsonRoutes.add 'post', '/api/workflow/relocate', (req, res, next) ->
	try
		current_user_info = uuflowManager.check_authorization(req)

		hashData = req.body
		_.each hashData['Instances'], (instance_from_client) ->
			uuflowManager.relocate(instance_from_client, current_user_info)

		JsonRoutes.sendResult res,
			code: 200
			data: {}
	catch e
		console.error e.stack
		JsonRoutes.sendResult res,
			code: 200
			data: {errors: [{errorMessage: e.message}]}
