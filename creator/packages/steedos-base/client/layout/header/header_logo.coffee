Template.steedosHeaderLogo.helpers
	spaceAvatar: ->
		avatar = db.spaces.findOne(Steedos.getSpaceId())?.avatar
		if avatar
			return Steedos.absoluteUrl("/api/files/avatars/#{avatar}")
		else
			locale = Steedos.locale()
			if locale == "zh-cn"
				return Steedos.absoluteUrl(Theme.space_logo)
			else
				return Steedos.absoluteUrl(Theme.space_logo_en)

	isSpaceOwner: (event)->
		return Steedos.isSpaceOwner(Steedos.getSpaceId())

	logoMiniUrl: ()->
		locale = Steedos.locale()
		if locale == "zh-cn"
			return Theme.icon
		else
			return Theme.icon_en

Template.steedosHeaderLogo.events
	'click .logo': (event) ->
		if db.spaces.find().count() > 1
			Modal.show "space_switcher_modal"
		else
			if Steedos.isForceBindPhone and !Accounts.isPhoneVerified()
				# 强制绑定手机号时，如果当前用户没有绑定手机号，则禁用跳转到首页功能
				return
			FlowRouter.go("/")

	'click .edit-space': (event)->
		if Steedos.isSpaceOwner(Steedos.spaceId())
			AdminDashboard.modalEdit('spaces', Steedos.spaceId())

		event.stopPropagation()
#		event.preventDefault()