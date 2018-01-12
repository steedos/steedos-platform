Template.steedosHeader.helpers
	appBadge: (appId)->
		if appId == "workflow"
			return Steedos.getBadge("workflow")
		else if appId == "cms"
			return Steedos.getBadge("cms")
		
		appUrl = db.apps.findOne(appId).url
		if appUrl == "/calendar"
			return Steedos.getBadge(appId)

		return ""

	subsReady: ->
		return Steedos.subsBootstrap.ready("steedos_keyvalues") && Steedos.subsSpaceBase.ready("apps")

	eachEnd: (index)->
		appCount = Steedos.getSpaceApps().count()
		if index == appCount - 1
			Session.set("base_each_apps_end", (new Date()).getTime())

	isShowMenuAppsLink: ->
		return !Session.get("apps")


Template.steedosHeader.events
	'click .menu-app-link': (event) ->
		Steedos.openApp event.currentTarget.dataset.appid

	'click .menu-apps-link': (event) ->
		Modal.show "app_list_box_modal"

	'click .steedos-help': (event) ->
		Steedos.showHelp();

Template.steedosHeader.displayControl = ()->
	maxWidth = $(".navbar-nav-apps").width() - 90;
	sumWidth = 33;
	$(".navbar-nav-apps").children().each (index)->
		sumWidth += $(this).width()
		if sumWidth >= maxWidth && index < $(".navbar-nav-apps").children().length - 1 && (!$(this).attr("class") || $(this).attr("class").indexOf('active') < 0)
			$(this).hide()
		else
			$(this).show()

Template.steedosHeader.onCreated ()->
	$(window).resize ->
		Template.steedosHeader.displayControl()

Template.steedosHeader.onRendered ()->
	this.autorun (computation)->
		db.steedos_keyvalues.findOne({user:Steedos.userId(),key:"zoom"})
		Session.get("base_each_apps_end")
		Template.steedosHeader.displayControl()
	$('[data-toggle="offcanvas"]').on "click", ()->
		#绑定offcanvas click事件，由于offcanvas过程有300毫秒的动作，此处延时调用header displayControl函数
		setTimeout ()->
			Template.steedosHeader.displayControl()
		, 301
