Creator.Objects.informations = 
	name: "informations"
	icon: "contact"
	label: "信息上报"
	fields:
		title: 
			type: "text"
			label:"文件标题"
			defaultValue: ""
			description: ""
			inlineHelpText: ""
			required: true
		company:
			type: "text",
			label:"报送公司"
			defaultValue: ""
			description: ""
			inlineHelpText: ""
			required: true
		applicant:
			type: "lookup",
			label:"提交人",
			reference_to: "users"
			omit:true
		applicant_date:
			type: "datetime"
			label:"提交时间"
			omit:true
		content:
			type:"textarea",
			label:"内容",
			defaultValue: ""
			description: ""
			inlineHelpText: ""
			required: true
		score_point:
			type:"checkbox"
			label:"打分形式",
			defaultValue: ""
			description: ""
			multiple:true
			options: [
				{label: "上级采用", value: "上级采用"},
				{label: "领导批示", value: "领导批示"},
				{label: "正常使用", value: "领导批示"},
				{label: "月度好信息", value: "月度好信息"}
			]
		isuse:
			type:"boolean"
			label:"是否采用"
			defaultValue:"否"
	list_views:
		default:
			columns: ["title", "content", "company","isuse","score_point"]
		recent:
			label: "最近查看"
			filter_scope: "space"
		all:
			label: "所有上报信息"
			filter_scope: "space"
		mine:
			label: "我的上报信息"
			filter_scope: "mine"

	permission_set:
		user:
			allowCreate: true
			allowDelete: true
			allowEdit: true
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: false 
		admin:
			allowCreate: true
			allowDelete: true
			allowEdit: true
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: true 