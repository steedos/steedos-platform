JsonRoutes.add 'get', '/api/creator/:space/objects/:_id', (req, res, next) ->
	try
		_id = req.params._id
		spaceId = req.params.space
		userId = req.headers["x-user-id"]

		type = req.query?.type

		object = Creator.getCollection('objects').findOne(_id) || {}


		if !_.isEmpty(object)
			object.list_views = Creator.getUserObjectListViews(userId, spaceId, object.name)

			if type == "added"
				psetsAdmin = Creator.getCollection("permission_set").findOne({space: spaceId, name: 'admin'}, {fields:{_id:1, assigned_apps:1}})
				psetsUser = Creator.getCollection("permission_set").findOne({space: spaceId, name: 'user'}, {fields:{_id:1, assigned_apps:1}})
				psetsCurrent = Creator.getCollection("permission_set").find({users: userId, space: spaceId}, {fields:{_id:1, assigned_apps:1}}).fetch()
				psets = { psetsAdmin, psetsUser, psetsCurrent }

				if !Creator.getObject(object.name)
					Creator.Object(object)

				object.permissions = Creator.getObjectPermissions.bind(psets)(spaceId, userId, object.name)

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