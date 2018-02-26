@Creator = {}
Creator.Objects = {}
Creator.Collections = {}


Creator.getObject = (object_name)->
	if !object_name and Meteor.isClient
		object_name = Session.get("object_name")
	if object_name
		return Creator.objectsByName[object_name]
