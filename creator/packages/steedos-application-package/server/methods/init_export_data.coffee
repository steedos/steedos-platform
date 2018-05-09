#获取应用下的对象
getAppObjects = (app)->
	appObjects = []
	if app && _.isArray(app.objects) && app.objects.length > 0
		_.each app.objects, (object_name)->
			object = Creator.getObject(object_name)
			if object
				appObjects.push object_name
	return appObjects

#获取对象下的列表视图
getObjectsListViews = (space_id, objects_name)->
	objectsListViews = []
	if objects_name && _.isArray(objects_name) && objects_name.length > 0
		_.each objects_name, (object_name)->
			#获取对象的共享列表视图list_views
			list_views = Creator.getCollection("object_listviews").find({object_name: object_name, space: space_id, shared: true}, {fields: {_id: 1}})
			list_views.forEach (list_view)->
				objectsListViews.push list_view._id
	return objectsListViews

#获取对象下的报表
getObjectsReports = (space_id, objects_name)->
	objectsReports = []
	if objects_name && _.isArray(objects_name) && objects_name.length > 0
		_.each objects_name, (object_name)->
			#获取对象的报表reports
			reports = Creator.getCollection("reports").find({object_name: object_name, space: space_id}, {fields: {_id: 1}})
			reports.forEach (report)->
				objectsReports.push report._id
	return objectsReports

#获取对象下的权限集
getObjectsPermissionObjects = (space_id, objects_name)->
	objectsPermissionObjects = []
	if objects_name && _.isArray(objects_name) && objects_name.length > 0
		_.each objects_name, (object_name)->
			permission_objects = Creator.getCollection("permission_objects").find({object_name: object_name, space: space_id}, {fields: {_id: 1}})
			permission_objects.forEach (permission_object)->
				objectsPermissionObjects.push permission_object._id
	return objectsPermissionObjects

#获取对象下权限集对应的权限组
getObjectsPermissionSet = (space_id, objects_name)->
	objectsPermissionSet = []
	if objects_name && _.isArray(objects_name) && objects_name.length > 0
		_.each objects_name, (object_name)->
			permission_objects = Creator.getCollection("permission_objects").find({object_name: object_name, space: space_id}, {fields: {permission_set_id: 1}})
			permission_objects.forEach (permission_object)->
				permission_set = Creator.getCollection("permission_set").findOne({_id: permission_object.permission_set_id}, {fields: {_id: 1}})
				objectsPermissionSet.push permission_set._id
	return objectsPermissionSet


Meteor.methods
	"appPackage.init_export_data": (space_id, record_id)->
		userId = this.userId
		if !userId
			throw new Meteor.Error("401", "Authentication is required and has not been provided.")

		if !Creator.isSpaceAdmin(space_id, userId)
			throw new Meteor.Error("401", "Permission denied.")

		record = Creator.getCollection("application_package").findOne({_id: record_id})

		if (!_.isArray(record?.apps) || record?.apps?.length < 1) && (!_.isArray(record?.objects) || record?.objects?.length < 1)
			throw new Meteor.Error("500", "请先选择应用或者对象")

		data = {}
		_objects = record.objects || []
		_objects_list_views = record.list_views || []
		_objects_reports = record.reports || []
		_objects_permission_objects = record.permission_objects || []
		_objects_permission_set = record.permission_set || []

		try
			if _.isArray(record?.apps) && record.apps.length > 0
				_.each record.apps, (appId)->
					if !app
						#如果从代码中定义的apps中没有找到，则从数据库中获取
						app = Creator.getCollection("apps").findOne({_id: appId, is_creator: true}, {fields: {objects: 1}})
					_objects = _objects.concat(getAppObjects(app))

			if _.isArray(_objects) && _objects.length > 0
				_objects_list_views = _objects_list_views.concat(getObjectsListViews(space_id, _objects))
				_objects_reports = _objects_reports.concat(getObjectsReports(space_id, _objects))
				_objects_permission_objects = _objects_permission_objects.concat(getObjectsPermissionObjects(space_id, _objects))
				_objects_permission_set = _objects_permission_set.concat(getObjectsPermissionSet(space_id, _objects))

				data.objects = _.uniq _objects
				data.list_views = _.uniq _objects_list_views
				data.permission_set = _.uniq _objects_permission_set
				data.permission_objects = _.uniq _objects_permission_objects
				data.reports = _.uniq _objects_reports
				Creator.getCollection("application_package").update({_id: record._id},{$set: data})
		catch e
			console.error e.stack
			throw new Meteor.Error("500", e.reason || e.message )