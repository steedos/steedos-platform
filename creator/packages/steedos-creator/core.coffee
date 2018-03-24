Creator.Apps = {}
Creator.Reports = {}
Creator.subs = {}


Meteor.startup ->

	SimpleSchema.extendOptions({filtersFunction: Match.Optional(Match.OneOf(Function, String))})
	SimpleSchema.extendOptions({optionsFunction: Match.Optional(Match.OneOf(Function, String))})

	if Meteor.isServer
		_.each Creator.Objects, (obj, object_name)->
			Creator.loadObjects obj, object_name

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

Creator.loadObjects = (obj, object_name)->
	if !object_name
		object_name = obj.name

	if !obj.list_views
		obj.list_views = {}

	if !obj.list_views.default
		obj.list_views.default = {
			columns: ["name"]
		}

	if !obj.list_views.all
		obj.list_views.all = {
			filter_scope: "space"
		}

	Creator.convertObject(obj)
	new Creator.Object(obj);

	Creator.initTriggers(object_name)
	Creator.initListViews(object_name)
	if Meteor.isServer
		Creator.initPermissions(object_name)


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
		return Steedos.absoluteUrl("/app/" + app_id + "/" + object_name + "/grid")

Creator.getSwitchListUrl = (object_name, app_id, list_view_id) ->
	if list_view_id
		return Steedos.absoluteUrl("/app/" + app_id + "/" + object_name + "/" + list_view_id + "/list")
	else
		return Steedos.absoluteUrl("/app/" + app_id + "/" + object_name + "/list/switch")

Creator.getRelatedObjectUrl = (object_name, app_id, record_id, related_object_name) ->
	return Steedos.absoluteUrl("/app/" + app_id + "/" + object_name + "/" + record_id + "/" + related_object_name + "/grid")

Creator.getObjectRecord = (object_name, record_id)->
	if !record_id
		record_id = Session.get("record_id")
	collection = Creator.getCollection(object_name)
	if collection
		return collection.findOne(record_id)

# 该函数只在初始化Object时，把相关对象的计算结果保存到Object的related_objects属性中，后续可以直接从related_objects属性中取得计算结果而不用再次调用该函数来计算
Creator.getObjectRelateds = (object_name)->
	if Meteor.isClient
		if !object_name
			object_name = Session.get("object_name")
	
	related_objects = []
	# _object = Creator.getObject(object_name)
	# 因Creator.getObject函数内部要调用该函数，所以这里不可以调用Creator.getObject取对象，只能调用Creator.Objects来取对象
	_object = Creator.Objects[object_name]
	if !_object
		return related_objects

	_.each Creator.Objects, (related_object, related_object_name)->
		_.each related_object.fields, (related_field, related_field_name)->
			if related_field.type == "master_detail" and related_field.reference_to and related_field.reference_to == object_name
				related_objects.push {object_name:related_object_name, foreign_key: related_field_name}
	
	if _object.enable_files
		related_objects.push {object_name:"cms_files", foreign_key: "parent"}
	if _object.enable_tasks
		related_objects.push {object_name:"tasks", foreign_key: "related_to"}
	if _object.enable_notes
		related_objects.push {object_name:"notes", foreign_key: "related_to"}

	return related_objects

Creator.getPermissions = (object_name, spaceId, userId)->
	if Meteor.isClient
		if !object_name
			object_name = Session.get("object_name")
		obj = Creator.getObject(object_name)
		if !obj
			return
		return obj.permissions.get()
	else if Meteor.isServer
		Creator.getObjectPermissions(spaceId, userId, object_name)

Creator.getRecordPermissions = (object_name, record, userId)->
	if !object_name and Meteor.isClient
		object_name = Session.get("object_name")

	permissions = _.clone(Creator.getPermissions(object_name))

	if record
		isOwner = record.owner == userId || record.owner?._id == userId
		if !permissions.modifyAllRecords and !isOwner
			permissions.allowEdit = false
			permissions.allowDelete = false

		if !permissions.viewAllRecords and !isOwner
			permissions.allowRead = false

	return permissions

Creator.processPermissions = (po)->
	if po.allowCreate
		po.allowRead = true
	if po.allowEdit
		po.allowRead = true
	if po.allowDelete
		po.allowEdit = true
		po.allowRead = true
	if po.viewAllRecords
		po.allowRead = true
	if po.modifyAllRecords
		po.allowRead = true
		po.allowEdit = true
		po.allowDelete = true
		po.viewAllRecords = true

Creator.getApp = (app_id)->
	if !app_id
		app_id = Session.get("app_id")
	app = Creator.Apps[app_id]
	return app

Creator.getVisibleApps = ()->
	apps = []
	_.each Creator.Apps, (v, k)->
		if v.visible != false
			apps.push v
	return _.uniq(apps);


# "=", "<>", ">", ">=", "<", "<=", "startswith", "contains", "notcontains".
Creator.formatFiltersToMongo = (filters)->
	unless filters.length
		return
	selector = []
	_.each filters, (filter)->
		field = filter[0]
		option = filter[1]
		value = Creator.evaluateFormula(filter[2])
		sub_selector = {}
		sub_selector[field] = {}
		if option == "="
			sub_selector[field]["$eq"] = value
		else if option == "<>"
			sub_selector[field]["$ne"] = value
		else if option == ">"
			sub_selector[field]["$gt"] = value
		else if option == ">="
			sub_selector[field]["$gte"] = value
		else if option == "<"
			sub_selector[field]["$lt"] = value
		else if option == "<="
			sub_selector[field]["$lte"] = value
		else if option == "startswith"
			reg = new RegExp("^" + value, "i")
			sub_selector[field]["$regex"] = reg
		else if option == "contains"
			reg = new RegExp(value, "i")
			sub_selector[field]["$regex"] = reg
		else if option == "notcontains"
			reg = new RegExp("^((?!" + value + ").)*$", "i")
			sub_selector[field]["$regex"] = reg
		selector.push sub_selector
	return selector

Creator.formatFiltersToDev = (filters)->
	unless filters.length
		return
	selector = []
	_.each filters, (filter)->
		field = filter[0]
		option = filter[1]
		value = Creator.evaluateFormula(filter[2])
		sub_selector = []
		if _.isArray(value) == true and option == "="
			_.each value, (v)->
				sub_selector.push [field, "=", v], "and"

			if sub_selector[sub_selector.length - 1] == "and"
				sub_selector.pop()
			selector.push sub_selector
		else
			selector.push [field, option, value], "and"
	
	if selector[selector.length - 1] == "and"
		selector.pop()

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
	_object = Creator.getObject(object_name)

	if !_object
		return related_object_names

	related_object_names = _.pluck(_object.related_objects,"object_name")
	if related_object_names?.length == 0
		return related_object_names

	permissions = Creator.getPermissions(object_name, spaceId, userId)
	permission_related_objects = permissions.related_objects

	related_object_names = _.intersection related_object_names, permission_related_objects
	return _.filter _object.related_objects, (related_object)->
		return related_object_names.indexOf(related_object.object_name) > -1

Creator.getRelatedObjectNames = (object_name, spaceId, userId)->
	related_objects = Creator.getRelatedObjects(object_name, spaceId, userId)
	return _.pluck(related_objects,"object_name")

Creator.getActions = (object_name, spaceId, userId)->
	if Meteor.isClient
		if !object_name
			object_name = Session.get("object_name")
		if !spaceId
			spaceId = Session.get("spaceId")
		if !userId
			userId = Meteor.userId()

	obj = Creator.getObject(object_name)

	if !obj
		return

	permissions = Creator.getPermissions(object_name, spaceId, userId)
	permission_actions = permissions.actions
	actions = _.sortBy(_.values(obj.actions) , 'sort');

	# if permission_actions
	actions = _.filter actions, (action)->
		return _.indexOf(permission_actions, action.name) > -1
	
	return actions

///
	返回当前用户有权限访问的所有list_view，包括分享的，用户自定义非分享的（除非owner变了），以及默认的其他视图
	注意Creator.getPermissions函数中是不会有用户自定义非分享的视图的，所以Creator.getPermissions函数中拿到的结果不全，并不是当前用户能看到所有视图
///
Creator.getListViews = (object_name, spaceId, userId)->
	if Meteor.isClient
		if !object_name
			object_name = Session.get("object_name")
		if !spaceId
			spaceId = Session.get("spaceId")
		if !userId
			userId = Meteor.userId()

	object = Creator.getObject(object_name)

	if !object
		return

	permission_list_views = Creator.getPermissions(object_name, spaceId, userId).list_views

	list_views = []

	_.each object.list_views, (item, item_name)->
		if item_name != "default"
			if permission_list_views
				if _.indexOf(permission_list_views, item_name) > -1 || item.owner == userId
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
	permission_fields =  Creator.getPermissions(object_name, spaceId, userId).readable_fields

	return permission_fields

Creator.isloading = ()->
	return Creator.isLoadingSpace.get()

# 计算fields相关函数
# START
Creator.getHiddenFields = (schema)->
	fields = _.map(schema, (field, fieldName) ->
		return field.autoform and field.autoform.type == "hidden" and !field.autoform.omit and fieldName
	)
	fields = _.compact(fields)
	return fields

Creator.getFieldsWithNoGroup = (schema)->
	fields = _.map(schema, (field, fieldName) ->
  		return (!field.autoform or !field.autoform.group) and (!field.autoform or field.autoform.type != "hidden") and fieldName
	)
	fields = _.compact(fields)
	return fields

Creator.getSortedFieldGroupNames = (schema)->
	names = _.map(schema, (field) ->
 		return field.autoform and field.autoform.group
	)
	names = _.compact(names)
	names = _.unique(names)
	return names

Creator.getFieldsForGroup = (schema, groupName) ->
  	fields = _.map(schema, (field, fieldName) ->
    	return field.autoform and field.autoform.group == groupName and field.autoform.type != "hidden" and fieldName
  	)
  	fields = _.compact(fields)
  	return fields

Creator.getFieldsWithoutOmit = (schema, keys) ->
	keys = _.map(keys, (key) ->
		field = _.pick(schema, key)
		if field[key].autoform?.omit
			return false
		else 
			return key
	)
	keys = _.compact(keys)
	return keys

Creator.getFieldsInFirstLevel = (firstLevelKeys, keys) ->
	keys = _.map(keys, (key) ->
		if _.indexOf(firstLevelKeys, key) > -1
			return key
		else
			return false
	)
	keys = _.compact(keys)
	return keys

Creator.getFieldsForReorder = (schema, keys, isSingle) ->
	fields = []
	i = 0
	while i < keys.length
		sc_1 = _.pick(schema, keys[i])
		sc_2 = _.pick(schema, keys[i+1])

		is_wide_1 = false
		is_wide_2 = false

		_.each sc_1, (value) ->
			if value.autoform?.is_wide
				is_wide_1 = true

		_.each sc_2, (value) ->
			if value.autoform?.is_wide
				is_wide_2 = true

		if isSingle
			fields.push keys.slice(i, i+1)
			i += 1
		else
			if is_wide_1
				fields.push keys.slice(i, i+1)
				i += 1
			else if !is_wide_1 and is_wide_2
				childKeys = keys.slice(i, i+1)
				childKeys.push undefined
				fields.push childKeys
				i += 1
			else if !is_wide_1 and !is_wide_2
				childKeys = keys.slice(i, i+1)
				if keys[i+1]
					childKeys.push keys[i+1]
				else
					childKeys.push undefined
				fields.push childKeys
				i += 2
	
	return fields

# END

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