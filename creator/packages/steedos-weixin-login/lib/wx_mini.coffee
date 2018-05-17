@WXMini = {}

WXMini.newUser = (appId, openid, unionid, name, locale, phoneNumber)->
	now = new Date
	user_id = Creator.getCollection("users")._makeNewID()
	user = {
		_id: user_id
		steedos_id: phoneNumber || user_id
		name: name
		locale: locale
		is_deleted: false
		created: now
		modified: now
	}
	user.services = {weixin: {openid: []}}
	if openid
		user.services.weixin.openid.push {_id: openid, appid: appId}

	if unionid
		user.services.weixin.unionid = unionid
	userId = Creator.getCollection("users").direct.insert(user)
	return userId

WXMini.newSpace = (userId, spaceName)->
	now = new Date
	space = {
		name: spaceName
		owner: userId
		admins: [userId]
		is_deleted: false
		created: now
		created_by: userId
		modified: now
		modified_by: userId
	}
	spaceId = Creator.getCollection("spaces").direct.insert(space)
	return spaceId

WXMini.newOrganization = (userId, spaceId, orgName)->
	now = new Date
	org = {
		space: spaceId
		name: orgName
		fullname: orgName
		is_company: true
		users: [userId]
		created: now
		created_by: userId
		modified: now
		modified_by: userId
	}
	orgId = Creator.getCollection("organizations").direct.insert(org)
	return orgId

WXMini.newSpaceUser = (userId, spaceId, orgId, userName)->
	now = new Date
	spaceUser = {
		user: userId
		space: spaceId
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

WXMini.addUserToSpace = (userId, spaceId, userName)->
	console.log("addUserToSpace", userId, spaceId, userName)
	space = Creator.getCollection("spaces").findOne({_id: spaceId})
	if space
		#将用户添加到space的根部门下
		root_org = Creator.getCollection("organizations").findOne({space: space._id, is_company: true}, {fields: {_id: 1}})
		if root_org
			Creator.getCollection("organizations").direct.update({_id: root_org._id}, {$push: {users: userId}})
			# 新增一条space_user
			WXMini.newSpaceUser(userId, spaceId, root_org._id, userName)
		else
			throw new Meteor.Error(500, "工作区#{spaceId}，未找到根部门")
	else
		throw new Meteor.Error(500, "无效的space: #{spaceId}")

