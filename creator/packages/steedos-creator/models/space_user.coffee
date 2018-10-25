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
		company: 
			type: "master_detail"
			label: '所属公司'
			reference_to: "organizations"
			# omit: true
		user_accepted:
			type: "boolean"
			label:'接受状态'
			defaultValue: true
			omit:true
		invite_state:
			label: "邀请状态"
			type: "text"
			omit: true
		user:
			type: "master_detail"
			reference_to: "users"
			index:true
			# required: true
			omit: true
			hidden: true
	list_views:
		all:
			label: "所有人员"
			columns: ["name", "organization","company", "position", "mobile", "email", "sort_no"]
			filter_scope: "space"	
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