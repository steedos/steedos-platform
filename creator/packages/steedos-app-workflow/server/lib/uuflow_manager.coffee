Cookies = require("cookies")

uuflowManager = {}

uuflowManager.check_authorization = (req, res) ->
	query = req.query
	userId = query["X-User-Id"]
	authToken = query["X-Auth-Token"]

	# then check cookie
	if !userId or !authToken
		cookies = new Cookies( req, res )
		userId = cookies.get("X-User-Id")
		authToken = cookies.get("X-Auth-Token")

	if not userId or not authToken
		throw new Meteor.Error 401, 'Unauthorized'

	hashedToken = Accounts._hashLoginToken(authToken)
	user = Meteor.users.findOne
		_id: userId,
		"services.resume.loginTokens.hashedToken": hashedToken

	if not user
		throw new Meteor.Error 401, 'Unauthorized'

	return user

uuflowManager.getInstance = (instance_id) ->
	ins = db.instances.findOne(instance_id)
	if not ins
		throw new Meteor.Error('error!', "申请单ID：#{instance_id}有误或此申请单已经被删除")
	return ins

uuflowManager.getSpace = (space_id) ->
	space = db.spaces.findOne(space_id)
	if not space
		throw new Meteor.Error('error!', "space_id有误或此space已经被删除")
	return space

uuflowManager.getSpaceUser = (space_id, user_id) ->
	space_user = db.space_users.findOne({ space: space_id, user: user_id })
	if not space_user
		throw new Meteor.Error('error!', "user_id对应的用户不属于当前space")
	return space_user

uuflowManager.getFlow = (flow_id) ->
	flow = db.flows.findOne(flow_id)
	if not flow
		throw new Meteor.Error('error!', "id有误或此流程已经被删除")
	return flow

uuflowManager.getSpaceUserOrgInfo = (space_user) ->
	info = new Object
	info.organization = space_user.organization
	org = db.organizations.findOne(space_user.organization, { fields: { name: 1 , fullname: 1 } })
	info.organization_name = org.name
	info.organization_fullname = org.fullname
	return info

uuflowManager.getTrace = (instance, trace_id) ->
	trace = _.find(instance.traces, (t) ->
		return t._id is trace_id
	)
	if not trace
		throw new Meteor.Error('error!', "trace_id有误")
	return trace

uuflowManager.getApprove = (trace, approve_id) ->
	approve = _.find(trace.approves, (t) ->
		return t._id is approve_id
	)
	if not approve
		throw new Meteor.Error('error!', "trace_id有误")
	return approve

uuflowManager.isTraceNotFinished = (trace) ->
	if trace.is_finished isnt false
		throw new Meteor.Error('error!', "可能已有人对此文件做了处理。请点击已审核，查看文件的最新状态")
	return

uuflowManager.isApproveNotFinished = (approve) ->
	if approve.is_finished != false
		throw new Meteor.Error('error!', "当前步骤不为未完成状态,不能进行此操作")
	return

uuflowManager.isInstancePending = (instance, lang = "zh-CN") ->
	if instance.state isnt "pending"
		throw new Meteor.Error('error!', TAPi18n.__('instance.remindMessage.update_failed', {}, lang))
	return

uuflowManager.isHandlerOrAgent = (approve, user_id) ->
	if approve.user isnt user_id and approve.agent isnt user_id
		throw new Meteor.Error('error!', "不是当前步骤对应的处理人或其代理人，不能进行此操作")

uuflowManager.isInstanceDraft = (instance, lang = "zh-CN") ->
	if instance.state isnt "draft"
		throw new Meteor.Error('error!', TAPi18n.__('instance.remindMessage.update_failed', {}, lang))

uuflowManager.isInstanceSubmitter = (instance, current_user_id) ->
	if instance.submitter isnt current_user_id
		throw new Meteor.Error('error!', '当前用户不是申请单对应的提交人,不能进行此操作')

uuflowManager.isInstanceSubmitterOrApplicantOrSpaceAdmin = (instance, current_user_id, space) ->
	if instance.submitter isnt current_user_id and instance.applicant isnt current_user_id && not space.admins.includes(current_user_id)
		throw new Meteor.Error('error!', "当前用户不是申请单对应的提交人或申请人或工作区管理员")

uuflowManager.getStep = (instance, flow, step_id) ->
	flow_rev = instance.flow_version
	isExistStep = null
	if flow.current._id is flow_rev
		isExistStep = _.find(flow.current.steps, (step) ->
			return step._id is step_id
		)
	else
		_.each(flow.historys, (history) ->
			if history._id is flow_rev
				isExistStep = _.find(history.steps, (step) ->
					return step._id is step_id
				)
		)

	if not isExistStep
		throw new Meteor.Error('error!', "不能获取step")

	return isExistStep

uuflowManager.isJudgeLegal = (judge) ->
	if judge isnt "approved" and judge isnt "rejected" and judge isnt "readed" and judge isnt "submitted"
		throw new Meteor.Error('error!', "judge有误")
	return

uuflowManager.isSpaceAdmin = (space_id, user_id) ->
	space = db.spaces.findOne({ _id: space_id }, { fields: { admins: 1 } })
	if not space.admins.includes(user_id)
		throw new Meteor.Error('error!', "当前用户不是工作区管理员,不能进行此操作")
	return

uuflowManager.getUser = (user_id) ->
	user = db.users.findOne(user_id)
	if not user
		throw new Meteor.Error('error!', "用户ID有误或此用户已经被删除")
	return user

uuflowManager.getUserOrganization = (user_id, space_id) ->
	org = db.organizations.findOne({ space: space_id, users: user_id })
	return org

uuflowManager.getUserRoles = (user_id, space_id) ->
	role_names = new Array
	positions = db.flow_positions.find({ space: space_id, users: user_id }, { fields: { role: 1 } }).fetch()
	_.each(positions, (position) ->
		role = db.flow_roles.findOne({ _id: position.role }, { fields: { name: 1 } })
		if role
			role_names.push(role.name)
	)
	return role_names

uuflowManager.isFlowEnabled = (flow) ->
	if flow.state isnt "enabled"
		throw new Meteor.Error('error!', "流程未启用,操作失败")

uuflowManager.isFlowSpaceMatched = (flow, space_id) ->
	if flow.space isnt space_id
		throw new Meteor.Error('error!', "流程和工作区ID不匹配")

# 当前节点为条件节点类型时，根据条件计算出后续步骤
uuflowManager.calculateCondition = (values, condition_str) ->
	try
		__values = values

		sum = (subform_field) ->
			if not subform_field
				throw new Meteor.Error('error!', "参数为空")
			if not subform_field instanceof Array
				throw new Meteor.Error('error!', "参数不是数组类型")
			sum_field_value = 0
			_.each(subform_field, (field_value) ->
				field_value = Number(String(field_value))
				sum_field_value += field_value
			)
			return sum_field_value

		average = (subform_field) ->
			if not subform_field
				throw new Meteor.Error('error!', "参数为空")
			if not subform_field instanceof Array
				throw new Meteor.Error('error!', "参数不是数组类型")
			return sum(subform_field) / count(subform_field)

		count = (subform_field) ->
			if not subform_field
				throw new Meteor.Error('error!', "参数为空")
			subform_field.length

		max = (subform_field) ->
			if not subform_field
				throw new Meteor.Error('error!', "参数为空")
			if not subform_field instanceof Array
				throw new Meteor.Error('error!', "参数不是数组类型")
			sub_field = new Array
			_.each(subform_field, (field_value) ->
				sub_field.push(Number(String(field_value)))
			)
			return _.max(sub_field)

		min = (subform_field) ->
			if not subform_field
				throw new Meteor.Error('error!', "参数为空")
			if not subform_field instanceof Array
				throw new Meteor.Error('error!', "参数不是数组类型")
			sub_field = new Array
			_.each(subform_field, (field_value) ->
				sub_field.push(Number(String(field_value)))
			)
			return _.min(sub_field)

		eval(condition_str)
	catch e
		console.error e.stack
		return false


# 代码结构
# 子表
#   数值
#   字符
# 选组
#   多选
#   单选
# 选人
#   多选
#   单选
# 数值
# 字符
uuflowManager.setFormFieldVariable = (fields, __values, space_id) ->
	try
		_.each(fields, (field) ->
			if field.type is "table" #子表
				#得到已引用的子表字段
				subform_fields_all = field.fields
				_subform_values = new Object
				_.each(subform_fields_all, (current_field) ->
					values_arr = new Array
					if ["number", "percentage", "currency"].includes(current_field["type"])
						_.each(__values[field.code], (sub_field) ->
							values_arr.push(sub_field[current_field["code"]])
						)
					else if current_field["type"] is "checkbox"
						_.each(__values[field.code], (sub_field) ->
							if sub_field[current_field["code"]] is "true"
								values_arr.push(true)
							else if sub_field[current_field["code"]] is "false"
								values_arr.push(false)
						)
					else
						_.each(__values[field.code], (sub_field) ->
							if sub_field[current_field["code"]]
								values_arr.push(sub_field[current_field["code"]])
							else
								values_arr.push("")
						)

					__values[current_field["code"]] = values_arr
				)
			else if field.type is "group" #选组
				if field.is_multiselect
					if __values[field.code] and __values[field.code].length > 0
						group_id = new Array
						group_name = new Array
						group_fullname = new Array
						_.each(__values[field.code], (group) ->
							group_id.push(group["id"])
							group_name.push(group["name"])
							group_fullname.push(group["fullname"])
						)
						__values[field.code] = new Object
						__values[field.code]["id"] = group_id
						__values[field.code]["name"] = group_name
						__values[field.code]["fullname"] = group_fullname
			else if field.type is "user" #选人
				if field.is_multiselect
					if __values[field.code] and __values[field.code].length > 0
						user_id = new Array
						user_name = new Array
						organization = new Object
						organization["user_organization_fullname"] = new Array
						organization["user_organization_name"] = new Array
						user_roles = new Array

						_.each(__values[field.code], (select_user) ->
							user_id.push(select_user["id"])
							user_name.push(select_user["name"])
							organization_selectuser = uuflowManager.getUserOrganization(select_user["id"], space_id)
							role_selectuser = uuflowManager.getUserRoles(select_user["id"], space_id)
							if organization_selectuser
								organization["user_organization_fullname"].push(organization_selectuser.fullname)
								organization["user_organization_name"].push(organization_selectuser.name)
							if role_selectuser
								user_roles = user_roles or role_selectuser
						)

						__values[field.code] = new Object
						__values[field.code]["id"] = user_id
						__values[field.code]["name"] = user_name
						__values[field.code]["organization"] = organization
						__values[field.code]["roles"] = roles
				else
					if __values[field.code]
						organization_selectuser = uuflowManager.getUserOrganization(__values[field.code]["id"], space_id)
						role_selectuser = uuflowManager.getUserRoles(__values[field.code]["id"], space_id)
						if organization_selectuser
							__values[field.code]["organization"] = new Object
							__values[field.code]["organization"]["fullname"] = organization_selectuser.fullname
							__values[field.code]["organization"]["name"] = organization_selectuser.name

						__values[field.code]["roles"] = role_selectuser

			else if ["number", "percentage", "currency"].includes(field.type) #数值类型
				if __values[field.code]
					__values[field.code] = Number(__values[field.code])
				else
					__values[field.code] = 0
			else if field.type is "checkbox" #勾选框
				if __values[field.code] is "true"
					__values[field.code] = true
				else if __values[field.code] is "false"
					__values[field.code] = false
		)
	catch e
		console.error e.stack

# 应用场景：此函数用于返回备选的所有下一步的id
uuflowManager.getNextSteps = (instance, flow, step, judge) ->
	step_type = step.step_type
	nextSteps = new Array
	if step_type is "condition"
		#step的lines中查询出state=submitted且instance.fields满足其条件的line
		__values = uuflowManager.getUpdatedValues(instance)
		current_approve = null
		# 获取当前Approve
		traces = instance.traces
		_.each traces, (trace) ->
			if trace.is_finished is false
				current_approve = trace.approves[0]

		start_approve = null
		# 获取开始节点Approve
		_.each traces, (trace) ->
			if not trace.previous_trace_ids or trace.previous_trace_ids.length is 0
				start_approve = trace.approves[0]

		# 申请人所在组织全名称
		applicant_organization_fullname = instance.applicant_organization_fullname
		# 申请人所在组织的名称
		applicant_organization_name = instance.applicant_organization_name
		# 申请人的审批岗位
		applicant_roles = uuflowManager.getUserRoles(instance.applicant, instance.space)
		# 申请人的全名
		applicant_name = instance.applicant_name
		# 填单人所在组织全名称
		submitter_organization_fullname = start_approve.handler_organization_fullname
		# 填单人所在组织的名称
		submitter_organization_name = start_approve.handler_organization_name
		# 填单人的审批岗位
		submitter_roles = uuflowManager.getUserRoles(start_approve.handler, instance.space)
		# 填单人的全名
		submitter_name = start_approve.handler_name
		# 处理人所在组织全名称
		approver_organization_fullname = current_approve.handler_organization_fullname
		# 处理人所在组织的名称
		approver_organization_name = current_approve.handler_organization_name
		# 处理人的审批岗位
		approver_roles = uuflowManager.getUserRoles(current_approve.handler, instance.space)
		# 处理人的全名
		approver_name = current_approve.handler_name

		# Condition中涉及的一些变量
		__values["applicant"] = new Object
		__values["applicant"]["roles"] = applicant_roles
		__values["applicant"]["name"] = applicant_name
		__values["applicant"]["organization"] = new Object
		__values["applicant"]["organization"]["fullname"] = applicant_organization_fullname
		__values["applicant"]["organization"]["name"] = applicant_organization_name

		__values["submitter"] = new Object
		__values["submitter"]["roles"] = submitter_roles
		__values["submitter"]["name"] = submitter_name
		__values["submitter"]["organization"] = new Object
		__values["submitter"]["organization"]["fullname"] = submitter_organization_fullname
		__values["submitter"]["organization"]["name"] = submitter_organization_name

		__values["approver"] = new Object
		__values["approver"]["roles"] = approver_roles
		__values["approver"]["name"] = approver_name
		__values["approver"]["organization"] = new Object
		__values["approver"]["organization"]["fullname"] = approver_organization_fullname
		__values["approver"]["organization"]["name"] = approver_organization_name

		# 获取申请单对应表单
		form = db.forms.findOne(instance.form)
		formVersion = null
		if instance.form_version is form.current._id
			formVersion = form.current
		else
			formVersion = _.find(form.historys, (history) ->
				return instance.form_version is history._id
			)

		# 定义表单中字段
		uuflowManager.setFormFieldVariable(formVersion.fields, __values, instance.space)
		# 匹配包括花括号自身在内的所有符号
		reg = /(\{[^{}]*\})/
		prefix = "__values"
		_.each step.lines, (step_line) ->
			step_line_condition = step_line.condition.replace reg, (vowel) ->
				return prefix + vowel.replace(/\{\s*/, "[\"").replace(/\s*\}/, "\"]").replace(/\s*\.\s*/g, "\"][\"")
			if step_line.state is "submitted" and uuflowManager.calculateCondition(__values, step_line_condition)
				if step_line.state is "submitted"
					nextSteps.push(step_line.to_step)

	else if step_type is "end"
		return new Array
	else if step_type is "submit" or step_type is "start" or step_type is "counterSign"
		lines = _.filter(step.lines, (line) ->
			return line.state is "submitted"
		)
		if lines.length is 0
			throw new Meteor.Error('error!', "流程的连线配置有误")
		else
			nextSteps = _.pluck(lines, 'to_step')
	else if step_type is "sign"
		if judge is "approved"
			lines = _.filter(step.lines, (line) ->
				return line.state is "approved"
			)
			if lines.length is 0
				throw new Meteor.Error('error!', "流程的连线配置有误")
			else
				nextSteps = _.pluck(lines, 'to_step')
		else if judge is "rejected"
			lines = _.filter(step.lines, (line) ->
				return line.state is "rejected"
			)
			rejectedSteps = _.pluck(lines, 'to_step')
			# 取出instance的traces,取出所有历史trace中(is_finished=ture)的step_id
			trace_steps = new Array
			_.each(instance.traces, (trace) ->
				if trace.is_finished is true
					flowVersions = new Array
					flowVersions.push(flow.current)
					if flow.historys
						flowVersions = flowVersions.concat(flow.historys)
					_.each(flowVersions, (flowVer) ->
						if flowVer._id is instance.flow_version
							_.each(flowVer.steps, (flow_ver_step) ->
								if flow_ver_step._id is trace.step and flow_ver_step.step_type isnt "condition"
									trace_steps.push(trace.step)
							)
					)
			)
			# 取出flow,取到instance对应的版本的开始结点和结束结点的step_id
			flow_steps = new Array
			if instance.flow_version is flow.current._id
				_.each(flow.current.steps, (flow_step) ->
					if flow_step.step_type is "start" or flow_step.step_type is "end"
						flow_steps.push(flow_step._id)
				)
			else
				_.each(flow.historys, (history) ->
					_.each(history.steps, (history_step) ->
						if history_step.step_type is "start" or history_step.step_type is "end"
							flow_steps.push(history_step._id)
					)
				)

			nextSteps = _.union(rejectedSteps, trace_steps, flow_steps)

	# 若下一步中包含 条件节点 则 继续取得 条件节点的 后续步骤
	version_steps = new Object
	flowVersions = new Array
	flowVersions.push(flow.current)
	if flow.historys
		flowVersions = flowVersions.concat(flow.historys)

	_.each(flowVersions, (flowVer) ->
		if flowVer._id is instance.flow_version
			_.each(flowVer.steps, (flow_ver_step) ->
				version_steps[flow_ver_step._id] = flow_ver_step
			)
	)

	nextSteps = _.uniq(nextSteps)
	_.each(nextSteps, (next_step_id) ->
		_next_step = version_steps[next_step_id]
		if _next_step.step_type is "condition"
			if _next_step.lines
				_.each(_next_step.lines, (line) ->
					if line.to_step
						nextSteps.push(line.to_step)
				)
	)

	nextSteps = _.uniq(nextSteps)
	return nextSteps

uuflowManager.getUpdatedValues = (instance) ->

	# 取得最新的approve
	trace_approve = null
	_.each(instance.traces, (trace) ->
		if trace.is_finished is false
			trace_approve = _.find(trace.approves, (approve) ->
				return approve.is_finished is false and approve.type isnt 'cc' and approve.type isnt 'distribute'
			)
	)
	# 取得最新的values
	newest_values = null
	if not instance.values
		newest_values = trace_approve?.values
	else if not trace_approve?.values
		newest_values = instance.values
	else
		newest_values =  _.extend(_.clone(instance.values), trace_approve.values)
	return newest_values

uuflowManager.getForm = (form_id) ->
	form = db.forms.findOne(form_id)
	if not form
		throw new Meteor.Error('error!', '表单ID有误或此表单已经被删除')

	return form

uuflowManager.getFormVersion = (form, form_version) ->
	form_v = null
	if form_version is form.current._id
		form_v = form.current
	else
		form_v = _.find(form.historys, (form_h) ->
			return form_version is form_h._id
		)

	if not form_v
		throw new Meteor.Error('error!', '未找到表单对应的版本')

	return form_v

uuflowManager.getCategory = (category_id) ->
	return db.categories.findOne(category_id)

uuflowManager.getInstanceName = (instance, vals) ->
	values = _.clone(vals || instance.values) || {}

	applicant = WorkflowManager.getFormulaUserObject(instance.space, instance.applicant)

	values["applicant"] = applicant

	values["applicant_name"] = instance.applicant_name
	values["applicant_organization"] = instance.applicant_organization
	values["applicant_organization_fullname"] = instance.applicant_organization_fullname
	values["applicant_organization_name"] = instance.applicant_organization_name

	values["submit_date"] = moment(instance.submit_date).utcOffset(0, false).format("YYYY-MM-DD")

	form_id = instance.form
	flow = uuflowManager.getFlow(instance.flow)

	default_value = flow.name + ' ' + instance.code
	form_version = instance.form_version
	form = uuflowManager.getForm(form_id)
	form_v = uuflowManager.getFormVersion(form, form_version)
	name_forumla = form_v.name_forumla
	rev = default_value

	if name_forumla

		if name_forumla.indexOf("{applicant.") > -1
			iscript = name_forumla.replace(/\{applicant./g, "(applicant.").replace(/\}/g, " || '')")

		iscript = name_forumla.replace(/\{/g, "(values.").replace(/\}/g, " || '')")

#		console.log(iscript)

		try

			rev = eval(iscript) || default_value

			#文件名中不能包含特殊字符: '? * : " < > \ / |'， 直接替换为空
			rev = rev.replace(/\?|\*|\:|\"|\<|\>|\\|\/|\|/g, "")

		catch e
			console.log e

	return rev.trim()

uuflowManager.getApproveValues = (approve_values, permissions, form_id, form_version) ->
	# 如果permissions为null，则approve_values为{}
	if permissions is null
		approve_values = new Object
	else
		# 获得instance中的所有字段
		instance_form = db.forms.findOne(form_id)
		form_v = null
		if form_version is instance_form.current._id
			form_v = instance_form.current
		else
			form_v = _.find(instance_form.historys, (form_h) ->
				return form_version is form_h._id
			)

		_.each(form_v.fields, (field) ->
			if field.type is "table"
#				_.each(field.fields, (tableField)->
#					if approve_values[field.code] isnt null
#						_.each(approve_values[field.code], (tableValue)->
#							if !tableField.formula && (permissions[tableField.code] is null or permissions[tableField.code] isnt "editable")
#								delete tableValue[tableField.code]
#						)
#				)
				return
			else if field.type is "section"
				_.each(field.fields, (sectionField) ->
					if !sectionField.formula && (permissions[sectionField.code] is null or permissions[sectionField.code] isnt "editable")
						delete approve_values[sectionField.code]
				)
			else
				if !field.formula && (permissions[field.code] is null or permissions[field.code] isnt "editable")
					delete approve_values[field.code]
		)
	return approve_values

uuflowManager.workflow_engine = (approve_from_client, current_user_info, current_user)->
	instance_id = approve_from_client["instance"]
	trace_id = approve_from_client["trace"]
	approve_id = approve_from_client["_id"]
	values = approve_from_client["values"]
	if not values then values = new Object
	next_steps = approve_from_client["next_steps"]
	judge = approve_from_client["judge"]
	description = approve_from_client["description"]
	geolocation = approve_from_client["geolocation"]

	setObj = new Object

	# 获取一个instance
	instance = uuflowManager.getInstance(instance_id)
	space_id = instance.space
	flow_id = instance.flow
	# 获取一个space
	space = uuflowManager.getSpace(space_id)
	applicant_id = instance.applicant
	# 校验申请人user_accepted = true
	checkApplicant = uuflowManager.getSpaceUser(space_id, applicant_id)
	# 获取一个flow
	flow = uuflowManager.getFlow(flow_id)
	# 获取一个space下的一个user
	space_user = uuflowManager.getSpaceUser(space_id, current_user)
	# 获取space_user所在的部门信息
	space_user_org_info = uuflowManager.getSpaceUserOrgInfo(space_user)
	# 获取一个trace
	trace = uuflowManager.getTrace(instance, trace_id)
	# 获取一个approve
	approve = uuflowManager.getApprove(trace, approve_id)
	# 判断一个trace是否为未完成状态
	uuflowManager.isTraceNotFinished(trace)
	# 判断一个approve是否为未完成状态
	uuflowManager.isApproveNotFinished(approve)
	# 判断一个instance是否为审核中状态
	uuflowManager.isInstancePending(instance)
	# 判断当前用户是否approve 对应的处理人或代理人
	uuflowManager.isHandlerOrAgent(approve, current_user)

	# 先执行审核状态暂存的操作
	# ================begin================
	step = uuflowManager.getStep(instance, flow, trace.step)
	step_type = step.step_type
	instance_trace = _.find(instance.traces, (trace)->
		return trace._id is trace_id
	)

	trace_approves = instance_trace.approves

	i = 0
	while i < trace_approves.length
		if trace_approves[i]._id is approve_id
			key_str = "traces.$.approves." + i + "."
			setObj[key_str + "geolocation"] = geolocation
			if step_type is "condition"
			else if step_type is "start" or step_type is "submit"
				setObj[key_str + "judge"] = "submitted"
				setObj[key_str + "description"] = description
			else if step_type is "sign" or step_type is "counterSign"
				# 如果是会签并且前台没有显示核准驳回已阅的radio则给judge默认submitted
				if step_type is "counterSign" and not judge
					judge = 'submitted'
				# 判断前台传的judge是否合法
				uuflowManager.isJudgeLegal(judge)
				setObj[key_str + "judge"] = judge
				setObj[key_str + "description"] = description

			setObj[key_str + "next_steps"] = next_steps
			setObj[key_str + "is_read"] = true
			if not trace_approves[i].read_date
				setObj[key_str + "read_date"] = new Date
			# 调整approves 的values 。删除values中在当前步骤中没有编辑权限的字段值
			setObj[key_str + "values"] = uuflowManager.getApproveValues(values, step["permissions"], instance.form, instance.form_version)

			# 更新instance记录
			setObj.modified = new Date
			setObj.modified_by = current_user

			db.instances.update({_id: instance_id, "traces._id": trace_id}, {$set: setObj})
		i++


	# ================end================
	instance = uuflowManager.getInstance(instance_id)
	# 防止此时的instance已经被处理
	# 获取一个trace
	trace = uuflowManager.getTrace(instance, trace_id)
	# 获取一个approve
	approve = uuflowManager.getApprove(trace, approve_id)
	# 判断一个trace是否为未完成状态
	uuflowManager.isTraceNotFinished(trace)
	# 判断一个approve是否为未完成状态
	uuflowManager.isApproveNotFinished(approve)
	# 判断一个instance是否为审核中状态
	uuflowManager.isInstancePending(instance)
	# 判断当前用户是否approve 对应的处理人或代理人
	uuflowManager.isHandlerOrAgent(approve, current_user)
	updateObj = new Object

	if next_steps is null or next_steps.length is 0
		throw new Meteor.Error('error!', '还未指定下一步和处理人，操作失败')
	else
		# 验证next_steps里面是否只有一个step
		if next_steps.length > 1
			throw new Meteor.Error('error!', '不能指定多个后续步骤')
		else
			# 校验下一步处理人user_accepted = true
			_.each next_steps[0]["users"], (next_step_user) ->
				checkSpaceUser = uuflowManager.getSpaceUser(space_id, next_step_user)

		if step_type is "start" or step_type is "submit" or step_type is "condition"
			updateObj = uuflowManager.engine_step_type_is_start_or_submit_or_condition(instance_id, trace_id, approve_id, next_steps, space_user_org_info, judge, instance, flow, step, current_user, current_user_info)
		else if step_type is "sign"
			updateObj = uuflowManager.engine_step_type_is_sign(instance_id, trace_id, approve_id, next_steps, space_user_org_info, judge, instance, flow, step, current_user, current_user_info, description)
		else if step_type is "counterSign"
			updateObj = uuflowManager.engine_step_type_is_counterSign(instance_id, trace_id, approve_id, next_steps, space_user_org_info, judge, instance, flow, step, current_user, current_user_info)
		else if step_type is "end"
			throw new Meteor.Error('error!', 'end结点出现approve，服务器错误')

		form = db.forms.findOne(instance.form)
		updateObj.keywords = uuflowManager.caculateKeywords(updateObj.values, form, instance.form_version)
		db.instances.update({_id: instance_id}, {$set: updateObj})

	instance = uuflowManager.getInstance(instance_id)
	instance_trace = _.find(instance.traces, (trace)->
		return trace._id is trace_id
	)
	next_step_id = next_steps[0]["step"]
	next_step = uuflowManager.getStep(instance, flow, next_step_id)
	next_step_type = next_step.step_type
	#发送消息开始
	if "completed" is instance.state
		if "approved" is instance.final_decision
			#通知填单人、申请人
			pushManager.send_instance_notification("approved_completed_applicant", instance, description, current_user_info)
		else if "rejected" is instance.final_decision
			#通知填单人、申请人
			pushManager.send_instance_notification("rejected_completed_applicant", instance, description, current_user_info)
		else
			#通知填单人、申请人
			pushManager.send_instance_notification("submit_completed_applicant", instance, description, current_user_info)

	else if "pending" is instance.state
		if "rejected" is instance_trace.judge and instance_trace.is_finished is true
			if 'start' is next_step_type
				#驳回给申请人时，发送短消息
				pushManager.send_instance_notification("submit_pending_rejected_applicant_inbox", instance, description, current_user_info)
			else
				#通知填单人、申请人
				pushManager.send_instance_notification("submit_pending_rejected_applicant", instance, description, current_user_info)
				# 发送消息给下一步处理人
				pushManager.send_instance_notification("submit_pending_rejected_inbox", instance, description, current_user_info)
		else if instance_trace.is_finished is false
			# 会签 并且当前trace未结束
			# 发送push消息 给 inbox_users

		else
			# 发送消息给下一步处理人
			pushManager.send_instance_notification("submit_pending_inbox", instance, description, current_user_info)
	#发送消息给当前用户
	pushManager.send_message_current_user(current_user_info)

	# 如果已经配置webhook并已激活则触发
	to_users = instance.inbox_users
	last_trace = _.last(instance.traces)
	last_step = uuflowManager.getStep(instance, flow, last_trace.step)
	last_step_type = last_step.step_type
	if last_step_type is "counterSign" and _.where(last_trace.approves, {is_finished: true}).length > 0
		to_users = []

	pushManager.triggerWebhook(flow_id, instance, approve_from_client, 'engine_submit', current_user, to_users)

	# 判断申请单是否分发，分发文件结束提醒发起人
	uuflowManager.distributedInstancesRemind(instance)

	return instance


uuflowManager.engine_step_type_is_start_or_submit_or_condition = (instance_id, trace_id, approve_id, next_steps, space_user_org_info, judge, instance, flow, step, current_user, current_user_info) ->
	setObj = new Object
	space_id = instance.space
	# 验证next_steps.step是否合法
	nextSteps = uuflowManager.getNextSteps(instance, flow, step, "")
	# 判断next_steps.step是否在nextSteps中,若不在则不合法
	_.each next_steps, (approve_next_step) ->
		if not nextSteps.includes approve_next_step["step"]
			throw new Meteor.Error('error!', "approve中next_steps.step：" + approve_next_step.step + " 不合法")

	# 若合法,执行流转
	next_step_id = next_steps[0]["step"]
	next_step = uuflowManager.getStep(instance, flow, next_step_id)
	next_step_type = next_step.step_type
	next_step_name = next_step.name
	# 判断next_step是否为结束结点
	if next_step_type is "end"
		# 若是结束结点
		instance_traces = instance.traces
		i = 0
		while i < instance_traces.length
			if instance_traces[i]._id is trace_id
				# 更新当前trace记录
				instance_traces[i].is_finished = true
				instance_traces[i].finish_date = new Date
				instance_traces[i].judge = judge
				h = 0
				while h < instance_traces[i].approves.length
					if instance_traces[i].approves[h]._id is approve_id
						# 更新当前trace.approve记录
						instance_traces[i].approves[h].is_finished = true
						instance_traces[i].approves[h].handler = current_user
						instance_traces[i].approves[h].handler_name = current_user_info.name
						instance_traces[i].approves[h].finish_date = new Date
						instance_traces[i].approves[h].handler_organization = space_user_org_info["organization"]
						instance_traces[i].approves[h].handler_organization_name = space_user_org_info["organization_name"]
						instance_traces[i].approves[h].handler_organization_fullname = space_user_org_info["organization_fullname"]
						# 调整approves 的values 。删除values中在当前步骤中没有编辑权限的字段值
						# instance_traces[i].approves[h].values = uuflowManager.getApproveValues(instance_traces[i].approves[h].values, step["permissions"], instance.form, instance.form_version)
						instance_traces[i].approves[h].cost_time = instance_traces[i].approves[h].finish_date - instance_traces[i].approves[h].start_date
					h++
			i++

		# 插入下一步trace记录
		newTrace = new Object
		newTrace._id = new Mongo.ObjectID()._str
		newTrace.instance = instance_id
		newTrace.previous_trace_ids = [trace_id]
		newTrace.is_finished = true
		newTrace.step = next_step_id
		newTrace.name = next_step_name
		newTrace.start_date = new Date
		newTrace.finish_date = new Date

		# 更新instance记录
		setObj.state = "completed"
		setObj.modified = new Date
		setObj.modified_by = current_user
		setObj.values = uuflowManager.getUpdatedValues(uuflowManager.getInstance(instance_id))
		instance.values = setObj.values
		setObj.name = uuflowManager.getInstanceName(instance)

		instance_trace = _.find(instance_traces, (trace) ->
			return trace._id is trace_id
		)
		trace_approve = _.find(instance_trace.approves, (approve) ->
			return approve._id is approve_id
		)
		outbox_users = instance.outbox_users
		outbox_users.unshift(trace_approve.handler)
		outbox_users.unshift(trace_approve.user)
		setObj.outbox_users = _.uniq(outbox_users)

		instance_traces.push(newTrace)
		setObj.traces = instance_traces
		setObj.inbox_users = []
		setObj.finish_date = new Date
		setObj.current_step_name = next_step_name
		setObj.final_decision = 'approved'
		setObj.current_step_auto_submit = false
	else
		# 若不是结束结点
		# 先判断nextsteps.step.users是否为空
		next_step_users = next_steps[0]["users"]
		if next_step_users is null or next_step_users.length is 0
			throw new Meteor.Error('error!', "未指定下一步处理人")
		else
			if next_step_users.length > 1 and next_step.step_type isnt "counterSign"
				throw new Meteor.Error('error!', "不能指定多个处理人")
			else
				# 验证next_user是否合法，调用getHandlersManager.getHandlers(:instance_id,当前trace对应的step_id),判断next_user是否在其返回的结果中
				next_user_ids = getHandlersManager.getHandlers(instance_id, next_step_id)
				if _.difference(next_step_users, next_user_ids).length > 0
					throw new Meteor.Error('error!', "指定的下一步处理人有误")
				else
					# 若合法，执行流转操作
					instance_traces = instance.traces
					i = 0
					while i < instance_traces.length
						if instance_traces[i]._id is trace_id
							# 更新当前trace记录
							instance_traces[i].is_finished = true
							instance_traces[i].finish_date = new Date
							instance_traces[i].judge = judge
							h = 0
							while h < instance_traces[i].approves.length
								if instance_traces[i].approves[h]._id is approve_id
									# 更新当前trace.approve记录
									instance_traces[i].approves[h].is_finished = true
									instance_traces[i].approves[h].handler = current_user
									instance_traces[i].approves[h].handler_name = current_user_info.name
									instance_traces[i].approves[h].finish_date = new Date
									instance_traces[i].approves[h].handler_organization = space_user_org_info["organization"]
									instance_traces[i].approves[h].handler_organization_name = space_user_org_info["organization_name"]
									instance_traces[i].approves[h].handler_organization_fullname = space_user_org_info["organization_fullname"]
									# 调整approves 的values 。删除values中在当前步骤中没有编辑权限的字段值
									# instance_traces[i].approves[h].values = uuflowManager.getApproveValues(instance_traces[i].approves[h].values, step["permissions"], instance.form, instance.form_version)
									instance_traces[i].approves[h].cost_time = instance_traces[i].approves[h].finish_date - instance_traces[i].approves[h].start_date
								h++
						i++

					# 插入下一步trace记录
					newTrace = new Object
					newTrace._id = new Mongo.ObjectID()._str
					newTrace.instance = instance_id
					newTrace.previous_trace_ids = [trace_id]
					newTrace.is_finished = false
					newTrace.step = next_step_id
					newTrace.name = next_step_name
					newTrace.start_date = new Date
					newTrace.due_date = uuflowManager.getDueDate(next_step.timeout_hours)
					newTrace.approves = new Array

					updated_values = uuflowManager.getUpdatedValues(uuflowManager.getInstance(instance_id))
					_.each next_step_users, (next_step_user_id, idx) ->
						# 插入下一步trace.approve记录
						newApprove = new Object
						newApprove._id = new Mongo.ObjectID()._str
						newApprove.instance = instance_id
						newApprove.trace = newTrace._id
						newApprove.is_finished = false
						newApprove.user = next_step_user_id

						user_info = db.users.findOne({ _id: next_step_user_id }, { fields: { name: 1 } })
						newApprove.user_name = user_info.name

						handler_id = next_step_user_id
						handler_info = user_info
						agent = uuflowManager.getAgent(space_id, next_step_user_id)
						if agent
							next_step_users[idx] = agent
							handler_id = agent
							handler_info = db.users.findOne({ _id: agent }, { fields: { name: 1 } })
							newApprove.agent = agent

						newApprove.handler = handler_id
						newApprove.handler_name = handler_info.name

						next_step_space_user = db.space_users.findOne({ space: space_id, user: handler_id })
						# 获取next_step_user所在的部门信息
						next_step_user_org_info = uuflowManager.getSpaceUserOrgInfo(next_step_space_user)
						newApprove.handler_organization = next_step_user_org_info["organization"]
						newApprove.handler_organization_name = next_step_user_org_info["organization_name"]
						newApprove.handler_organization_fullname = next_step_user_org_info["organization_fullname"]
						newApprove.start_date = new Date
						newApprove.due_date = newTrace.due_date
						newApprove.is_read = false
						newApprove.is_error = false
						newApprove.values = new Object
						uuflowManager.setRemindInfo(updated_values, newApprove)
						newTrace.approves.push(newApprove)

					# 更新instance记录
					setObj.state = "pending"
					setObj.modified = new Date
					setObj.modified_by = current_user
					setObj.values = updated_values
					instance.values = setObj.values
					setObj.name = uuflowManager.getInstanceName(instance)

					instance_trace = _.find(instance_traces, (trace) ->
						return trace._id is trace_id
					)
					trace_approve = _.find(instance_trace.approves, (approve) ->
						return approve._id is approve_id
					)
					outbox_users = instance.outbox_users
					outbox_users.unshift(trace_approve.user)
					outbox_users.unshift(trace_approve.handler)
					setObj.outbox_users = _.uniq(outbox_users)
					setObj.inbox_users = next_step_users

					instance_traces.push(newTrace)
					setObj.traces = instance_traces
					setObj.current_step_name = next_step_name

					setObj.current_step_auto_submit = uuflowManager.getCurrentStepAutoSubmit(flow.timeout_auto_submit, next_step.lines)

	return setObj

uuflowManager.engine_step_type_is_sign = (instance_id, trace_id, approve_id, next_steps, space_user_org_info, judge, instance, flow, step, current_user, current_user_info, description) ->
	setObj = new Object
	space_id = instance.space
	# 验证approve的judge是否为空

	if not judge
		throw new Meteor.Error('error!', "单签结点还未选择处理意见，操作失败")
	else
		if judge is "approved"
			# 验证next_steps.step是否合法,判断next_steps.step是否在其中
			nextSteps = uuflowManager.getNextSteps(instance, flow, step, "approved")

			# 判断next_steps.step是否在nextSteps中,若不在则不合法
			_.each(next_steps, (approve_next_step) ->
				if not nextSteps.includes(approve_next_step["step"])
					throw new Meteor.Error('error!', "指定的下一步有误")
			)
			# 若合法,执行流转
			next_step_id = next_steps[0]["step"]
			next_step = uuflowManager.getStep(instance, flow, next_step_id)
			next_step_type = next_step["step_type"]
			next_step_name = next_step["name"]
			# 判断next_step是否为结束结点
			if next_step_type is "end"
				# 若是结束结点
				instance_traces = instance.traces
				i = 0
				while i < instance_traces.length
					if instance_traces[i]._id is trace_id
						# 更新当前trace记录
						instance_traces[i].is_finished = true
						instance_traces[i].finish_date = new Date
						instance_traces[i].judge = judge
						h = 0
						while h < instance_traces[i].approves.length
							if instance_traces[i].approves[h]._id is approve_id
								# 更新当前trace.approve记录
								instance_traces[i].approves[h].is_finished = true
								instance_traces[i].approves[h].handler = current_user
								instance_traces[i].approves[h].handler_name = current_user_info.name
								instance_traces[i].approves[h].finish_date = new Date
								instance_traces[i].approves[h].handler_organization = space_user_org_info["organization"]
								instance_traces[i].approves[h].handler_organization_name = space_user_org_info["organization_name"]
								instance_traces[i].approves[h].handler_organization_fullname = space_user_org_info["organization_fullname"]
								instance_traces[i].approves[h].cost_time = instance_traces[i].approves[h].finish_date - instance_traces[i].approves[h].start_date
							h++
					i++

				# 插入下一步trace记录
				newTrace = new Object
				newTrace._id = new Mongo.ObjectID()._str
				newTrace.instance = instance_id
				newTrace.previous_trace_ids = [trace_id]
				newTrace.is_finished = true
				newTrace.step = next_step_id
				newTrace.name = next_step_name
				newTrace.start_date = new Date
				newTrace.finish_date = new Date

				# 更新instance记录
				setObj.state = "completed"
				setObj.final_decision = judge
				setObj.modified = new Date
				setObj.modified_by = current_user
				setObj.values = uuflowManager.getUpdatedValues(uuflowManager.getInstance(instance_id))
				instance.values = setObj.values
				setObj.name = uuflowManager.getInstanceName(instance)

				instance_trace = _.find(instance_traces, (trace) ->
					return trace._id is trace_id
				)
				trace_approve = _.find(instance_trace.approves, (approve) ->
					return approve._id is approve_id
				)
				outbox_users = instance.outbox_users
				outbox_users.unshift(trace_approve.handler)
				outbox_users.unshift(trace_approve.user)
				setObj.outbox_users = _.uniq(outbox_users)
				instance_traces.push(newTrace)
				setObj.traces = instance_traces
				setObj.inbox_users = []
				setObj.finish_date = new Date

				if instance.cc_users
					setObj.cc_users = instance.cc_users

				setObj.current_step_name = next_step_name
				setObj.current_step_auto_submit = false
			else
				# 若不是结束结点
				# 先判断nextsteps.step.users是否为空
				next_step_users = next_steps[0]["users"]
				if next_step_users is null or next_step_users.length is 0
					throw new Meteor.Error('error!', "未指定下一步处理人")
				else
					if next_step_users.length > 1 and next_step["step_type"] isnt "counterSign"
						throw new Meteor.Error('error!', "不能指定多个处理人")
					else
						# 验证next_user是否合法，调用getHandlersManager.getHandlers(:instance_id,当前trace对应的step_id),判断next_user是否在其返回的结果中
						next_user_ids = getHandlersManager.getHandlers(instance_id, next_step_id)
						if _.difference(next_step_users, next_user_ids).length > 0
							throw new Meteor.Error('error!', "指定的下一步处理人有误")
						else
							# 若合法，执行流转操作
							instance_traces = instance.traces
							i = 0
							while i < instance_traces.length
								if instance_traces[i]._id is trace_id
									# 更新当前trace记录
									instance_traces[i].is_finished = true
									instance_traces[i].finish_date = new Date
									instance_traces[i].judge = judge
									h = 0
									while h < instance_traces[i].approves.length
										if instance_traces[i].approves[h]._id is approve_id
											# 更新当前trace.approve记录
											instance_traces[i].approves[h].is_finished = true
											instance_traces[i].approves[h].handler = current_user
											instance_traces[i].approves[h].handler_name = current_user_info.name
											instance_traces[i].approves[h].finish_date = new Date
											instance_traces[i].approves[h].handler_organization = space_user_org_info["organization"]
											instance_traces[i].approves[h].handler_organization_name = space_user_org_info["organization_name"]
											instance_traces[i].approves[h].handler_organization_fullname = space_user_org_info["organization_fullname"]
											instance_traces[i].approves[h].cost_time = instance_traces[i].approves[h].finish_date - instance_traces[i].approves[h].start_date
										h++
								i++

							# 插入下一步trace记录
							newTrace = new Object
							newTrace._id = new Mongo.ObjectID()._str
							newTrace.instance = instance_id
							newTrace.previous_trace_ids = [trace_id]
							newTrace.is_finished = false
							newTrace.step = next_step_id
							newTrace.name = next_step_name
							newTrace.start_date = new Date
							newTrace.due_date = uuflowManager.getDueDate(next_step.timeout_hours)
							newTrace.approves = new Array

							updated_values = uuflowManager.getUpdatedValues(uuflowManager.getInstance(instance_id))
							_.each next_step_users, (next_step_user_id, idx) ->
								# 插入下一步trace.approve记录
								newApprove = new Object
								newApprove._id = new Mongo.ObjectID()._str
								newApprove.instance = instance_id
								newApprove.trace = newTrace._id
								newApprove.is_finished = false
								newApprove.user = next_step_user_id

								user_info = db.users.findOne({ _id: next_step_user_id }, { fields: { name: 1 } })
								newApprove.user_name = user_info.name

								handler_id = next_step_user_id
								handler_info = user_info
								agent = uuflowManager.getAgent(space_id, next_step_user_id)
								if agent
									next_step_users[idx] = agent
									handler_id = agent
									handler_info = db.users.findOne({ _id: agent }, { fields: { name: 1 } })
									newApprove.agent = agent

								newApprove.handler = handler_id
								newApprove.handler_name = handler_info.name

								next_step_space_user = db.space_users.findOne({
									space: space_id,
									user: handler_id
								})
								# 获取next_step_user所在的部门信息
								next_step_user_org_info = uuflowManager.getSpaceUserOrgInfo(next_step_space_user)
								newApprove.handler_organization = next_step_user_org_info["organization"]
								newApprove.handler_organization_name = next_step_user_org_info["organization_name"]
								newApprove.handler_organization_fullname = next_step_user_org_info["organization_fullname"]
								newApprove.start_date = new Date
								newApprove.due_date = newTrace.due_date
								newApprove.is_read = false
								newApprove.is_error = false
								newApprove.values = new Object
								uuflowManager.setRemindInfo(updated_values, newApprove)
								newTrace.approves.push(newApprove)

							# 更新instance记录
							setObj.final_decision = judge
							setObj.modified = new Date
							setObj.modified_by = current_user
							setObj.values = updated_values
							instance.values = setObj.values
							setObj.name = uuflowManager.getInstanceName(instance)

							instance_trace = _.find(instance_traces, (trace) ->
								return trace._id is trace_id
							)
							trace_approve = _.find(instance_trace.approves, (approve) ->
								return approve._id is approve_id
							)
							outbox_users = instance.outbox_users
							outbox_users.unshift(trace_approve.user)
							outbox_users.unshift(trace_approve.handler)
							setObj.outbox_users = _.uniq(outbox_users)
							setObj.inbox_users = next_step_users
							instance_traces.push(newTrace)
							setObj.traces = instance_traces

							setObj.state = "pending"
							if instance.cc_users
								setObj.cc_users = instance.cc_users

							setObj.current_step_name = next_step_name

							setObj.current_step_auto_submit = uuflowManager.getCurrentStepAutoSubmit(flow.timeout_auto_submit, next_step.lines)
		else if judge is "rejected"
			if not description
				throw new Meteor.Error('error!', "请填写驳回理由")
			else
				# 验证next_steps.step是否合法,判断next_steps.step是否在其中
				nextSteps = uuflowManager.getNextSteps(instance, flow, step, "rejected")
				# 判断next_steps.step是否在nextSteps中,若不在则不合法
				_.each next_steps, (approve_next_step) ->
					if not nextSteps.includes(approve_next_step["step"])
						throw new Meteor.Error('error!', "指定的下一步有误")
				# 若合法,执行流转
				next_step_id = next_steps[0]["step"]
				next_step = uuflowManager.getStep(instance, flow, next_step_id)
				next_step_type = next_step["step_type"]
				next_step_name = next_step["name"]
				# 判断next_step是否为结束结点
				if next_step_type is "end"
					# 若是结束结点
					instance_traces = instance.traces
					i = 0
					while i < instance_traces.length
						if instance_traces[i]._id is trace_id
							# 更新当前trace记录
							instance_traces[i].is_finished = true
							instance_traces[i].finish_date = new Date
							instance_traces[i].judge = judge
							h = 0
							while h < instance_traces[i].approves.length
								if instance_traces[i].approves[h]._id is approve_id
									# 更新当前trace.approve记录
									instance_traces[i].approves[h].is_finished = true
									instance_traces[i].approves[h].handler = current_user
									instance_traces[i].approves[h].handler_name = current_user_info.name
									instance_traces[i].approves[h].finish_date = new Date
									instance_traces[i].approves[h].handler_organization = space_user_org_info["organization"]
									instance_traces[i].approves[h].handler_organization_name = space_user_org_info["organization_name"]
									instance_traces[i].approves[h].handler_organization_fullname = space_user_org_info["organization_fullname"]
									instance_traces[i].approves[h].cost_time = instance_traces[i].approves[h].finish_date - instance_traces[i].approves[h].start_date
								h++
						i++

					# 插入下一步trace记录
					newTrace = new Object
					newTrace._id = new Mongo.ObjectID()._str
					newTrace.instance = instance_id
					newTrace.previous_trace_ids = [trace_id]
					newTrace.is_finished = true
					newTrace.step = next_step_id
					newTrace.name = next_step_name
					newTrace.start_date = new Date
					newTrace.finish_date = new Date

					# 更新instance记录
					setObj.state = "completed"
					setObj.final_decision = judge
					setObj.modified = new Date
					setObj.modified_by = current_user
					setObj.values = uuflowManager.getUpdatedValues(uuflowManager.getInstance(instance_id))
					instance.values = setObj.values
					setObj.name = uuflowManager.getInstanceName(instance)

					instance_trace = _.find(instance_traces, (trace) ->
						return trace._id is trace_id
					)
					trace_approve = _.find(instance_trace.approves, (approve) ->
						return approve._id is approve_id
					)
					outbox_users = instance.outbox_users
					outbox_users.unshift(trace_approve.handler)
					outbox_users.unshift(trace_approve.user)
					setObj.outbox_users = _.uniq(outbox_users)
					instance_traces.push(newTrace)
					setObj.traces = instance_traces
					setObj.inbox_users = []
					setObj.finish_date = new Date

					if instance.cc_users
						setObj.cc_users = instance.cc_users

					setObj.current_step_name = next_step_name
					setObj.current_step_auto_submit = false
				else
					# 若不是结束结点
					# 先判断nextsteps.step.users是否为空
					next_step_users = next_steps[0]["users"]
					if next_step_users is null or next_step_users.length is 0
						throw new Meteor.Error('error!', "未指定下一步处理人")
					else
						if next_step_users.length > 1 and next_step["step_type"] isnt "counterSign"
							throw new Meteor.Error('error!', "不能指定多个处理人")
						else
							# 验证next_user是否合法，调用getHandlersManager.getHandlers(:instance_id,当前trace对应的step_id),判断next_user是否在其返回的结果中
							next_user_ids = getHandlersManager.getHandlers(instance_id, next_step_id)
							if _.difference(next_step_users, next_user_ids).length > 0
								throw new Meteor.Error('error!', "指定的下一步处理人有误")
							else
								# 若合法，执行流转操作
								instance_traces = instance.traces
								i = 0
								while i < instance_traces.length
									if instance_traces[i]._id is trace_id
										# 更新当前trace记录
										instance_traces[i].is_finished = true
										instance_traces[i].finish_date = new Date
										instance_traces[i].judge = judge
										h = 0
										while h < instance_traces[i].approves.length
											if instance_traces[i].approves[h]._id is approve_id
												# 更新当前trace.approve记录
												instance_traces[i].approves[h].is_finished = true
												instance_traces[i].approves[h].handler = current_user
												instance_traces[i].approves[h].handler_name = current_user_info.name
												instance_traces[i].approves[h].finish_date = new Date
												instance_traces[i].approves[h].handler_organization = space_user_org_info["organization"]
												instance_traces[i].approves[h].handler_organization_name = space_user_org_info["organization_name"]
												instance_traces[i].approves[h].handler_organization_fullname = space_user_org_info["organization_fullname"]
												instance_traces[i].approves[h].cost_time = instance_traces[i].approves[h].finish_date - instance_traces[i].approves[h].start_date
											h++
									i++

								# 插入下一步trace记录
								newTrace = new Object
								newTrace._id = new Mongo.ObjectID()._str
								newTrace.instance = instance_id
								newTrace.previous_trace_ids = [trace_id]
								newTrace.is_finished = false
								newTrace.step = next_step_id
								newTrace.name = next_step_name
								newTrace.start_date = new Date
								newTrace.due_date = uuflowManager.getDueDate(next_step.timeout_hours)
								newTrace.approves = new Array

								updated_values = uuflowManager.getUpdatedValues(uuflowManager.getInstance(instance_id))
								_.each next_step_users, (next_step_user_id, idx) ->
									# 插入下一步trace.approve记录
									newApprove = new Object
									newApprove._id = new Mongo.ObjectID()._str
									newApprove.instance = instance_id
									newApprove.trace = newTrace._id
									newApprove.is_finished = false
									newApprove.user = next_step_user_id

									user_info = db.users.findOne({ _id: next_step_user_id }, { fields: { name: 1 } })
									newApprove.user_name = user_info.name

									handler_id = next_step_user_id
									handler_info = user_info
									agent = uuflowManager.getAgent(space_id, next_step_user_id)
									if agent
										next_step_users[idx] = agent
										handler_id = agent
										handler_info = db.users.findOne({ _id: agent }, { fields: { name: 1 } })
										newApprove.agent = agent

									newApprove.handler = handler_id
									newApprove.handler_name = handler_info.name

									next_step_space_user = db.space_users.findOne({
										space: space_id,
										user: handler_id
									})
									# 获取next_step_user所在的部门信息
									next_step_user_org_info = uuflowManager.getSpaceUserOrgInfo(next_step_space_user)
									newApprove.handler_organization = next_step_user_org_info["organization"]
									newApprove.handler_organization_name = next_step_user_org_info["organization_name"]
									newApprove.handler_organization_fullname = next_step_user_org_info["organization_fullname"]
									newApprove.start_date = new Date
									newApprove.due_date = newTrace.due_date
									newApprove.is_read = false
									newApprove.is_error = false
									newApprove.values = new Object
									uuflowManager.setRemindInfo(updated_values, newApprove)
									newTrace.approves.push(newApprove)

								# 更新instance记录
								setObj.final_decision = judge
								setObj.modified = new Date
								setObj.modified_by = current_user
								setObj.values = updated_values
								instance.values = setObj.values
								setObj.name = uuflowManager.getInstanceName(instance)

								instance_trace = _.find(instance_traces, (trace) ->
									return trace._id is trace_id
								)
								trace_approve = _.find(instance_trace.approves, (approve) ->
									return approve._id is approve_id
								)
								outbox_users = instance.outbox_users
								outbox_users.unshift(trace_approve.user)
								outbox_users.unshift(trace_approve.handler)
								setObj.outbox_users = _.uniq(outbox_users)
								setObj.inbox_users = next_step_users
								instance_traces.push(newTrace)
								setObj.traces = instance_traces

								setObj.state = "pending"
								if instance.cc_users
									setObj.cc_users = instance.cc_users

								setObj.current_step_name = next_step_name

								setObj.current_step_auto_submit = uuflowManager.getCurrentStepAutoSubmit(flow.timeout_auto_submit, next_step.lines)


	return setObj

uuflowManager.engine_step_type_is_counterSign = (instance_id, trace_id, approve_id, next_steps, space_user_org_info, judge, instance, flow, step, current_user, current_user_info) ->
	setObj = new Object
	space_id = instance.space
	# 验证approve的judge是否为空
	if not judge
		throw new Meteor.Error('error!', "请选择核准或驳回。")
	else
		if step.oneClickApproval and ['approved','readed'].includes(judge) and Meteor.settings?.public?.is_group_company
			# 验证next_steps.step是否合法,判断next_steps.step是否在其中
			nextSteps = uuflowManager.getNextSteps(instance, flow, step, "approved")
			# 判断next_steps.step是否在nextSteps中,若不在则不合法
			_.each next_steps, (approve_next_step) ->
				if not nextSteps.includes(approve_next_step["step"])
					throw new Meteor.Error('error!', "指定的下一步有误")

		# 若合法,执行流转
		next_step_id = next_steps[0]["step"]
		next_step = uuflowManager.getStep(instance, flow, next_step_id)
		next_step_type = next_step["step_type"]
		next_step_name = next_step["name"]

		instance_traces = instance.traces
		isAllApproveFinished = true
		i = 0
		while i < instance_traces.length
			if instance_traces[i]._id is trace_id
				h = 0
				while h < instance_traces[i].approves.length
					if instance_traces[i].approves[h]._id is approve_id or (Meteor.settings?.public?.is_group_company and (step.oneClickApproval and ['approved','readed'].includes(judge)) or (step.oneClickRejection and 'rejected' is judge))
						# 更新当前trace.approve记录
						instance_traces[i].approves[h].is_finished = true
						instance_traces[i].approves[h].finish_date = new Date
						instance_traces[i].approves[h].cost_time = instance_traces[i].approves[h].finish_date - instance_traces[i].approves[h].start_date

					if instance_traces[i].approves[h].is_finished is false and instance_traces[i].approves[h].type isnt 'cc' and instance_traces[i].approves[h].type isnt 'distribute'
						isAllApproveFinished = false

					h++
			i++

		if isAllApproveFinished is true
			i = 0
			while i < instance_traces.length
				if instance_traces[i]._id is trace_id
					# 更新当前trace记录
					instance_traces[i].is_finished = true
					instance_traces[i].finish_date = new Date
					instance_traces[i].judge = "submitted"
				i++

			# 判断next_step是否为结束结点
			if next_step_type is "end"
				# 插入下一步trace记录
				newTrace = new Object
				newTrace._id = new Mongo.ObjectID()._str
				newTrace.instance = instance_id
				newTrace.previous_trace_ids = [trace_id]
				newTrace.is_finished = true
				newTrace.step = next_step_id
				newTrace.name = next_step_name
				newTrace.start_date = new Date
				newTrace.finish_date = new Date
				# 更新instance记录
				setObj.state = "completed"
				setObj.modified = new Date
				setObj.modified_by = current_user

				instance_trace = _.find(instance_traces, (trace) ->
					return trace._id is trace_id
				)

				outbox_users = instance.outbox_users
				_.each instance_trace.approves, (appro) ->
					outbox_users.push appro.user
					outbox_users.push appro.handler

				setObj.outbox_users = _.uniq(outbox_users)
				setObj.inbox_users = new Array
				instance_traces.push(newTrace)
				setObj.traces = instance_traces
				setObj.finish_date = new Date

				setObj.values = instance.values
				if instance.cc_users
					setObj.cc_users = instance.cc_users

				setObj.current_step_name = next_step_name
				setObj.final_decision = 'approved'
				setObj.current_step_auto_submit = false
			else
				# 若不是结束结点
				# 先判断nextsteps.step.users是否为空
				next_step_users = next_steps[0]["users"]
				if next_step_users is null or next_step_users.length is 0
					throw new Meteor.Error('error!', "未指定下一步处理人")
				else
					if next_step_users.length > 1 and next_step["step_type"] isnt "counterSign"
						throw new Meteor.Error('error!', "不能指定多个处理人")
					else
						# 验证next_user是否合法，调用getHandlersManager.getHandlers(:instance_id,当前trace对应的step_id),判断next_user是否在其返回的结果中
						next_user_ids = getHandlersManager.getHandlers(instance_id, next_step_id)
						if _.difference(next_step_users, next_user_ids).length > 0
							throw new Meteor.Error('error!', "指定的下一步处理人有误")
						else
							# 插入下一步trace记录
							newTrace = new Object
							newTrace._id = new Mongo.ObjectID()._str
							newTrace.instance = instance_id
							newTrace.previous_trace_ids = [trace_id]
							newTrace.is_finished = false
							newTrace.step = next_step_id
							newTrace.name = next_step_name
							newTrace.start_date = new Date
							newTrace.due_date = uuflowManager.getDueDate(next_step.timeout_hours)
							newTrace.approves = new Array
							_.each next_step_users, (next_step_user_id, idx) ->
								# 插入下一步trace.approve记录
								newApprove = new Object
								newApprove._id = new Mongo.ObjectID()._str
								newApprove.instance = instance_id
								newApprove.trace = newTrace._id
								newApprove.is_finished = false
								newApprove.user = next_step_user_id

								user_info = db.users.findOne({ _id: next_step_user_id }, { fields: { name: 1 } })
								newApprove.user_name = user_info.name

								handler_id = next_step_user_id
								handler_info = user_info
								agent = uuflowManager.getAgent(space_id, next_step_user_id)
								if agent
									next_step_users[idx] = agent
									handler_id = agent
									handler_info = db.users.findOne({ _id: agent }, { fields: { name: 1 } })
									newApprove.agent = agent

								newApprove.handler = handler_id
								newApprove.handler_name = handler_info.name

								next_step_space_user = db.space_users.findOne({
									space: space_id,
									user: handler_id
								})
								# 获取next_step_user所在的部门信息
								next_step_user_org_info = uuflowManager.getSpaceUserOrgInfo(next_step_space_user)
								newApprove.handler_organization = next_step_user_org_info["organization"]
								newApprove.handler_organization_name = next_step_user_org_info["organization_name"]
								newApprove.handler_organization_fullname = next_step_user_org_info["organization_fullname"]
								newApprove.start_date = new Date
								newApprove.due_date = newTrace.due_date
								newApprove.is_read = false
								newApprove.is_error = false
								newApprove.values = new Object
								uuflowManager.setRemindInfo(instance.values, newApprove)
								newTrace.approves.push(newApprove)

							# 更新instance记录
							setObj.modified = new Date
							setObj.modified_by = current_user

							instance_trace = _.find(instance_traces, (trace) ->
								return trace._id is trace_id
							)
							outbox_users = instance.outbox_users
							_.each instance_trace.approves, (appro) ->
								outbox_users.push appro.user
								outbox_users.push appro.handler

							setObj.outbox_users = _.uniq(outbox_users)
							setObj.inbox_users = next_step_users
							instance_traces.push(newTrace)
							setObj.traces = instance_traces

							setObj.state = "pending"
							setObj.values = instance.values
							if instance.cc_users
								setObj.cc_users = instance.cc_users

							setObj.current_step_name = next_step_name
							setObj.current_step_auto_submit = uuflowManager.getCurrentStepAutoSubmit(flow.timeout_auto_submit, next_step.lines)
		else
			# 当前trace未结束
			instance_trace = _.find(instance_traces, (trace) ->
				return trace._id is trace_id
			)
			trace_approve = _.find(instance_trace.approves, (approve) ->
				return approve._id is approve_id
			)
			instance.outbox_users.unshift(trace_approve.handler)
			setObj.outbox_users = instance.outbox_users

			instance.inbox_users.splice(instance.inbox_users.indexOf(trace_approve.handler), 1)

			setObj.inbox_users = instance.inbox_users
			setObj.modified = new Date
			setObj.modified_by = current_user

			setObj.traces = instance_traces

			setObj.state = "pending"
			setObj.values = instance.values
			if instance.cc_users
				setObj.cc_users = instance.cc_users

	return setObj

# 生成HTML格式只读表单和签核历程, 由于此方法生成的html数据会作为邮件内容发送，为了再邮件中样式显示正常，
# 请不要写单独的css，所有样式请写在html标签的style属性中。
uuflowManager.ins_html = (current_user_info, ins) ->
	options = { templateName: 'table', showTrace: true, showAttachments: false }
	options.width = "765px" #此处宽度不能设置为偶数，否则会引起子表与主表线条对不齐的bug
	options.styles = "
		body {
		  background: #ffffff !important;
		}.steedos .pull-right {
			float: right !important;
		}.steedos .inline-left{
			display: inline;float: left;
		}.steedos .inline-right{
			display: inline;float: right;
		}.steedos .no-border{
		  border: 0px;
		}.steedos .no-border td{
		  border: 0px;
		}.steedos tr:nth-child(2) td{
		  border-top: 0px !important;
		}.steedos .ins_applicant{
		  display: inline;
		  background: transparent !important;
		  border: none;
		}.steedos .instance-name{
		  width: #{options.width} !important;
		}.steedos table {
		  border-spacing: 0;
		  border-collapse: collapse;
		}.steedos .box {
		  background: #ffffff;
		}.steedos .form-table {
		  width: #{options.width};
		  border: solid 2px #000000;
		  border-collapse: collapse;
		  table-layout: fixed;
		}.steedosTable-item-field{
			padding: 5px;
		}.steedos td{
		  border: solid 1px #000000;
		  border-collapse: collapse;
		}.steedos th {
		  border: 0px;
		  border-collapse: collapse;
		  padding: 0px;
		}.steedos .td-title{
		  padding: 4px 12px;
		}.steedos .td-field {
		  padding: 4px 12px;
		}.instance-view .instance-name {
		  text-align: center;
		  font-weight: bolder;
		}.td-childfield {
		  border-top: solid 1px #000000;
		  border-right: solid 1px #000000;
		  border-bottom: solid 1px #000000;
		  padding: 0px;
		}.panel-heading{
		  padding: 4px 12px;
		  font-weight: bold;
		  color: #333;
		  background-color: #f5f5f5;
		}.table-bordered tr:last-child th {
		  border-bottom: none;
		}.table-bordered tr:last-child td {
		  border-bottom: none;
		}.steedos-table th:first-child{
		  border-left: 0px !important;
		}.steedos-table td:first-child {
		  border-left: 0px !important;
		}.steedos-table table thead .title {
		  min-width: 50px;
		}.steedos-table th:last-child{
		  border-right: 0px !important;
		}.steedos-table td:last-child {
		  border-right: 0px !important;
		}.steedos-table table .number {
		  text-align: right;
		}.callout-default{
		  border-color: #D2D6DE;
		  color: #333;
		  background-color: #F1F1F1;
		  font-weight: bold;
		}.instance-table .callout {
		  margin: 0px;
		  padding: 4px 12px;
		  border-radius: 0px;
		  border-left: none;
		}.approved{
			color: green;
		}.rejected{
			color: red;
		}.terminated{
			color: black;
		}.reassigned{
			color: black;
		}.retrieved{
			color: black;
		}.trace-approve-talbe td {
    		text-align: left;
    		border: none;
		}.traces td table {
   			width: 100%;
		}.approve-item .name{
			width: 40%;
		}.approve-item .finish-date{
			width: 35%;
		}.td-stepname{
			padding: 4px 12px;
		}.td-approve td{
			padding: 4px 12px;
		}.applicant-wrapper {
    		font-weight: bolder;
		}
	"

	instanceHtml = InstanceReadOnlyTemplate.getInstanceHtml(current_user_info, ins.space, ins, options)

#	处理outlook 中，对部分css不支持的处理
	instanceHtml = instanceHtml.replace('style="width: 100%;display: inline-table;"', 'style="border:0px;text-align: center;width:765px;"')

	instanceHtml = instanceHtml.replace('class="instance-table-name-td"', 'class="instance-table-name-td" style="width:' + options.width + ';border:0px"')
#	instanceHtml = instanceHtml.replace('class="instance-table-wrapper-td"', 'class="instance-table-wrapper-td" style="width:' + options.width + ';border:0px"')

	instanceHtml = instanceHtml.replace('class="instance-name"', 'class="instance-name" style="width:' + options.width + '"')
	instanceHtml = instanceHtml.replace('class="table-page-body form-table"', 'class="table-page-body form-table" style="width:' + options.width + '"')
	instanceHtml = instanceHtml.replace('class="table table-condensed traces"', 'class="table table-condensed traces" style="width:' + options.width + ';border:solid 2.0px #000000"')

	instanceHtml = instanceHtml.replace('class="table-page-footer form-table no-border"', 'class="table-page-footer form-table no-border" style="border:0px;width:765px;"')

	instanceHtml = instanceHtml.replace(/class="td-title "/g, 'class="td-title" style="width:14%"')
	instanceHtml = instanceHtml.replace(/class="td-stepname"/g, 'class="td-stepname" style="width:' + 765 * 20 / 100 + 'px"')

	instanceHtml = instanceHtml.replace(/class="td-childfield"/g, 'class="td-childfield" style="padding:0px"')

	instanceHtml = instanceHtml.replace(/class="status approved"/g, 'class="status approved" style="color: green;"')
	instanceHtml = instanceHtml.replace(/class="status rejected"/g, 'class="status rejected" style="color: red;"')

	instanceHtml = instanceHtml.replace(/<table>/g, '<table style="width:100%;border:none">')
	instanceHtml = instanceHtml.replace(/<td class="name">/g, '<td class="name" style="width: 40%;">')
	instanceHtml = instanceHtml.replace(/<td class="finish-date">/g, '<td class="finish-date" style="width: 35%;">')

	instanceHtml = instanceHtml.replace(/inline-left'/g, "inline-left' style='display: inline;float: left;'")
	instanceHtml = instanceHtml.replace(/inline-right'/g, "inline-right' style='display: inline;float: right;'")
	instanceHtml = instanceHtml.replace(/pull-right'/g, "pull-right' style='float: right;'")


	return instanceHtml

uuflowManager.getFlowCompanyId = (flowId)->
	return db.flows.findOne(flowId, { fields: { company_id: 1 } })?.company_id

uuflowManager.create_instance = (instance_from_client, user_info) ->
	space_id = instance_from_client["space"]
	flow_id = instance_from_client["flow"]
	instance_flow_version = instance_from_client["flow_version"]
	user_id = user_info._id
	# 获取前台所传的trace
	trace_from_client = null
	# 获取前台所传的approve
	approve_from_client = null
	if instance_from_client["traces"] and instance_from_client["traces"][0]
		trace_from_client = instance_from_client["traces"][0]
		if trace_from_client["approves"] and trace_from_client["approves"][0]
			approve_from_client = instance_from_client["traces"][0]["approves"][0]

	# 获取一个space
	space = uuflowManager.getSpace(space_id)
	# 获取一个flow
	flow = uuflowManager.getFlow(flow_id)
	# 获取一个space下的一个user
	space_user = uuflowManager.getSpaceUser(space_id, user_id)
	# 获取space_user所在的部门信息
	space_user_org_info = uuflowManager.getSpaceUserOrgInfo(space_user)
	# 判断一个flow是否为启用状态
	uuflowManager.isFlowEnabled(flow)
	# 判断一个flow和space_id是否匹配
	uuflowManager.isFlowSpaceMatched(flow, space_id)

	form = uuflowManager.getForm(flow.form)

	permissions = permissionManager.getFlowPermissions(flow_id, user_id)

	if not permissions.includes("add")
		throw new Meteor.Error('error!', "当前用户没有此流程的新建权限")

	now = new Date
	ins_obj = {}
	ins_obj._id = db.instances._makeNewID()
	ins_obj.space = space_id
	ins_obj.flow = flow_id
	ins_obj.flow_version = flow.current._id
	ins_obj.form = flow.form
	ins_obj.form_version = flow.current.form_version
	ins_obj.name = flow.name
	ins_obj.submitter = user_id
	ins_obj.submitter_name = user_info.name
	ins_obj.applicant = if instance_from_client["applicant"] then instance_from_client["applicant"] else user_id
	ins_obj.applicant_name = if instance_from_client["applicant_name"] then instance_from_client["applicant_name"] else user_info.name
	ins_obj.applicant_organization = if instance_from_client["applicant_organization"] then instance_from_client["applicant_organization"] else space_user.organization
	ins_obj.applicant_organization_name = if instance_from_client["applicant_organization_name"] then instance_from_client["applicant_organization_name"] else space_user_org_info.organization_name
	ins_obj.applicant_organization_fullname = if instance_from_client["applicant_organization_fullname"] then instance_from_client["applicant_organization_fullname"] else  space_user_org_info.organization_fullname
	ins_obj.applicant_company = if instance_from_client["applicant_company"] then instance_from_client["applicant_company"] else space_user.company_id
	ins_obj.state = 'draft'
	ins_obj.code = ''
	ins_obj.is_archived = false
	ins_obj.is_deleted = false
	ins_obj.created = now
	ins_obj.created_by = user_id
	ins_obj.modified = now
	ins_obj.modified_by = user_id
	ins_obj.values = new Object

	companyId = uuflowManager.getFlowCompanyId(flow_id)
	if companyId
		ins_obj.company_id = companyId

	# 新建Trace
	trace_obj = {}
	trace_obj._id = new Mongo.ObjectID()._str
	trace_obj.instance = ins_obj._id
	trace_obj.is_finished = false
	# 当前最新版flow中开始节点
	start_step = _.find(flow.current.steps, (step) ->
		return step.step_type is 'start'
	)
	trace_obj.step = start_step._id
	trace_obj.name = start_step.name

	trace_obj.start_date = now
	# 新建Approve
	appr_obj = {}
	appr_obj._id = new Mongo.ObjectID()._str
	appr_obj.instance = ins_obj._id
	appr_obj.trace = trace_obj._id
	appr_obj.is_finished = false
	appr_obj.user = if instance_from_client["applicant"] then instance_from_client["applicant"] else user_id
	appr_obj.user_name = if instance_from_client["applicant_name"] then instance_from_client["applicant_name"] else user_info.name
	appr_obj.handler = user_id
	appr_obj.handler_name = user_info.name
	appr_obj.handler_organization = space_user.organization
	appr_obj.handler_organization_name = space_user_org_info.organization_name
	appr_obj.handler_organization_fullname = space_user_org_info.organization_fullname
	appr_obj.type = 'draft'
	appr_obj.start_date = now
	appr_obj.read_date = now
	appr_obj.is_read = true
	appr_obj.is_error = false
	appr_obj.description = ''
	appr_obj.values = if approve_from_client and approve_from_client["values"] then approve_from_client["values"] else new Object

	trace_obj.approves = [appr_obj]
	ins_obj.traces = [trace_obj]

	ins_obj.inbox_users = instance_from_client.inbox_users || []

	ins_obj.current_step_name = start_step.name

	# 新建申请单时，instances记录流程名称、流程分类名称 #1313
	ins_obj.flow_name = flow.name
	if form.category
		category = uuflowManager.getCategory(form.category)
		if category
			ins_obj.category_name = category.name

	if flow.auto_remind is true
		ins_obj.auto_remind = true

	# 新建申请单时，instances记录流程名称、流程分类名称 #1313
	ins_obj.flow_name = flow.name
	if form.category
		category = uuflowManager.getCategory(form.category)
		if category
			ins_obj.category_name = category.name

	new_ins_id = db.instances.insert(ins_obj)

	return new_ins_id

uuflowManager.getCurrentStepAutoSubmit = (timeout_auto_submit, lines)->
	if timeout_auto_submit && lines
		timeout_line = _.find lines, (l)->
			return l.timeout_line == true
		if timeout_line
			return true

	return false

uuflowManager.getDueDate = (hours)->
	if hours
		due_time = new Date().getTime() + (1000 * 60 * 60 * hours)
		return new Date(due_time)

	return undefined


uuflowManager.submit_instance = (instance_from_client, user_info) ->
	current_user = user_info._id
	lang = "en"
	if user_info.locale is 'zh-cn'
		lang = 'zh-CN'

	instance_id = instance_from_client["_id"]
	trace_id = instance_from_client["traces"][0]["_id"]
	approve_id = instance_from_client["traces"][0]["approves"][0]["_id"]
	values = instance_from_client["traces"][0]["approves"][0]["values"]
	if not values
		values = new Object
	#　验证表单上的applicant已填写
	if not instance_from_client["applicant"]
		throw new Meteor.Error('error!', "请选择提交人")

	applicant_id = instance_from_client["applicant"]
	submitter_id = instance_from_client["submitter"]
	next_steps = instance_from_client["traces"][0]["approves"][0]["next_steps"]
	attachments = instance_from_client["traces"][0]["approves"][0]["attachments"]
	description = instance_from_client["traces"][0]["approves"][0]["description"]
	# 获取一个instance
	instance = uuflowManager.getInstance(instance_id)
	space_id = instance.space
	flow_id = instance.flow
	# 获取一个space
	space = uuflowManager.getSpace(space_id)
	# 校验申请人user_accepted = true
	checkApplicant = uuflowManager.getSpaceUser(space_id, applicant_id)
	# 获取一个flow
	flow = uuflowManager.getFlow(flow_id)
	# 确定instance的name
	instance_name = instance_from_client["name"]
	# 判断一个instance是否为拟稿状态
	uuflowManager.isInstanceDraft(instance, lang)
	# 获取一个space下的一个user
	space_user = uuflowManager.getSpaceUser(space_id, current_user)
	# 获取space_user所在的部门信息
	space_user_org_info = uuflowManager.getSpaceUserOrgInfo(space_user)
	# 判断一个用户是否是一个instance的提交者
	uuflowManager.isInstanceSubmitter(instance, current_user)
	# 判断一个flow是否为启用状态
	uuflowManager.isFlowEnabled(flow)
	# 验证该user_id或其所在的组有提交此申请单的权限
	permissions = permissionManager.getFlowPermissions(flow_id, current_user)
	if not permissions.includes("add")
		throw new Meteor.Error('error!', "该提交人没有提交此申请单的权限。")

	trace = instance_from_client["traces"][0]
	# 获取一个step
	step = uuflowManager.getStep(instance, flow, trace["step"])
	approve = trace["approves"][0]
	# 先执行暂存的操作
	# ================begin================
	form = db.forms.findOne(instance.form)
	# 获取Flow当前版本开始节点
	start_step = _.find(flow.current.steps, (step) ->
		return step.step_type is 'start'
	)

	instance_traces = instance.traces
	instance_traces[0]["approves"][0].description = description
	setObj = new Object
	flow_has_upgrade = false
	# 判断:applicant和原instance的applicant是否相等
	if applicant_id is instance.applicant
		# applicant和原instance的applicant相等
		# 判断流程是否已升级，instance["flow_version"] == flow["current"]["_id"]表示流程未升级
		if instance.flow_version is flow.current._id
			# instance_traces[0]["approves"][0].values = values
			instance_traces[0]["approves"][0].judge = "submitted"
			# 判断next_steps是否为空,不为空则写入到当前approve的next_steps中
			if next_steps
				instance_traces[0]["approves"][0].next_steps = next_steps

			setObj.modified = new Date
			setObj.modified_by = current_user
		else
			# 流程已升级
			flow_has_upgrade = true
			# 更新instance记录
			setObj.flow_version = flow.current._id
			setObj.form_version = flow.current.form_version
			setObj.modified = new Date
			setObj.modified_by = current_user
			# 清空原来的值， 存入当前最新版flow中开始节点的step_id
			instance_traces[0].step = start_step._id
			instance_traces[0].name = start_step.name
			# instance_traces[0]["approves"][0].values = values
			instance_traces[0]["approves"][0].judge = "submitted"

	else
		# applicant和原instance的applicant不相等
		user = uuflowManager.getUser(applicant_id)
		applicant = uuflowManager.getSpaceUser(space_id, applicant_id)
		# 获取applicant所在的部门信息
		applicant_org_info = uuflowManager.getSpaceUserOrgInfo(applicant)
		# 修改instance的applicant,applicant_name，同时修改开始结点的approve的user为:applicant,user_name
		setObj.applicant = applicant_id
		setObj.applicant_name = user.name
		setObj.applicant_organization = applicant_org_info["organization"]
		setObj.applicant_organization_name = applicant_org_info["organization_name"]
		setObj.applicant_organization_fullname = applicant_org_info["organization_fullname"]
		setObj.applicant_company = applicant["company_id"]
		instance_traces[0]["approves"][0].user = applicant_id
		instance_traces[0]["approves"][0].user_name = user.name
		instance_traces[0]["approves"][0].judge = "submitted"

		# 判断流程是否已升级，instance["flow_version"] == flow["current"]["_id"]表示流程未升级
		if instance.flow_version is flow.current._id
			# instance_traces[0]["approves"][0].values = values
			# 判断next_steps是否为空,不为空则写入到当前approve的next_steps中
			if next_steps
				instance_traces[0]["approves"][0].next_steps = next_steps
				setObj.modified = new Date
				setObj.modified_by = current_user
		else
			# 流程已升级
			flow_has_upgrade = true
			# 更新instance记录
			setObj.flow_version = flow.current._id
			setObj.form_version = flow.current.form_version
			setObj.modified = new Date
			setObj.modified_by = current_user
			# 清空原来的值， 存入当前最新版flow中开始节点的step_id
			instance_traces[0].step = start_step._id
			instance_traces[0].name = start_step.name
			# instance_traces[0]["approves"][0].values = values

	# 调整approves 的values 删除values中在当前步骤中没有编辑权限的字段值
	instance_traces[0]["approves"][0].values = uuflowManager.getApproveValues(values, step.permissions, instance.form, instance.form_version)

	setObj.traces = instance_traces
	db.instances.update({ _id: instance_id }, { $set: setObj })
	if flow_has_upgrade
		return { alerts: TAPi18n.__('flow.point_upgraded', {}, lang) }
	# ================end================
	instance = db.instances.findOne(instance_id) #使用最新的instance
	# 判断一个instance是否为拟稿状态
	uuflowManager.isInstanceDraft(instance, lang)
	traces = instance.traces
	upObj = new Object

	if (not approve["next_steps"]) or (approve["next_steps"].length is 0)
		throw new Meteor.Error('error!', "还未指定下一步和处理人，提交失败")
	else
		# 验证next_steps里面是否只有一个step
		if approve["next_steps"].length > 1
			throw new Meteor.Error('error!', "不能指定多个后续步骤")
		else
			nextSteps = uuflowManager.getNextSteps(instance, flow, step, "")
			_.each(approve["next_steps"], (approve_next_step) ->
				if not nextSteps.includes(approve_next_step["step"])
					throw new Meteor.Error('error!', "下一步步骤不合法")
			)
	# 校验下一步处理人user_accepted = true
	_.each(approve["next_steps"][0]["users"], (next_step_user) ->
		uuflowManager.getSpaceUser(space_id, next_step_user)
	)
	next_step = uuflowManager.getStep(instance, flow, approve["next_steps"][0]["step"])
	# 判断next_step是否为结束结点
	if next_step.step_type is "end"

		# 更新approve
		traces[0]["approves"][0].is_finished = true
		traces[0]["approves"][0].finish_date = new Date
		traces[0]["approves"][0].cost_time = traces[0]["approves"][0].finish_date - traces[0]["approves"][0].start_date
		# 更新trace
		traces[0].is_finished = true
		traces[0].judge = "submitted"
		traces[0].finish_date = new Date
		# 插入下一步trace记录
		newTrace = new Object
		newTrace._id = new Mongo.ObjectID()._str
		newTrace.instance = instance_id
		newTrace.previous_trace_ids = [trace["_id"]]
		newTrace.is_finished = true
		newTrace.step = next_step._id
		newTrace.name = next_step.name
		newTrace.start_date = new Date
		newTrace.finish_date = new Date
		# 更新instance记录
		# 申请单名称按照固定规则生成申请单名称：流程名称＋' '+申请单编号
		upObj.submit_date = new Date
		upObj.state = "completed"
		upObj.values = uuflowManager.getUpdatedValues(uuflowManager.getInstance(instance_id))
		upObj.code = flow.current_no + 1 + ""
		instance.code = upObj.code
		instance.values = upObj.values
		upObj.name = uuflowManager.getInstanceName(instance)
		upObj.modified = new Date
		upObj.modified_by = current_user
		upObj.inbox_users = []
		upObj.outbox_users = _.uniq [current_user, traces[0]["approves"][0]["user"]]
		# 调整approves 的values 删除values中在当前步骤中没有编辑权限的字段值
		# traces[0]["approves"][0].values = uuflowManager.getApproveValues(traces[0]["approves"][0].values, step.permissions, instance.form, instance.form_version)
		traces.push(newTrace)
		upObj.traces = traces
		upObj.finish_date = new Date
		upObj.current_step_name = next_step.name
		upObj.final_decision = "approved"
		upObj.current_step_auto_submit = false
	else # next_step不为结束节点
		# 取得下一步处理人
		next_step_users = approve["next_steps"][0]["users"]
		# 判断nextsteps.step.users是否为空
		if (not next_step_users) or (next_step_users.length is 0)
			throw new Meteor.Error('error!', "未指定下一步处理人")
		else
			if next_step_users.length > 1 and next_step.step_type isnt "counterSign"
				throw new Meteor.Error('error!', "不能指定多个处理人")
			else
				# 验证下一步处理人next_user是否合法
				checkUsers = getHandlersManager.getHandlers(instance_id, approve["next_steps"][0]["step"])
				if _.difference(next_step_users, checkUsers).length > 0
					throw new Meteor.Error('error!', "指定的下一步处理人有误")
				else
					# 若合法，执行流转操作
					# 更新approve
					traces[0]["approves"][0].is_finished = true
					traces[0]["approves"][0].finish_date = new Date
					traces[0]["approves"][0].cost_time = traces[0]["approves"][0].finish_date - traces[0]["approves"][0].start_date
					# 更新trace
					traces[0].is_finished = true
					traces[0].finish_date = new Date
					traces[0].judge = "submitted"
					# 插入下一步trace记录
					nextTrace = new Object
					nextTrace._id = new Mongo.ObjectID()._str
					nextTrace.instance = instance_id
					nextTrace.previous_trace_ids = [trace["_id"]]
					nextTrace.is_finished = false
					nextTrace.step = next_step._id
					nextTrace.name = next_step.name
					nextTrace.start_date = new Date
					nextTrace.due_date = uuflowManager.getDueDate(next_step.timeout_hours)
					nextTrace.approves = new Array

					updated_values = uuflowManager.getUpdatedValues(uuflowManager.getInstance(instance_id))
					# 插入下一步trace.approve记录
					_.each(next_step_users, (next_step_user_id, idx) ->
						nextApprove = new Object
						nextApprove._id = new Mongo.ObjectID()._str

						user_info = uuflowManager.getUser(next_step_user_id)
						handler_id = next_step_user_id
						handler_info = user_info
						agent = uuflowManager.getAgent(space_id, next_step_user_id)
						if agent
							next_step_users[idx] = agent
							handler_id = agent
							handler_info = uuflowManager.getUser(agent)
							nextApprove.agent = agent

						nextApprove.instance = instance_id
						nextApprove.trace = nextTrace._id
						nextApprove.is_finished = false
						nextApprove.user = next_step_user_id
						nextApprove.user_name = user_info.name
						nextApprove.handler = handler_id
						nextApprove.handler_name = handler_info.name
						next_step_space_user = uuflowManager.getSpaceUser(space_id, handler_id)
						# 获取next_step_user所在的部门信息
						next_step_user_org_info = uuflowManager.getSpaceUserOrgInfo(next_step_space_user)
						nextApprove.handler_organization = next_step_user_org_info["organization"]
						nextApprove.handler_organization_name = next_step_user_org_info["organization_name"]
						nextApprove.handler_organization_fullname = next_step_user_org_info["organization_fullname"]
						nextApprove.start_date = new Date
						nextApprove.due_date = nextTrace.due_date
						nextApprove.is_read = false
						nextApprove.is_error = false
						nextApprove.values = new Object
						uuflowManager.setRemindInfo(updated_values, nextApprove)
						nextTrace.approves.push(nextApprove)
					)
					# 更新instance记录
					upObj.name = instance_name
					upObj.submit_date = new Date
					upObj.state = "pending"
					# 重新查找暂存之后的instance
					upObj.values = updated_values
					upObj.inbox_users = next_step_users
					upObj.modified = new Date
					upObj.modified_by = current_user
					# 申请单名称按照固定规则生成申请单名称：流程名称＋' '+申请单编号
					upObj.code = flow.current_no + 1 + ""
					instance.code = upObj.code
					instance.values = upObj.values
					upObj.name = uuflowManager.getInstanceName(instance)
					# 调整approves 的values 删除values中在当前步骤中没有编辑权限的字段值
					# traces[0]["approves"][0].values = uuflowManager.getApproveValues(traces[0]["approves"][0].values, step["permissions"], instance.form, instance.form_version)
					traces.push(nextTrace)
					upObj.traces = traces
					upObj.outbox_users = []
					upObj.current_step_name = next_step.name
					upObj.current_step_auto_submit = uuflowManager.getCurrentStepAutoSubmit(flow.timeout_auto_submit, next_step.lines)

	upObj.keywords = uuflowManager.caculateKeywords(upObj.values, form, instance.form_version)
	db.instances.update({ _id: instance_id }, { $set: upObj })
	db.flows.direct.update({ _id: flow._id }, { $set: { current_no: flow.current_no + 1 } })
	if next_step.step_type isnt "end"
		instance = db.instances.findOne(instance_id)
		#发送短消息给申请人
		pushManager.send_instance_notification("first_submit_applicant", instance, "", user_info)
		# 发送消息给下一步处理人
		pushManager.send_instance_notification("first_submit_inbox", instance, "", user_info)
	return {}

uuflowManager.get_SpaceChangeSet = (formids, is_admin, sync_token) ->
	sync_token = new Date(Number(sync_token) * 1000)
	changeSet = new Object
	changeSet.sync_token = new Date().getTime() / 1000
	changeSet.inserts = {
		Spaces: [],
		Users: [],
		SpaceUsers: [],
		Organizations: [],
		Roles: [],
		Positions: [],
		Forms: [],
		Flows: [],
		Instances: []
	}
	changeSet.updates = {
		Spaces: [],
		Users: [],
		SpaceUsers: [],
		Organizations: [],
		Roles: [],
		Positions: [],
		Forms: [],
		Flows: [],
		Instances: []
	}
	changeSet.deletes = {
		Spaces: [],
		Users: [],
		SpaceUsers: [],
		Organizations: [],
		Roles: [],
		Positions: [],
		Forms: [],
		Flows: [],
		Instances: []
	}

	if formids and formids.trim()
		formids_ary = formids.split(",")
		changeSet.inserts.Instances = db.instances.find({
			form: { $in: formids_ary },
			created: { $gt: sync_token }
		}).fetch()
		changeSet.updates.Instances = db.instances.find({
			form: { $in: formids_ary },
			created: { $lte: sync_token },
			modified: { $gt: sync_token }
		}).fetch()
		changeSet.deletes.Instances = db.deleted_instances.find({
			form: { $in: formids_ary },
			deleted: { $gt: sync_token }
		}, { fields: { _id: 1 } }).fetch()

	else if is_admin and is_admin.trim()
		changeSet.inserts.Instances = db.instances.find({
			created: { $gt: sync_token }
		}).fetch()
		changeSet.updates.Instances = db.instances.find({
			created: { $lte: sync_token },
			modified: { $gt: sync_token }
		}).fetch()
		changeSet.deletes.Instances = db.deleted_instances.find({
			deleted: { $gt: sync_token }
		}, { fields: { _id: 1 } }).fetch()

	# 查询提交人和申请人steedos_id
	_.each changeSet.inserts.Instances, (ins) ->
		submitter = db.users.findOne({ _id: ins.submitter }, { fields: { steedos_id: 1 } })
		applicant = db.users.findOne({ _id: ins.applicant }, { fields: { steedos_id: 1 } })
		ins.submitter_steedos_id = submitter.steedos_id if submitter
		ins.applicant_steedos_id = applicant.steedos_id if applicant
	_.each changeSet.updates.Instances, (ins) ->
		submitter = db.users.findOne({ _id: ins.submitter }, { fields: { steedos_id: 1 } })
		applicant = db.users.findOne({ _id: ins.applicant }, { fields: { steedos_id: 1 } })
		ins.submitter_steedos_id = submitter.steedos_id if submitter
		ins.applicant_steedos_id = applicant.steedos_id if applicant

	return { ChangeSet: changeSet }

### 文件催办
根据instance.values.priority和instance.values.deadline给approve增加remind相关信息
{
	deadline: Date,
	remind_date: Date,
	reminded_count: Number
}
###
uuflowManager.setRemindInfo = (values, approve) ->
	check values, Object
	check approve, Object
	check approve.start_date, Date

	remind_date = null
	deadline = null
	start_date = approve.start_date

	if values.priority and values.deadline
		check values.priority, Match.OneOf("普通", "办文", "紧急", "特急")
		# 由于values中的date字段的值为String，故作如下校验
		deadline = new Date(values.deadline)
		if deadline.toString() is "Invalid Date"
			return

		priority = values.priority

		if priority is "普通"
			remind_date = Steedos.caculateWorkingTime(start_date, 3)
		else if priority is "办文"
			if Steedos.caculatePlusHalfWorkingDay(start_date) > deadline # 超过了办结时限或者距离办结时限半日内
				remind_date = Steedos.caculatePlusHalfWorkingDay(start_date, true)
			else if Steedos.caculateWorkingTime(start_date, 1) > deadline
				caculate_date = (base_date) ->
					plus_halfday_date = Steedos.caculatePlusHalfWorkingDay(base_date)
					if plus_halfday_date > deadline
						remind_date = base_date
					else
						caculate_date(Steedos.caculatePlusHalfWorkingDay(base_date, true))
					return
				caculate_date(start_date)
			else
				remind_date = Steedos.caculateWorkingTime(start_date, 1)
		else if priority is "紧急" or priority is "特急"
			if Steedos.caculatePlusHalfWorkingDay(start_date) > deadline # 超过了办结时限或者距离办结时限半日内
				remind_date = Steedos.caculatePlusHalfWorkingDay(start_date, true)
			else if Steedos.caculateWorkingTime(start_date, 1) > deadline
				caculate_date = (base_date) ->
					plus_halfday_date = Steedos.caculatePlusHalfWorkingDay(base_date)
					if plus_halfday_date > deadline
						remind_date = base_date
					else
						caculate_date(Steedos.caculatePlusHalfWorkingDay(base_date, true))
					return
				caculate_date(start_date)
			else
				remind_date = Steedos.caculatePlusHalfWorkingDay start_date
			ins = db.instances.findOne(approve.instance)
			if ins.state is 'draft'
				flow = db.flows.findOne({ _id: ins.flow }, { fields: { current_no: 1 } })
				ins.code = flow.current_no + 1 + ''
			ins.values = values
			uuflowManager.sendRemindSMS uuflowManager.getInstanceName(ins), deadline, [approve.user], ins.space, ins._id
	else
		# 如果没有配置 紧急程度 和办结时限 则按照 '普通' 规则催办
		remind_date = Steedos.caculateWorkingTime(start_date, 3)

	approve.deadline = deadline
	approve.remind_date = remind_date
	approve.reminded_count = 0

	return

# 发送催办短信
uuflowManager.sendRemindSMS = (ins_name, deadline, users_id, space_id, ins_id) ->
	check ins_name, String
	check deadline, Date
	check users_id, Array
	check space_id, String
	check ins_id, String

	skip_users = Meteor.settings.remind?.skip_users || []
	send_users = []
	_.each users_id, (uid) ->
		if not skip_users.includes(uid)
			send_users.push(uid)

	name = if ins_name.length > 15 then ins_name.substr(0,12) + '...' else ins_name

	db.users.find({_id: {$in: _.uniq(send_users)}, mobile: {$exists: true}}, {fields: {mobile: 1, utcOffset: 1, locale: 1, name: 1}}).forEach (user)->
		utcOffset = if user.hasOwnProperty('utcOffset') then user.utcOffset else 8
		params = {
			instance_name: name,
			deadline: moment(deadline).utcOffset(utcOffset).format('MM-DD HH:mm')
		}
		#设置当前语言环境
		lang = 'en'
		if user.locale is 'zh-cn'
			lang = 'zh-CN'
		# 发送手机短信
		SMSQueue.send({
			Format: 'JSON',
			Action: 'SingleSendSms',
			ParamString: JSON.stringify(params),
			RecNum: user.mobile,
			SignName: 'OA系统',
			TemplateCode: 'SMS_67200967',
			msg: TAPi18n.__('sms.remind.template', {instance_name: ins_name, deadline: params.deadline, open_app_url: Meteor.absoluteUrl()+"workflow.html?space_id=#{space_id}&ins_id=#{ins_id}"}, lang)
		})

		# 发推送消息
		notification = new Object
		notification["createdAt"] = new Date
		notification["createdBy"] = '<SERVER>'
		notification["from"] = 'workflow'
		notification['title'] = user.name
		notification['text'] = TAPi18n.__('instance.push.body.remind', {instance_name: ins_name, deadline: params.deadline}, lang)

		payload = new Object
		payload["space"] = space_id
		payload["instance"] = ins_id
		payload["host"] = Meteor.absoluteUrl().substr(0, Meteor.absoluteUrl().length - 1)
		payload["requireInteraction"] = true
		notification["payload"] = payload
		notification['query'] = { userId: user._id, appName: 'workflow' }

		Push.send(notification)


# 如果申请单的名字变了，正文的名字要跟申请单名字保持同步
uuflowManager.checkMainAttach = (instance_id, name) ->
	main = cfs.instances.findOne({ 'metadata.instance': instance_id, 'metadata.main': true, 'metadata.current': true })
	if main
		ins = db.instances.findOne({ _id: instance_id }, { fields: { name: 1 } })
		new_ins_name = name || ins.name

		new_ins_name = new_ins_name.replace(/\r/g, "").replace(/\n/g, "")

		#文件名中不能包含特殊字符: '? * : " < > \ / |'， 直接替换为空
		new_ins_name = new_ins_name.replace(/\?|\*|\:|\"|\<|\>|\\|\/|\|/g, "")

		main_name_split = main.name().split('.')
		main_name_split.pop()
		if new_ins_name isnt main_name_split.join("")
			file_name = new_ins_name + "." + main.extension()
			main.update({ $set: { 'original.name': file_name, 'copies.instances.name': file_name } })

uuflowManager.caculateKeywords = (values, form, form_version) ->
	if _.isEmpty(values)
		return ""

	keywords = []
	form_v = null
	if form_version is form.current._id
		form_v = form.current
	else
		form_v = _.find(form.historys, (form_h) ->
			return form_version is form_h._id
		)

	_.each form_v.fields, (field) ->
		if field.is_searchable
			if field.type == 'input' or field.type == 'email' or field.type == 'url' or field.type == 'number' or field.type == 'select' or field.type == 'radio'
				if values[field.code]
					keywords.push values[field.code]
			# multiSelect
			else if field.type == 'multiSelect'
				if values[field.code]
					keywords.push values[field.code]
			# 选人选组控件 取name
			else if field.type == 'user' or field.type == 'group'
				# 多选
				if field.is_multiselect == true
					multiValue = values[field.code]
					if _.isArray(multiValue)
						_.each multiValue, (singleV) ->
							if singleV and singleV['name']
								keywords.push singleV['name']
				# 单选
				else
					if values[field.code] and values[field.code]['name']
						keywords.push values[field.code]['name']
		# 子表
		else if field.type == 'table'
			if values[field.code]
				_.each values[field.code], (s_value) ->
					_.each field.fields, (s_field) ->
						if s_field.is_searchable
							if s_field.type == 'input' or s_field.type == 'email' or s_field.type == 'url' or s_field.type == 'number' or s_field.type == 'select' or s_field.type == 'radio'
								if s_value[s_field.code]
									keywords.push s_value[s_field.code]
							# multiSelect
							else if s_field.type == 'multiSelect'
								if s_value[s_field.code]
									keywords.push s_value[s_field.code]
							# 选人选组控件 取name
							else if s_field.type is 'user' or s_field.type is 'group'
								# 多选
								if s_field.is_multiselect == true
									multiValue = s_value[s_field.code]
									if _.isArray(multiValue)
										_.each multiValue, (singleV) ->
											if singleV and singleV['name']
												keywords.push singleV['name']
								# 单选
								else
									if s_value[s_field.code] and s_value[s_field.code]['name']
										keywords.push s_value[s_field.code]['name']
		# 分组
		else if field.type == 'section'
			_.each field.fields, (s_field) ->
				if s_field.is_searchable
					if s_field.type == 'input' or s_field.type == 'email' or s_field.type == 'url' or s_field.type == 'number' or s_field.type == 'select' or s_field.type == 'radio'
						if values[s_field.code]
							keywords.push values[s_field.code]
					# multiSelect
					else if s_field.type == 'multiSelect'
						if values[s_field.code]
							keywords.push values[s_field.code]
					# 选人选组控件 取name
					else if s_field.type is 'user' or s_field.type is 'group'
						# 多选
						if s_field.is_multiselect == true
							multiValue = values[s_field.code]
							if _.isArray(multiValue)
								_.each multiValue, (singleV) ->
									if singleV and singleV['name']
										keywords.push singleV['name']
						# 单选
						else
							if values[s_field.code] and values[s_field.code]['name']
								keywords.push values[s_field.code]['name']

	return keywords.join(" ")

uuflowManager.checkValueFieldsRequire = (values, form, form_version) ->
	values = values || {}

	require_but_empty_fields = []

	form_v = null
	if form_version is form.current._id
		form_v = form.current
	else
		form_v = _.find(form.historys, (form_h) ->
			return form_version is form_h._id
		)

	_.each form_v.fields, (field) ->
		if field.type != 'table'
			if field.is_required and _.isEmpty(values[field.code])
				require_but_empty_fields.push field.name || field.code

		# 子表
		else if field.type == 'table'
			if _.isEmpty(values[field.code])
				_.each field.fields, (s_field) ->
					if s_field.is_required
						require_but_empty_fields.push s_field.name || s_field.code
			else
				_.each values[field.code], (s_value) ->
					_.each field.fields, (s_field) ->
						if s_field.is_required and _.isEmpty(s_value[s_field.code])
							require_but_empty_fields.push s_field.name || s_field.code

	return require_but_empty_fields

uuflowManager.triggerRecordInstanceQueue = (ins_id, record_ids, step_name) ->

	if Meteor.settings.cron?.instancerecordqueue_interval

		newObj = {
			info: {
				instance_id: ins_id
				records: record_ids
				step_name: step_name
				instance_finish_date: new Date()
			}
			sent: false
			sending: 0
			createdAt: new Date()
			createdBy: '<SERVER>'
		}

		db.instance_record_queue.insert(newObj)

	return

uuflowManager.distributedInstancesRemind = (instance) ->
	# 确定是分发过来的
	if instance?.distribute_from_instances?.length>0
		flow = db.flows.findOne( { _id: instance?.flow } )
		current_trace = instance["traces"].pop()
		if instance?.state == "draft"
			next_approves = current_trace?.approves
			if next_approves?.length == 1
				next_step = next_approves[0]?.next_steps[0]
				next_step_id = next_step?.step
		else
			next_step_id = current_trace?.step
		if next_step_id
			next_step = uuflowManager.getStep(instance, flow, next_step_id)
			if next_step?.step_type == "end"
				# 查原申请单
				original_instacne_id = instance?.distribute_from_instances?.pop()
				# original_instacne_id = "X6whjGMLNvxDnFwSe" # 定死
				original_instacne = db.instances.findOne(
					{ _id: original_instacne_id },
					{ fields: { flow: 1, name: 1,space: 1,created_by: 1 } }
					)
				# 根据原申请单查流程
				original_flow = db.flows.findOne(
					{ _id: original_instacne?.flow },
					{ fields: { distribute_end_notification: 1 } }
					)

				if original_flow?.distribute_end_notification==true
					try
						# 分发提醒，这个表单的created_by
						original_user = db.users.findOne({_id: instance?.created_by})

						#设置当前语言环境
						lang = 'en'
						if original_user?.locale is 'zh-cn'
							lang = 'zh-CN'
						# 发推送消息
						notification = new Object
						notification["createdAt"] = new Date
						notification["createdBy"] = '<SERVER>'
						notification["from"] = 'workflow'
						notification['title'] = original_user.name
						notification['text'] = TAPi18n.__('instance.push.body.distribute_remind', {instance_name: instance?.name}, lang)

						payload = new Object
						payload["space"] = original_instacne?.space
						payload["instance"] = original_instacne?._id
						payload["host"] = Meteor.absoluteUrl().substr(0, Meteor.absoluteUrl().length - 1)
						payload["requireInteraction"] = true
						notification["payload"] = payload
						notification['query'] = { userId: original_user._id, appName: 'workflow' }


						Push.send(notification)
					catch e
						console.error e.stack
	return

uuflowManager.getAgent = (spaceId, fromId)->
	now = new Date()
	r = db.process_delegation_rules.findOne({ space: spaceId, from: fromId, enabled: true, start_time: { $lte: now }, end_time: { $gte: now } })
	return r?.to

uuflowManager.cancelProcessDelegation = (spaceId, toId)->
	query = { space: spaceId, inbox_users: toId }
	query.traces = { $elemMatch: { is_finished: false, approves: { $elemMatch: { is_finished: false, agent: toId } } } }
	db.instances.find(query, { fields: { inbox_users: 1, traces: 1, state: 1 } }).forEach (ins)->
		trace = _.find ins.traces, (t)->
			return t.is_finished is false

		_.each trace.approves, (a, idx)->
			if a.is_finished is false
				if a.agent is toId
					next_step_space_user = uuflowManager.getSpaceUser(spaceId, a.user)
					# 获取next_step_user所在的部门信息
					next_step_user_org_info = uuflowManager.getSpaceUserOrgInfo(next_step_space_user)
					idxStr = "traces.$.approves.#{idx}."
					setObj = {}
					setObj[idxStr + 'handler'] = a.user
					setObj[idxStr + 'handler_name'] = a.user_name
					setObj[idxStr + 'handler_organization'] = next_step_user_org_info["organization"]
					setObj[idxStr + 'handler_organization_name'] = next_step_user_org_info["organization_name"]
					setObj[idxStr + 'handler_organization_fullname'] = next_step_user_org_info["organization_fullname"]
					setObj[idxStr + 'agent'] = null
					ins.inbox_users.splice(ins.inbox_users.indexOf(toId), 1, a.user)
					setObj.inbox_users = ins.inbox_users

					# 如果是分发还需要修改提交人信息
					if ins.state is 'draft'
						setObj.submitter = a.user
						setObj.submitter_name = a.user_name

					db.instances.update({ _id: ins._id, inbox_users: toId, 'traces._id': a.trace }, { $set: setObj })

					pushManager.send_message_to_specifyUser('current_user', a.user)
					pushManager.send_message_to_specifyUser('current_user', toId)
				else if a.user is toId
					db.instances.update({ _id: ins._id }, { $addToSet: { inbox_users: toId } })

	ccQuery = { space: spaceId, cc_users: toId }
	ccQuery['traces.approves'] = { $elemMatch: { is_finished: false, agent: toId, type: 'cc' } }
	db.instances.find(ccQuery, { fields: { cc_users: 1, traces: 1 } }).forEach (ins)->
		_.each ins.traces, (t)->
			_.each t.approves, (a, idx)->
				if a.is_finished is false and a.type is 'cc'
					if a.agent is toId
						next_step_space_user = uuflowManager.getSpaceUser(spaceId, a.user)
						# 获取next_step_user所在的部门信息
						next_step_user_org_info = uuflowManager.getSpaceUserOrgInfo(next_step_space_user)
						idxStr = "traces.$.approves.#{idx}."
						setObj = {}
						setObj[idxStr + 'handler'] = a.user
						setObj[idxStr + 'handler_name'] = a.user_name
						setObj[idxStr + 'handler_organization'] = next_step_user_org_info["organization"]
						setObj[idxStr + 'handler_organization_name'] = next_step_user_org_info["organization_name"]
						setObj[idxStr + 'handler_organization_fullname'] = next_step_user_org_info["organization_fullname"]
						setObj[idxStr + 'agent'] = null
						ins.cc_users.splice(ins.cc_users.indexOf(toId), 1, a.user)
						setObj.cc_users = ins.cc_users

						db.instances.update({ _id: ins._id, cc_users: toId, 'traces._id': a.trace }, { $set: setObj })

						pushManager.send_message_to_specifyUser('current_user', a.user)
						pushManager.send_message_to_specifyUser('current_user', toId)
					else if a.user is toId
						db.instances.update({ _id: ins._id }, { $addToSet: { cc_users: toId } })


uuflowManager.timeoutAutoSubmit = (ins_id)->
	query = {}
	if ins_id
		check ins_id, String
		query._id = ins_id

	query.state = 'pending'
	query.current_step_auto_submit = true
	query.traces = { $elemMatch: { is_finished: false, due_date: { $lte: new Date } } }

	db.instances.find(query).forEach (ins)->
		try
			flow_id = ins.flow
			instance_id = ins._id
			trace = _.last ins.traces
			flow = uuflowManager.getFlow(flow_id)
			step = uuflowManager.getStep(ins, flow, trace.step)
			step_type = step.step_type
			toLine = _.find step.lines, (l)->
				return l.timeout_line == true
			nextStepId = toLine.to_step
			nextStep = uuflowManager.getStep(ins, flow, nextStepId)
			if nextStep.step_type == 'condition'
				nextSteps = uuflowManager.getNextSteps(ins, flow, nextStep, "")
				console.error nextSteps
				nextStepId = nextSteps[0]

			nextUserIds = getHandlersManager.getHandlers(instance_id, nextStepId)

			judge = "submitted"
			if step_type is "sign"
				judge = "approved"

			approve_from_client = {
				'instance': instance_id
				'trace': trace._id
				'judge': judge
				'next_steps': [{ 'step': nextStepId, 'users': nextUserIds }]
			}
			_.each trace.approves, (a)->
				approve_from_client._id = a._id
				current_user_info = db.users.findOne(a.handler, { services: 0 })
				updatedInstance = uuflowManager.workflow_engine(approve_from_client, current_user_info, current_user_info._id)

				# 满足超时自动提交条件后，则将申请单提交至下一步骤，并发送提示给当前步骤处理人
				pushManager.send_instance_notification("auto_submit_pending_inbox", updatedInstance, "", current_user_info)

		catch e
			console.error 'AUTO TIMEOUT_AUTO_SUBMIT ERROR: '
			console.error e.stack


	return true