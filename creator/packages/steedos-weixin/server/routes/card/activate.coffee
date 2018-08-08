JsonRoutes.add 'put', '/api/mini/vip/card_activate', (req, res, next) ->
	try
		spaceId = req.query.space_id

		# #办卡门店
		# storeId = req.query.store_id
		userId = Steedos.getUserIdFromAuthToken(req, res);
		data = req.body
		#用户没有已经加入商户工作区时，先加入
		# space_user = Creator.getCollection("space_users").findOne({user: userId, space: spaceId}, {fields: {_id: 1, profile: 1}})
		# if !space_user
		# 	WXMini.addUserToSpace(userId, spaceId, data.name, "member")
		# else
		# 	if space_user.profile != 'admin' && space_user.profile != 'user'
		# 		Creator.getCollection("space_users").direct.update({_id: space_user._id}, {$set: {profile: "member",mobile: data.phoneNumber}})

		if !userId
			throw new Meteor.Error(500, "No permission")
		card_id = req.query.card_id
		# 将用户填写的信息同步到user表
		customer = Creator.getCollection("vip_customers").findOne({owner: userId, space: spaceId}, {fields: {is_member: 1, invite_code: 1}})

		is_member = false
		if customer
			invite_code = Creator.getCollection("love_invite_codes").findOne({space: spaceId, code: customer.invite_code, card_rule: data.category_id})
			if invite_code
				is_member = true

		WXMini.updateUser(userId, {
			$set: {
				"profile.sex": data.sex,
				"profile.birthdate": data.birthdate,
#				mobile: data.phoneNumber,
				name: data.name,
#				'phone.number':"+86"+data.phoneNumber,
#				'phone.mobile':data.phoneNumber,
#				'phone.verified':true,
#				'phone.modified':new Date()
			}
		})

		# Creator.getCollection("space_users").direct.update({
		# 	user: userId,
		# 	space: spaceId
		# }, {$set: {mobile: data.phoneNumber}})
		if data.price==0 || is_member
			if customer
				Creator.getCollection("vip_customers").direct.update({_id: customer._id},{$set:{is_member:true}})
			Creator.getCollection("vip_card").direct.update({_id:card_id},{$set:{is_actived:true,card_name:data.category_id}})
				# space_user = Creator.getCollection("space_users").findOne({user: userId, space: spaceId}, {fields: {_id: 1}})
				# if !space_user
				# 	WXMini.addUserToSpace(userId, spaceId, data.name, "member")
				# else
				# 	Creator.getCollection("space_users").direct.update({_id: space_user._id}, {$set: {profile: "member"}})


		else
			throw new Meteor.Error 500, "支付完成之后才可激活"
		# doc = {
		# 	user: userId
		# 	space: spaceId
		# 	card_number: card_number
		# 	card_name:data.name
		# 	points: 0
		# 	#grade: "普通"
		# 	#discount: 10.00
		# 	balance: 0.00
		# 	store: storeId
		# 	apply_stores: apply_stores
		# 	start_time: new Date()
		# 	introducer: data.introducer
		# 	owner: userId
		# 	created_by: userId
		# 	modified_by: userId
		# 	created: now
		# 	modified: now
		# 	is_actived: false #默认激活
		# }
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






