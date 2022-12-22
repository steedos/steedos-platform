{ workflowMethods } = require('@steedos/workflow')
Meteor.methods
	set_approve_have_read: (instanceId, traceId, approveId) ->
		return workflowMethods.set_approve_have_read.apply(this, arguments)

	change_approve_info: (instanceId, traceId, approveId, description, finish_date) ->
		return workflowMethods.change_approve_info.apply(this, arguments)

	update_approve_sign: (instanceId, traceId, approveId, sign_field_code, description, sign_type, lastSignApprove)->
		return workflowMethods.update_approve_sign.apply(this, arguments)


	update_sign_show: (objs, myApprove_id) ->
		return workflowMethods.update_sign_show.apply(this, arguments)
