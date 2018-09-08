

JsonRoutes.add 'post', '/api/account/binding', (req, res, next) ->

	hashData = req.body

	userId = Steedos.getUserIdFromAuthToken(req, res);

	appId = req.headers["appid"]

	console.log('hashData', hashData, userId, appId)

	login_user = Creator.getCollection("users").findOne({_id: userId}, {fields: {_id: 1, services: 1, mobile: 1}})

	user = Meteor.users.findOne({username: hashData.username})

	if !user
		JsonRoutes.sendResult res, {
			code: 401,
			data: {error: '用户名或密码错误'}
		}
		return ;

	result = Accounts._checkPassword user, hashData.password

	if !result.error
		if login_user._id != user._id
			openids = login_user.services?.weixin?.openid
			if openids
				openid = _.find(openids, (t)->
					return t.appid is appId
				)
				Creator.getCollection("users").update(_id: user._id, {$push: {'services.weixin.openid': openid}})


		JsonRoutes.sendResult res, {
			code: 200
		}
		return

	JsonRoutes.sendResult res, {
		code: 401,
		data: {error: '用户名或密码错误'}
	}
	return