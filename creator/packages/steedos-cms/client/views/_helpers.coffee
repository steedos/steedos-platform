CMS.helpers =

	SpaceUserName: (userId)->
		su = db.space_users.findOne({user: userId})
		return su?.name

	Posts: (limit, skip)->
		if !limit 
			limit = 5
		skip = 0
		siteId = Session.get("siteId")
		tag = Session.get("siteTag")
		siteCategoryId = Session.get("siteCategoryId")

		if siteId and tag
			return db.cms_posts.find({site: siteId, tags: tag}, {sort: {postDate: -1}, limit: limit, skip: skip})
		else if siteId and siteCategoryId
			return db.cms_posts.find({site: siteId, category: siteCategoryId}, {sort: {postDate: -1}, limit: limit, skip: skip})
		else if siteId
			return db.cms_posts.find({site: siteId}, {sort: {postDate: -1}, limit: limit, skip: skip})
	
	PostsCount: ()->
		siteId = Session.get("siteId")
		tag = Session.get("siteTag")
		siteCategoryId = Session.get("siteCategoryId")

		if siteId and tag
			return db.cms_posts.find({site: siteId, tags: tag}).count()
		else if siteId and siteCategoryId
			return db.cms_posts.find({site: siteId, category: siteCategoryId}).count()
		else if siteId
			return db.cms_posts.find({site: siteId}).count()
		else
			return 0
	
	PostId: ()->
		return Session.get("postId")

	Post: ()->
		postId = Session.get("postId")
		if postId
			return db.cms_posts.findOne({_id: postId})

	PostURL: (postId)->
		siteId = Session.get("siteId")
		if siteId
			siteCategoryId = Session.get("siteCategoryId")
			tag = Session.get("siteTag")
			if siteCategoryId
				return "/cms/s/" + siteId + "/c/" +  siteCategoryId + "/p/" + postId
			else if tag
				return "/cms/s/" + siteId + "/t/" +  tag + "/p/" + postId
			else
				return "/cms/s/" + siteId + "/p/" + postId

	PostSummary: ->
		if this.body
			return this.body.substring(0, 400)
		else
			return this.summary

	PostImage: (postId)->
		if postId
			post = db.cms_posts.findOne({_id: postId})
			if post?.images?.length>0
				return post.images[0]

	PostImages: ()->
		postId = FlowRouter.current().params.postId
		if postId
			post = db.cms_posts.findOne({_id: postId})
			if post?.images?.length>0
				return cfs.posts.find({_id: {$in: post.images}}).fetch()

	PostAttachments: ()->
		postId = FlowRouter.current().params.postId
		if postId
			post = db.cms_posts.findOne({_id: postId})
			if post and post.attachments
				return cfs.posts.find({_id: {$in: post.attachments}},{sort: {"uploadedAt": -1}}).fetch()

	PostAttachmentsCount: ()->
		postId = FlowRouter.current().params.postId
		if postId
			post = db.cms_posts.findOne({_id: postId})
			return post?.attachments?.length

	PostAttachmentUrl: (attachment,isPreview)->
		if Steedos.isNode()
			url = window.location.origin + "/api/files/posts/#{attachment._id}"
		else
			url = Meteor.absoluteUrl("api/files/posts/#{attachment._id}")
		if !(typeof isPreview == "boolean" and isPreview) and !Steedos.isMobile()
			url += "?download=true"
		return url

	IsImageAttachment: (attachment)->
		type = attachment?.original?.type
		return type?.startsWith("image/")

	IsHtmlAttachment: (attachment)->
		return attachment?.original?.type == "text/html"

	CategoryId: ()->
		return Session.get("siteCategoryId")

	CategoryActive: (categoryId)->
		if !categoryId and !Session.get("siteCategoryId")
			return "active"
		if Session.get("siteCategoryId") == categoryId
			return "active"

	Category: ()->
		siteCategoryId = Session.get("siteCategoryId")
		if siteCategoryId
			return db.cms_categories.findOne(siteCategoryId)

	ParentCategory: ()->
		siteCategoryId = Session.get("siteCategoryId")
		if siteCategoryId
			c = db.cms_categories.findOne(siteCategoryId)
			if c?.parent
				return db.cms_categories.findOne(c.parent)

	SubCategories: (parent)->
		siteId = Session.get("siteId")
		if parent
			return db.cms_categories.find({site: siteId, parent: parent}, {sort: db.cms_categories._sortFunction})
		else
			return db.cms_categories.find({site: siteId, parent: null}, {sort: db.cms_categories._sortFunction})
			
	SubCategoriesCount: (parent)->
		siteId = Session.get("siteId")
		if parent
			return db.cms_categories.find({site: siteId, parent: parent}).count()
		else
			return db.cms_categories.find({site: siteId, parent: null}).count()

	# unReadCountBySite: (siteId)->
	# 	return db.cms_unreads.find({user: Meteor.userId(),site: siteId}).count()

	SiteId: ->
		siteId = Session.get("siteId")
		return siteId

	Sites: (spaceId) ->
		unless spaceId
			spaceId = Steedos.spaceId()
		return db.cms_sites.find({space:spaceId}, {sort: {order: 1, created: 1}})

	Site: ->
		siteId = Session.get("siteId")
		if siteId
			return db.cms_sites.findOne({_id: siteId})

	isSitePublic: (siteId)->
		siteId = if siteId then siteId else Session.get("siteId")
		site = if siteId then db.cms_sites.findOne({_id: siteId}) else null
		return site?.visibility == "public"

	siteVisibilityIcon: (siteId)->
		siteId = if siteId then siteId else Session.get("siteId")
		site = if siteId then db.cms_sites.findOne({_id: siteId}) else null
		if site?.visibility == "public"
			return "ion-ios-world text-success"
		else if site?.visibility == "team"
			return "ion-ios-people text-info"
		else
			return "ion-locked text-danger"

	siteVisibilityTip: (siteId)->
		siteId = if siteId then siteId else Session.get("siteId")
		site = if siteId then db.cms_sites.findOne({_id: siteId}) else null
		if site?.visibility == "public"
			return t "cms_sites_visibility_public"
		else if site?.visibility == "team"
			return t "cms_sites_visibility_team"
		else
			return t "cms_sites_visibility_private"

	isSiteOwner: (siteId) ->
		siteId = if siteId then siteId else Session.get("siteId")
		if siteId
			site = db.cms_sites.findOne({_id: siteId})
			return site?.owner == Meteor.userId()

	isSiteAdmin: (siteId)->
		siteId = if siteId then siteId else Session.get("siteId")
		if siteId
			site = db.cms_sites.findOne({_id: siteId})
			return site?.admins?.includes(Meteor.userId())

	isCategoryAdmin: (categoryId)->
		siteId = Session.get("siteId")
		if siteId
			site = db.cms_sites.findOne({_id: siteId})
			return site?.admins?.includes(Meteor.userId())
		return false

	isPostAuthor: ()->
		if CMS.helpers.isSiteAdmin()
			return true

		postId = FlowRouter.current().params.postId
		if postId
			post = db.cms_posts.findOne({_id: postId})
			return post?.author == Meteor.userId()
		return false

	Tags: ->
		siteId = Session.get("siteId")
		if siteId
			return db.cms_tags.find({site: siteId})
	Tag: ->
		tag = Session.get("siteTag")
		return tag

	Markdown: (text)->
		if text
			return Spacebars.SafeString(Markdown(text))

	SafeString: (text)->
		if text
			return Spacebars.SafeString(text)

	subsReady: ()->
		return Steedos.subsBootstrap.ready() and Steedos.subs["Site"].ready() and Steedos.subs["Sites"].ready()

	PostListSelector: ->
		siteId = Session.get("siteId")
		categoryId = Session.get("siteCategoryId")
		unless categoryId
			categoryId = null
		userId = Meteor.userId()
		unless userId
			return make_a_bad_selector: 1

		organizations = Steedos.getUserOrganizations true

		searchKey = ""
		if Session.get("post_search_val")
			searchKey = Session.get("post_search_val")

		query = 
			$and: [
				{
					site: siteId
					title: {
						$regex: searchKey,
						$options: "i"
					}
				}
			]

		isAdmin = Steedos.isSpaceAdmin() or CMS.helpers.isSiteOwner(siteId)
		unless isAdmin
			query.$and.push
				$or: [{
					visibility:{$exists:false}
				},{
					visibility:{$ne:"private"}
				},{
					author:userId
				},{
					"members.organizations":{$in:organizations}
				},{
					"members.users":{$in:[userId]}
				}]

		if categoryId
			query.$and.push(category: categoryId)

		return query

	isSiteDropdownMenuNotEmpty: (siteId)->
		siteId = if siteId then siteId else Session.get("siteId")
		return CMS.helpers.isSitePublic(siteId) or CMS.helpers.isSiteOwner(siteId) or CMS.helpers.isSiteAdmin(siteId)

	isPostDropdownMenuNotEmpty: (siteId)->
		return CMS.helpers.isSitePublic() or CMS.helpers.isPostAuthor()

	isProduction: ()->
		return Meteor.isProduction

	allSiteCount: ()->
		sites = Steedos.spaces().map (obj) ->
			return db.cms_sites.find({space:obj._id}).fetch()
		counts = 0
		sites.forEach (arr) ->
			counts += arr.length
		return counts

	homeSubsReady: ()->
		return Steedos.subsBootstrap.ready() and Steedos.subs["Sites"].ready() and Steedos.subs["CmsUnreads"].ready()

	homePostsSubsReady: ()->
		return Steedos.subs["CmsHomePosts"].ready()

	spacesWithSite: ()->
		return db.spaces.find({_id: Session.get("spaceId")})?.fetch().filter (space)->
			return db.cms_sites.find({space:space._id}).count()

	homeSitesPosts: (siteId)->
		return db.cms_posts.find({site:siteId}).fetch()

	# isPostsUnread: (postId)->
	# 	return db.cms_unreads.find({post:postId}).fetch()

	isSpaceAdmin: ()->
		userId = Meteor.userId()
		spaceId = Steedos.spaceId()
		return Steedos.isSpaceAdmin(spaceId,userId)

	adminSapceCount: ()->
		return db.spaces.find({"admins":{$in:[Meteor.userId()]}}).count()