Meteor.methods
	start_flow: (space, flowId, start) ->

		keyValue = db.steedos_keyvalues.findOne({ space: space, user: this.userId, key: 'start_flows' }, { fields: { value: 1 } })

		start_flows = keyValue?.value || []

		if start
			start_flows.push(flowId)

			start_flows = _.uniq(start_flows)
		else
			start_flows.remove(start_flows.indexOf(flowId))

		if keyValue
			db.steedos_keyvalues.update({ _id: keyValue._id }, { space: space, user: this.userId, key: 'start_flows', value: start_flows })
		else
			db.steedos_keyvalues.insert({ space: space, user: this.userId, key: 'start_flows', value: start_flows })

