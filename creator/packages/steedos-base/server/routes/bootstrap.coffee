steedosAuth = require("@steedos/auth");
steedosCore = require("@steedos/core");

JsonRoutes.add "get", "/api/bootstrap/:spaceId/",(req, res, next)->
	userId = req.headers['x-user-id']
	spaceId = req.headers['x-space-id'] || req.params?.spaceId
	if !userId
		JsonRoutes.sendResult res,
			code: 403,
			data: null
		return

	authToken = Steedos.getAuthToken(req, res)
	userSession = Meteor.wrapAsync((authToken, spaceId, cb)->
			steedosAuth.getSession(authToken, spaceId).then (resolve, reject)->
				cb(reject, resolve)
		)(authToken, spaceId)
	
	unless userSession
		JsonRoutes.sendResult res,
			code: 500,
			data: null
		return

	space = Creator.Collections["spaces"].findOne({_id: spaceId}, {fields: {name: 1}})

	result = Creator.getAllPermissions(spaceId, userId)
	result.user = userSession
	result.space = space
	result.apps = Creator.Apps
	result.object_listviews = Creator.getUserObjectsListViews(userId, spaceId, result.objects)
	result.object_workflows = Meteor.call 'object_workflows.get', spaceId, userId

	permissions = Meteor.wrapAsync (v, userSession, cb)->
		v.getUserObjectPermission(userSession).then (resolve, reject)->
			cb(reject, resolve)

	_.each Creator.steedosSchema.getDataSources(), (datasource, name) ->
		if name != 'default'
			datasourceObjects = datasource.getObjects()
			_.each(datasourceObjects, (v, k)->
				_obj = Creator.convertObject(v.toConfig())
#				_obj.name = "#{name}.#{k}"
				_obj.name = k
				_obj.database_name = name
				_obj.permissions = permissions(v, userSession)
				result.objects[_obj.name] = _obj
			)
	_.each Creator.steedosSchema.getDataSources(), (datasource, name) ->
		result.apps = _.extend result.apps, datasource.getAppsConfig()
	result.apps = _.extend( result.apps || {}, Creator.getDBApps(spaceId))

	_Apps = {}
	_.each result.apps, (app, key) ->
		if !app._id
			app._id = key
		if app.code
			app._dbid = app._id
			app._id = app.code
		_Apps[app._id] = app
	result.apps = _Apps

	result.plugins = steedosCore.getPlugins?()

	JsonRoutes.sendResult res,
		code: 200,
		data: result
