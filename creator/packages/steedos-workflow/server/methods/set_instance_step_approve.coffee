Meteor.methods
	set_instance_step_approve: (ins_id, step_approve)->
		if !this.userId
			return

		ins = db.instances.findOne({_id: ins_id}, {fields: {state: 1}})

		if ins.state != 'draft'
			return ;

		db.instances.update {_id: ins_id}, {$set: {step_approve: step_approve}}
	set_instance_skip_steps: (ins_id, stepId, action)->
		if action == 'pull'
			db.instances.update {_id: ins_id}, {$pull: {skip_steps: stepId}}
		else if action == 'push'
			db.instances.update {_id: ins_id}, {$push: {skip_steps: stepId}}