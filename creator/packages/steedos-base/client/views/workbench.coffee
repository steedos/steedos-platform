Template.workbench.helpers

	apps: ()->
		return Steedos.getSpaceApps()

	toggleIcon: (icon) ->
		if !icon
			return

		return icon.replace(/-outline/ig,"")

Template.workbench.events

	'click .workbench .weui-cell-apps': (event) ->
		Steedos.openApp event.currentTarget.dataset.appid

	'click .workbench .weui-cell-manage': (event) ->
		FlowRouter.go("/workbench/manage")
		

Template.workbench.onRendered ->
	$("body").addClass("no-sidebar")

Template.workbench.onDestroyed ->
	$("body").removeClass("no-sidebar")


