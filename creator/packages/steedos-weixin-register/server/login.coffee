request = Npm.require("request")

getWeiXinSession = (appId, secret, code, cb)->
	request.get {
		url: "https://api.weixin.qq.com/sns/jscode2session?appid=#{appId}&secret=#{secret}&js_code=#{code}&grant_type=authorization_code"
	}, (err, httpResponse, body)->
		cb err, httpResponse, body
		if err
			console.error('upload failed:', err)
			return
		if httpResponse.statusCode == 200
			return

getWeiXinSessionAsync = Meteor.wrapAsync(getWeiXinSession);

JsonRoutes.add 'post', '/api/creator/weixin/login', (req, res, next) ->

	userInfo = req.body

	appId = Meteor.settings.weixin.appId
	secret = Meteor.settings.weixin.appSecret
	code = userInfo.code

	resData = getWeiXinSessionAsync appId, secret, code

	console.log("resData", JSON.stringify(resData))
	console.log("body", resData.body)

	wxSession = JSON.parse(resData.body)

	sessionKey = wxSession.session_key

	openid = wxSession.openid

	iv = userInfo.iv

	encryptedData = userInfo.encryptedData

	console.log "appId", appId
	console.log "sessionKey", sessionKey
	console.log "iv", iv
	console.log "encryptedData", encryptedData

	pc = new Creator.WXBizDataCrypt(appId, sessionKey)

	data = pc.decryptData(encryptedData, iv)

	console.log("session", JSON.stringify(resData.body))

	console.log("data", JSON.stringify(data))


	JsonRoutes.sendResult res, {
		code: 200,
		data: {}
	}