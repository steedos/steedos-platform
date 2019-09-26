stepManager = {}

stepManager.allowBatch = (step)->
	return step.step_type == 'counterSign' && step.allowBatch

stepManager.getStep = (instance, flow, step_id)->
	flow_rev = instance.flow_version
	isExistStep = null
	if flow.current._id is flow_rev
		isExistStep = _.find(flow.current.steps, (step)->
			return step._id is step_id
		)
	else
		_.each(flow.historys, (history)->
			if history._id is flow_rev
				isExistStep = _.find(history.steps, (step)->
					return step._id is step_id
				)
		)

	if not isExistStep
		throw new Meteor.Error('error!', "不能获取step")

	return isExistStep