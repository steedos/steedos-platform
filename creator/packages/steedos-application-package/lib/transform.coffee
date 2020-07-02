@APTransform = {}

ignore_fields = {
	owner: 0,
	space: 0,
	created: 0,
	created_by: 0,
	modified: 0,
	modified_by: 0,
	is_deleted: 0,
	instances: 0,
	sharing: 0
}

APTransform.exportObject = (object)->
	_obj = {}

	_.extend(_obj , object)

	obj_list_views = {}

	_.extend(obj_list_views, _obj.list_views || {})

	_.each obj_list_views, (v, k)->
		if !_.has(v, "_id")
			v._id = k
		if !_.has(v, "name")
			v.name = k
	_obj.list_views = obj_list_views


	#只修改_obj属性原object属性保持不变
	triggers = {}
	_.forEach _obj.triggers, (trigger, key)->
		_trigger = {}
		_.extend(_trigger, trigger)
		if _.isFunction(_trigger.todo)
			_trigger.todo = _trigger.todo.toString()
		delete _trigger._todo
		triggers[key] = _trigger
	_obj.triggers = triggers

	actions = {}
	_.forEach _obj.actions, (action, key)->
		_action = {}
		_.extend(_action, action)
		if _.isFunction(_action.todo)
			_action.todo = _action.todo.toString()
		delete _action._todo
		actions[key] = _action

	_obj.actions = actions

	fields = {}
	_.forEach _obj.fields, (field, key)->
		_field = {}
		_.extend(_field, field)
		if _.isFunction(_field.options)
			_field.options = _field.options.toString()
			delete _field._options

		if _.isArray(_field.options)
			_fo = []
			_.forEach _field.options, (_o1)->
				_fo.push("#{_o1.label}:#{_o1.value}")
			_field.options = _fo.join(",")
			delete _field._options

		if _field.regEx
			_field.regEx = _field.regEx.toString()
			delete _field._regEx

		if _.isFunction(_field.optionsFunction)
			_field.optionsFunction = _field.optionsFunction.toString()
			delete _field._optionsFunction

		if _.isFunction(_field.reference_to)
			_field.reference_to = _field.reference_to.toString()
			delete _field._reference_to

		if _.isFunction(_field.createFunction)
			_field.createFunction = _field.createFunction.toString()
			delete _field._createFunction

		if _.isFunction(_field.defaultValue)
			_field.defaultValue = _field.defaultValue.toString()
			delete _field._defaultValue
		#TODO 转换field.autoform.type，已和朱思嘉确认，目前不支持autoform.type 为function类型
		fields[key] = _field

	_obj.fields = fields

	return _obj

###
导出数据:
{
	apps:[{}], 软件包选中的apps
	objects:[{}], 选中的object及其fields, list_views, triggers, actions, permission_set等
    list_views:[{}], 软件包选中的list_views
    permissions:[{}], 软件包选中的权限集
    permission_objects:[{}], 软件包选中的权限对象
    reports:[{}] 软件包选中的报表
}
###
APTransform.export = (record)->
	export_data = {}
	if _.isArray(record.apps) && record.apps.length > 0
		export_data.apps = []

		_.each record.apps, (appKey)->
			app = {}
			_.extend(app, Creator.Apps[appKey])
			if !app || _.isEmpty(app)
				app = Creator.getCollection("apps").findOne({_id: appKey}, {fields: ignore_fields})
			else
				if !_.has(app, "_id")
					app._id = appKey
			if app
				export_data.apps.push app

	if _.isArray(record.objects) && record.objects.length > 0
		export_data.objects = []
		_.each record.objects, (object_name)->
			object = Creator.Objects[object_name]
			if object
				export_data.objects.push APTransform.exportObject(object)

	if _.isArray(record.list_views) && record.list_views.length > 0
		export_data.list_views = Creator.getCollection("object_listviews").find({_id: {$in: record.list_views}}, {fields: ignore_fields}).fetch()

	if _.isArray(record.permission_set) && record.permission_set.length > 0
		export_data.permission_set = Creator.getCollection("permission_set").find({_id: {$in: record.permission_set}}, {fields: ignore_fields}).fetch()

	if _.isArray(record.permission_objects) && record.permission_objects.length > 0
		export_data.permission_objects = Creator.getCollection("permission_objects").find({_id: {$in: record.permission_objects}}, {fields: ignore_fields}).fetch()

	if _.isArray(record.reports) && record.reports.length > 0
		export_data.reports = Creator.getCollection("reports").find({_id: {$in: record.reports}}, {fields: ignore_fields}).fetch()

	return export_data
