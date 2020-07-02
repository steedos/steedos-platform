Template.printLayout.onCreated ->

	calendarsSub = Steedos.subs["Calendars"]
	if calendarsSub
		calendarsSub.clear()

	self = this;

	self.minHeight = new ReactiveVar(
		$(window).height());

	$(window).resize ->
		self.minHeight.set($(window).height());

Template.printLayout.onRendered ->

	self = this;
	self.minHeight.set($(window).height());

	$(window).resize();


Template.printLayout.helpers 
	minHeight: ->
		return Template.instance().minHeight.get() + 'px'
	
	subsReady: ->
		return Steedos.subsBootstrap.ready() && Steedos.subs["Instance"].ready() && Steedos.subs["instance_data"].ready()