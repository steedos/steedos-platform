Meteor.methods
	'report_data': (options)->
		check(options, Object)
		space = options.space
		object_name = options.object_name
		return Creator.getCollection(object_name).find(space: space).fetch()
