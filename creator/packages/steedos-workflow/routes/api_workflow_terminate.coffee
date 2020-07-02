JsonRoutes.add 'post', '/api/workflow/terminate', (req, res, next) ->
	try
		current_user_info = uuflowManager.check_authorization(req)
		current_user = current_user_info._id

		hashData = req.body
		_.each hashData['Instances'], (instance_from_client) ->
			terminate_reason = instance_from_client["terminate_reason"]
			instance_id = instance_from_client["_id"]
			# 获取一个instance
			instance = uuflowManager.getInstance(instance_id)
			space_id = instance.space
			flow_id = instance.flow
			# 获取一个space
			space = uuflowManager.getSpace(space_id)
			# 获取一个flow
			flow = uuflowManager.getFlow(flow_id)
			# 判断一个instance是否为审核中状态
			uuflowManager.isInstancePending(instance)
			# 获取一个space下的一个user
			space_user = uuflowManager.getSpaceUser(space_id, current_user)
			# 获取space_user所在的部门信息
			space_user_org_info = uuflowManager.getSpaceUserOrgInfo(space_user)
			# 获取结束节点
			instance_flow_ver = null
			flow_ver_end_step = null
			flow_vers = new Array
			flow_vers.push(flow.current)
			flow_vers = flow_vers.concat(flow.historys)
			instance_flow_ver = _.find(flow_vers, (f_ver)->
				return f_ver._id is instance.flow_version
			)
			if not instance_flow_ver
				throw new Meteor.Error('error!', "未找到申请单对应流程版本")
			flow_ver_end_step = _.find(instance_flow_ver.steps, (f_step)->
				return f_step.step_type is "end"
			)
			# 调用getFlowPermissions方法，看返回的结果中是否有admin
			permissions = permissionManager.getFlowPermissions(flow_id, current_user)
			now = new Date
			setObj = new Object
			# space的admin, 填单人 申请人 有权限 取消申请
			if permissions.includes("admin") or space.admins.includes(current_user) or instance.submitter is current_user or instance.applicant is current_user
				if not terminate_reason
					throw new Meteor.Error('error!',"还未填写强制结束申请单的理由，操作失败")

				instance_trace = _.find(instance.traces, (trace)->
					return trace.is_finished is false
				)

				traces = instance.traces
				i = 0
				while i < traces.length
					if traces[i].is_finished is false
						# 更新当前trace记录
						traces[i].is_finished = true
						traces[i].finish_date = now
						h = 0
						while h < traces[i].approves.length
							if traces[i].approves[h].is_finished is false
								# 更新当前trace.approve记录
								traces[i].approves[h].is_finished = true
								traces[i].approves[h].finish_date = now
								traces[i].approves[h].judge = null
								traces[i].approves[h].description = null
							h++
						# 插入当前Trace trace.approve记录：当trace.type为取回、强制结束时，is_read=true且read_date为当前时间。
						newApprove = new Object
						newApprove._id = new Mongo.ObjectID()._str
						newApprove.instance = instance_id
						newApprove.trace = instance_trace._id
						newApprove.is_finished = true
						newApprove.user = current_user
						newApprove.user_name = current_user_info.name
						newApprove.handler = current_user
						newApprove.handler_name = current_user_info.name
						newApprove.handler_organization = space_user_org_info["organization"]
						newApprove.handler_organization_name = space_user_org_info["organization_name"]
						newApprove.handler_organization_fullname = space_user_org_info["organization_fullname"]
						newApprove.start_date = now
						newApprove.finish_date = now
						newApprove.due_date = instance_trace.due_date
						newApprove.read_date = now
						newApprove.judge = "terminated"
						newApprove.is_read = true
						newApprove.description = terminate_reason
						newApprove.is_error = false
						newApprove.values = new Object
						newApprove.cost_time = newApprove.finish_date - newApprove.start_date
						traces[i].approves.push(newApprove)
					i++

				# 插入下一步trace记录
				newTrace = new Object
				newTrace._id = new Mongo.ObjectID()._str
				newTrace.instance = instance_id
				newTrace.previous_trace_ids = [instance_trace._id]
				# type---停用
				# newTrace.type = "terminated"
				newTrace.is_finished = true
				newTrace.step = flow_ver_end_step._id
				newTrace.name = flow_ver_end_step.name
				newTrace.start_date = now
				newTrace.finish_date = now
				newTrace.judge = "terminated"

				setObj.state = "completed"
				setObj.final_decision = "terminated"
				old_inbox_users = instance.inbox_users
				old_cc_users = instance.cc_users || []
				old_outbox_users = instance.outbox_users
				tempUsers = new Array
				_.each(instance_trace.approves, (nft_approve)->
					tempUsers.push(nft_approve.user)
					tempUsers.push(nft_approve.handler)
				)
				setObj.outbox_users = _.uniq(instance.outbox_users.concat(tempUsers))
				setObj.inbox_users = new Array
				setObj.cc_users = new Array
				setObj.modified = now
				setObj.modified_by = current_user
				traces.push(newTrace)
				setObj.traces = traces

				setObj.current_step_name = flow_ver_end_step.name
				setObj.current_step_auto_submit = false

				r = db.instances.update({_id: instance_id}, {$set: setObj})
				if r
					ins = uuflowManager.getInstance(instance_id)
					#通知填单人、申请人
					pushManager.send_instance_notification("submit_terminate_applicant", ins, terminate_reason, current_user_info)

					#发送给待处理人 被传阅人
					if old_inbox_users
						_.each(_.uniq(old_inbox_users.concat(old_cc_users)), (user_id)->
							pushManager.send_message_to_specifyUser("terminate_approval", user_id)
						)

					# 如果已经配置webhook并已激活则触发
					pushManager.triggerWebhook(ins.flow, ins, {}, 'terminate', current_user, [])

		#发送消息给当前用户
		pushManager.send_message_current_user(current_user_info)
		JsonRoutes.sendResult res,
				code: 200
				data: {}
	catch e
		console.error e.stack
		JsonRoutes.sendResult res,
			code: 200
			data: { errors: [{errorMessage: e.message}] }
