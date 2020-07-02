Meteor.methods
	archive_destroy: (record_id,space) ->
		result = []
		successNum = 0
		related_object_name = Creator.Collections["archive_destroy"].findOne(_id:record_id)?.destroy_category
		if related_object_name
			collection = Creator.Collections[related_object_name]
			related_acrhive_records = Creator.Collections[related_object_name].find({archive_destroy_id:record_id},{fields:{_id:1}}).fetch()
			totalNum = related_acrhive_records?.length
			related_acrhive_records.forEach (related_acrhive_record)->	
				newSuccessNum = collection.update({_id:related_acrhive_record._id},{$set:{is_destroyed:true,destroyed_by:Meteor.userId(),destroyed:new Date()}})
				successNum = successNum+ newSuccessNum
				if newSuccessNum
					Meteor.call("archive_new_audit",related_acrhive_record._id,"销毁档案","成功",space)
				else
					Meteor.call("archive_new_audit",related_acrhive_record._id,"销毁档案","失败",space)
			if successNum == totalNum
				Creator.Collections["archive_destroy"].direct.update(
					{_id:record_id},
					{
						$set:{
							destroy_state:"已销毁",
							destroy_time:new Date(),
							destroyed_by:Meteor.userId()
						}
					})
				return true
			else
				return false