Template.creator_about_content.onCreated ->

Template.creator_about_content.onRendered ->

Template.creator_about_content.helpers Creator.helpers

Template.creator_about_content.helpers

	steedosInfoVersion: ->
		return Creator.Plugins["@steedos/core"]?.version


Template.creator_about_content.events
	'click .steedos-about': (event)->
		Steedos.openWindow("https://www.steedos.com/");