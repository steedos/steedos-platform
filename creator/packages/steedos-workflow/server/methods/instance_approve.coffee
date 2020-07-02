Meteor.methods
	set_approve_have_read: (instanceId, traceId, approveId) ->
		if !this.userId
			return

		self = this

		instance = db.instances.findOne({ _id: instanceId, "traces._id": traceId }, { fields: { "traces.$": 1 } })

		if instance?.traces?.length > 0
			trace = instance.traces[0]
			setObj = {
				modified: new Date,
				modified_by: self.userId
			}
			trace.approves.forEach (approve, idx) ->
				if approve._id == approveId && !approve.is_read
					setObj["traces.$.approves.#{idx}.is_read"] = true
					setObj["traces.$.approves.#{idx}.read_date"] = new Date()

			if not _.isEmpty(setObj)
				db.instances.update({
					_id: instanceId,
					"traces._id": traceId
				}, {
					$set: setObj
				})
			return true

	change_approve_info: (instanceId, traceId, approveId, description, finish_date) ->
		if !this.userId
			return
		check(instanceId, String)
		check(traceId, String)
		check(approveId, String)
		check(description, String)
		check(finish_date, Date)

		instance = db.instances.findOne({ _id: instanceId, "traces._id": traceId }, { fields: { "traces.$": 1 } })

		if instance?.traces?.length > 0
			trace = instance.traces[0]
			setObj = {}
			trace.approves.forEach (approve, idx) ->
				if approve._id == approveId
					setObj["traces.$.approves.#{idx}.description"] = description
					setObj["traces.$.approves.#{idx}.finish_date"] = finish_date
					setObj["traces.$.approves.#{idx}.cost_time"] = new Date() - approve.start_date
					setObj["traces.$.approves.#{idx}.read_date"] = new Date()

			if not _.isEmpty(setObj)
				db.instances.update({
					_id: instanceId,
					"traces._id": traceId
				}, {
					$set: setObj
				})
			return true

	update_approve_sign: (instanceId, traceId, approveId, sign_field_code, description, sign_type, lastSignApprove)->
		check(instanceId, String)
		check(traceId, String)
		check(approveId, String)
		check(sign_field_code, String)
		check(description, String)

		if !this.userId
			return

		session_userId = this.userId

		if lastSignApprove

			if lastSignApprove.custom_sign_show
				return

			instance = db.instances.findOne({
				_id: instanceId,
				"traces._id": lastSignApprove.trace
			}, { fields: { "traces.$": 1 } })

			lastTrace = _.find instance?.traces, (t) ->
				return t._id = lastSignApprove.trace

			if lastTrace
				setObj = {}
				lastTrace?.approves.forEach (a, idx) ->
					if a._id == lastSignApprove._id
						if sign_type == "update"
							setObj["traces.$.approves.#{idx}.sign_show"] = false
							setObj["traces.$.approves.#{idx}.modified"] = new Date()
							setObj["traces.$.approves.#{idx}.modified_by"] = session_userId

				if not _.isEmpty(setObj)
					db.instances.update({
						_id: instanceId,
						"traces._id": lastTrace._id
					}, {
						$set: setObj
					})

		instance = db.instances.findOne({ _id: instanceId, "traces._id": traceId }, { fields: { "traces.$": 1 } })

		if instance?.traces?.length > 0

			trace = instance.traces[0]
			upObj = {}
			trace.approves.forEach (approve, idx) ->
				if approve._id == approveId
					if sign_field_code
						upObj["traces.$.approves.#{idx}.sign_field_code"] = sign_field_code
					upObj["traces.$.approves.#{idx}.description"] = description
					upObj["traces.$.approves.#{idx}.sign_show"] = true
					upObj["traces.$.approves.#{idx}.modified"] = new Date()
					upObj["traces.$.approves.#{idx}.modified_by"] = session_userId
					upObj["traces.$.approves.#{idx}.read_date"] = new Date()

			if not _.isEmpty(upObj)
				db.instances.update({
					_id: instanceId,
					"traces._id": traceId
				}, {
					$set: upObj
				})
			return true


	update_sign_show: (objs, myApprove_id) ->
		objs.forEach (obj, index) ->
			instance = db.instances.findOne({ _id: obj.instance, "traces._id": obj.trace }, { fields: { "traces.$": 1 } })
			if instance?.traces?.length > 0
				trace = instance.traces[0]
				setObj = {}
				trace.approves.forEach (approve, idx) ->
					if approve._id == obj._id
						setObj["traces.$.approves.#{idx}.sign_show"] = obj.sign_show
						setObj["traces.$.approves.#{idx}.custom_sign_show"] = obj.sign_show
						setObj["traces.$.approves.#{idx}.read_date"] = new Date()

					if approve._id == myApprove_id
						setObj["traces.$.approves.#{idx}.read_date"] = new Date()

				if not _.isEmpty(setObj)
					db.instances.update({
						_id: obj.instance,
						"traces._id": obj.trace
					}, {
						$set: setObj
					})

		return true
