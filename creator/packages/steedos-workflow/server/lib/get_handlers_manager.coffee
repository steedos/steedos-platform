getHandlersManager = {}

getHandlersManager.getHandlersByUsersAndRoles = (user_ids, role_ids, space_id)->
	approve_users = new Array
	_.each(user_ids, (user_id)->
		if db.users.find({_id: user_id}).count() > 0
			users = getHandlersManager.getHandlersByUserAndRoles(user_id, role_ids, space_id)
			if users.length > 0
				approve_users = approve_users.concat(users)
		else
			throw new Meteor.Error('error!', "user_id不合法不合法")
	)
	approve_users = _.uniq(approve_users)
	return approve_users

getHandlersManager.getHandlersByUserAndRoles = (user_id, role_ids, space_id)->
	user_ids = new Array
	_.each(role_ids, (role_id)->
		if db.flow_roles.find({_id: role_id}).count() > 0
			users = getHandlersManager.getHandlersByUserAndRole(user_id, role_id, space_id)
			if users.length > 0
				user_ids = user_ids.concat(users)
		else
			throw new Meteor.Error('error!', "role_id已经被删除")
	)
	if user_ids.length > 0
		user_ids = _.uniq(user_ids)
		return user_ids
	else
		throw new Meteor.Error('error!', "根据user_id和role_ids没查到对应的处理人")

getHandlersManager.getHandlersByUserAndRole = (user_id, role_id, space_id) ->
	orgs = db.organizations.find({ space: space_id, users: user_id }, { fields: { _id: 1 } }).fetch()
	user_ids = new Array
	_.each(orgs, (org) ->
		users = getHandlersManager.getHandlersByOrgAndRole(org._id, role_id, space_id)
		if users.length > 0
			user_ids = user_ids.concat(users)
	)
	user_ids = _.uniq(user_ids)
	return user_ids

getHandlersManager.getHandlersByOrgsAndRoles = (org_ids, role_ids, space_id)->
	user_ids = new Array
	_.each(org_ids, (org_id)->
		users = getHandlersManager.getHandlersByOrgAndRoles(org_id, role_ids, space_id)
		if users.length > 0
			user_ids = user_ids.concat(users)
	)
	user_ids = _.uniq(user_ids)
	return user_ids

getHandlersManager.getHandlersByOrgAndRoles = (org_id, role_ids, space_id)->
	user_ids = new Array
	_.each(role_ids, (role_id)->
		users = getHandlersManager.getHandlersByOrgAndRole(org_id, role_id, space_id)
		if users.length > 0
			user_ids = user_ids.concat(users)
	)
	if user_ids.length > 0
		user_ids = _.uniq(user_ids)
		return user_ids
	else
		throw new Meteor.Error('error!', "根据org_id和role_ids没查到对应的处理人")

getHandlersManager.getHandlersByOrgAndRole = (org_id, role_id, space_id) ->
	org = db.organizations.findOne({ _id: org_id }, { fields: { parents: 1 } })
	user_ids = new Array
	positions = db.flow_positions.find({ space: space_id, org: org_id, role: role_id }, { fields: { users: 1 } }).fetch()
	_.each(positions, (position) ->
		user_ids = user_ids.concat(position.users)
	)
	if user_ids.length is 0
		parents = org.parents
		_.each(parents, (parent_id) ->
			positions = db.flow_positions.find({ space: space_id, org: parent_id, role: role_id }, { fields: { users: 1 } }).fetch()
			if positions.length > 0
				_.each(positions, (position) ->
					user_ids = user_ids.concat(position.users)
				)
		)

	user_ids = _.uniq(user_ids)
	return user_ids

getHandlersManager.getHandlers = (instance_id, step_id) ->
	instance = db.instances.findOne(instance_id)

	# 拟稿时, 可以设定后续每个步骤的处理人 #1926
	if instance.step_approve && instance.step_approve[step_id]
		return instance.step_approve[step_id]

	approve_users = new Array
	space_id = instance.space
	flow_id = instance.flow
	flow_rev = instance.flow_version
	current_flow = db.flows.findOne(flow_id)
	current_step = null
	current_steps = new Array

	if current_flow.current._id is flow_rev
		current_steps = current_flow.current.steps
	else
		current = _.find(current_flow.historys, (history) ->
			return history._id is flow_rev
		)
		current_steps = current.steps

	# 从获取的steps中根据:step_id提取对应的step对象
	current_step = _.find(current_steps, (step) ->
		return step._id is step_id
	)
	# 判断step_type
	if current_step.step_type is "condition"
		unfinished_trace = _.find(instance.traces, (trace) ->
			return trace.is_finished is false
		)

		return new Array(unfinished_trace.approves[0].user)

	if current_step.step_type is "start"
		handlers = new Array
		handlers.push(instance.applicant)
		handlers.push(instance.submitter)
		handlers = _.uniq(handlers)
		return handlers
	# 得到step的"deal_type"，并进行逻辑判断找到对应的处理人
	deal_type = current_step.deal_type
	users = new Array
	if deal_type is "applicantRole"
		# 1.***********申请人所属组织中的审批岗位***********
		applicant = instance.applicant
		if applicant
			space_user_count = db.space_users.find({ space: space_id, user: applicant }).count()
			if space_user_count is 0
				throw new Meteor.Error('error!', "提交人已经被删除或不属于当前space")

			if current_step.approver_roles and current_step.approver_roles.length > 0
				_.each(current_step.approver_roles, (approver_role) ->
					role_count = db.flow_roles.find({ _id: approver_role }).count()
					if role_count is 0
						throw new Meteor.Error('error!', "角色已经被删除")
				)

				return getHandlersManager.getHandlersByUserAndRoles(applicant, current_step.approver_roles, space_id)
			else
				throw new Meteor.Error('error!', "审批岗位未指定")

		else
			throw new Meteor.Error('error!', "Instance的提交人为空")
	else if deal_type is "hrRole"
		approveHrRoleIds = current_step.approver_hr_roles;
		if (approveHrRoleIds)
			return _.pluck(WorkflowManager.getHrRolesUsers(space_id, approveHrRoleIds), 'user');
		else
			throw new Meteor.Error('error!', "角色未指定")
	else if deal_type is "applicant"
		# 2.***********申请人***********
		applicant = instance.applicant
		space_user_count = db.space_users.find({ space: space_id, user: applicant }).count()
		if space_user_count is 0
			throw new Meteor.Error('error!', "提交人已经被删除或不属于当前space")
		else
			return new Array(applicant)
	else if deal_type is "orgFieldRole"
		# 3.***********部门字段所属组织中的审批岗位***********
		form_id = current_flow.form
		form_rev = null
		if flow_rev is current_flow.current._id
			form_rev = current_flow.current.form_version
		else
			current_flow_version = _.find(current_flow.historys, (current_flow_history) ->
				return current_flow_history._id is flow_rev
			)
			form_rev = current_flow_version.form_version if current_flow_version

		form = db.forms.findOne(form_id)
		current_form = null
		if form_rev is form.current._id
			current_form = form.current
		else
			current_form = _.find(form.historys, (form_history) ->
				return form_history._id is form_rev
			)

		approver_org_field = current_step.approver_org_field
		form_fields = current_form.fields
		field_code = null
		_.each(form_fields, (form_field) ->
			if form_field._id is approver_org_field
				field_code = form_field.code
		)

		# 取得最新的values
		newest_values = uuflowManager.getUpdatedValues(instance)
		org_ids = new Array
		org_ids_names = new Array
		if newest_values[field_code]
			if newest_values[field_code] instanceof Array
				org_ids_names = newest_values[field_code]
			else
				org_ids_names.push(newest_values[field_code])

		# 校验org_id数组中org_id是否合法
		_.each(org_ids_names, (org) ->
			check_org_count = db.organizations.find({ _id: org["id"] }).count()
			if check_org_count is 0
				throw new Meteor.Error('error!', "组织ID不合法")
			org_ids.push(org["id"])
		)

		if current_step.approver_roles and current_step.approver_roles.length > 0
			# 检查approver_roles中role是否不存在或已经被删除
			_.each(current_step.approver_roles, (approver_role) ->
				role_count = db.flow_roles.find({ _id: approver_role }).count()
				if role_count is 0
					throw new Meteor.Error('error!', approver_role + "已经被删除")
			)
			return getHandlersManager.getHandlersByOrgsAndRoles(org_ids, current_step.approver_roles, instance.space)
		else
			throw new Meteor.Error('error!', "流程步骤" + current_step.name + "审批岗位未指定")
	else if deal_type is "orgField"
		# 4.***********部门字段所属组织中的人员***********
		form_id = current_flow.form
		form_rev = null
		if flow_rev is current_flow.current._id
			form_rev = current_flow.current.form_version
		else
			current_flow_version = _.find(current_flow.historys, (current_flow_history) ->
				return current_flow_history._id is flow_rev
			)
			form_rev = current_flow_version.form_version if current_flow_version

		form = db.forms.findOne(form_id)
		current_form = null
		if form_rev is form.current._id
			current_form = form.current
		else
			current_form = _.find(form.historys, (form_history) ->
				return form_history._id is form_rev
			)

		approver_org_field = current_step.approver_org_field
		form_fields = current_form.fields
		field_code = null
		_.each(form_fields, (form_field)->
			if form_field._id is approver_org_field
				field_code = form_field.code
		)

		# 取得最新的values
		newest_values = uuflowManager.getUpdatedValues(instance)

		org_ids = new Array
		org_ids_names = new Array
		if newest_values[field_code]
			if newest_values[field_code] instanceof Array
				org_ids_names = newest_values[field_code]
			else
				org_ids_names.push(newest_values[field_code])

		# 校验org_id数组中org_id是否合法
		_.each(org_ids_names, (org) ->
			check_org_count = db.organizations.find({ _id: org["id"] }).count()
			if check_org_count is 0
				throw new Meteor.Error('error!', "组织ID不合法")
			org_ids.push(org["id"])
		)

		# 校验org下存在处理人
		user_ids = new Array
		_.each(org_ids, (org_id) ->
			org = db.organizations.findOne({ _id: org_id }, { fields: { users: 1 } })
			org_children = db.organizations.find({ space: space_id, parents: org_id }, { fields: { users: 1 } }).fetch()
			org_children.unshift(org)
			check_orgs = org_children
			org_users = new Array
			_.each(check_orgs, (check_org_user) ->
				if check_org_user.users
					_.each(check_org_user.users, (org_user) ->
						if db.space_users.find({ space: space_id, user: org_user }).count() is 0
							throw new Meteor.Error('error!', "space下不存在此user")
					)
				user_ids = user_ids.concat(check_org_user.users)
				org_users = org_users.concat(check_org_user.users)
			)

			if org_users.length is 0
				throw new Meteor.Error('error!', "组织" + org_id + "不存在处理人")

		)

		user_ids = _.uniq(user_ids)
		return user_ids
	else if deal_type is "userFieldRole"
		# 5.***********人员字段所属组织中的审批岗位***********
		form_id = current_flow.form
		form_rev = null
		if flow_rev is current_flow.current._id
			form_rev = current_flow.current.form_version
		else
			current_flow_version = _.find(current_flow.historys, (current_flow_history) ->
				return current_flow_history._id is flow_rev
			)
			form_rev = current_flow_version.form_version if current_flow_version

		form = db.forms.findOne(form_id)
		current_form = null
		if form_rev is form.current._id
			current_form = form.current
		else
			current_form = _.find(form.historys, (form_history) ->
				return form_history._id is form_rev
			)

		approver_user_field = current_step.approver_user_field
		form_fields = current_form.fields
		field_code = null
		_.each(form_fields, (form_field) ->
			if form_field._id is approver_user_field
				field_code = form_field.code
		)

		# 取得最新的values
		newest_values = uuflowManager.getUpdatedValues(instance)
		# 获取user_id数组
		user_ids_names = new Array
		if newest_values[field_code]
			if newest_values[field_code] instanceof Array
				user_ids_names = newest_values[field_code]
			else
				user_ids_names.push(newest_values[field_code])

		# 校验user_id数组中user_id是否合法
		user_ids = new Array
		_.each(user_ids_names, (user) ->
			check_user_count = db.space_users.find({ space: space_id, user: user["id"] }).count()
			if check_user_count is 0
				throw new Meteor.Error('error!', "人员ID不合法")
			user_ids.push(user["id"])
		)

		user_ids = _.uniq(user_ids)
		if current_step.approver_roles and current_step.approver_roles.length > 0
			# 检查approver_roles中role是否不存在或已经被删除
			_.each(current_step.approver_roles, (approver_role) ->
				role_count = db.flow_roles.find({ _id: approver_role }).count()
				if role_count is 0
					throw new Meteor.Error('error!', approver_role + "已经被删除")
			)
			return getHandlersManager.getHandlersByUsersAndRoles(user_ids, current_step.approver_roles, instance.space)
		else
			throw new Meteor.Error('error!', "流程步骤" + current_step.name + "审批岗位未指定")
	else if deal_type is "userField"
		# 6.***********表单人员字段***********
		form_id = current_flow.form
		form_rev = null
		if flow_rev is current_flow.current._id
			form_rev = current_flow.current.form_version
		else
			current_flow_version = _.find(current_flow.historys, (current_flow_history) ->
				return current_flow_history._id is flow_rev
			)
			form_rev = current_flow_version.form_version if current_flow_version

		form = db.forms.findOne(form_id)
		current_form = null
		if form_rev is form.current._id
			current_form = form.current
		else
			current_form = _.find(form.historys, (form_history) ->
				return form_history._id is form_rev
			)

		approver_user_field = current_step.approver_user_field
		form_fields = current_form.fields
		field_code = null
		_.each(form_fields, (form_field)->
			if form_field._id is approver_user_field
				field_code = form_field.code
		)

		# 取得最新的values
		newest_values = uuflowManager.getUpdatedValues(instance)

		# 获取user_id数组
		user_ids_names = new Array
		if newest_values[field_code]
			if newest_values[field_code] instanceof Array
				user_ids_names = newest_values[field_code]
			else
				user_ids_names.push(newest_values[field_code])

		# 校验user_id数组中user_id是否合法
		user_ids = new Array
		_.each(user_ids_names, (user) ->
			check_user_count = db.space_users.find({ space: space_id, user: user["id"] }).count()
			if check_user_count is 0
				throw new Meteor.Error('error!', "人员ID不合法")
			user_ids.push(user["id"])
		)

		user_ids = _.uniq(user_ids)
		return user_ids
	else if deal_type is "specifyStepRole"
		# 7.***********指定步骤处理审批岗位***********
		approver_step = current_step.approver_step
		finished_traces = new Array
		_.each(instance.traces, (trace) ->
			if trace.step is approver_step
				finished_traces.push(trace)
		)
		# 根据start_date取最新的trace
		max_startDate_trace = _.max(finished_traces, (t) ->
			return t.start_date
		)

		approve_users = _.pluck(max_startDate_trace.approves, "user")

		if current_step.approver_roles
			_.each(current_step.approver_roles, (approver_role) ->
				role_count = db.flow_roles.find({ _id: approver_role }).count()
				if role_count is 0
					throw new Meteor.Error('error!', "角色已经被删除")
			)

		# 验证查到的user是否都合法
		_.each(approve_users, (approve_user) ->
			if db.space_users.find({ space: space_id, user: approve_user }).count() is 0
				throw new Meteor.Error('error!', "指定步骤的处理人已经变更")
		)

		return getHandlersManager.getHandlersByUsersAndRoles(approve_users, current_step.approver_roles, space_id)
	else if deal_type is "specifyStepUser"
		# 8.***********指定步骤处理人***********
		approver_step = current_step.approver_step
		finished_traces = new Array
		_.each(instance.traces, (trace) ->
			if trace.step is approver_step
				finished_traces.push(trace)
		)
		# 根据start_date取最新的trace
		max_startDate_trace = _.max(finished_traces, (t) ->
			return t.start_date
		)

		approve_users = _.pluck(max_startDate_trace.approves, "user")

		# 验证查到的user是否都合法
		_.each(approve_users, (approve_user)->
			check_approve_user_count = db.space_users.find({ space: space_id, user: approve_user }).count()
			if check_approve_user_count is 0
				throw new Meteor.Error('error!', "指定步骤的处理人已经变更")
		)

		approve_users = _.uniq(approve_users)
		return approve_users
	else if deal_type is "submitterRole"
		# 9.***********填单人所属组织中的审批岗位***********
		submitter = instance.submitter
		if not submitter
			# 判断提交人是否已经被删除
			submitter_user_count = db.space_users.find({ space: space_id, user: submitter }).count()
			if submitter_user_count is 0
				throw new Meteor.Error('error!', "提交人已经被删除或不属于当前工作区")
			else
				if current_step.approver_roles and current_step.approver_roles.length > 0
					# 检查approver_roles中role是否不存在或已经被删除
					_.each(current_step.approver_roles, (approver_role) ->
						role_count = db.flow_roles.find({ _id: approver_role }).count()
						if role_count is 0
							throw new Meteor.Error('error!', approver_role + "已经被删除")
					)
					return getHandlersManager.getHandlersByUserAndRoles(submitter, current_step.approver_roles, space_id)
				else
					throw new Meteor.Error('error!', "流程步骤" + current_step.name + "审批岗位未指定")
		else
			throw new Meteor.Error('error!', "申请单的提交人为空")
	else if deal_type is "submitter"
		# 10.***********提交人***********
		submitter = instance.submitter
		# 判断提交人是否已经被删除
		submitter_user_count = db.space_users.find({ space: space_id, user: submitter }).count()
		if submitter_user_count is 0
			throw new Meteor.Error('error!', "提交人已经被删除或不属于当前工作区")
		else
			return new Array(submitter)
	else if deal_type is "specifyOrg"
		# 11.***********某部门内的所有人***********
		approver_org_ids = current_step.approver_orgs
		if not approver_org_ids or approver_org_ids.length is 0
			throw new Meteor.Error('error!', "未定义用于查找下一步处理人的部门，请联系管理员调查流程图的配置是否正确")

		# 验证所指定的organization_id都存在
		valid_approver_org_ids = new Array
		_.each(approver_org_ids, (approver_org_id) ->
			if db.organizations.find({ _id: approver_org_id }).count() > 0
				valid_approver_org_ids.unshift(approver_org_id)
		)

		org_user_ids = new Array
		_.each(valid_approver_org_ids, (valid_approver_org_id) ->
			valid_approver_org = db.organizations.findOne({ _id: valid_approver_org_id }, { fields: { users: 1 } })
			if valid_approver_org.users
				org_user_ids = org_user_ids.concat(valid_approver_org.users)

			child_orgs = db.organizations.find({ space: space_id, parents: valid_approver_org_id }, { fields: { users: 1 } }).fetch()
			_.each(child_orgs, (child_org) ->
				if child_org.users
					org_user_ids = org_user_ids.concat(child_org.users)
			)
		)

		org_user_ids = _.uniq(org_user_ids)
		new_org_user_ids = new Array
		_.each(org_user_ids, (org_user_id) ->
			space_user_info_count = db.space_users.find({ space: space_id, user: org_user_id }).count()
			if space_user_info_count > 0
				new_org_user_ids.push(org_user_id)
		)

		return new_org_user_ids
	else if deal_type is "specifyUser"
		# 12.***********指定的人员***********
		approver_user_ids = current_step.approver_users
		approver_user_ids = _.uniq(approver_user_ids)
		new_approver_user_ids = new Array
		_.each(approver_user_ids, (approver_user_id) ->
			space_user_info_count = db.space_users.find({ space: space_id, user: approver_user_id }).count()
			if space_user_info_count > 0
				new_approver_user_ids.push(approver_user_id)
		)

		return new_approver_user_ids
	else if deal_type is "pickupAtRuntime"
		# 13.***********审批时指定***********
		next_step_users = new Array
		_trace = _.find(instance.traces, (_tr) ->
			return _tr.is_finished is false
		)
		_approve = _.find(_trace.approves, (_app) ->
			return _app.is_finished is false and _app.type isnt 'cc'
		)

		if _approve.next_steps
			if _approve.next_steps[0]["users"]
				next_step_users = _approve.next_steps[0]["users"]

		return next_step_users
	else if deal_type is "applicantSuperior"
		# 14.***********申请人上级主管***********
		applicantSuperiors = new Array
		_space_user = db.space_users.findOne({ space: space_id, user: instance.applicant }, { fields: { manager: 1 } })
		if _space_user.manager
			applicantSuperiors.push(_space_user.manager)

		return applicantSuperiors