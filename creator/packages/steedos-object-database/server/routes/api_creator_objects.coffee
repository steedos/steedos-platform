clone = require("clone");
steedosI18n = require("@steedos/i18n");

_getLocale = (user)->
	if user?.locale?.toLocaleLowerCase() == 'zh-cn'
		locale = "zh-CN"
	else if user?.locale?.toLocaleLowerCase() == 'en-us'
		locale = "en"
	else
		locale = "zh-CN"
	return locale

getUserProfileObjectLayout = (userId, spaceId, objectName)->
	spaceUser = Creator.getCollection("space_users").findOne({space: spaceId, user: userId}, {fields: {profile: 1}})
	if spaceUser && spaceUser.profile
		return Creator.getCollection("object_layouts")?.findOne({space: spaceId, profiles: spaceUser.profile, object_name: objectName});

JsonRoutes.add 'get', '/api/creator/:space/objects/:_id', (req, res, next) ->
	try
		_id = req.params._id
		spaceId = req.params.space
		userId = req.headers["x-user-id"]

		type = req.query?.type

		_object = Creator.getCollection('objects').findOne(_id) || {}

		object = {}
		isSpaceAdmin = Creator.isSpaceAdmin(spaceId, userId)
		if !_.isEmpty(_object)
			if isSpaceAdmin || _object.in_development == '0' && _object.is_enable
				object = clone(new Creator.Object(_object));
				delete object.db
				object.list_views = Creator.getUserObjectListViews(userId, spaceId, object.name)
	#			if type == "added"
				psetsAdmin = Creator.getCollection("permission_set").findOne({space: spaceId, name: 'admin'}, {fields:{_id:1, assigned_apps:1}})
				psetsUser = Creator.getCollection("permission_set").findOne({space: spaceId, name: 'user'}, {fields:{_id:1, assigned_apps:1}})
				psetsCurrent = Creator.getCollection("permission_set").find({users: userId, space: spaceId}, {fields:{_id:1, assigned_apps:1}}).fetch()
				psets = { psetsAdmin, psetsUser, psetsCurrent }

				object.permissions = Creator.getObjectPermissions.bind(psets)(spaceId, userId, object.name)

				lng = _getLocale(db.users.findOne(userId, {fields: {locale: 1}}))
				steedosI18n.translationObject(lng, object.name, Object.assign(object, {datasource: _object.datasource}))

				objectLayout = getUserProfileObjectLayout(userId, spaceId, object.name)
				if objectLayout
					_fields = {};
					_.each objectLayout.fields, (_item)->
						_fields[_item.field] = object.fields[_item.field]
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
					object.fields = _fields
					object.allow_actions = objectLayout.actions || []
		JsonRoutes.sendResult res, {
			code: 200
			data: object
		}
	catch e
		console.error e.stack
		JsonRoutes.sendResult res, {
			code: 200
			data: { errors: [{ errorMessage: e.reason || e.message }] }
		}