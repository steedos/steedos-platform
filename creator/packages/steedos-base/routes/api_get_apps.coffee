JsonRoutes.add 'get', '/api/get/apps', (req, res, next) ->
	try
		user_id = req.headers['x-user-id'] || req.query?.userId

		space_id = req.headers['x-space-id'] || req.query?.spaceId

		user = Steedos.getAPILoginUser(req, res)
		
		if !user
			JsonRoutes.sendResult res,
				code: 401,
				data:
					"error": "Validate Request -- Missing X-Auth-Token,X-User-Id",
					"success": false
			return;

		user_id = user._id

		# 校验space是否存在
		uuflowManager.getSpace(space_id)

		locale = db.users.findOne({_id:user_id}).locale
		if locale == "en-us"
			locale = "en"
		if locale == "zh-cn"
			locale = "zh-CN"

		spaces = db.space_users.find({user: user_id}).fetch().getProperty("space")
		apps = db.apps.find({$or: [{space: {$exists: false}}, {space: {$in:spaces}}]},{sort:{sort:1}}).fetch()

		apps.forEach (app) ->
			app.name = TAPi18n.__(app.name,{},locale)

		JsonRoutes.sendResult res,
			code: 200
			data: { status: "success", data: apps}
	catch e
		console.error e.stack
		JsonRoutes.sendResult res,
			code: 200
			data: { errors: [{errorMessage: e.message}]}
	
		