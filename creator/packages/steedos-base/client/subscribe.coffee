Steedos.subsBootstrap = new SubsManager();
Steedos.subsBootstrap.subscribe('userData')
Steedos.subsBootstrap.subscribe('my_spaces')
Steedos.subsBootstrap.subscribe("steedos_keyvalues")

Tracker.autorun (c)->
	if Steedos.subsBootstrap.ready("my_spaces")
		if Meteor.userId() and not Meteor.loggingIn()
			# 只在已登录的情况下设置工作区ID
			spaceId = Steedos.getSpaceId()
			if spaceId
				console.log (spaceId)
				Steedos.setSpaceId(spaceId)
			# else
			# 	FlowRouter.go("/accounts/setup/space")
		
Steedos.subsSpaceBase = new SubsManager();

Tracker.autorun (c)->
	spaceId = Session.get("spaceId")

	Steedos.subsSpaceBase.clear();
	if spaceId
		Steedos.subsSpaceBase.subscribe("apps", spaceId)
		Steedos.subsSpaceBase.subscribe("my_space_user", spaceId)
		Steedos.subsSpaceBase.subscribe("my_organizations", spaceId)
		Steedos.subsSpaceBase.subscribe("space_settings", spaceId)


# Meteor.startup之前就从localStorage读取并设置字体大小及背景图
accountZoomValue = {}
accountZoomValue.name = localStorage.getItem("accountZoomValue.name")
accountZoomValue.size = localStorage.getItem("accountZoomValue.size")
Steedos.applyAccountZoomValue accountZoomValue

accountBgBodyValue = {}
accountBgBodyValue.url = localStorage.getItem("accountBgBodyValue.url")
accountBgBodyValue.avatar = localStorage.getItem("accountBgBodyValue.avatar")
Steedos.applyAccountBgBodyValue accountBgBodyValue

# 工作区登录注册界面需要订阅指定工作区的LOGO图片
Steedos.subs["SpaceAvatar"] = new SubsManager();

Meteor.startup ->
	Tracker.autorun (c)->
		if Steedos.subsBootstrap.ready("steedos_keyvalues")
			accountZoomValue = Steedos.getAccountZoomValue()
			Steedos.applyAccountZoomValue accountZoomValue,true

			accountBgBodyValue = Steedos.getAccountBgBodyValue()
			Steedos.applyAccountBgBodyValue accountBgBodyValue,true

	Tracker.autorun (c)->
		locale = Steedos.locale()
		$("body").addClass("locale-#{locale}")


	Tracker.autorun (c)->
		spaceId = Session.get("spaceId")
		if spaceId and Meteor.userId()
			Meteor.call "updateServerSession", spaceId,
				(error, result) ->
					if error
						console.log error
