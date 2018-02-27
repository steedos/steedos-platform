if !Creator?
	@Creator = {}
Creator.Objects = {}
Creator.Collections = {}


Creator.getObject = (object_name)->
	if !object_name and Meteor.isClient
		object_name = Session.get("object_name")
	if object_name
		return Creator.objectsByName[object_name]

Creator.getCollection = (object_name)->
	if !object_name
		object_name = Session.get("object_name")
	if object_name
		return Creator.Collections[object_name]

Creator.isSpaceAdmin = (spaceId, userId)->
	if Meteor.isClient
		if !spaceId 
			spaceId = Session.get("spaceId")
		if !userId
			userId = Meteor.userId()
	
	space = Creator.getObject("spaces")?.db?.findOne(spaceId)
	if space?.admins
		return space.admins.indexOf(userId) >= 0
