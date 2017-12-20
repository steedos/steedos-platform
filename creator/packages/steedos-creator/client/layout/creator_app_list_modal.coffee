Template.creator_app_list_modal.helpers
	apps: ()->
		return Steedos.getSpaceApps()

	app_objects: ()->
		app = Creator.getApp()
		return app?.objects

	object_i: ()->
		return Creator.Objects[this]

	object_url: ()->
		return Creator.getObjectUrl(this, null)


Template.creator_app_list_modal.events
	'click .control-app-list': (event) ->
		$(event.currentTarget).closest(".app-sction-part-1").toggleClass("slds-is-open")

	'click .control-project-list': (event) ->
		$(event.currentTarget).closest(".app-sction-part-2").toggleClass("slds-is-open")

	'click .object-launcher-link, .app-launcher-link': (event, template) ->
		Modal.hide(template)