Creator.Objects.archives_files_clerical = 
	name: "archives_files_clerical"
	icon: ""
	label: "文书档案"
	fields:
		YUANWEN: 
			type: "text"
			label:"原文"
			defaultValue: ""
			description: ""
			inlineHelpText: ""
			omit:true
		archival_code:
			type:"text",
			label:"档号",
			is_wide:false
			description: ""
			inlineHelpText: ""
		year:
			type: "text",
			label:"年度"
			defaultValue: "2017"
			is_wide:false
			description: ""
			inlineHelpText: ""
			required:true
		retention_peroid:
			type:"select",
			label:"保管期限",
			defaultValue: "永久"
			options: [
				{label: "永久", value: "永久"},
				{label: "长期", value: "长期"},
				{label: "短期", value: "短期"},
				{label: "30年", value: "30年"},
				{label: "4年", value: "4年"},
			]
		JIANHAO:
			type: "text"
			label:"件号"
		title:
			type:"textarea"
			label:"题名"
			is_wide:true
			is_name:true
			required:true
		documnt_number:
			type:"text",
			label:"文号",
			defaultValue: ""
			description: ""
			inlineHelpText: ""	
		date:
			type:"date"
			label:"文件日期"
		category_code:
			type:"lookup",
			label:"实体分类号",
			defaultValue: ""
			reference_to: "archives_category_entity"
		FILESTATUS:
			type:"select",
			label:"文件状态",
			defaultValue: "不归档"
			options: [
				{label: "不归档", value: "不归档"},
				{label: "电子归档", value: "电子归档"},
				{label: "暂存", value: "暂存"},
				{label: "待归档", value: "待归档"},
				{label: "实物归档", value: "实物归档"}
			]
		author:
			type:"text"
			label:"责任者"
			is_wide:true
		ARCHIVEDATE:
			type:"date",
			label:"归档日期",
			defaultValue: ""
			description: ""
			inlineHelpText: ""
		ARCHIVEDEPT:
			type:"lookup",
			label:"归档部门",
			defaultValue: ""
			description: ""
			reference_to:"archives_dept"
			inlineHelpText: ""
		DEPT:
			type:"text",
			label:"所属部门",
			defaultValue: ""
			description: ""
			inlineHelpText: ""
		# KEYWORDS:
		# 	type:"textarea",
		# 	label:"主题词",
		# 	is_wide:true
		# 	defaultValue: ""
		# 	description: ""
		# 	inlineHelpText: ""
		security_classification:
			type:"select"
			label:"密级"
			options: [
				{label: "绝密", value: "绝密"},
				{label: "机密", value: "机密"},
				{label: "秘密", value: "秘密"},
				{label: "非密", value: "非密"}
			]
		PAGECOUNT:
			type:"number"
			label:"文件页数"
		total_number_of_item:
			type:"number",
			label:"件数",
			defaultValue: ""
			description: ""
			inlineHelpText: ""
		PRODUCEFLAG:
			type:"select",
			label:"处理标志",
			defaultValue: "在档"
			options: [
				{label: "在档", value: "在档"},
				{label: "移出", value: "移出"},
				{label: "销毁", value: "销毁"},
				{label: "出借", value: "出借"}
			]	
		document_type:
			type:"text",
			label:"文件类型",
			defaultValue: ""
			description: ""
			inlineHelpText: ""
		DRAFTUNIT:
			type:"text",
			label:"拟稿单位",
			is_wide:true
			defaultValue: ""
			description: ""
			inlineHelpText: ""
		MAINDEPT:
			type:"text",
			label:"主办部室",
			is_wide:true
			defaultValue: ""
			description: ""
			inlineHelpText: ""
		
		annotation:
			type:"text",
			label:"备注",
			is_wide:true
			defaultValue: ""
			description: ""
			inlineHelpText: ""
		prinpipal_receiver:
			type:"text",
			label:"主送",
			is_wide:true
			defaultValue: ""
			description: ""
			inlineHelpText: ""	
		storage_location:
			type:"text",
			label:"存放位置",
			defaultValue: ""
			description: ""
			inlineHelpText: ""	
		PRODUCER:
			type:"text"
			label:"拟稿人"
		other_receivers:
			type:"text"
			label:"抄送"
			omit:true
		CANJIAN:
			type: "text",
			label:"参见",
			reference_to: "users"
			omit:true
	list_views:
		default:
			columns: ["YEARNO", "JIANHAO","KEEPTIME","FILETITLE",
						"DOCUMETNO", "FILEDATE", "CLASSNO_JH", "PRODUCECOMPANY","ARCHIVEDEPT", "DEPTNO", "KEYWORDS", "SECRETLEVEL"
				]
		recent:
			label: "最近查看"
			filter_scope: "space"
		all:
			label: "全部档案"
			filter_scope: "space"

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