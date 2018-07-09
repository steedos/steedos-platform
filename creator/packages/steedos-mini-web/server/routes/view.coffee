MarkdownIt = Npm.require('markdown-it')

getPostPrimaryTag = (space_id, post)->
	if _.isArray(post.categories) && post.categories.length > 0
		categorie = Creator.getCollection('post_category').findOne({_id: post.categories[0]})
		if categorie
			return {url: '/site/'+space_id+'/categorie/' + categorie._id, name: categorie.name}

getBlog = (space_id) ->
	blog = {}

#	_.forEach blog, (v, key)->
#		if _.has(blog[key], 'defaultValue')
#			blog[key] = blog[key].defaultValue

	blog.navigation = [{
		label: '首页', url: '/site/' +  space_id
	}]

	store = Creator.getCollection("vip_store").findOne({_id: space_id}, {fields: {avatar: 1, cover: 1, name: 1, description: 1}})
	blog.logo = store.avatar
	blog.title = store.name
	blog.description = store.description
	blog.cover_image = store.cover || @GlobalSettings.blog.cover_image.defaultValue
#	blog.icon = store.avatar
	blog.url = '/site/' +  space_id
	return  blog;

getPosts = (space_id, categorie) ->
	query = {space: space_id}
	if categorie
		query.categories = categorie

	posts = []
	Creator.getCollection("post").find(query, {sort: {modified: -1}}).forEach (post)->
		feature_image = if post.images?.length > 0 then post.images[0] else ''
		authors = []
		url = '/site/'+space_id+'/' + post._id
		primary_tag = getPostPrimaryTag(space_id, post)
		posts.push({
			feature_image: feature_image,
			title: post.name,
			summary: post.summary,
			url: url,
			primary_tag: primary_tag
		})
	return posts

getPostsPagination = (categorie)->
	pagination = {}
	query = {}
	if categorie
		query = {categories: categorie}

	post_count = Creator.getCollection("post").find(query,{fields: {_id: 1}}).count()

	pagination.total = post_count || 0

	return pagination


getBaseConfig = (space_id, template_type) ->
	return {
		"@blog": getBlog(space_id),
		"@labs": {},
		template_type: template_type,
		pagination: {},
		homeUrl: '/site/' + space_id
	}


getBody = (body_name, options) ->
	body = SSR.render body_name, options
	return body;

getView = (space_id, body, params, template_type)->
	layout = Assets.getText('themes/casper/default.hbs')
	templateName = 'casper_default'
	SSR.compileTemplate(templateName, layout);
	Template[templateName].helpers(WebHelpers)

	options = {
		params: params,
		body: body
	}
	_.extend(options, getBaseConfig(space_id, template_type))

	html = SSR.render templateName, options

	return '<!DOCTYPE html>' + html

# index: post list
JsonRoutes.add "get", "/site/:space_id", (req, res, next) ->

	template_type = 'home'

	space_id = req.params.space_id

	options = {
		posts: getPosts(space_id)
	}
	_.extend(options, getBaseConfig(space_id, template_type))

	body = getBody('casper_index', options)

	view = getView(space_id, body, req.params, template_type)
	res.end(view);

# categorie post list
JsonRoutes.add "get", "/site/:space_id/categorie/:_id", (req, res, next)->

	space_id = req.params.space_id

	template_type = 'tag'

	categorie = Creator.getCollection('post_category').findOne({_id: req.params._id})

	options = {
		posts: getPosts(space_id, req.params._id)
		name: categorie.name
	}
	_.extend(options, getBaseConfig(space_id, template_type))

	options.pagination = getPostsPagination(req.params._id)

	body = getBody('tag', options)

	view = getView(space_id, body, req.params, template_type)
	res.end(view);

# post detailed
JsonRoutes.add "get", "/site/:space_id/:_id", (req, res, next)->
	space_id = req.params.space_id

	template_type = 'post'

	post = Creator.getCollection("post").findOne({_id: req.params._id})

	feature_image = if post?.images?.length > 0 then post.images[0] else ''

	options = {feature_image: feature_image, title: post.name}

	_.extend(options, getBaseConfig(space_id, template_type))

	md = new MarkdownIt();

	options.primary_tag = getPostPrimaryTag(space_id, post)
	if post.description
		options.content = Spacebars.SafeString(md.render(post.description))
	else
		options.content = ''

	body = getBody('post', options)

	view = getView(space_id, body, req.params, template_type)
	res.end(view);