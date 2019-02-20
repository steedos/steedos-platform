Meteor.publish "creator_object_record", (object_name, id, space_id)->
	collection = Creator.getCollection(object_name, space_id)
	if collection
		return collection.find({_id: id})

