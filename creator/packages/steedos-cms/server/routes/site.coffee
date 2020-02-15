Cookies = Npm.require("cookies")

Template.registerHelpers = (dict) ->
	_.each dict, (v, k)->
		Template.registerHelper k, v


Template.registerHelpers


	CategoryId: ()->
		return Template.instance().data.params.categoryId

	CategoryActive: (c)->
		categoryId = Template.instance().data.params.categoryId
		if categoryId == c
			return "active"

	Category: ()->
		categoryId = Template.instance().data.params.categoryId
		if categoryId
			return db.cms_categories.findOne(categoryId)

	ParentCategory: ()->
		categoryId = Template.instance().data.params.categoryId
		if categoryId
			c = db.cms_categories.findOne(categoryId)
			if c?.parent
				return db.cms_categories.findOne(c.parent)

	SubCategories: (parent)->
		if parent == "root"
			siteId = Template.instance().data.params.siteId
			return db.cms_categories.find({site: siteId, parent: null}, {sort: {order: 1, created: 1}})
		else
			return db.cms_categories.find({parent: parent}, {sort: {order: 1, created: 1}})
			
	SubCategoriesCount: (parent)->
		if parent == "root"
			siteId = Template.instance().data.params.siteId
			return db.cms_categories.find({site: siteId, parent: null}).count()
		else
			return db.cms_categories.find({parent: parent}).count()

	fromNow: (value)->
		return moment(value).fromNow()

	DateFormat: (value, formatString) ->
		if !formatString
			formatString = "YYYY-MM-DD"
		return moment(value).format(formatString)

	Posts: (categoryId, limit, skip)->
		if !limit 
			limit = 5
		skip = 0
		siteId = Template.instance().data.params.siteId
		if !siteId 
			return []
		if categoryId 
			return db.cms_posts.find({site: siteId, category: categoryId}, {sort: {postDate: -1}, limit: limit, skip: skip})
		else
			return db.cms_posts.find({site: siteId}, {sort: {postDate: -1}, limit: limit, skip: skip})

	PostsCount: (categoryId)->
		siteId = Template.instance().data.params.siteId
		if !siteId 
			return 0
		if categoryId 
			return db.cms_posts.find({site: siteId, category: categoryId}).count()
		else
			return db.cms_posts.find({site: siteId}).count()
	   
	PostSummary: ->
		if this.body
			return this.body.substring(0, 400)

	_: (key) ->
		return TAPi18n.__ key

	RecentPosts: (categoryId, limit, skip)->
		if !limit 
			limit = 5
		skip = 0
		siteId = Template.instance().data.params.siteId
		cat = db.cms_categories.findOne(categoryId)
		if !cat 
			return []
		children = cat.calculateChildren();
		children.push(categoryId)
		return db.cms_posts.find({site: siteId, category: {$in: children}}, {sort: {postDate: -1}, limit: limit, skip: skip})

	Markdown: (text)->
		if text
			return Spacebars.SafeString(Markdown(text))

	SafeString: (text)->
		if text
			return Spacebars.SafeString(text)

	PostAttachmentUrl: (attachment,isPreview)-> 
		url = Meteor.absoluteUrl("api/files/posts/#{attachment._id}/#{attachment.original.name}")
		if !(typeof isPreview == "boolean" and isPreview) and !Steedos.isMobile()
			url += "?download=true"
		return url

	IsImageAttachment: (attachment)->
		type = attachment?.original?.type
		return type?.startsWith("image/")

	IsHtmlAttachment: (attachment)->
		return attachment?.original?.type == "text/html"

	isProduction: ()->
		return Meteor.isProduction

Template.registerHelper 'Post', ->
	postId = Template.instance().data.params.postId
	if postId
		return db.cms_posts.findOne({_id: postId})


# Template.registerHelper 'Attachments', ()->
# 	postId = Template.instance().data.params.postId
# 	if postId
# 		post = db.cms_posts.findOne({_id: postId})
# 		if post and post.attachments
# 			return cfs.posts.find({_id: {$in: post.attachments}},{sort: {"uploadedAt": -1}}).fetch()

Template.registerHelper 'SiteId', ->
	siteId = Template.instance().data.params.siteId
	return siteId

Template.registerHelper 'Site', ->
	siteId = Template.instance().data.params.siteId
	if siteId
		return db.cms_sites.findOne({_id: siteId})

Template.registerHelper 'IndexPage', ->
	data = Template.instance().data
	if !data.params
		return false;
	else if data.params.categoryId
		return false
	else if data.params.postId
		return false
	else 
		return true

Template.registerHelper 'TagPage', ->
	tag = Template.instance().data.params.tag
	if tag
		return true
	return false

Template.registerHelper 'Tag', ->
	tag = Template.instance().data.params.tag
	return tag

Template.registerHelper 'PostPage', ->
	postId = Template.instance().data.params.postId
	if postId
		return true
	return false


Template.registerHelper 'equals', (a, b)->
	return a == b

renderSite = (req, res, next) ->
	site = db.cms_sites.findOne({_id: req.params.siteId})
	
	if !site
		res.writeHead 404
		res.end("Site not found")
		return

	cookies = new Cookies( req, res );
	userId = cookies.get("X-User-Id")
	authToken = cookies.get("X-Auth-Token")

	if userId and authToken
		hashedToken = Accounts._hashLoginToken(authToken)
		user = Meteor.users.findOne
			_id: userId,
			"services.resume.loginTokens.hashedToken": hashedToken

	unless site?.visibility == "public"
		res.writeHead 401
		res.end("Access Denied")
		return

	templateName = 'site_theme_' + site.theme
	layout = site.layout
	if !layout
		layout = Assets.getText('themes/default.html')
	SSR.compileTemplate('site_theme_' + site.theme, layout);

	# postId = req.params.postId
	# if postId
	# 	isPostIncSuc = db.cms_posts.direct.update {
	# 		_id: postId
	# 	}, $inc:
	# 		viewCount: 1
	# 	unless isPostIncSuc
	# 		console.error "addPostViewer while previewing site post Failed. cms_posts.update.$inc ...#{postId}"

	html = SSR.render templateName, 
		params: req.params

	res.end(html);

# JsonRoutes.add "get", "/site/:siteId", (req, res, next)->
#   res.statusCode = 302;
#   res.setHeader "Location", "./s/home"
#   res.end();

JsonRoutes.add "get", "/site/:siteId", renderSite  

JsonRoutes.add "get", "/site/:siteId/c/:categoryId", renderSite  

JsonRoutes.add "get", "/site/:siteId/p/:postId", renderSite  

JsonRoutes.add "get", "/site/:siteId/t/:tag", renderSite  