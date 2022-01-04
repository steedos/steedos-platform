

Template.creator_app_list_modal.helpers Creator.helpers

Template.creator_app_list_modal.helpers
	apps: ()->
		return Session.get("app_menus")

	app_objects: ()->
		objects = []
		_.each Creator.getVisibleAppsObjects(), (object_name)->
			app_obj = Creator.getObject(object_name)
			if app_obj.permissions.get().allowRead
				objects.push app_obj
		return objects

	all_objects: ()->
		menus = []
		_.each Session.get("app_menus"), (menu)->
			appMenus = Creator.getAppMenus(menu.id)
			if appMenus.length
				menus = _.union(menus,appMenus)
		unionMenus = []
		unionId = []
		_.each menus, (menu)->
			if !unionId.includes(menu.id)
				unionMenus.push(menu);
				unionId.push(menu.id);
		return unionMenus
	app_url: ()->
		app = Creator.getApp(this.id)
		if app?.url
			if /^http(s?):\/\//.test(app.url)
				return app.url
			else
				return Creator.getRelativeUrl(app.url);
		else if this.id
			return Creator.getRelativeUrl("/app/#{this.id}/");
	
	app_target: ()->
		app = Creator.getApp(this.id)
		if app?.is_new_window
			return "_blank"
		else
			return ""

	object_url: ()->
		return Steedos.absoluteUrl("/app/-/#{this.id}")

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
		Modal.hide(template)
		switchToSpaceId = this._id
		Meteor.defer ()->
			Steedos.setSpaceId(switchToSpaceId)
			FlowRouter.go("/")

	
	'click .app-sction-part-1 .slds-section__content .app-launcher-link': (event)->
		appid = event.currentTarget.dataset.appid
		if appid && Creator.openApp
			Creator.openApp appid, event