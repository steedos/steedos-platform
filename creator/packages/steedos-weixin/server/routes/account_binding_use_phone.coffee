
JsonRoutes.add 'post', '/api/account/binding_use_phone', (req, res, next) ->
	try
		iv = req.body.iv
		encryptedData = req.body.encryptedData
		appId = req.headers["appid"]

		userId = Steedos.getUserIdFromAuthToken(req, res);

		user = Creator.getCollection("users").findOne({_id: userId}, {fields: {services: 1}})

		if user
			openids = user.services?.weixin?.openid
			console.log("find token", JSON.stringify(openids))
			if openids
				open_token = _.find(openids, (t)->
					return t.appid is appId
				)
				if open_token
					sessionKey = open_token.session_key
			else
				throw new Meteor.Error(401, "无效的用户#{userId}")


		if iv && encryptedData && appId
			console.log "sessionKey", sessionKey
			pc = new Creator.WXBizDataCrypt(appId, sessionKey)
			data = pc.decryptData(encryptedData, iv)

			#根据手机号查找用户
			phone_user = Creator.getCollection("users").findOne({'phone.number': "+86" + data.purePhoneNumber})

			if phone_user
				if phone_user._id != user._id
					openids = user.services?.weixin?.openid
					if openids
						openid = _.find(openids, (t)->
							return t.appid is appId
						)
						Creator.getCollection("users").update(_id: phone_user._id, {$push: {'services.weixin.openid': openid}})
						Creator.getCollection("users").update({_id: user._id}, {$pull: {"services.weixin.openid": {_id: openid._id, appid: openid.appid}}})
			else
				WXMini.updateUser(user._id, {
					$set: {mobile: data.purePhoneNumber}
				})

			JsonRoutes.sendResult res, {
				code: 200
			}
		else
			throw new Meteor.Error(500, "缺少参数iv、encryptedData、appId")
	catch e
		console.error e.stack
		JsonRoutes.sendResult res, {
			code: e.error
			data: {errors: e.reason || e.message}
		}