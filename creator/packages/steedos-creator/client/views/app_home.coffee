Template.creator_app_home.onRendered ()->
	this.autorun ->
		isBootstrapLoaded = Creator.bootstrapLoaded.get()
		appId = Session.get('app_id')
		if isBootstrapLoaded && appId
			dashboard = Creator.getAppDashboard()
			unless dashboard
				dashboard = Creator.getAppDashboardComponent()
			if dashboard and !Steedos.isMobile()
				FlowRouter.go "/app/#{appId}/home"
			else
				menus = Creator.getAppMenus()
				first_menu = _.first(menus)
				if first_menu
					objectHomeComponent = Session.get("object_home_component")
					if objectHomeComponent
						FlowRouter.go "/app/" + appId + "/" + first_menu.id
					else
						menu = Object.assign({}, first_menu, {target: false}) # 自动进入的应用强制不以新窗口打开
						url = Creator.getAppMenuUrl menu
						FlowRouter.go url