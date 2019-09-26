Template.workflowLayout.helpers 
	subsReady: ->
		return Steedos.subsBootstrap.ready() && Steedos.subsSpaceBase.ready()

Template.workflowLayout.events
	"click #navigation-back": (e, t) ->
		NavigationController.back(); 
