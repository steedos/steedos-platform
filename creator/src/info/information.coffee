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
		applicant_date:
			type: "datetime"
			label:"提交时间"
		content:
			type:"text",
			label:"内容",
			defaultValue: ""
			description: ""
			inlineHelpText: ""
			required: true
		Isuse:
			type:"select"
			label:"是否采用"
			defaultValue:"否"
			allowedValues:["是","否"]
			required:true
		score_point:
			type:"select"
			label:"打分形式",
			defaultValue: ""
			description: ""
			multiple:true
			allowedValues:["上级采用","领导批示","正常使用","月度好信息"]
	list_views:
		default:
			columns: ["title", "content", "company", "applicant_date","Isuse","score_point"]
		recent:
			label: "最近查看"
			filter_scope: "space"
		all:
			label: "所有上报信息"
			filter_scope: "space"
		mine:
			label: "我的上报信息"
			filter_scope: "mine"

	permissions:
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