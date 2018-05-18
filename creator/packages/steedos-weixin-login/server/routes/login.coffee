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

###
   微信小程序登录接口
   参数为：object
    object = wx.getUserInfo()
    object.code = wx.login().code
   如果url上有spaceId 参数，在spaceId有效且当前用户没有加入此工作区时，将用户添加到工作区
###
JsonRoutes.add 'post', '/api/creator/weixin/login', (req, res, next) ->
	try
		reqBody = req.body

		userInfo = reqBody.userInfo
		console.log("req.headers", JSON.stringify(req.headers))
		appId = req.headers["appid"]
		console.log("appId", appId)
		secret = Meteor.settings.weixin.appSecret[appId]
		if !secret
			throw new Meteor.Error(500, "无效的appId #{appId}")
		code = reqBody.code
		spaceId = req.query.spaceId || reqBody.spaceId
		phoneNumber = reqBody.phoneNumber

		if !code
			throw new Meteor.Error(401, "miss code")

		resData = getWeiXinSessionAsync appId, secret, code

		console.log("resData", JSON.stringify(resData))

		wxSession = JSON.parse(resData.body)

		sessionKey = wxSession.session_key

		openid = wxSession.openid

		unionid = wxSession.unionid

		if !unionid
			iv = reqBody.iv
			encryptedData = reqBody.encryptedData

			pc = new Creator.WXBizDataCrypt(appId, sessionKey)

			data = pc.decryptData(encryptedData, iv)

			unionid = data.unionId

		console.log(appId, openid, unionid)

		if unionid
			user_unionid = Creator.getCollection("users").findOne({"services.weixin.unionid": unionid}, {fields: {_id: 1}})
			userId = user_openid._id
			console.log("unionid find...")

		if openid
			user_openid = Creator.getCollection("users").findOne({
				"services.weixin.openid.appid": appId,
				"services.weixin.openid._id": openid
			}, {fields: {_id: 1}})
			userId = user_openid._id
			console.log("openid find...")

		if userInfo.language == "zh_CN" || userInfo.language == "zh_TW"
			  locale = "zh-cn"
		  else
			  locale = "en-us"

		# 未找到user，则新建
		if !user_unionid && !user_openid
			userId = WXMini.newUser(appId, openid, unionid, userInfo.nickName, locale, phoneNumber)
			# 加入工作区
			if spaceId
				WXMini.addUserToSpace(userId, spaceId, userInfo.nickName)
			else
				spaceId = WXMini.newSpace(userId, userInfo.nickName)
				orgId = WXMini.newOrganization(userId, spaceId, userInfo.nickName)
				space_user = WXMini.newSpaceUser(userId, spaceId, orgId, userInfo.nickName)

		# 华炎小程序已经满足unionid的返回条件，但unionid还没有与用户绑定，将unionid绑定到user对象
		if unionid && !user_unionid && user_openid
			Creator.getCollection("users").direct.update({_id: userId}, {$set: {"services.weixin.unionid": unionid}})

		# 使用过华炎的其他小程序，当前小程序未使用过，将openid 信息绑定到user对象
		if user_unionid && !user_openid
			Creator.getCollection("users").direct.update({_id: userId}, {
				$push: {
					"services.weixin.openid": {_id: openid, appid: appId}
				}
			})

		user = Creator.getCollection("users").findOne({_id: userId}, {fields: {services: 1}})

		if spaceId
			user_space = Creator.getCollection("space_users").findOne({user: userId, space: spaceId}, {fields: {space: 1}})
			# 加入工作区
			if !user_space
				WXMini.addUserToSpace(userId, spaceId, userInfo.nickName)

		if user
			loginTokens = user.services?.resume?.loginTokens
			console.log("find token", JSON.stringify(loginTokens))
			if loginTokens
				open_token = _.find(loginTokens, (t)->
					return t.app_id is appId and t.open_id is openid
				)
				if open_token
					token = open_token.token
		  else
			  throw new Meteor.Error(401, "无效的用户#{userId}")

		if !token
			authToken = Accounts._generateStampedLoginToken()
			token = authToken.token
			console.log("new token", token)
			hashedToken = Accounts._hashStampedToken authToken
			hashedToken.app_id = appId
			hashedToken.open_id = openid
			hashedToken.token = token
			Accounts._insertHashedLoginToken userId, hashedToken

		JsonRoutes.sendResult res, {
			code: 200,
			data: {
				userId: userId
				authToken: token
				spaceId: spaceId
			}
		}
	catch e
		console.error e.stack
		JsonRoutes.sendResult res, {
			code: e.error
			data: { errors: e.reason || e.message }
		}