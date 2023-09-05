Meteor.methods
	records_qhd_sync_archive: (spaceId, ins_ids)->

		if !spaceId
			throw new Meteor.Error("Missing spaceId")

		ins = db.instances.find({_id: {$in: ins_ids}}, {fields: {space: 1, is_deleted: 1, is_archived: 1, values: 1, state: 1, final_decision: 1, name: 1, applicant_name: 1, submit_date: 1}})

		ins.forEach (i)->
			if i.is_deleted
				throw new Meteor.Error("被删除的文件不能归档[#{i.name}(#{i._id})]");
			if i.values?.record_need != "true"
				throw new Meteor.Error("文件不需要归档[#{i.name}(#{i._id})]");
			if i.state != 'completed'
				throw new Meteor.Error("未结束的文件不能归档[#{i.name}(#{i._id})]");
#			if i.final_decision && i.final_decision != 'approved'
#				throw new Meteor.Error("未正常结束的文件不能归档[#{i.name}(#{i._id})]");

		db.instances.update({_id: {$in: ins_ids}}, {$set: {is_archived: false}}, {multi:true})

		if Steedos.isSpaceAdmin(spaceId, this.userId)
			try
				RecordsQHD.instanceToArchive ins_ids
				return ins.fetch()
			catch  e
				throw new Meteor.Error(e.message)
		else
			throw new Meteor.Error("No permission")