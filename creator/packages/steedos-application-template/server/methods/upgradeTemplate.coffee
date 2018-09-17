
upgradeApp = (_id, newApp)->
	Creator.getCollection("apps").update({_id: _id}, {$set: newApp})

#清理list views
cleanListViews = (space_id, object_name, newListViews)->
	db_views = Creator.getCollection("object_listviews").find({space: space_id, object_name: object_name}, {fields: {_id: 1, name: 1}}).fetch()

	new_views = []

	_.each newListViews, (list_view, k)->
		if !_.has(list_view, "name")
			list_view.name = k
		new_views.push(list_view.name)

	db_views_name = _.pluck(db_views, 'name')

	toBeCleanListViews = _.difference(db_views_name, new_views)

	console.log('toBeCleanListViews', toBeCleanListViews)

	toBeCleanListViewIds =  _.pluck(_.filter(db_views, (f)->
			return _.contains(toBeCleanListViews, f.name)
		)
	, '_id'
	)
	console.log('toBeCleanListViewIds', toBeCleanListViewIds)
	Creator.getCollection("object_listviews").remove({_id: {$in: toBeCleanListViewIds}})


#清理字段
cleanFields = (space_id, object_name, newFields)->
	db_fields = Creator.getCollection("object_fields").find({space: space_id, object: object_name}, {fields: {_id: 1, name: 1}}).fetch()
	new_fields = []

	_.each newFields, (field, k)->
		if !_.has(field, "name")
			field.name = k
		new_fields.push(field.name)

	db_fields_name = _.pluck(db_fields, 'name')
	toBeCleanFields = _.difference(db_fields_name, new_fields)
	console.log('toBeCleanFields', toBeCleanFields)

	console.log('db_fields', _.filter db_fields, (f)->
		return _.contains(toBeCleanFields, f.name))

	toBeCleanFieldIds =  _.pluck(_.filter(db_fields, (f)->
		return _.contains(toBeCleanFields, f.name)
		)
		, '_id'
	)
	console.log('toBeCleanFieldIds', toBeCleanFieldIds)
	Creator.getCollection("object_fields").remove({_id: {$in: toBeCleanFieldIds}})

#清理triggers
cleanTriggers = (space_id, object_name, newTriggers)->
	db_triggers = Creator.getCollection("object_triggers").find({space: space_id, object: object_name}, {fields: {_id: 1, name: 1}}).fetch()
	new_triggers = []

	_.each newTriggers, (trigger, k)->
		if !_.has(trigger, "name")
			trigger.name = k
		new_triggers.push(trigger.name)

	db_triggers_name = _.pluck(db_triggers, 'name')
	toBeCleanTriggers = _.difference(db_triggers_name, new_triggers)
	console.log('toBeCleanTriggers', toBeCleanTriggers)

	toBeCleanTriggerIds =  _.pluck(_.filter(db_triggers, (f)->
			return _.contains(toBeCleanTriggers, f.name)
		)
	, '_id'
	)
	console.log('toBeCleanFieldIds', toBeCleanTriggerIds)
	Creator.getCollection("object_triggers").remove({_id: {$in: toBeCleanTriggerIds}})

#清理actions
cleanActions = (space_id, object_name, newActions)->
	db_actioins = Creator.getCollection("object_actions").find({space: space_id, object: object_name}, {fields: {_id: 1, name: 1}}).fetch()
	new_actions = []

	_.each newActions, (action, k)->
		if !_.has(action, "name")
			action.name = k
		new_actions.push(action.name)

	db_actions_name = _.pluck(db_actioins, 'name')
	toBeCleanActions = _.difference(db_actions_name, new_actions)
	console.log('toBeCleanActions', toBeCleanActions)

	toBeCleanActionIds =  _.pluck(_.filter(db_actioins, (f)->
			return _.contains(toBeCleanActions, f.name)
		)
	, '_id'
	)
	console.log('toBeCleanActionIds', toBeCleanActionIds)
	Creator.getCollection("object_actions").remove({_id: {$in: toBeCleanActionIds}})

clearObject = (space_id, unique_id, appVersion)->
	console.log('remove objects', {space: space_id, app_unique_id: unique_id.toString(), app_version: {$ne: appVersion.toString()}})
	Creator.getCollection("objects").remove({space: space_id, app_unique_id: unique_id.toString(), app_version: {$ne: appVersion.toString()}})


upgradeObject = (userId, space_id, newObject)->
	fields = newObject.fields
	triggers = newObject.triggers
	actions = newObject.actions
	obj_list_views = newObject.list_views

	delete newObject._id
	delete newObject.fields
	delete newObject.triggers
	delete newObject.actions
	delete newObject.permissions #删除permissions动态属性
	delete newObject.list_views

	newObject.space = space_id
	newObject.owner = userId
	console.log('update objects start...', newObject)
	Creator.getCollection("objects").update({space: space_id, name: newObject.name}, {$set: newObject})
	console.log('update objects end...')
	internal_list_view = {}

	console.log('update obj_list_views start...')
	_.each obj_list_views, (list_view, k)->
		console.log('list_view', list_view)
		old_id = list_view._id
		delete list_view._id
		list_view.space = space_id
		list_view.owner = userId
		list_view.object_name = newObject.name

		if !_.has(list_view, "name")
			list_view.name = k

		db_view = Creator.getCollection("object_listviews").findOne(
			{object_name: newObject.name,
			name: list_view.name,
			space: space_id}, {fields: {_id: 1}})
		if db_view
			console.log('update list_view', list_view)
			# 创建object时，会自动添加all view、recent view
			Creator.getCollection("object_listviews").update({_id: db_view._id}, {$set: list_view})
		else
			console.log('insert list_view', list_view)
			Creator.getCollection("object_listviews").insert(list_view)
	console.log('update obj_list_views end...')

	console.log('update fields start...')
	_.each fields, (field, k)->
		delete field._id
		field.space = space_id
		field.owner = userId
		field.object = newObject.name
		if !_.has(field, "name")
			field.name = k

		db_field = Creator.getCollection("object_fields").findOne({
			object: newObject.name,
			name: field.name,
			space: space_id
		}, {fields: {_id: 1}})

		if db_field
			Creator.getCollection("object_fields").update({_id: db_field._id}, {$set: field})
		else
			Creator.getCollection("object_fields").insert(field)
	console.log('update fields end...')

	console.log('update triggers start...')
	_.each triggers, (trigger, k)->
		delete triggers._id
		trigger.space = space_id
		trigger.owner = userId
		trigger.object = newObject.name
		if !_.has(trigger, "name")
			trigger.name = k.replace(new RegExp("\\.", "g"), "_")

		if !_.has(trigger, "is_enable")
			trigger.is_enable = true

		db_trigger = Creator.getCollection("object_triggers").findOne({
			object: newObject.name,
			name: trigger.name,
			space: space_id
		}, {fields: {_id: 1}})

		if db_trigger
			Creator.getCollection("object_triggers").update({_id: db_trigger._id}, {$set: trigger})
		else
			Creator.getCollection("object_triggers").insert(trigger)
	console.log('update triggers end...')

	console.log('update actions start...')
	_.each actions, (action, k)->
		delete action._id
		action.space = space_id
		action.owner = userId
		action.object = newObject.name
		if !_.has(action, "name")
			action.name = k.replace(new RegExp("\\.", "g"), "_")
		if !_.has(action, "is_enable")
			action.is_enable = true

		db_action = Creator.getCollection("object_actions").findOne({
			object: newObject.name,
			name: action.name,
			space: space_id
		}, {fields: {_id: 1}})

		if db_action
			Creator.getCollection("object_actions").update({_id: db_action._id}, {$set: action})
		else
			Creator.getCollection("object_actions").insert(action)
	console.log('update actions end...')

	cleanListViews(space_id, newObject.name, obj_list_views)

	cleanFields(space_id, newObject.name, fields)

	cleanTriggers(space_id, newObject.name, triggers)

	cleanActions(space_id, newObject.name, actions)

insertObject = (userId, space_id, newObject) ->
	console.log('insert object', newObject)
	Creator.importObject(userId, space_id, newObject, [])

Meteor.methods
	upgradeTemplate: (space_id, unique_id, appVersion)->
		userId = this.userId

		if !userId
			throw new Meteor.Error("401", "Authentication is required and has not been provided.")

		if !Creator.isSpaceAdmin(space_id, userId)
			throw new Meteor.Error("401", "Permission denied.")

		app = _.find Creator._TEMPLATE.Apps, (app)->
			return app.unique_id == unique_id && app.version.toString() == appVersion.toString()

		if app
			#查找当前工作区已安装的app
			space_app = Creator.getCollection("apps").findOne({space: space_id, unique_id: unique_id}, {fields: {_id: 1, unique_id: 1, space_id: 1, version: 1}})
			if space_app
				console.log(space_app.version, app.version)
				if space_app.version.toString() == app.version.toString()
					return ;
				else
					#升级App
					upgradeApp(space_app._id, app)

					#升级object及数据
					if _.isArray(app.objects)
						_.each app.objects, (object_name)->
							#确认用户是否已经安装了object_name
							space_object = Creator.getCollection("objects").findOne({space: space_id, name: object_name})
							object = Creator.AppTemplate.getAppObject(object_name)
							object.app_unique_id = unique_id.toString()
							object.app_version = appVersion.toString()
							if space_object
								upgradeObject(userId, space_id, APTransform.exportObject(object))
							else
								insertObject(userId, space_id, APTransform.exportObject(object))

					#清理弃用的object
					clearObject(space_id, unique_id, appVersion)
			else
				throw new Meteor.Error("当前工作区未安装应用：#{app.label}, 请刷新页面后再重试")
