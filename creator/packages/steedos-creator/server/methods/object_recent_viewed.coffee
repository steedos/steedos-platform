Meteor.methods
	"object_recent_viewed": (object_name, record_id, spaceId)->

		if !this.userId
			return null

		if object_name == "object_recent_viewed"
			return
		if object_name and record_id
			# viewed = Creator.Collections.object_recent_viewed.findOne(
			# 	object_name: object_name
			# 	created_by: this.userId
			# )
			# if viewed
			# 	record_ids = viewed.record_ids
			# 	if !record_ids
			# 		record_ids = []
			# 	else
			# 		record_ids = _.without(record_ids, record_id)
			# 	record_ids = _.union([record_id], record_ids) 
			# 	record_ids = _.first(record_ids, 10) 
			# 	Creator.Collections.object_recent_viewed.update({
			# 		object_name: object_name
			# 		created_by: this.userId
			# 	}, {$set: {record_ids: record_ids}})
			# else
			Creator.Collections.object_recent_viewed.insert({
				record: {
					o: object_name,
					ids: [record_id]
				},
				space: spaceId,
				owner: this.userId
			})
			return