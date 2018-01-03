Creator.Objects.archives_files_clerical = 
	name: "archives_files_clerical"
	icon: ""
	label: "文书档案"
	fields:
		archival_category_code:
			type: "text"
			label:"档案门类代码"
			defaultValue: "WS"
			description: ""
			inlineHelpText: ""
			required:true

		fonds_constituting_unit_name:
			type: "text"
			label:"立档单位名称"
			defaultValue: ""
			description: ""
			inlineHelpText: ""
			required:true

		aggregation_level:
			type: "text"
			label:"聚合层次"
			defaultValue: ""
			description: ""
			inlineHelpText: ""
			omit:true
			required:true

		electronic_record_code:
			type: "text"
			label:"电子文件号"
			defaultValue: ""
			description: ""
			inlineHelpText: ""
			omit:true
			required:true

		archival_code:
			type:"text"
			label:"档号"
			is_wide:false
			description: ""
			inlineHelpText: ""
			required:true

		fonds_identifier:
			type:"text"
			label:"全宗号"
			is_wide:false
			description: ""
			inlineHelpText: ""

		year:
			type: "text"
			label:"年度"
			defaultValue: "2017"
			is_wide:false
			description: ""
			inlineHelpText: ""
			required:true

		retention_peroid:
			type:"select"
			label:"保管期限"
			defaultValue: "永久"
			options: [
				{label: "永久", value: "永久"},
				{label: "长期", value: "长期"},
				{label: "短期", value: "短期"},
				{label: "30年", value: "30年"},
				{label: "4年", value: "4年"},
			]
			required:true

		category_code:
			type:"lookup"
			label:"实体分类号"
			defaultValue: ""
			reference_to: "archives_category_entity"
			is_wide:false
			description: ""
			inlineHelpText: ""
			required:true

		organizational_structure:
			type:"text"
			label:"机构"
			is_wide:false
			description: ""
			inlineHelpText: ""

		item_number:
			type: "number"
			label:"件号"
			is_wide:false
			description: ""
			inlineHelpText: ""

		title:
			type:"textarea"
			label:"题名"
			is_wide:true
			is_name:true
			required:true

		annex_title:
			type:"textarea"
			label:"附件题名"
			is_wide:true

		documnt_number:
			type:"text"
			label:"文件编号"
			is_wide:false
			defaultValue: ""
			description: ""
			inlineHelpText: ""

		author:
			type:"text"
			label:"责任者"
			is_wide:false
			defaultValue: ""
			description: ""
			inlineHelpText: ""
			required:true

		document_date:
			type:"date"
			label:"文件日期"
			is_wide:false
			defaultValue: ""
			description: ""
			inlineHelpText: ""
			required:true

		prinpipal_receiver:
			type:"text",
			label:"主送",
			is_wide:false
			defaultValue: ""
			description: ""
			inlineHelpText: ""

		other_receivers:
			type:"text",
			label:"抄送",
			is_wide:false
			defaultValue: ""
			description: ""
			inlineHelpText: ""

		report:
			type:"text",
			label:"抄报",
			is_wide:false
			defaultValue: ""
			description: ""
			inlineHelpText: ""

		security_classification:
			type:"select"
			label:"密级"
			defaultValue: "公开"
			options: [
				{label: "绝密", value: "绝密"},
				{label: "机密", value: "机密"},
				{label: "秘密", value: "秘密"},
				{label: "公开", value: "公开"}
			]

		applicant_name:
			type:"text"
			label:"拟稿人"
			is_wide:false
			defaultValue: ""
			description: ""
			inlineHelpText: ""

		applicant_organization_name:
			type:"text"
			label:"拟稿单位"
			is_wide:false
			defaultValue: ""
			description: ""
			inlineHelpText: ""

		total_number_of_item:
			type: "text"
			label:"件数"
			is_wide:false
			defaultValue: ""
			description: ""
			inlineHelpText: ""

		total_number_of_pages:
			type:"number"
			label:"页数"
			is_wide:false
			defaultValue: ""
			description: ""
			inlineHelpText: ""

		document_type:
			type:"select",
			label:"文件类型",
			defaultValue: "单件"
			options: [
				{label: "单件", value: "单件"},
				{label: "组合文件", value: "组合文件"}
			]

		file_status:
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

		language:
			type:"text"
			label:"语种"
			is_wide:false
			defaultValue: "汉语"
			description: ""
			inlineHelpText: ""

		orignal_document_creation_way:
			type:"text"
			label:"电子档案生成方式"
			defaultValue: "数字化"
			options: [
				{label: "数字化", value: "数字化"},
				{label: "原生", value: "原生"}
			]

		computer_file_name:
			type:"text"
			label:"计算机文件名"
			is_wide:false
			defaultValue: ""
			description: ""
			inlineHelpText: ""

		document_size:
			type:"number"
			label:"计算机文件大小"
			is_wide:false
			defaultValue: ""
			description: ""
			inlineHelpText: ""

		archive_date:
			type:"date"
			label:"归档日期"
			defaultValue: ""
			description: ""
			inlineHelpText: ""
		
		archive_dept:
			type:"lookup"
			label:"归档部门"
			defaultValue: ""
			description: ""
			reference_to:"archives_dept"
			inlineHelpText: ""

		produce_flag:
			type:"select",
			label:"处理标志",
			defaultValue: "在档"
			options: [
				{label: "在档", value: "在档"},
				{label: "移出", value: "移出"},
				{label: "销毁", value: "销毁"},
				{label: "出借", value: "出借"}
			]

		main_dept:
			type:"text",
			label:"主办部室",
			is_wide:true
			defaultValue: ""
			description: ""
			inlineHelpText: ""

		annotation:
			type:"textarea",
			label:"备注",
			is_wide:true
			defaultValue: ""
			description: ""
			inlineHelpText: ""
			
		storage_location:
			type:"text"
			label:"存放位置"
			defaultValue: ""
			description: ""
			inlineHelpText: ""	

		reference:
			type: "text"
			label:"参见"

		



	list_views:
		default:
			columns: ["year", "JIANHAO","retention_peroid","name",
						"documnt_number", "date", "author","ARCHIVEDEPT", "DEPT", "security_classification"
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