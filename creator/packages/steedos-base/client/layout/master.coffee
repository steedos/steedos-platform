Template.masterLayout.onCreated ->
	self = this;

	# self.minHeight = new ReactiveVar(
	# 	$(window).height());

	# $(window).resize ->
	# 	self.minHeight.set($(window).height());

Template.masterLayout.onRendered ->

	# self = this;
	# self.minHeight.set($(window).height());




Template.masterLayout.helpers 
	# minHeight: ->
	# 	return Template.instance().minHeight.get() + 'px'
	
	subsReady: ->
		return Steedos.subsBootstrap.ready()

Template.masterLayout.events
	"click #navigation-back": (e, t) ->
		NavigationController.back(); 


