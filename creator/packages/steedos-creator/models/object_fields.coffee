Creator.Objects.object_fields = 
	name: "object_fields"
	label: "字段"
	icon: "orders"
	enable_api: true
	fields:
		object:
			type: "master_detail"
			reference_to: "objects"
		name: 
			type: "text"
			searchable:true
			index:true
		label:
			type: "text"
		description: 
			label: "Description"
			type: "text"
		type: 
			type: "select"
			options: 
				text: "文本",
				textarea: "长文本"
				html: "Html文本",
				select: "选择框",
				boolean: "Checkbox"
				date: "日期"
				datetime: "日期时间"
				number: "数值"
				currency: "金额"
				lookup: "相关表"
				master_detail: "主表/子表"
		multiple: 
			type: "boolean"

		required:
			type: "boolean"

		is_wide:
			type: "boolean"

		readonly:
			type: "boolean"

		disabled:
			type: "boolean"

		omit:
			type: "boolean"

		group:
			type: "text"

		index:
			type: "boolean"

		sortable:
			type: "boolean"

		allowedValues:
			type: "text"
			multiple: true

		rows:
			type: "number"

		precision:
			type: "number"
		scale:
			type: "number"


		reference_to:
			type: "select"

	list_views:
		default:
			columns: ["name", "description", "modified"]
		all:
			filter_scope: "space"

	permission_set:
		user:
			allowCreate: false
			allowDelete: false
			allowEdit: false
			allowRead: false
			modifyAllRecords: false
			viewAllRecords: false 
		admin:
			allowCreate: true
			allowDelete: true
			allowEdit: true
			allowRead: true
			modifyAllRecords: true
			viewAllRecords: true 