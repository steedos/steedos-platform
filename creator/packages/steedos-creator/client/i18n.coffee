Meteor.startup ->
	Tracker.autorun ()->
		if Session.get("steedos-locale") == "zh-cn"
			DevExpress.localization.locale("zh-CN")
			DevExpress.localization.loadDateLocale?("zh");
		else
			DevExpress.localization.locale("en")