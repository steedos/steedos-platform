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
		app = Creator.getApp(_id)
		objects = []
		if app
			_.each app.mobile_objects, (v)->
				obj = Creator.getObject(v)
				if obj?.permissions.get().allowRead and !obj.hidden
					objects.push v
		return objects

	isActive: (obj)->
		if (obj == FlowRouter.getParam("object_name"))
			return true

	hideObjects: (_id)->
		app = Creator.getApp(_id)
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

	getApps: ->
		return _.filter Creator.getVisibleApps(true), (item)->
			return item._id !='admin' && !_.isEmpty(item.mobile_objects)

Template.creatorSidebarLeft.events
	"click #sidebarSwitcherButton": (e, t)->
		Modal.show("mobile_apps_modal")
	"click .settings-btn": (e, t)->
		console.log('click .settings-btn');
		FlowRouter.go '/user_settings'