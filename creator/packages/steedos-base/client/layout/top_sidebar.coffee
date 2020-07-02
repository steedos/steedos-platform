Template.topSidebar.helpers

	apps: ()->
		return Steedos.getSpaceApps()

	menuClass: (app_id)->
		path = Session.get("router-path")
		if path?.startsWith "/" + app_id or path?.startsWith "/app/" + app_id
			return "active";

Template.topSidebar.events

	'click [name="open_apps_btn"]': (event) ->
		Modal.show "app_list_box_modal"

	'click .steedos-help': (event) ->
		Steedos.showHelp();