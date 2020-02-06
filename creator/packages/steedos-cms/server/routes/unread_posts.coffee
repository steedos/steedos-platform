Meteor.startup ->
	# 获取未读posts
	JsonRoutes.add "get", "/api/cms/unread_posts", (req, res, next) ->
		user = Steedos.getAPILoginUser(req, res)
		
		if !user
			JsonRoutes.sendResult res,
				code: 401,
				data:
					"error": "Validate Request -- Missing X-Auth-Token,X-User-Id",
					"success": false
			return;

		unreads = db.cms_unreads.find({user: user._id}, {sort: {created: -1}, limit: 10})
		
		unread_posts = []
		ret_sync_token = new Date().getTime()
		
		unreads.forEach (unRead) ->
			post = db.cms_posts.findOne({_id: unRead.post}, {fields: {_id: 1, site: 1, title: 1, category: 1, modified: 1, viewCount: 1, author_name: 1}})
			post.modified = moment(post.modified).format("YYYY-MM-DD HH:mm")
			if post
				site = db.cms_sites.findOne({_id: post.site}, {fields: {name: 1}})
				if site
					post.siteTitle = site.name
					unread_posts.push post
		
		# 返回结果
		JsonRoutes.sendResult res,
			code: 200,
			data:
				"status": "success",
				"sync_token": ret_sync_token,
				"data": unread_posts
		return;