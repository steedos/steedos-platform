Template.notFoundLayout.onCreated ->
	self = this;

Template.notFoundLayout.onRendered ->


Template.notFoundLayout.helpers 
	
	subsReady: ->
		return Steedos.subsBootstrap.ready()

Template.notFoundLayout.events
	"click #navigation-back": (e, t) ->
		NavigationController.back(); 


