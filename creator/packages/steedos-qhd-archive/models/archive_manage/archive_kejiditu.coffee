Creator.Objects.archive_kejiditu =
	name: "archive_kejiditu"
	icon: "record"
	label: "科技底图"
	enable_search: true
	enable_files: true
	enable_api: true
	fields:
		total_catalog_code:
			type:"text"
			required:true
			label:"底图总目录号"

		document_code:
			type: "text"
			label:"底图号"

		title:
			type:"textarea"
			label:"底图名称"
			is_wide:true
			is_name:true
			required:true
			sortable:true
			searchable:true

		retention_peroid:
			type:"master_detail"
			label:"保管期限"
			reference_to:"archive_retention"
			sortable:true

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

		archive_date:
			type:"date"
			required:true
			label:"归档日期"

		compile_unit:
			type:"text"
			required:true
			label:"编制单位"

		compile_date:
			type:"date"
			label:"编制时间"

		piece_number:
			type: "number"
			label:"张数"
			required:true

		storage_location:
			type:"text"
			required:true
			is_wide:true
			label:"存放位置"

		proportion:
			type:"text"
			label:"比例"

		paper_type:
			type:"text"
			label:"纸类"

		reason_text:
			type:"text"
			is_wide:true
			label:"原因和文据"

		annotation:
			type:"textarea",
			label:"备注",
			is_wide:true

		produce_date:
			type:"date"
			required:true
			label:"处理日期"

		print_page_code:
			type:"number"
			label:"打印页号"

		utilization:
			type:"text"
			label:"使用频率"

	list_views:
		default:
			columns: ["total_catalog_code","document_code","title",
					  "retention_peroid","security_classification",
					  "archive_date","compile_unit","compile_date",
					  "piece_number","produce_date","print_page_code","utilization"]
		recent:
			label: "最近查看"
			filter_scope: "space"

		all:
			label: "全部"
			filter_scope: "space"
		
	permission_set:
		user:
			allowCreate: false
			allowDelete: false
			allowEdit: false
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: true
			list_views:["default","recent","all","borrow"]
		admin:
			allowCreate: true
			allowDelete: false
			allowEdit: true
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: true
			list_views:["default","recent","all","borrow"]
