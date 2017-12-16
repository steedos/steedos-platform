Meteor.methods
	"object_recent_viewed": (object_name, record_id)->
		if object_name and record_id
			Creator.Collections.object_recent_viewed.insert
				object_name: object_name
				record_id: record_id