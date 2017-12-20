Template.creator_app_list_modal.helpers
	arr: ()->
		return Array(1,2,3,4,5,6,7,8)

Template.creator_app_list_modal.events
	'click .control-uiButton': (event) ->
		$(event.currentTarget).closest(".app-sction").toggleClass("collapsed")