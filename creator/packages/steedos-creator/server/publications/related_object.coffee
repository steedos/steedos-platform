Meteor.publish "creator_related_object_record", (object_name, id)->
	collection = Creator.Collections[object_name]
	if collection
		return collection.find({_id: id})