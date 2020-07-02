JsonRoutes.add 'post', '/api/workflow/retrieve', (req, res, next) ->
	try
		current_user_info = uuflowManager.check_authorization(req)
		current_user = current_user_info._id

		hashData = req.body
		_.each hashData['Instances'], (instance_from_client) ->
			instance = uuflowManager.getInstance(instance_from_client["_id"])
			retrieve_comment = instance_from_client['retrieve_comment']

			# 验证instance为审核中状态
			# uuflowManager.isInstancePending(instance)
			# 校验申请单是当前用户已审核过的单子或者当前用户是提交人或申请人
			if (not instance.outbox_users.includes(current_user)) and (instance.submitter isnt current_user and instance.applicant isnt current_user)
				throw new Meteor.Error('error', '当前用户不符合取回条件')

			retrieve_type = ""

			traces = instance.traces

			#获取最新的trace， 即取回步骤
			last_trace = _.last(traces)
			last_trace_id = last_trace._id
			previous_trace_id = last_trace.previous_trace_ids[0];
			previous_trace = _.find(traces, (t)->
				return t._id is previous_trace_id
			)
			previous_trace_step_id = previous_trace.step
			previous_trace_name = previous_trace.name
			flow = uuflowManager.getFlow(instance.flow)
			previous_step = uuflowManager.getStep(instance, flow, previous_trace_step_id)
			if previous_step.step_type is "counterSign"
				throw new Meteor.Error('error', '会签不能取回')

			# 取回步骤的前一个步骤处理人唯一（即排除掉传阅和转发的approve后，剩余的approve只有一个）并且是当前用户
			previous_trace_approves = _.filter previous_trace.approves, (a)->
				return a.type isnt 'cc' and a.type isnt 'distribute' and a.type isnt 'forward' and ['approved','submitted','rejected'].includes(a.judge)

			if previous_trace_approves.length is 1 and (previous_trace_approves[0].user is current_user or previous_trace_approves[0].handler is current_user)
				retrieve_type = 'normal' # 申请单正常流转的取回，即非传阅取回

			i = traces.length
			retrieve_approve = {}
			while i > 0
				_.each traces[i-1].approves, (a)->
					if a.type is 'cc' and a.is_finished is true and a.user is current_user
						retrieve_type = 'cc'
						retrieve_approve = a

				if retrieve_type is 'cc'
					break

				i--


			if retrieve_type is 'normal'
				# 获取一个flow
				flow = uuflowManager.getFlow(instance.flow)
				previous_step = uuflowManager.getStep(instance, flow, previous_trace_step_id)
				space_id = instance.space
				instance_id = instance._id
				old_inbox_users = instance.inbox_users
				setObj = new Object
				now = new Date
				_.each traces, (t)->
					if t._id is last_trace_id
						if not t.approves
							t.approves = new Array
						# 更新当前trace.approve记录
						_.each t.approves, (appr)->
							if appr.is_finished == false and appr.type isnt "cc"
								appr.start_date = now
								appr.finish_date = now
								appr.read_date = now
								appr.is_error = false
								appr.is_read = true
								appr.is_finished = true
								appr.judge = "terminated"
								appr.cost_time = appr.finish_date - appr.start_date
						# 在同一trace下插入取回操作者的approve记录
						current_space_user = uuflowManager.getSpaceUser(space_id, current_user)
						current_user_organization = db.organizations.findOne(current_space_user.organization, { fields: { name: 1, fullname: 1 } })
						retrieve_appr = new Object
						retrieve_appr._id = new Mongo.ObjectID()._str
						retrieve_appr.instance = instance_id
						retrieve_appr.trace = t._id
						retrieve_appr.is_finished = true
						retrieve_appr.user = current_user
						retrieve_appr.user_name = current_user_info.name
						retrieve_appr.handler = current_user
						retrieve_appr.handler_name = current_user_info.name
						retrieve_appr.handler_organization = current_space_user.organization
						retrieve_appr.handler_organization_name = current_user_organization.name
						retrieve_appr.handler_organization_fullname = current_user_organization.fullname
						retrieve_appr.start_date = now
						retrieve_appr.finish_date = now
						retrieve_appr.due_date = t.due_date
						retrieve_appr.read_date = now
						retrieve_appr.judge = "retrieved"
						retrieve_appr.is_read = true
						retrieve_appr.description = retrieve_comment
						retrieve_appr.is_error = false
						retrieve_appr.values = new Object
						retrieve_appr.cost_time = retrieve_appr.finish_date - retrieve_appr.start_date
						t.approves.push(retrieve_appr)

						# 更新当前trace记录
						t.is_finished = true
						t.finish_date = now
						t.judge = "retrieved"

				# 插入下一步trace记录
				newTrace = new Object
				newTrace._id = new Mongo.ObjectID()._str
				newTrace.instance = instance_id
				newTrace.previous_trace_ids = [last_trace_id]
				newTrace.is_finished = false
				newTrace.step = previous_trace_step_id
				newTrace.name = previous_trace_name
				newTrace.start_date = now
				newTrace.due_date = uuflowManager.getDueDate(previous_step.timeout_hours)
				newTrace.approves = []
				# 插入下一步trace.approve记录
				newApprove = new Object
				newApprove._id = new Mongo.ObjectID()._str
				newApprove.instance = instance_id
				newApprove.trace = newTrace._id
				newApprove.is_finished = false
				newApprove.user = current_user

				handler_info = db.users.findOne(current_user, { fields: { name: 1 } })
				newApprove.user_name = handler_info.name
				newApprove.handler = current_user
				newApprove.handler_name = handler_info.name

				space_user = uuflowManager.getSpaceUser(space_id, current_user)
				# 获取next_step_user所在的部门信息
				org_info = uuflowManager.getSpaceUserOrgInfo(space_user)
				newApprove.handler_organization = org_info["organization"]
				newApprove.handler_organization_name = org_info["organization_name"]
				newApprove.handler_organization_fullname = org_info["organization_fullname"]

				newApprove.start_date = now
				newApprove.due_date = newTrace.due_date
				newApprove.is_read = false
				newApprove.is_error = false
				newApprove.values = new Object

				uuflowManager.setRemindInfo(instance.values, newApprove)

				newTrace.approves.push(newApprove)
				setObj.inbox_users = [current_user]

				setObj.modified = now
				setObj.modified_by = current_user
				traces.push(newTrace)
				setObj.traces = traces
				setObj.state = "pending"
				setObj.is_archived = false

				setObj.current_step_name = previous_trace_name
				setObj.current_step_auto_submit = uuflowManager.getCurrentStepAutoSubmit(flow.timeout_auto_submit, previous_step.lines)

				r = db.instances.update({_id: instance_id}, {$set: setObj})
				if r
					# 给被删除的inbox_users 和 当前用户 发送push
					pushManager.send_message_current_user(current_user_info)
					_.each(old_inbox_users, (user_id)->
						if user_id isnt current_user
							pushManager.send_message_to_specifyUser("current_user", user_id)
					)

					ins = uuflowManager.getInstance(instance_id)
					# 如果已经配置webhook并已激活则触发
					pushManager.triggerWebhook(ins.flow, ins, {}, 'retrieve', current_user, ins.inbox_users)

			else if retrieve_type is 'cc'
				setObj = new Object
				now = new Date
				instance_id = instance._id
				the_trace = _.find traces, (t)->
					return t._id is retrieve_approve.trace

				_.each the_trace.approves, (a)->
					if a._id is retrieve_approve._id
						a.is_finished = false
						a.finish_date = undefined
						a.judge = undefined
						a.cost_time = undefined

				cc_users = instance.cc_users
				cc_users.push(current_user)

				setObj.modified = now
				setObj.modified_by = current_user
				setObj.state = "pending"
				setObj.is_archived = false
				setObj.cc_users = cc_users
				setObj['traces.$.approves'] = the_trace.approves

				r = db.instances.update({_id: instance_id, 'traces._id': retrieve_approve.trace}, {$set: setObj})
				if r
					pushManager.send_message_current_user(current_user_info)

				ins = uuflowManager.getInstance(instance_id)
				# 如果已经配置webhook并已激活则触发
				pushManager.triggerWebhook(ins.flow, ins, {}, 'retrieve', current_user, [current_user])

		JsonRoutes.sendResult res,
			code: 200
			data: {}
	catch e
		console.error e.stack
		JsonRoutes.sendResult res,
			code: 200
			data: {errors: [{errorMessage: e.message}]}
