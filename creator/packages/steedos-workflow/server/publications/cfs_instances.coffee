
Meteor.publish 'cfs_instances', (instanceIds)->
	check(instanceIds, Array)

	unless this.userId
		return this.ready()

	unless instanceIds
			return this.ready()

	return cfs.instances.find({'metadata.instance': {$in: instanceIds} , $or: [{'metadata.is_private': {$ne: true}},{'metadata.is_private': true, "metadata.owner": this.userId}]})
