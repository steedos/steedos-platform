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
		recordId = Session.get("postId")
		# record = db.cms_posts.findOne({_id:recordId})
		objectName = "cms_posts"
		object = Creator.getObject(objectName)
		collection_name = object.label
		Session.set("action_fields", undefined)
		Session.set("action_collection", "Creator.Collections.#{object._collection_name}")
		Session.set("action_collection_name", collection_name)
		Session.set("action_save_and_insert", true)
		Creator.executeAction objectName, {todo: "standard_edit"}, recordId

	'click .btn-remove-post': (event, template) ->
		recordId = Session.get("postId")
		record = db.cms_posts.findOne({_id:recordId})
		objectName = "cms_posts"
		object = Creator.getObject(objectName)
		collection_name = object.label
		Session.set("action_fields", undefined)
		Session.set("action_collection", "Creator.Collections.#{object._collection_name}")
		Session.set("action_collection_name", collection_name)
		action_record_title = record[object.NAME_FIELD_KEY]
		Creator.executeAction objectName, {todo: "standard_delete"}, recordId, action_record_title, null, ()-> 
			# just route to the parent router path
			currentPath = FlowRouter.current().path
			FlowRouter.go currentPath.substr(0,currentPath.lastIndexOf("/p/"))

	'click #post_update': (event)->

	'click #post_remove': (event)->

Template.cms_post_buttons.onRendered ->
	$('[data-toggle="tooltip"]').tooltip()
