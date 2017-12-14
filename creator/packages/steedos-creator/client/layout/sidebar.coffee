Template.creatorSidebar.helpers
	
	app_id: ()->
		return Session.get("app_id")

	app_objects: ()->
		app = db.apps.findOne(Session.get("app_id"))
		console.log app
		return app?.objects

	object_i: ()->
		return Creator.Objects[this]

	object_class_name: (obj)->
		if (obj == FlowRouter.getParam("object_name"))
			return "active"
