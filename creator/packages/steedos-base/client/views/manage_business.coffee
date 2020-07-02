Template.manageBusiness.helpers


Template.manageBusiness.events
	'click .btn-manage-back': (event, template) ->
		FlowRouter.go("/workbench")


Template.workbench.onRendered ->
	$("body").addClass("no-sidebar")

Template.workbench.onDestroyed ->
	$("body").removeClass("no-sidebar")