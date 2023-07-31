
autoGoApp = (appId)->
	currentApp = Creator.getApp(appId)
	if currentApp?.isExternalUrl
		if /^http(s?):\/\//.test(currentApp.path)
			if currentApp.blank
				window.open(currentApp.path)
			else
				window.location.href = currentApp.path
		else
			FlowRouter.go currentApp.path
	else
		menus = Creator.getAppMenus(appId)
		first_menu = _.first(menus)
		if first_menu
			menu = Object.assign({}, first_menu, {target: false}) # 自动进入的应用强制不以新窗口打开
			if menu.type == 'url' && menu.is_use_iframe
				FlowRouter.go menu.path
			else
				url = Creator.getAppMenuUrl menu
				FlowRouter.go url
		else
			FlowRouter.go '/app/' + appId

Template.creator_app_home.onRendered ()->
	this.autorun ->
		isBootstrapLoaded = Creator.bootstrapLoaded.get()
		if !_.has(FlowRouter.current().params,'app_id')
			firstApp = Steedos.getFirstApp()
			if isBootstrapLoaded && firstApp
					autoGoApp(firstApp.code || firstApp.id)
		else
			appId = Session.get('app_id')
			if isBootstrapLoaded && appId
				autoGoApp(appId)