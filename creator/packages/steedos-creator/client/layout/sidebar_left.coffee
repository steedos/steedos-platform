Template.creatorSidebarLeft.helpers
	app_id: ()->
		return Session.get("app_id")

	app_name: (_id)->
		app = Creator.getApp(_id)
		unless app
			return ""
		return if app.label then t(app.label) else t(app.name)

	object_i: ()->
		return Creator.getObject(this)

	app_objects: (_id)->
		menus = Creator.getAppMenus(_id)
		return menus

	isActive: (obj, appId)->
		if (obj == Session.get("object_name") && appId == Session.get("app_id"))
			return true

	hideObjects: (_id)->
		app = Creator.getApp(_id)
		if app and app._id == "admin"
			return true
		else
			return false

	object_url: (_id)->
		unless _id
			_id = "-"
		# return Creator.getRelativeUrl("/app/#{_id}/#{String(this)}")
		if this.type == "url"
			# TODO: this中无is_new_window, 有target, 需要后续fix.
			if this.is_new_window
				return Creator.getAppMenuUrl this
			else
				return "/app/-/tab/#{this.id}"
		else
			return this.path

	settings_url: ()->
		return Creator.getRelativeUrl('/user_settings')

	spaceName: ->
		if Session.get("spaceId")
			space = db.spaces.findOne(Session.get("spaceId"))
			if space
				return space.name
		return t("none_space_selected_title")

	getApps: ->
		return Session.get("app_menus")
		# return _.filter Creator.getVisibleApps(true), (item)->
		# 	return item._id !='admin' && !_.isEmpty(item.mobile_objects)
		# 	return item._id !='admin' && (!_.isEmpty(item.mobile_objects) || !_.isEmpty(item.tabs))

	logoUrl: ()->
		avatar = db.spaces.findOne(Steedos.getSpaceId())?.avatar
		if avatar
			return Steedos.absoluteUrl("/api/files/avatars/#{avatar}")
		else
			logo_url = "/packages/steedos_creator/assets/logo-square.png"
			if(Meteor.user()?.locale != 'zh-cn')
				logo_url = "/packages/steedos_creator/assets/logo-square.en-us.png"
			return Creator.getRelativeUrl(logo_url)

Template.creatorSidebarLeft.events
	"click #sidebarSwitcherButton": (e, t)->
		Modal.show("mobile_apps_modal")
	"click .settings-btn": (e, t)->
		FlowRouter.go '/user_settings'
	'click .sidebar-backdrop': (e, t)->
		$("#sidebar-left").addClass('hidden')
		$(".steedos").removeClass('move--right')
	'click #sidebar-left': (e, t)->
		$("#sidebar-left").addClass('hidden')
		$(".steedos").removeClass('move--right')
		