Meteor.methods
	remove_related: (ins_id, re_ins_id)->
		check(ins_id, String)
		check(re_ins_id, String)
		if !this.userId
			return

		ins = db.instances.findOne({_id: ins_id}, {fields: {related_instances: 1}})

		if ins
			res = ins.related_instances || []

			index = res.indexOf(re_ins_id)

			if index > -1
				res.remove(index)

			set_obj = new Object;
			set_obj.modified = new Date();
			set_obj.modified_by = this.userId;
			set_obj.related_instances = res

			db.instances.update({_id: ins_id}, {$set: set_obj})

	update_instance_related: (ins_id, related_instances)->
		check(ins_id, String)
		check(related_instances, Array)

		if !this.userId
			return

		ins = db.instances.findOne({_id: ins_id, $or: [{submitter: this.userId}, {applicant: this.userId}]}, {fields: {state: 1}})

		if ins
			set_obj = new Object;
			set_obj.modified = new Date();
			set_obj.modified_by = this.userId;
			set_obj.related_instances = related_instances
			db.instances.update({_id: ins_id}, {$set: set_obj})

		return db.instances.find({_id: {$in:  related_instances}}, {fields: {_id: 1, values: 1}}).fetch()
