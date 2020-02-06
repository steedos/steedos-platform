Template.cms_post_buttons.helpers CMS.helpers

Template.cms_post_buttons.events
	'click .btn-post-back': (event)->
		siteId = Session.get("siteId")
		siteCategoryId = Session.get("siteCategoryId")
		backURL =  "/cms/s/#{siteId}"
		if siteCategoryId
			backURL += "/c/#{siteCategoryId}"
		FlowRouter.go(backURL)

	'click .btn-edit-post': (event, template) ->
		postId = Session.get("postId")
		target = db.cms_posts.findOne({_id:postId})
		Session.set "cmDoc",target
		Session.set "is_create_new_post",false
		$('.btn-post-edit').click()

	'click .btn-remove-post': (event, template) ->
		AdminDashboard.modalDelete 'cms_posts', event.currentTarget.dataset.id,->
			# just route to the parent router path
			currentPath = FlowRouter.current().path
			FlowRouter.go currentPath.substr(0,currentPath.lastIndexOf("/p/"))

	'click #post_update': (event)->

	'click #post_remove': (event)->

Template.cms_post_buttons.onRendered ->
	$('[data-toggle="tooltip"]').tooltip()
