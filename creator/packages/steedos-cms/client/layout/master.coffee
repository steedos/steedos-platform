Template.cmsLayout.helpers 
	
	subsReady: ->
		return Steedos.subsBootstrap.ready() && Steedos.subsSpaceBase.ready()

Template.cmsLayout.events
	"click #navigation-back": (e, t) ->
		NavigationController.back(); 
