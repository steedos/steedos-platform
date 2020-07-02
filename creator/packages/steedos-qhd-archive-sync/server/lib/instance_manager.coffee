_eval = Npm.require('eval')

InstanceManager = {}

logger = new Logger 'Workflow -> InstanceManager'

InstanceManager.handlerInstanceByFieldMap = (ins, field_map) ->
	res = ins
	if ins
		if !field_map
			
			flow = Creator.Collections["flows"].findOne({ _id: ins.flow }, { fields: { field_map: 1 } })

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