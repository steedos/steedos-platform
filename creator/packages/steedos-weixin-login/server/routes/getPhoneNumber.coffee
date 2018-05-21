
JsonRoutes.add 'post', '/api/steedos/weixin/get_phone_number', (req, res, next) ->
	try
		iv = req.body.iv
		encryptedData = req.body.encryptedData
		appId = req.headers["appid"]

		userId = Steedos.getUserIdFromAuthToken(req, res);

		user = Creator.getCollection("users").findOne({_id: userId}, {fields: {services: 1}})

		if user
			loginTokens = user.services?.resume?.loginTokens
			console.log("find token", JSON.stringify(loginTokens))
			if loginTokens
				open_token = _.find(loginTokens, (t)->
					return t.app_id is appId
				)
				if open_token
					sessionKey = open_token.session_key
			else
				throw new Meteor.Error(401, "无效的用户#{userId}")


		if iv && encryptedData && appId
			pc = new Creator.WXBizDataCrypt(appId, sessionKey)
			data = pc.decryptData(encryptedData, iv)
			console.log("data", data)
			JsonRoutes.sendResult res, {
				code: 200,
				data: {
					countryCode: data.countryCode
					purePhoneNumber: data.purePhoneNumber
				}
			}
		else
			throw new Meteor.Error(500, "缺少参数iv、encryptedData、appId")
	catch e
		console.error e.stack
		JsonRoutes.sendResult res, {
			code: e.error
			data: {errors: e.reason || e.message}
		}