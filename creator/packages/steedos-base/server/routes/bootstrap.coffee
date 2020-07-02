steedosAuth = require("@steedos/auth");
steedosI18n = require("@steedos/i18n");
steedosCore = require("@steedos/core");
clone = require("clone");

_getLocale = (user)->
	if user?.locale?.toLocaleLowerCase() == 'zh-cn'
		locale = "zh-CN"
	else if user?.locale?.toLocaleLowerCase() == 'en-us'
		locale = "en"
	else
		locale = "zh-CN"
	return locale

getUserProfileObjectsLayout = (userId, spaceId)->
	spaceUser = Creator.getCollection("space_users").findOne({space: spaceId, user: userId}, {fields: {profile: 1}})
	if spaceUser && spaceUser.profile
		return Creator.getCollection("object_layouts")?.find({space: spaceId, profiles: spaceUser.profile}).fetch();


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

	result = Creator.getAllPermissions(spaceId, userId);
#	console.time('translationObjects');
	lng = _getLocale(db.users.findOne(userId, {fields: {locale: 1}}))
	steedosI18n.translationObjects(lng, result.objects);
#	console.timeEnd('translationObjects');
	result.user = userSession
	result.space = space
	result.apps = clone(Creator.Apps)
	result.dashboards = clone(Creator.Dashboards)
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
		result.apps = _.extend result.apps, clone(datasource.getAppsConfig())
		result.dashboards = _.extend result.dashboards, datasource.getDashboardsConfig()
	result.apps = _.extend( result.apps || {}, Creator.getDBApps(spaceId))
	result.dashboards = _.extend( result.dashboards || {}, Creator.getDBDashboards(spaceId))

	_Apps = {}
	_.each result.apps, (app, key) ->
		if !app._id
			app._id = key
		if app.code
			app._dbid = app._id
			app._id = app.code
		_Apps[app._id] = app
	steedosI18n.translationApps(lng, _Apps);
	result.apps = _Apps;
	assigned_menus = clone(result.assigned_menus);
	steedosI18n.translationMenus(lng, assigned_menus);
	result.assigned_menus = assigned_menus;

	_Dashboards = {}
	_.each result.dashboards, (dashboard, key) ->
		if !dashboard._id
			dashboard._id = key
		_Dashboards[dashboard._id] = dashboard
	result.dashboards = _Dashboards

	result.plugins = steedosCore.getPlugins?()

	objectsLayout = getUserProfileObjectsLayout(userId, spaceId);

	if objectsLayout
		_.each objectsLayout, (objectLayout)->
			_object = clone(result.objects[objectLayout.object_name]);
			if _object
				_fields = {};
				_.each objectLayout.fields, (_item)->
					_fields[_item.field] = _object.fields[_item.field]
					if _.has(_item, 'group')
						_fields[_item.field].group = _item.group
					if _item.required
						_fields[_item.field].readonly = false
						_fields[_item.field].disabled = false
						_fields[_item.field].required = true
					else if _item.readonly
						_fields[_item.field].readonly = true
						_fields[_item.field].disabled = true
						_fields[_item.field].required = false
				_object.fields = _fields

#				_actions = {};
#				_.each objectLayout.actions, (actionName)->
#					_actions[actionName] = _object.actions[actionName]
#				_object.actions = _actions
				_object.allow_actions = objectLayout.actions || []
			result.objects[objectLayout.object_name] = _object

	JsonRoutes.sendResult res,
		code: 200,
		data: result
