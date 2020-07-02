JsonRoutes.add("post", "/api/formula/users", (req, res, next) ->

	current_user_info = uuflowManager.check_authorization(req)
	current_user = current_user_info._id

	userIds = req.body.userIds
	spaceId = req.body.spaceId
	spaceUsers = [];

	space_user = db.space_users.findOne({user: current_user, space: spaceId}, {fields: {_id: 1}})
	if !space_user
		return JsonRoutes.sendResult(res, {
			code: 200,
			data: {
				'errors': '无权限'
			}
		});

	if (!userIds || !spaceId)
		return JsonRoutes.sendResult(res, {
			code: 200,
			data: {
				'errors': '缺少参数'
			}
		});
	spaceUsers = WorkflowManager.getFormulaUserObjects(spaceId, userIds)

	JsonRoutes.sendResult res, {
		code: 200,
		data: {
			'spaceUsers': spaceUsers
		}
	}
)