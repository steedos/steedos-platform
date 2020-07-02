JsonRoutes.add 'post', '/api/workflow/archive', (req, res, next) ->
	try
		current_user_info = uuflowManager.check_authorization(req)
		current_user = current_user_info._id

		hashData = req.body
		_.each hashData['Instances'], (instance_from_client) ->
			instance_id = instance_from_client["_id"]
			# 获取一个instance
			instance = uuflowManager.getInstance(instance_id)
			space_id = instance.space
			# 获取一个space
			space = uuflowManager.getSpace(space_id)
			# 判断一个instance是否为完成并且未归档状态
			uuflowManager.isInstanceFinishedAndNotArchieved(instance)
			# 获取一个space下的一个user
			space_user = uuflowManager.getSpaceUser(space_id, current_user)
			# 判断一个用户是否是一个instance的提交者 或者space的管理员
			uuflowManager.isInstanceSubmitterOrApplicantOrSpaceAdmin(instance, current_user, space)
			
			setObj = new Object
			setObj.is_archived = true
			setObj.modified = new Date
			setObj.modified_by = current_user

			db.instances.update({_id: instance_id}, {$set: setObj})

		JsonRoutes.sendResult res,
				code: 200
				data: {}
	catch e
		console.error e.stack
		JsonRoutes.sendResult res,
			code: 200
			data: { errors: [{errorMessage: e.message}] }
	
		