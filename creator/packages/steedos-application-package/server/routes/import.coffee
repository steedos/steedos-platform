
import_app_package = (userId, space_id, imp_data)->
	if !userId
		throw new Meteor.Error("401", "Authentication is required and has not been provided.")

	if !Creator.isSpaceAdmin(space_id, userId)
		throw new Meteor.Error("401", "Permission denied.")

	###数据校验 开始###
	check(imp_data, Object)

	# 1 apps校验：根据_id判断应用是否已存在
	imp_app_ids = _.pluck(imp_data.apps, "_id")
	if _.isArray(imp_data.apps) && imp_data.apps.length > 0
		_.each imp_data.apps, (app)->
			if _.include(_.keys(Creator.Apps), app._id)
				throw new Meteor.Error("500", "应用'#{app.name}'已存在")

	# 2 objects校验：根据object.name判断对象是否已存在; 校验triggers
	if _.isArray(imp_data.objects) && imp_data.objects.length > 0
		_.each imp_data.objects, (object)->
			if _.include(_.keys(Creator.Objects), object.name)
				throw new Meteor.Error("500", "对象'#{object.name}'已存在")
			_.each object.triggers, (trigger)->
				if trigger.on == 'server' && !Steedos.isLegalVersion(space_id,"workflow.enterprise")
					throw new Meteor.Error 500, "只有企业版支持配置服务端的触发器"

	imp_object_names = _.pluck(imp_data.objects, "name")
	object_names = _.keys(Creator.Objects)

	# 3 判断apps的对象是否都存在
	if _.isArray(imp_data.apps) && imp_data.apps.length > 0
		_.each imp_data.apps, (app)->
			_.each app.objects, (object_name)->
				if !_.include(object_names, object_name) && !_.include(imp_object_names, object_name)
					throw new Meteor.Error("500", "应用'#{app.name}'中指定的对象'#{object_name}'不存在")

	# 4 list_views校验：判断list_views对应的object是否存在
	if _.isArray(imp_data.list_views) && imp_data.list_views.length > 0
		_.each imp_data.list_views, (list_view)->
			if !list_view.object_name || !_.isString(list_view.object_name)
				throw new Meteor.Error("500", "列表视图'#{list_view.name}'的object_name属性无效")
			if !_.include(object_names, list_view.object_name) && !_.include(imp_object_names, list_view.object_name)
				throw new Meteor.Error("500", "列表视图'#{list_view.name}'中指定的对象'#{list_view.object_name}'不存在")

	# 5 permission_set校验：判断权限组中的授权应用assigned_apps; 权限组的名称不允许重复
	permission_set_ids = _.pluck(imp_data.permission_set, "_id")
	if _.isArray(imp_data.permission_set) && imp_data.permission_set.length > 0
		_.each imp_data.permission_set, (permission_set)->
			if Creator.getCollection("permission_set").findOne({space: space_id, name: permission_set.name},{fields:{_id:1}})
				throw new Meteor.Error 500, "权限组名称'#{permission_set.name}'不能重复"
			_.each permission_set.assigned_apps, (app_id)->
				if !_.include(_.keys(Creator.Apps), app_id) && !_.include(imp_app_ids, app_id)
					throw new Meteor.Error("500", "权限组'#{permission_set.name}'的授权应用'#{app_id}'不存在")

	# 6 permission_objects校验：判断权限集中指定的object是否存在；判断权限组标识是是否有效
	if _.isArray(imp_data.permission_objects) && imp_data.permission_objects.length > 0
		_.each imp_data.permission_objects, (permission_object)->
			if !permission_object.object_name || !_.isString(permission_object.object_name)
				throw new Meteor.Error("500", "权限集'#{permission_object.name}'的object_name属性无效")
			if !_.include(object_names, permission_object.object_name) && !_.include(imp_object_names, permission_object.object_name)
				throw new Meteor.Error("500", "权限集'#{list_view.name}'中指定的对象'#{permission_object.object_name}'不存在")

			if !_.has(permission_object, "permission_set_id") || !_.isString(permission_object.permission_set_id)
				throw new Meteor.Error("500", "权限集'#{permission_object.name}'的permission_set_id属性无效")
			else if !_.include(permission_set_ids, permission_object.permission_set_id)
				throw new Meteor.Error("500", "权限集'#{permission_object.name}'指定的权限组'#{permission_object.permission_set_id}'值不在导入的permission_set中")

	# 7 reports校验：判断报表中指定的object是否存在
	if _.isArray(imp_data.reports) && imp_data.reports.length > 0
		_.each imp_data.reports, (report)->
			if !report.object_name || !_.isString(report.object_name)
				throw new Meteor.Error("500", "报表'#{report.name}'的object_name属性无效")
			if !_.include(object_names, report.object_name) && !_.include(imp_object_names, report.object_name)
				throw new Meteor.Error("500", "权限集'#{report.name}'中指定的对象'#{report.object_name}'不存在")

	###数据校验 结束###

	###数据持久化 开始###

	# 定义新旧数据对应关系集合
	apps_id_maps = {}
	list_views_id_maps = {}
	permission_set_id_maps = {}

	# 1 持久化Apps
	if _.isArray(imp_data.apps) && imp_data.apps.length > 0
		_.each imp_data.apps, (app)->
			old_id = app._id
			delete app._id
			app.space = space_id
			app.owner = userId
			app.is_creator = true
			new_id = Creator.getCollection("apps").insert(app)
			apps_id_maps[old_id] = new_id

	# 2 持久化objects
	if _.isArray(imp_data.objects) && imp_data.objects.length > 0
		_.each imp_data.objects, (object)->
			fields = object.fields
			triggers = object.triggers
			actions = object.actions
			obj_list_views = object.list_views

			delete object._id
			delete object.fields
			delete object.triggers
			delete object.actions
			delete object.permissions #删除permissions动态属性
			delete object.list_views

			object.space = space_id
			object.owner = userId

			Creator.getCollection("objects").insert(object)

			# 2.1 持久化对象list_views
			internal_list_view = {}
			_.each obj_list_views, (list_view)->
				old_id = list_view._id
				delete list_view._id
				list_view.space = space_id
				list_view.owner = userId
				list_view.object_name = object.name
				if Creator.isAllView(list_view) || Creator.isRecentView(list_view)
					# 创建object时，会自动添加all view、recent view
					Creator.getCollection("object_listviews").update({object_name: object.name, name: list_view.name, space: space_id}, {$set: list_view})
				else
					new_id = Creator.getCollection("object_listviews").insert(list_view)
					list_views_id_maps[object.name + "_" + old_id] = new_id

			# 2.2 持久化对象字段
			_.each fields, (field, k)->
				delete field._id
				field.space = space_id
				field.owner = userId
				field.object = object.name
				if !_.has(field, "name")
					field.name = k
				if field.name == "name"
					# 创建object时，会自动添加name字段，因此在此处对name字段进行更新
					Creator.getCollection("object_fields").update({object: object.name, name: "name", space: space_id}, {$set: field})
				else
					Creator.getCollection("object_fields").insert(field)

			# 2.3 持久化触发器
			_.each triggers, (trigger, k)->
				delete triggers._id
				trigger.space = space_id
				trigger.owner = userId
				trigger.object = object.name
				if !_.has(trigger, "name")
					trigger.name = k.replace(new RegExp("\\.", "g"), "_")
				Creator.getCollection("object_triggers").insert(trigger)

			# 2.4 持久化操作
			_.each actions, (action, k)->
				delete action._id
				action.space = space_id
				action.owner = userId
				action.object = object.name
				if !_.has(action, "name")
					action.name = k.replace(new RegExp("\\.", "g"), "_")
				Creator.getCollection("object_actions").insert(action)

	# 3 持久化list_views
	if _.isArray(imp_data.list_views) && imp_data.list_views.length > 0
		_.each imp_data.list_views, (list_view)->
			old_id = list_view._id
			delete list_view._id

			list_view.space = space_id
			list_view.owner = userId
			if Creator.isAllView(list_view) || Creator.isRecentView(list_view)
				# 创建object时，会自动添加all view、recent view
				_list_view = Creator.getCollection("object_listviews").findOne({object_name: list_view.object_name, name: list_view.name, space: space_id},{fields: {_id: 1}})
				if _list_view
					new_id = _list_view._id
				Creator.getCollection("object_listviews").update({object_name: list_view.object_name, name: list_view.name, space: space_id}, {$set: list_view})
			else
				new_id = Creator.getCollection("object_listviews").insert(list_view)

			list_views_id_maps[list_view.object_name + "_" + old_id] = new_id

	# 4 持久化permission_set
	if _.isArray(imp_data.permission_set) && imp_data.permission_set.length > 0
		_.each imp_data.permission_set, (permission_set)->
			old_id = permission_set._id
			delete permission_set._id

			permission_set.space = space_id
			permission_set.owner = userId

			permission_set_users = []
			_.each permission_set.users, (user_id)->
				space_user = Creator.getCollection("space_users").findOne({space: space_id, user: user_id}, {fields: {_id: 1}})
				if space_user
					permission_set_users.push user_id

			assigned_apps = []
			_.each permission_set.assigned_apps, (app_id)->
				if _.include(_.keys(Creator.Apps), app_id)
					assigned_apps.push app_id
				else if apps_id_maps[app_id]
					assigned_apps.push apps_id_maps[app_id]


			new_id = Creator.getCollection("permission_set").insert(permission_set)

			permission_set_id_maps[old_id] = new_id

	# 5  持久化permission_objects
	if _.isArray(imp_data.permission_objects) && imp_data.permission_objects.length > 0
		_.each imp_data.permission_objects, (permission_object)->
			delete permission_object._id

			permission_object.space = space_id
			permission_object.owner = userId

			permission_object.permission_set_id = permission_set_id_maps[permission_object.permission_set_id]

			disabled_list_views = []
			_.each permission_object.disabled_list_views, (list_view_id)->
				new_view_id = list_views_id_maps[permission_object.object_name + "_" + list_view_id]
				if new_view_id
					disabled_list_views.push new_view_id

			Creator.getCollection("permission_objects").insert(permission_object)

	# 6 持久化reports
	if _.isArray(imp_data.reports) && imp_data.reports.length > 0
		_.each imp_data.reports, (report)->
			delete report._id

			report.space = space_id
			report.owner = userId

			Creator.getCollection("reports").insert(report)
	###数据持久化 结束###

###由于使用接口方式会导致collection的after、before中获取不到userId，再此问题未解决之前，还是使用Method
JsonRoutes.add 'post', '/api/creator/app_package/import/:space_id', (req, res, next) ->
	try
		userId = Steedos.getUserIdFromAuthToken(req, res);
		space_id = req.params.space_id
		imp_data = req.body
		import_app_package(userId, space_id, imp_data)
		JsonRoutes.sendResult res, {
			code: 200
			data: {}
		}
	catch e
		console.error e.stack
		JsonRoutes.sendResult res, {
			code: e.error
			data: { errors: errorMessage: e.reason || e.message }
		}
###

Meteor.methods
	'import_app_package': (space_id, imp_data)->
		userId = this.userId
		import_app_package(userId, space_id, imp_data)
