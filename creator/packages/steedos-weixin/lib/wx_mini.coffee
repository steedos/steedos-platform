request = Npm.require("request")
crypto = Npm.require('crypto')

@WXMini = {}

WXMini.newUser = (appId, openid, unionid, name, locale, phoneNumber)->
	now = new Date
	user_id = Creator.getCollection("users")._makeNewID()
	user = {
		_id: user_id
		steedos_id: phoneNumber || user_id
		locale: locale
		is_deleted: false
		created: now
		modified: now
	}
	if name
		user.name = name
	user.services = {weixin: {openid: []}}
	if openid
		user.services.weixin.openid.push {_id: openid, appid: appId}

	if unionid
		user.services.weixin.unionid = unionid
	userId = Creator.getCollection("users").direct.insert(user)
	return userId

WXMini.newSpace = (userId, spaceName)->
	now = new Date
	space_id = Creator.getCollection("spaces")._makeNewID()
	space = {
		_id: space_id
		space: space_id
		name: spaceName
		owner: userId
		admins: [userId]
		is_deleted: false
		created: now
		created_by: userId
		modified: now
		modified_by: userId
	}
	Creator.getCollection("spaces").direct.insert(space)
	return space_id

WXMini.newOrganization = (userId, spaceId, orgName)->
	now = new Date
	org = {
		space: spaceId
		name: orgName
		fullname: orgName
		users: [userId]
		created: now
		created_by: userId
		modified: now
		modified_by: userId
	}
	orgId = Creator.getCollection("organizations").direct.insert(org)
	return orgId

WXMini.newSpaceUser = (userId, spaceId, orgId, userName, profile, mobile)->
	now = new Date
	spaceUser = {
		user: userId
		space: spaceId
		profile: profile
		mobile: mobile
		organization: orgId
		organizations: [orgId]
		user_accepted: true
		name: userName
		created: now
		created_by: userId
		modified: now
		modified_by: userId
	}
	spaceUserId = Creator.getCollection("space_users").direct.insert(spaceUser)
	return spaceUserId

WXMini.addUserToSpace = (userId, spaceId, userName, profile)->
	console.log("addUserToSpace", userId, spaceId, userName)
	space = Creator.getCollection("spaces").findOne({_id: spaceId})
	if space
		#将用户添加到space的根部门下
		root_org = Creator.getCollection("organizations").findOne({space: space._id, parent: null}, {fields: {_id: 1}})
		if root_org
			Creator.getCollection("organizations").direct.update({_id: root_org._id}, {$push: {users: userId}})
			# 新增一条space_user
			WXMini.newSpaceUser(userId, spaceId, root_org._id, userName, profile)
		else
			throw new Meteor.Error(500, "工作区#{spaceId}，未找到根部门")
	else
		throw new Meteor.Error(500, "无效的space: #{spaceId}")

WXMini.updateUser = (userId, options)->
	if options.$set.mobile
		options.$set.phone = {number: "+86" + options.$set.mobile, mobile: options.$set.mobile, verified:true, modified:new Date()}

	# 同步头像avatar/profile.avatar字段值到头像URLavatarUrl
	profileAvatar = options.$set.profile?.avatar or options.$set["profile.avatar"]
	if options.$set.avatar
		options.$set.avatarUrl = "/api/files/avatars/" + options.$set.avatar
	else if profileAvatar
		user = Creator.getCollection("users").findOne({_id: userId}, fields: {avatarUrl: 1})
		unless user.avatarUrl
			options.$set.avatarUrl = profileAvatar

	Creator.getCollection("users").direct.update({_id: userId}, options)

	if Creator.getCollection("vip_customers")
		c_options = {$set: {}}
		if options.$set.mobile
			c_options.$set.mobile = options.$set.mobile
		if options.$set.name
			c_options.$set.name = options.$set.name

		if !_.isEmpty(c_options.$set)
			Creator.getCollection("vip_customers").update({owner: userId}, c_options, {multi: true})

# 微信相关接口 #
# 获取access_token
WXMini.getNewAccessTokenSync = (appId, secret) ->
	accessToken = ""
	resData = Meteor.wrapAsync((appId, secret, cb) ->
		request.get {
			url:"https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=#{appId}&secret=#{secret}"
		}, (err, httpResponse, body) ->
			cb err, httpResponse, body
			if err
				console.error('get access_token failed:', err)
				return
			if httpResponse.statusCode == 200
				return body
	)(appId, secret)

	if resData
		body = JSON.parse(resData.body)
		if body
			if body.access_token
				accessToken = body.access_token
			else if body.errcode
				console.error body.errmsg

	return accessToken

# 发送模板消息
WXMini.sendTemplateMessage = (appId, data) ->
	accessToken = Creator.getCollection("vip_apps").findOne(appId)?.access_token
	if not accessToken
		console.error 'Access_token not found'
		return

	options = {
		data: data
	}
	url = "https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=#{accessToken}"
	HTTP.call 'POST', url, options, (error, result) ->
		if error
			console.error error.stack
			return
		if (result && result.data && result.data.errcode)
			console.error result.data
			return

	return

WXMini.getTempToken = (userId, secret)->
	if userId
		now = parseInt(new Date().getTime()/1000).toString()
		key32 = ""
		len = userId.length

		iv = secret

		if len < 32
			c = ""
			i = 0
			m = 32 - len
			while i < m
				c = " " + c
				i++
			key32 = userId + c
		else if len >= 32
			key32 = userId.slice(0,32)

		cipher = crypto.createCipheriv('aes-256-cbc', new Buffer(key32, 'utf8'), new Buffer(iv, 'utf8'))
		console.log('now', now)
		cipheredMsg = Buffer.concat([cipher.update(new Buffer(now, 'utf8')), cipher.final()])
		steedos_token = cipheredMsg.toString('base64')

	return steedos_token

WXMini.decipherToken = (token, userId, secret)->
	key32 = ""
	len = userId.length
	iv = secret
	if len < 32
		c = ""
		i = 0
		m = 32 - len
		while i < m
			c = " " + c
			i++
		key32 = userId + c
	else if len >= 32
		key32 = userId.slice(0,32)
	decipher = crypto.createDecipheriv('aes-256-cbc', new Buffer(key32, 'utf8'), new Buffer(iv, 'utf8'))

	decoded  = decipher.update(token, 'base64', 'utf8');

	decoded += decipher.final('utf8');

	return decoded