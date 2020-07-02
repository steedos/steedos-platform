Cookies = require("cookies")

getInstanceReadOnly = (req, res, next, options) ->

	user = Steedos.getAPILoginUser(req, res)

	if req?.query?.access_token
		userId = Steedos.getUserIdFromAccessToken(req.query.access_token)
		if userId
			user = Meteor.users.findOne({_id: userId})

	spaceId = req.params.space

	instanceId = req.params.instance_id

	instance = db.instances.findOne({_id: instanceId});

	space = db.spaces.findOne({_id: spaceId});

	hide_traces = req.query?.hide_traces

	if !options
		options = {showTrace: true}
	else
		options.showTrace = true

	if hide_traces is "1"
		if options
			options.showTrace = false
		else
			options = {showTrace: false}

	if !options.showAttachments
		options.showAttachments = true

	if !space
		JsonRoutes.sendResult res,
			code: 401,
			data:
				"error": "Validate Request -- Missing space",
				"success": false
		return;

	if  !instance
		JsonRoutes.sendResult res,
			code: 401,
			data:
				"error": "Validate Request -- Missing instance",
				"success": false
		return;

	if !user
		JsonRoutes.sendResult res,
			code: 401,
			data:
				"error": "Validate Request -- Missing X-Auth-Token,X-User-Id",
				"success": false
		return;

	if instance.space != spaceId
		JsonRoutes.sendResult res,
			code: 401,
			data:
				"error": "Validate Request -- Missing space or instance",
				"success": false
		return;



	spaceUserCount = db.space_users.find({ user: user._id, space: spaceId }).count()

	if spaceUserCount is 0
		if !space
			JsonRoutes.sendResult res,
				code: 401,
				data:
					"error": "Validate Request -- Missing sapceUser",
					"success": false
			return;

	#校验user是否对instance有查看权限
	_hasPermission = WorkflowManager.hasInstancePermissions(user, instance)

	if !_hasPermission  && instance.distribute_from_instance
		_parent_instances = _.union([instance.distribute_from_instance], instance.distribute_from_instances || [])

		_hasPermission = _.find _parent_instances, (_parent_id)->
			_parent_ins = db.instances.findOne({_id:_parent_id}, {fields: {traces: 0}})

			return WorkflowManager.hasInstancePermissions(user, _parent_ins)

	if !_hasPermission
		_locale = Steedos.locale(user._id, true)
		error = TAPi18n.__("instance_permissions_error", {}, _locale)
		res.charset = "utf-8"
		JsonRoutes.sendResult res,
			code: 401,
			data:
				"error": error,
				"success": false
		return;

	html = InstanceReadOnlyTemplate.getInstanceHtml(user, space, instance, options)
	dataBuf = new Buffer(html);
	res.setHeader('content-length', dataBuf.length)
	res.setHeader('content-range', "bytes 0-#{dataBuf.length - 1}/#{dataBuf.length}")
	res.statusCode = 200
	res.end(html)

JsonRoutes.add "get", "/workflow/space/:space/view/readonly/:instance_id", getInstanceReadOnly

JsonRoutes.add "get", "/workflow/space/:space/view/readonly/:instance_id/:instance_name", (req, res, next)->
	res.setHeader('Content-type', 'application/x-msdownload');
	res.setHeader('Content-Disposition', 'attachment;filename='+encodeURI(req.params.instance_name));
	res.setHeader('Transfer-Encoding', '')

	options = {absolute: true}

	return getInstanceReadOnly(req, res, next, options)
###
	获取申请单列表：
    final_decision：审批结果
    state: 申请单状态
###
JsonRoutes.add "get", "/api/workflow/instances", (req, res, next) ->

	if !Steedos.APIAuthenticationCheck(req, res)
		return ;

	user_id = req.userId

	spaceId = req.headers["x-space-id"]

	if not spaceId
		JsonRoutes.sendResult res,
			code: 401,
			data:
				"error": "Validate Request -- Missing X-Space-Id",
				"success": false
		return;

	flowId = req.query?.flowId

	if !flowId
		JsonRoutes.sendResult res,
			code: 400,
			data:
				"error": "Validate Request -- Missing flowId",
				"success": false
		return;

	query = {}

	ret_sync_token = new Date().getTime()

	flowIds = flowId.split(",")


	flows = db.flows.find({_id: {$in: flowIds}}).fetch()

	i = 0
	while i < flows.length
		f = flows[i]
		spaceUser = db.space_users.findOne({space: f.space, user: user_id})
		if !spaceUser
			JsonRoutes.sendResult res,
				code: 401,
				data:
					"error": "Validate Request -- No permission, flow is #{f._id}",
					"success": false
			return;
		else

	#	是否工作区管理员
		if !Steedos.isSpaceAdmin(spaceId, user_id)
			spaceUserOrganizations = db.organizations.find({
				_id: {
					$in: spaceUser.organizations
				}
			}).fetch();

			if !WorkflowManager.canMonitor(f, spaceUser, spaceUserOrganizations) && !WorkflowManager.canAdmin(f, spaceUser, spaceUserOrganizations)
				JsonRoutes.sendResult res,
					code: 401,
					data:
						"error": "Validate Request -- No permission, flow is #{f._id}",
						"success": false
				return;
		i++


	query.flow = {$in: flowIds}

	query.space = spaceId

	if req.query?.sync_token
		sync_token = new Date(Number(req.query.sync_token))
		query.modified = {$gt: sync_token}

	if req.query?.final_decision
		query.final_decision = {$in : req.query.final_decision.split(",")}
	else
		query.final_decision = {$nin: ["terminated", "rejected"]}

	if req.query?.state
		query.state = {$in: req.query.state.split(",")}
	else
		query.state = "completed"

#	最多返回500条数据
	instances = db.instances.find(query, {fields: {inbox_uers: 0, cc_users: 0, outbox_users: 0, traces: 0, attachments: 0}, skip: 0, limit: 500}).fetch()
	instances.forEach (instance)->

		attachments = cfs.instances.find({'metadata.instance': instance._id,'metadata.current': true, "metadata.is_private": {$ne: true}}, {fields: {copies: 0}}).fetch()

		instance.attachments = attachments


	JsonRoutes.sendResult res,
			code: 200,
			data:
				"status": "success",
				"sync_token": ret_sync_token
				"data": instances
	return;
