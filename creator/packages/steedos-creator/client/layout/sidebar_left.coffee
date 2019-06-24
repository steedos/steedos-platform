Template.creatorSidebarLeft.helpers
	app_id: ()->
		return Session.get("app_id")

	app_name: ()->
		app = Creator.getApp()
		unless app
			return ""
		return if app.label then t(app.label) else t(app.name)

	object_i: ()->
		return Creator.getObject(this)

	app_objects: ()->
		return Creator.getAppObjectNames()

	isActive: (obj)->
		if (obj == FlowRouter.getParam("object_name"))
			return true

	hideObjects: ()->
		app = Creator.getApp()
		if app and app._id == "admin"
			return true
		else
			return false

	object_url: ()->
		return Creator.getObjectFirstListViewUrl(String(this), null)

	spaceName: ->
		if Session.get("spaceId")
			space = db.spaces.findOne(Session.get("spaceId"))
			if space
				return space.name
		return t("none_space_selected_title")

Template.creatorSidebarLeft.events
	"click #sidebarSwitcherButton": (e, t)->
		Modal.show("mobile_apps_modal")
	"click .settings-btn": (e, t)->
		console.log('click .settings-btn');
		FlowRouter.go '/user_settings'