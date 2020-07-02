JsonRoutes.add 'post', '/api/workflow/relocate', (req, res, next) ->
	try
		current_user_info = uuflowManager.check_authorization(req)
		current_user = current_user_info._id

		hashData = req.body
		_.each hashData['Instances'], (instance_from_client) ->
			instance = uuflowManager.getInstance(instance_from_client["_id"])

			last_trace = _.last(instance.traces)

			# 验证login user_id对该流程有管理申请单的权限
			permissions = permissionManager.getFlowPermissions(instance.flow, current_user)
			space = db.spaces.findOne(instance.space, { fields: { admins: 1 } })
			if (not permissions.includes("admin")) and (not space.admins.includes(current_user))
				throw new Meteor.Error('error!', "用户没有对当前流程的管理权限")

			space_id = instance.space
			instance_id = last_trace.instance
			inbox_users = instance.inbox_users
			relocate_inbox_users = instance_from_client["relocate_inbox_users"]
			relocate_comment = instance_from_client["relocate_comment"]
			relocate_next_step = instance_from_client["relocate_next_step"]
			not_in_inbox_users = _.difference(inbox_users, relocate_inbox_users)
			new_inbox_users = _.difference(relocate_inbox_users, inbox_users)

			approve_users = []

			# 获取一个flow
			flow = uuflowManager.getFlow(instance.flow)
			next_step = uuflowManager.getStep(instance, flow, relocate_next_step)
			next_step_type = next_step.step_type
			next_step_name = next_step.name
			current_setp = uuflowManager.getStep(instance, flow, last_trace.step)
			current_setp_type = current_setp.step_type

			traces = instance.traces
			setObj = new Object
			# 重定位的时候使用approve.values合并 instance.values生成新的instance.values #1328
			setObj.values = uuflowManager.getUpdatedValues(instance)
			now = new Date
			i = 0
			while i < traces.length
				if traces[i]._id is last_trace._id
					if not traces[i].approves
						traces[i].approves = new Array
					# 更新当前trace.approve记录
					h = 0
					while h < traces[i].approves.length
						if traces[i].approves[h].is_finished is false and traces[i].approves[h].type isnt "cc" and traces[i].approves[h].type isnt "distribute"
							traces[i].approves[h].start_date = now
							traces[i].approves[h].finish_date = now
							traces[i].approves[h].read_date = now
							traces[i].approves[h].is_error = false
							traces[i].approves[h].is_read = true
							traces[i].approves[h].is_finished = true
							traces[i].approves[h].judge = "terminated"
							traces[i].approves[h].cost_time = traces[i].approves[h].finish_date - traces[i].approves[h].start_date
							approve_users.push(traces[i].approves[h].user)

							# begin 被重定位给A，再被重定位走，之前A的意见在意见栏中显示不出来了。 #1921
							if traces[i].approves[h].sign_show == true
								ta = traces[i].approves[h]
								sameTraces = _.filter traces, (t)->
									return t.step == traces[i].step

								l = sameTraces.length - 1
								signShowApproveId = null

								while l > -1
									_.each sameTraces[l].approves, (a)->
										if a.user == ta.user && a.judge != "terminated" && a.description && !signShowApproveId
											signShowApproveId = a._id
									l--

								if signShowApproveId
									ti = 0
									while ti < traces.length
										ah = 0
										while ah < traces[ti].approves.length
											if traces[ti].approves[ah]._id == signShowApproveId
												traces[ti].approves[ah].sign_show = true
												traces[i].approves[h].sign_show = false
											ah++
										ti++
							# end 被重定位给A，再被重定位走，之前A的意见在意见栏中显示不出来了。 #1921

						h++

					# 在同一trace下插入重定位操作者的approve记录
					current_space_user = uuflowManager.getSpaceUser(space_id, current_user)
					current_user_organization = db.organizations.findOne(current_space_user.organization, { fields: { name: 1 , fullname: 1 } })
					relocate_appr = new Object
					relocate_appr._id = new Mongo.ObjectID()._str
					relocate_appr.instance = instance_id
					relocate_appr.trace = traces[i]._id
					relocate_appr.is_finished = true
					relocate_appr.user = current_user
					relocate_appr.user_name = current_user_info.name
					relocate_appr.handler = current_user
					relocate_appr.handler_name = current_user_info.name
					relocate_appr.handler_organization = current_space_user.organization
					relocate_appr.handler_organization_name = current_user_organization.name
					relocate_appr.handler_organization_fullname = current_user_organization.fullname
					relocate_appr.start_date = now
					relocate_appr.finish_date = now
					relocate_appr.due_date = traces[i].due_date
					relocate_appr.read_date = now
					relocate_appr.judge = "relocated"
					relocate_appr.is_read = true
					relocate_appr.description = relocate_comment
					relocate_appr.is_error = false
					relocate_appr.values = new Object
					relocate_appr.cost_time = relocate_appr.finish_date - relocate_appr.start_date
					traces[i].approves.push(relocate_appr)

					# 更新当前trace记录
					traces[i].is_finished = true
					traces[i].finish_date = now
					traces[i].judge = "relocated"

				i++

			if next_step_type is "end"
				# 插入下一步trace记录
				newTrace = new Object
				newTrace._id = new Mongo.ObjectID()._str
				newTrace.instance = instance_id
				newTrace.previous_trace_ids = [last_trace._id]
				newTrace.is_finished = true
				newTrace.step = relocate_next_step
				newTrace.name = next_step_name
				newTrace.start_date = now
				newTrace.finish_date = now
				newTrace.approves = []
				# 更新instance记录
				setObj.state = "completed"
				setObj.inbox_users = []
				setObj.final_decision = "terminated"
				setObj.finish_date = new Date
				setObj.current_step_name = next_step_name
				setObj.current_step_auto_submit = false
			else
				# 插入下一步trace记录
				newTrace = new Object
				newTrace._id = new Mongo.ObjectID()._str
				newTrace.instance = instance_id
				newTrace.previous_trace_ids = [last_trace._id]
				newTrace.is_finished = false
				newTrace.step = relocate_next_step
				newTrace.name = next_step_name
				newTrace.start_date = now
				newTrace.due_date = uuflowManager.getDueDate(next_step.timeout_hours)
				newTrace.approves = []
				_.each(relocate_inbox_users, (next_step_user_id, idx)->
					# 插入下一步trace.approve记录
					newApprove = new Object
					newApprove._id = new Mongo.ObjectID()._str
					newApprove.instance = instance_id
					newApprove.trace = newTrace._id
					newApprove.is_finished = false
					newApprove.user = next_step_user_id

					user_info = db.users.findOne(next_step_user_id, { fields: { name: 1 } })
					newApprove.user_name = user_info.name

					handler_id = next_step_user_id
					handler_info = user_info
					agent = uuflowManager.getAgent(space_id, next_step_user_id)
					if agent
						relocate_inbox_users[idx] = agent
						handler_id = agent
						handler_info = db.users.findOne({ _id: agent }, { fields: { name: 1 } })
						newApprove.agent = agent

					newApprove.handler = handler_id
					newApprove.handler_name = handler_info.name

					next_step_space_user = uuflowManager.getSpaceUser(space_id, handler_id)
					# 获取next_step_user所在的部门信息
					next_step_user_org_info = uuflowManager.getSpaceUserOrgInfo(next_step_space_user)
					newApprove.handler_organization = next_step_user_org_info["organization"]
					newApprove.handler_organization_name = next_step_user_org_info["organization_name"]
					newApprove.handler_organization_fullname = next_step_user_org_info["organization_fullname"]

					newApprove.start_date = now
					newApprove.due_date = newTrace.due_date
					newApprove.is_read = false
					newApprove.is_error = false
					newApprove.values = new Object
					uuflowManager.setRemindInfo(instance.values, newApprove)
					newTrace.approves.push(newApprove)
				)
				setObj.inbox_users = relocate_inbox_users
				setObj.state = "pending"
				setObj.current_step_name = next_step_name
				setObj.current_step_auto_submit = uuflowManager.getCurrentStepAutoSubmit(flow.timeout_auto_submit, next_step.lines)

			instance.outbox_users.push(current_user)
			instance.outbox_users = instance.outbox_users.concat(inbox_users).concat(approve_users)
			setObj.outbox_users = _.uniq(instance.outbox_users)
			setObj.modified = now
			setObj.modified_by = current_user
			setObj.is_archived = false
			traces.push(newTrace)
			setObj.traces = traces

			if setObj.state == 'completed'
				r = db.instances.update({_id: instance_id}, {$set: setObj})
			else
				r = db.instances.update({_id: instance_id}, {$set: setObj, $unset: {finish_date: 1}})

			if r
				ins = uuflowManager.getInstance(instance_id)
				# 给被删除的inbox_users 和 当前用户 发送push
				pushManager.send_message_current_user(current_user_info)
				_.each(not_in_inbox_users, (user_id)->
					if user_id isnt current_user
						pushManager.send_message_to_specifyUser("current_user", user_id)
				)
				# 提取instances.outbox_users数组和填单人、申请人
				_users = new Array
				_users.push(ins.applicant)
				_users.push(ins.submitter)
				_users = _.uniq(_users.concat(ins.outbox_users))
				_.each(_users, (user_id)->
					pushManager.send_message_to_specifyUser("current_user", user_id)
				)

				# 给新加入的inbox_users发送push message
				pushManager.send_instance_notification("reassign_new_inbox_users", ins, relocate_comment, current_user_info)

				# 如果已经配置webhook并已激活则触发
				pushManager.triggerWebhook(ins.flow, ins, {}, 'relocate', current_user, ins.inbox_users)

		JsonRoutes.sendResult res,
			code: 200
			data: {}
	catch e
		console.error e.stack
		JsonRoutes.sendResult res,
			code: 200
			data: {errors: [{errorMessage: e.message}]}
