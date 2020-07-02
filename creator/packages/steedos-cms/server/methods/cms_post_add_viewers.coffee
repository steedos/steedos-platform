Meteor.methods addPostViewer: (options) ->
	check options, Object
	{ postId, siteId, spaceId, readId } = options
	check postId, String
	check siteId, String
	check spaceId, String

	viewerId = @userId
	unless readId
		read = db.cms_reads.findOne({user: viewerId, post: postId})
		readId = read?._id
	if readId
		db.cms_reads.update {
			_id: readId
		}, $set: modified: new Date()
	else
		isPostIncSuc = db.cms_posts.direct.update {
			_id: postId
		}, $inc:
			viewCount: 1
		if isPostIncSuc
			db.cms_reads.insert
				user: viewerId
				site: siteId
				post: postId
				created: new Date()
				modified: new Date()
	return true
