Meteor.publish 'instance_data', (instanceId, box)->
	unless this.userId
		return this.ready()

	unless instanceId
		return this.ready()

	self = this;

	miniApproveFields = ['_id', 'is_finished', 'user', 'handler', 'handler_name', 'type', 'start_date', 'description',
		'is_read', 'judge', 'finish_date', 'from_user_name', 'from_user', 'cc_description', 'auto_submitted']

	triggerChangeFields = ['form_version', 'flow_version', 'related_instances', '_my_approve_read_dates']

	triggerChangeFieldsValues = {}

	instance_fields_0 = {
		"record_synced": 0,

#		"traces.approves.handler_organization_fullname": 0,
		"traces.approves.handler_organization_name": 0,
		"traces.approves.handler_organization": 0,
		"traces.approves.cost_time": 0,
#		"traces.approves.read_date": 0,
		"traces.approves.is_error": 0,
		# "traces.approves.user_name": 0,
		"traces.approves.deadline": 0,
		"traces.approves.remind_date": 0,
		"traces.approves.reminded_count": 0,
		"traces.approves.modified_by": 0,
		"traces.approves.modified": 0,
		"traces.approves.geolocation": 0,
		"traces.approves.cc_users": 0,
		"traces.approves.from_approve_id": 0,
		"traces.approves.values_history": 0
	}

	getMyapproveModified = (traces)->
		myApproveModifieds = new Array()

		traces?.forEach (trace)->
			trace?.approves?.forEach (approve)->
				if (approve.user == self.userId || approve.handler == self.userId)
				# && !approve.is_finished
#					console.log("approve", approve._id, approve.read_date)

					myApproveModifieds.push(approve.read_date)

		return myApproveModifieds


	getMiniInstance = (_instanceId)->
		instance = db.instances.findOne({_id: _instanceId}, {fields: instance_fields_0})

		if instance

			triggerChangeFields.forEach (key)->
				if key == '_my_approve_read_dates'
					triggerChangeFieldsValues[key] = getMyapproveModified(instance.traces)
				else
					triggerChangeFieldsValues[key] = instance[key]

#			hasOpinionField = InstanceSignText.includesOpinionField(instance.form, instance.form_version)

			show_modal_traces_list = db.space_settings.findOne({ space: instance.space, key: "show_modal_traces_list" }, { fields: { values: 1 } })?.values || false

			if show_modal_traces_list

				traces = new Array();

				instance?.traces?.forEach (trace)->
					_trace = _.clone(trace)

					approves = new Array()

					trace?.approves?.forEach (approve)->
						if approve.type != 'cc' || approve.user == self.userId || approve.handler == self.userId || (!_.isEmpty(approve.sign_field_code))
							approves.push(approve)

					_trace.approves = approves

					traces.push(_trace)

				instance.traces = traces;

		return instance


	needChange = (changeFields)->
		if changeFields

			_change = false

			_rev = _.find triggerChangeFields, (key)->
				_key = key

				if key == '_my_approve_read_dates'
					_key = 'traces'

				if _.has(changeFields, _key)

					if key == '_my_approve_read_dates'

						_my_approve_modifieds = getMyapproveModified(changeFields.traces)

#						console.log(triggerChangeFieldsValues[key], _my_approve_modifieds)

						return !_.isEqual(triggerChangeFieldsValues[key], _my_approve_modifieds)
					else
						return !_.isEqual(triggerChangeFieldsValues[key], changeFields[key])

			if _rev
				_change = true

#			console.log(_rev, _change)

			return _change

		return true
	#此处不能添加fields限制，否则会导致数据不实时
	handle = db.instances.find({_id: instanceId}).observeChanges {
		changed: (id, fields)->
			if(box != 'inbox' || needChange(fields))
				self.changed("instances", id, getMiniInstance(id));
		removed: (id)->
			self.removed("instances", id);
	}

	instance = getMiniInstance(instanceId)

	self.added("instances", instance?._id, instance);

	self.ready();

	self.onStop ()->
		handle.stop()


Meteor.publish 'instance_traces', (instanceId)->
	unless this.userId
		return this.ready()

	unless instanceId
		return this.ready()

	self = this

	getInstanceTraces = (_insId)->
		return db.instances.findOne({_id: _insId}, {fields: {_id: 1, traces: 1}})


	handle =  db.instances.find({_id: instanceId}).observeChanges {
		changed: (id)->
			self.changed("instance_traces", instanceId, getInstanceTraces(instanceId));
	}

	self.added("instance_traces", instanceId, getInstanceTraces(instanceId));

	self.ready();
	self.onStop ()->
		handle.stop()