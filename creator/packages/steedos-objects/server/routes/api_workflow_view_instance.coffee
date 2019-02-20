JsonRoutes.add 'post', '/api/workflow/view/:instanceId', (req, res, next) ->
	try
		current_user_info = uuflowManager.check_authorization(req)
		current_user_id = current_user_info._id

		hashData = req.body
		object_name = hashData.object_name
		record_id = hashData.record_id
		space_id = hashData.space_id

		check object_name, String
		check record_id, String
		check space_id, String

		insId = req.params.instanceId
		x_user_id = req.query['X-User-Id']
		x_auth_token = req.query['X-Auth-Token']

		redirect_url = "/"
		ins = Creator.getCollection('instances').findOne(insId)
		# - 我的草稿就跳转至草稿箱
		# - 我的待审核就跳转至待审核
		# - 不是我的申请单则跳转至打印页面
		# - 如申请单不存在则提示用户申请单已删除，并且更新record的状态，使用户可以重新发起审批
		if ins
			workflowUrl = Meteor.settings.public.webservices.workflow.url
			box = ''
			spaceId = ins.space
			flowId = ins.flow

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
				if permissions.includes("admin") or space.admins.includes(current_user_id)
					box = 'monitor'

			if box
				redirect_url = workflowUrl + "workflow/space/#{spaceId}/#{box}/#{insId}?X-User-Id=#{x_user_id}&X-Auth-Token=#{x_auth_token}"
			else
				redirect_url = workflowUrl + "workflow/space/#{spaceId}/print/#{insId}?box=monitor&print_is_show_traces=1&print_is_show_attachments=1&X-User-Id=#{x_user_id}&X-Auth-Token=#{x_auth_token}"

			JsonRoutes.sendResult res, {
				code: 200
				data: { redirect_url: redirect_url }
			}
			return
		else
			collection = Creator.getCollection(object_name, space_id)
			if collection
				collection.update(record_id, {
					$pull: {
						"instances": {
							"_id": insId
						}
					}
				})

				throw new Meteor.Error('error', '申请单已删除')

	catch e
		JsonRoutes.sendResult res, {
			code: 200
			data: { errors: [{ errorMessage: e.reason || e.message }] }
		}

