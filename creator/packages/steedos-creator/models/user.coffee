Creator.Objects.users =
	name: "users"
	label: "用户"
	icon: "user"
	enable_api: true
	fields:
		name:
			label: "名称"
			type: "text"
			required: true
			searchable:true
			index:true
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
		'profile.birthdate':
			type:'date'
			label:'生日'
		'profile.avatar':
			type:'text'
			label:'头像'
		qrcode:
			type:'image'
			label:'二维码'

		avatar:
			label:'头像'
			type:'image'
			group:'-'
		
		company:
			type: "text"
			label:'公司'
		
		position:
			type: "text"
			label:'职务'

		mobile:
			type: "text"
			label:'手机'
			group:'-'
		
		wechat:
			type: "text"
			label:'微信号'

		email:
			type: "text"
			label:'邮件'

		location:
			label:'地址'
			type:'location'
			system: 'gcj02'


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

		star_count:
			label:'点赞数'
			type:'number'
			omit: true

		tags:
			label:'好友个数'
			type:'text'
			multiple: true

		voice:
			label:'语音介绍'
			type:'audio'
			omit: true

	list_views:
		all:
			label:'所有'
			columns: ["name", "username"]
			filter_scope: "all"
			filters: [["_id", "=", "{userId}"]]
	permission_set:
		user:
			allowCreate: false
			allowDelete: false
			allowEdit: false
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: false
		admin:
			allowCreate: false
			allowDelete: false
			allowEdit: false
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: false

if Meteor.isServer
	Meteor.users._ensureIndex({
		"services.weixin.openid.appid": 1,
		"services.weixin.openid._id": 1
	},{background: true})