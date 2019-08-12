steedosAuth = require("@steedos/auth");

JsonRoutes.add "get", "/api/bootstrap/:spaceId/",(req, res, next)->
	userId = req.headers['x-user-id']
	spaceId = req.headers['x-space-id'] || req.params?.spaceId
	if !userId
		JsonRoutes.sendResult res,
			code: 403,
			data: null
		return

	space = Creator.Collections["spaces"].findOne({_id: spaceId}, {fields: {name: 1}})

	result = Creator.getAllPermissions(spaceId, userId)
	result.space = space
	result.apps = _.extend Creator.getDBApps(spaceId), Creator.Apps
	result.object_listviews = Creator.getUserObjectsListViews(userId, spaceId, result.objects)
	result.object_workflows = Meteor.call 'object_workflows.get', spaceId, userId

	authToken = Steedos.getAuthToken(req, res)

	userSession = Meteor.wrapAsync((authToken, spaceId, cb)->
			steedosAuth.getSession(authToken, spaceId).then (resolve, reject)->
				cb(reject, resolve)
		)(authToken, spaceId)

	permissions = Meteor.wrapAsync (v, userSession, cb)->
		v.getUserObjectPermission(userSession).then (resolve, reject)->
			cb(reject, resolve)

	_.each Creator.steedosSchema.getDataSources(), (datasource, name) ->
		if name != 'default'
			datasourceObjects = datasource.getObjects()
			_.each(datasourceObjects, (v, k)->
				_obj = Creator.convertObject(v.toConfig())
				_obj.name = "#{name}.#{k}"
				_obj.database_name = name
				_obj.permissions = permissions(v, userSession)
				result.objects[_obj.name] = _obj
			)
	_.each Creator.steedosSchema.getDataSources(), (datasource, name) ->
		result.apps = _.extend result.apps, datasource.getAppsConfig()

	JsonRoutes.sendResult res,
		code: 200,
		data: result
