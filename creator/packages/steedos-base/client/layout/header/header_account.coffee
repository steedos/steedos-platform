Template.headerAccount.helpers
	displayName: ->
		if Meteor.user()
			return Meteor.user().displayName()
		else
			return " "

	avatar: () ->
		return Meteor.user()?.avatar

	avatarURL: (avatar,w,h,fs) ->
		return Steedos.absoluteUrl("avatar/#{Meteor.userId()}?w=#{w}&h=#{h}&fs=#{fs}&avatar=#{avatar}");

	signOutUrl: ()->
		return Steedos.absoluteUrl("/steedos/logout")

Template.headerAccount.events
	'click .btn-logout': (event,template) ->
		$("body").addClass("loading")

	'click .steedos-download': () ->
		locale = Steedos.getLocale()
		country = locale.substring(3)
		if country = "cn"
			url = "https://www.steedos.com/cn/workflow/downloads/"
		else
			url = "https://www.steedos.com/us/workflow/downloads/"
		Steedos.openWindow(url)