Template.creator_about_content.onCreated ->

Template.creator_about_content.onRendered ->

Template.creator_about_content.helpers Creator.helpers

Template.creator_about_content.helpers

	steedosInfoVersion: ->
		return Creator.Plugins["@steedos/core"]?.version

	platformEnterPriseInfo: ->
		info = Steedos.getProduct('platform-enterprise', Session.get('spaceId'))
		if !_.isEmpty info
			return info
		return
	
	dateFormat: (date)->
		return Steedos.dateFormat(date)


Template.creator_about_content.events
	'click .steedos-about': (event)->
		Steedos.openWindow("https://www.steedos.com/");