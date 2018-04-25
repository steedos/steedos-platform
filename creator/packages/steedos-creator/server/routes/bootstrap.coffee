JsonRoutes.add "get", "/api/bootstrap/:spaceId/",(req, res, next)->
	userId = req.headers['x-user-id']
	spaceId = req.headers['x-space-id'] || req.params?.spaceId
	if !userId
		JsonRoutes.sendResult res,
			code: 403,
			data: null
		return
	# suFields = {name: 1, mobile: 1, position: 1, email: 1, company: 1, organization: 1, space: 1}
	# # check if user in the space 
	# su = Creator.Collections["space_users"].findOne({space: space_id, user: userId}, {fields: suFields})
	# if !su
	# 	space_id = null

	# # if space_id not exists, get the first one.
	# if !space_id
	# 	su = Creator.Collections["space_users"].findOne({user: userId}, {fields: suFields})
	# 	if !su
	# 		JsonRoutes.sendResult res,
	# 			code: 500,
	# 			data: null
	# 		return
	# 	space_id = su.space
	
	# USER_CONTEXT = {}
	# USER_CONTEXT.userId = userId
	# USER_CONTEXT.spaceId = space_id
	# USER_CONTEXT.user = {
	# 	_id: userId
	# 	name: su.name,
	# 	mobile: su.mobile,
	# 	position: su.position,
	# 	email: su.email
	# 	company: su.company
	# }
	# space_user_org = Creator.getCollection("organizations")?.findOne(su.organization)
	# if space_user_org
	# 	USER_CONTEXT.user.organization = {
	# 		_id: space_user_org._id,
	# 		name: space_user_org.name,
	# 		fullname: space_user_org.fullname,
	# 		is_company: space_user_org.is_company
	# 	}

	USER_CONTEXT = Creator.getUserContext(userId, spaceId, true)
	unless USER_CONTEXT
		JsonRoutes.sendResult res,
			code: 500,
			data: null
		return
	
	space = Creator.Collections["spaces"].findOne({_id: spaceId}, {fields: {name: 1}})

	result = Creator.getAllPermissions(spaceId, userId)
	result.USER_CONTEXT = USER_CONTEXT
	result.space = space
	result.apps = _.extend Creator.getDBApps(spaceId), Creator.Apps
	result.object_listviews = Creator.getUserObjectsListViews(userId, spaceId, result.objects)
	result.object_workflows = Meteor.call 'object_workflows.get', spaceId, userId
	JsonRoutes.sendResult res,
		code: 200,
		data: result
