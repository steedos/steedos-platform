@Creator = {}

Creator.Apps = {}
Creator.Objects = {}
Creator.Collections = {}
Creator.subs = {}


Meteor.startup ->
	_.each Creator.Objects, (obj, object_name)->
		new Creator.Object(obj);

		Creator.initTriggers(object_name)
		Creator.initListViews(object_name)

		if Meteor.isServer
# 危险
			Creator.Collections[object_name].allow
				insert: (userId, doc) ->
					return true
				update: (userId, doc) ->
					return true
				remove: (userId, doc) ->
					return true

	Creator.initApps()


Creator.initApps = ()->
	if Meteor.isServer
		_.each Creator.Apps, (app, app_id)->
			db_app = db.apps.findOne(app_id)
			if !db_app
				app._id = app_id
				db.apps.insert(app)
# else
# 	app._id = app_id
# 	db.apps.update({_id: app_id}, app)

Creator.getObject = (object_name)->
	if !object_name
		object_name = Session.get("object_name")
	if object_name
		return Creator.objectsByName[object_name]

Creator.getTable = (object_name)->
	return Tabular.tablesByName["creator_" + object_name]

Creator.getSchema = (object_name)->
	return Creator.getObject(object_name)?.schema

Creator.getObjectUrl = (object_name, record_id, app_id) ->
	if !app_id
		app_id = Session.get("app_id")
	if record_id
		return Steedos.absoluteUrl("/app/" + app_id + "/" + object_name + "/view/" + record_id)
	else
		return Steedos.absoluteUrl("/app/" + app_id + "/" + object_name + "/list")

Creator.getCollection = (object_name)->
	if !object_name
		object_name = Session.get("object_name")
	if object_name
		return Creator.Collections[object_name]

Creator.getObjectRecord = (object_name, record_id)->
	if !record_id
		record_id = Session.get("record_id")
	collection = Creator.getCollection(object_name)
	if collection
		return collection.findOne(record_id)


Creator.getPermissions = (object_name)->
	if !object_name and Meteor.isClient
		object_name = Session.get("object_name")

	obj = Creator.getObject(object_name)
	return obj.permissions.get()

Creator.getRecordPermissions = (object_name, record, userId)->
	if !object_name and Meteor.isClient
		object_name = Session.get("object_name")

	permissions = _.clone(Creator.getPermissions(object_name))

	if !permissions.modifyAllRecords and record?.owner? != Meteor.userId()
		permissions.allowEdit = false
		permissions.allowDelete = false

	if !permissions.viewAllRecords and record?.owner? != Meteor.userId()
		permissions.allowRead = false

	return permissions


Creator.getApp = (app_id)->
	if !app_id
		app_id = Session.get("app_id")
	app = Creator.Apps[app_id]
	return app

Creator.isSpaceAdmin = (spaceId, userId)->
	if Meteor.isClient
		if !spaceId 
			spaceId = Session.get("spaceId")
		if !userId
			userId = Meteor.userId()
	if Meteor.userId()
		space = Creator.getObject("spaces")?.db?.findOne(spaceId)
		if space?.admins
			return space.admins.indexOf(userId) >= 0

Creator.evaluateFormula = (formular, context)->
	formular = formular.replace "{userId}", Meteor.userId()
	formular = formular.replace "{spaceId}", Session.get("spaceId")
	return formular				

Creator.evaluateFilters = (filters, context)->
	selector = {}
	_.each filters, (filter)->
		if filter?.length == 3
			name = filter[0]
			action = filter[1]
			value = Creator.evaluateFormula(filter[2], context)
			if action == "eq"
				selector[name] = value
	return selector

