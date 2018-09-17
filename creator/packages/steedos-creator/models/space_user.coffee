Creator.Objects.space_users =
	name: "space_users"
	label: "人员"
	icon: "user"
	enable_search: true
	fields:
		name:
			label: "姓名"
			type: "text"
			defaultValue: ""
			description: ""
			inlineHelpText: ""
			required: true
			searchable:true
			index:true
		position:
			type: "text"
			label:'职务'

		mobile:
			type: "text"
			label:'手机'
			group:'-'
		email:
			type: "text"
			label:'邮件'
		work_phone:
			type: "text"
			label:'工作电话'

		company:
			type: "text"
			label:'单位'
			group:'-'
		organizations:
			type: "lookup"
			label:'所属部门'
			reference_to: "organizations"
			multiple: true
			defaultValue: []
		manager:
			type: "lookup"
			label:'上级主管'
			reference_to: "users"

		sort_no:
			type: "number"
			label:'排序号'
			group:'-'
		organization:
			type: "master_detail"
			reference_to: "organizations"
			omit: true
		user_accepted:
			type: "boolean"
			label:'接受状态'
			defaultValue: true
			omit:true
		invite_state:
			label: "邀请状态"
			type: "text"
			omit: true
		profile:
			label: "用户身份"
			type: "select"
			defaultValue: "user"
			options: [
				{label: "员工", value: "user"},
				{label: "会员", value: "member"}
			]
		user:
			type: "master_detail"
			reference_to: "users"
			index:true
			# required: true
			omit: true

		wechat:
			type: "text"
			label:'微信号'

		avatar:
			label:'名片头像'
			type:'image'

		photos:
			label:'照片'
			type:'image'
			multiple:true
			max: 9
			group:'-'

		self_introduction:
			type:'textarea'
			is_wide:true
			label:"个人简介"

	list_views:
		user:
			label: "员工"
			columns: ["name", "organization", "position", "mobile", "email", "sort_no"]
			filter_scope: "space"
			filters: [["profile", "=", "user"]]
		member:
			label: "会员"
			columns: ["name", "mobile", "email", "sort_no"]
			filter_scope: "space"
			filters: [["profile", "=", "member"]]
		# guest:
		# 	label: "游客"
		# 	columns: ["name",  "mobile", "email", "sort_no"]
		# 	filter_scope: "space"
		# 	filters: [["profile", "=", "guest"]]
	permission_set:
		user:
			allowCreate: false
			allowDelete: false
			allowEdit: false
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