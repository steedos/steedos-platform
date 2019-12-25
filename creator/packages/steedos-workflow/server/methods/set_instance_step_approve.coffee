Meteor.methods
	set_instance_step_approve: (ins_id, step_approve, stepsApprovesOptions)->
		console.log('set_instance_step_approve...');
		if !this.userId
			return

		ins = db.instances.findOne({_id: ins_id}, {fields: {state: 1}})

		if ins.state != 'draft'
			return ;

		_.each step_approve, (v, k)->
			stepsApproveOptions = stepsApprovesOptions[k]
			if v
				if _.isArray(v)
					stepsApproveOptions = v.concat(stepsApproveOptions)
				else
					stepsApproveOptions.push(v)
			step_approve[k + '_options'] = _.uniq(stepsApproveOptions)
		console.log('step_approve', step_approve);

		db.instances.update {_id: ins_id}, {$set: {step_approve: step_approve}}
	set_instance_skip_steps: (ins_id, stepId, action)->
		if action == 'pull'
			db.instances.update {_id: ins_id}, {$pull: {skip_steps: stepId}}
		else if action == 'push'
			db.instances.update {_id: ins_id}, {$push: {skip_steps: stepId}}