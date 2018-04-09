Meteor.startup ()->
	if Meteor.isServer
		creator_db_url = process.env.MONGO_URL_CREATOR
		console.log "MONGO_URL_CREATOR", creator_db_url
		oplog_url = process.env.MONGO_OPLOG_URL_CREATOR
		console.log "MONGO_OPLOG_URL_CREATOR", oplog_url
		if creator_db_url
			if !oplog_url
				throw new Meteor.Error(500, "Please configure environment variables: MONGO_OPLOG_URL_CREATOR")
			Creator._CREATOR_DATASOURCE = {_driver: new MongoInternals.RemoteCollectionDriver(creator_db_url, {oplogUrl: oplog_url})}
		else
			console.warn("Please configure environment variables: MONGO_URL_CREATOR, MONGO_OPLOG_URL_CREATOR. Otherwise, custom objects will be stored using MONGO_URL(#{process.env.MONGO_URL})")

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
		if object.custom
			return new Meteor.Collection(collection_key, Creator._CREATOR_DATASOURCE)
		else
			return new Meteor.Collection(collection_key)


