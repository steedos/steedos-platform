
JsonRoutes.add 'post', '/api/steedos/weixin/card/activate', (req, res, next) ->

	spaceId = req.query.spaceId

	#办卡门店
	store = req.query.store

	userId = Steedos.getUserIdFromAuthToken(req, res);

	data = req.body

	#用户没有已经加入商户工作区时，先加入
	space_user = Creator.getCollection("space_users").findOne({user: userId, space: spaceId})
	if !space_user
		WXMini.addUserToSpace(userId, spaceId, data.name)

	###开通商户下的会员卡###
	doc = {
		user: userId
		card_number: (new Date()).getTime()
		points: 0
		grade: "普通"
		discount: 1
		balance: 0.00
		store: store
		apply_stores: [apply_stores]
		start_time: new Date()
		introducer: data.introducer
	}

	Creator.getCollection("vip_card").insert(doc)

	# 将用户填写的信息同步到user表
	Creator.getCollection("users").direct.update({_id: userId}, {$set: {"profile.sex": data.sex, "profile.birthdate": data.birthdate}})

	JsonRoutes.sendResult res, {
		code: 200,
		data: {}
	}






