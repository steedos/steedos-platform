Meteor.startup ->

	getObjects = (spaceId, userId, object_names)->
		data = {}
		object_names.split(',').forEach (object_name)->
			object = getObject(spaceId, userId, object_name)
			data[object.name] = object
		return data;

	getObject = (spaceId, userId, object_name)->
		data = _.clone(Creator.Objects[object_name])
		if !data
			throw new Meteor.Error(500, "无效的id #{object_name}")

		psetsAdmin = Creator.getCollection("permission_set").findOne({space: spaceId, name: 'admin'}, {fields:{_id:1, assigned_apps:1}})
		psetsUser = Creator.getCollection("permission_set").findOne({space: spaceId, name: 'user'}, {fields:{_id:1, assigned_apps:1}})
		psetsCurrent = Creator.getCollection("permission_set").find({users: userId, space: spaceId}, {fields:{_id:1, assigned_apps:1}}).fetch()
		psets = { psetsAdmin, psetsUser, psetsCurrent }

		object_permissions = Creator.getObjectPermissions.bind(psets)(spaceId, userId, object_name)

		delete data.list_views
		delete data.permission_set

		if object_permissions.allowRead
			data.allowRead = true
			data.allowEdit = object_permissions.allowEdit
			data.allowDelete = object_permissions.allowDelete
			data.allowCreate = object_permissions.allowCreate
			data.modifyAllRecords = object_permissions.modifyAllRecords

			fields = {}
			_.forEach data.fields, (field, key)->
				_field = _.clone(field)

				if !_field.name
					_field.name = key

				#将不可编辑的字段设置为readonly = true
				if (_.indexOf(object_permissions.uneditable_fields, _field.name) > -1)
					_field.readonly = true

				#不返回不可见字段
				if (_.indexOf(object_permissions.unreadable_fields, _field.name) < 0)
					fields[key] = _field

			data.fields = fields

		else
			data.allowRead = false

		return data

	JsonRoutes.add 'get', SteedosOData.API_PATH + '/objects/:id', (req, res, next) ->
		try
			userId = Steedos.getUserIdFromAuthToken(req, res);
			if !userId
				throw new Meteor.Error(500, "No permission")

			spaceId = req.params?.spaceId
			if !spaceId
				throw new Meteor.Error(500, "Miss spaceId")

			object_name = req.params?.id
			if !object_name
				throw new Meteor.Error(500, "Miss id")

			if object_name.split(',').length > 1
				data = getObjects(spaceId, userId, object_name)
			else
				data = getObject(spaceId, userId, object_name)

			JsonRoutes.sendResult res, {
				code: 200,
				data: data || {}
			}
		catch e
			console.error e.stack
			JsonRoutes.sendResult res, {
				code: e.error || 500
				data: {errors: e.reason || e.message}
			}