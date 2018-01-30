Creator.Objects.queue_import = 
	name: "queue_import"
	label: "导入队列"
	icon: "report"

	fields:
		import_file: 
			label: "导入文件"
			type: "textarea"
			is_wide:true
			required:true
		encoding:
			label: "字符代码"
			type: "select"
			defaultValue: "GB2312"
			options: [
				{label: "GB2312 简体中文", value: "GB2312"},
				{label: "Unicode (UTF8)", value: "UTF8"},
				{label: "Unicode (UTF16)", value: "UTF16"},
				{label: "Big5 繁体中文", value: "Big5"},
				{label: "Big5 繁体中文 (HKSCS)", value: "HKSCS"},
				{label: "Windows 日语", value: "Windows 日语"},
				{label: "日文 (Shift_JIS-2004)", value: "Shift_JIS-2004"},
				{label: "KS C 5601 韩语", value: "KS C 5601"},
				{label: "ISO-8859-1（通用美语和西欧语言，ISO-LATIN-1）", value: "ISO"}
			]
		value_separator: 
			label: "值分隔符"
			type: "select"
			options:[
				{label:'逗号',value:','}
			]
			required: true
		object_name:
			label: "导入对象"
			type: "text"
			omit:true
		field_mapping: 
			label: "映射关系"
			type: ["text"]
			required:true
		success_count:
			label:"成功个数"
			type:"number"
			omit:true
		failure_count:
			label:"失败个数"
			type:"number"
			omit:true
		total_count:
			label:"导入总个数"
			type:"number"
			omit:true
		start_time:
			label:'开始导入时间'
			type:"datetime"
			omit:true
		end_time:
			label:'end_time'
			type:"datetime"
			omit:true
		status:
			label:"状态"
			#allowvalue: 待导入、导入中、导入成功、导入失败
			omit:true
	list_views:
		default:
			columns: ["import_file", "encoding", "object_name","field_mapping"]
		recent:
			label: "最近查看"
			filter_scope: "space"
		all:
			label: "所有导入队列"
			filter_scope: "space"
		mine:
			label: "我的导入队列"
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
			modifyAllRecords: true
			viewAllRecords: true 
	triggers:
		"before.insert.client.import": 
			on: "client"
			when: "before.insert"
			todo: (userId, doc)->
				obj = Creator.getObject()
				doc.status = "waitting"
				doc.object_name = obj.name