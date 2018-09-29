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

checkLoveFriends = (owner, userB, appId, openGId, spaceId)->
	collection_friends = Creator.getCollection("love_friends")

	current_friend = collection_friends.findOne({
		owner: owner
		user_b: userB
		space: spaceId
		mini_app_id: appId
	}, {fields: {_id: 1, open_groups: 1}})
	if current_friend
		if openGId and (not current_friend.open_groups or not current_friend.open_groups.includes(openGId))
			collection_friends.update(current_friend._id, {
				$addToSet: { open_groups: openGId }
			})
	else
		values =
			owner: owner
			user_b: userB
			space: spaceId
			mini_app_id: appId
		if openGId
			values.open_group_id = openGId
			values.open_groups = [openGId]
		collection_friends.insert values

#TODO 处理unionid
JsonRoutes.add 'post', '/mini/vip/sso', (req, res, next) ->
	try
		code = req.query.code
		old_user_id = req.query.old_user_id
		old_auth_token = req.query.old_auth_token
		space_id = req.query.space_id
		share_id = req.query.share_id
		share_from = req.query.share_from
		iv = req.body.iv
		encryptedData = req.body.encryptedData

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

		user_fields = {name: 1, mobile: 1, sex:1, birthday:1, avatar:1, avatarUrl:1, qrcode: 1, profile: 1}
		user = Creator.getCollection("users").findOne({_id: ret_data.user_id}, {fields: user_fields})

		ret_data.name = user.name
		ret_data.mobile = user.mobile
		ret_data.sex = if user.sex then user.sex else user.profile?.sex
		ret_data.birthdate = if user.birthday then user.birthday else user.profile?.birthdate
		ret_data.avatar = if user.avatar then user.avatar else user.profile?.avatar
		ret_data.avatarUrl = user.avatarUrl
		ret_data.qrcode = user?.qrcode

		ret_data.love = Meteor.settings.love


		collection_customers = Creator.getCollection("vip_customers")
		collection_invites = Creator.getCollection("vip_invites")
		collection_friends = Creator.getCollection("love_friends")
		customers = collection_customers.find({
			owner: ret_data.user_id
		}).fetch()
		if space_id
			# 获取微信群openGId
			if iv && encryptedData && appId
				pc = new Creator.WXBizDataCrypt(appId, sessionKey)
				groupData = pc.decryptData(encryptedData, iv)
				openGId = groupData.openGId
				ret_data.open_group_id = openGId

			# 生成vip_customers记录
			current_customer = customers.find((customer) ->
				return customer.space == space_id
			)
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
					share_from_customer = collection_customers.findOne({
						space: space_id,
						owner: share_from
					}, {fields: {from: 1, froms: 1}})
					if share_from_customer
						share_from_from = share_from_customer.from
						share_from_froms = share_from_customer.froms
						if share_from_from
							if share_from_froms and share_from_froms.length
								share_from_froms.push share_from_from
							else
								share_from_froms = [share_from_from]
							values.froms = share_from_froms
				new_customer_id = collection_customers.insert values
				current_customer = collection_customers.findOne({
					_id: new_customer_id
				})
				customers.push current_customer

			# 生成vip_invites记录
			if share_from and share_from != ret_data.user_id
				# 自己不能邀请自己
				current_invite = collection_invites.findOne({
					owner: ret_data.user_id
					from: share_from
					space: space_id
					mini_app_id: appId
				}, {fields: {_id: 1}})
				unless current_invite
					values =
						name: user.name
						owner: ret_data.user_id
						from: share_from
						space: space_id
						mini_app_id: appId
					if openGId
						values.open_group_id = openGId
					new_invite_id = collection_invites.insert values

			# 生成love_friends记录
			if share_from and share_from != ret_data.user_id
				# 自己不能邀请自己
				checkLoveFriends(ret_data.user_id, share_from, appId, openGId, space_id)
				checkLoveFriends(share_from, ret_data.user_id, appId, openGId, space_id)

			if openGId and share_from and share_from != ret_data.user_id
				# 自己不能邀请自己
				# 生成微信群记录
				collection_groups = Creator.getCollection("vip_groups")
				current_group = collection_groups.findOne({ open_group_id: openGId, space: space_id })
				if current_group
					collection_groups.update(
						current_group._id,
						{
							$addToSet: {
								users: { $each: [ ret_data.user_id, share_from] }
							}
						}
					)
				else
					collection_groups.insert(
						{
							_id: collection_groups._makeNewID()
							users: [ ret_data.user_id, share_from]
							space: space_id
							open_group_id: openGId
							owner: ret_data.user_id
							mini_app_id: appId
						}
					)

				# 根据微信群记录，生成互相之前的friends记录
				current_group = collection_groups.findOne({
					open_group_id: openGId,
					space: space_id
				})
				if current_group and current_group.users and current_group.users.length
					current_group.users.forEach (member)->
						# 先排除掉自己及share_from，然后其他人与ret_data.user_id建立friend关系
						if member != ret_data.user_id and member != share_from
							try
								checkLoveFriends(ret_data.user_id, member, appId, openGId, space_id)
								checkLoveFriends(member, ret_data.user_id, appId, openGId, space_id)
							catch e
								console.error e.stack
								console.error "群转发出错了,openGId=#{openGId},member=#{member},user_id=#{ret_data.user_id}"

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


