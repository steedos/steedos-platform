Template.steedosHeader.helpers
	appBadge: (appId)->
		workflow_categories = _.pluck(db.categories.find({app: appId}).fetch(), '_id')

		if appId == "workflow"
			if workflow_categories.length > 0
				return ''
#				return Steedos.getWorkflowCategoriesBadge(workflow_categories, Steedos.getSpaceId())
			return Steedos.getBadge("workflow")
		else if appId == "cms"
			return Steedos.getBadge("cms")

		appUrl = db.apps.findOne(appId).url
		if appUrl == "/calendar"
			return Steedos.getBadge(appId)
		else if /^\/?workflow\b/.test(appUrl)
			# 如果appId不为workflow，但是url为/workflow格式则按workflow这个app来显示badge
			if workflow_categories.length > 0
				return ''
#				return Steedos.getWorkflowCategoriesBadge(workflow_categories, Steedos.getSpaceId())
			return Steedos.getBadge("workflow")
		return ""

	subsReady: ->
		# 增加Meteor.loggingIn()判断的原因是用户在登出系统的短短几秒内，顶部左侧图标有可能会从工作工特定LOGO变成默认的华炎LOGO造成视觉偏差
		return Steedos.subsBootstrap.ready("steedos_keyvalues") && Steedos.subsSpaceBase.ready("apps") && !Meteor.loggingIn()

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
	last = null
	$(".navbar-nav-apps").children().each (index)->
		sumWidth += $(this).width()
		isActive = $(this).hasClass("active")
		if sumWidth >= maxWidth && index < $(".navbar-nav-apps").children().length - 1 && !isActive
			$(this).hide()
		else
			$(this).show()
			if sumWidth >= maxWidth && !last?.hasClass("active")
				last?.hide()
			last = $(this)

Template.steedosHeader.onCreated ()->
	$(window).resize ->
		Template.steedosHeader.displayControl()

Template.steedosHeader.onRendered ()->
	this.autorun (computation)->
		db.steedos_keyvalues.findOne({user:Steedos.userId(),key:"zoom"})
		Session.get("base_each_apps_end")
		Template.steedosHeader.displayControl()
	this.autorun ()->
		Steedos.getCurrentAppId()
		Meteor.defer(Template.steedosHeader.displayControl)
	$('[data-toggle="offcanvas"]').on "click", ()->
		#绑定offcanvas click事件，由于offcanvas过程有300毫秒的动作，此处延时调用header displayControl函数
		setTimeout ()->
			Template.steedosHeader.displayControl()
		, 301
