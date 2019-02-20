Template.creator_about.onCreated ->

Template.creator_about.onRendered ->

Template.creator_about.helpers Creator.helpers

Template.creator_about.helpers

	steedosInfoVersion: ->
		Steedos.Info.version

	steedosCommitDate: ->
		if Steedos.Info.commit
			moment(new Date(Steedos.Info.commit.date)).format("YYYY-MM-DD HH:mm:ss")
	steedosBuildDate: ->
		if Steedos.Info.build
			moment(new Date(Steedos.Info.build.date)).format("YYYY-MM-DD HH:mm:ss")

Template.creator_about.events
	'click .steedos-about': (event)->
		Steedos.openWindow("https://www.steedos.com/");