Meteor.startup ->

	Tracker.autorun (c) ->
		user = Meteor.user()
		locale = Steedos.getLocale()
		if locale == "zh-cn"
			locale = "zh-CN"
			moment.locale("zh-cn")
		else
			locale = "en"
			moment.locale("en")

		Session.set("is_tap_loaded", false)
		TAPi18n.setLanguage(locale)
			.done ->
				Session.set("is_tap_loaded", true)
			.fail (error_message)->
				console.log(error_message)
