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