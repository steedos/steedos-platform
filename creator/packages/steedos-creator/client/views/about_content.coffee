Template.creator_about_content.onCreated ->

Template.creator_about_content.onRendered ->

Template.creator_about_content.helpers Creator.helpers

Template.creator_about_content.helpers

	steedosInfoVersion: ->
		Steedos.Info.version

	steedosCommitDate: ->
		if Steedos.Info.commit
			moment(new Date(Steedos.Info.commit.date)).format("YYYY-MM-DD HH:mm:ss")
	steedosBuildDate: ->
		if Steedos.Info.build
			moment(new Date(Steedos.Info.build.date)).format("YYYY-MM-DD HH:mm:ss")

Template.creator_about_content.events
	'click .steedos-about': (event)->
		Steedos.openWindow("https://www.steedos.com/");