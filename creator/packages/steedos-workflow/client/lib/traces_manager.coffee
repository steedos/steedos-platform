###
	获取传入步骤最近一次实际处理人
###
TracesManager.getStepLastHandlers = (stepId, instance) ->

	handlers = []

	traces = _.clone(instance.traces)

	stepTraces = _.filter traces, (trace)->
		return trace.step == stepId

	stepTraces.reverse()

	_.some stepTraces, (trace)->
		if trace.is_finished
			approves = trace?.approves || []

			approves.reverse()

			approves.forEach (approve)->
				if approve?.is_finished && approve?.type != 'cc' && approve?.type != 'distribute'
					if ["approved", "rejected", "submitted", "readed"].includes(approve.judge)
						handlers.push approve.handler

			if handlers.length > 0
				return true


	return handlers;


TracesManager.getHandlerSignShowApproves = (ins, handler, check_sign_show)->

	currentApprove = InstanceManager.getCurrentApprove();
	if !currentApprove
		return

	traces = _.clone(ins.traces)

	currentTrace = _.find traces, (t)->
		return t._id == currentApprove?.trace


	stepApproves = []

	if currentTrace

		tracesByStep = _.groupBy traces, 'step'

		stepTraces = tracesByStep[currentTrace.step]

		stepTraces?.forEach (t)->
			stepApproves = stepApproves.concat(t.approves)


	userApproves = _.groupBy stepApproves, "handler"

	currentUserApproves = userApproves[handler]

	signShowApproves = _.filter currentUserApproves, (a)->
		if check_sign_show
			return a.is_finished && a.sign_show != false && a.description
		else
			return a.is_finished && a.description



	return signShowApproves


TracesManager.getTracesListData = (instance)->
	return db.instance_traces.findOne({_id:instance._id})?.traces || instance.traces
