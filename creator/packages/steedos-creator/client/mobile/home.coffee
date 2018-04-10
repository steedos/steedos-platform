Template.homeMenu.onRendered ->

Template.homeMenu.helpers Creator.helpers

Template.homeMenu.helpers
	apps: ()->
		apps = []
		_.each Creator.Apps, (v, k)->
			if v.visible != false
				if v._id
					v.url = Steedos.absoluteUrl("/app/#{v._id}/");
				
				apps.push v
		
		return apps

Template.homeMenu.events
	'click .go-admin-menu': (event, template)->
		FlowRouter.go(Steedos.absoluteUrl '/admin')