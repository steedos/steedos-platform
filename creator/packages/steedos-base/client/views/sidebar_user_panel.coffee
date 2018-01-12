Template.sidebarUserPanel.helpers

	spaceAvatar: ->
		avatar = db.spaces.findOne(Steedos.spaceId())?.avatar
		if avatar
			return Steedos.absoluteUrl("/api/files/avatars/#{avatar}")
		else
			locale = Steedos.locale()
			if locale == "zh-cn"
				return Steedos.absoluteUrl(Theme.space_logo)
			else
				return Steedos.absoluteUrl(Theme.space_logo_en)

Template.sidebarUserPanel.events

	'click .top-sidebar': ()->
		FlowRouter.go("/springboard");