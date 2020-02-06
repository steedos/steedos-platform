Meteor.methods
	space_blogs_init: (spaceId)->
		if !spaceId 
			return false;
		space = db.spaces.findOne(spaceId)
		if !space 
			return false;
		site = db.cms_sites.findOne({space: spaceId})
		if site
			return false;

		owner = db.users.findOne(space.owner)

		TEMPATE_CATEGORIES = ["News", "Regulations", "Knowledge Base"]
		if owner?.locale == "zh-cn"
			TEMPATE_CATEGORIES = ["公司新闻", "规章制度", "知识库"]
		
		order = 10
		_.each TEMPATE_CATEGORIES, (c)->
			siteId = db.cms_sites.insert
				space: spaceId
				visibility: "team"
				name: c
				owner: space.owner
				admins: [space.owner]
				order: order
			order += 10

		# order = 10
		# categoryIds = []
		# _.each TEMPATE_CATEGORIES, (c)->
		# 	categoryId = db.cms_categories.insert
		# 		site: siteId
		# 		name: c
		# 		order: order
		# 	categoryIds.push(categoryId)
		# 	order += 10

		# TEMPLATE_POST_TITLE = "Welcome to Steedos Blog"
		# TEMPLATE_POST_BODY = "You can read and share posts with your colleagues, Space admins can manage categories."
		# if owner?.locale == "zh-cn"
		# 	TEMPLATE_POST_TITLE = "欢迎使用博客应用"
		# 	TEMPLATE_POST_BODY = "您可以在这里与同事快速分享各类信息，管理员可以维护信息分类。"

		# db.cms_posts.insert
		# 	site: siteId
		# 	category: [categoryIds[0]]
		# 	title: TEMPLATE_POST_TITLE
		# 	body: TEMPLATE_POST_BODY

		# return siteId