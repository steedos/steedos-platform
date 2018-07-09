

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
			if phone_user
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
				else
					ret_data.mobile = phone_number

			#如果手机号未曾使用，绑定到当前用户
			if !phone_user
				set = {
					mobile: phone_number
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