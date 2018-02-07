Template.creatorSidebar.helpers Creator.helpers

Template.creatorSidebar.helpers
	
	app_id: ()->
		return Session.get("app_id")

	app_name: ()->
		app = Creator.getApp()
		return app?.name

	app_objects: ()->
		app = Creator.getApp()
		return app?.objects

	object_i: ()->
		return Creator.Objects[this]

	object_class_name: (obj)->
		if (obj == FlowRouter.getParam("object_name"))
			return "active"

	object_url: ()->
		return Creator.getObjectUrl(this, null)