Creator.getCollectionName = (object)->
#	if object.table_name && object.table_name.endsWith("__c")
#		return object.table_name
#	else
#		return object.name
	return object.name

Creator.createCollection = (object)->
	collection_key = Creator.getCollectionName(object)
	if db[collection_key]
		return db[collection_key]
	else if object.db
		return object.db

	if Creator.Collections[collection_key]
		return Creator.Collections[collection_key]
	else
		return new Meteor.Collection(collection_key)


