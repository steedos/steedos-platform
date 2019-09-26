_eval = require('eval')

InstanceManager = {}

logger = new Logger 'Workflow -> InstanceManager'

InstanceManager.handlerInstanceByFieldMap = (ins, field_map) ->
	res = ins
	if ins
		if !field_map

			flow = db.flows.findOne({ _id: ins.flow }, { fields: { field_map: 1 } })

			if flow?.field_map
				field_map = flow.field_map

		if field_map
			context = _.clone(ins)

			context._ = _

			script = "var instances = #{field_map}; exports.instances = instances"
			try
				res = _eval(script, "handlerInstanceByFieldMap", context, false).instances
			catch e
				res = { _error: e }
				logger.error e
	return res

InstanceManager.getCurrentApprove = (instance, handler)->

	if !instance or !instance.traces or instance.traces.length < 1
		return

	currentTraces = instance.traces.filterProperty('is_finished', false)

	if currentTraces.length
		currentApproves = currentTraces[0].approves.filterProperty('is_finished', false).filterProperty('handler', handler)
		currentApprove = if currentApproves.length > 0 then currentApproves[0] else null

	#传阅的approve返回最新一条
	if !currentApprove or currentApprove.type == 'cc'
		# 当前是传阅
		_.each instance.traces, (t) ->
			_.each t.approves, (a) ->
				if a.type == 'cc' and a.user == handler and a.is_finished == false
					currentApprove = a
				return
			return

	if !currentApprove
		return

	return currentApprove

InstanceManager.getCurrentTrace = (instance, traceId)->
	return instance.traces.findPropertyByPK("_id", traceId)

InstanceManager.getMyApprove = (instanceId, userId)->
	instance = db.instances.findOne({_id: instanceId})

	flow = uuflowManager.getFlow(instance.flow)

	my_approve = InstanceManager.getCurrentApprove(instance, userId)

	if my_approve

#		lang = Steedos.locale(that.userId, true)

		trace = InstanceManager.getCurrentTrace(instance, my_approve.trace)

		step = uuflowManager.getStep(instance, flow, trace.step)

		nextSteps = uuflowManager.getNextSteps(instance, flow, step, "")

		if nextSteps.length == 1
			next_user_ids = getHandlersManager.getHandlers(instance._id , nextSteps[0])
			if next_user_ids.length == 1
				my_approve.next_steps = [{step: nextSteps[0], users: next_user_ids}]
				return my_approve
#			else
#				throw new Meteor.Error('error!', TAPi18n.__('workflow_error_multiple_next_step_users', {insname: instance.name}, lang))
#		else
#			throw new Meteor.Error('error!', TAPi18n.__('workflow_error_multiple_next_step', {insname: instance.name}, lang))

	return


InstanceManager.getBatchInstances = (space, categoryId, flowIds, inbox_user)->
	_batch_instances = new Array()

	query = {space: space, inbox_users: inbox_user}

	FIELDS = {name: 1, applicant_name: 1, submit_date: 1, flow_version: 1, "traces.step": 1, flow: 1}

	if categoryId

		if categoryId == '-1'
			unCategoryFlows = flowManager.getUnCategoriesFlows(space, {_id: 1}).fetch().getProperty("_id")
			query.flow = {$in: unCategoryFlows}
		else
			categoryFlows = flowManager.getCategoriesFlows(space, categoryId, {_id: 1}).fetch().getProperty("_id")
			query.flow = {$in: categoryFlows}

	if flowIds
		query.flow = {$in: flowIds}

#	console.log("query", JSON.stringify(query))

	inbox_instances = db.instances.find(query, {fields: FIELDS, skip: 0, limit: 100})

	inbox_instances.forEach (ins)->
		currentStepId = _.last(ins.traces).step #TODO 此代码不适用传阅批处理

		flow = db.flows.findOne({_id: ins.flow})

		currentStep = stepManager.getStep(ins, flow, currentStepId)

		if stepManager.allowBatch(currentStep) && InstanceManager.getMyApprove(ins._id, inbox_user)

			delete ins.flow_version

			delete ins.traces

			delete ins.flow

			_batch_instances.push(ins)
#		else
#			console.log("批量审批-异常数据", ins._id)

	return _batch_instances
