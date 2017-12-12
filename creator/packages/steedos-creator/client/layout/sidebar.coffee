Template.creatorSidebar.helpers
	app_objects: ()->
		return Session.get("app_objects")

	is_current_object: ()->
		return this == FlowRouter.getParam("object_name")

	object: ()->
		return Creator.Objects[this]