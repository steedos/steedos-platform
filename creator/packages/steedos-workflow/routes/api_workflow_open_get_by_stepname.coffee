###
@api {post} /api/workflow/open/getbystepname 根据步骤名称获取申请单

@apiName getInstanceByStepName

@apiGroup Workflow

@apiPermission 工作区管理员

@apiParam {String} access_token User API Token

@apiHeader {String} X-Space-Id	工作区Id

@apiHeaderExample {json} Header-Example:
{
	"X-Space-Id": "wsw1re12TdeP223sC"
}

@apiParamExample {json} Request Payload:
{
    "flow": 流程Id,
    "stepname": 步骤名称
}

@apiSuccessExample {json} Success-Response:
{
	"status": "success",
	"data": [
		{
			instance
		},
		{
			instance
		}
	]
}
###
JsonRoutes.add 'post', '/api/workflow/open/getbystepname', (req, res, next) ->
	try

		if !Steedos.APIAuthenticationCheck(req, res)
			return ;

		current_user = req.userId

		space_id = req.headers['x-space-id']

		if not space_id
			throw new Meteor.Error('error', 'need header X_Space_Id')

		current_user_info = db.users.findOne(current_user)

		if not current_user_info
			throw new Meteor.Error('error', 'can not find user')

		# 校验space是否存在
		uuflowManager.getSpace(space_id)
		# 校验当前登录用户是否是space的管理员
		uuflowManager.isSpaceAdmin(space_id, current_user)

		hashData = req.body
		stepname = hashData["stepname"]
		flow = hashData["flow"]

		if not stepname
			throw new Meteor.Error('error', 'need stepname')

		if not flow
			throw new Meteor.Error('error', 'need flow')

		# 去掉{fields: {inbox_uers: 0, cc_users: 0, outbox_users: 0, traces: 0, attachments: 0}
		instances = db.instances.find({space: space_id, flow: flow, state:'pending', traces:{$elemMatch: {is_finished: false, name: stepname}}}, {fields: {inbox_uers: 0, cc_users: 0, outbox_users: 0, attachments: 0, traces: 0}}).fetch()

		instances.forEach (instance)->
			instance.attachments = cfs.instances.find({'metadata.instance': instance._id,'metadata.current': true, "metadata.is_private": {$ne: true}}, {fields: {copies: 0}}).fetch()

		JsonRoutes.sendResult res,
			code: 200
			data: { status: "success", data: instances}
	catch e
		console.error e.stack
		JsonRoutes.sendResult res,
			code: 200
			data: { errors: [{errorMessage: e.message}]}
