Creator.Objects.archives_administrative_records = 
	name: "archives_administrative_records"
	icon: ""
	label: "文书档案"
	fields:
		archival_category_code:
			type: "text"
			label:"档案门类代码"
			defaultValue: "WS"

		fonds_constituting_unit_name:
			type: "text"
			label:"立档单位名称"
			defaultValue: ""
			required:true

		aggregation_level:
			type: "text"
			label:"聚合层次"
			defaultValue: "文件级"
			omit:true
			required:true

		electronic_record_code:
			type: "text"
			label:"电子文件号"
			defaultValue: ""
			omit:true
			required:true

		archival_code:
			type:"text"
			label:"档号"
			required:true

		fonds_identifier:
			type:"select"
			label:"全宗号"
			options:[
				{label:"集团公司",value:"A001"}
			]
		year:
			type: "text"
			label:"年度"
			defaultValue: "2018" 
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
				{label: "10年", value: "10年"},
				{label: "4年", value: "4年"}
			]
			required:true

		category_code:
			type:"lookup"
			label:"类别号"
			defaultValue: ""
			reference_to: "archives_category_entity"
			required:true

		organizational_structure:
			type:"text"
			label:"机构"

		file_number:
			type:"text"
			label:"保管卷号"
		
		classification_number:
			type:"text"
			label:"分类卷号"

		item_number:
			type: "number"
			label:"件号"

		document_sequence_number:
			type: "text"
			label:"文档序号"

		page_number:
			type: "text"
			label:"页号"
		
		title:
			type:"textarea"
			label:"题名"
			is_wide:true
			is_name:true
			required:true

		parallel_title:
			type: "text"
			label:"并列题名"
			

		other_title_information:
			type:"text"
			label:"说明题名文字"

		annex_title:
			type:"textarea"
			label:"附件题名"
			is_wide:true

		descriptor:
			type:"text"
			label:"主题词"
			omit:true

		personal_name:
			type:"text"
			label:"人名"
		
		documnt_number:
			type:"text"
			label:"文件编号"

		author:
			type:"text"
			label:"责任者"
			required:true

		document_date:
			type:"date"
			label:"文件日期"
			required:true

		start_date:
			type:"date"
			label:"起始日期"

		closing_date:
			type:"date"
			label:"截止日期"

		prinpipal_receiver:
			type:"text",
			label:"主送",

		other_receivers:
			type:"text",
			label:"抄送",

		report:
			type:"text",
			label:"抄报",

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
			required:true

		applicant_name:
			type:"text"
			label:"拟稿人"

		applicant_organization_name:
			type:"text"
			label:"拟稿单位"

		secrecy_period:
			type:"text"
			label:"保密期限"

		document_aggregation:
			type:"select",
			label:"文件组合类型",
			defaultValue: "单件"
			options: [
				{label: "单件", value: "单件"},
				{label: "组合文件", value: "组合文件"}
			]

		total_number_of_items:
			type: "text"
			label:"卷内文件数"

		total_number_of_pages:
			type:"number"
			label:"页数"
		
		document_type:
			type:"text"
			label:"文件类型"
		
		document_status:
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
			defaultValue: "汉语"

		orignal_document_creation_way:
			type:"text"
			label:"电子档案生成方式"
			defaultValue: "数字化"
			options: [
				{label: "数字化", value: "数字化"},
				{label: "原生", value: "原生"}
			]

		format_name:
			type:"text"
			label:"格式名称"
			omit:true
		format_version:
			type:"text"
			label:"格式版本"
			omit:true
		computer_file_name:
			type:"text"
			label:"计算机文件名"
			omit:true
		document_size:
			type:"text"
			label:"计算机文件大小"
			omit:true
		physical_record_characteristics:
			type:"text"
			label:"数字化对象形态"
			omit:true
		scanning_resolution:
			type:"text"
			label:"扫描分辨率"
			omit:true
		scanning_color_model:
			type:"text"
			label:"扫描色彩模式"
			omit:true
		image_compression_scheme:
			type:"text"
			label:"图像压缩方案"
			omit:true
		device_type:
			type:"text"
			label:"设备类型"
			omit:true
		device_manufacturer:
			type:"text"
			label:"设备制造商"
			omit:true
		device_model_number:
			type:"text"
			label:"设备型号"
			omit:true
		device_model_serial_number:
			type:"text"
			label:"设备序列号"
			omit:true
		software_type:
			type:"text"
			label:"软件类型"
			omit:true
		software_name:
			type:"text"
			label:"软件名称"
			omit:true
		electronic_signature:
			type:"text"
			label:"电子签名"
			omit:true
		signature_rules:
			type:"text"
			label:"签名规则"
			omit:true
		signature_time:
			type:"datetime"
			label:"签名时间"
			omit:true
		signer:
			type:"text"
			label:"签名人"
			omit:true
		signature:
			type:"text"
			label:"签名结果"
			omit:true
		certificate:
			type:"text"
			label:"证书"
			omit:true
		certificate_reference:
			type:"text"
			label:"证书引证"
			omit:true
		signature_algorithm_identifier:
			type:"text"
			label:"签名算法标识"
			omit:true
		current_location:
			type:"text"
			label:"当前位置"
			omit:true
		offline_medium_identifier:
			type:"text"
			label:"脱机载体编号"
			omit:true
		offline_medium_storage_location:
			type:"text"
			label:"脱机载体存址"
			omit:true
		intelligent_property_statement:
			type: "text"
			label:"知识产权说明"
			omit:true
		authorized_agent:
			type: "text"
			label:"授权对象"
			omit:true
		permission_assignment:
			type: "text"
			label:"授权行为"
			omit:true
		control_identifier:
			type: "text"
			label:"控制标识"
			omit:true
		agent_type:
			type: "text"
			label:"机构人员类型"
			omit:true
		agent_name:
			type: "text"
			label:"机构人员名称"
			omit:true
		organization_code:
			type: "text"
			label:"组织机构代码"
			omit:true
		agent_belongs_to:
			type: "text"
			label:"机构人员隶属"
			omit:true

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