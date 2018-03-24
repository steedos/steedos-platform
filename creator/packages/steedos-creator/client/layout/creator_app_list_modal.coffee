Template.creator_app_list_modal.helpers Creator.helpers

Template.creator_app_list_modal.helpers
	apps: ()->
		return Creator.getVisibleApps()

	app_objects: ()->
		objects = []
		_.each Creator.getVisibleAppsObjects(), (object_name)->
			app_obj = Creator.getObject(object_name)
			if app_obj.permissions.get().allowRead && app_obj.is_enable && !app_obj.hidden
				objects.push app_obj
		return objects


	app_url: ()->
		return Steedos.absoluteUrl(this.url + "/")

	object_url: ()->
		return Creator.getObjectUrl(this.name, null)

	spaceName: ->
		if Session.get("spaceId")
			space = db.spaces.findOne(Session.get("spaceId"))
			if space
				return space.name
		return t("none_space_selected_title")

	spacesSwitcherVisible: ->
		return db.spaces.find().count()>1;

	spaces: ->
		return db.spaces.find();


Template.creator_app_list_modal.events
	'click .control-app-list': (event) ->
		$(event.currentTarget).closest(".app-sction-part-1").toggleClass("slds-is-open")

	'click .control-object-list': (event) ->
		$(event.currentTarget).closest(".app-sction-part-2").toggleClass("slds-is-open")

	'click .object-launcher-link,.app-launcher-link': (event, template) ->
		Modal.hide(template)

	'click .switchSpace': (event, template)->
		Steedos.setSpaceId(this._id)
		# 获取路由路径中第一个单词，即根目录
		rootName = FlowRouter.current().path.split("/")[1]
		FlowRouter.go("/#{rootName}")
		Modal.hide(template)