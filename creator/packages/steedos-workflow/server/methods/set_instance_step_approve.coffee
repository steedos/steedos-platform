Meteor.methods
	set_instance_step_approve: (ins_id, step_approve)->
		if !this.userId
			return

		ins = db.instances.findOne({_id: ins_id}, {fields: {state: 1}})

		if ins.state != 'draft'
			return ;

		db.instances.update {_id: ins_id}, {$set: {step_approve: step_approve}}