JsonRoutes.add 'post', '/api/mini/vip/like/sms', (req, res, next) ->
	try
		userId = Steedos.getUserIdFromAuthToken(req, res);

		if !userId
			throw new Meteor.Error(500, "No permission")

		body = req.body

		spaceId = req.query.space_id || body.space_id

		if !spaceId
			throw new Meteor.Error(500, "No spaceId")

		toUserId = req.query.user_id || body.user_id

		if !toUserId
			throw new Meteor.Error(500, "No user_id")

		toCustomer = Creator.getCollection('vip_customers').findOne({ space: spaceId, owner: toUserId }, { fields: { mobile: 1 } })

		fromCustomer = Creator.getCollection('vip_customers').findOne({ space: spaceId, owner: userId }, { fields: { name: 1 } })

		if toCustomer.mobile
			# 发送手机短信
			SMSQueue.send({
				RecNum: toCustomer.mobile,
				msg: "系统通知：刚刚 #{fromCustomer.name} 表示喜欢你。"
			})

		JsonRoutes.sendResult res, {
			code: 200,
			data: 'ok'
		}
		return
	catch e
		console.error e.stack
		JsonRoutes.sendResult res, {
			code: e.error
			data: { errors: e.reason || e.message }
		}
