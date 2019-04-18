Creator.Objects.archive_kuaiji =
	name: "archive_kuaiji"
	icon: "record"
	label: "会计档案"
	enable_search: true
	enable_files: true
	enable_api: true
	fields:
		archival_code:
			type:"text"
			label:"档号"
		year:
			type: "text"
			label:"年度"
			sortable:true
		title:
			type:"textarea"
			label:"题名"
			is_wide:true
			is_name:true
			sortable:true
			searchable:true
			required:true
		docket_number:
			type: "text"
			label:"案卷号"
			required:true
		retention_peroid:
			type:"master_detail"
			label:"保管期限(会计)"
			reference_to:"archive_retention"
			sortable:true
			required:true
		security_classification:
			type:"select"
			label:"密级"
			defaultValue: "非密"
			options: [
				{label: "绝密", value: "绝密"},
				{label: "机密", value: "机密"},
				{label: "秘密", value: "秘密"},
				{label: "非密", value: "非密"}
			]
			sortable:true
		original_voucher_number:
			type: "text"
			label:"原凭证号"
		start_date:
			type:"date"
			label:"起始日期"
			format:"YYYYMMDD"
		closing_date:
			type:"date"
			label:"截止日期"
			format:"YYYYMMDD"
		transfered:
			type:"date"
			label:"移交时间"
		box_number:
			type: "text"
			label:"盒号"
		start_end_book_number:
			type: "text"
			label:"起止册号"
		total_number_of_pages:
			type:"number"
			label:"卷内页数"
		financial_category:
			type:"number"
			label:"财务属类"
			defaultValue: "凭证"
			options: [
				{label: "凭证", value: "凭证"},
				{label: "账簿", value: "账簿"},
				{label: "报表", value: "报表"},
				{label: "其他", value: "其他"}
			]
		storage_location:
			type:"text"
			label:"存放位置"
		produce_flag:
			type:"select",
			label:"处理标志",
			defaultValue: "在档"
			options: [
				{label: "在档", value: "在档"},
				{label: "暂存", value: "暂存"},
				{label: "移出", value: "移出"},
				{label: "销毁", value: "销毁"},
				{label: "出借", value: "出借"}
			]
		voucher_category:
			type:"text"
			label:"凭证类别"
		annotation:
			type:"textarea",
			label:"备注",
			is_wide:true
		produce_date:
			type:"date"
			label:"处理日期"
		accounting_type:
			type:"text"
			label:"财会文种"
		utilization:
			type:"text"
			label:"使用频率"
		start_end_page_number:
			type: "text"
			label:"起止页次"
		

