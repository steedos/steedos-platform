Creator.Objects.love_friends =
	name: "love_friends"
	label: "好友"
	icon: "event"
	enable_search: true
	fields:

		user_b:
			label:"第二个用户ID"
			type: "lookup"
			reference_to: "users"
			index: true
			omit: true

		a_to_b:
			label:"我喜欢的"
			type: "number"
			scale: 2
			omit: true

		b_to_a:
			label:"适合我的"
			type: "number"
			scale: 2
			omit: true

		match:
			label:"互相匹配度"
			type: "number"
			scale: 2
			omit: true

		open_group_id:
			label: "群"
			type: "text"
			omit: true

		open_groups:
			label: "群"
			type: "[text]"
			omit: true

		mini_app_id:
			label: "小程序id"
			type: "text"
			index: true

		owner:
			label:"第一个用户ID"
			type: "lookup"
			reference_to: "users"
			index: true
			omit: true

		heart:
			label: "点“心”"
			type: "boolean"
			omit: true

		heart_at:
			label: "点“心”时间"
			type: "datetime"
			omit: true

		star:
			label: "收录"
			type: "boolean"
			omit: true

		star_at:
			label: "收录时间"
			type: "datetime"
			omit: true

		is_looking_for:
			label: "是否满足筛选条件"
			type: "boolean"
			omit: true

		source:
			label: "分享来源"
			type: "text"
			omit: true

		view_count:
			label:"名片查看次数"
			type: "number"
			omit: true

		from:
			label: '名片推荐人'
			type: 'lookup'
			reference_to: 'users'
			omit: true

		# 以下字段同步于users表，用户名片搜索
		name:
			label: "姓名"
			type: "text"
			searchable:true
			index:true

		company:
			type: "text"
			label:'公司'
			searchable:true
			index:true

		mobile2:
			type: "text"
			label:'手机'
			searchable:true
			index:true

		wechat:
			type: "text"
			label:'微信号'
			searchable:true
			index:true

		email2:
			type: "text"
			label:'邮件'
			searchable:true
			index:true

	list_views:
		all:
			label: "所有"
			columns: ["name"]
			filter_scope: "space"

	permission_set:
		user:
			allowCreate: true
			allowDelete: false
			allowEdit: true
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: true
		admin:
			allowCreate: true
			allowDelete: true
			allowEdit: true
			allowRead: true
			modifyAllRecords: true
			viewAllRecords: true
		member:
			allowCreate: true
			allowDelete: false
			allowEdit: true
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: true
		guest:
			allowCreate: false
			allowDelete: false
			allowEdit: true
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: true

	triggers:
		"before.update.server.love_friends":
			on: "server"
			when: "before.update"
			todo: (userId, doc, fieldNames, modifier, options)->
				if modifier?.$set?.heart
					modifier.$set.heart_at = new Date()
				if modifier?.$set?.star
					modifier.$set.star_at = new Date()

		"after.update.server.love_friends":
			on: "server"
			when: "before.update"
			todo: (userId, doc, fieldNames, modifier, options)->
				inc = false
				if modifier?.$set?.heart == true
					inc = 1
				else if modifier?.$set?.heart == false
					inc = -1
				if inc
					Creator.getCollection('users').update({_id: doc.user_b}, { $inc: { heart_count: inc } });

	methods:
		# 可通过this获取到object_name, record_id, space_id, user_id; params为request的body
		getMyFriend: (params) ->
			# 获取当前用户与user_b的friend记录，没有就新增
			collection = Creator.getCollection(this.object_name)
			filters = { owner: this.user_id, space: this.space_id, 'user_b': params.user_b, 'mini_app_id': params.mini_app_id}
			if params.fields
				myFriend = collection.findOne(filters, fields: params.fields)
			else
				myFriend = collection.findOne(filters)
			unless myFriend
				values = 
					user_b: params.user_b
					owner: this.user_id
					space: this.space_id
					mini_app_id: params.mini_app_id
					created: new Date()
					created_by: this.user_id
					modified: new Date()
					modified_by: this.user_id
				myFriend = collection.insert(values)
				values = 
					user_b: this.user_id,
					owner: params.user_b
					space: this.space_id
					mini_app_id: params.mini_app_id
					created: new Date()
					created_by: this.user_id
					modified: new Date()
					modified_by: this.user_id
				collection.insert(values)
			return myFriend


if Meteor.isServer
	Meteor.startup ->
#		Creator.getCollection('love_friends')._dropIndex("owner_1_user_b_1")
		Creator.getCollection('love_friends')._ensureIndex({
			"mini_app_id": 1,
			"owner": 1,
			"user_b": 1
		},{background: true, unique: true})