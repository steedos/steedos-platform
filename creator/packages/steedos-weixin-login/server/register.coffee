JsonRoutes.add 'post', '/api/creator/weixin/register', (req, res, next) ->
	console.log("req.body", req.body)

	userInfo = req.body

	iv = userInfo.iv
	encryptedData = userInfo.encryptedData

	pc = new Creator.WXBizDataCrypt(Meteor.settings.weixin.appId, sessionKey)

	JsonRoutes.sendResult res, {
		code: 200,
		data: {}
	}