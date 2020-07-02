Template.cmsSidebar.helpers CMS.helpers

Template.cmsSidebar.helpers

	spaceId: ->
		if Session.get("spaceId")
			return Session.get("spaceId")
		else
			return localStorage.getItem("spaceId:" + Meteor.userId())

	liActive: (siteId)->
		if siteId == CMS.helpers.SiteId()
			return "active"

	isHomeActive: ->
		unless Session.get("siteId")
			return "active"

	spaces: ->
		if Session.get("spaceId")
			return db.spaces.find({_id: Session.get("spaceId")})

Template.cmsSidebar.events

	'click .main-header .logo': (event) ->
		Modal.show "app_list_box_modal"

	'keyup #post_search': (event) ->
		Session.set "post_search_val",$('#post_search').val()

	'click .btn-new-site': (event, template) ->
		Session.set "userOption","addSite"
		$('.btn-add-site').click();

	'click .header-app': (event, template) ->
		FlowRouter.go "/cms/"
		if Steedos.isMobile()
			# 手机上可能菜单展开了，需要额外收起来
			$("body").removeClass("sidebar-open")

	# "click .btn-preview-site": (e,t)->
	# 	url = Meteor.absoluteUrl("site/" + this._id)
	# 	Steedos.openWindow(url)
	# 	# 需要阻止浏览器执行其父标签A打开site详细界面的行为
	# 	event.preventDefault()
	# 	return false

	# 'click .btn-new-category': (event, template) ->
	# 	doc = {}
	# 	siteCategoryId = Session.get("siteCategoryId")
	# 	if siteCategoryId
	# 		doc.parent = siteCategoryId
	# 	AdminDashboard.modalNew 'cms_categories', doc

	# 	# 需要阻止浏览器执行其父标签A打开详细界面的行为
	# 	event.preventDefault()
	# 	return false
		
Template.cmsSidebar.onRendered ->
	$('[data-toggle="tooltip"]').tooltip()

