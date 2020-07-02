###
@api {put} /api/workflow/open/submit/:ins_id 提交申请单

@apiDescription 暂不支持开始节点下一节点为条件的情况

@apiName submitInstance

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

JsonRoutes.add 'put', '/api/workflow/open/submit/:ins_id', (req, res, next) ->
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

		instance = uuflowManager.getInstance(ins_id)

		# 校验申请单状态为草稿
		uuflowManager.isInstanceDraft(instance)

		if space_id isnt instance["space"]
			throw new Meteor.Error('error', 'instance is not belong to this space')

		# 校验申请单必填字段是否有值
		values = instance["traces"][0]["approves"][0].values

		form = uuflowManager.getForm(instance.form)

		require_but_empty_fields = uuflowManager.checkValueFieldsRequire(values, form, instance.form_version)

		if require_but_empty_fields.length > 0
			if require_but_empty_fields.length > 1
				throw new Meteor.Error('error', 'fields <' + require_but_empty_fields.join(",") + '> are required')
			else if require_but_empty_fields.length = 1
				throw new Meteor.Error('error', 'field <' + require_but_empty_fields.join(",") + '> is required')

		flow = uuflowManager.getFlow(instance.flow)

		step = uuflowManager.getStep(instance, flow, instance["traces"][0].step)

		# 计算下一步骤选项
		nextSteps = uuflowManager.getNextSteps(instance, flow, step, "submitted")

		if nextSteps.length < 1
			throw new Meteor.Error('error', 'can not find next steps')

		if nextSteps.length > 1
			throw new Meteor.Error('error', 'next step not uniq')

		next_step_id = nextSteps[0]

		# 计算下一步处理人选项
		next_user_ids = getHandlersManager.getHandlers(ins_id, next_step_id) || []

		if next_user_ids.length > 1
			throw new Meteor.Error('error', 'next step handler not uniq')

		instance["traces"][0]["approves"][0]["next_steps"] = [{'step': next_step_id, 'users': next_user_ids}]

		result = new Object

		submitter = db.users.findOne(instance.submitter)

		if not submitter
			throw new Meteor.Error('error', 'can not find submitter')

		r = uuflowManager.submit_instance(instance, submitter)

		if r.alerts
			result = r
		else
			result = db.instances.findOne(ins_id)
			if result
				result.attachments = cfs.instances.find({'metadata.instance': ins_id,'metadata.current': true, "metadata.is_private": {$ne: true}}, {fields: {copies: 0}}).fetch()

		JsonRoutes.sendResult res,
			code: 200
			data: { status: "success", data: result}
	catch e
		console.error e.stack
		JsonRoutes.sendResult res,
			code: 200
			data: { errors: [{errorMessage: e.message}]}
