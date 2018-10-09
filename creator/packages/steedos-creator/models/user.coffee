Creator.Objects.users =
	name: "users"
	label: "用户"
	icon: "user"
	enable_api: true
	fields:
		avatar:
			label:'头像'
			type:'avatar'
			group:'-'

		avatarUrl:
			label:'头像URL'
			type:'text'
			omit: true
		
		name:
			label: "姓名"
			type: "text"
			required: true
			searchable:true
			index:true
			group:'-'
		
		company:
			type: "text"
			label:'公司'
			required: true
		
		position:
			type: "text"
			label:'职务'
			required: true

		mobile:
			type: "text"
			label:'手机'
			group:'-'
			required: true

		mobile2:
			type: "text"
			label:'手机'
			required: true
			group:'-'
		
		wechat:
			type: "text"
			label:'微信号'
		
		work_phone:
			type: "text"
			label:'座机'

		email:
			type: "text"
			label:'邮件'

		email2:
			type: "text"
			label:'邮件'
			required: true

		location:
			label:'地址'
			type:'location'
			system: 'gcj02'
			required: true

		voice:
			label:'语音介绍'
			type:'audio'
			group:'-'

		self_introduction:
			type:'textarea'
			is_wide:true
			label:"个人简介"
			group:'-'

		photos:
			label:'照片'
			type:'image'
			multiple:true
			max: 9
			group:'-'

		card_published:
			label: "名片已发布"
			type: "boolean"
			omit: true

		profile:
			type:'[Object]'
			label:'用户信息'
			omit: true
		'profile.sex':
			type:'select'
			label:'性别'
			options:[
				{label:'男',value:'男'},
				{label:'女',value:'女'}
			]
			group:'-'
		'profile.birthdate':
			type:'date'
			label:'生日'

		'profile.avatar':
			type:'text'
			label:'头像'
			group:'-'

		qrcode:
			type:'image'
			label:'二维码'

		sex:
			type:'select'
			label:'性别'
			options:[
				{label:'男',value:'男'},
				{label:'女',value:'女'}
			]
			group:'-'

		birthday:
			type:'date'
			label:"生日"

		live:
			type:'selectCity'
			label:"现居地"

		hometown:
			type:'selectCity'
			label:"家乡"

		age:
			type:'number'
			label:"年龄"
			hidden:true

		zodiac:
			type:'text'
			label:"生肖"
			hidden:true

		constellation:
			type:'text'
			label:"星座"
			hidden:true

		friends_count:
			label:'好友个数'
			type:'number'
			omit: true

		heart_count:
			label:'点赞数'
			type:'number'
			omit: true

		tags:
			label:'好友标签'
			type:'text'
			multiple: true
			omit: true

	list_views:
		all:
			label:'所有'
			columns: ["name", "username"]
			filter_scope: "all"
			filters: [["_id", "=", "{userId}"]]

	triggers:
		"before.update.server.user":
			on: "server"
			when: "before.update"
			todo: (userId, doc, fieldNames, modifier, options)->
				# 同步头像avatar/profile.avatar字段值到头像URLavatarUrl
				profileAvatar = modifier.$set.profile?.avatar or modifier.$set["profile.avatar"]
				if modifier.$set.avatar
					modifier.$set.avatarUrl = "/api/files/avatars/" + modifier.$set.avatar
				else if profileAvatar
					user = Creator.getCollection("users").findOne({_id: userId}, fields: {avatarUrl: 1})
					unless user.avatarUrl
						modifier.$set.avatarUrl = profileAvatar
	
	permission_set:
		guest:
			allowCreate: false
			allowDelete: false
			allowEdit: true
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: true

if Meteor.isServer
	Meteor.users._ensureIndex({
		"services.weixin.openid.appid": 1,
		"services.weixin.openid._id": 1
	},{background: true})