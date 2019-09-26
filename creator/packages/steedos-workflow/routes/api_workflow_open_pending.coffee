###
@api {get} /api/workflow/open/pending 获取待办文件

@apiDescription 获取当前用户的待办事项列表

@apiName getInbox

@apiGroup Workflow

@apiParam {String} access_token User API Token

@apiHeader {String} X-Space-Id	工作区Id

@apiHeaderExample {json} Header-Example:
	{
		"X-Space-Id": "wsw1re12TdeP223sC"
	}

@apiSuccessExample {json} Success-Response:
	{
		"status": "success",
		"data": [
			{
				"id": "g7wokXNkR9yxHvA4D",
				"start_date": "2017-11-23T02:28:53.164Z",
				"flow_name": "正文流程",
				"space_name": "审批王",
				"name": "正文流程 1",
				"applicant_name": null,
				"applicant_organization_name": "审批王",
				"submit_date": "2017-07-25T06:36:48.492Z",
				"step_name": "开始",
				"space_id": "kfDsMv7gBewmGXGEL",
				"modified": "2017-11-23T02:28:53.164Z",
				"is_read": false,
				"values": {}
			},
			{
				"id": "WqKSrWQoywgJaMp9k",
				"start_date": "2017-08-17T07:38:35.420Z",
				"flow_name": "正文\n",
				"space_name": "审批王",
				"name": "正文\n 1",
				"applicant_name": "殷亮辉",
				"applicant_organization_name": "审批王",
				"submit_date": "2017-06-27T10:26:19.468Z",
				"step_name": "开始",
				"space_id": "kfDsMv7gBewmGXGEL",
				"modified": "2017-08-17T07:38:35.421Z",
				"is_read": true,
				"values": {}
			}
		]
	}
###
JsonRoutes.add 'get', '/api/workflow/open/pending', (req, res, next) ->
	try

		if !Steedos.APIAuthenticationCheck(req, res)
			return

		space_id = req.headers['x-space-id'] || req.query?.spaceId

		if not space_id
			throw new Meteor.Error('error', 'need space_id')

		user_id = req.userId

		if !user_id
			throw new Meteor.Error('error', 'Not logged in')

		if db.users.find({ _id: user_id }).count() is 0
			throw new Meteor.Error('error', 'can not find user')

		limit = req.query?.limit || 500

		limit = parseInt(limit)

		username = req.query?.username

		userid = req.query?.userid

		attach = req.query?.attach

		workflow_categories = req.query?.workflow_categories

		# 校验space是否存在
		space = uuflowManager.getSpace(space_id)

		# 如果当前用户是工作区管理员，则通过查看url上是否有username\userid ，
		# 如果有，则返回username\userid对应的用户，否则返回当前用户待办。
		# username\userid都存在时，userid优先
		special_user_id
		if space.admins.includes(user_id)
			if userid
				if db.users.find({ _id: userid }).count() < 1
					throw new Meteor.Error('error', "can not find user by userid: #{userid}")

				special_user_id = userid
			else if username
				u = db.users.findOne({ username: username }, { fields: { _id: 1 } })
				if _.isEmpty(u)
					throw new Meteor.Error('error', "can not find user by username: #{username}")

				special_user_id = u._id

		result_instances = new Array

		is_read = false
		start_date = ''
		uid = user_id
		query = {
			$or: [{ inbox_users: user_id }, { cc_users: user_id }]
		}

		if special_user_id
			uid = special_user_id
			query = {
				space: space_id,
				$or: [{ inbox_users: special_user_id }, { cc_users: special_user_id }]
			}

		if workflow_categories
			query.category = { $in: workflow_categories.split(',') }

		space_names = {}
		space_names[space._id] = space.name

		if limit > 0
			db.instances.find(query, { sort: { modified: -1 }, limit: limit }).forEach (i) ->

				if i.inbox_users?.includes(uid)
					_.each i.traces, (t) ->
						if t.is_finished is false
							_.each t.approves, (a) ->
								if a.user is uid and a.type isnt 'cc' and not a.is_finished
									is_read = a.is_read
									start_date = a.start_date
				else
					_.each i.traces, (t) ->
						if not start_date and t.approves
							_.each t.approves, (a) ->
								if not start_date and a.user is uid and a.type is 'cc' and not a.is_finished
									is_read = a.is_read
									start_date = a.start_date

				if not space_names[i.space]
					space_names[i.space] = db.spaces.findOne(i.space, { fields: { name: 1 } })?.name

				h = new Object
				h["id"] = i["_id"]
				h["start_date"] = start_date
				h["flow_name"] = i.flow_name
				h["space_name"] = space_names[i.space]
				h["name"] = i["name"]
				h["applicant_name"] = i["applicant_name"]
				h["applicant_organization_name"] = i["applicant_organization_name"]
				h["submit_date"] = i["submit_date"]
				h["step_name"] = i.current_step_name
				h["space_id"] = i.space
				h["modified"] = i["modified"]
				h["is_read"] = is_read
				h["values"] = i["values"]

				if attach is 'true'
					h.attachments = cfs.instances.find({ 'metadata.instance': i._id, 'metadata.current': true, "metadata.is_private": { $ne: true } }, { fields: { copies: 0 } }).fetch()

				result_instances.push(h)

		no_limit_count = db.instances.find(query).count()

		JsonRoutes.sendResult res, {
			code: 200
			data: { status: "success", data: result_instances, count: no_limit_count }
		}
	catch e
		console.error e.stack
		JsonRoutes.sendResult res, {
			code: 200
			data: { errors: [{ errorMessage: e.reason }] }
		}

