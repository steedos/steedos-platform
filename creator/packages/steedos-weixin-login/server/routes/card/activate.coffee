JsonRoutes.add 'post', '/api/steedos/weixin/card/activate', (req, res, next) ->
	spaceId = req.query.spaceId

	#办卡门店
	storeId = req.query.storeId

	userId = Steedos.getUserIdFromAuthToken(req, res);

	data = req.body

	#用户没有已经加入商户工作区时，先加入
	space_user = Creator.getCollection("space_users").findOne({user: userId, space: spaceId})
	if !space_user
		WXMini.addUserToSpace(userId, spaceId, data.name)

	now = new Date()

	###开通商户下的会员卡###
	doc = {
		user: userId
		space: spaceId
		card_number: now.getTime()
		points: 0
		grade: "普通"
		discount: 1
		balance: 0.00
		store: storeId
		apply_stores: [storeId]
		start_time: new Date()
		introducer: data.introducer
		owner: userId
		created_by: userId
		modified_by: userId
		created: now
		modified: now
	}

	Creator.getCollection("vip_card").direct.insert(doc)

	# 将用户填写的信息同步到user表
	Creator.getCollection("users").direct.update({_id: userId}, {
		$set: {
			"profile.sex": data.sex,
			"profile.birthdate": data.birthdate,
			mobile: data.phoneNumber
		}
	})
	Creator.getCollection("space_users").direct.update({
		user: userId,
		space: spaceId
	}, {$set: {mobile: data.phoneNumber}})

	JsonRoutes.sendResult res, {
		code: 200,
		data: {}
	}






