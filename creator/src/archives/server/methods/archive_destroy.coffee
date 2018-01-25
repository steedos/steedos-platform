Meteor.methods
	archive_destroy: (record_id,space) ->
		result = []
		successNum = 0
		collection = Creator.Collections["archive_records"]
		related_acrhive_records = Creator.Collections["archive_records"].find({archive_destroy_id:record_id},{fields:{_id:1}}).fetch()
		totalNum = related_acrhive_records.length
		result.push totalNum
		related_acrhive_records.forEach (related_acrhive_record)->	
			newSuccessNum = collection.update({_id:related_acrhive_record._id},{$set:{is_destroyed:true,destroyed_by:Meteor.userId(),destroyed:new Date()}})
			successNum = successNum+ newSuccessNum
			if newSuccessNum
				Meteor.call("archive_new_audit",related_acrhive_record._id,"销毁档案","成功",space)
			else
				Meteor.call("archive_new_audit",related_acrhive_record._id,"销毁档案","失败",space)
		result.push successNum
		return result