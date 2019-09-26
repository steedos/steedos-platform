###
@api {put} /api/workflow/open/save/:ins_id 暂存申请单

@apiName saveInstances

@apiGroup Workflow

@apiPermission 工作区管理员

@apiParam {String} access_token User API Token

@apiHeader {String} X-Space-Id	工作区Id

@apiHeaderExample {json} Header-Example:
    {
		"X-Space-Id": "wsw1re12TdeP223sC"
	}

@apiSuccessExample {json} Success-Response:
    {
		"status": "success",
		"data": {instance}
	}
###
JsonRoutes.add 'put', '/api/workflow/open/save/:ins_id', (req, res, next) ->
	try
		ins_id = req.params.ins_id

		if !Steedos.APIAuthenticationCheck(req, res)
			return ;

		current_user = req.userId

		space_id = req.headers['x-space-id']

		if not space_id
			throw new Meteor.Error('error', 'need header X_Space_Id')

		current_user_info = db.users.findOne(current_user)

		if not current_user_info
			throw new Meteor.Error('error', 'can not find user')

		# 校验space是否存在
		uuflowManager.getSpace(space_id)
		# 校验当前登录用户是否是space的管理员
		uuflowManager.isSpaceAdmin(space_id, current_user)

		values = req.body

		if not values
			throw new Meteor.Error('error', 'need values')

		current_trace = null
		setObj = new Object
		instance = uuflowManager.getInstance(ins_id)
		flow = uuflowManager.getFlow(instance.flow)

		_.each instance.traces, (t)->
			if t.is_finished isnt true
				current_trace = t

		current_step = uuflowManager.getStep(instance, flow, current_trace.step)

		if current_step.step_type is "counterSign"
			throw new Meteor.Error('error', '会签步骤不能修改表单值')

		_.each current_trace.approves, (a)->
			if a.is_finished isnt true and a.type isnt "cc"
				a.values = values

		setObj.modified = new Date
		setObj["traces.$.approves"] = current_trace.approves

		db.instances.update {
			_id: ins_id
			'traces._id': current_trace._id
		}, $set: setObj

		result = new Object

		JsonRoutes.sendResult res,
			code: 200
			data: { status: "success", data: result}
	catch e
		console.error e.stack
		JsonRoutes.sendResult res,
			code: 200
			data: { errors: [{errorMessage: e.message}]}
