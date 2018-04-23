JsonRoutes.add "get", "/api/bootstrap/:spaceId/",(req, res,next)->
	# if !this.userId
	# 	return null
	userId = req.headers['x-user-id']
	space_id = req.headers['x-space-id'] || req.params?.spaceId
	# check if user in the space
	su = Creator.Collections["space_users"].findOne({space: space_id, user: userId})
	if !su
		space_id == null

	# if space_id not exists, get the first one.
	if !space_id
		su = Creator.Collections["space_users"].findOne({user: userId})
		if !su
			return null
		space_id = su.space

	space = Creator.Collections["spaces"].findOne({_id: space_id}, {fields: {name: 1}})

	result = Creator.getAllPermissions(space_id, userId)
	result.space = space
	result.apps = _.extend Creator.getDBApps(space_id), Creator.Apps
	result.object_listviews = Creator.getUserObjectsListViews(userId, space_id, result.objects)
	JsonRoutes.sendResult res,
		code:200,
		data:result
	return ;
