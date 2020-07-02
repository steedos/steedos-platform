Meteor.methods
	set_instance_step_approve: (ins_id, step_approve, stepsApprovesOptions)->
		if !this.userId
			return

		ins = db.instances.findOne({_id: ins_id}, {fields: {state: 1}})

		if ins.state != 'draft'
			return ;

		_keys1 = _.keys(step_approve);
		_keys2 = _.keys(stepsApprovesOptions);

		keys = _.compact(_.union(_keys1, _keys2));

		stepsApproves = {};

		_.each keys, (stepId)->
			stepApproves = step_approve[stepId]
			stepsApproveOptions = stepsApprovesOptions[stepId]
			if stepApproves
				stepsApproves[stepId] = stepApproves
				if stepsApproveOptions
					if _.isArray(stepApproves)
						stepsApproveOptions = stepApproves.concat(stepsApproveOptions)
					else
						stepsApproveOptions.push(stepApproves)
			if stepsApproveOptions
				stepsApproves[stepId + '_options'] = _.uniq(stepsApproveOptions)
		db.instances.update {_id: ins_id}, {$set: {step_approve: stepsApproves}}
	set_instance_skip_steps: (ins_id, stepId, action)->
		if action == 'pull'
			db.instances.update {_id: ins_id}, {$pull: {skip_steps: stepId}}
		else if action == 'push'
			db.instances.update {_id: ins_id}, {$push: {skip_steps: stepId}}