
JsonRoutes.add 'post', '/api/steedos/weixin/invite_user', (req, res, next) ->

	try
		userId = Steedos.getUserIdFromAuthToken(req, res);

		if !userId
			throw new Meteor.Error(500, "No permission")

		data = req.body

		introducer = data.introducer

		space_id = data.space_id

		store_id = data.store_id

		token = data.token

		console.log('data', JSON.stringify(data))


		if Steedos.isSpaceAdmin(space_id, userId)
			JsonRoutes.sendResult res, {
				code: 200,
				data: {}
			}
			return

		#校验链接有效期
		timestamps = WXMini.decipherToken(token, introducer, Meteor.settings.weixin.invite.iv)

		now = parseInt(new Date().getTime()/1000);

		validity_period = Meteor.settings.weixin.invite.iv || 60 * 60 * 24

		if timestamps <= (now - validity_period)
			throw new Meteor.Error(500, "邀请已失效")

		#权限校验：校验邀请者是否为工作区拥有者
		space = Creator.getCollection("spaces").findOne({_id: space_id}, {fields: {_id: 1, owner: 1, name: 1}})

		if !space
			throw new Meteor.Error(500, "无效的商户id：#{space_id}")

		if space.owner != introducer
			throw new Meteor.Error(500, "邀请者不是商户拥有者")

		if store_id

			store = Creator.getCollection("vip_store").findOne({_id: store_id}, {fields: {_id: 1, owner: 1, space: 1}})

			if !store
				throw new Meteor.Error(500, "无效的门店id：#{space_id}")

			if space._id != store.space
				throw new Meteor.Error(500, "参数不匹配")

		#校验当前用户是否属于space：不属于，则创建space users
		space_user = Creator.getCollection("space_users").findOne({user: userId, space: space_id}, {fields: {_id: 1, profile: 1, owner: 1}})

		if !space_user
			user = Creator.getCollection("users").findOne({_id: userId})
			WXMini.addUserToSpace(userId, space_id, user.name, "user")
		else
			if space_user.profile != 'admin' && space_user.profile != 'user'
				Creator.getCollection("space_users").direct.update({_id: space_user._id}, {$set: {profile: 'user'}})

		#接口返回：当前用户在工作区的属性
		JsonRoutes.sendResult res, {
			code: 200,
			data: {
				_id: space_id,
				name: space.name,
				profile: 'user'
				owner: space.owner
			}
		}
		return
	catch e
		console.error e.stack
		JsonRoutes.sendResult res, {
			code: e.error
			data: {errors: e.reason || e.message}
		}