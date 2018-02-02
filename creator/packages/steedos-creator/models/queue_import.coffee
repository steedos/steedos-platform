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
		# import_action:
		# 	label:"导入目的"
		# 	type:"select"
		# 	options:[
		# 		{label:"新增",value:"new"},
		# 		{label:"更新",value:"update"},
		# 		{label:"新增并修改",value:"upsert"}]
		# match_field:
		# 	label:"匹配方式"
		# 	type:"text"
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
		state:
			label:"状态"
			#allowvalue: 待导入、导入中、导入成功、导入失败
			omit:true
		error:
			label:"错误信息"
			type:["text"]
			omit:true
	list_views:
		default:
			columns: ["object_name","encoding","field_mapping"]
		all:
			label: "所有导入队列"
			filter_scope: "space"
		waitting:
			label: "待执行"
			filter_scope: "space"
			filters: [["state", "$eq", "waitting"]]
		finished:
			label: "已完成"
			columns: ["object_name","encoding","field_mapping","start_time","success_count","failure_count","error"]
			filter_scope: "space"
			filters: [["state", "$eq", "finished"]]
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
	triggers:
		"before.insert.client.import": 
			on: "client"
			when: "before.insert"
			todo: (userId, doc)->
				obj = Creator.getObject()
				doc.status = "waitting"
				doc.object_name = obj.name
	actions:
		import:
			label: "执行导入"
			visible: true
			on: "record"
			todo:(object_name, record_id, fields)->
				if Session.get("list_view_id") == "waitting"
					importObj = Creator.Collections["queue_import"].findOne({_id:record_id})
					Meteor.call 'startImportJobs',importObj
					importInfo = Creator.Collections["queue_import"].findOne({_id:record_id},{fields:{total_count:1,success_count:1}})
					console.log 
					swal(text)
				else
					swal("请在待执行视图下执行导入")