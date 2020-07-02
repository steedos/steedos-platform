Creator.Objects.archive_keji =
	name: "archive_keji"
	icon: "record"
	label: "科技档案"
	enable_search: true
	enable_files: true
	enable_api: true
	fields:
		archival_code:
			type:"text"
			label:"档号"
		document_sequence_number:
			type: "number"
			label:"文档序号"
		document_number:
			type:"text"
			label:"文件编号"
			sortable:true
		author:
			type:"text"
			label:"责任者"
		title:
			type:"textarea"
			label:"题名"
			is_wide:true
			is_name:true
			required:true
			sortable:true
			searchable:true
		document_date:
			type:"date"
			label:"文件日期"
			# format:"YYYYMMDD"
		document_type:
			type:"text"
			label:"文件类型"
		page_number:
			type: "number"
			label:"页次"
			required:true
		total_number_of_pages:
			type:"number"
			label:"页数"
		annotation:
			type:"textarea",
			label:"备注",
			is_wide:true
		is_borrowed:
			type:"boolean"
			defaultValue:false
			label:'是否借阅'
			omit:true
		borrowed:
			type:"datetime"
			label:"借阅时间"
			omit:true
		borrowed_by:
			type: "lookup"
			label:"借阅人"
			reference_to: "users"
			omit: true

	list_views:
		default:
			columns: ["archival_code","document_sequence_number","document_number",
					  "title","author","document_type"]
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

	actions:
		borrow:
			label:"借阅"
			visible:true
			on: "record"
			todo:(object_name, record_id, fields)->
				borrower = Creator.Collections[object_name].findOne({_id:record_id})?.borrowed_by
				if borrower == Meteor.userId()
					swal("您已借阅了此档案，归还之前无需重复借阅")
					return
				doc = Archive.createBorrowObject(object_name, record_id)
				Creator.createObject("archive_borrow",doc)
				return
