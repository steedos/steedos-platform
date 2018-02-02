@Creator = {}

Creator.Apps = {}
Creator.Objects = {}
Creator.Collections = {}
Creator.Reports = {}
Creator.subs = {}


Meteor.startup ->

	SimpleSchema.extendOptions({filtersMethod: Match.Optional(Function)})
	SimpleSchema.extendOptions({optionsFunction: Match.Optional(Function)})

	_.each Creator.Objects, (obj, object_name)->
		new Creator.Object(obj);

		Creator.initTriggers(object_name)
		Creator.initListViews(object_name)
		if Meteor.isServer
			Creator.initPermissions(object_name)

	# Creator.initApps()


# Creator.initApps = ()->
# 	if Meteor.isServer
# 		_.each Creator.Apps, (app, app_id)->
# 			db_app = db.apps.findOne(app_id)
# 			if !db_app
# 				app._id = app_id
# 				db.apps.insert(app)
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
	if !object_name
		object_name = Session.get("object_name")
	if record_id
		return Steedos.absoluteUrl("/app/" + app_id + "/" + object_name + "/view/" + record_id)
	else
		return Steedos.absoluteUrl("/app/" + app_id + "/" + object_name + "/list")

Creator.getSwitchListUrl = (object_name, app_id, list_view_id) ->
	if list_view_id
		return Steedos.absoluteUrl("/app/" + app_id + "/" + object_name + "/" + list_view_id + "/list")
	else
		return Steedos.absoluteUrl("/app/" + app_id + "/" + object_name + "/list/switch")

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


Creator.getPermissions = (object_name, spaceId, userId)->
	if Meteor.isClient
		if !object_name
			object_name = Session.get("object_name")
		obj = Creator.getObject(object_name)
		return obj.permissions.get()
	else if Meteor.isServer
		Creator.getObjectPermissions(spaceId, userId, object_name)
Creator.getRecordPermissions = (object_name, record, userId)->
	if !object_name and Meteor.isClient
		object_name = Session.get("object_name")

	permissions = _.clone(Creator.getPermissions(object_name))

	if record
		if !permissions.modifyAllRecords and (record.owner != userId)
			permissions.allowEdit = false
			permissions.allowDelete = false

		if !permissions.viewAllRecords and (record.owner != userId)
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
	
	space = Creator.getObject("spaces")?.db?.findOne(spaceId)
	if space?.admins
		return space.admins.indexOf(userId) >= 0

Creator.evaluateFormula = (formular, context)->

	if !_.isString(formular)
		return formular

	if FormulaEngine.checkFormula(formular)
		return FormulaEngine.run(formular, context)

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

Creator.getRelatedObjects = (object_name, spaceId, userId)->
	if Meteor.isClient
		if !object_name
			object_name = Session.get("object_name")
		if !spaceId
			spaceId = Session.get("spaceId")
		if !userId
			userId = Meteor.userId()
	
	related_object_names = []
	permissions = Creator.getPermissions(object_name, spaceId, userId)
	permission_related_objects = permissions.related_objects

	_.each Creator.Objects, (related_object, related_object_name)->
			_.each related_object.fields, (related_field, related_field_name)->
				if related_field.type == "master_detail" and related_field.reference_to and related_field.reference_to == object_name
					if permission_related_objects
						if _.indexOf(permission_related_objects, related_object_name) > -1
							related_object_names.push related_object_name
					else
						related_object_names.push related_object_name
	
	if Creator.getObject(object_name).enable_files
		if permission_related_objects
			if _.indexOf(permission_related_objects, "cms_files") > -1
				related_object_names.push "cms_files"
		else
			related_object_names.push "cms_files"

	return related_object_names

Creator.getActions = (object_name, spaceId, userId)->
	if Meteor.isClient
		if !object_name
			object_name = Session.get("object_name")
		if !spaceId
			spaceId = Session.get("spaceId")
		if !userId
			userId = Meteor.userId()

	obj = Creator.getObject(object_name)
	permissions = Creator.getPermissions(object_name, spaceId, userId)
	permission_actions = permissions.actions
	actions = _.values(obj.actions) 

	if permission_actions
		actions = _.filter actions, (action)->
			return _.indexOf(permission_actions, action.name) > -1
	
	return actions

Creator.getListViews = (object_name, spaceId, userId)->
	if Meteor.isClient
		if !object_name
			object_name = Session.get("object_name")
		if !spaceId
			spaceId = Session.get("spaceId")
		if !userId
			userId = Meteor.userId()

	permission_list_views = Creator.getPermissions(object_name, spaceId, userId).list_views
	object = Creator.getObject(object_name)
	list_views = []

	_.each object.list_views, (item, item_name)->
		if item_name != "default"
			if permission_list_views
				if _.indexOf(permission_list_views, item_name) > -1
					list_views.push item
			else
				list_views.push item
	
	return list_views

Creator.getFields = (object_name, spaceId, userId)->
	if Meteor.isClient
		if !object_name
			object_name = Session.get("object_name")
		if !spaceId
			spaceId = Session.get("spaceId")
		if !userId
			userId = Meteor.userId()

	firstLevelKeys = Creator.getSchema(object_name)._firstLevelSchemaKeys
	permission_fields =  Creator.getPermissions(object_name, spaceId, userId).fields

	return permission_fields

Creator.isloading = ()->
	return Creator.isloadingPermissions.get()

if Meteor.isServer
	Creator.getAllRelatedObjects = (object_name)->
		related_object_names = []
		_.each Creator.Objects, (related_object, related_object_name)->
			_.each related_object.fields, (related_field, related_field_name)->
				if related_field.type == "master_detail" and related_field.reference_to and related_field.reference_to == object_name
					related_object_names.push related_object_name

		if Creator.getObject(object_name).enable_files
			related_object_names.push "cms_files"
		
		return related_object_names