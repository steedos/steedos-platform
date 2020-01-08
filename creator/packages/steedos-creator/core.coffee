
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
		return Creator.getRelativeUrl("/app/" + app_id + "/" + object_name + "/view/" + record_id)
	else
		if object_name is "meeting"
			return Creator.getRelativeUrl("/app/" + app_id + "/" + object_name + "/calendar/")
		else
			return Creator.getRelativeUrl("/app/" + app_id + "/" + object_name + "/grid/" + list_view_id)

Creator.getObjectRouterUrl = (object_name, record_id, app_id) ->
	if !app_id
		app_id = Session.get("app_id")
	if !object_name
		object_name = Session.get("object_name")

	list_view = Creator.getListView(object_name, null)
	list_view_id = list_view?._id

	if record_id
		return "/app/" + app_id + "/" + object_name + "/view/" + record_id
	else
		if object_name is "meeting"
			return "/app/" + app_id + "/" + object_name + "/calendar/"
		else
			return "/app/" + app_id + "/" + object_name + "/grid/" + list_view_id

Creator.getListViewUrl = (object_name, app_id, list_view_id) ->
	url = Creator.getListViewRelativeUrl(object_name, app_id, list_view_id)
	return Creator.getRelativeUrl(url)

Creator.getListViewRelativeUrl = (object_name, app_id, list_view_id) ->
	if list_view_id is "calendar"
		return "/app/" + app_id + "/" + object_name + "/calendar/"
	else
		return "/app/" + app_id + "/" + object_name + "/grid/" + list_view_id

Creator.getSwitchListUrl = (object_name, app_id, list_view_id) ->
	if list_view_id
		return Creator.getRelativeUrl("/app/" + app_id + "/" + object_name + "/" + list_view_id + "/list")
	else
		return Creator.getRelativeUrl("/app/" + app_id + "/" + object_name + "/list/switch")

Creator.getRelatedObjectUrl = (object_name, app_id, record_id, related_object_name) ->
	return Creator.getRelativeUrl("/app/" + app_id + "/" + object_name + "/" + record_id + "/" + related_object_name + "/grid")

Creator.getObjectLookupFieldOptions = (object_name, is_deep, is_skip_hide, is_related)->
	_options = []
	unless object_name
		return _options
	_object = Creator.getObject(object_name)
	fields = _object?.fields
	icon = _object?.icon
	_.forEach fields, (f, k)->
		if is_skip_hide and f.hidden
			return
		if f.type == "select"
			_options.push {label: "#{f.label || k}", value: "#{k}", icon: icon}
		else
			_options.push {label: f.label || k, value: k, icon: icon}
	if is_deep
		_.forEach fields, (f, k)->
			if is_skip_hide and f.hidden
				return
			if (f.type == "lookup" || f.type == "master_detail") && f.reference_to && _.isString(f.reference_to)
				# 不支持f.reference_to为function的情况，有需求再说
				r_object = Creator.getObject(f.reference_to)
				if r_object
					_.forEach r_object.fields, (f2, k2)->
						_options.push {label: "#{f.label || k}=>#{f2.label || k2}", value: "#{k}.#{k2}", icon: r_object?.icon}
	if is_related
		relatedObjects = Creator.getRelatedObjects(object_name)
		_.each relatedObjects, (_relatedObject)=>
			relatedOptions = Creator.getObjectLookupFieldOptions(_relatedObject.object_name, false, false, false)
			relatedObject = Creator.getObject(_relatedObject.object_name)
			_.each relatedOptions, (relatedOption)->
				if _relatedObject.foreign_key != relatedOption.value
					_options.push {label: "#{relatedObject.label || relatedObject.name}=>#{relatedOption.label}", value: "#{relatedObject.name}.#{relatedOption.value}", icon: relatedObject?.icon}
	return _options

# 统一为对象object_name提供可用于过虑器过虑字段
Creator.getObjectFilterFieldOptions = (object_name)->
	_options = []
	unless object_name
		return _options
	_object = Creator.getObject(object_name)
	fields = _object?.fields
	permission_fields = Creator.getFields(object_name)
	icon = _object?.icon
	_.forEach fields, (f, k)->
		# hidden,grid等类型的字段，不需要过滤
		if !_.include(["grid","object", "[Object]", "[object]", "Object"], f.type) and !f.hidden
			# filters.$.field及flow.current等子字段也不需要过滤
			if !/\w+\./.test(k) and _.indexOf(permission_fields, k) > -1
				_options.push {label: f.label || k, value: k, icon: icon}

	return _options

###
filters: 要转换的filters
fields: 对象字段
filter_fields: 默认过滤字段，支持字符串数组和对象数组两种格式，如:['filed_name1','filed_name2'],[{field:'filed_name1',required:true}]
处理逻辑: 把filters中存在于filter_fields的过滤条件增加每项的is_default、is_required属性，不存在于filter_fields的过滤条件对应的移除每项的相关属性
返回结果: 处理后的filters
###
Creator.getFiltersWithFilterFields = (filters, fields, filter_fields)->
	unless filters
		filters = []
	unless filter_fields
		filter_fields = []
	if filter_fields?.length
		filter_fields.forEach (n)->
			if _.isString(n)
				n = 
					field: n,
					required: false
			if fields[n.field] and !_.findWhere(filters,{field:n.field})
				filters.push
					field: n.field,
					is_default: true,
					is_required: n.required
	filters.forEach (filterItem)->
		matchField = filter_fields.find (n)-> return n == filterItem.field or n.field == filterItem.field
		if _.isString(matchField)
			matchField = 
				field: matchField,
				required: false
		if matchField
			filterItem.is_default = true
			filterItem.is_required = matchField.required
		else
			delete filterItem.is_default
			delete filterItem.is_required
	return filters

Creator.getObjectRecord = (object_name, record_id, select_fields, expand)->

	if !object_name
		object_name = Session.get("object_name")

	if !record_id
		record_id = Session.get("record_id")
	if Meteor.isClient
		if object_name == Session.get("object_name") &&  record_id == Session.get("record_id")
			if Template.instance()?.record
				return Template.instance()?.record?.get()
		else
			return Creator.odata.get(object_name, record_id, select_fields, expand)

	collection = Creator.getCollection(object_name)
	if collection
		record = collection.findOne(record_id)
		return record

Creator.getApp = (app_id)->
	if !app_id
		app_id = Session.get("app_id")
	app = Creator.Apps[app_id]
	Creator.deps?.app?.depend()
	return app


Creator.getAppObjectNames = (app_id)->
	app = Creator.getApp(app_id)
	isMobile = Steedos.isMobile()
	appObjects = if isMobile then app.mobile_objects else app.objects
	objects = []
	if app
		_.each appObjects, (v)->
			obj = Creator.getObject(v)
			if obj?.permissions.get().allowRead and !obj.hidden
				objects.push v
	return objects

Creator.getVisibleApps = (includeAdmin)->
	apps = []
	_.each Creator.Apps, (v, k)->
		if (v.visible != false and v._id != "admin") or (includeAdmin and v._id == "admin")
			apps.push v
	return apps;

Creator.getVisibleAppsObjects = ()->
	apps = Creator.getVisibleApps()
	visibleObjectNames = _.flatten(_.pluck(apps,'objects'))
	objects = _.filter Creator.Objects, (obj)->
		if visibleObjectNames.indexOf(obj.name) < 0
			return false
		else
			return !obj.hidden
	objects = objects.sort(Creator.sortingMethod.bind({key:"label"}))
	objects = _.pluck(objects,'name')
	return _.uniq objects

Creator.getAppsObjects = ()->
	objects = []
	tempObjects = []
	_.forEach Creator.Apps, (app)->
		tempObjects = _.filter app.objects, (obj)->
			return !obj.hidden
		objects = objects.concat(tempObjects)
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
	unless filters?.length
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

Creator.isBetweenFilterOperation = (operation)->
	return operation == "between" or !!Creator.getBetweenTimeBuiltinValues(true)?[operation]

###
options参数：
	extend-- 是否需要把当前用户基本信息加入公式，即让公式支持Creator.USER_CONTEXT中的值，默认为true
	userId-- 当前登录用户
	spaceId-- 当前所在工作区
	extend为true时，后端需要额外传入userId及spaceId用于抓取Creator.USER_CONTEXT对应的值
###
Creator.formatFiltersToDev = (filters, object_name, options)->
	steedosFilters = require("@steedos/filters");
	unless filters.length
		return
	if options?.is_logic_or
		# 如果is_logic_or为true，为filters第一层元素增加or间隔
		logicTempFilters = []
		filters.forEach (n)->
			logicTempFilters.push(n)
			logicTempFilters.push("or")
		logicTempFilters.pop()
		filters = logicTempFilters
	selector = steedosFilters.formatFiltersToDev(filters, Creator.USER_CONTEXT)
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
		if Meteor.isClient
			value = Creator.evaluateFormula(_f.value)
		else
			value = Creator.evaluateFormula(_f.value, null, options)
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

#	related_object_names = _.pluck(_object.related_objects,"object_name")

	related_objects = Creator.getObjectRelateds(_object._collection_name)

	related_object_names = _.pluck(related_objects,"object_name")
	if related_object_names?.length == 0
		return related_object_names

	permissions = Creator.getPermissions(object_name, spaceId, userId)
	unrelated_objects = permissions.unrelated_objects

	related_object_names = _.difference related_object_names, unrelated_objects
	return _.filter related_objects, (related_object)->
		related_object_name = related_object.object_name
		isActive = related_object_names.indexOf(related_object_name) > -1
		allowRead = Creator.getPermissions(related_object_name, spaceId, userId)?.allowRead
		return isActive and allowRead

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

	_.each actions, (action)->
		if Steedos.isMobile() && action.on == "record" && action.name != 'standard_edit'
			action.on = 'record_more'

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

	isMobile = Steedos.isMobile()

	_.each object.list_views, (item, item_name)->
		if isMobile and item.type == "calendar"
			# 手机上先不显示日历视图
			return
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
		return (!field.autoform or !field.autoform.group or field.autoform.group == "-") and (!field.autoform or field.autoform.type != "hidden") and fieldName
	)
	fields = _.compact(fields)
	return fields

Creator.getSortedFieldGroupNames = (schema)->
	names = _.map(schema, (field) ->
 		return field.autoform and field.autoform.group != "-" and field.autoform.group
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
	_keys = _.filter(keys, (key)->
		return !key.endsWith('_endLine')
	);
	while i < _keys.length
		sc_1 = _.pick(schema, _keys[i])
		sc_2 = _.pick(schema, _keys[i+1])

		is_wide_1 = false
		is_wide_2 = false

#		is_range_1 = false
#		is_range_2 = false

		_.each sc_1, (value) ->
			if value.autoform?.is_wide || value.autoform?.type == "table"
				is_wide_1 = true

#			if value.autoform?.is_range
#				is_range_1 = true

		_.each sc_2, (value) ->
			if value.autoform?.is_wide || value.autoform?.type == "table"
				is_wide_2 = true

#			if value.autoform?.is_range
#				is_range_2 = true

		if Steedos.isMobile()
			is_wide_1 = true
			is_wide_2 = true

		if isSingle
			fields.push _keys.slice(i, i+1)
			i += 1
		else
#			if !is_range_1 && is_range_2
#				childKeys = _keys.slice(i, i+1)
#				childKeys.push undefined
#				fields.push childKeys
#				i += 1
#			else
			if is_wide_1
				fields.push _keys.slice(i, i+1)
				i += 1
			else if !is_wide_1 and is_wide_2
				childKeys = _keys.slice(i, i+1)
				childKeys.push undefined
				fields.push childKeys
				i += 1
			else if !is_wide_1 and !is_wide_2
				childKeys = _keys.slice(i, i+1)
				if _keys[i+1]
					childKeys.push _keys[i+1]
				else
					childKeys.push undefined
				fields.push childKeys
				i += 2

	return fields

Creator.isFilterValueEmpty = (v) ->
	return typeof v == "undefined" || v == null || Number.isNaN(v) || v.length == 0

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