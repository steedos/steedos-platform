Meteor.methods 
	getOragninzationsName: (postId)->
		organizationIds = db.cms_posts.findOne(postId)?.members?.organizations || []
		return organizationIds.map (id)->
			return db.organizations.findOne(id).name

	getUsersName: (postId) ->
		userIds = db.cms_posts.findOne(postId)?.members?.users || []
		return userIds.map (id) ->
			return db.users.findOne(id)?.name
