Meteor.methods
	instance_return: (approve, reason)->
		check(approve, Object)

		current_user = this.userId
		instance_id = approve.instance

		ins = uuflowManager.getInstance(instance_id)
		space_id = ins.space

		# - 待审核箱
		if ins.state isnt "pending" or !ins.inbox_users.includes(current_user)
			throw new Meteor.Error('error!', "不符合退回条件")

		# - 文件不是传阅
		if approve.type is "cc" and ins.cc_users.includes(current_user)
			throw new Meteor.Error('error!', "不符合退回条件")

		# - 签核历程中当前步骤上一步骤不是会签
		if ins.traces.length < 2
			throw new Meteor.Error('error!', "不符合退回条件")
		flow = uuflowManager.getFlow(ins.flow)
		pre_trace = ins.traces[ins.traces.length - 2]
		pre_step = uuflowManager.getStep(ins, flow, pre_trace.step)
		if pre_step.step_type is "counterSign"
			throw new Meteor.Error('error!', "不符合退回条件")

		# - 当前步骤为填写或者审批
		last_trace = _.last(ins.traces)
		current_step = uuflowManager.getStep(ins, flow, last_trace.step)
		if current_step.step_type isnt "submit" and current_step.step_type isnt "sign" and current_step.step_type isnt "counterSign"
			throw new Meteor.Error('error!', "不符合退回条件")

		# - 参数approve中trace与当前获取的trace是否匹配
		if approve.trace isnt last_trace._id
			throw new Meteor.Error('error!', "不符合退回条件")

		new_inbox_users = new Array
		_.each pre_trace.approves, (a)->
			if (!a.type or a.type is "draft" or a.type is "reassign") and (!a.judge or a.judge is "submitted" or a.judge is "approved" or a.judge is "rejected")
				new_inbox_users.push(a.user)

		if _.isEmpty(new_inbox_users)
			throw new Meteor.Error('error!', "未找到下一步处理人，退回失败")

		traces = ins.traces

		approve_values = uuflowManager.getApproveValues(approve.values || {}, current_step.permissions, ins.form, ins.form_version)

		setObj = new Object
		now = new Date
		rest_counter_users = new Array
		_.each traces, (t)->
			if t._id is last_trace._id
				if not t.approves
					t.approves = new Array
				_.each t.approves, (a, idx)->
					if (!a.type or a.type is "reassign") and (!a.judge or a.judge is "submitted" or a.judge is "approved" or a.judge is "rejected" or a.judge is "readed") and a.is_finished isnt true
						setObj['traces.$.approves.' + idx + '.finish_date'] = now
						setObj['traces.$.approves.' + idx + '.read_date'] = now
						setObj['traces.$.approves.' + idx + '.is_error'] = false
						setObj['traces.$.approves.' + idx + '.is_read'] = true
						setObj['traces.$.approves.' + idx + '.is_finished'] = true
						setObj['traces.$.approves.' + idx + '.cost_time'] = now - a.start_date
						setObj['traces.$.approves.' + idx + '.values'] = approve_values
						if a.handler is current_user
							setObj['traces.$.approves.' + idx + '.judge'] = "returned"
							setObj['traces.$.approves.' + idx + '.description'] = reason
						else
							rest_counter_users.push a.handler

				# 更新当前trace记录
				setObj['traces.$.is_finished'] = true
				setObj['traces.$.finish_date'] = true
				setObj['traces.$.judge'] = "returned"

		ins.values = _.extend((ins.values || {}), approve_values)

		# 插入下一步trace记录
		newTrace = new Object
		newTrace._id = new Mongo.ObjectID()._str
		newTrace.instance = instance_id
		newTrace.previous_trace_ids = [last_trace._id]
		newTrace.is_finished = false
		newTrace.step = pre_trace.step
		newTrace.name = pre_trace.name
		newTrace.start_date = now
		newTrace.due_date = uuflowManager.getDueDate(pre_step.timeout_hours)
		newTrace.approves = []
		_.each new_inbox_users, (next_step_user_id, idx)->
			# 插入下一步trace.approve记录
			newApprove = new Object
			newApprove._id = new Mongo.ObjectID()._str
			newApprove.instance = instance_id
			newApprove.trace = newTrace._id
			newApprove.is_finished = false
			newApprove.user = next_step_user_id

			user_info = db.users.findOne(next_step_user_id, {fields: {name: 1}})
			newApprove.user_name = user_info.name

			handler_id = next_step_user_id
			handler_info = user_info
			agent = uuflowManager.getAgent(space_id, next_step_user_id)
			if agent
				new_inbox_users[idx] = agent
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
			newApprove.is_read = false
			newApprove.is_error = false
			newApprove.values = new Object
			uuflowManager.setRemindInfo(ins.values, newApprove)
			newTrace.approves.push(newApprove)

		setObj.inbox_users = new_inbox_users
		setObj.state = "pending"

		ins.outbox_users.push(current_user)
		setObj.outbox_users = _.uniq(ins.outbox_users)
		setObj.modified = now
		setObj.modified_by = current_user
		setObj.values = ins.values

		setObj.current_step_name = pre_trace.name

		r = db.instances.update({_id: instance_id, 'traces._id': last_trace._id}, {$set: setObj})
		b = db.instances.update({_id: instance_id}, {$push: {traces: newTrace}})
		if r && b
			# 新inbox_users 和 当前用户 发送push
			pushManager.send_message_to_specifyUser("current_user", current_user)
			instance = uuflowManager.getInstance(instance_id)
			current_user_info = db.users.findOne(current_user)
			pushManager.send_instance_notification("return_pending_inbox", instance, reason, current_user_info)
			# 如果是会签则给会签未提交的人发送push
			_.each rest_counter_users, (user_id)->
				pushManager.send_message_to_specifyUser("current_user", user_id)
		return true