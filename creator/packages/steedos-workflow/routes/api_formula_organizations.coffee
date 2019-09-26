JsonRoutes.add("post", "/api/formula/orgs", (req, res, next) ->
	current_user_info = uuflowManager.check_authorization(req)
	current_user = current_user_info._id
	orgIds = req.body.orgIds
	spaceId = req.body.spaceId

	space_user = db.space_users.findOne({user: current_user, space: spaceId}, {fields: {_id: 1}})
	if !space_user
		return JsonRoutes.sendResult(res, {
			code: 200,
			data: {
				'errors': '无权限'
			}
		});

	if (!orgIds || !spaceId)
		return JsonRoutes.sendResult(res, {
			code: 200,
			data: {
				'errors': '缺少参数'
			}
		});

	orgs = WorkflowManager.getFormulaOrgObjects(orgIds)

	JsonRoutes.sendResult(res, {
		code: 200,
		data: {
			'orgs': orgs
		}
	});
)