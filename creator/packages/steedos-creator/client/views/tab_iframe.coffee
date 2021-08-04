Template.creator_tab_iframe.helpers
	subsReady: ->
		return Steedos.subsBootstrap.ready()
	url: ->
		currentTabId = Session.get("tab_name")
		currentAppMenus = Creator.getAppMenus()
		if currentAppMenus && currentAppMenus.length
			currentMenu = currentAppMenus.find (menu)->
				return menu.id == currentTabId
			if currentMenu
				return Creator.getAppMenuUrl currentMenu

Template.creator_tab_iframe.events

Template.creator_tab_iframe.onCreated ->

Template.creator_tab_iframe.onRendered ->
	# 去除客户端右击事件
	Steedos.forbidNodeContextmenu window, "#app_iframe"

Template.creator_tab_iframe.onDestroyed ->

