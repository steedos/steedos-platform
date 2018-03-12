Template.creator_app_list_modal.helpers Creator.helpers

Template.creator_app_list_modal.helpers
	apps: ()->
		apps = []
		_.each Creator.Apps, (v, k)->
			if v.visible != false
				apps.push v
		return apps

	app_objects: ()->
		objects = []
		_.each Creator.objectsByName, (v, k)->
			if v.permissions.get().allowRead
				objects.push v
		console.log "objects", objects
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