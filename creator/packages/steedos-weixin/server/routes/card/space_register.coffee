JsonRoutes.add 'post', '/api/mini/vip/space_register', (req, res, next) ->
	try
		store_name = req.body.store_name
		space_name = req.body.space_name || store_name
		contact_name = req.body.contact_name
		space_industry = req.body.industry
		mobile = req.body.phoneNumber
		location = req.body.location

		userId = Steedos.getUserIdFromAuthToken(req, res);

		if !userId
			throw new Meteor.Error(500, "No permission")

		if !store_name
			throw new Meteor.Error(500, "商户名称为必填")
		
		if !contact_name
			throw new Meteor.Error(500, "联系人姓名为必填")
		
		if !space_industry
			throw new Meteor.Error(500, "行业为必填")

		if !mobile
			throw new Meteor.Error(500, "手机号为必填")

		if !location
			throw new Meteor.Error(500, "地址为必填")

		#创建工作区、root org、space user
		spaceId = WXMini.newSpace(userId, space_name)
		orgId = WXMini.newOrganization(userId, spaceId, space_name)
		space_user = WXMini.newSpaceUser(userId, spaceId, orgId, contact_name, 'user', mobile)

		console.log("userId", userId)

		#同步用户手机号
		WXMini.updateUser(userId, {
			$set: {
#				mobile: mobile,
				name:contact_name
			}
		})

		now = new Date()
		admins = []
		admins.push userId
		#创建店铺
		doc = {
			_id: spaceId #初始化的 store_id 和  space_id 相同
			name: store_name
			location: location
			contact: userId
			phone: mobile
			space: spaceId
			owner: userId
			created_by: userId
			modified_by: userId
			created: now
			modified: now
			enabled_objects:['post', 'vip_product', 'vip_store']
			admins:admins
		}

		storeId = Creator.getCollection("vip_store").insert(doc)

		#创建默认卡项: 商户开通的时候，自动生成一种会员卡（卡项），{商户名称}会员卡， _id = space_id #77
		default_vip_category = {
			_id: spaceId
			name: "#{space_name}会员卡"
			price: 0.00
			space: spaceId
			owner: userId
			created_by: userId
			modified_by: userId
			created: now
			modified: now
		}
		Creator.getCollection("vip_category").insert(default_vip_category)

		JsonRoutes.sendResult res, {
			code: 200,
			data: {
				store_id: storeId
				space_id: spaceId
			}
		}
		return
	catch e
		console.error e.stack
		JsonRoutes.sendResult res, {
			code: e.error || 500
			data: {errors: e.reason || e.message}
		}





