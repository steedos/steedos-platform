JsonRoutes.add 'post', '/api/workflow/reassign', (req, res, next) ->
	try
		current_user_info = uuflowManager.check_authorization(req)
		current_user = current_user_info._id

		hashData = req.body
		_.each hashData['Instances'], (instance_from_client) ->
			instance_id = instance_from_client['_id']
			instance = uuflowManager.getInstance(instance_id)
			space_id = instance.space
			# 验证instance为审核中状态
			uuflowManager.isInstancePending(instance)
			# 验证当前执行转签核的trace未结束
			last_trace_from_client = _.last(instance_from_client["traces"])
			last_trace = _.find(instance.traces, (t) ->
				return t._id is last_trace_from_client["_id"]
			)
			if last_trace.is_finished is true
				return

			# 验证login user_id对该流程有管理申请单的权限
			permissions = permissionManager.getFlowPermissions(instance.flow, current_user)
			space = db.spaces.findOne({ _id: space_id }, { fields: { admins: 1 } })
			if (not permissions.includes("admin")) and (not space.admins.includes(current_user))
				throw new Meteor.Error('error!', "用户没有对当前流程的管理权限")

			inbox_users = instance.inbox_users
			inbox_users_from_client = instance_from_client["inbox_users"]
			reassign_reason = instance_from_client["reassign_reason"]
			not_in_inbox_users = _.difference(inbox_users, inbox_users_from_client)
			new_inbox_users = _.difference(inbox_users_from_client, inbox_users)
			# 若assignee=原inbox_users，说明不需要执行转签核，系统什么都不做
			return if not_in_inbox_users.length is 0 and new_inbox_users.length is 0
			setObj = new Object
			now = new Date
			i = 0
			approve_users_handlers = []
			while i < last_trace.approves.length
				if not_in_inbox_users.includes(last_trace.approves[i].handler)
					if last_trace.approves[i].is_finished is false and last_trace.approves[i].type isnt "cc" and last_trace.approves[i].type isnt "distribute"
						last_trace.approves[i].is_finished = true
						last_trace.approves[i].finish_date = now
						last_trace.approves[i].judge = "terminated"
						last_trace.approves[i].description = ""
						last_trace.approves[i].cost_time = last_trace.approves[i].finish_date - last_trace.approves[i].start_date
						approve_users_handlers.push(last_trace.approves[i].user)
						approve_users_handlers.push(last_trace.approves[i].handler)
				i++
			# 在同一trace下插入转签核操作者的approve记录
			current_space_user = uuflowManager.getSpaceUser(space_id, current_user)
			current_user_organization = db.organizations.findOne({ _id: current_space_user.organization }, { fields: { name: 1, fullname: 1 } })
			assignee_appr = new Object
			assignee_appr._id = new Mongo.ObjectID()._str
			assignee_appr.instance = last_trace.instance
			assignee_appr.trace = last_trace._id
			assignee_appr.is_finished = true
			assignee_appr.user = current_user
			assignee_appr.user_name = current_user_info.name
			assignee_appr.handler = current_user
			assignee_appr.handler_name = current_user_info.name
			assignee_appr.handler_organization = current_space_user.organization
			assignee_appr.handler_organization_name = current_user_organization.name
			assignee_appr.handler_organization_fullname = current_user_organization.fullname
			assignee_appr.start_date = now
			assignee_appr.finish_date = now
			assignee_appr.due_date = last_trace.due_date
			assignee_appr.read_date = now
			assignee_appr.judge = "reassigned"
			assignee_appr.is_read = true
			assignee_appr.description = reassign_reason
			assignee_appr.is_error = false
			assignee_appr.values = new Object
			assignee_appr.cost_time = assignee_appr.finish_date - assignee_appr.start_date
			last_trace.approves.push(assignee_appr)
			# 对新增的每位待审核人，各增加一条新的approve
			_.each(new_inbox_users, (user_id) ->
				new_user = db.users.findOne(user_id, { fields: { name: 1 } })
				space_user = uuflowManager.getSpaceUser(space_id, user_id)
				user_organization = db.organizations.findOne(space_user.organization, { fields: { name: 1, fullname: 1 } })
				new_appr = new Object
				new_appr._id = new Mongo.ObjectID()._str
				new_appr.instance = last_trace.instance
				new_appr.trace = last_trace._id
				new_appr.is_finished = false
				new_appr.user = user_id
				new_appr.user_name = new_user.name

				handler_id = user_id
				handler_info = new_user
				agent = uuflowManager.getAgent(space_id, user_id)
				if agent
					inbox_users_from_client[inbox_users_from_client.indexOf(user_id)] = agent
					handler_id = agent
					handler_info = db.users.findOne({ _id: agent }, { fields: { name: 1 } })
					new_appr.agent = agent

				new_appr.handler = handler_id
				new_appr.handler_name = handler_info.name
				new_appr.handler_organization = space_user.organization
				new_appr.handler_organization_name = user_organization.name
				new_appr.handler_organization_fullname = user_organization.fullname
				new_appr.from_user = current_user
				new_appr.from_user_name = current_user_info.name
				new_appr.type = "reassign"
				new_appr.start_date = now
				new_appr.due_date = last_trace.due_date
				new_appr.is_read = false
				new_appr.is_error = false
				new_appr.values = new Object
				uuflowManager.setRemindInfo(instance.values, new_appr)
				last_trace.approves.push(new_appr)
			)

			instance.outbox_users.push(current_user)
			instance.outbox_users = instance.outbox_users.concat(approve_users_handlers)
			setObj.outbox_users = _.uniq(instance.outbox_users)
			setObj.inbox_users = inbox_users_from_client
			setObj.modified = now
			setObj.modified_by = current_user
			setObj["traces.$.approves"] = last_trace.approves
			r = db.instances.update({ _id: instance_id, "traces._id": last_trace._id }, { $set: setObj })
			if r
				ins = uuflowManager.getInstance(instance_id)
				# 给被删除的inbox_users 和 当前用户 发送push
				pushManager.send_message_current_user(current_user_info)
				_.each(not_in_inbox_users, (user_id) ->
					if user_id isnt current_user
						pushManager.send_message_to_specifyUser("current_user", user_id)
				)
				# 提取instances.outbox_users数组和填单人、申请人
				_users = new Array
				_users.push(ins.applicant)
				_users.push(ins.submitter)
				_users = _.uniq(_users.concat(ins.outbox_users))
				_.each(_users, (user_id) ->
					pushManager.send_message_to_specifyUser("current_user", user_id)
				)

				# 给新加入的inbox_users发送push message
				pushManager.send_instance_notification("reassign_new_inbox_users", ins, reassign_reason, current_user_info)

				# 如果已经配置webhook并已激活则触发
				pushManager.triggerWebhook(ins.flow, ins, {}, 'reassign', current_user, ins.inbox_users)

		JsonRoutes.sendResult res, {
			code: 200
			data: {}
		}
	catch e
		console.error e.stack
		JsonRoutes.sendResult res, {
			code: 200
			data: { errors: [{ errorMessage: e.message }] }
		}
