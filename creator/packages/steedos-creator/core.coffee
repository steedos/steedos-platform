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

	Creator.convertObject(obj)
	new Creator.Object(obj);

	Creator.initTriggers(object_name)
	Creator.initListViews(object_name)
	# if Meteor.isServer
	# 	Creator.initPermissions(object_name)

Creator.getUserContext = (userId, spaceId, isUnSafeMode)->
	if Meteor.isClient
		return Creator.USER_CONTEXT
	else
		if !(userId and spaceId)
			throw new Meteor.Error 500, "the params userId and spaceId is required for the function Creator.getUserContext"
			return null
		suFields = {name: 1, mobile: 1, position: 1, email: 1, company: 1, organization: 1, space: 1}
		# check if user in the space
		su = Creator.Collections["space_users"].findOne({space: spaceId, user: userId}, {fields: suFields})
		if !su
			spaceId = null

		# if spaceId not exists, get the first one.
		if !spaceId
			if isUnSafeMode
				su = Creator.Collections["space_users"].findOne({user: userId}, {fields: suFields})
				if !su
					return null
				spaceId = su.space
			else
				return null

		USER_CONTEXT = {}
		USER_CONTEXT.userId = userId
		USER_CONTEXT.spaceId = spaceId
		USER_CONTEXT.user = {
			_id: userId
			name: su.name,
			mobile: su.mobile,
			position: su.position,
			email: su.email
			company: su.company
		}
		space_user_org = Creator.getCollection("organizations")?.findOne(su.organization)
		if space_user_org
			USER_CONTEXT.user.organization = {
				_id: space_user_org._id,
				name: space_user_org.name,
				fullname: space_user_org.fullname,
				is_company: space_user_org.is_company
			}
		return USER_CONTEXT

Creator.getTable = (object_name)->
	return Tabular.tablesByName["creator_" + object_name]

Creator.getSchema = (object_name)->
	return Creator.getObject(object_name)?.schema

Creator.getObjectUrl = (object_name, record_id, app_id) ->
	if !app_id
		app_id = Session.get("app_id")
	if !object_name
		object_name = Session.get("object_name")

	list_view = Creator.getListView(object_name, null)
	list_view_id = list_view?._id

	if record_id
		return Steedos.absoluteUrl("/app/" + app_id + "/" + object_name + "/view/" + record_id)
	else
		return Steedos.absoluteUrl("/app/" + app_id + "/" + object_name + "/grid/" + list_view_id)

Creator.getListViewUrl = (object_name, app_id, list_view_id) ->
	return Steedos.absoluteUrl("/app/" + app_id + "/" + object_name + "/grid/" + list_view_id)

Creator.getSwitchListUrl = (object_name, app_id, list_view_id) ->
	if list_view_id
		return Steedos.absoluteUrl("/app/" + app_id + "/" + object_name + "/" + list_view_id + "/list")
	else
		return Steedos.absoluteUrl("/app/" + app_id + "/" + object_name + "/list/switch")

Creator.getRelatedObjectUrl = (object_name, app_id, record_id, related_object_name) ->
	return Steedos.absoluteUrl("/app/" + app_id + "/" + object_name + "/" + record_id + "/" + related_object_name + "/grid")

Creator.getObjectLookupFieldOptions = (object_name, is_deep)->
	_options = []
	_object = Creator.getObject(object_name)
	fields = _object?.fields
	icon = _object?.icon
	_.forEach fields, (f, k)->
		if f.type == "select"
			_options.push {label: "#{f.label || k}", value: "#{k}", icon: icon}
		else
			_options.push {label: f.label || k, value: k, icon: icon}
			if is_deep
				if (f.type == "lookup" || f.type == "master_detail") && f.reference_to
					r_object = Creator.getObject(f.reference_to)
					if r_object
						_.forEach r_object.fields, (f2, k2)->
							_options.push {label: "#{f.label || k}=>#{f2.label || k2}", value: "#{k}.#{k2}", icon: r_object?.icon}
	return _options

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
				if related_object_name == "object_fields"
					#TODO 待相关列表支持排序后，删除此判断
					related_objects.splice(0, 0, {object_name:related_object_name, foreign_key: related_field_name})
				else
					related_objects.push {object_name:related_object_name, foreign_key: related_field_name}

	if _object.enable_files
		related_objects.push {object_name:"cms_files", foreign_key: "parent"}
	if _object.enable_tasks
		related_objects.push {object_name:"tasks", foreign_key: "related_to"}
	if _object.enable_notes
		related_objects.push {object_name:"notes", foreign_key: "related_to"}
	if _object.enable_instances
		related_objects.push {object_name:"instances", foreign_key: "instances"}

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
	return apps;

Creator.getVisibleAppsObjects = ()->
	apps = Creator.getVisibleApps()
	objects = []
	_.forEach apps, (app)->
		objects = objects.concat(app.objects)
	return _.uniq objects

Creator.getAppsObjects = ()->
	objects = []
	_.forEach Creator.Apps, (app)->
		objects = objects.concat(app.objects)
	return _.uniq objects

Creator.validateFilters = (filters, logic)->
	filter_items = _.map filters, (obj) ->
		if _.isEmpty(obj)
			return false
		else
			return obj
	filter_items = _.compact(filter_items)
	errorMsg = ""
	filter_length = filter_items.length
	if logic
		# 格式化filter
		logic = logic.replace(/\n/g, "").replace(/\s+/g, " ")

		# 判断特殊字符
		if /[._\-!+]+/ig.test(logic)
			errorMsg = "含有特殊字符。"

		if !errorMsg
			index = logic.match(/\d+/ig)
			if !index
				errorMsg = "有些筛选条件进行了定义，但未在高级筛选条件中被引用。"
			else
				index.forEach (i)->
					if i < 1 or i > filter_length
						errorMsg = "您的筛选条件引用了未定义的筛选器：#{i}。"

				flag = 1
				while flag <= filter_length
					if !index.includes("#{flag}")
						errorMsg = "有些筛选条件进行了定义，但未在高级筛选条件中被引用。"
					flag++;

		if !errorMsg
			# 判断是否有非法英文字符
			word = logic.match(/[a-zA-Z]+/ig)
			if word
				word.forEach (w)->
					if !/^(and|or)$/ig.test(w)
						errorMsg = "检查您的高级筛选条件中的拼写。"

		if !errorMsg
			# 判断格式是否正确
			try
				Creator.eval(logic.replace(/and/ig, "&&").replace(/or/ig, "||"))
			catch e
				errorMsg = "您的筛选器中含有特殊字符"

			if /(AND)[^()]+(OR)/ig.test(logic) ||  /(OR)[^()]+(AND)/ig.test(logic)
				errorMsg = "您的筛选器必须在连续性的 AND 和 OR 表达式前后使用括号。"
	if errorMsg
		console.log "error", errorMsg
		if Meteor.isClient
			toastr.error(errorMsg)
		return false
	else
		return true

# "=", "<>", ">", ">=", "<", "<=", "startswith", "contains", "notcontains".
###
options参数：
	extend-- 是否需要把当前用户基本信息加入公式，即让公式支持Creator.USER_CONTEXT中的值，默认为true
	userId-- 当前登录用户
	spaceId-- 当前所在工作区
extend为true时，后端需要额外传入userId及spaceId用于抓取Creator.USER_CONTEXT对应的值
###
Creator.formatFiltersToMongo = (filters, options)->
	unless filters.length
		return
	# 当filters不是[Array]类型而是[Object]类型时，进行格式转换
	unless filters[0] instanceof Array
		filters = _.map filters, (obj)->
			return [obj.field, obj.operation, obj.value]
	selector = []
	_.each filters, (filter)->
		field = filter[0]
		option = filter[1]
		if Meteor.isClient
			value = Creator.evaluateFormula(filter[2])
		else
			value = Creator.evaluateFormula(filter[2], null, options)
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

###
options参数：
	extend-- 是否需要把当前用户基本信息加入公式，即让公式支持Creator.USER_CONTEXT中的值，默认为true
	userId-- 当前登录用户
	spaceId-- 当前所在工作区
extend为true时，后端需要额外传入userId及spaceId用于抓取Creator.USER_CONTEXT对应的值
###
Creator.formatFiltersToDev = (filters, options)->
	unless filters.length
		return
	# 当filters不是[Array]类型而是[Object]类型时，进行格式转换
	unless filters[0] instanceof Array
		filters = _.map filters, (obj)->
			return [obj.field, obj.operation, obj.value]
	selector = []
	_.each filters, (filter)->
		field = filter[0]
		option = filter[1]
		if Meteor.isClient
			value = Creator.evaluateFormula(filter[2])
		else
			value = Creator.evaluateFormula(filter[2], null, options)
		sub_selector = []
		if _.isArray(value) == true
			v_selector = []
			if option == "="
				_.each value, (v)->
					sub_selector.push [field, option, v], "or"
			else if option == "<>"
				_.each value, (v)->
					sub_selector.push [field, option, v], "and"
			else
				_.each value, (v)->
					sub_selector.push [field, option, v], "or"

			if sub_selector[sub_selector.length - 1] == "and" || sub_selector[sub_selector.length - 1] == "or"
				sub_selector.pop()
			selector.push sub_selector, "and"
		else
			selector.push [field, option, value], "and"

	if selector[selector.length - 1] == "and"
		selector.pop()

	return selector

###
options参数：
	extend-- 是否需要把当前用户基本信息加入公式，即让公式支持Creator.USER_CONTEXT中的值，默认为true
	userId-- 当前登录用户
	spaceId-- 当前所在工作区
extend为true时，后端需要额外传入userId及spaceId用于抓取Creator.USER_CONTEXT对应的值
###
Creator.formatLogicFiltersToDev = (filters, filter_logic, options)->
	format_logic = filter_logic.replace(/\(\s+/ig, "(").replace(/\s+\)/ig, ")").replace(/\(/g, "[").replace(/\)/g, "]").replace(/\s+/g, ",").replace(/(and|or)/ig, "'$1'")
	format_logic = format_logic.replace(/(\d)+/ig, (x)->
		_f = filters[x-1]
		field = _f.field
		option = _f.operation
		value = Creator.evaluateFormula(_f.value)
		sub_selector = []
		if _.isArray(value) == true
			if option == "="
				_.each value, (v)->
					sub_selector.push [field, option, v], "or"
			else if option == "<>"
				_.each value, (v)->
					sub_selector.push [field, option, v], "and"
			else
				_.each value, (v)->
					sub_selector.push [field, option, v], "or"
			if sub_selector[sub_selector.length - 1] == "and" || sub_selector[sub_selector.length - 1] == "or"
				sub_selector.pop()
		else
			sub_selector = [field, option, value]
		console.log "sub_selector", sub_selector
		return JSON.stringify(sub_selector)
	)
	format_logic = "[#{format_logic}]"
	return Creator.eval(format_logic)

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
	unrelated_objects = permissions.unrelated_objects

	related_object_names = _.difference related_object_names, unrelated_objects
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
	disabled_actions = permissions.disabled_actions
	actions = _.sortBy(_.values(obj.actions) , 'sort');

	actions = _.filter actions, (action)->
		return _.indexOf(disabled_actions, action.name) < 0

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

	disabled_list_views = Creator.getPermissions(object_name, spaceId, userId).disabled_list_views || []

	list_views = []

	_.each object.list_views, (item, item_name)->
		if item_name != "default"
			if _.indexOf(disabled_list_views, item_name) < 0 || item.owner == userId
				list_views.push item

	return list_views

# 前台理论上不应该调用该函数，因为字段的权限都在Creator.getObject(object_name).fields的相关属性中有标识了
Creator.getFields = (object_name, spaceId, userId)->
	if Meteor.isClient
		if !object_name
			object_name = Session.get("object_name")
		if !spaceId
			spaceId = Session.get("spaceId")
		if !userId
			userId = Meteor.userId()

	fieldsName = Creator.getObjectFieldsName(object_name)
	unreadable_fields =  Creator.getPermissions(object_name, spaceId, userId).unreadable_fields
	return _.difference(fieldsName, unreadable_fields)

Creator.isloading = ()->
	return !Creator.bootstrapLoaded.get()

Creator.convertSpecialCharacter = (str)->
	return str.replace(/([\^\$\(\)\*\+\?\.\\\|\[\]\{\}])/g, "\\$1")

# 计算fields相关函数
# START
Creator.getDisabledFields = (schema)->
	fields = _.map(schema, (field, fieldName) ->
		return field.autoform and field.autoform.disabled and !field.autoform.omit and fieldName
	)
	fields = _.compact(fields)
	return fields

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
			if value.autoform?.is_wide || value.autoform?.type == "table"
				is_wide_1 = true

		_.each sc_2, (value) ->
			if value.autoform?.is_wide || value.autoform?.type == "table"
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


Creator.getDBApps = (space_id)->
	dbApps = {}
	Creator.Collections["apps"].find({space: space_id,is_creator:true,visible:true}, {
		fields: {
			created: 0,
			created_by: 0,
			modified: 0,
			modified_by: 0
		}
	}).forEach (app)->
		dbApps[app._id] = app

	return dbApps

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