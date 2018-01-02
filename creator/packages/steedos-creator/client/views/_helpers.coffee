Creator.helpers =

	object_name: ()->
		return Session.get("object_name")
		
	object: ()->
		return Creator.getObject(Session.get("object_name"))