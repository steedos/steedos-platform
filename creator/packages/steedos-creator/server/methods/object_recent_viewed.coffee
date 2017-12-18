Meteor.methods
	"object_recent_viewed": (object_name, record_id)->
		if object_name == "object_recent_viewed"
			return
		if object_name and record_id and Creator.Collections.object_recent_viewed
			if Creator.Collections.object_recent_viewed.find(
				object_name: object_name
				record_id: record_id
			).count()
				Creator.Collections.object_recent_viewed.update({
					object_name: object_name
					record_id: record_id
				}, {$set: {modified: new Date()}})
			else
				Creator.Collections.object_recent_viewed.insert
					object_name: object_name
					record_id: record_id