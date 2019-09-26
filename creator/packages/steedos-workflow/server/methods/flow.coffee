Meteor.methods
	change_flow_state: (flows) ->
		check flows, Array

		_userId = this.userId

		if !_userId
			return

		flows.forEach (flow) ->
			spaceId = flow.space
			formId = flow.form
			flowId = flow.id
			state = flow.state

			if !Steedos.isSpaceAdmin(spaceId, _userId)
				throw  Meteor.Error(401, "No permission")

			form = db.forms.findOne({ _id: formId }, { fields: { historys: 0 } })

			flow = db.flows.findOne({ _id: flowId }, { fields: { historys: 0 } })

			if state != 'enabled' && state != 'disabled'
				throw new Meteor.Error(500, "state无效")

			if !form
				throw new Meteor.Error(500, "form无效")

			if !flow
				throw new Meteor.Error(500, "flow无效")

			if !form.is_valid
				throw new Meteor.Error(500, "流程引用的表单[#{form.name}]验证未通过，请打开流程设计器检查表单设置")

			if !flow.is_valid
				throw new Meteor.Error(500, "流程验证未通过，请打开流程设计器检查流程设置")

			if !['new', 'modify', 'delete'].includes(flow.flowtype)
				throw new Meteor.Error(500, "流程验证未通过，flowtype值必须是new、modify、delete其中之一")

			if !_.isArray(flow.current.steps)
				throw new Meteor.Error(500, "流程验证未通过，流程的步骤不能为空")

			if _.uniq(flow.current.steps, 'name').length != flow.current.steps.length
				throw new Meteor.Error(500, "流程验证未通过，同一个流程下的步骤的名称不能重复")

			now = new Date

			if state == 'enabled'
				#流程启用前，校验其“指定历史步骤”属性中被引用的步骤是否存在且能被找到（仅限于流程的最新版）
				flow.current.steps.forEach (step) ->
					if ['specifyStepUser', 'specifyStepRole'].includes(step.deal_type)
						if !step.approver_step
							throw new Meteor.Error(500, "步骤[#{step.name}]中的指定历史步骤不存在。")
						else
							specifyStep = _.find flow.current.steps, (_step) ->
								return step.approver_step == _step._id

							if !specifyStep
								throw new Meteor.Error(500, "步骤[#{step.name}]中的指定历史步骤不存在。")

				form_current_fields_code = form.current.fields.getProperty("code")

				flow.current.steps.forEach (step) ->
					step.fields_modifiable = _.intersection(step.fields_modifiable, form_current_fields_code)

				#如果 流程对应表单 是停用的 则启用
				if form.state == 'disabled'
					db.forms.update({_id: form._id}, {$set: {"state": "enabled", "current.start_date": now, "current.modified": now, "current.modified_by": _userId}})

				flow.current.modified = now
				flow.current.start_date = now
				flow.current.modified_by = _userId

				db.flows.update({ _id: flow._id }, { $set: { "state": "enabled", "current": flow.current } })

			else
				#禁用流程
				db.flows.update({_id: flow._id}, {$set: {"state": "disabled", "current.modified": now, "current.start_date": now, "current.modified_by": _userId}})

				# 判断表单所有流程是否已经全部停用 如果已全部停用 则修改表单状态为停用
				_flows = db.flows.find({ form: form._id }, { fields: { _id: 1, state: 1 } }).fetch()

				_flows_state = _flows.getProperty("state")

				if !_flows_state.includes('enabled')
					db.forms.update({_id: form._id}, {$set: {"state": "disabled", "current.modified": now, "current.start_date": now, "current.modified_by": _userId}})




