Template.contactsLayout.onCreated ->
	self = this;

	self.minHeight = new ReactiveVar(
		$(window).height());

	$(window).resize ->
		self.minHeight.set($(window).height());

Template.contactsLayout.onRendered ->

	self = this;
	self.minHeight.set($(window).height());

	$(window).resize();


Template.contactsLayout.helpers 
	minHeight: ->
		return Template.instance().minHeight.get() + 'px'
	
	subsReady: ->
		return Steedos.subsBootstrap.ready() && Steedos.subsSpaceBase.ready()

Template.contactsLayout.events
	"click #navigation-back": (e, t) ->
		NavigationController.back(); 
