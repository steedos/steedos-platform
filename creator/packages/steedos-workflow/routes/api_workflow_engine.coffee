JsonRoutes.add 'post', '/api/workflow/engine', (req, res, next) ->
	try
		current_user_info = uuflowManager.check_authorization(req)
		current_user = current_user_info._id

		hashData = req.body

		_.each hashData['Approvals'], (approve_from_client) ->
			uuflowManager.workflow_engine(approve_from_client, current_user_info, current_user)

		JsonRoutes.sendResult res,
			code: 200
			data: {}
	catch e
		console.error e.stack
		JsonRoutes.sendResult res,
			code: 200
			data: { errors: [{errorMessage: e.message}]}
