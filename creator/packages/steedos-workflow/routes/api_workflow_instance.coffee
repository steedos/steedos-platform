JsonRoutes.add 'get', '/api/workflow/instance/:instanceId', (req, res, next) ->
	try
		current_user_info = uuflowManager.check_authorization(req, res)
		current_user_id = current_user_info._id
		req_async = _.has(req.query, 'async');
		insId = req.params.instanceId

		ins = db.instances.findOne(insId, { fields: { space: 1, flow: 1, state: 1, inbox_users: 1, cc_users: 1, outbox_users: 1, submitter: 1, applicant: 1 } })

		if not ins
			throw new Meteor.Error('error', 'instanceId is wrong or instance not exists.')

		spaceId = ins.space
		flowId = ins.flow

		if db.space_users.find({ space: spaceId, user: current_user_id }).count() is 0
			throw new Meteor.Error('error', 'user is not belong to this space.')

		box = ''

		if (ins.inbox_users?.includes current_user_id) or (ins.cc_users?.includes current_user_id)
			box = 'inbox'
		else if ins.outbox_users?.includes current_user_id
			box = 'outbox'
		else if ins.state is 'draft' and ins.submitter is current_user_id
			box = 'draft'
		else if ins.state is 'pending' and (ins.submitter is current_user_id or ins.applicant is current_user_id)
			box = 'pending'
		else if ins.state is 'completed' and ins.submitter is current_user_id
			box = 'completed'
		else
			# 验证login user_id对该流程有管理申请单的权限
			permissions = permissionManager.getFlowPermissions(flowId, current_user_id)
			space = db.spaces.findOne(spaceId, { fields: { admins: 1 } })
			if (not permissions.includes("admin")) and (not space.admins.includes(current_user_id))
				throw new Meteor.Error('error', "no permission.")
			box = 'monitor'

		redirectTo = "workflow/space/#{spaceId}/#{box}/#{insId}"
		redirectToUrl = Meteor.absoluteUrl(redirectTo)
		if req_async # || req.get("X-Requested-With") === 'XMLHttpRequest'
			return res.status(200).send({
				"status": 302,
				"redirect": redirectTo
			});
		else
			res.setHeader "Location", redirectToUrl
			res.writeHead 302
			res.end()
			return
	catch e
		console.error e.stack
		JsonRoutes.sendResult res,
			code: 200
			data: { errors: [{errorMessage: e.message}] }
