Meteor.methods
	"record_last_viewed": (object_name, record_id)->
		if object_name and record_id
			collection = Creator.Collections[object_name]
			if collection
				collection.update({_id: record_id}, {$set: last_viewed: new Date()})