
Creator.createCollection = (object)->
	collection_key = object.name
	if object.custom && object.space
		collection_key = "c_" + object.space + "_" + object.name

	if db[object.name]
		return db[object.name]
	else if object.db
		return object.db

	if Creator.Collections[object.name]
		return Creator.Collections[object.name]
	else
		return new Meteor.Collection(collection_key)


