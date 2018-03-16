Meteor.startup ->
	Tracker.autorun ()->
		if Session.get("steedos-locale") == "zh-cn"
			DevExpress.localization.locale("zh-CN")
		else
			DevExpress.localization.locale("en")