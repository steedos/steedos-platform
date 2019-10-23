

Template.creator_app_list_modal.helpers Creator.helpers

Template.creator_app_list_modal.helpers
	apps: ()->
		return Creator.getVisibleApps(true)

	app_objects: ()->
		objects = []
		_.each Creator.getVisibleAppsObjects(), (object_name)->
			app_obj = Creator.getObject(object_name)
			if app_obj?.is_enable && app_obj.permissions.get().allowRead
				objects.push app_obj
		return objects


	app_url: ()->
		if this?.url
			if /^http:\/\//.test(this.url)
				return this.url
			else
				return Creator.getRelativeUrl(this.url);
		else if this._id
			return Creator.getRelativeUrl("/app/#{this._id}/");
	
	app_target: ()->
		if this?.is_new_window
			return "_blank"
		else
			return ""

	object_url: ()->
		return Steedos.absoluteUrl("/app/-/#{this.name}")

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