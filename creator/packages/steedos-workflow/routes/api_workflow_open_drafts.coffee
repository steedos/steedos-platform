###
@api {post} /api/workflow/open/drafts 新建申请单

@apiName createInstance

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
    "applicant": 申请人Id,
    "values": {
        "fields1" : 字段值,
        "fields2" : 字段值,
        ...
    }
}

@apiSuccessExample {json} Success-Response:
{
    "status": "success",
    "data": {instance}
}

@apiErrorExample {json} error-Response:
{
    "status": "error",
    "data": {...}
}
###
JsonRoutes.add 'post', '/api/workflow/open/drafts', (req, res, next) ->
	try

		if !Steedos.APIAuthenticationCheck(req, res)
			return

		user_id = req.userId

		current_user_info = db.users.findOne({ _id: user_id })

		space_id = req.headers['x-space-id']

		if not space_id
			throw new Meteor.Error('error', 'need header x_space_id')

		# 校验space是否存在
		uuflowManager.getSpace(space_id)
		# 校验当前登录用户是否是space的管理员
		uuflowManager.isSpaceAdmin(space_id, current_user_info._id)

		hashData = req.body

		if not hashData["flow"]
			throw new Meteor.Error('error', 'flow is null')

		flow_id      = hashData["flow"]
		applicant_id = hashData["applicant"]
		applicant_username = hashData["applicant_username"]

		instance_from_client = new Object

		flow = db.flows.findOne({ _id: flow_id }, { fields: { space: 1, 'current._id': 1 } })
		if not flow
			throw new Meteor.Error('error', 'flow is not exists')

		if space_id isnt flow.space
			throw new Meteor.Error('error', 'flow is not belong to this space')

		if db.space_users.find({ space: space_id, user: current_user_info._id }).count() is 0
			throw new Meteor.Error('error', 'auth_token is not a member of this space')

		instance_from_client["space"] = space_id
		instance_from_client["flow"] = flow_id
		instance_from_client["flow_version"] = flow.current._id

		applicant = null
		if applicant_id or applicant_username

			if applicant_id
				applicant = db.users.findOne({ _id: applicant_id }, { fields: { name: 1 } })
				if not applicant
					throw new Meteor.Error('error', 'applicant is wrong')

			else if applicant_username
				applicant = db.users.findOne({ username: applicant_username }, { fields: { name: 1 } })
				if not applicant
					throw new Meteor.Error('error', 'applicant_username is wrong')

			space_user = db.space_users.findOne({ space: space_id, user: applicant._id })
			if not space_user
				throw new Meteor.Error('error', 'applicant is not a member of this space')

			if space_user.user_accepted isnt true
				throw new Meteor.Error('error', 'applicant is disabled in this space')

			space_user_org_info = uuflowManager.getSpaceUserOrgInfo(space_user)
			instance_from_client["applicant"] = applicant._id
			instance_from_client["applicant_name"] = applicant.name
			instance_from_client["applicant_organization"] =  space_user_org_info["organization"]
			instance_from_client["applicant_organization_fullname"] = space_user_org_info["organization_fullname"]
			instance_from_client["applicant_organization_name"] = space_user_org_info["organization_name"]

		applicantInfo = applicant || current_user_info

		traces = []
		trace = new Object
		approves = []
		approve = new Object
		approve["values"] = hashData["values"]
		approves.push(approve)
		trace["approves"] = approves
		traces.push(trace)
		instance_from_client["traces"] = traces

		instance_from_client["inbox_users"] = [applicantInfo._id]

		new_ins_id = uuflowManager.create_instance(instance_from_client, applicantInfo)

		new_ins = db.instances.findOne(new_ins_id)

		JsonRoutes.sendResult res, {
			code: 200
			data: { status: "success", data: new_ins }
		}
	catch e
		console.error e.stack
		JsonRoutes.sendResult res, {
			code: 200
			data: { errors: [{ errorMessage: e.message }] }
		}
