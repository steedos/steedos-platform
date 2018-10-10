
userDataTransfer = (appId, from_user, to_user)->

	#数据结构： {待转移的数据对象: [user字段数组]}
	dataTransferObjects = {
		vip_customers: ['from', 'owner', 'created_by', 'modified_by'],
		love_friends: ['created_by', 'modified_by'],
		vip_invites: ['from', 'owner', 'created_by', 'modified_by'],
		vip_groups: ['owner', 'created_by', 'modified_by']
	}

	_.forEach dataTransferObjects, (object_user_keys, object)->
		object_coll = Creator.getCollection(object);
		object_user_keys.forEach (key)->
			query = {}
			query[key] = from_user
			set = {$set: {}}
			set.$set[key] = to_user
			console.log(object, JSON.stringify(query), JSON.stringify(set))
			try
				object_coll.update(query, set)
			catch e
				console.log(e)

	#单独处理love_friends的'user_b', 'owner'字段
	love_friends_coll = Creator.getCollection("love_friends");

	#user_b
	love_friends_coll.find({mini_app_id: appId, user_b: from_user}, {fields: {_id: 1, owner: 1}}).forEach (f)->
		old_f = love_friends_coll.findOne({mini_app_id: appId, user_b: to_user, owner: f.owner}, {fields: {_id: 1}})
		if old_f
			love_friends_coll.remove({_id: old_f._id})
		love_friends_coll.update({_id: f._id}, {$set: {user_b: to_user}})

	#owner
	love_friends_coll.find({mini_app_id: appId, owner: from_user}, {fields: {_id: 1, user_b: 1}}).forEach (f)->
		old_f = love_friends_coll.findOne({mini_app_id: appId, user_b: f.user_b, owner: to_user}, {fields: {_id: 1}})
		if old_f
			love_friends_coll.remove({_id: old_f._id})
		love_friends_coll.update({_id: f._id}, {$set: {owner: to_user}})




	#单独处理vip_groups的users字段
	vip_groups_coll = Creator.getCollection("vip_groups");
	vip_groups_coll.update({users: from_user}, {$addToSet: {users: to_user}})
	vip_groups_coll.update({users: from_user}, {$pull: {users: from_user}})


JsonRoutes.add 'post', '/api/steedos/weixin/phone_login', (req, res, next) ->
	try
		userId = Steedos.getUserIdFromAuthToken(req, res);

		if !userId
			throw new Meteor.Error(500, "No permission")

		appId = req.headers["appid"]

		secret = Meteor.settings.weixin.appSecret[appId]

		if !secret
			throw new Meteor.Error(500, "无效的appId #{appId}")

		data = req.body

		ret_data = {}

		phone_number = data.phone_number

		nickName = data.nickName

		avatarUrl = data.avatarUrl

		gender = data.gender

		#先使用phone_number查找用户

		phone_user = Creator.getCollection("users").findOne({mobile: phone_number})

		login_user = Creator.getCollection("users").findOne({_id: userId}, {fields: {_id: 1, services: 1, mobile: 1}})

		if !login_user
			throw new Meteor.Error(500, "无效的用户 #{userId}")

		if login_user.mobile
			ret_data.mobile = login_user.mobile
		else
			#如果手机号对应的用户与当前用户不同，则切换到手机号对应的用户
			if phone_user && phone_number
				if phone_user._id != userId
					console.log('如果手机号对应的用户与当前用户不同，则切换到手机号对应的用户')
					openids = login_user.services?.weixin?.openid
					if openids
						openid = _.find(openids, (t)->
							return t.appid is appId
						)
						Creator.getCollection("users").update(_id: phone_user._id, {$push: {'services.weixin.openid': openid}})
						ret_data.user_id = phone_user._id
						ret_data.name = phone_user.name
						ret_data.mobile = phone_user.mobile
						ret_data.sex = phone_user.profile?.sex
						ret_data.birthdate = phone_user.profile?.birthdate
						ret_data.avatar = phone_user.profile?.avatar

					userDataTransfer(appId, userId, phone_user._id)
				else
					ret_data.mobile = phone_number

			#如果手机号未曾使用，绑定到当前用户
			if !phone_user || !phone_number
				set = {
					mobile: phone_number
					mobile2: phone_number
					wechat: phone_number
					name: nickName
					"profile.avatar": avatarUrl
				}

				if gender == 1
					ret_data.sex = '男'
					set["profile.sex"] = '男'
				else if gender == 2
					ret_data.sex = '女'
					set["profile.sex"] = '女'

				WXMini.updateUser(userId, {
					$set: set
				})
				ret_data.name = nickName
				ret_data.mobile = phone_number
				ret_data.avatar = avatarUrl

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