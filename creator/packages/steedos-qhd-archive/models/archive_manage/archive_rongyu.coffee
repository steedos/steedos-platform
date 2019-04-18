Creator.Objects.archive_rongyu =
	name: "archive_rongyu"
	icon: "record"
	label: "荣誉档案"
	enable_search: true
	enable_files: true
	enable_api: true
	fields:
		archival_code:
			type:"text"
			label:"档号"
		title:
			type:"textarea"
			label:"荣誉名称"
			is_wide:true
			is_name:true
			required:true
			sortable:true
			searchable:true
		awarded_institution:
			type:"text"
			label:"颁发机关"
		awarded_date:
			type:"date"
			label:"颁发日期"
			format:"YYYYMMDD"
		honor_classification:
			type:"select",
			label:"级别",
			defaultValue: "国家级"
			options: [
				{label: "国家级", value: "国家级"},
				{label: "部级", value: "部级"},
				{label: "省级", value: "省级"},
				{label: "市级", value: "市级"}
			]
		retention_peroid:
			type:"master_detail"
			label:"保管期限"
			reference_to:"archive_retention"
			sortable:true
		honor_entity:
			type:"select",
			label:"荣誉实物名称",
			options: [
				{label: "奖牌", value: "奖牌"},
				{label: "证书", value: "证书"},
				{label: "奖杯", value: "奖杯"},
				{label: "奖旗", value: "奖旗"},
				{label: "奖状", value: "奖状"},
				{label: "其他", value: "其他"}
			]

		unit_name:
			type: "text"
			label:"单位"
		classification_number:
			type:"text"
			label:"分类号"
		item_number:
			type: "number"
			label:"件号"
			sortable:true
		transfered_unit:
			type: "text"
			label:"移交单位"
		transfered_by:
			type: "lookup"
			label:"移交人"
			reference_to: "users"
		transfered_date:
			type:"datetime"
			label:"移交时间"
		storage_location:
			type:"text"
			label:"存放位置"
		photo_storage_location:
			type:"text"
			label:"照片存放位置"
		year:
			type: "text"
			label:"年度"
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
		total_number:
			type: "number"
			label:"数量"
		honor_number:
			type:"text"
			label:"荣誉编号"
			sortable:true
		docket_number:
			type: "text"
			label:"案卷号"
		annotation:
			type:"textarea",
			label:"备注",
			is_wide:true

	list_views:
		default:
			columns: ["archival_code","title","awarded_institution","awarded_date",
					"honor_classification","retention_peroid","honor_entity","unit_name",
					"classification_number","item_number","storage_location","photo_storage_location",
					"year","produce_flag","security_classification","total_number",
					"honor_number","docket_number"]
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
