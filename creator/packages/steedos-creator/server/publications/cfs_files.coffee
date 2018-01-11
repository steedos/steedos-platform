Meteor.publish "creator_cfs_files", (ids)->
	unless this.userId
		return this.ready()
	check(ids, Array);
	collection = cfs.files
	if collection
		return collection.find({_id:{$in:ids}})

