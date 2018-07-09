JsonRoutes.add 'post', '/api/mini/vip/card_init', (req, res, next) ->
	try
		spaceId = req.query.space_id

		#办卡门店
		storeId = req.query.store_id

		userId = Steedos.getUserIdFromAuthToken(req, res);

		if !userId
			throw new Meteor.Error(500, "No permission")

		data = req.body

		#用户没有已经加入商户工作区时，先加入
		# space_user = Creator.getCollection("space_users").findOne({user: userId, space: spaceId}, {fields: {_id: 1}})
		# if !space_user
		# 	WXMini.addUserToSpace(userId, spaceId, data.name, "member")
		# else
		# 	Creator.getCollection("space_users").direct.update({_id: space_user._id}, {$set: {profile: "member"}})

		#获取商户下的所有门店
		space_store = Creator.getCollection("vip_store").find({space: spaceId}, {fields: {_id: 1}}).fetch()
		#适用门店默认为所有门店
		apply_stores = _.pluck(space_store, "_id")

		now = new Date()
		random_number = parseInt(Math.random()*1000000)
		card_number = "88" + random_number
		while card_number.indexOf('4')>0 or count>0 or card_number.length!=8
			random_number = parseInt(Math.random()*1000000)
			card_number = "88" + random_number
			count = Creator.getCollection("vip_card").find({space:spaceId,card_number:card_number}).count()
		###开通商户下的会员卡###
		doc = {
			user: userId
			space: spaceId
			card_number: card_number
			card_name:data.name
			points: 0
			#grade: "普通"
			#discount: 10.00
			balance: 0.00
			store: storeId
			apply_stores: apply_stores
			start_time: new Date()
			introducer: data.introducer
			owner: userId
			created_by: userId
			modified_by: userId
			created: now
			modified: now
			is_actived: false #默认不激活
		}

		card_id = Creator.getCollection("vip_card").direct.insert(doc)

		# # 将用户填写的信息同步到user表
		# Creator.getCollection("users").direct.update({_id: userId}, {
		# 	$set: {
		# 		"profile.sex": data.sex,
		# 		"profile.birthdate": data.birthdate,
		# 		mobile: data.phoneNumber,
		# 		name: data.name
		# 	}
		# })
		# Creator.getCollection("space_users").direct.update({
		# 	user: userId,
		# 	space: spaceId
		# }, {$set: {mobile: data.phoneNumber}})

		JsonRoutes.sendResult res, {
			code: 200,
			data: {card_id:card_id}
		}
	catch e
		console.error e.stack
		JsonRoutes.sendResult res, {
			code: e.error || 500
			data: {errors: e.reason || e.message}
		}






