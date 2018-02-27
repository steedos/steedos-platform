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


Creator.evaluateFormula = (formular, context)->

	if !_.isString(formular)
		return formular

	if Creator.Formular.checkFormula(formular)
		return Creator.Formular.run(formular, context)

	return formular				

Creator.evaluateFilters = (filters, context)->
	selector = {}
	_.each filters, (filter)->
		if filter?.length == 3
			name = filter[0]
			action = filter[1]
			value = Creator.evaluateFormula(filter[2], context)
			selector[name] = {}
			selector[name][action] = value
	console.log("evaluateFilters-->selector", selector)
	return selector