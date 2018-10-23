Meteor.methods
	start_instanceToArchive: (sDate, fDate) ->
		try
			if sDate and fDate
				ins_ids = []
				# 获取某时间段需要同步的申请单
				start_date = new Date(sDate)
				end_date = new Date(fDate)

				instances = Creator.Collections["instances"].find({
					"submit_date":{$gt:start_date, $lt:end_date},
					$or: [
						{is_recorded: false},
						{is_recorded: {$exists: false}}
					],
					"values.record_need":"true", 
					is_deleted: false, 
					state: "completed"
				},{fields: {_id:1}}).fetch()

				if (instances)
					instances.forEach (ins)->
						ins_ids.push(ins._id)
				
				RecordsQHD.instanceToArchive(ins_ids)
				
				return result
		catch e
			error = e
			return error
		