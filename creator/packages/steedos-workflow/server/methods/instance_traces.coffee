Meteor.methods
	get_instance_traces: (ins_id)->
		if (!this.userId)
			return;
		miniApproveFields = ['_id', 'is_finished', 'user', 'handler', 'handler_name', 'type', 'start_date', 'description',
			'is_read', 'judge', 'finish_date', 'from_user_name', 'from_user', 'cc_description']

		ins = db.instances.findOne {_id: ins_id}, {
			fields: {
				"traces._id": 1,
				"traces.is_finished": 1,
				"traces.step": 1,
				"traces.start_date": 1,
				"traces.name": 1,
				"traces.finish_date": 1,
				"traces.judge": 1,
				"traces.approves._id": 1,
				"traces.approves.is_finished": 1,
				"traces.approves.user": 1,
				"traces.approves.handler": 1,
				"traces.approves.handler_name": 1,
				"traces.approves.handler_organization_fullname": 1,
				"traces.approves.type": 1,
				"traces.approves.start_date": 1,
				"traces.approves.description": 1,
				"traces.approves.is_read": 1,
				"traces.approves.judge": 1,
				"traces.approves.finish_date": 1,
				"traces.approves.from_user_name": 1,
				"traces.approves.from_user": 1,
				"traces.approves.cc_description": 1,
				"traces.approves.trace": 1,
				"traces.approves.forward_space": 1,
				"traces.approves.forward_instance": 1
			}
		}

		if !ins
			return

		return ins?.traces

