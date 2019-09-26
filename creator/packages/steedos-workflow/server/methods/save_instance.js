Meteor.methods({

	draft_save_instance: function (ins) {
		if (!this.userId)
			return;
		var result = true;
		var setObj = {};
		var index = 0;
		var ins_id = ins._id;
		var trace_id = ins.traces[0]._id;
		var approve_id = ins.traces[0].approves[0]._id;
		var description = ins.traces[0].approves[0].description;
		var next_steps = ins.traces[0].approves[0].next_steps;
		var values = ins.traces[0].approves[0].values || {};
		var applicant_id = ins.applicant;

		var instance = db.instances.findOne(ins_id, {
			fields: {
				applicant: 1,
				state: 1,
				submitter: 1,
				traces: 1,
				form: 1,
				flow_version: 1,
				space: 1,
				flow: 1
			}
		});

		var space_id = instance.space;
		var flow_id = instance.flow;
		var form_id = instance.form;
		var traces = instance.traces;
		var current_trace = _.find(traces, function (t) {
			return t._id == trace_id;
		});
		current_trace.approves.forEach(function (a, idx) {
			if (a._id == approve_id) {
				index = idx;
			}
		})
		var key_str = 'traces.$.approves.' + index + '.';

		// 判断一个instance是否为拟稿状态
		var current_user = db.users.findOne({
			_id: this.userId
		}, {
			fields: {
				locale: 1
			}
		});
		var lang = current_user.locale == 'zh-cn' ? 'zh-CN' : 'en';
		uuflowManager.isInstanceDraft(instance, lang);
		// 判断一个用户是否是一个instance的提交者
		uuflowManager.isInstanceSubmitter(instance, this.userId);

		var flow = db.flows.findOne(flow_id, {
			fields: {
				"current._id": 1,
				"current.form_version": 1,
				"name": 1,
				"current.steps": 1
			}
		});

		setObj.modified = new Date();
		setObj.modified_by = this.userId;

		if (flow.current._id != instance.flow_version) {
			result = "upgraded";
			var start_step = _.find(flow.current.steps, function (s) {
				return s.step_type == "start";
			});
			// 流程已升级
			setObj.flow_version = flow.current._id;
			setObj.form_version = flow.current.form_version;
			// 存入当前最新版flow中开始节点的step_id
			setObj["traces.$.step"] = start_step._id;
			setObj["traces.$.name"] = start_step.name;
		}

		if (instance.applicant != applicant_id) {
			// 申请人已变换
			var user = db.users.findOne(applicant_id, {
				fields: {
					name: 1
				}
			});
			var applicant = db.space_users.find({
				space: space_id,
				user: applicant_id
			}, {
				fields: {
					organization: 1
				}
			});
			var org_id = applicant.fetch()[0].organization;
			var organization = db.organizations.findOne(org_id, {
				fields: {
					name: 1,
					fullname: 1
				}
			});

			setObj.applicant = applicant_id;
			setObj.applicant_name = user.name;
			setObj.applicant_organization = org_id;
			setObj.applicant_organization_name = organization.name;
			setObj.applicant_organization_fullname = organization.fullname;

			setObj[key_str + 'user'] = applicant_id;
			setObj[key_str + 'user_name'] = user.name;
		}

		setObj[key_str + 'values'] = values;
		setObj[key_str + 'description'] = description;
		setObj[key_str + 'judge'] = 'submitted';
		setObj[key_str + 'read_date'] = new Date();
		if (result != "upgraded" && next_steps) {
			setObj[key_str + 'next_steps'] = next_steps;
		}

		// 计算申请单标题
		var form = db.forms.findOne({
			_id: form_id
		}, {
			fields: {
				"current.name_forumla": 1
			}
		});
		var name_forumla = form.current.name_forumla;
		if (name_forumla) {
			// var iscript = name_forumla.replace(/\{/g, "(values['").replace(/\}/g, "'] || '')");
			// var rev = eval(iscript);
			setObj.name = uuflowManager.getInstanceName(ins, values);
		}

		db.instances.update({
			_id: ins_id,
			"traces._id": trace_id
		}, {
			$set: setObj
		});
		return result;
	},

	inbox_save_instance: function (approve) {
		if (!this.userId)
			return;

		var setObj = {};
		var index = 0;
		var ins_id = approve.instance;
		var trace_id = approve.trace;
		var approve_id = approve.id;
		var values = approve.values;
		var next_steps = approve.next_steps;
		var description = approve.description;
		var judge = approve.judge;

		var instance = db.instances.findOne(ins_id, {
			fields: {
				traces: 1,
				flow_version: 1,
				flow: 1,
				state: 1,
				form: 1,
				form_version: 1,
				values: 1
			}
		});

		var traces = instance.traces;

		var current_trace = _.find(traces, function (t) {
			return t._id == trace_id;
		});
		var current_approve = _.find(current_trace.approves, function (a) {
			return a._id == approve_id;
		});

		// 判断一个instance是否为审核中状态
		var current_user = db.users.findOne({
			_id: this.userId
		}, {
			fields: {
				locale: 1
			}
		});
		var lang = current_user.locale == 'zh-cn' ? 'zh-CN' : 'en';
		try {
			uuflowManager.isInstancePending(instance, lang);
			// 判断一个trace是否为未完成状态
			uuflowManager.isTraceNotFinished(current_trace);
			// 判断一个approve是否为未完成状态
			uuflowManager.isApproveNotFinished(current_approve);
			// 判断当前用户是否approve 对应的处理人或代理人
			uuflowManager.isHandlerOrAgent(current_approve, this.userId);
		} catch (e) {
			console.log(e.stack)
			return true
		}


		var flow_version = instance.flow_version;
		var flow_id = instance.flow;
		var step_id = "";
		step_id = current_trace.step;
		var flow = db.flows.findOne(flow_id, {
			fields: {
				current: 1,
				historys: 1
			}
		});
		var step = null;
		if (flow.current._id == flow_version) {
			flow.current.steps.forEach(function (s) {
				if (s._id == step_id)
					step = s;
			})
		} else {
			flow.historys.forEach(function (h) {
				h.steps.forEach(function (s) {
					if (s._id == step_id)
						step = s;
				})
			})
		}

		if (!step)
			return false;
		var step_type = step.step_type;

		current_trace.approves.forEach(function (a, idx) {
			if (a._id == approve_id) {
				index = idx;
			}
		})

		var key_str = 'traces.$.approves.' + index + '.';

		var permissions_values = uuflowManager.getApproveValues(approve.values, step.permissions, instance.form, instance.form_version);

		var change_values = approveManager.getChangeValues(instance.values, permissions_values);

		setObj.values = _.extend((instance.values || {}), permissions_values);

		if (!_.isEmpty(change_values)) {

			values_history = current_approve.values_history || []

			values_history.push({
				values: change_values,
				create: new Date()
			})

			setObj[key_str + 'values_history'] = values_history
		}

		setObj[key_str + 'is_read'] = true;
		setObj[key_str + 'read_date'] = new Date();
		setObj[key_str + 'values'] = setObj.values;
		setObj[key_str + 'description'] = description;
		setObj[key_str + 'next_steps'] = next_steps;
		if (step_type == "submit" || step_type == "start") {
			setObj[key_str + 'judge'] = "submitted";
		} else {
			setObj[key_str + 'judge'] = judge;
		}

		setObj.modified = new Date();
		setObj.modified_by = this.userId;

		// 计算申请单标题
		var form = db.forms.findOne(instance.form);
		var form_v = uuflowManager.getFormVersion(form, instance.form_version);
		var name_forumla = form_v.name_forumla;
		if (name_forumla) {
			setObj.name = uuflowManager.getInstanceName(instance, setObj.values);
		}

		db.instances.update({
			_id: ins_id,
			"traces._id": trace_id
		}, {
			$set: setObj
		});
		return true;
	}

})