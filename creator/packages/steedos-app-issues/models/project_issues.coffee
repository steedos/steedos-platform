Creator.Objects.project_issues =
	name: "project_issues"
	label: "问题"
	icon: "location"
	enable_files: true
	enable_search: true
	enable_instances: true
	fields:
		name:
			label: '问题标题'
			type: 'text'
			is_wide: true
			required: true
			searchable: true

		description:
			label: '问题描述'
			type: 'textarea'
			is_wide: true
			rows: 4

		category:
			label: '问题类型'
			type: 'master_detail'
			reference_to: 'projects'
			filterable: true
		
		priority:
			label: '处理优先级'
			type: "select"
			options: [
				{label:"高", value:"high"},
				{label:"中", value:"medium"},
				{label:"低", value:"low"}
			]
			defaultValue: "medium"
			filterable: true

		# level:
		# 	label: "级别"
		# 	type: "select"
		# 	options: [
		# 		{label:"车间级", value:"department"},
		# 		{label:"厂级", value:"company"},
		# # 		{label:"公司级", value:"group"}
		# 	]
		# 	sortable: true
		# 	defaultValue: "department"
		# 	filterable: true

		company_id:
			label: '提报单位'
			filterable: true
			omit: false
			hidden: false

		organization:
			label: '提报部门'
			type: 'lookup'
			reference_to: 'organizations'
			filterable: true


		# tags:
		# 	label: '标签'
		# 	type: 'lookup'
		# 	reference_to: 'project_tags'
		# 	multiple: true
		# 	filterable: true

	

		# owner:
		# 	label: '责任人'
		# 	type: 'lookup'
		# 	reference_to: 'users'
		# 	hidden: false
		# 	omit: false
		# 	required: false

		owner_organization:
			label: '受理部门'
			type: 'lookup'
			reference_to: 'organizations'

		deadline:
			label: '截止时间'
			type: 'date'

		end_organization:
			label: '办结部门'
			type: 'lookup'
			reference_to: 'organizations'

		enddate:
			label: '办结时间'
			type: 'date'

		# state:
		# 	label: "进度"
		# 	type: "select"
		# 	options: [
		# 		{label:"待确认", value:"pending_confirm"},
		# 		{label:"处理中", value:"in_progress"},
		# 		{label:"暂停", value:"paused"},
		# 		{label: "已完成", value:"completed"}
		# 		{label: "已取消", value:"cancelled"}
		# 	]
		# 	sortable: true
		# 	required: true
		# 	filterable: true

		solution:
			label: '解决方案'
			type: 'textarea'
			is_wide: true
			rows: 4

		unresolved:
			label: '未解决说明'
			type: 'textarea'
			is_wide: true
			rows: 4

		result:
			label: "问题状态"
			type: "select"
			options: [
				{label:"已提交，未确认", value:"submit"},
				{label:"已确认，未处理", value:"Confirmed"}
				{label:"已处理，未完成", value:"Processed"}
				{label:"已完成，已办结", value:"solved"}
				{label:"已办结，未解决", value:"Unsolved"}
			]
			defaultValue: "submit"
			filterable: true

		status:
			label: "状态"
			type: "select"
			options: [
				{label:"进行中", value:"open"},
				{label:"已关闭", value:"closed"}
			]
			defaultValue: "open"
			filterable: true



		# investment_amount:
		# 	label: '投资估算(万元)'
		# 	type: 'number'
		# 	group: "投资"

		# investment_channel:
		# 	label: '投资渠道'
		# 	type: 'text'
		# 	group: "投资"

		# investment_forcast:
		# 	label: '预期效果'
		# 	type: 'textarea'
		# 	is_wide: true
		# 	group: "投资"

		# investment_profit:
		# 	label: '效益测算(万元)'
		# 	type: 'number'
		# 	group: "投资"

		# invertment_date:
		# 	label: '预计实施时间'
		# 	type: 'date'
		# 	group: "投资"


		created_by:
			label: '提报人'

		instance_state:
			omit: false
			hidden: false
			readonly: true


	list_views:
		open:
			label: "进行中"
			columns: ["name", "category", "level", "tags", "created"]
			filter_scope: "space"
			filters: [["status", "=", "open"]]
			filter_fields: ["category", "level", "tags", "company_id", "owner"]
		closed:
			label: "已关闭"
			columns: ["name", "category", "level", "tags", "created"]
			filter_scope: "space"
			filters: [["status", "=", "closed"]]
			filter_fields: ["category", "level", "tags", "company_id", "owner"]
		all:
			label: "所有"
			columns: ["name", "category", "level", "status", "tags", "created"]
			filter_scope: "space"
			filter_fields: ["category", "level", "status", "tags", "company_id", "owner"]


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