JsonRoutes.add "post", "/api/workflow/getNameForUser",  (req, res, next) ->
	try
		userId = req.body.userId

		if not userId 
			JsonRoutes.sendResult res, 
				code: 200,
				data: {
					'errors': '缺少参数'
				}

		user = WorkflowManager.getNameForUser(userId)

		JsonRoutes.sendResult res, 
			code: 200,
			data: {user: user}
	catch e
		console.error e.stack
		JsonRoutes.sendResult res,
			code: 200
			data: { errors: [{errorMessage: e.message}] }
	
		
