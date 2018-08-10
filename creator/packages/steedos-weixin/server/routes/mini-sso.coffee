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

setNewToken = (userId, appId, openid)->
	authToken = Accounts._generateStampedLoginToken()
	token = authToken.token
	hashedToken = Accounts._hashStampedToken authToken
	hashedToken.app_id = appId
	hashedToken.open_id = openid
	hashedToken.token = token
	Accounts._insertHashedLoginToken userId, hashedToken
	return token

#TODO 处理unionid
JsonRoutes.add 'post', '/mini/vip/sso', (req, res, next) ->
	try
		code = req.query.code
		old_user_id = req.query.old_user_id
		old_auth_token = req.query.old_auth_token
		space_id = req.query.space_id
		share_id = req.query.share_id
		share_from = req.query.share_from

		appId = req.headers["appid"]

		secret = Meteor.settings.weixin.appSecret[appId]
		if !secret
			throw new Meteor.Error(500, "无效的appId #{appId}")

		if !code
			throw new Meteor.Error(401, "miss code")

		resData = getWeiXinSessionAsync appId, secret, code

		wxSession = JSON.parse(resData.body)

		sessionKey = wxSession.session_key

		console.log("sessionKey", sessionKey)

		openid = wxSession.openid

		#	unionid = wxSession.unionid

		if !openid
			throw new Meteor.Error(401, "miss openid")

		ret_data = {}

		user_openid = Creator.getCollection("users").findOne({
			"services.weixin.openid.appid": appId,
			"services.weixin.openid._id": openid
		}, {fields: {_id: 1}})

		if !user_openid
			unionid = ""
			locale = "zh-cn"
			phoneNumber = ""
			userId = WXMini.newUser(appId, openid, unionid, "", locale, phoneNumber)

			authToken = setNewToken(userId, appId, openid)

			ret_data = {
				open_id: openid
				user_id: userId
				auth_token: authToken
			}
		else
			if user_openid._id == old_user_id
				if Steedos.checkAuthToken(old_user_id, old_auth_token)
					ret_data = {
						open_id: openid
						user_id: old_user_id
						auth_token: old_auth_token
					}
				else
					authToken = setNewToken(old_user_id, appId, openid)
					ret_data = {
						open_id: openid
						user_id: old_user_id
						auth_token: authToken
					}
			else
				authToken = setNewToken(user_openid._id, appId, openid)
				ret_data = {
					open_id: openid
					user_id: user_openid._id
					auth_token: authToken
				}

		space_users = Creator.getCollection("space_users").find({
			user: ret_data.user_id
		}, {fields: {space: 1, profile: 1}}).fetch()

		if space_users.length
			spaces = Creator.getCollection("spaces").find({
				_id:{$in:_.pluck(space_users,"space")}
			}, {fields: {name: 1,admins: 1, owner: 1}}).fetch()
			space_users = space_users.map((su)->
				s = _.findWhere(spaces, {_id: su.space})
				s = _.extend(su, s)
				isSpaceAdmin = s.admins?.indexOf(ret_data.user_id) > -1
				if isSpaceAdmin
					s.profile = 'admin'
				delete s.admins
				delete s.space
				return s
			)
		
		ret_data.my_spaces = space_users

		#设置sessionKey
		Creator.getCollection("users").direct.update({
			_id: ret_data.user_id,
			"services.weixin.openid.appid": appId,
			"services.weixin.openid._id": openid
		}, {$set: {"services.weixin.openid.$.session_key": sessionKey}})

		user = Creator.getCollection("users").findOne({_id: ret_data.user_id}, {fields: {name: 1, profile: 1, mobile: 1}})

		ret_data.name = user.name
		ret_data.mobile = user.mobile
		ret_data.sex = user.profile?.sex
		ret_data.birthdate = user.profile?.birthdate
		ret_data.avatar = user.profile?.avatar

		ret_data.love = Meteor.settings.love


		collection_customers = Creator.getCollection("vip_customers")
		collection_invites = Creator.getCollection("vip_invites")
		collection_friends = Creator.getCollection("love_friends")
		customers = collection_customers.find({
			owner: ret_data.user_id
		}).fetch()
		if space_id
			# 生成vip_customers记录
			current_customer = customers.find((customer) ->
				return customer.space == space_id
			)
			console.log "current_customer=============", current_customer
			unless current_customer
				values =
					name: user.name,
					space: space_id,
					mobile: user.mobile
					owner : ret_data.user_id,
					created_by : ret_data.user_id,
					modified_by : ret_data.user_id
				
				if(share_id)
					values.share = share_id;
				if(share_from)
					values.from = share_from;
				new_customer_id = collection_customers.insert values
				current_customer = collection_customers.findOne({
					_id: new_customer_id
				})
				console.log "current_customer========new=====", current_customer
				customers.push current_customer
			
			# 生成vip_invites记录
			if share_from and share_from != ret_data.user_id
				# 自己不能邀请自己
				current_invite = collection_invites.findOne({
					owner: ret_data.user_id
					from: share_from
					space: space_id
				})
				unless current_invite
					values =
						name: user.name
						owner: ret_data.user_id
						from: share_from
						space: space_id
					new_invite_id = collection_invites.insert values
					console.log "current_invite========new=====", new_invite_id
			
			# 生成love_friends记录
			if share_from and share_from != ret_data.user_id
				# 自己不能邀请自己
				current_friend = collection_friends.findOne({
					owner: ret_data.user_id
					user_b: share_from
					space: space_id
				})
				unless current_friend
					values =
						owner: ret_data.user_id
						user_b: share_from
						space: space_id
					new_friend_id = collection_friends.insert values
					console.log "current_friend========new=====", new_friend_id
				current_friend = collection_friends.findOne({
					owner: share_from
					user_b: ret_data.user_id
					space: space_id
				})
				unless current_friend
					values =
						owner: share_from
						user_b: ret_data.user_id
						space: space_id
					new_friend_id = collection_friends.insert values
					console.log "current_friend========new=====", new_friend_id
		
		ret_data.my_customers = customers
		JsonRoutes.sendResult res, {
			code: 200,
			data: ret_data
		}
		return

	catch e
		console.error e.stack
		JsonRoutes.sendResult res, {
			code: e.error
			data: {errors: e.reason || e.message}
		}


