Meteor.methods
	archive_receive: (object_name,selectedIds,space) ->
		result = []
		successNum = 0
		collection = Creator.Collections[object_name]
		totalNum = selectedIds.length
		result.push totalNum
		selectedIds.forEach (selectedId)->
			newSuccessNum = collection.direct.update({_id:selectedId},{$set:{is_received:true,received:new Date(),received_by:Meteor.userId(),modified:new Date(),modified_by:Meteor.userId()}})
			successNum = successNum+ newSuccessNum
			if newSuccessNum
				Meteor.call("archive_new_audit",selectedId,"接收档案","成功",space)
			else
				Meteor.call("archive_new_audit",selectedId,"接收档案","失败",space)
		result.push successNum
		return result