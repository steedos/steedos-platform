Creator.Objects.queue_import = 
	name: "queue_import"
	label: "数据导入"
	icon: "report"
	enable_files:true
	fields:
		description: 
			label: "导入描述"
			type: "text"
			is_wide:true
			required:true
			is_name:true
		object_name:
			label: "导入对象"
			type: "lookup"
			optionsFunction: ()->
				_options = []
				_.forEach Creator.Objects, (o, k)->
					_options.push {label: o.label, value: k, icon: o.icon}
				return _options
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
			omit:true
		value_separator: 
			label: "值分隔符"
			type: "select"
			options:[
				{label:'逗号',value:','}
			]
			omit:true
		field_mapping: 
			label: "映射关系"
			type: "lookup"
			multiple: true
			depend_on: ["object_name"]
			defaultIcon: "service_contract"
			optionsFunction: (values)->
				return Creator.getObjectLookupFieldOptions values?.object_name, true
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
			label:'开始时间'
			type:"datetime"
			omit:true
		end_time:
			label:'结束时间'
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
		all:
			label: "所有导入队列"
			columns: ["object_name","encoding","field_mapping","description"]
			filter_scope: "space"
		waitting:
			label: "待执行"
			columns: ["description","object_name","encoding","field_mapping","created"]
			filter_scope: "space"
			filters: [["state", "=", "waitting"]]
		finished:
			label: "已完成"
			columns: ["object_name","encoding","field_mapping","start_time","success_count","failure_count","error"]
			filter_scope: "space"
			filters: [["state", "=", "finished"]]
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
				#obj = Creator.getObject()
				doc.state = "waitting"
				console.log doc
	actions:
		import:
			label: "执行导入"
			visible: true
			on: "record"
			todo:(object_name, record_id, fields)->
				space = Session.get("spaceId")
				Meteor.call 'startImportJobs',record_id,space