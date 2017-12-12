Template.creatorSidebar.helpers
	app_objects: ()->
		return Session.get("app_objects")

	object_i: ()->
		return Creator.Objects[this]

	object_class_name: (obj)->
		if (obj == FlowRouter.getParam("object_name"))
			return "active"
