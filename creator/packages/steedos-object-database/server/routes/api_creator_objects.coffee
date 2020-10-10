clone = require("clone");
steedosAuth = require("@steedos/auth");
steedosI18n = require("@steedos/i18n");
objectql = require("@steedos/objectql");

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
		if !_.isEmpty(_object)
			isSpaceAdmin = false
			spaceUser = null
			if userId
				isSpaceAdmin = Creator.isSpaceAdmin(spaceId, userId)
				spaceUser = Creator.getCollection("space_users").findOne({ space: spaceId, user: userId }, { fields: { profile: 1 } })

			psetsAdmin = Creator.getCollection("permission_set").findOne({space: spaceId, name: 'admin'}, {fields:{_id:1, assigned_apps:1}}) || null
			psetsUser = Creator.getCollection("permission_set").findOne({space: spaceId, name: 'user'}, {fields:{_id:1, assigned_apps:1}}) || null
			psetsMember = Creator.getCollection("permission_set").findOne({space: spaceId, name: 'member'}, {fields:{_id:1, assigned_apps:1}}) || null
			psetsGuest = Creator.getCollection("permission_set").findOne({space: spaceId, name: 'guest'}, {fields:{_id:1, assigned_apps:1}}) || null

			psetsSupplier = Creator.getCollection("permission_set").findOne({space: spaceId, name: 'supplier'}, {fields:{_id:1, assigned_apps:1}}) || null
			psetsCustomer = Creator.getCollection("permission_set").findOne({space: spaceId, name: 'customer'}, {fields:{_id:1, assigned_apps:1}}) || null
			if spaceUser && spaceUser.profile
				psetsCurrent = Creator.getCollection("permission_set").find({space: spaceId, $or: [{users: userId}, {name: spaceUser.profile}]}, {fields:{_id:1, assigned_apps:1, name:1}}).fetch()
			else
				psetsCurrent = Creator.getCollection("permission_set").find({users: userId, space: spaceId}, {fields:{_id:1, assigned_apps:1, name:1}}).fetch()

			psetsAdmin_pos = null
			psetsUser_pos = null
			psetsMember_pos = null
			psetsGuest_pos = null
			psetsCurrent_pos = null
			psetsSupplier_pos = null
			psetsCustomer_pos = null

			if psetsAdmin?._id
				psetsAdmin_pos = Creator.getCollection("permission_objects").find({permission_set_id: psetsAdmin._id}, {fields: {created: 0, modified: 0, created_by: 0, modified_by: 0}}).fetch()
			if psetsUser?._id
				psetsUser_pos = Creator.getCollection("permission_objects").find({permission_set_id: psetsUser._id}, {fields: {created: 0, modified: 0, created_by: 0, modified_by: 0}}).fetch()
			if psetsMember?._id
				psetsMember_pos = Creator.getCollection("permission_objects").find({permission_set_id: psetsMember._id}, {fields: {created: 0, modified: 0, created_by: 0, modified_by: 0}}).fetch()
			if psetsGuest?._id
				psetsGuest_pos = Creator.getCollection("permission_objects").find({permission_set_id: psetsGuest._id}, {fields: {created: 0, modified: 0, created_by: 0, modified_by: 0}}).fetch()
			if psetsSupplier?._id
				psetsSupplier_pos = Creator.getCollection("permission_objects").find({permission_set_id: psetsSupplier._id}, {fields: {created: 0, modified: 0, created_by: 0, modified_by: 0}}).fetch()
			if psetsCustomer?._id
				psetsCustomer_pos = Creator.getCollection("permission_objects").find({permission_set_id: psetsCustomer._id}, {fields: {created: 0, modified: 0, created_by: 0, modified_by: 0}}).fetch()

			if psetsCurrent.length > 0
				set_ids = _.pluck psetsCurrent, "_id"
				psetsCurrent_pos = Creator.getCollection("permission_objects").find({permission_set_id: {$in: set_ids}}).fetch()
				psetsCurrentNames = _.pluck psetsCurrent, "name"

			psets = {
				psetsAdmin,
				psetsUser,
				psetsCurrent,
				psetsMember,
				psetsGuest,
				psetsSupplier,
				psetsCustomer,
				isSpaceAdmin,
				spaceUser,
				psetsAdmin_pos,
				psetsUser_pos,
				psetsMember_pos,
				psetsGuest_pos,
				psetsSupplier_pos,
				psetsCustomer_pos,
				psetsCurrent_pos
			}

			if isSpaceAdmin || _object.in_development == '0' && _object.is_enable
				if _object.datasource != 'default'
					authToken = Steedos.getAuthToken(req, res)
					userSession = Meteor.wrapAsync((authToken, spaceId, cb)->
						steedosAuth.getSession(authToken, spaceId).then (resolve, reject)->
							cb(reject, resolve)
					)(authToken, spaceId)
					permissions = Meteor.wrapAsync (v, userSession, cb)->
						v.getUserObjectPermission(userSession).then (resolve, reject)->
							cb(reject, resolve)
					object = Creator.convertObject(clone(objectql.getObject(_object.name).toConfig()), spaceId)
					object.database_name = Creator.getCollection("datasources").findOne({_id: _object.datasource})?.label
					object.permissions = permissions(objectql.getObject(_object.name), userSession)
				else

					object = Creator.convertObject(clone(Creator.Objects[_object.name]), spaceId) # Creator.convertObject(clone(Creator.Objects[_object.name]), spaceId) # Creator.convertObject(clone(new Creator.Object(_object)), spaceId);
					object.permissions = Creator.getObjectPermissions.bind(psets)(spaceId, userId, object.name)

				delete object.db
				object.list_views = Creator.getUserObjectListViews(userId, spaceId, object.name)
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
					object.allow_relatedList = objectLayout.relatedList || []
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