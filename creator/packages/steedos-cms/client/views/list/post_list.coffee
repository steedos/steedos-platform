Template.cms_post_list.helpers CMS.helpers

Template.cms_post_list.onRendered ->

	if !Steedos.isMobile() and !Steedos.isAndroidOrIOS()
		$(".post-list").perfectScrollbar({suppressScrollX: true});

Template.cms_post_list.events

	'click tbody > tr': (event) ->
		dataTable = $(event.target).closest('table').DataTable();
		row = $(event.target).closest('tr');
		rowData = dataTable.row(event.currentTarget).data();
		if (!rowData) 
			return;
		dataTable.$('tr.selected').removeClass('selected');
		row.addClass('selected');
		FlowRouter.go "#{CMS.helpers.PostURL(rowData._id)}"

	'click .btn-new-post': (event, template) -
		objectName = "cms_posts"
		object = Creator.getObject(objectName)
		collection_name = object.label
		Session.set("action_fields", undefined)
		Session.set("action_collection", "Creator.Collections.#{objectName}")
		Session.set("action_collection_name", collection_name)
		Session.set("action_save_and_insert", true)
		Creator.executeAction objectName, {todo: "standard_new"}

	'click .btn-new-category': (event, template) ->
		doc = {}
		siteCategoryId = Session.get("siteCategoryId")
		if siteCategoryId
			doc.parent = siteCategoryId
		AdminDashboard.modalNew 'cms_categories', doc

	'click .btn-edit-category': (event, template) ->
		AdminDashboard.modalEdit 'cms_categories', event.currentTarget.dataset.id

	'click .btn-remove-category': (event, template) ->
		category = CMS.helpers.Category()
		AdminDashboard.modalDelete 'cms_categories', event.currentTarget.dataset.id, ->
			parentId = category.parent
			category = CMS.helpers.Category()
			unless category
				siteId = Session.get("siteId")
				if parentId
					FlowRouter.go "/cms/s/#{siteId}/c/#{parentId}"
				else
					FlowRouter.go "/cms/s/#{siteId}"

	"click .btn-preview-post": (event, template)->
		siteCategoryId = Session.get("siteCategoryId")
		if siteCategoryId
			catUrl = "/c/#{siteCategoryId}"
		else
			catUrl = ""
		url = Meteor.absoluteUrl("site/#{Session.get("siteId")}#{catUrl}")
		Steedos.openWindow(url)

	'click .btn-edit-site': (event, template) ->
		siteId = Session.get("siteId")
		target = db.cms_sites.findOne({_id:siteId})
		Session.set "userOption","editSite"
		Session.set "cmDoc",target
		$('.btn-site-edit').click();

	'click .btn-remove-site': (event, template) ->
		AdminDashboard.modalDelete 'cms_sites', event.currentTarget.dataset.id, ->
			FlowRouter.go "/cms"

