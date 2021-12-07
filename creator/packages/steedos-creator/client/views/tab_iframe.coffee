Template.creator_tab_iframe.helpers
	subsReady: ->
		return Steedos.subsBootstrap.ready()
	url: ->
		return Template.instance().iframeUrl.get()

Template.creator_tab_iframe.events

Template.creator_tab_iframe.onCreated ->
	this.iframeUrl = new ReactiveVar("")

Template.creator_tab_iframe.onRendered ->
	# 去除客户端右击事件
	Steedos.forbidNodeContextmenu window, "#app_iframe"
	self = this
	this.autorun ->
		self.iframeUrl.set("")
		currentTabId = Session.get("tab_name")
		currentAppMenus = Creator.getAppMenus()
		url = ""
		if currentAppMenus && currentAppMenus.length
			currentMenu = currentAppMenus.find (menu)->
				return menu.id == currentTabId
			if currentMenu
				url = Creator.getAppMenuUrlForInternet currentMenu
		Meteor.defer ()->
			self.iframeUrl.set(url)

Template.creator_tab_iframe.onDestroyed ->

