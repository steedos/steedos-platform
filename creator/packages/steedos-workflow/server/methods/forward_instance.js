Meteor.methods({
	// 改为通过api调用
	forward_instance: function (instance_id, space_id, flow_id, hasSaveInstanceToAttachment, description, isForwardAttachments, selectedUsers, action_type, related, from_approve_id) {
		if (!this.userId)
			throw new Meteor.Error('not-authorized');

		return;
	},


	forward_remove: function (instance_id, trace_id, approve_id) {
		check(instance_id, String);
		check(trace_id, String);
		check(approve_id, String);

		var ins = db.instances.findOne(instance_id);

		if (!ins) {
			throw new Meteor.Error('params error!', 'record not exists!');
		}

		var trace = _.find(ins.traces, function (t) {
			return t._id == trace_id;
		});

		var approve = _.find(trace.approves, function (appr) {
			return appr._id == approve_id;
		})

		var hasAdminPermission = WorkflowManager.hasFlowAdminPermission(ins.flow, ins.space, this.userId)

		if (!approve || !['forward', 'distribute'].includes(approve.type) || !approve.forward_instance) {
			if (!hasAdminPermission) {
				if (approve.from_user != this.userId)
					throw new Meteor.Error('error!', 'instance_forward_cannot_cancel');
			}
		}

		var forward_instance_id = approve.forward_instance;
		var forward_instance = db.instances.findOne(forward_instance_id);
		if (forward_instance) {
			if (forward_instance.state != "draft") {
				if (!hasAdminPermission)
					throw new Meteor.Error('error!', 'instance_forward_instance_state_changed');
			}
			var inbox_users = forward_instance.inbox_users || [];

			forward_instance.deleted = new Date();
			forward_instance.deleted_by = this.userId;
			var deleted_forward_instance_id = db.deleted_instances.insert(forward_instance);
			if (deleted_forward_instance_id) {
				db.instances.remove({
					_id: forward_instance_id
				});

				// 删除申请单后重新计算inbox_users的badge
				_.each(inbox_users, function (u_id) {
					pushManager.send_message_to_specifyUser("current_user", u_id);
				})
			}
		}

		var set_obj = new Object;
		set_obj.modified = new Date();
		set_obj.modified_by = this.userId;

		_.each(trace.approves, function (appr, idx) {
			if (appr._id == approve_id) {
				set_obj['traces.$.approves.' + idx + '.judge'] = 'terminated';
				set_obj['traces.$.approves.' + idx + '.is_finished'] = true;
				set_obj['traces.$.approves.' + idx + '.finish_date'] = new Date();
				set_obj['traces.$.approves.' + idx + '.is_read'] = true;
				set_obj['traces.$.approves.' + idx + '.read_date'] = new Date();
			}
		})

		db.instances.update({
			_id: instance_id,
			"traces._id": trace_id
		}, {
			$set: set_obj
		})

		return true;
	},

	cancelDistribute: function (instance_id, approve_ids) {
		check(instance_id, String)
		check(approve_ids, Array)

		var ins = db.instances.findOne(instance_id)

		if (!ins) {
			throw new Meteor.Error('params error!', 'record not exists!')
		}

		userId = this.userId

		var hasAdminPermission = WorkflowManager.hasFlowAdminPermission(ins.flow, ins.space, userId)

		_.each(ins.traces, function (t) {
			if (t.approves) {
				var exists = false
				var set_obj = new Object
				_.each(t.approves, function (a, idx) {
					if (approve_ids.includes(a._id) && (a.from_user == userId || hasAdminPermission) && 'distribute' == a.type && a.forward_instance) {
						var forward_instance_id = a.forward_instance
						var forward_instance = db.instances.findOne(forward_instance_id)
						if (forward_instance) {
							if (forward_instance.state != "draft") {
								return
							}
							var inbox_users = forward_instance.inbox_users || []

							forward_instance.deleted = new Date()
							forward_instance.deleted_by = userId
							var deleted_forward_instance_id = db.deleted_instances.insert(forward_instance)
							if (deleted_forward_instance_id) {
								db.instances.remove({
									_id: forward_instance_id
								})

								// 删除申请单后重新计算inbox_users的badge
								_.each(inbox_users, function (u_id) {
									pushManager.send_message_to_specifyUser("current_user", u_id)
								})
							}

							set_obj['traces.$.approves.' + idx + '.judge'] = 'terminated'
							set_obj['traces.$.approves.' + idx + '.is_finished'] = true
							set_obj['traces.$.approves.' + idx + '.finish_date'] = new Date()
							set_obj['traces.$.approves.' + idx + '.is_read'] = true
							set_obj['traces.$.approves.' + idx + '.read_date'] = new Date()
						}

						exists = true
					}
				})

				if (!exists)
					return

				set_obj.modified = new Date()
				set_obj.modified_by = userId

				db.instances.update({
					_id: instance_id,
					"traces._id": t._id
				}, {
					$set: set_obj
				})
			}
		})

		return true
	}


})