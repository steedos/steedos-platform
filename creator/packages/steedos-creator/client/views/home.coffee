Template.creator_home.helpers Creator.helpers

Template.creator_home.helpers
	apps: ()->
		apps = []
		_.each Creator.Apps, (v, k)->
			if v.visible != false
				if v._id
					v.url = Steedos.absoluteUrl("/app/#{v._id}/");
				
				apps.push v
		
		return apps

Template.creator_home.events

Template.creator_home.onRendered ->

Template.creator_home.onCreated ->